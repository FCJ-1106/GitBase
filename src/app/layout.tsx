import './globals.css'
import { Inter } from 'next/font/google'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

// 网站根布局
export const metadata: Metadata = {
  // 设置网站标题
  title: {
    default: 'NHC Health Science',
    template: '%s | NHC Health Science'
  },
  // 设置网站描述 TODO 没看到在哪儿用
  description: 'Explore NHC Health Science for fun, popular science articles on health. Enjoy humorous tips that make learning about health easy for everyone!',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}