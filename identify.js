const fs = require('fs')
const request = require('request')
const AipOcrClient = require('baidu-aip-sdk').ocr
const { APP_ID, API_KEY, SECRET_KEY } = require('./config')
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY)

const imgName = 'code.jpg'
const imgUrl = 'http://passport2.chaoxing.com/num/code?1540780312488.jpg'

const saveImage = () => {
    return new Promise((resolve) => {
        request(imgUrl)
        .pipe(fs.createWriteStream(imgName))
        .on('close', () => resolve())
    })
}

const identify = async () => {
    await saveImage()
    let image = fs.readFileSync(imgName).toString('base64')
    let data = await client.numbers(image)
    if (!data.words_result.length) {
        return identify()
    } else {
        let code = Number(data.words_result[0].words)
        console.log('present code : ' + code)
        return code.toString().length !== 4 ? identify() : code
    }
}

module.exports = {
    identify
}

