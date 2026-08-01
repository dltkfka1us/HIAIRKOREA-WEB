import { NextResponse } from 'next/server';
import { getKoshaRealtimeNews } from '@/lib/services/kosha.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const news = await getKoshaRealtimeNews();
    return NextResponse.json({ success: true, data: news });
  } catch (e) {
    console.error("API /api/news error:", e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
