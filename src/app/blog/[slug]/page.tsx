import { Metadata } from "next";
import { BlogData, BlogPost } from "@/types/blog";
import { ArticleReaderClient } from "@/components/blog/ArticleReaderClient";
import { readJsonData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

// Generate dynamic academic metadata from live data store
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blogData = await readJsonData<BlogData>("blog.json");
  const post = blogData.posts?.find((p: BlogPost) => p.slug === slug);

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
  const liveBlogData = await readJsonData<BlogData>("blog.json");
  return <ArticleReaderClient slug={slug} initialData={liveBlogData} />;
}
