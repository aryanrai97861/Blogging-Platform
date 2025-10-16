'use client';

import { trpc } from '@/app/providers';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Link from 'next/link';
import { useState } from 'react';
import { calculateReadingTime, getWordCount } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showPublishedOnly, setShowPublishedOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);

  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    categoryId: selectedCategory || undefined,
    published: showPublishedOnly ? true : undefined,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

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

  // Filter posts by search query
  const filteredPosts = postList.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Blog Posts | Multi-User Blogging Platform"
        description="Explore our collection of articles and stories. Filter by category and discover great content."
        keywords="blog, articles, posts, content"
      />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog Posts</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore our collection of articles and stories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 min-w-[250px]">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Posts
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or content..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange();
                }}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => {
                  setSelectedCategory(e.target.value ? Number(e.target.value) : null);
                  handleFilterChange();
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="published-only" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                Published posts only
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {postsLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading posts...</p>
          </div>
        )}

        {/* Search Results Count */}
        {!postsLoading && searchQuery && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
          </div>
        )}

        {/* Posts Per Page Selector */}
        {!postsLoading && filteredPosts.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-sm text-gray-600 dark:text-gray-300">
                Posts per page:
              </label>
              <select
                id="perPage"
                value={postsPerPage}
                onChange={(e) => {
                  setPostsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        )}

        {/* Posts List */}
        {!postsLoading && paginatedPosts && (
          <div className="space-y-6">
            {paginatedPosts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-12 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery ? `No posts found matching "${searchQuery}"` : 'No posts found. Create your first post!'}
                </p>
                <Link
                  href="/blog/new"
                  className="inline-block mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span>{calculateReadingTime(post.content)} min read</span>
                        <span>•</span>
                        <span>{getWordCount(post.content)} words</span>
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

                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {post.content.substring(0, 200)}...
                      </p>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
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

        {/* Pagination Controls */}
        {!postsLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!showPage && page === currentPage - 2) {
                  return <span key={page} className="px-2 py-2 text-gray-500 dark:text-gray-400">...</span>;
                }
                if (!showPage && page === currentPage + 2) {
                  return <span key={page} className="px-2 py-2 text-gray-500 dark:text-gray-400">...</span>;
                }
                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}