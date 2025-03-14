import { getCategoryMetaList, getToolList } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = searchParams.get('locale') || 'en';

  try {
    // 获取所有分类
    const categories = getCategoryMetaList(locale);
    
    // 获取所有有src属性的分类
    const categoriesWithSrc = categories.filter(c => c.src);
    
    if (categoriesWithSrc.length === 0) {
      return NextResponse.json({ tools: [] });
    }
    
    // 获取每个分类的工具
    const allTools = [];
    
    for (const category of categoriesWithSrc) {
      if (category.src) {
        const tools = getToolList(category.src, locale);
        // 为工具添加分类标识
        const toolsWithCategory = tools.map(tool => ({
          ...tool,
          category: category.name
        }));
        allTools.push(...toolsWithCategory);
      }
    }
    
    // 去除重复项并排序（优先按 traffic 降序，相同时按 id 升序）
    const uniqueTools = allTools
      .filter((tool, index, self) => 
        index === self.findIndex(t => t.id === tool.id)
      )
      .sort((a, b) => {
        // 先按 traffic 降序
        const trafficDiff = (b.traffic || 0) - (a.traffic || 0);
        // traffic 相同时按 id 升序
        return trafficDiff !== 0 ? trafficDiff : Number(a.id) - Number(b.id);
      });
    
    return NextResponse.json({ tools: uniqueTools });
  } catch (error) {
    console.error('All tools API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all tools' },
      { status: 500 }
    );
  }
}