import { createClient, groq } from 'next-sanity';
import {apiVersion, dataset, projectId} from './env'
import imageUrlBuilder from '@sanity/image-url'
import { Post, Tag } from './sanity.types';



export const client = createClient({
    projectId: projectId,
    dataset: dataset,
    apiVersion: apiVersion,
    useCdn: true, //true to cache datas an false to get live datas
});

const builder = imageUrlBuilder(client)

export async function getPost(slug: string): Promise<{ post: Post | null; prevPost: Post | null; nextPost: Post | null }> {
    const query = groq`
        {
            "post": *[_type == "post" && slug.current == $slug][0] {
                title,
                slug,
                description,
                "author": author->{
                    name,
                    image,
                    linkedin,
                    github,
                    mail,
                    x
                },
                "mainImage": {
                    "url": mainImage.asset->url,
                    alt
                },
                tags[]->{
                    _id,
                    title
                },
                publishedAt,
                body,
                _updatedAt
            },
            "prevPost": *[_type == "post" && publishedAt < *[_type == "post" && slug.current == $slug][0].publishedAt] | order(publishedAt desc)[0] {
                title,
                slug,
                publishedAt
            },
            "nextPost": *[_type == "post" && publishedAt > *[_type == "post" && slug.current == $slug][0].publishedAt] | order(publishedAt asc)[0] {
                title,
                slug,
                publishedAt
            }
        }
    `;

    const result = await client.fetch(query, { slug });

    // Si le post est introuvable, prevPost et nextPost doivent être null
    if (!result.post) {
        return {
            post: null,
            prevPost: null,
            nextPost: null,
        };
    }

    return {
        post: result.post,
        prevPost: result.prevPost || null,
        nextPost: result.nextPost || null,
    };
}

export async function getPostsByTagSlug(
    tagSlug: string,
    limit: number,
    offset: number
  ): Promise<{ posts: Post[]; total: number }> {
    const query = groq`
      {
        // Récupérer les posts filtrés et paginés
        "posts": *[_type == "post" && $tagSlug in tags[]->slug.current] 
          | order(publishedAt desc)[$offset...$offset + $limit] {
            title,
            slug,
            description,
            "author": author->{
              name,
              image,
              linkedin,
              github,
              mail,
              x
            },
            "mainImage": {
              "url": mainImage.asset->url,
              alt
            },
            tags[]->{
              _id,
              title,
              slug
            },
            publishedAt,
            body,
            _updatedAt
        },
        // Compter le nombre total de posts correspondant au filtre
        "total": count(*[_type == "post" && $tagSlug in tags[]->slug.current])
      }
    `;
  
    const result = await client.fetch(query, { tagSlug, limit, offset });
    return result;
}
  

export async function getPostsWithCount(page = 0, limit = 5): Promise<{ posts: Post[], total: number }> {
    const offset = (page - 1) * limit;

    const query = groq`
    {
        "posts": *[_type == "post"] | order(publishedAt desc) [${offset}...${offset + limit}] {
            title,
            slug,
            "mainImage": {
                "url": mainImage.asset->url,
                alt
            },
            tags[]->{
                _id,
                title,
                slug
            },
            publishedAt,
            description
        },
        "total": count(*[_type == "post"])
    }`;

    const result = await client.fetch(query);

    return {
        posts: result.posts,
        total: result.total
    };
}

export async function getAllPosts(): Promise<Post[]> {
    const query = groq`
        *[_type == "post"] | order(publishedAt desc) {
            title,
            slug,
            "mainImage": {
                "url": mainImage.asset->url,
                alt
            },
            tags[]->{
                _id,
                title,
                slug
            },
            publishedAt,
            description
        }
    `;

    const posts = await client.fetch(query);
    return posts;
}

export async function getTags(): Promise<Tag[]> {
    const query = groq`
        *[_type == "tag"] | order(title asc){
            title,
            slug,
            "postCount": count(*[_type == "post" && references(^._id)])
        }
    `;
    const tags = await client.fetch(query);
    return tags;
}

export function urlFor(source: any) {
    return builder.image(source)
}

