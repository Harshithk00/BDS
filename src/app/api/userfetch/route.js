import { verifyToken } from '@/utils/jwt';
import { poolAuth } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' },{status:401});
  }
  try {
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' },{status:401})
    }
    
    const userId = decodedToken.username;
    const user = await fetchuser(userId);
    if (user == null){
        return NextResponse.json({ error: "Invalid user" },{status:401})

    }

    return NextResponse.json({ user:user },{status:200});

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' },{status:500});
  }
}

async function fetchuser(userId){
    const user = poolAuth.query('SELECT * FROM users WHERE userId = $1', [userId]);
    if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        console.log('User not found.');
        return null;
      }
}   
