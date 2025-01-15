import Main from './Main'
import { getPostsWithCount } from '../../sanity/sanity-utils'
import { config } from 'utils/config'


export default async function Page() {
  const sanityPosts = await getPostsWithCount(config.PAGE_NUMBER, config.POSTS_PER_PAGE);
  return <Main posts={sanityPosts.posts} />
}
