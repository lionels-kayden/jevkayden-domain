import { Metadata } from "next";
import initialBlogData from "@/data/blogData.json";
import { BlogData, BlogPost } from "@/types/blog";
import { ArticleReaderClient } from "@/components/blog/ArticleReaderClient";

const blogData = initialBlogData as unknown as BlogData;

// Allow blocking route resolution for dynamic article slug in partial prerendering
export const instant = false;

// Generate static params for build-time static generation
export async function generateStaticParams() {
  if (!blogData.posts || blogData.posts.length === 0) {
    return [{ slug: "_empty" }];
  }
  return blogData.posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

// Generate dynamic academic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData.posts.find((p: BlogPost) => p.slug === slug);

  if (!post) {
    return {
      title: "Paper Not Found | IEEE Academic Repository",
    };
  }

  const titleVi = post.title.vi;
  const excerptVi = post.excerpt.vi;

  return {
    title: `${post.paperId}: ${titleVi} | VNU-UET Research`,
    description: excerptVi,
    authors: [{ name: "Nguyễn Quang Thắng (jevkayden)" }],
    keywords: post.tags,
  };
}

export default async function SingleArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleReaderClient slug={slug} />;
}
