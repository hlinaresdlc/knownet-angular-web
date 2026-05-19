import pkg from 'pg';
import nodemailer from 'nodemailer';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export default async function handler(req, res) {

  try {

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

    const body = typeof req.body === 'string'
      ? JSON.parse(req.body)
      : req.body;

    const {
      name,
      email,
      company,
      message
    } = body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Campos obligatorios faltantes'
      });
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150),
        email VARCHAR(200),
        company VARCHAR(200),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(
      `
      INSERT INTO contact_leads
      (name, email, company, message)
      VALUES ($1, $2, $3, $4)
      `,
      [name, email, company || '', message]
    );

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Nuevo contacto KnowNet - ${name}`,
      html: `
        <h2>Nuevo contacto</h2>

        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || '-'}</p>
        <p><strong>Mensaje:</strong></p>

        <p>${message}</p>
      `
    });

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    console.error('ERROR API CONTACT:', error);

    return res.status(500).json({
      error: error.message
    });
  }
}
