import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json(
      { status: 'unhealthy', error: 'Backend not responding' },
      { status: 503 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Cannot connect to backend' },
      { status: 503 }
    )
  }
}
