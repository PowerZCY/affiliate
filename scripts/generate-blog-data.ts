import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { appConfig } from '../src/lib/appConfig';
import { BlogData } from '../src/types/blog-data';

// 添加日志写入函数
async function appendLog(message: string) {
  const logPath = path.join(process.cwd(), 'scripts', 'mdmeta-check.log');
  await fs.appendFile(logPath, message + '\n');
}

// 处理单个文件的所有验证
async function validateMarkdownFile(filePath: string, locale: string) {
  const content = await fs.readFile(filePath, 'utf8');
  const { data, content: markdown } = matter(content);
  const slug = path.parse(filePath).name;
  const logs: string[] = [];

  logs.push(`\n=== Processing [${locale}::${slug}] ===`);

  // 1. 验证图片
  const imageUrl = await validateImagePath(data.imageUrl, 'post', locale, slug);
  const avatar = await validateImagePath(data.author?.avatar, 'avatar', locale, slug);

  // 2. 验证标签
  const tags = validateAndReplaceTags(
    Array.isArray(data.tags) ? data.tags : [data.tags || 'unknown']
  );

  // 3. 计算阅读时间
  const wordCount = markdown.trim().split(/\s+/).length;
  const imageCount = (markdown.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const readTime = Math.ceil(wordCount / 200 + (imageCount * 12) / 60);

  // 写入日志
  await appendLog(logs.join('\n'));

  return {
    id: '',  // 稍后在外部设置
    title: data.title,
    slug,
    excerpt: data.excerpt,
    tags,
    author: {
      name: data.author.name,
      avatar
    },
    publishedAt: data.publishedAt,
    readTime: `${readTime} min`,
    imageUrl,
    featured: data.featured || false
  };
}

// 修改验证函数的日志处理
async function validateImagePath(imagePath: string | undefined, type: 'avatar' | 'post', locale: string, slug: string): Promise<string> {
  if (!imagePath) {
    await appendLog(`  ⚠️ [${locale}::${slug}]::${type === 'avatar' ? 'Avatar' : 'Post'} image not configured`);
    return type === 'avatar' ? appConfig.blog.images.defaultAvatar : appConfig.blog.images.default;
  }

  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));
    await fs.access(fullPath);
    return imagePath;
  } catch {
    const defaultPath = type === 'avatar' ? appConfig.blog.images.defaultAvatar : appConfig.blog.images.default;
    await appendLog(`  ⚠️ [${locale}::${slug}]::${type === 'avatar' ? 'Avatar' : 'Post'} image not found: ${imagePath}`);
    return defaultPath;
  }
}

function validateAndReplaceTags(originalTags: string[]): string[] {
  const validTags = appConfig.blog.tags;
  const tagCount = Array.isArray(originalTags) ? originalTags.length : 1;

  if (tagCount > validTags.length) {
    appendLog(`  ⚠️ Too many tags (${tagCount}), limiting to ${validTags.length}`);
    return validTags.slice(0, validTags.length);
  }

  const validUserTags = originalTags.filter(tag => validTags.includes(tag));

  if (validUserTags.length < tagCount) {
    const needMore = tagCount - validUserTags.length;
    const availableTags = validTags.filter(tag => !validUserTags.includes(tag));
    const additionalTags = availableTags.sort(() => Math.random() - 0.5).slice(0, needMore);
    const finalTags = [...validUserTags, ...additionalTags];

    const invalidTags = originalTags.filter(tag => !validTags.includes(tag));
    const replacements = invalidTags.map((tag, index) => `${tag} -> ${additionalTags[index]}`).join(', ');

    appendLog(`  ⚠️ Invalid tags replaced: ${replacements}`);

    return finalTags;
  }

  return validUserTags;
}

// 添加问题统计类型
type ValidationIssues = {
  imageIssues: Set<string>;
  tagIssues: Set<string>;
  totalFiles: number;
};

