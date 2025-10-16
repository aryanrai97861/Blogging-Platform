'use client';

import { trpc } from '@/app/providers';
import Navigation from '@/components/Navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id ? Number(params.id) : 0;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const { data: post, isLoading: postLoading } = trpc.post.getById.useQuery(
    { id: postId },
    { enabled: postId > 0 }
  );

  const { data: categories } = trpc.category.getAll.useQuery();

  const updatePost = trpc.post.update.useMutation({
    onSuccess: (data) => {
      router.push(`/blog/${data.slug}`);
    },
    onError: (error) => {
      console.error('Error updating post:', error);
      alert(`Error updating post: ${error.message}`);
    },
  });

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      router.push('/blog');
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      alert(`Error deleting post: ${error.message}`);
    },
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
      setSelectedCategories(
        Array.isArray(post.postsToCategories) 
          ? post.postsToCategories.map((ptc: { categoryId: number }) => ptc.categoryId) 
          : []
      );
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    updatePost.mutate({
      id: postId,
      title,
      content,
      published,
      categoryIds: selectedCategories,
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      deletePost.mutate({ id: postId });
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Ensure categories is an array
  const categoryList = Array.isArray(categories) ? categories : [];

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Post not found</h2>
            <p className="text-red-600 dark:text-red-300">The post you&apos;re trying to edit doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Edit Post</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Update your blog post
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content * (Markdown supported)
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>

            {showPreview ? (
              <div className="prose dark:prose-invert max-w-none p-4 border border-gray-200 dark:border-gray-600 rounded-md min-h-[400px] bg-gray-50 dark:bg-gray-900">
                {content ? (
                  <MarkdownRenderer content={content} className="prose dark:prose-invert max-w-none" />
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">No content to preview yet...</p>
                )}
              </div>
            ) : (
              <>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  rows={15}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Supports Markdown formatting: **bold**, *italic*, # headings, etc.
                </p>
              </>
            )}
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </label>
            {categoryList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categoryList.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategories.includes(category.id)
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No categories available.
              </p>
            )}
          </div>

          {/* Publish Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                Published
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updatePost.isPending}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatePost.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/blog/${post.slug}`)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {deletePost.isPending ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>

          {(updatePost.isError || deletePost.isError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">An error occurred. Please try again.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
