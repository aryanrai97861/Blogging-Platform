# Multi-User Blogging Platform

A modern, full-stack blogging platform built with Next.js 15, PostgreSQL, Drizzle ORM, tRPC, and other cutting-edge web technologies.

## 🚀 Features

### ✅ Core Features (Must Have - Priority 1)
- ✅ **Blog Post CRUD**: Create, read, update, and delete blog posts
- ✅ **Category Management**: Full CRUD operations for categories
- ✅ **Category Assignment**: Assign multiple categories to posts (many-to-many relationship)
- ✅ **Blog Listing**: View all published posts with filtering
- ✅ **Individual Post View**: Read full blog posts with markdown rendering
- ✅ **Category Filtering**: Filter posts by category on listing page
- ✅ **Responsive Navigation**: Clean, mobile-friendly navigation
- ✅ **Professional UI**: Clean, functional design with Tailwind CSS

### ✅ Priority 2 Features (Should Have)
- ✅ **Landing Page**: Hero section, features showcase, and footer
- ✅ **Dashboard**: Centralized management interface for posts and stats
- ✅ **Draft vs Published**: Toggle between draft and published status
- ✅ **Loading States**: Proper loading indicators throughout the app
- ✅ **Error States**: Comprehensive error handling and user feedback
- ✅ **Mobile Responsive**: Fully responsive design across all pages
- ✅ **Markdown Editor**: Simple textarea-based markdown editor with preview

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **API Layer**: tRPC (type-safe APIs)
- **Validation**: Zod schemas
- **Data Fetching**: React Query (via tRPC integration)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Content Editor**: Markdown (react-markdown)
- **Language**: TypeScript

## 📁 Project Structure

```
blogging-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/
│   │   │   └── trpc/[trpc]/   # tRPC API endpoint
│   │   ├── blog/              # Blog pages
│   │   │   ├── [slug]/        # Individual post view
│   │   │   ├── edit/[id]/     # Edit post
│   │   │   └── new/           # Create new post
│   │   ├── categories/        # Category management
│   │   ├── dashboard/         # Dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── providers.tsx      # tRPC & React Query provider
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   └── Navigation.tsx     # Main navigation component
│   ├── db/                    # Database configuration
│   │   ├── index.ts           # Database client
│   │   └── schema.ts          # Drizzle schema definitions
│   ├── server/                # tRPC server
│   │   ├── routers/           # tRPC routers
│   │   │   ├── post.ts        # Post operations
│   │   │   └── category.ts    # Category operations
│   │   ├── index.ts           # App router
│   │   └── trpc.ts            # tRPC initialization
│   └── store/                 # Zustand stores
│       └── uiStore.ts         # UI state management
├── drizzle.config.ts          # Drizzle Kit configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🗄️ Database Schema

### Posts Table
- `id` (serial, primary key)
- `title` (text, required)
- `content` (text, required)
- `slug` (text, unique, required)
- `published` (boolean, default: false)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Categories Table
- `id` (serial, primary key)
- `name` (text, required)
- `description` (text, optional)
- `slug` (text, unique, required)
- `createdAt` (timestamp)

### Posts to Categories (Junction Table)
- `postId` (foreign key to posts)
- `categoryId` (foreign key to categories)
- Composite primary key: (postId, categoryId)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud-hosted)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd "Blogging Platform"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ```

   **Database Options:**
   - **Local PostgreSQL**: `postgresql://user:password@localhost:5432/blogging_platform`
   - **Supabase**: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - **Neon**: `postgresql://[user]:[password]@[neon-hostname]/[database]?sslmode=require`

4. **Set up the database**
   
   Generate migration files:
   ```bash
   npm run db:generate
   ```

   Push schema to database:
   ```bash
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 🎯 Usage Guide

### Creating a Blog Post

1. Navigate to **Dashboard** or click **New Post** in the navigation
2. Enter a title and content (Markdown supported)
3. Select categories (optional)
4. Toggle "Publish immediately" or save as draft
5. Click **Publish Post** or **Save Draft**

### Managing Categories

1. Go to **Categories** page
2. Click **Create Category**
3. Enter name and description
4. Click **Create**
5. Edit or delete categories as needed

### Filtering Posts

1. Go to **Blog** page
2. Use the category dropdown to filter posts
3. Toggle "Published posts only" checkbox
4. Posts update automatically

### Editing Posts

1. Click on a post to view it
2. Click **Edit Post** button
3. Make changes
4. Click **Save Changes**

## 🔧 API Endpoints (tRPC)

### Post Router (`/api/trpc/post.*`)

- `post.getAll` - Get all posts (with optional filters)
- `post.getBySlug` - Get post by slug
- `post.getById` - Get post by ID
- `post.create` - Create new post
- `post.update` - Update existing post
- `post.delete` - Delete post

### Category Router (`/api/trpc/category.*`)

- `category.getAll` - Get all categories
- `category.getById` - Get category by ID
- `category.getBySlug` - Get category by slug
- `category.create` - Create new category
- `category.update` - Update existing category
- `category.delete` - Delete category

## 🎨 Design Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Spinner animations during data fetching
- **Error Handling**: User-friendly error messages
- **Status Badges**: Visual indicators for published/draft status
- **Category Pills**: Color-coded category tags
- **Markdown Support**: Rich text formatting with markdown
- **Clean UI**: Professional design with Tailwind CSS

## 🔒 Type Safety

This project leverages TypeScript and tRPC for end-to-end type safety:

- **Automatic Type Inference**: API types are automatically inferred from server to client
- **Zod Validation**: Runtime validation with Zod schemas
- **No Code Generation**: tRPC provides types without code generation
- **Type-safe Database Queries**: Drizzle ORM ensures type-safe database operations

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js 15:
- Netlify
- Railway
- Render
- AWS Amplify

## 🔮 Future Enhancements (Priority 3)

- Search functionality for posts
- Post statistics (word count, reading time)
- Dark mode support
- Rich text editor (Tiptap/Lexical)
- Image upload for posts
- Post preview functionality
- SEO meta tags
- Pagination
- User authentication
- Comments system
- Social sharing

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built as a full-stack blogging platform assessment project.

---

**Built with ❤️ using Next.js 15, tRPC, and PostgreSQL**
