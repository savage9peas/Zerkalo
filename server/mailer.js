import nodemailer from "nodemailer";

function env(name, fallback = "") {
  return String(process.env[name] ?? fallback).trim();
}

const SMTP_HOST = env("SMTP_HOST");
const SMTP_PORT = Number(env("SMTP_PORT", "465"));
const SMTP_SECURE = env("SMTP_SECURE", "true") === "true";
const SMTP_USER = env("SMTP_USER");
const SMTP_PASS = env("SMTP_PASS");
const SMTP_FROM = env("SMTP_FROM", SMTP_USER);
const ADMIN_EMAIL = env("ADMIN_EMAIL", SMTP_USER);

let transporter;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP не настроен в .env");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
}

export async function sendOrderPaidEmails(order) {
  const mailer = getTransporter();

  const orderId = String(order?.id ?? "");
  const customerName = String(order?.name ?? "Покупатель").trim();
  const customerEmail = String(order?.email ?? "").trim();
  const customerPhone = String(order?.phone ?? "").trim();
  const pickupAddress = String(order?.pickup_address ?? "").trim();
  const amount = Number(order?.amount ?? 0);

  const clientText = [
    `Здравствуйте, ${customerName}!`,
    "",
    "Ваш заказ успешно оплачен.",
    `Номер заказа: ${orderId}`,
    `Сумма: ${amount} ₽`,
    `Пункт выдачи: ${pickupAddress || "не указан"}`,
    "",
    "Спасибо за покупку.",
  ].join("\n");

  const adminText = [
    "Новый оплаченный заказ.",
    "",
    `Заказ: ${orderId}`,
    `Имя: ${customerName}`,
    `Телефон: ${customerPhone}`,
    `Email: ${customerEmail || "не указан"}`,
    `Сумма: ${amount} ₽`,
    `ПВЗ: ${pickupAddress || "не указан"}`,
  ].join("\n");

  const jobs = [];

  if (customerEmail) {
    jobs.push(
      mailer.sendMail({
        from: SMTP_FROM,
        to: customerEmail,
        subject: `Ваш заказ ${orderId} оплачен`,
        text: clientText,
      })
    );
  }

  if (ADMIN_EMAIL) {
    jobs.push(
      mailer.sendMail({
        from: SMTP_FROM,
        to: ADMIN_EMAIL,
        subject: `Новый оплаченный заказ ${orderId}`,
        text: adminText,
      })
    );
  }

  await Promise.all(jobs);
}