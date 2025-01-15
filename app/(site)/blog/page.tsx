import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from '../seo' 
import { getPostsWithCount } from './../../../sanity/sanity-utils'
import { config } from 'utils/config'


export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const sanityPosts = await getPostsWithCount(config.PAGE_NUMBER, config.POSTS_PER_PAGE);

  const pagination = {
    currentPage: config.PAGE_NUMBER,
    totalPages: Math.ceil(sanityPosts.total / config.POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      pagination={pagination}
      title="All Posts"
      sanityPosts={sanityPosts.posts}
    />
  )
}
