import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL

// Demo responses for when no backend is configured
const demoResponses: Record<string, { response: string; sources: string[] }> = {
  default: {
    response: `Based on current social media trends analysis:

**Key Insights:**
1. **AI and Technology** - Discussions around AI tools continue to dominate, with a 45% increase in mentions over the past week.
2. **Sustainability** - Environmental topics are seeing renewed interest, particularly around corporate sustainability initiatives.
3. **Remote Work** - Hybrid work discussions remain steady with focus shifting to productivity tools.

**Sentiment Analysis:**
- Overall sentiment is predominantly positive (62%)
- Neutral mentions account for 28%
- Negative sentiment at 10%, mostly related to economic concerns

**Recommendation:** Focus content strategy on AI integration stories and sustainability initiatives for maximum engagement.`,
    sources: [
      'Twitter Trends API - Real-time data',
      'Reddit r/technology - Top posts analysis',
      'LinkedIn Pulse - Industry insights',
      'Google Trends - Search volume data',
    ],
  },
}

function getDemoResponse(query: string): { response: string; sources: string[] } {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('trend') || lowerQuery.includes('popular')) {
    return {
      response: `**Current Trending Topics (Demo Mode):**

1. **#AIRevolution** - 2.3M mentions, trending in Tech
2. **#ClimateAction** - 1.8M mentions, trending globally  
3. **#RemoteWork2024** - 950K mentions, trending in Business
4. **#CryptoMarkets** - 720K mentions, trending in Finance
5. **#MentalHealthAwareness** - 680K mentions, trending in Lifestyle

These trends show a strong focus on technology adoption, environmental consciousness, and work-life balance discussions across platforms.`,
      sources: ['Demo Data - Twitter Trends', 'Demo Data - Google Trends', 'Demo Data - Reddit Analytics'],
    }
  }
  
  if (lowerQuery.includes('sentiment') || lowerQuery.includes('feeling')) {
    return {
      response: `**Sentiment Analysis Results (Demo Mode):**

📊 **Overall Market Sentiment:**
- Positive: 58%
- Neutral: 30%  
- Negative: 12%

📈 **By Platform:**
- Twitter: Slightly negative (-0.12 score) due to political discussions
- LinkedIn: Strongly positive (+0.67 score) with job market optimism
- Reddit: Mixed sentiment (+0.23 score) varying by subreddit

📉 **Key Drivers:**
- Positive: Tech earnings, job growth reports
- Negative: Inflation concerns, geopolitical tensions`,
      sources: ['Demo Data - Sentiment API', 'Demo Data - NLP Analysis'],
    }
  }

  return demoResponses.default
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const query = body.text || body.query || ''

    // If no backend URL is configured, return demo response
    if (!BACKEND_URL) {
      const demoResponse = getDemoResponse(query)
      return NextResponse.json({
        response: demoResponse.response + '\n\n---\n*Note: Running in demo mode. Connect a backend for live trend analysis.*',
        sources: demoResponse.sources,
      })
    }

    // Try to connect to the real backend
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    try {
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json(
          { error: data.error || 'Backend request failed' },
          { status: response.status }
        )
      }

      return NextResponse.json(data)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      // If backend fails, fall back to demo mode
      const demoResponse = getDemoResponse(query)
      return NextResponse.json({
        response: demoResponse.response + '\n\n---\n*Note: Backend unavailable. Showing demo response.*',
        sources: demoResponse.sources,
      })
    }
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
