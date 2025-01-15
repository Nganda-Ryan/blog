import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getPostsWithCount } from './../../sanity/sanity-utils'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  //http://localhost:3000/blog/react-router-7-redirect
  const siteUrl = siteMetadata.siteUrl
  const sanityPosts = await getPostsWithCount();
  const blogRoutes = sanityPosts.posts.filter((post) => !post.draft).map((post) => ({
    url: `${siteUrl}/blog/${post.slug?.current!}`,
    lastModified: post._updatedAt || post.publishedAt,
  }))

  const routes = ['', 'blog', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
