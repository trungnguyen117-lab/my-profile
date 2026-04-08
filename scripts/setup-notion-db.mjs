import { readFileSync } from 'fs';

const c = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(
  c.split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const HEADERS = {
  'Authorization': `Bearer ${env.NOTION_TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

async function getDb(dbId) {
  const r = await fetch(`https://api.notion.com/v1/databases/${dbId}`, { headers: HEADERS });
  return r.json();
}

async function updateDb(dbId, properties) {
  const r = await fetch(`https://api.notion.com/v1/databases/${dbId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ properties }),
  });
  const data = await r.json();
  if (data.object === 'error') throw new Error(data.message);
  return data;
}

async function setupPostsDb() {
  console.log('Setting up Posts DB...');
  const db = await getDb(env.NOTION_POSTS_DB_ID);
  const existing = Object.keys(db.properties);
  console.log('Existing:', existing);

  const toAdd = {};
  if (!existing.includes('Summary'))
    toAdd['Summary'] = { rich_text: {} };
  if (!existing.includes('Tags'))
    toAdd['Tags'] = { multi_select: { options: [
      { name: 'AI', color: 'blue' },
      { name: 'RAG', color: 'purple' },
      { name: 'Backend', color: 'green' },
      { name: 'LangGraph', color: 'orange' },
      { name: 'MCP', color: 'pink' },
      { name: 'Research', color: 'red' },
      { name: 'Tutorial', color: 'yellow' },
    ]}};

  if (Object.keys(toAdd).length > 0) {
    await updateDb(env.NOTION_POSTS_DB_ID, toAdd);
    console.log('Added:', Object.keys(toAdd));
  } else {
    console.log('Already complete.');
  }
}

async function setupPapersDb() {
  console.log('\nSetting up Papers DB...');
  const db = await getDb(env.NOTION_PAPERS_DB_ID);
  const existing = Object.keys(db.properties);
  console.log('Existing:', existing);

  const toAdd = {};
  if (!existing.includes('Publication Date'))
    toAdd['Publication Date'] = { date: {} };
  if (!existing.includes('Authors'))
    toAdd['Authors'] = { rich_text: {} };
  if (!existing.includes('Venue'))
    toAdd['Venue'] = { select: { options: [
      { name: 'SOICT 2025', color: 'blue' },
      { name: 'Preprint', color: 'gray' },
      { name: 'Workshop', color: 'yellow' },
    ]}};
  if (!existing.includes('Status'))
    toAdd['Status'] = { select: { options: [
      { name: 'Published', color: 'green' },
      { name: 'Under Review', color: 'yellow' },
      { name: 'In Progress', color: 'orange' },
    ]}};
  if (!existing.includes('Tags'))
    toAdd['Tags'] = { multi_select: { options: [
      { name: 'ICS', color: 'red' },
      { name: 'IDS', color: 'orange' },
      { name: 'ML', color: 'blue' },
      { name: 'RAG', color: 'purple' },
      { name: 'Ensemble', color: 'pink' },
      { name: 'Agents', color: 'green' },
    ]}};
  if (!existing.includes('PDF Link'))
    toAdd['PDF Link'] = { url: {} };

  if (Object.keys(toAdd).length > 0) {
    await updateDb(env.NOTION_PAPERS_DB_ID, toAdd);
    console.log('Added:', Object.keys(toAdd));
  } else {
    console.log('Already complete.');
  }
}

async function main() {
  try {
    await setupPostsDb();
    await setupPapersDb();
    console.log('\nDone! Both databases are ready.');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

main();
