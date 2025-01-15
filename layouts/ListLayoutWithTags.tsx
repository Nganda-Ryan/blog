/* eslint-disable prettier/prettier */
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getTags } from './../sanity/sanity-utils'
import { Post } from 'sanity/sanity.types'
import Pagination from '@/components/Pagination'
import Strip, { StripBgColor } from '@/components/Strip'

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
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div>
            <ul>
              {sanityPosts && sanityPosts.map((post, index) => {
                const { publishedAt, title, slug, tags, description } = post
                return (
                  <li key={index} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={publishedAt} suppressHydrationWarning>
                            {formatDate(publishedAt!, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/blog/${slug?.current}`} className="dark:hover:text-indigo-300">
                                {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag, index2) => <Tag key={index2} text={tag.slug?.current!} />)}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-300 line-clamp-4">
                          {description}
                        </div>
                      </div>
                    </article>
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
