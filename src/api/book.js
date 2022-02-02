import axios from './requests'
export const bookInfo=(params)=>axios.get('/api/book',params)

// 开发环境
export const bookListen=(params)=>axios.get('/api/chapter',params)
//https://www.tingxiaoshuo.cc/pc/index/getchapterurl/bookId/12323/chapterId/3848618.html
export const bookOne=(params)=>axios.pcget('/pc/index/getChapterUrl/bookId/'+params.bookId+'/chapterId/'+params.chapterId+'.html',{})
//https://www.tingxiaoshuo.cc/pc/index/search.html?keyword={{key}}&page={{page}}
export const bookSearch=(params)=>axios.get("/apptingchina/appSearch",params)
///listen/apptingchina/AppGetChapterUrl?uid=74beb3c4ffd8ee73&chapterId=3498964&bookId=10704
export const bookOpen=(params)=>axios.get('/apptingchina/AppGetChapterUrl',params)


// app打包使用
// export const bookInfo=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/api/book',params)
// export const bookListen=(params)=>axios.get('https://app.tingxiaoshuo.cc/listen/api/chapter',params)
// export const bookSearch=(params)=>axios.get("https://app.tingxiaoshuo.cc/listen/apptingchina/appSearch",params)
// export const bookOne=(params)=>axios.get('https://www.tingxiaoshuo.cc/pc/index/getChapterUrl/bookId/'+params.bookId+'/chapterId/'+params.chapterId+'.html',{})
