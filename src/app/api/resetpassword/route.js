import pool from '@/db'; // Assuming @/db is configured in jsconfig.json or tsconfig.json
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const userResult = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePasswordQuery = `
      UPDATE users
      SET password = $1
      WHERE email = $2;
    `;
    await pool.query(updatePasswordQuery, [hashedPassword, email]);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}