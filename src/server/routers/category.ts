import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

export const categoryRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async () => {
    return await db.query.categories.findMany({
      with: {
        postsToCategories: true,
      },
    });
  }),

  // Get a single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      return category;
    }),

  // Get a single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
      });
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      return category;
    }),

  // Create a new category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.name, { lower: true, strict: true });
      
      const [category] = await db
        .insert(categories)
        .values({
          name: input.name,
          description: input.description || null,
          slug,
        })
        .returning();

      return category;
    }),

  // Update a category
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: any = {};

      if (input.name !== undefined) {
        updateData.name = input.name;
        updateData.slug = slugify(input.name, { lower: true, strict: true });
      }
      if (input.description !== undefined) {
        updateData.description = input.description || null;
      }

      const [category] = await db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning();

      return category;
    }),

  // Delete a category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
