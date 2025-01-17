import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPostsWithCount } from './../../../../../sanity/sanity-utils'
import { config } from 'utils/config'

export const revalidate = 60;


export const generateStaticParams = async () => {
  const postList = await getPostsWithCount();
  const totalPages = Math.ceil(postList.total / config.POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)
  const sanityPosts = await getPostsWithCount(pageNumber, config.POSTS_PER_PAGE);
  const pagination = {
    currentPage: pageNumber,
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
