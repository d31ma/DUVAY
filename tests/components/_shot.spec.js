import { test } from '../../website/node_modules/@playwright/test/index.mjs';
const pages = [['color-pickers','color'],['date-pickers','date'],['time-pickers','time']];
test('vuetify pickers', async ({ page }) => {
  for (const [slug, short] of pages) {
    await page.setViewportSize({ width: 1200, height: 1200 });
    await page.goto('https://vuetifyjs.com/en/components/'+slug+'/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `/tmp/vue-${short}.png`, fullPage: true });
    console.log(short, 'H', await page.evaluate(()=>document.body.scrollHeight));
  }
});
