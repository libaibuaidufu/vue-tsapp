import axios from './requests'

// 开发环境
export const bookInfo=(params)=>axios.get('/api/book',params)
export const bookListen=(params)=>axios.get('/api/chapter',params)
export const bookOne=(params)=>axios.get('/pc/index/getChapterUrl/bookId/'+params.bookId+'/chapterId/'+params.chapterId+'.html',{})
export const bookSearch=(params)=>axios.get("/apptingchina/appSearch",params)
export const bookOpen=(params)=>axios.get('/apptingchina/AppGetChapterUrl',params)


// app打包使用
// export const bookInfo=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/api/book',params)
// export const bookListen=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/api/chapter',params)
// export const bookSearch=(params)=>axios.get("https://app.tingxiaoshuo.cc/listen/apptingchina/appSearch",params)
// export const bookOne=(params)=>axios.get('https://www.tingxiaoshuo.cc/pc/index/getChapterUrl/bookId/'+params.bookId+'/chapterId/'+params.chapterId+'.html',{})
