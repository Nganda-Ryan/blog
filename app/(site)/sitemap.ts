import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { getAllPosts } from './../../sanity/sanity-utils'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl;
  const sanityPosts = await getAllPosts();
  const blogRoutes = sanityPosts.filter((post) => !post.draft).map((post) => {
    const slug = post.slug?.current ? post.slug.current : "default-slug";
    return {
      url: `${siteUrl}/blog/${slug}`,
      lastModified: post._updatedAt || post.publishedAt,
    }
  })

  const routes = ['', 'blog', 'tags', 'about'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}

export const revalidate = 86400
