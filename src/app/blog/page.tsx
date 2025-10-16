'use client';

import { trpc } from '@/app/providers';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showPublishedOnly, setShowPublishedOnly] = useState(true);

  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    categoryId: selectedCategory || undefined,
    published: showPublishedOnly ? true : undefined,
  });

  const { data: categories, isLoading: categoriesLoading } = trpc.category.getAll.useQuery();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Ensure categories is an array
  const categoryList = Array.isArray(categories) ? categories : [];
  
  // Ensure posts is an array
  const postList = Array.isArray(posts) ? posts : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
          <p className="text-lg text-gray-600">
            Explore our collection of articles and stories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published-only"
                checked={showPublishedOnly}
                onChange={(e) => setShowPublishedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published-only" className="ml-2 block text-sm text-gray-900">
                Published posts only
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {postsLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading posts...</p>
          </div>
        )}

        {/* Posts List */}
        {!postsLoading && postList && (
          <div className="space-y-6">
            {postList.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <p className="text-gray-600">No posts found. Create your first post!</p>
                <Link
                  href="/blog/new"
                  className="inline-block mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              postList.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 mb-2">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.postsToCategories.map((ptc) => (
                            <span
                              key={ptc.categoryId}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {ptc.category.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 line-clamp-3">
                        {post.content.substring(0, 200)}...
                      </p>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
