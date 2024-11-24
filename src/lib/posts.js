import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

// 获取GitHub仓库内容的函数
async function fetchGitHubContent(path) {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    next: { revalidate: 60 } // 每60秒重新验证数据
  })

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败: ${response.statusText}`)
  }

  return response.json()
}

// 修改为异步函数
export async function getSortedPostsData() {
  try {
    // 从GitHub获取/data/md目录下的所有文件
    const files = await fetchGitHubContent('data/md')
    
    // 获取每个md文件的内容
    const allPostsData = await Promise.all(
      files.map(async (file) => {
        // 只处理.md文件
        if (!file.name.endsWith('.md')) {
          return null
        }

        // 获取文件内容
        const response = await fetch(file.download_url)
        const content = await response.text()

        // 使用gray-matter解析文件内容
        const matterResult = matter(content)

        return {
          id: file.name.replace(/\.md$/, ''),
          title: matterResult.data.title,
          description: matterResult.data.description,
          date: matterResult.data.date,
        }
      })
    )

    // 过滤掉非md文件并按日期排序
    return allPostsData
      .filter(Boolean)
      .sort((a, b) => {
        if (a.date < b.date) {
          return 1
        } else {
          return -1
        }
      })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return []
  }
}

// 修改获取单篇文章的函数
export async function getPostData(id) {
  try {
    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO
    const token = process.env.GITHUB_TOKEN

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/data/md/${id}.md`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`GitHub API 请求失败: ${response.statusText}`)
    }

    const data = await response.json()
    const content = Buffer.from(data.content, 'base64').toString('utf8')
    const matterResult = matter(content)

    // 将 Markdown 转换为 HTML
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)

    return {
      id,
      contentHtml: processedContent.toString(),
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: matterResult.data.date,
    }
  } catch (error) {
    console.error(`获取文章 ${id} 失败:`, error)
    throw error
  }
}

export async function getPostData2(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}