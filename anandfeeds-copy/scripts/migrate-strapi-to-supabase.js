// Simple migration helper: fetch content from a source Strapi and POST to a destination Strapi
// Usage (example):
// SRC_URL=http://localhost:1337 DST_URL=https://your-render-strapi.example STRAPI_TOKEN=token node migrate-strapi-to-supabase.js

const axios = require('axios');

const SRC = process.env.SRC_URL || 'http://localhost:1337';
const DST = process.env.DST_URL; // required
const DST_TOKEN = process.env.STRAPI_TOKEN; // required if destination requires API token

if (!DST) {
  console.error('DST_URL is required. Set DST_URL env to destination Strapi base URL.');
  process.exit(1);
}

const axiosSrc = axios.create({ baseURL: SRC });
const axiosDst = axios.create({ baseURL: DST, headers: DST_TOKEN ? { Authorization: `Bearer ${DST_TOKEN}` } : {} });

async function migrateProducts() {
  console.log('Fetching products from source...');
  const res = await axiosSrc.get('/api/products?populate=*');
  const items = res.data.data || [];
  console.log(`Found ${items.length} products`);

  for (const it of items) {
    const payload = { data: it.attributes };
    try {
      await axiosDst.post('/api/products', payload);
      console.log('Created product', it.id);
    } catch (err) {
      console.error('Failed to create product', it.id, err.response && err.response.data ? err.response.data : err.message);
    }
  }
}

async function main() {
  try {
    // Example: migrate products. Extend for other content types similarly.
    await migrateProducts();
    console.log('Migration finished.');
  } catch (err) {
    console.error('Migration error', err.message);
  }
}

main();
