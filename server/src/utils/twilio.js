import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const isDev = process.env.NODE_ENV !== "production";

const client = !isDev
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const sendSMS = async ({ to, body }) => {
  if (isDev) {
    console.log("[MOCK SMS]", { to, body });
    return { status: "mocked", to, body };
  }

  return await client.messages.create({
    body,
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
};

const sendWhatsApp = async ({ to, body }) => {
  if (isDev) {
    console.log("[MOCK WHATSAPP]", { to, body });
    return { status: "mocked", to, body };
  }

  return await client.messages.create({
    body,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
  });
};

export { sendSMS, sendWhatsApp };
