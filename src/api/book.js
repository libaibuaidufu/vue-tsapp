import axios from './requests'

// 开发环境
export const bookInfo=(params)=>axios.get('/api/book',params)
export const bookListen=(params)=>axios.get('/api/chapter',params)
export const bookRListen=(params)=>axios.get('/api/rechapter',params)
export const bookSearch=(params)=>axios.get("/apptingchina/appSearch",params)
export const bookOne=(params)=>axios.get('/apptingchina/AppGetChapterUrl',params)
export const bookChapter=(params)=>axios.get('/apptingchina/AppGetChapterUrl2022',params)


// app打包使用
// export const bookInfo=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/api/book',params)
// export const bookListen=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/api/chapter',params)
// export const bookSearch=(params)=>axios.get("https://app.tingxiaoshuo.cc/listen/apptingchina/appSearch",params)
// export const bookOne=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/apptingchina/AppGetChapterUrl',params)
// export const bookChapter=(params)=>axios.get('https://127.0.0.1/api/bookChapter',params)

//online 走自建后端
// export const bookInfo=(params)=>axios.get('/api/book',params)
// export const bookListen=(params)=>axios.get('/api/chapter',params)
// export const bookRListen=(params)=>axios.get('/api/rechapter',params)
// export const bookSearch=(params)=>axios.get("/api/bookSearch",params)
// export const bookOne=(params)=>axios.get('/api/bookOne',params)
// export const bookChapter=(params)=>axios.get('/api/bookOne',params)
