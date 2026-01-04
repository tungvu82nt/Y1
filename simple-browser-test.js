import http from 'node:http';
import https from 'node:https';

function checkPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('✅ Page loaded successfully!');
        console.log(`📄 Status: ${res.statusCode}`);
        console.log(`📏 Content-Length: ${data.length} bytes`);

        // Check for common error patterns in HTML
        const errorPatterns = [
          /Cannot read propert(y|ies) of null/,
          /getBoundingClientRect/,
          /TypeError/,
          /ReferenceError/,
          /Script error/,
        ];

        const foundErrors = [];
        for (const pattern of errorPatterns) {
          if (pattern.test(data)) {
            foundErrors.push(pattern.source);
          }
        }

        if (foundErrors.length > 0) {
          console.log(`❌ Potential error patterns found: ${foundErrors.join(', ')}`);
        } else {
          console.log('✅ No obvious error patterns in HTML');
        }

        // Extract some key elements
        const titleMatch = data.match(/<title>(.*?)<\/title>/);
        const rootMatch = data.match(/<div id="root">(.*?)<\/div>/s);

        console.log(`📝 Title: ${titleMatch ? titleMatch[1] : 'Not found'}`);
        console.log(`🌱 Root element: ${rootMatch ? 'Found' : 'Not found'}`);
        console.log(`🎨 Tailwind CSS: ${data.includes('tailwindcss') ? 'Detected' : 'Not detected'}`);

        resolve({
          status: res.statusCode,
          contentLength: data.length,
          errors: foundErrors,
          hasRoot: Boolean(rootMatch),
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

async function testPage() {
  try {
    console.log('🔍 Testing http://localhost:5173...');
    const result = await checkPage('http://localhost:5173');

    console.log('\n📊 SUMMARY');
    console.log('==========');
    console.log(`Status Code: ${result.status}`);
    console.log(`Content Size: ${result.contentLength} bytes`);
    console.log(`Root Element: ${result.hasRoot ? '✅ Present' : '❌ Missing'}`);
    console.log(`Error Patterns: ${result.errors.length > 0 ? '❌ ' + result.errors.join(', ') : '✅ None detected'}`);
  } catch (error) {
    console.error('❌ Failed to test page:', error?.message || error);
  }
}

testPage();