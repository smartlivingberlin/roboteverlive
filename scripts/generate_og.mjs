import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

const products = JSON.parse(await fs.readFile('data/products.json','utf-8'));
await fs.mkdir('img/og', {recursive:true});

const browser = await puppeteer.launch({args:['--no-sandbox']});
const page = await browser.newPage();
await page.setViewport({width:1200,height:630,deviceScaleFactor:1});

const fileUrl = 'file://' + path.resolve('assets/og-template.html');

for (const p of products){
  const q = new URLSearchParams({
    title: p.name.slice(0,60),
    brand: p.brand||'',
    subtitle: p.category,
    image: p.image||'',
    tags: (p.tags||[]).slice(0,3).join(',')
  });
  await page.goto(`${fileUrl}?${q.toString()}`, {waitUntil:'networkidle2', timeout:60000});
  await page.screenshot({path:`img/og/${p.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`});
  console.log('OG created for', p.name);
}
await browser.close();
