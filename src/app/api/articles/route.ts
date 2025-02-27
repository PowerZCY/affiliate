import { appConfig } from "@/lib/appConfig";
import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';
import { NextRequest, NextResponse } from 'next/server';

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


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sync = searchParams.get('sync');
  const path = searchParams.get('path');

  try {
    if (path) {
      // Fetch single article
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: decodeURIComponent(path),
        }) as { data: GitHubFile };

        const content = Buffer.from(data.content || '', 'base64').toString('utf8');
        const { data: frontMatter, content: articleContent } = matter(content);

        return NextResponse.json({
          ...frontMatter,
          content: articleContent,
          path: data.path,
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
      }
    } else if (sync === 'true') {
      await syncArticles();
    }

    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    }) as { data: GitHubFile };

    const content = Buffer.from(data.content || '', 'base64').toString('utf8');
    const articles = JSON.parse(content);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { article } = await request.json();

  try {
    // Update the MD file
    await updateMdFile(article);

    // Sync articles
    await syncArticles();

    return NextResponse.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
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

async function updateMdFile(article: any) {
  try {
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: article.path,
    }) as { data: GitHubFile };

    const currentContent = Buffer.from(currentFile.content || '', 'base64').toString('utf8');
    const { data: frontMatter, content: articleContent } = matter(currentContent);

    const updatedFrontMatter = {
      ...frontMatter,
      title: article.title,
      description: article.description,
      lastModified: new Date().toISOString(),
    };

    const updatedContent = matter.stringify(article.content, updatedFrontMatter);

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: article.path,
      message: `Update article: ${article.title}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: currentFile.sha,
    });

  } catch (error) {
    console.error('Error updating MD file:', error);
    throw error;
  }
}