import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'
import { formatDate } from 'pliny/utils/formatDate'
import { Post } from 'sanity/sanity.types'
import { Calendar, Eye, ArrowRight } from 'lucide-react'
import ArticleCard from '@/components/ArticleCard'

const MAX_DISPLAY = 6
interface ListLayoutProps {
  posts: Post[]
}

export default function Home({ posts }: ListLayoutProps) {
  return (
    <>
      <div className="pb-12 pt-6">
        {/* Header avec design moderne */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl mx-4 mb-12 border border-white/20 -z-80">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          
          <div className="relative px-8 py-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight 
                           text-gray-900 dark:text-gray-100 sm:text-5xl
                           bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 
                           dark:from-white dark:via-blue-100 dark:to-purple-100 
                           bg-clip-text text-transparent mb-4">
              Latest Posts
            </h1>
            
            <div className="flex justify-center mb-6">
              <div className="h-2 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
            </div>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Découvrez nos derniers articles inspirants
            </p>
          </div>
        </div>

        {/* Liste des posts */}
        <ul className="grid gap-8">
          {(!posts || !posts.length) && 'No posts found.'}
          {posts &&
            posts.slice(0, MAX_DISPLAY).map((post, index) => {
              return (
                <li key={index} className="h-full">
                  <ArticleCard post={post} />
                </li>
              )
            })}
        </ul>
      </div>

      {/* Lien vers tous les posts */}
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-center pt-8">
          <div className="inline-block relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <Link
              href="/blog"
              className="relative inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              aria-label="All posts"
            >
              <span>Voir tous les articles</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export const revalidate = 86400