// 添加问题收集函数
async function collectIssues(filePath: string, locale: string, issues: ValidationIssues) {
  const content = await fs.readFile(filePath, 'utf8');
  const { data } = matter(content);
  const slug = path.parse(filePath).name;
  const fileId = `${locale}::${slug}`;
  issues.totalFiles++;

  // 检查图片问题：分别检查文章图片和头像图片
  try {
    if (!data.imageUrl) {
      issues.imageIssues.add(fileId);
    } else {
      const fullPath = path.join(process.cwd(), 'public', data.imageUrl.replace(/^\//, ''));
      await fs.access(fullPath);
    }
  } catch {
    issues.imageIssues.add(fileId);
  }

  try {
    if (!data.author?.avatar) {
      issues.imageIssues.add(fileId);
    } else {
      const fullPath = path.join(process.cwd(), 'public', data.author.avatar.replace(/^\//, ''));
      await fs.access(fullPath);
    }
  } catch {
    issues.imageIssues.add(fileId);
  }

  // 检查标签问题
  const tags = Array.isArray(data.tags) ? data.tags : [data.tags || 'unknown'];
  if (tags.some(tag => !appConfig.blog.tags.includes(tag))) {
    issues.tagIssues.add(fileId);
  }
}

async function generateBlogData() {
  const issues: ValidationIssues = {
    imageIssues: new Set(),
    tagIssues: new Set(),
    totalFiles: 0
  };

  // 清空或创建日志文件
  const logPath = path.join(process.cwd(), 'scripts', 'mdmeta-check.log');
  const startTime = new Date().toISOString();
  await fs.writeFile(logPath, `=== Markdown Metadata Check Log (${startTime}) ===\n`);

  const locales = appConfig.i18n.locales;
  const blogData: BlogData = {};

  // 先收集所有问题
  for (const locale of locales) {
    const postsDirectory = path.join(process.cwd(), appConfig.blog.dir, locale);
    try {
      await fs.access(postsDirectory);
      const files = await fs.readdir(postsDirectory);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      for (const file of mdFiles) {
        const filePath = path.join(postsDirectory, file);
        await collectIssues(filePath, locale, issues);
      }
    } catch {
      continue;
    }
  }

  // 写入问题概览
  const summary = [
    '\n=== Validation Summary ===',
    `Total Files Processed: ${issues.totalFiles}`,
    `Files with Image Issues: ${issues.imageIssues.size}`,
    `Files with Tag Issues: ${issues.tagIssues.size}`,
    '\nImage Issues in:',
    ...Array.from(issues.imageIssues).map(file => `  - ${file}`),
    '\nTag Issues in:',
    ...Array.from(issues.tagIssues).map(file => `  - ${file}`),
    '\n=== Detailed Logs Below ===\n'
  ].join('\n');

  await fs.appendFile(logPath, summary);

  // 输出控制台概览
  console.log('\n=== Markdown Metadata Validation Summary ===');
  console.log(`Total Files Processed: ${issues.totalFiles}`);
  console.log(`Files with Image Issues: ${issues.imageIssues.size}`);
  console.log(`Files with Tag Issues: ${issues.tagIssues.size}`);

  if (issues.imageIssues.size > 0 || issues.tagIssues.size > 0) {
    console.log('\n⚠️  Some files have validation issues.');
    console.log(`Please check the detailed log at: ${logPath}`);
  } else {
    console.log('\n✅ All files passed validation!');
  }

  // 继续处理博客数据生成
  for (const locale of locales) {
    await appendLog(`\n=== Processing locale: ${locale} ===`);
    const postsDirectory = path.join(process.cwd(), appConfig.blog.dir, locale);

    try {
      await fs.access(postsDirectory);
    } catch {
      await appendLog(`No markdown blog found for locale: ${locale}`);
      blogData[locale] = { posts: [], tags: [] };
      continue;
    }

    const files = await fs.readdir(postsDirectory);
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const posts = await Promise.all(
      mdFiles.map(async (file, index) => {
        const filePath = path.join(postsDirectory, file);
        const post = await validateMarkdownFile(filePath, locale);
        post.id = String(index + 1);
        return post;
      })
    );

    const tags = Array.from(new Set(posts.flatMap(post => post.tags)));
    blogData[locale] = {
      posts: posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
      tags
    };
  }

  await fs.writeFile(
    path.join(process.cwd(), appConfig.blog.config),
    JSON.stringify(blogData, null, 2)
  );
}

generateBlogData().catch(console.error);