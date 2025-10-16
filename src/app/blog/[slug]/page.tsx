'use client';

import { trpc } from '@/app/providers';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { calculateReadingTime, getWordCount, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {post && (
        <SEO
          title={`${post.title} | Blog`}
          description={post.content.substring(0, 160)}
          keywords={post.postsToCategories?.map((ptc: { category: { name: string } }) => ptc.category.name).join(', ')}
        />
      )}
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading post...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Post not found</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/blog"
              className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Back to Blog
            </Link>
          </div>
        )}

        {/* Post Content */}
        {post && (
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
            {/* Header */}
            <div className="border-b dark:border-gray-700 px-6 py-8">
              <div className="mb-4">
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>{calculateReadingTime(post.content)} min read</span>
                <span>•</span>
                <span>{getWordCount(post.content)} words</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.published 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>

              {post.postsToCategories && Array.isArray(post.postsToCategories) && post.postsToCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.postsToCategories.map((ptc) => (
                    <span
                      key={ptc.categoryId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {ptc.category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              <MarkdownRenderer 
                content={post.content}
                className="prose prose-lg dark:prose-invert max-w-none"
              />
            </div>

            {/* Footer */}
            <div className="border-t dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-4">
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Edit Post
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  View All Posts
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
