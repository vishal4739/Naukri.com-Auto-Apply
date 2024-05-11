const express = require('express');
const puppeteer = require('puppeteer');

const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); 

app.post('/run-puppeteer-script', async (req, res) => {
    const { email, password } = req.body;

    try {
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page = await browser.newPage();

        // Navigate to the Naukri website
        await page.goto('https://www.naukri.com/');

        // Log in with the provided email and password
        await page.click('#login_Layer');
        await page.type('input[type="text"]', email);
        await page.type('input[type="password"]', password);
        await page.click('button[type="submit"]');

        // Wait for navigation to complete
        await page.waitForNavigation();

        // Navigate to the recommended jobs page
        await page.goto('https://www.naukri.com/mnjuser/recommendedjobs');

        // Simulate clicking on the "You might like" tab
        await page.click('.tab-list-item');

        // Wait for some time to ensure content is loaded
        await page.waitForTimeout(2000);

        // Capture a screenshot for reference
        await page.screenshot({ path: './Screenshot/LastState.png' });

        // Close the browser
        await browser.close();

        // Send a success response
        res.status(200).send('Puppeteer script executed successfully!');
    } catch (error) {
        console.error('Error performing search:', error);
        // Send an error response
        res.status(500).send('Error performing search');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
