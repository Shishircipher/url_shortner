import express from "express";
import PocketBase from 'pocketbase';


const app = express();
app.use(express.json());


const pb = new PocketBase('http://127.0.0.1:8090');

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.post('/shorten', async (req, res) => {
    const { original_url, expires_at } = req.body;
    if (!original_url) return res.status(400).json({ error: 'original_url is required' });
  
    let short_code;
    while (true) {
      short_code = generateShortCode();
      try {
        await pb.collection('urls').getFirstListItem(`short_code="${short_code}"`);
      } catch {
        break; // not found = valid
      }
    }
  
    const record = await pb.collection('urls').create({
      original_url,
      short_code,
      expires_at: expires_at || null
    });
  
    res.json({ short_code, original_url });
  });


  app.get('/stats/active', async (req, res) => {
    const now = new Date().toISOString();
  
    const activeUrls = await pb.collection('urls').getFullList({
      filter: `expires_at = "" || expires_at > "${now}"`,
    });
  
    const grouped = {};
    for (const url of activeUrls) {
      const day = url.created.split('T')[0];
      grouped[day] = (grouped[day] || 0) + 1;
    }
  
    const result = Object.entries(grouped).map(([date, count]) => ({ date, count }));
    const total = activeUrls.length;
  
    res.json({ total, breakdown: result });
  });



  app.get('/urls/recent', async (req, res) => {
    const urls = await pb.collection('urls').getList(1, 5, {
      sort: '-created',
    });
  
    const result = urls.items.map((url) => ({
      short_code: url.short_code,
      original_url: url.original_url,
    }));
  
    res.json(result);
  });



  app.post('/urls/batch', async (req, res) => {
    const { urls } = req.body;
    if (!Array.isArray(urls)) return res.status(400).json({ error: 'urls must be an array' });
  
    const result = [];
  
    for (const original_url of urls) {
      let short_code;
      while (true) {
        short_code = generateShortCode();
        try {
          await pb.collection('urls').getFirstListItem(`short_code="${short_code}"`);
        } catch {
          break;
        }
      }
  
      const record = await pb.collection('urls').create({
        original_url,
        short_code,
      });
  
      result.push({ short_code, original_url });
    }
  
    res.json(result);
  });

  
  app.listen(3010, () => console.log('API running on http://localhost:3010'));
        