import { defineCollection } from 'astro:content';
import { notionLoader } from 'notion-astro-loader';

const notionToken = import.meta.env.NOTION_TOKEN;
const papersDbId = import.meta.env.NOTION_PAPERS_DB_ID;
const postsDbId = import.meta.env.NOTION_POSTS_DB_ID;

const isNotionConfigured = (token: string, dbId: string) =>
  token && dbId && !token.includes('your_') && !dbId.includes('your_');

const papers = defineCollection({
  loader: isNotionConfigured(notionToken, papersDbId)
    ? notionLoader({
        auth: notionToken,
        database_id: papersDbId,
        filter: {
          property: 'Published',
          checkbox: { equals: true },
        },
        sorts: [
          { property: 'Publication Date', direction: 'descending' },
        ],
      })
    : { name: 'papers-placeholder', load: async () => {} },
});

const posts = defineCollection({
  loader: isNotionConfigured(notionToken, postsDbId)
    ? notionLoader({
        auth: notionToken,
        database_id: postsDbId,
        filter: {
          property: 'Published',
          checkbox: { equals: true },
        },
        sorts: [
          { property: 'Date', direction: 'descending' },
        ],
      })
    : { name: 'posts-placeholder', load: async () => {} },
});

export const collections = { papers, posts };
