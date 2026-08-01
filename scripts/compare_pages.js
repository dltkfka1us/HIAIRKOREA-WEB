const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Starting Playwright comparison script...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // 1. GAS Live Site
  console.log('1. Navigating to GAS Live Site...');
  const pageGas = await context.newPage();
  try {
    await pageGas.goto('https://script.google.com/macros/s/AKfycbwSv-W1V0Kb6PXZtqR1N_PqT54G7ALh6OpIdYryxxhfg-MFvbGLmHZSUbs4Ri7K2Y03/exec', { waitUntil: 'networkidle', timeout: 30000 });
    await pageGas.waitForTimeout(5000); // Wait for async dynamic rendering
    const gasScreenshotPath = path.join(__dirname, 'gas_home.png');
    await pageGas.screenshot({ path: gasScreenshotPath, fullPage: true });
    console.log(`GAS Screenshot saved to ${gasScreenshotPath}`);

    const gasTitle = await pageGas.title();
    const gasText = await pageGas.evaluate(() => document.body.innerText.slice(0, 1500));
    console.log('GAS Title:', gasTitle);
    console.log('GAS Body Snippet:', gasText.replace(/\n+/g, ' '));
  } catch (err) {
    console.error('Error fetching GAS site:', err.message);
  }

  // 2. Vercel Live Site
  console.log('2. Navigating to Vercel Live Site...');
  const pageVercel = await context.newPage();
  try {
    await pageVercel.goto('https://hiairkorea-web.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
    await pageVercel.waitForTimeout(3000);
    const vercelScreenshotPath = path.join(__dirname, 'vercel_home.png');
    await pageVercel.screenshot({ path: vercelScreenshotPath, fullPage: true });
    console.log(`Vercel Screenshot saved to ${vercelScreenshotPath}`);

    const vercelText = await pageVercel.evaluate(() => document.body.innerText.slice(0, 1500));
    console.log('Vercel Body Snippet:', vercelText.replace(/\n+/g, ' '));
  } catch (err) {
    console.error('Error fetching Vercel site:', err.message);
  }

  await browser.close();
  console.log('Playwright comparison completed!');
})();
