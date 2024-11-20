import pool from '@/db';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Only PATCH requests allowed' });
  }

  const { id, name, email, phone_no, blood_type, donated } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const checkQuery = `
      SELECT id FROM donors WHERE id = $1;
    `;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateFields = [];
    const updateValues = [];
    let fieldIndex = 1;

    if (name) {
      updateFields.push(`name = ${fieldIndex}`);
      updateValues.push(name);
      fieldIndex++;
    }

    if (email) {
      updateFields.push(`email = ${fieldIndex}`);
      updateValues.push(email);
      fieldIndex++;
    }

    if (phone_no) {
      updateFields.push(`phone_no = ${fieldIndex}`);
      updateValues.push(phone_no);
      fieldIndex++;
    }

    if (blood_type) {
      updateFields.push(`blood_type = ${fieldIndex}`);
      updateValues.push(blood_type);
      fieldIndex++;
    }

    if (donated) {
      updateFields.push(`donated = ${fieldIndex}`);
      updateValues.push(donated);
      fieldIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updateQuery = `
      UPDATE donors
      SET ${updateFields.join(', ')}
      WHERE id = $${fieldIndex};
    `;
    
    updateValues.push(id);

    const updateResult = await pool.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
}