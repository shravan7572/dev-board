const axios = require("axios");

async function sendEmail({ to, replyTo, subject, html }) {
    const api_key = process.env.BERVO_API_KEY;
    const email_user = process.env.EMAIL_USER || "shravan.mac31@gmail.com";

    if (!api_key) {
        console.warn("⚠️ [WARNING] BERVO_API_KEY environment variable is missing!");
        return;
    }

    const payload = {
        sender: {
            name: "DevBoard",
            email: email_user
        },
        to: [
            {
                email: to
            }
        ],
        subject: subject,
        htmlContent: html
    };

    if (replyTo) {
        payload.replyTo = {
            email: replyTo
        };
    }

    try {
        const response = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
            headers: {
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json"
            }
        });
        return response.data;
    } catch (err) {
        console.error("❌ Brevo API sendEmail error:", err.response?.data || err.message);
        throw err;
    }
}

module.exports = { sendEmail };