import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE, METADATA } from 'astrowind:config';
import { fetchPosts } from '~/utils/blog';
import { getCanonical } from '~/utils/permalinks';

export const GET: APIRoute = async () => {
  const posts = await fetchPosts();

  return rss({
    title: SITE.name,
    description: METADATA?.description ?? '',
    site: SITE.site,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishDate,
      link: String(getCanonical(post.permalink)),
      categories: post.category ? [post.category.title] : undefined,
      author: post.author,
    })),
    customData: '<language>en-us</language>',
  });
};
