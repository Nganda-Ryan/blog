import 'css/prism.css'
import 'katex/dist/katex.css'

import PostLayout from '@/layouts/PostLayout'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { getPost, urlFor, getAllPosts } from './../../../../sanity/sanity-utils'
import { PortableText } from '@portabletext/react'
import PortableTextComponents from '@/components/sanity/PortableTextComponents'




export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const posts = await getPost(slug);
  
  if (!posts) {
    return
  }

  
  const authorList = posts?.post?.author?.name ? [posts.post.author.name] : ['default'];

  // const publishedAt = posts.post?.publishedAt ? new Date(posts.post.publishedAt).toISOString() : null; // ou une valeur par défaut
  const publishedAt = new Date(posts.post?.publishedAt ?? "").toISOString();
  const modifiedAt = posts?.post?._updatedAt ? new Date(posts.post._updatedAt).toISOString() : undefined; // ou une valeur par défaut
  const bannerImg = posts.post?.mainImage ? [urlFor(posts.post.mainImage.url).url()] : [siteMetadata.socialBanner];
  
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
  const sanityPosts = await getAllPosts();
  if(sanityPosts.length === 0) {
    return []
  }
  const slugList = sanityPosts.map((p) => ({ slug: p.slug?.current!.split('/').map((name) => decodeURI(name))}))
  return slugList;
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'));
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
  const _slug = sanityPost.post.slug?.current ?? "default-slug";
  const mainContent = {
    slug: _slug,
    date: sanityPost.post.publishedAt!,
    title: sanityPost.post.title!,
    tags: sanityPost.post.tags ? sanityPost.post.tags : undefined
  }

  const authorList = sanityPost?.post?.author ? [sanityPost.post.author] : undefined;
  

  return (
    <>
      <PostLayout content={mainContent} authorDetails={authorList} next={next} prev={prev}>
        
        <div className='prose dark:prose-invert w-full max-w-full mx-auto text-slate-900 dark:text-slate-50'>
          <div>
            {sanityPost.post?.description ?? "No description available"}
          </div>
          <br />
          <PortableText value={sanityPost.post?.body ?? []} components={PortableTextComponents}/>
        </div>
      </PostLayout>
    </>
  )
}

export const revalidate = parseInt(process.env.NEXT_PUBLIC_POSTS_REVALIDATION_TIME || '3600', 10);