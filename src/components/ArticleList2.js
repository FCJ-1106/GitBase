// components/ArticleList.js
'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ArticleList2({ articles, showMoreLink = true }) {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 6
  
  // 计算总页数
  const totalPages = Math.ceil(articles.length / articlesPerPage)
  
  // 获取当前页的文章
  const getCurrentPageArticles = () => {
    const startIndex = (currentPage - 1) * articlesPerPage
    const endIndex = startIndex + articlesPerPage
    return articles.slice(startIndex, endIndex)
  }

  // 处理页面变化
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section>
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-20">
        {/* Component */}
        <h2 className="text-3xl font-bold tracking-tighter mb-4 sm:text-3xl md:text-3xl lg:text-3xl">Articles</h2>
        <div className="flex flex-col items-center">
          <div className="mb-6 grid gap-4 sm:grid-cols-2 sm:justify-items-stretch md:mb-10 md:grid-cols-3 lg:mb-12 lg:gap-6">
            {getCurrentPageArticles().map(({ id, title, description }) => (
              <a
                href={`/posts/${id}`}
                className="flex flex-col gap-4 rounded-md border border-solid border-gray-300 px-4 py-8 md:p-0"
                key={id}
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/flowspark-1f3e0.appspot.com/o/Tailspark%20Images%2FPlaceholder%20Image.svg?alt=media&token=375a1ea3-a8b6-4d63-b975-aac8d0174074"
                  alt="图片描述，可以从md文章里取出来"
                  className="h-60 object-cover"
                />
                <div className="flex flex-col justify-between h-full px-6 py-4"> {/* 添加 flex 和 justify-between */}
                  <p className="text-xl font-semibold">
                    {title}
                  </p>
                  <div className="flex mt-4"> {/* 移到底部 */}
                    <div className="flex flex-row items-center">
                      {/* 从md文章里取发布时间 */}
                      <p className="text-sm text-gray-500">Sept 28, 2022</p>
                      <p className="mx-2 text-sm text-gray-500">
                        -
                      </p>
                      {/* 从md文章里取阅读时间 */}
                      <p className="text-sm text-gray-500">6 mins read</p>
                    </div>
                  </div>
                </div>
              </a>

            ))}
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-6">
              {/* 上一页按钮 */}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {/* 页码按钮 */}
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              {/* 下一页按钮 */}
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* 如果需要 View More 链接，可以根据条件显示 */}
          {showMoreLink && (
            <a
              href="/posts"
              className="rounded-md bg-black px-6 py-3 text-center font-semibold text-white mt-6"
            >
              View More
            </a>
          )}
        </div>
      </div>
    </section>
  )
}