import siteMetadata from '@/data/siteMetadata'
import { ArrowRight, Calendar, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from 'pliny/utils/formatDate'
import React from 'react'
import { Post } from 'sanity/sanity.types'
import Tag from './Tag'
import Image from 'next/image'

const ArticleCard = ({ post }: {post : Post}) => {
   const {publishedAt, title, slug, tags, description, mainImage} = post;
    return (
        <article
            className="flex flex-col h-full overflow-hidden 
                        rounded-2xl border border-gray-200 dark:border-gray-700 
                        shadow-sm bg-white dark:bg-gray-900 
                        transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
            {/* Image */}
            <div className="h-60 w-full overflow-hidden">
                {mainImage ? (
                <Image
                    src={mainImage.url ?? ""}
                    alt={title ?? ""}
                    height={800}
                    width={800}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                ) : (
                <div className="h-full w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    No Image
                </div>
                )}
            </div>

            {/* Contenu */}
            <div className="flex flex-col flex-grow p-6 space-y-4">
                {/* Date redesignée */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-full w-fit shadow-sm">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <time
                        dateTime={publishedAt}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400"
                        suppressHydrationWarning
                    >
                        {formatDate(publishedAt!, siteMetadata.locale)}
                    </time>
                </div>

                {/* Titre */}
                <h2 className="text-xl font-bold leading-snug text-gray-900 dark:text-gray-100">
                    <Link
                        href={`/blog/${slug?.current}`}
                        className="transition-colors duration-200 hover:text-primary-500"
                    >
                        {title}
                    </Link>
                    </h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags?.map((tag, index2) => (
                        <Tag
                        key={index2}
                        text={tag.title!}
                        />
                    ))}
                </div>

                {/* Description */}
                <p className="flex-grow text-gray-600 dark:text-gray-300 line-clamp-3">
                    {description}
                </p>

                {/* Bouton "Lire plus" redesigné */}
                <div className="pt-2">
                <Link
                    href={`/blog/${slug?.current}`}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                    aria-label={`Lire Plus: "${title}"`}
                >
                    <span>Lire Plus</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                </div>
            </div>
        </article>
    )
}

export default ArticleCard