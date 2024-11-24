import ArticleList from '@/components/ArticleList'
import ArticleList2 from '@/components/ArticleList2'
import { getSortedPostsData } from '@/lib/posts';

// 设置Articles页面元数据
export const metadata = {
  title: 'Articles',
  description: 'Read our latest articles on web development, GitHub tips, and best practices.',
};

export default async function Articles() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="container mx-auto py-12">
      <ArticleList2 articles={allPostsData} showMoreLink={false} />
    </div>
  )
}

