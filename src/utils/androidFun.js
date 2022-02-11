// android方法请求
export function scanclick(bookId, lastChapterId) {
    const url =
        "https://www.tingxiaoshuo.cc/pc/index/getchapterurl/bookId/" +
        bookId +
        "/chapterId/" +
        lastChapterId +
        ".html";
    try {
        var str = window.androidinfo.showInfoFromJs(url);
        const res = JSON.parse(str);
        return res;
    } catch (error) {
        return { status: 0 };
    }
}

export function saveCurrentPath(name) {
    try {
        window.androidinfo.saveCurrentPath(name);
    } catch (error) {
        console.log("web运行")
    }
}