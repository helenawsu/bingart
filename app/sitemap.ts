import { getBlogPosts } from 'app/explore/utils'

export const baseUrl = 'https://portfolio-blog-starter.vercel.app'

type BlogPost = {
  slug: string;
  metadata: {
    publishedAt: string;
    [key: string]: any;
  };
  [key: string]: any;
};

export default async function sitemap() {
  const blogPosts: BlogPost[] = getBlogPosts() || [];
  let blogs = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
