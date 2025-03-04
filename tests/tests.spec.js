const { test, expect } = require('@playwright/test');
const { Login } = require('../support/general');

test.describe('Test task', () => {
  let context;
  let page;
  let login1;

  test.beforeAll(async({ browser }) => {
    context = await browser.newContext(); // Create a new browser context
    page = await browser.newPage();  // Open a new page
    login1 = new Login(page);
  })

  test.beforeEach(async function() {
    await page.goto('https://www.saucedemo.com/');  // Open the website before each test
    await login1.login();
  });

  // Log out only if the test is not related to invalid login or password masking
  test.afterEach(async function () {
    const testTitle = test.info().title;

    if (testTitle !== 'Log-in with invalid creds' && testTitle !== 'Password Input Masking') {
      await login1.logout();
    }
  })

  test.afterAll(async function () {
    await context.close();  // Close the browser context after all tests
  })

  test.describe('TC-01', function () {
    test('Log-in with invalid creds', async function () {
      await page.locator('[class="bm-burger-button"]').click(); //Open menu
      await page.locator('#logout_sidebar_link').click();  //Click on the "Logout" bttn

      // Enter incorrect username and password
      await page.getByPlaceholder('Username').fill("123");
      await page.getByPlaceholder('Password', { exact: true }).fill("123");
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForTimeout(5000);

      expect(await page.locator('[class="error-message-container error"]')).toBeVisible(); // Check if error message appears

      
    })
  })

  test.describe('TC-02', function () {
    test('Password Input Masking', async function(){
      
      await page.goto('https://www.saucedemo.com/');

      
      const passwordInput = page.locator('input[type="password"]');
      await passwordInput.fill('secret_sauce'); // Enter password

      
      const value = await passwordInput.inputValue(); // Check if the entered password is correct
      expect(value).toBe('secret_sauce'); 

      
      const isPasswordMasked = await passwordInput.evaluate(input => input.type === 'password'); // Verify that the input field is of type "password" (masked)
      expect(isPasswordMasked).toBe(true); 
    })
  })

  test.describe('TC-03', function () {
    test('Complete Flow for Purchasing', async function(){
      expect(await page.locator('#item_4_title_link')).toBeVisible(); // Verify product is visible
      await page.locator('#add-to-cart-sauce-labs-backpack').click(); //Add product ot cart

      await page.locator('[class="shopping_cart_link"]').click(); //Go to the cart
      expect(await page.locator('[class="inventory_item_name"]')).toHaveText("Sauce Labs Backpack"); //Confirm item on the cart

      await page.locator('#checkout').click();
      
      // Fill checkout form
      await page.getByPlaceholder('First Name').fill("Test");
      await page.getByPlaceholder('Last Name').fill("Test1");
      await page.getByPlaceholder('Zip/Postal Code').fill("12314");
      await page.locator('[class="submit-button btn btn_primary cart_button btn_action"]').click();

    })
  })
})