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

/**
 * Fetches a single blog post by its slug, along with the previous and next posts based on the publication date.
 *
 * @param {string} slug - The slug of the blog post to retrieve. 
 *                        This corresponds to the `slug.current` field of the post.
 *
 * @returns {Promise<{ post: Post | null; prevPost: Post | null; nextPost: Post | null }>} - A promise resolving to an object containing:
 *    - `post`: The blog post matching the given slug, or `null` if no post is found.
 *    - `prevPost`: The previous blog post (by publication date), or `null` if none exists.
 *    - `nextPost`: The next blog post (by publication date), or `null` if none exists.
 *
 * @throws {Error} - Throws an error if the GROQ query fails or the slug is invalid.
 *
 * ### Example usage:
 * ```typescript
 * const { post, prevPost, nextPost } = await getPost('my-first-blog-post');
 * if (post) {
 *     console.log('Post:', post.title);
 *     if (prevPost) {
 *         console.log('Previous Post:', prevPost.title);
 *     }
 *     if (nextPost) {
 *         console.log('Next Post:', nextPost.title);
 *     }
 * } else {
 *     console.log('Post not found');
 * }
 * ```
 *
 * ### Features:
 * - Retrieves a single post based on its slug.
 * - Fetches additional metadata for the post, such as the author, main image, tags, and publication date.
 * - Identifies the previous and next posts based on their `publishedAt` date, enabling navigation between posts.
 * - Returns `null` for `prevPost` or `nextPost` if no previous or next posts exist.
 *
 * ### Notes:
 * - If no post is found for the provided slug, all returned fields (`post`, `prevPost`, `nextPost`) will be `null`.
 * - The query is optimized to fetch only the required fields for each post.
*/
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

/**
 * Retrieves a paginated list of posts associated with a specific tag, along with the total count of matching posts.
 *
 * @param {string} tagSlug - The slug of the tag used to filter posts. 
 *                           This corresponds to the `slug.current` field of the tags associated with the posts.
 * @param {number} limit - The maximum number of posts to return in the paginated list.
 * @param {number} offset - The page index (starting from 1). 
 *                          For example, if `offset` is 1, the first set of posts will be retrieved.
 *
 * @returns {Promise<{ posts: Post[]; total: number }>} - A promise that resolves to an object containing:
 *    - `posts`: An array of posts matching the criteria (filtered by tag and paginated).
 *    - `total`: The total number of posts matching the given tag filter.
 *
 * @throws {Error} - Throws an error if the GROQ query fails or if invalid parameters are provided.
 *
 * ### Example usage:
 * ```typescript
 * const { posts, total } = await getPostsByTagSlug('javascript', 10, 2);
 * console.log('Total number of posts:', total);
 * console.log('Paginated posts:', posts);
 * ```
 *
 * ### Features:
 * - Filters posts by the given tag slug.
 * - Sorts posts by descending publication date (`publishedAt desc`).
 * - Returns a paginated list of posts with detailed information such as title, author, main image, tags, etc.
 * - Includes the total number of posts matching the filter criteria.
*/
export async function getPostsByTagSlug(
    tagSlug: string,
    limit: number,
    offset: number
  ): Promise<{ posts: Post[]; total: number }> {
    
    const _offset = (offset-1) * 5;
    const _limit =_offset + limit;
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
  
    const result = await client.fetch(query, { tagSlug, limit: _limit, offset: _offset });
    return result;
}
  
  
  
