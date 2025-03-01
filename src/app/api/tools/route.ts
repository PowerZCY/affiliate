import { NextRequest, NextResponse } from 'next/server';
import { getToolList } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // 从 URL 参数获取语言，如果没有则尝试从请求头获取
  let locale = searchParams.get('locale');
  
  // 如果 URL 参数中没有语言设置，则从请求路径中提取
  if (!locale) {
    // 从请求路径中提取语言信息
    const pathParts = request.nextUrl.pathname.split('/');
    // 检查路径中是否包含语言代码 (通常是 /api 之后的第一个部分)
    if (pathParts.length > 1) {
      // 检查请求头中的 Accept-Language
      const acceptLanguage = request.headers.get('Accept-Language') || '';
      if (acceptLanguage.includes('zh')) {
        locale = 'zh';
      }
    }
  }
  
  // 如果仍然没有获取到语言设置，则使用默认值
  locale = locale || 'en';

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