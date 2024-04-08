import {
  step,
  TestSettings,
  Until,
  By,
  beforeAll,
  afterAll,
} from "@flood/element";

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
    await browser.visit(
      "https://app-staging.workcanvas.com/d/ATKEZArO6WpLWHKba9Qg8PnPUq1OFvbq"
    );
  });

  step("Login", async (browser) => {
    const inputName = await browser.findElement(
      By.css("input[class^='anonymous-user-login_name']")
    );
    await inputName.type(Math.random().toString(36).substring(7));

    const btnSubmit = await browser.findElement(
      By.css("div[class^='anonymous-user-login_submitButton']")
    );
    await btnSubmit.click();
  });

 //for (var i = 1; i < 60; i++) {
    step("Move cursor - " , async (browser) => {
      for (let i = 0; i < 60; i++) {
        const randomX = Math.floor(Math.random() * 1024);
        const randomY = Math.floor(Math.random() * 768);
        await browser.page.mouse.move(randomX, randomY, { steps: 100 });
      }
    });
  //}
};
