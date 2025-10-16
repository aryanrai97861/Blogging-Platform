'use client';

import { trpc } from '@/app/providers';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const { data: categories } = trpc.category.getAll.useQuery();
  const createPost = trpc.post.create.useMutation({
    onSuccess: (data) => {
      console.log('Post created successfully:', data);
      router.push(`/blog/${data.slug}`);
    },
    onError: (error) => {
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error data:', error.data);
      console.error('Error shape:', error.shape);
      alert(`Error creating post: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const postData = {
      title,
      content,
      published,
      categoryIds: selectedCategories,
    };
    
    console.log('Submitting post data:', postData);

    createPost.mutate(postData);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-lg text-gray-600">
            Write and publish your blog post
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content * (Markdown supported)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content in Markdown..."
              rows={15}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports Markdown formatting: **bold**, *italic*, # headings, etc.
            </p>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No categories available. Create some categories first.
              </p>
            )}
          </div>

          {/* Publish Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publish immediately (uncheck to save as draft)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={createPost.isPending}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createPost.isPending ? 'Creating...' : published ? 'Publish Post' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/blog')}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          {createPost.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Error creating post. Please try again.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
