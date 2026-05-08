import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

export async function GET() {
  // If no backend URL configured, we're in demo mode - still return healthy
  if (!BACKEND_URL) {
    return NextResponse.json({ 
      status: 'healthy',
      mode: 'demo',
      message: 'Running in demo mode'
    })
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ ...data, mode: 'live' })
    }

    return NextResponse.json({ 
      status: 'healthy',
      mode: 'demo',
      message: 'Backend unavailable - running in demo mode'
    })
  } catch {
    return NextResponse.json({ 
      status: 'healthy',
      mode: 'demo',
      message: 'Backend unavailable - running in demo mode'
    })
  }
}
