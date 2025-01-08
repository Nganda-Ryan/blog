import 'css/prism.css'
import 'katex/dist/katex.css'

import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getPost, urlFor, getPostsWithCount } from './../../../../sanity/sanity-utils'
import { PortableText } from '@portabletext/react'
import PortableTextComponents from '@/components/sanity/PortableTextComponents'

interface LayoutContent {
  slug: string;
  date: string;
  title: string; 
  tags: string[] | undefined;
}
export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // const posts = allBlogs.find((p) => p.slug === slug)
  const posts = await getPost(slug);
  const authorList = posts?.post?.author?.name ? [posts.post.author.name] : ['default'];

  
  if (!posts) {
    return
  }

  const publishedAt = new Date(posts.post?.publishedAt!).toISOString()
  const modifiedAt = new Date(posts?.post?._updatedAt!).toISOString()
  let bannerImg = posts.post?.mainImage ? [urlFor(posts.post.mainImage.url).url()] : [siteMetadata.socialBanner];
  
  //openGraph
  const ogImages = bannerImg.map((img) => ({url: img}))

  return {
    title: posts.post?.title,
    description: posts.post?.description,
    openGraph: {
      title: posts.post?.title,
      description: posts.post?.description,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authorList || [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: posts.post?.title,
      description: posts.post?.description,
      images: bannerImg,
    },
  }
}

export const generateStaticParams = async () => {
  const sanityPosts = await getPostsWithCount();
  return sanityPosts.posts.map((p) => ({ slug: p.slug?.current!.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'));
  console.log('@@@slug', slug);
  const sanityPost = await getPost(slug);
  if (!sanityPost.post) {
    return notFound()
  }

  const prev = sanityPost?.prevPost?.slug?.current == undefined || sanityPost?.prevPost?.title == undefined ? undefined : {
    path: sanityPost?.prevPost?.slug?.current,
    title: sanityPost?.prevPost?.title
  };
  const next = sanityPost?.nextPost?.slug?.current == undefined || sanityPost?.nextPost?.title == undefined ? undefined : {
    path: sanityPost?.nextPost?.slug?.current,
    title: sanityPost?.nextPost?.title
  };
  
  const mainContent = {
    slug: sanityPost.post.slug?.current!,
    date: sanityPost.post.publishedAt!,
    title: sanityPost.post.title!,
    tags: sanityPost.post.tags ? sanityPost.post.tags : undefined
  }


  console.log("sanityPost", sanityPost);
  
  const authorList = sanityPost?.post?.author ? [sanityPost.post.author] : undefined;
  

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      /> */}
      <PostLayout content={mainContent} authorDetails={authorList} next={next} prev={prev}>
        
        <PortableText value={sanityPost.post?.body!} components={PortableTextComponents} />
        {/* <MDXLayoutRenderer code={posts.body.code} components={components} toc={posts.toc} /> */}
      </PostLayout>
    </>
  )
}
