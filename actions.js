const puppeteer = require('puppeteer');

const scrapeData = async (username, password) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("http://lms.adnsu.az/adnsuEducation/login.jsp");

    // Wait for the username field to be visible and type the username
    await page.waitForSelector('#username', { visible: true });
    await page.type('#username', username);

    // Wait for the password field to be visible and type the password
    await page.waitForSelector('#password', { visible: true });
    await page.type('#password', password);

    // Press Enter to submit the form
    await page.keyboard.press('Enter');


    // Wait for "Sistemlər" to be visible and click it
    await page.waitForXPath('//*[@id="header"]/div/div[1]/ul/li/a/span', { visible: true });
    const sistemler = await page.$x('//*[@id="header"]/div/div[1]/ul/li/a/span');
    if (sistemler.length > 0) await sistemler[0].click();

    // Wait for "Tədris prosesi" to be visible and click it
    await page.waitForXPath('//*[@id="header"]/div/div[1]/ul/li/ul/div/div[2]/a/small', { visible: true });
    const tedris_prosesi = await page.$x('//*[@id="header"]/div/div[1]/ul/li/ul/div/div[2]/a/small');
    if (tedris_prosesi.length > 0) {
        console.log("Tedris prosesi clicked")
        await tedris_prosesi[0].click()
    };

    // Wait for the element to be visible
    // await page.waitForXPath("//a[span[contains(text(), 'Fənn üzrə qruplar')]]", { visible: true });

    // Select the element
    // const elements_subject = await page.$x("//a[span[contains(text(), 'Fənn üzrə qruplar')]]");
    // console.log("11111")
    // await page.waitForSelector('.nav .sub-menu a');
    // console.log("222222")
    // const links = await page.$$('.nav .sub-menu a');
    // console.log(links)
    // if(links[1]) {
    //     await links[1].click();
    // } else {
    //     console.log("Link not found")
    // }

    // Click the element if it was found
    // if (elements_subject.length > 0) {
    //     await page.evaluate(element => element.click(), elements_subject[0]);
    // } else {
    //     console.log("Element not found");
    // }


    await page.waitForSelector('ul:nth-of-type(2) li:nth-of-type(2) a');
    const link = await page.$('ul:nth-of-type(2) li:nth-of-type(2) a');
    console.log(link)

    const isClicked = await link.evaluate(a => a.click());

    console.log(isClicked)


    await page.waitForXPath("//a[@class='subject_accordion_panel' and @data-subj_id='72378']", { visible: true });

    // Select the element
    const elements = await page.$x("//a[@class='subject_accordion_panel' and @data-subj_id='72378']");

    // Click the element if it was found
    if (elements.length > 0) {
        await elements[0].click();
    } else {
        console.log("Element not found");
    }


    // Wait for the element to be visible
    await page.waitForSelector("a[dataattr='1000109']", { visible: true });

    // Click the element
    await page.click("a[dataattr='1000109']");

    await page.waitForSelector('td.colm span.badge-warning')
    // Wait for the element to be visible
    const spanElement = await page.$eval('td.colm span.badge-warning', element => {
        return element.textContent; // Or you can return the whole element using 'return element.outerHTML;'
    });
    console.log(spanElement);


    console.log("Salam")
    await browser.close();

    return {text: spanElement};
}

module.exports = scrapeData;