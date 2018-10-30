const AipOcrClient = require('baidu-aip-sdk').ocr
const { APP_ID, API_KEY, SECRET_KEY } = require('./config')
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY)

const identify = async (base64) => {
    await new Promise((resolve) => { setTimeout(() => resolve(), 600) })
    let data = await client.numbers(base64)
    if (!data.words_result.length) {
        return false
    } else {
        let code = data.words_result[0].words
        console.log('present code : ' + code)
        return code.length !== 4 ? false : code
    }
}

module.exports = {
    identify
}