/**
 * Fetches a paginated list of all posts along with the total number of posts in the system.
 *
 * @param {number} [page=0] - The current page number for pagination. 
 *                            Defaults to 0, which retrieves the first set of posts.
 * @param {number} [limit=5] - The maximum number of posts to retrieve per page. 
 *                             Defaults to 5 posts per page.
 *
 * @returns {Promise<{ posts: Post[], total: number }>} - A promise resolving to an object containing:
 *    - `posts`: An array of posts for the specified page, each containing:
 *        - `title`: The title of the post.
 *        - `slug`: The unique slug for the post.
 *        - `mainImage`: The main image of the post, with its URL and alt text.
 *        - `tags`: An array of tags associated with the post, each containing its `_id`, `title`, and `slug`.
 *        - `publishedAt`: The publication date of the post.
 *        - `description`: A brief description of the post.
 *    - `total`: The total number of posts available in the system.
 *
 * @throws {Error} - Throws an error if the GROQ query fails or the parameters are invalid.
 *
 * ### Example usage:
 * ```typescript
 * const { posts, total } = await getPostsWithCount(1, 5);
 * console.log(`Total posts: ${total}`);
 * posts.forEach((post) => {
 *     console.log(`Title: ${post.title}, Published At: ${post.publishedAt}`);
 * });
 * ```
 *
 * ### Features:
 * - Implements pagination using `page` and `limit` parameters.
 * - Sorts posts by publication date in descending order (`publishedAt desc`).
 * - Retrieves only the required fields for each post to minimize query overhead.
 * - Provides the total count of posts, useful for rendering pagination controls.
 *
 * ### Notes:
 * - If the `page` parameter is less than 1, no posts will be returned (pagination is 1-based).
 * - The default `limit` of 5 ensures efficient data fetching and can be adjusted as needed.
*/
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


/**
 * Fetches all posts from the database, sorted by their publication date in descending order.
 *
 * @returns {Promise<Post[]>} - A promise resolving to an array of posts, where each post includes:
 *    - `title`: The title of the post.
 *    - `slug`: The unique slug identifying the post.
 *    - `mainImage`: The main image of the post, with its URL and alt text.
 *    - `tags`: An array of tags associated with the post, each containing its `_id`, `title`, and `slug`.
 *    - `publishedAt`: The publication date of the post.
 *    - `description`: A brief description of the post.
 *
 * @throws {Error} - Throws an error if the GROQ query fails.
 *
 * ### Example usage:
 * ```typescript
 * const posts = await getAllPosts();
 * console.log(`Fetched ${posts.length} posts.`);
 * posts.forEach((post) => {
 *     console.log(`Title: ${post.title}, Published At: ${post.publishedAt}`);
 * });
 * ```
 *
 * ### Features:
 * - Retrieves all posts available in the database, regardless of pagination.
 * - Sorts posts by `publishedAt` in descending order, ensuring the most recent posts appear first.
 * - Includes essential fields for each post, such as title, slug, tags, and main image details.
 * - Optimized GROQ query to fetch only required data for each post.
 *
 * ### Notes:
 * - The method fetches all posts at once. For larger datasets, consider implementing pagination to avoid performance issues.
 * - The `tags` field fetches associated tag information, including their unique identifiers and titles.
*/
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

/**
 * Fetches all tags from the database, sorted alphabetically by their title.
 * 
 * @returns {Promise<Tag[]>} - A promise resolving to an array of tags, where each tag includes:
 *    - `title`: The title of the tag.
 *    - `slug`: The unique slug for the tag.
 *    - `postCount`: The number of posts associated with this tag.
 * 
 * @throws {Error} - Throws an error if the GROQ query fails.
 * 
 * ### Example usage:
 * ```typescript
 * const tags = await getTags();
 * console.log(`Fetched ${tags.length} tags.`);
 * tags.forEach((tag) => {
 *     console.log(`Tag: ${tag.title}, Posts: ${tag.postCount}`);
 * });
 * ```
 * 
 * ### Features:
 * - Retrieves all available tags in the database.
 * - Tags are sorted alphabetically by their `title`.
 * - Includes a `postCount` field that counts how many posts reference each tag.
 * 
 * ### Notes:
 * - The `postCount` is calculated dynamically using a GROQ subquery, ensuring accurate data.
 * - This method is useful for generating tag-based navigation or filtering systems in a blog or content application.
*/
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

