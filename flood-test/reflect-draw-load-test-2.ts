import { step, TestSettings, By, beforeAll, afterAll } from "@flood/element";

export const settings: TestSettings = {
  clearCache: true,
  disableCache: true,
  waitTimeout: 30,
  screenshotOnFailure: true,
  stepDelay: 7.5,
  actionDelay: 7.5,
  browser: "chrome",
  //viewport: { width: 1024, height: 768 },
  };

export default () => {
  beforeAll(async (browser) => {
    const startDelay = 500 + Math.random() * 500; // Random start delay between 500ms to 1000ms
    await browser.wait(`${startDelay}ms`);
  });

  afterAll(async (browser) => {
    await browser.wait("700ms");
  });

  step("Start", async (browser) => {
    //await browser.visit("https://reflect-draw-cesar-load-test.vercel.app/d/QRT19V");
    await browser.visit("https://reflect-draw-cesar-load-test.vercel.app/d/JY_ZU8");
  });


  for (var i = 1; i < 10; i++) {
    //waits a while viewing the video stream
    step('Move cursor - ' + i, async (browser) => {

      for (let i = 0; i < 60; i++) {
        const randomX = Math.floor(Math.random() * 1024);
        const randomY = Math.floor(Math.random() * 768);
        await browser.page.mouse.move(randomX, randomY, { steps: 100 });
      }

      //await browser.wait(20)
      await browser.takeScreenshot()
    })
  } 
};

