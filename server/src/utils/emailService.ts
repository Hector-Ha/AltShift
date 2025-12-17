import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailOptions {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionLink?: string;
  actionText?: string;
  templateName?: string;
}

export const sendEmail = async (opts: EmailOptions) => {
  const { to, subject, title, message, actionLink, actionText } = opts;
  try {
    const templateName = opts.templateName || "emailTemplate.html";
    const templatePath = path.join(__dirname, "templates", templateName);
    const cssPath = path.join(__dirname, "templates", "emailTemplate.css");

    let html = fs.readFileSync(templatePath, "utf8");
    const css = fs.readFileSync(cssPath, "utf8");

    // Replace placeholders
    html = html.replace("/* {{css}} */", css);
    html = html.replace("{{title}}", title);
    html = html.replace("{{message}}", message);
    html = html.replace("{{year}}", new Date().getFullYear().toString());

    if (actionLink && actionText) {
      html = html.replace(/{{actionLink}}/g, actionLink);
      html = html.replace("{{actionText}}", actionText);

      html = html.replace("{{#if actionLink}}", "");
      html = html.replace("{{/if}}", "");
    }

    const msg = {
      to,
      from: process.env.SENDGRID_SENDER_EMAIL || "noreply@altshift.com",
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log("Email sent to:", to);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
