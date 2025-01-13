import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from '../seo' 
import { getPostsWithCount } from './../../../sanity/sanity-utils'
import { config } from 'utils/config'


export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const pageNumber = 1
  const posts = allCoreContent(sortPosts(allBlogs))
  const sanityPosts = await getPostsWithCount(pageNumber, config.POSTS_PER_PAGE);
  const initialDisplayPosts = posts.slice(
    config.POSTS_PER_PAGE * (pageNumber - 1),
    config.POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(sanityPosts.total / config.POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
      sanityPosts={sanityPosts.posts}
    />
  )
}
