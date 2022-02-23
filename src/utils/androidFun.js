// android方法请求
export function scanclick(bookId, lastChapterId) {
    const url =
        "https://www.tingxiaoshuo.cc/pc/index/getchapterurl/bookId/" +
        bookId +
        "/chapterId/" +
        lastChapterId +
        ".html";
    try {
        const params = JSON.stringify({"bookId":bookId,"chapterId":lastChapterId})
        // var str = window.androidinfo.showInfoFromJs(url);
        var str = window.androidinfo.getUrlFromRe(params);
        const res = JSON.parse(str);
        return res;
    } catch (error) {
        console.log("web运行")
        return { status: 999999,message:"fuck" };
    }
}

export function saveCurrentPath(name) {
    try {
        window.androidinfo.saveCurrentPath(name);
    } catch (error) {
        console.log("web运行")
    }
}

export function getSoft(){
    try{
        let res = window.androidinfo.getSoft();
        return res
    }catch(error){
        console.log("web运行")
        return JSON.stringify({"mes":"web运行"})
    }
}

export function resetCacheAndroid(){
    //清除cookie
    try{
        window.androidinfo.resetCache();
    }catch(error){
        console.log("web运行")
    }
}