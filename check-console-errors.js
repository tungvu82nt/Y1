// Script to check for JavaScript errors by visiting the page (ESM)
import puppeteer from 'puppeteer';

async function checkConsoleErrors() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const errors = [];

    page.on('console', (msg) => {
      const payload = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
      };

      if (msg.type() === 'error') {
        errors.push(payload);
      }

      console.log(`📝 ${payload.type}: ${payload.text}`);
    });

    page.on('pageerror', (error) => {
      errors.push({
        type: 'pageerror',
        message: error.message,
        stack: error.stack,
      });
    });

    page.on('requestfailed', (request) => {
      errors.push({
        type: 'requestfailed',
        message: request.failure()?.errorText || 'request failed',
        url: request.url(),
      });
    });

    console.log('🌐 Loading page...');
    await page.goto('http://localhost:5173', {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    // Wait a bit for late errors
    await new Promise((r) => setTimeout(r, 3000));

    console.log('\n📊 CONSOLE ANALYSIS RESULTS');
    console.log('==========================');

    if (errors.length === 0) {
      console.log('✅ No JavaScript errors found!');
    } else {
      console.log(`❌ Found ${errors.length} issues:`);
      errors.forEach((e, i) => {
        console.log(`\n${i + 1}. ${String(e.type).toUpperCase()}`);
        console.log(`   Message: ${e.text || e.message || ''}`);
        if (e.location?.url) {
          console.log(`   Location: ${e.location.url}:${e.location.lineNumber || ''}`);
        }
        if (e.url) {
          console.log(`   URL: ${e.url}`);
        }
        if (e.stack) {
          console.log(`   Stack: ${String(e.stack).slice(0, 500)}...`);
        }
      });
    }

    await page.screenshot({ path: 'page-screenshot.png', fullPage: true });
    console.log('\n📸 Saved screenshot: page-screenshot.png');
  } catch (error) {
    console.error('❌ Failed to check console errors:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkConsoleErrors();