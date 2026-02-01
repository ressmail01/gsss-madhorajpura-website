const { chromium } = require('playwright');
const path = require('path');

async function testSchoolWebsite() {
    console.log('Starting website test...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const projectRoot = '/workspace/gsss-madhorajpura';
    const pages = [
        'index.html',
        'about.html',
        'academics.html',
        'admissions.html',
        'faculty.html',
        'gallery.html',
        'achievements.html',
        'contact.html'
    ];
    
    let allPassed = true;
    const errors = [];
    
    // Listen for console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(`Console Error: ${msg.text()}`);
        }
    });
    
    page.on('pageerror', err => {
        errors.push(`Page Error: ${err.message}`);
    });
    
    for (const pageName of pages) {
        const filePath = `file://${path.join(projectRoot, pageName)}`;
        console.log(`\nTesting: ${pageName}`);
        
        try {
            await page.goto(filePath, { waitUntil: 'networkidle' });
            
            // Check if page loaded successfully
            const title = await page.title();
            console.log(`  ✓ Page loaded: ${title}`);
            
            // Check for essential elements
            const header = await page.$('.header');
            const footer = await page.$('.footer');
            const mainContent = await page.$('.container');
            
            if (header) {
                console.log('  ✓ Header present');
            } else {
                console.log('  ✗ Header missing');
                allPassed = false;
            }
            
            if (footer) {
                console.log('  ✓ Footer present');
            } else {
                console.log('  ✗ Footer missing');
                allPassed = false;
            }
            
            if (mainContent) {
                console.log('  ✓ Main content container present');
            } else {
                console.log('  ✗ Main content container missing');
                allPassed = false;
            }
            
            // Check for navigation links
            const navLinks = await page.$$('.nav-link');
            console.log(`  ✓ Navigation links found: ${navLinks.length}`);
            
            // Check page-specific content
            if (pageName === 'index.html') {
                const heroSection = await page.$('.hero');
                if (heroSection) {
                    console.log('  ✓ Hero section present on home page');
                } else {
                    console.log('  ✗ Hero section missing on home page');
                    allPassed = false;
                }
            }
            
            if (pageName === 'contact.html') {
                const contactForm = await page.$('#contactForm');
                if (contactForm) {
                    console.log('  ✓ Contact form present on contact page');
                } else {
                    console.log('  ✗ Contact form missing on contact page');
                    allPassed = false;
                }
            }
            
        } catch (err) {
            console.log(`  ✗ Error loading page: ${err.message}`);
            allPassed = false;
        }
    }
    
    console.log('\n--- Test Summary ---');
    if (errors.length > 0) {
        console.log('Console/Page Errors:');
        errors.forEach(e => console.log(`  - ${e}`));
    } else {
        console.log('No console errors detected!');
    }
    
    if (allPassed) {
        console.log('\n✓ All tests passed!');
    } else {
        console.log('\n✗ Some tests failed. Please review the issues above.');
    }
    
    await browser.close();
    return allPassed;
}

testSchoolWebsite()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('Test failed with error:', err);
        process.exit(1);
    });
