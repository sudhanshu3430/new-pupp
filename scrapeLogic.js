const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://www.amazon.in/BRUTON-Lite-Sport-Shoes-Running/dp/B0DHH7TMQ1");

    // // Set screen size
    // await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    // await page.type(".search-box__input", "automate beyond recorder");

    // // Wait and click on first result
    // const searchResultSelector = ".search-box__link";
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);

    // // Locate the full title with a unique string
    // const textSelector = await page.waitForSelector(
    //   "text/Customize and automate"
    // );
    // const fullTitle = await textSelector.evaluate((el) => el.textContent);

    // // Print the full title
    // const logStatement = `The title of this blog post is ${fullTitle}`;
    // console.log(logStatement);
            // Extract product title
            const productTitle = await page.$eval('#title',el => el.innerText.trim());

            // Extract product price
            const productPrice = await page.$eval('.a-price .a-offscreen', el => el.innerText.trim());
            
            // Extract product description
            const productDesc = await page.$$eval('.a-list-item', items => {
                return items.map(item => item.innerText.trim()).filter(text => text); // Extract inner text and filter out empty entries
            });
    res.send(productTitle, productDesc, productPrice);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
