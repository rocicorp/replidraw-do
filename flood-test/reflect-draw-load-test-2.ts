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
    await browser.visit("https://reflect-draw-cesar-load-test.vercel.app/d/QRT19V");
  });


  for (var i = 1; i < 300; i++) {
    //waits a while viewing the video stream
    step('Move cursor - ' + i, async (browser) => {

      const rectangles = await browser.findElements(By.css("svg > rect"));
      console.log(rectangles);

      for (let rect of shuffleArray(rectangles)) {
        const center = await rect.centerPoint();
        await browser.page.mouse.move(center[0], center[1]);
        
        // Randomize the x and y coordinates within a range
        const randomX = Math.floor(Math.random() * 20) + 800;
        const randomY = Math.floor(Math.random() * 20) + 600;
        await browser.page.mouse.move(randomX, randomY, { steps: 100 } );
      }

      //await browser.wait(20)
      await browser.takeScreenshot()
    })
  } 
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}
