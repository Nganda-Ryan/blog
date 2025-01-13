import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { getPostsWithCount } from '../../sanity/sanity-utils'


const POSTS_PER_PAGE = 5
const pageNumber = 1

export default async function Page() {
  const sanityPosts = await getPostsWithCount(pageNumber, POSTS_PER_PAGE);
  return <Main posts={sanityPosts.posts} />
}
