export const dynamic = 'force-static';
import { getAllPosts } from "./../../sanity/sanity-utils";



export async function GET() {
  const sanityPost = await getAllPosts();
  const searchPosts = sanityPost.map(post => ({
    title: post.title,
    tags: post.tags?.map(tag => (tag.slug?.current)),
    date: post._updatedAt || post.publishedAt,
    lastmod: post._updatedAt || post.publishedAt,
    summary: post.description,
    images: post.mainImage?.url,
    slug: post.slug?.current,
    path: `blog/${post.slug?.current}`
  }));

  // console.log('searchPosts', searchPosts);
 

  return Response.json(searchPosts)
}

export const revalidate = 86400