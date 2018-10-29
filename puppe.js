const puppeteer = require('puppeteer')
const { identify } = require('./identify')
const { USER_NAME, PASS_WORD } = require('./config')

const target = 'http://passport2.chaoxing.com/login?fid=1842&refer=http://i.mooc.chaoxing.com/space/index.shtml'

const login = async (NUM_CODE) => {
    let user_input = document.querySelector('#unameId')
    let pw_input = document.querySelector('#passwordId')
    let code_input = document.querySelector('#numcode')
    let login = document.querySelector('.zl_btn_right')
    user_input.value = USER_NAME
    pw_input.value = PASS_WORD
    code_input.value = NUM_CODE
    login.click()
}

const start = async function () {
    let browser = await puppeteer.launch({ headless: false })
    let page = await browser.newPage()
    await page.goto(target)
    await page.evaluate(() => {
        // ...
    })
}

identify((res) => console.log(res))

