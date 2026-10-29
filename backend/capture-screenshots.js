const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
  const screenshotsDir = path.resolve(__dirname, '../screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  console.log('Launching browser to capture GenZ Fits screenshots...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  console.log('1. Navigating to catalog...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Screenshot 1: Full product listing
  console.log('2. Capturing 01-product-listing.png...');
  await page.screenshot({ path: path.join(screenshotsDir, '01-product-listing.png'), fullPage: false });

  // Screenshot 2: Product Details modal
  console.log('3. Opening product detail modal for #1...');
  const firstCard = await page.$('.product-card');
  if (firstCard) {
    await firstCard.click();
    await new Promise(r => setTimeout(r, 1000));
    console.log('   Capturing 02-product-details.png...');
    await page.screenshot({ path: path.join(screenshotsDir, '02-product-details.png'), fullPage: false });

    // Close modal
    const closeBtn = await page.$('.modal-close-btn');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Screenshot 3: Search and category filter
  console.log('4. Performing search & filter for "trench"...');
  const searchInput = await page.$('.search-input');
  if (searchInput) {
    await searchInput.type('trench', { delay: 50 });
    await new Promise(r => setTimeout(r, 1000));
    console.log('   Capturing 03-search-and-filter.png...');
    await page.screenshot({ path: path.join(screenshotsDir, '03-search-and-filter.png'), fullPage: false });

    // Clear search
    const clearBtn = await page.$('.search-clear-btn');
    if (clearBtn) await clearBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Screenshot 4: Empty state
  console.log('5. Triggering empty state with non-existent query...');
  const searchInput2 = await page.$('.search-input');
  if (searchInput2) {
    await searchInput2.type('nonexistentitem999', { delay: 50 });
    await new Promise(r => setTimeout(r, 1000));
    console.log('   Capturing 04-empty-state.png...');
    await page.screenshot({ path: path.join(screenshotsDir, '04-empty-state.png'), fullPage: false });
  }

  await browser.close();
  console.log('\n✓ ALL 4 SCREENSHOTS CAPTURED AND SAVED IN screenshots/ FOLDER!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
