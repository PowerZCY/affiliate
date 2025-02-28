import { NextRequest, NextResponse } from 'next/server';
import { getToolList } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  
  if (!category) {
    return NextResponse.json({ error: '缺少分类参数' }, { status: 400 });
  }
  
  try {
    // 获取工具列表，使用默认语言
    const tools = getToolList(category, 'zh');
    
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('获取工具列表失败:', error);
    return NextResponse.json({ error: '获取工具列表失败' }, { status: 500 });
  }
} 