'use client';

import { trpc } from '@/app/providers';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: post, isLoading, error } = trpc.post.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading post...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Post not found</h2>
            <p className="text-red-600 mb-4">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/blog"
              className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Blog
            </Link>
          </div>
        )}

        {/* Post Content */}
        {post && (
          <article className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="border-b px-6 py-8">
              <div className="mb-4">
                <Link
                  href="/blog"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>{formatDate(post.createdAt)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>

              {post.postsToCategories && Array.isArray(post.postsToCategories) && post.postsToCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.postsToCategories.map((ptc) => (
                    <span
                      key={ptc.categoryId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {ptc.category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 bg-gray-50">
              <div className="flex gap-4">
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Post
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
