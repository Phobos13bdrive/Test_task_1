const { expect } = require('@playwright/test');

class Login{
    constructor(page) {
        this.page = page;
    }

    //Log-in
    async login() {
        await this.page.locator('#user-name').fill("standard_user");
        await this.page.locator('#password', { exact: true }).fill("secret_sauce");
        await this.page.locator('#login-button', { name: 'Login' }).click();
        await this.page.waitForTimeout(5000);
    }

    //Log-out
    async logout() {
        await this.page.locator('[class="bm-burger-button"]').click();
        await this.page.locator('#logout_sidebar_link').click();
    }
}

module.exports = { Login};