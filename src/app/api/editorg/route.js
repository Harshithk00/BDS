import { verifyToken } from '@/utils/jwt';
import { poolAuth } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
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
    const {data} = await req.json();
    const chatHistory = await editorg(userId,data);
    
    return NextResponse.json({ message:"UPDATED" },{status:200});

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' },{status:500});
  }
}

async function editorg(userId,data) {
    
}