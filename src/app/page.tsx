// pages/index.js
import fs from 'fs'
import path from 'path'
import { getSortedPostsData } from '@/lib/posts'
import ResourceList from '@/components/ResourceList'
import ArticleList from '@/components/ArticleList'
import ArticleList2 from '@/components/ArticleList2'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NHC Health Science | Humorous Popular Science on Health',  // NHC Health Science | Humorous and Informative Health Science Articles and Knowledge  NHC Health Science | Humorous Health Science Insights
  description: 'Explore NHC Health Science for fun, popular science articles on health. Enjoy humorous tips that make learning about health easy for everyone!',
}

// 设置首页-Home的元数据
export default async function Home() {
  const resourcesPath = path.join(process.cwd(), 'data', 'json', 'resources.json')
  const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
  const allPostsData = await getSortedPostsData()
  const recentPosts = allPostsData.slice(0, 6)

  return (
    <div className="container mx-auto py-12 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          NHC Health Science
        </h1>
        <h2 className="text-2xl tracking-tighter sm:text-3xl md:text-3xl lg:text-3xl">Understanding Health Science: Fun Facts and Insights</h2>
        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
          This authoritative health science website provides knowledge for all ages through a humorous and easy-to-understand approach to important health topics.
        </p>
      </section>

      {/* <ResourceList resources={resources} /> */}
      {/* <ArticleList articles={allPostsData} /> */}

      <ArticleList2 articles={recentPosts} />
    </div>
  )
}