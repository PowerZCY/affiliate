import { searchToolByKeyword } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') || '';
  const locale = searchParams.get('locale') || 'en';

  try {
    const results = searchToolByKeyword(keyword, locale);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search tools' },
      { status: 500 }
    );
  }
} 