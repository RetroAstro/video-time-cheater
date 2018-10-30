const puppeteer = require('puppeteer')
const { identify } = require('./identify')
const { USER_NAME, PASS_WORD } = require('./config')

const target = 'http://passport2.chaoxing.com/login?fid=1842&refer=http://i.mooc.chaoxing.com/space/index.shtml'

const getImageBase64 = () => {
    return new Promise((resolve) => {
        let span = document.querySelector('.table_nvc span')
        span.click()
        let img = document.querySelector('.table_nvc img')
        img.onload = () => {
            let image = getBase64Image(img)
            let base64 = image.split(',')[1]
            resolve(base64)
        }
        function getBase64Image(img) {
            var canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            var ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, img.width, img.height)
            var dataURL = canvas.toDataURL("image/jpeg")
            canvas = null
            return dataURL
        }
    })
}

const submit = ({USER_NAME, PASS_WORD, NUM_CODE}) => {
    let user_input = document.querySelector('#unameId')
    let pw_input = document.querySelector('#passwordId')
    let code_input = document.querySelector('#numcode')
    let login = document.querySelector('.zl_btn_right')
    user_input.value = USER_NAME
    pw_input.value = PASS_WORD
    code_input.value = NUM_CODE
    login.click()
}

const start = async () => {
    let browser = await puppeteer.launch({ headless: false })
    let page = await browser.newPage()
    await page.goto(target)
    const getFourBitCode = async () => {
        let base64 = await page.evaluate(getImageBase64)
        let success = await identify(base64)
        return success ? success : getFourBitCode()
    }
    let NUM_CODE = await getFourBitCode()
    console.log('four bit code : ' + NUM_CODE)
    await page.evaluate(submit, { USER_NAME, PASS_WORD, NUM_CODE })
    await page.waitFor(2000)
    let url = await page.evaluate(() => window.frames['frame_content'].document.querySelectorAll('.Mcon1img a')[0].getAttribute('href'))
    await page.goto(url)
    await page.waitFor(2000)
    await page.evaluate(() => document.querySelectorAll('.timeline a')[1].click())
}

start()

