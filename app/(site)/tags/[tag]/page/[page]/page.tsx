import ListLayout from '@/layouts/ListLayoutWithTags'
import { notFound } from 'next/navigation'
import { getTags, getPostsByTagSlug } from './../../../../../../sanity/sanity-utils'
import { config } from 'utils/config'




export const generateStaticParams = async () => {
  const tagList = await getTags();
  const tagCounts = tagList.reduce((acc, tag) => {
    if (tag.slug && tag.slug.current) {
        acc[tag.slug.current] = tag.postCount!;
    }
    return acc;
  }, {} as Record<string, number>);

  
  return Object.keys(tagCounts).flatMap((tag) => {
    const postCount = tagCounts[tag]
    const totalPages = Math.ceil(postCount / config.POSTS_PER_PAGE)
    return Array.from({ length: totalPages - 1 }, (_, i) => ({
      tag: encodeURI(tag),
      page: (i + 2).toString(),
    }))
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const pageNumber = parseInt(params.page);
  const postList = await getPostsByTagSlug(tag, config.POSTS_PER_PAGE, pageNumber);
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

  const totalPages = Math.ceil(postList.total / config.POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      sanityPosts={postList.posts}
      pagination={pagination}
      title={title}
    />
  )
}


export const revalidate = parseInt(process.env.NEXT_PUBLIC_TAGS_REVALIDATION_TIME || '3600', 10);