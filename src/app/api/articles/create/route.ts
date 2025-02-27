import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
import { appConfig } from "@/lib/appConfig";

const octokit = new Octokit({
  auth: appConfig.github.token
});

const owner = appConfig.github.owner;
const repo = appConfig.github.repo;
const articlesJsonPath = 'data/json/articles.json';
const mdFolderPath = 'data/md';

interface GitHubFile {
  type: "file" | "dir" | "submodule" | "symlink";
  size: number;
  name: string;
  path: string;
  content?: string;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url: string | null;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export async function POST(request: NextRequest) {
  const { title, description, content, slug } = await request.json();

  // Validate slug
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 });
  }

  const path = `data/md/${slug}.md`;

  try {
    // Check if file already exists
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path,
      }) as { data: GitHubFile };
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 400 });
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create new file
    const fileContent = matter.stringify(content, {
      title,
      description,
      date: new Date().toISOString(),
    });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Create new article: ${title}`,
      content: Buffer.from(fileContent).toString('base64'),
    });

    // Sync articles
    await syncArticles();

    return NextResponse.json({ message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}


async function syncArticles() {
  try {
    // Fetch all MD files
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path: mdFolderPath,
    }) as { data: GitHubFile[] };

    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    const articles = await Promise.all(mdFiles.map(async file => {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
      }) as { data: GitHubFile };

      const content = Buffer.from(data.content || '', 'base64').toString('utf8');
      const { data: frontMatter, content: articleContent } = matter(content);

      // Fetch the last commit for this file
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        path: file.path,
        per_page: 1
      }) as { data: any[] };

      const lastModified = commits[0]?.commit.committer.date || data.sha;

      return {
        title: frontMatter.title,
        description: frontMatter.description,
        date: frontMatter.date,
        lastModified: lastModified,
        path: file.path,
      };
    }));

    // Update articles.json
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    }) as { data: GitHubFile };

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: articlesJsonPath,
      message: 'Sync articles',
      content: Buffer.from(JSON.stringify(articles, null, 2)).toString('base64'),
      sha: currentFile.sha,
    });

  } catch (error) {
    console.error('Error syncing articles:', error);
    throw error;
  }
}