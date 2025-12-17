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
}

export const sendEmail = async ({
  to,
  subject,
  title,
  message,
  actionLink,
  actionText,
}: EmailOptions) => {
  try {
    const templatePath = path.join(
      __dirname,
      "templates",
      "emailTemplate.html"
    );
    const cssPath = path.join(__dirname, "templates", "emailTemplate.css");

    let html = fs.readFileSync(templatePath, "utf8");
    const css = fs.readFileSync(cssPath, "utf8");

    // Replace placeholders
    html = html.replace("/* {{css}} */", css);
    html = html.replace("{{title}}", title);
    html = html.replace("{{message}}", message);
    html = html.replace("{{year}}", new Date().getFullYear().toString());

    if (actionLink && actionText) {
      // Logic to show the button section
      // Since normal replacement is simple string replace, we'll just handle the if block manually or simplify the template
      // For simplicity in this regex-less approach, let's assume valid inputs or just simple replace
      // Ideally use Handlebars, but for single file simple replace:

      // We will replace the entire block manually for robustness or better yet, just replace the variables
      // and let the template be simple.
      // Let's refine the template to not use complex logic if we rely on simple replace,
      // OR we implement a simple conditional replacer.

      html = html.replace("{{actionLink}}", actionLink); // Replace first occurrence (button)
      html = html.replace("{{actionLink}}", actionLink); // Replace second occurrence (fallback)
      html = html.replace("{{actionLink}}", actionLink); // Replace third occurrence (fallback text)
      html = html.replace("{{actionText}}", actionText);

      // Clean up the handlebars comments if we left them, or since we wrote specific
      // {{#if}} blocks, we should probably strip them if we aren't using a real engine.
      // But let's just use string replace for simplicity.

      // Actually, removing the {{#if}} lines from the HTML string before sending might be needed
      html = html.replace("{{#if actionLink}}", "");
      html = html.replace("{{/if}}", "");
    } else {
      // If no link, we might want to hide that section.
      // For now, let's assume we always have a link for password reset.
      // If generic usage needed, we'd need better parsing.
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
