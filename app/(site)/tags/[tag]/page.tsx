import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import { getPostsByTagSlug } from './../../../../sanity/sanity-utils'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/(site)/seo' 
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTags } from './../../../../sanity/sanity-utils'
import { config } from 'utils/config'

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagList = await getTags();
  const paths = tagList.map((tag) => ({
    tag: encodeURI(tag.slug?.current!),
  }))
  return paths
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const pageNumber = 1
  const params = await props.params
  const tag = decodeURI(params.tag)
  const postList = await getPostsByTagSlug(tag, config.POSTS_PER_PAGE, pageNumber);
  console.log('postList', postList)
  const initialDisplayPosts = postList.posts.slice(
    config.POSTS_PER_PAGE * (pageNumber - 1),
    config.POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(postList.total / config.POSTS_PER_PAGE),
  }
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  // const filteredPosts = allCoreContent(
  //   sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  // )
  if (postList.posts.length === 0) {
    return notFound()
  }
  return <ListLayout
    sanityPosts={postList.posts}
    pagination={pagination}
    title={"RYAn"}
    />
}
