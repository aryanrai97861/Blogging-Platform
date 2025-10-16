import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { posts, postsToCategories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import slugify from 'slugify';

export const postRouter = router({
  // Get all posts (with optional category filter)
  getAll: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        published: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const query = db.query.posts.findMany({
        orderBy: [desc(posts.createdAt)],
        with: {
          postsToCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      // If categoryId is provided, we need to filter
      if (input?.categoryId) {
        const postIds = await db.query.postsToCategories.findMany({
          where: eq(postsToCategories.categoryId, input.categoryId),
        });
        
        const ids = postIds.map((p) => p.postId);
        
        if (ids.length === 0) return [];
        
        const allPosts = await query;
        return allPosts.filter((post) => ids.includes(post.id));
      }

      const allPosts = await query;
      
      // Filter by published status if specified
      if (input?.published !== undefined) {
        return allPosts.filter((post) => post.published === input.published);
      }
      
      return allPosts;
    }),

  // Get a single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          postsToCategories: {
            with: {
              category: true,
            },
          },
        },
      });
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      return post;
    }),

  // Get a single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postsToCategories: {
            with: {
              category: true,
            },
          },
        },
      });
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      return post;
    }),

  // Create a new post
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(1, 'Content is required'),
        published: z.boolean().default(false),
        categoryIds: z.array(z.number()).default([]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log('Creating post with input:', input);
        const slug = slugify(input.title, { lower: true, strict: true });
        console.log('Generated slug:', slug);
        
        const [post] = await db
          .insert(posts)
          .values({
            title: input.title,
            content: input.content,
            slug,
            published: input.published,
            updatedAt: new Date(),
          })
          .returning();

        console.log('Post inserted:', post);

        // Add category relationships
        if (input.categoryIds.length > 0) {
          await db.insert(postsToCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: post.id,
              categoryId,
            }))
          );
          console.log('Category relationships added');
        }

        console.log('Returning post:', post);
        
        // Return a plain object to avoid serialization issues
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          slug: post.slug,
          published: post.published,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      } catch (error) {
        console.error('Error creating post:', error);
        throw new Error(`Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  // Update a post
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        published: z.boolean().optional(),
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: Record<string, string | boolean | Date> = {
        updatedAt: new Date(),
      };

      if (input.title !== undefined) {
        updateData.title = input.title;
        updateData.slug = slugify(input.title, { lower: true, strict: true });
      }
      if (input.content !== undefined) updateData.content = input.content;
      if (input.published !== undefined) updateData.published = input.published;

      const [post] = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, input.id))
        .returning();

      // Update category relationships if provided
      if (input.categoryIds !== undefined) {
        // Delete existing relationships
        await db
          .delete(postsToCategories)
          .where(eq(postsToCategories.postId, input.id));

        // Add new relationships
        if (input.categoryIds.length > 0) {
          await db.insert(postsToCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            }))
          );
        }
      }

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        slug: post.slug,
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    }),

  // Delete a post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});
