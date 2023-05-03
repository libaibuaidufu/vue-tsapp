import axios from './requests'

// 开发环境 或 web打包走nginx跨域
// export const bookInfo=(params)=>axios.get('/api/book',params)
// export const bookListen=(params)=>axios.get('/api/chapter',params)
// export const bookRListen=(params)=>axios.get('/api/rechapter',params)
// export const bookSearch=(params)=>axios.get("/apptingchina/appSearch",params)
// export const bookOne=(params)=>axios.get('/apptingchina/AppGetChapterUrl',params)
// export const bookChapter=(params)=>axios.get('/apptingchina/AppGetChapterUrl2022',params)


// app打包使用
export const bookInfo=(params)=>axios.get('http://app.tings8.com/listen/api/book',params)
export const bookListen=(params)=>axios.get('http://app.tings8.com/listen/api/chapter',params)
export const bookRListen=(params)=>axios.get('http://app.tings8.com/listen/api/chapter',params)
export const bookSearch=(params)=>axios.get("http://app.tings8.com/listen/apptingchina/appSearch",params)
export const bookOne=(params)=>axios.get('http://app.tings8.com/listen/apptingchina/AppGetChapterUrl2022',params)
export const bookChapter=(params)=>axios.get('http://app.tings8.com/listen/apptingchina/AppGetChapterUrl2022',params)

