import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { all, get, initDb, run } from "./db.js";
import { validateOrderBody } from "./orderValidation.js";
import { isValidOrderStatus, ORDER_STATUSES } from "./orderStatuses.js";
import { sendOrderPaidEmails } from "./mailer.js";

const app = express();
const PORT = process.env.PORT || 4000;

console.log("APP_BASE_URL:", process.env.APP_BASE_URL);
console.log("YOOKASSA_SHOP_ID exists:", Boolean(process.env.YOOKASSA_SHOP_ID));
console.log("YOOKASSA_SECRET_KEY exists:", Boolean(process.env.YOOKASSA_SECRET_KEY));
console.log("SMTP_HOST exists:", Boolean(process.env.SMTP_HOST));
console.log("SMTP_USER exists:", Boolean(process.env.SMTP_USER));
console.log("SMTP_PASS exists:", Boolean(process.env.SMTP_PASS));

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

function getRequiredEnv(name) {
  return String(process.env[name] ?? "").trim();
}

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

app.post("/api/payment/create", async (req, res) => {
  try {
    console.log("payment/create body:", req.body);

    const orderId = String(req.body?.orderId ?? "").trim();
    if (!orderId) {
      return res.status(400).json({ error: "Укажите orderId." });
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
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: "Заказ не найден." });
    }

    const shopId = getRequiredEnv("YOOKASSA_SHOP_ID");
    const secretKey = getRequiredEnv("YOOKASSA_SECRET_KEY");
    const appBaseUrl = getRequiredEnv("APP_BASE_URL");

    if (!shopId || !secretKey || !appBaseUrl) {
      return res.status(500).json({
        error: "Не заданы YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY или APP_BASE_URL в .env",
      });
    }

    if (order.payment_id) {
      return res.status(200).json({
        orderId: order.id,
        paymentId: String(order.payment_id),
        status: String(order.status ?? ""),
        paymentUrl: null,
        message: "Платеж уже создан для этого заказа.",
      });
    }

    const numericAmount = Number(order.amount ?? 0);
    const amountValue =
      Number.isFinite(numericAmount) && numericAmount > 0
        ? numericAmount.toFixed(2)
        : "1.00";

    const idempotenceKey = crypto.randomUUID();

    const yookassaResponse = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify({
        amount: {
          value: amountValue,
          currency: "RUB",
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${appBaseUrl}/payment/return?orderId=${encodeURIComponent(order.id)}`,
        },
        description: `Заказ ${order.id}`,
        metadata: {
          orderId: order.id,
          customerName: String(order.name ?? ""),
          customerPhone: String(order.phone ?? ""),
          customerEmail: String(order.email ?? ""),
        },
      }),
    });

    const payment = await yookassaResponse.json().catch(() => ({}));

    if (!yookassaResponse.ok) {
      console.error("YuKassa create payment error:", payment);
      return res.status(500).json({
        error: "Не удалось создать платеж в ЮKassa",
        details: payment,
      });
    }

    const paymentId = String(payment?.id ?? "").trim();
    const paymentStatus = String(payment?.status ?? "").trim();
    const confirmationUrl = String(payment?.confirmation?.confirmation_url ?? "").trim();

    if (!paymentId || !confirmationUrl) {
      console.error("YuKassa invalid payment response:", payment);
      return res.status(500).json({
        error: "ЮKassa не вернула paymentId или confirmation_url",
        details: payment,
      });
    }

    const updateResult = run(
      `UPDATE orders
       SET status = ?, payment_id = ?
       WHERE id = ?`,
      ["pending_payment", paymentId, order.id]
    );

    if (!updateResult || updateResult.changes === 0) {
      return res.status(500).json({ error: "Не удалось сохранить payment_id в заказе" });
    }

    return res.status(200).json({
      orderId: order.id,
      paymentId,
      status: paymentStatus,
      paymentUrl: confirmationUrl,
    });
  } catch (error) {
    console.error("Failed to create payment:", error);
    return res.status(500).json({ message: "Failed to create payment" });
  }
});

app.post("/api/yookassa/webhook", (req, res) => {
  try {
    const event = String(req.body?.event ?? "");
    const paymentObject = req.body?.object ?? {};
    const paymentId = String(paymentObject?.id ?? "").trim();

    if (!paymentId) {
      return res.sendStatus(400);
    }

    if (event === "payment.succeeded") {
      run(
        `UPDATE orders
         SET status = ?, paid_at = ?
         WHERE payment_id = ?`,
        ["paid", new Date().toISOString(), paymentId]
      );

      const paidOrder = get(
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
        WHERE payment_id = ?`,
        [paymentId]
      );

      sendOrderPaidEmails(paidOrder).catch((err) => {
        console.error("Failed to send order paid emails:", err);
      });
    }

    if (event === "payment.canceled") {
      run(
        `UPDATE orders
         SET status = ?
         WHERE payment_id = ?`,
        ["payment_canceled", paymentId]
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("YuKassa webhook error:", error);
    return res.sendStatus(500);
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
    webhookRouteMounted: "/api/yookassa/webhook",
    post: [
      "POST /api/order",
      "POST /api/payment/create",
      "POST /api/yookassa/webhook",
    ],
    get: ["GET /api/orders", "GET /api/debug/routes"],
    patch: ["PATCH /api/orders/:id/status"],
  });
});

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