const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const errors = [];
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3200/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const terrainReady = await page.locator('.edg-hero-art').getAttribute('data-edg-terrain-ready');
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  await page.locator('.edg-hero-art').click({ position: { x: 400, y: 260 } });

  await page.getByRole('button', { name: /join waitlist/i }).first().click();
  const waitlistOpen = await page.locator('dialog[open]').count() === 1;
  const waitlistInput = await page.locator('dialog[open] input').count() > 0;
  await page.keyboard.press('Escape');
  const waitlistClosed = await page.locator('dialog[open]').count() === 0;

  await page.getByRole('button', { name: /^Yearly/ }).click();
  const yearly = await page.getByText('Yearly plans are coming.').isVisible();
  await page.getByRole('button', { name: /^Monthly/ }).click();
  const monthly = await page.getByText('₹349').isVisible();

  await page.locator('.edg-faq-list summary').first().click();
  const faqOpen = await page.locator('.edg-faq-list details').first().evaluate(el => el.open);
  await page.locator('.edg-nav').getByRole('link', { name: 'AI Coach' }).click();
  const anchor = new URL(page.url()).hash === '#ai-coach';

  const cards = page.locator('.edg-step-cards article');
  await cards.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const box = await cards.first().boundingBox();
  await page.mouse.move(box.x + box.width * 0.77, box.y + box.height * 0.36);
  const tilt = await cards.first().evaluate(el => el.style.getPropertyValue('--edg-tilt-y'));

  let hiddenSections = [];
  const sections = page.locator('.edg-section');
  for (let i = 0; i < await sections.count(); i++) {
    const section = sections.nth(i);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const value = await section.evaluate(el => ({
      id: el.id,
      inview: el.hasAttribute('data-edg-inview'),
    }));
    if (!value.inview) hiddenSections.push(value.id);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  const reduced = await page.evaluate(() => ({
    terrain: document.querySelector('.edg-hero-art')?.hasAttribute('data-edg-terrain-ready'),
    motion: document.querySelector('.edg-page')?.getAttribute('data-edg-motion'),
    sectionOpacity: getComputedStyle(document.querySelector('.edg-section .edg-section-label')).opacity,
  }));

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto('http://localhost:3200/', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1500);
  const mobileMetrics = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth,
    terrain: document.querySelector('.edg-hero-art')?.hasAttribute('data-edg-terrain-ready'),
    awarenessRight: Math.round(document.querySelector('.edg-awareness').getBoundingClientRect().right),
    headlineRight: Math.round(document.querySelector('.edg-hero h1').getBoundingClientRect().right),
  }));
  await mobile.screenshot({ path: 'C:\\Users\\saran\\AppData\\Local\\Temp\\edg-mobile-final.png' });

  const noJsContext = await browser.newContext({ viewport: { width: 1280, height: 800 }, javaScriptEnabled: false });
  const noJs = await noJsContext.newPage();
  await noJs.goto('http://localhost:3200/', { waitUntil: 'load' });
  const noJsVisible = await noJs.locator('.edg-hero h1').isVisible() && await noJs.locator('.edg-faq').isVisible();

  console.log(JSON.stringify({ terrainReady: terrainReady !== null, desktopOverflow, waitlistOpen, waitlistInput, waitlistClosed, yearly, monthly, faqOpen, anchor, tilt, hiddenSections, reduced, mobileMetrics, noJsVisible, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
