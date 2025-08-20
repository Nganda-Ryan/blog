/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getTags } from './../sanity/sanity-utils'
import { Post } from 'sanity/sanity.types'
import Pagination from '@/components/Pagination'
import Strip, { StripBgColor } from '@/components/Strip'
import ArticleCard from '@/components/ArticleCard'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  title: string
  pagination?: PaginationProps
  sanityPosts?: Post [],
  tags?: boolean
}



export default async function ListLayoutWithTags({
  title,
  pagination,
  sanityPosts
}: ListLayoutProps) {
  const tagList = await getTags();
  const tagCounts = tagList.reduce((sum, tag) => sum + tag.postCount!, 0);
  console.log("pagination", pagination)

  return (
    <>
      <div>
        <div>
          
          <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl mx-4 mb-4 border border-white/20 -z-80">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            
            <div className="relative px-8 py-4 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight 
                            text-gray-900 dark:text-gray-100 sm:text-5xl
                            bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 
                            dark:from-white dark:via-blue-100 dark:to-purple-100 
                            bg-clip-text text-transparent mb-4">
                {title}
              </h1>
              
              <div className="flex justify-center">
                <div className="h-2 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex sm:space-x-24">
          <div>
            <ul>
              {sanityPosts && sanityPosts.map((post, index) => {
                return (
                  <li key={index} className="py-5">
                    <ArticleCard post={post} />
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
