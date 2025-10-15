require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ORDERS_FILE = path.join(__dirname, 'orders.json');

function saveOrderToFile(order) {
  let arr = [];
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
      arr = raw ? JSON.parse(raw) : [];
    }
  } catch (e) {
    console.error('Could not read orders file', e);
    arr = [];
  }
  arr.push(order);
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(arr, null, 2));
  } catch (e) {
    console.error('Could not write orders file', e);
  }
}

app.post('/order', async (req, res) => {
  const { name, company, email, phone, product, quantity, specifications } = req.body;
  if (!name || !email || !product || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const order = {
    id: Date.now().toString(),
    name, company, email, phone, product, quantity, specifications,
    createdAt: new Date().toISOString()
  };

  try {
    // Save locally
    saveOrderToFile(order);

    // Send email notification if enabled
    if (process.env.EMAIL_NOTIFY === 'true') {
      // Support for Outlook SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.office365.com',
        port: Number(process.env.MAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: process.env.NOTIFY_EMAIL || process.env.MAIL_USER,
        subject: `New order received from ${name}`,
        text: `New order details:\n\n${JSON.stringify(order, null, 2)}`
      };

      await transporter.sendMail(mailOptions);
    }

    return res.json({ success: true, message: 'Order received' });
  } catch (err) {
    console.error('Order error:', err);
    return res.status(500).json({ success: false, message: 'Could not process order' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
