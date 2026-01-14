// /app/api/login/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // Pastikan path ini benar

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Call Laravel backend login endpoint
    const backendResponse = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error('Backend login error:', backendData.message);
      return NextResponse.json({ 
        message: backendData.message || 'Email atau password salah.' 
      }, { status: 401 });
    }

    // If successful, return the token from Laravel
    if (backendData.token) {
      return NextResponse.json({ 
        message: 'Login berhasil',
        token: backendData.token 
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Login berhasil, tapi token tidak ditemukan.' }, { status: 200 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// Menangani metode HTTP lain selain POST
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}