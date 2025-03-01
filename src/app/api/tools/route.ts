import { NextRequest, NextResponse } from 'next/server';
import { getToolList } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // 默认使用英文，中文才会在路径上带上zh参数
  const locale = searchParams.get('locale') || 'en';
  const category = searchParams.get('category') || '';
  
  console.log(`Fetching tools for category: ${locale}-${category}`);
  
  try {
    // 获取真实数据
    const tools = getToolList(category, locale);
    console.log(`Fetching ${tools.length} tools for category: ${locale}-${category}`);
    
    if (tools && tools.length > 0) {
      return NextResponse.json({ tools });
    }
    // 如果没有数据，返回空数组
    console.warn(`Fetching tools failed or empty tools for category: ${locale}-${category}`);
    return NextResponse.json({ tools: [] });
  } catch (error) {
    console.error(`Fetching tools failed for category: ${locale}-${category}`, error);
    // 出错时返回空数组
    return NextResponse.json({ tools: [] });
  }
}