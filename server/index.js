import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { all, get, initDb, run } from "./db.js";
import { validateOrderBody } from "./orderValidation.js";
import { isValidOrderStatus, ORDER_STATUSES } from "./orderStatuses.js";

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../dist");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(distPath));

app.post("/api/order", (req, res) => {
  try {
    const validation = validateOrderBody(req.body);

    if (!validation.ok) {
      return res.status(400).json({
        error: validation.error,
        errors: validation.errors,
      });
    }

    const { name, phone, email, pickup_id, pickup_address, amount } = req.body;
    const parsedAmount = Number(amount);

    const order = {
      id: uuidv4(),
      name: String(name ?? "").trim(),
      phone: String(phone ?? "").trim(),
      email: String(email ?? "").trim(),
      pickup_id: String(pickup_id ?? "").trim(),
      pickup_address: String(pickup_address ?? "").trim(),
      amount: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      status: "draft",
      payment_id: null,
      paid_at: null,
      created_at: new Date().toISOString(),
    };

    run(
      `INSERT INTO orders (
        id,
        name,
        phone,
        email,
        pickup_id,
        pickup_address,
        amount,
        status,
        payment_id,
        paid_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        order.name,
        order.phone,
        order.email,
        order.pickup_id,
        order.pickup_address,
        order.amount,
        order.status,
        order.payment_id,
        order.paid_at,
        order.created_at,
      ]
    );

    return res.status(201).json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
});

app.get("/api/orders", (_req, res) => {
  try {
    const orders = all(
      `SELECT
        id,
        name,
        phone,
        email,
        pickup_id,
        pickup_address,
        amount,
        status,
        payment_id,
        paid_at,
        created_at
      FROM orders
      ORDER BY created_at DESC`
    );

    return res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

const PLACEHOLDER_PAYMENT_URL = "https://example.com/pay";

app.post("/api/payment/create", (req, res) => {
  try {
    console.log("payment/create body:", req.body);

    const orderId = String(req.body?.orderId ?? "").trim();
    if (!orderId) {
      return res.status(400).json({ error: "Укажите orderId." });
    }

    const existing = get(`SELECT id FROM orders WHERE id = ?`, [orderId]);
    console.log("order found:", existing);

    if (!existing) {
      return res.status(404).json({ error: "Заказ не найден." });
    }

    console.log("updating order to pending_payment:", orderId);

    const updateResult = run(`UPDATE orders SET status = ? WHERE id = ?`, [
      "pending_payment",
      orderId,
    ]);

    if (!updateResult || updateResult.changes === 0) {
      return res.status(500).json({ error: "Не удалось обновить статус заказа" });
    }

    const updated = get(
      `SELECT id, status, payment_id, paid_at FROM orders WHERE id = ?`,
      [orderId]
    );

    return res.status(200).json({
      orderId,
      status: String(updated?.status ?? ""),
      paymentUrl: PLACEHOLDER_PAYMENT_URL,
    });
  } catch (error) {
    console.error("Failed to create payment:", error);
    return res.status(500).json({ message: "Failed to create payment" });
  }
});

app.patch("/api/orders/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body ?? {};

    if (!isValidOrderStatus(status)) {
      return res.status(400).json({
        error: "Недопустимый статус заказа.",
        allowed: [...ORDER_STATUSES],
      });
    }

    const result = run(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Заказ не найден." });
    }

    const order = get(
      `SELECT
        id,
        name,
        phone,
        email,
        pickup_id,
        pickup_address,
        amount,
        status,
        payment_id,
        paid_at,
        created_at
      FROM orders
      WHERE id = ?`,
      [id]
    );

    return res.json(order);
  } catch (error) {
    console.error("Failed to update order status:", error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
});

app.get("/api/debug/routes", (_req, res) => {
  return res.json({
    paymentRouteMounted: "/api/payment/create",
    post: ["POST /api/order", "POST /api/payment/create"],
    get: ["GET /api/orders", "GET /api/debug/routes"],
    patch: ["PATCH /api/orders/:id/status"],
  });
});

// SPA fallback: всё, что не /api, отдаём как index.html
app.get(/^(?!\/api).*/, (_req, res) => {
  return res.sendFile(path.join(distPath, "index.html"));
});

try {
  initDb();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("payment route mounted");
    console.log(`Serving frontend from: ${distPath}`);
  });
} catch (error) {
  console.error("Failed to initialize database:", error);
  process.exit(1);
}