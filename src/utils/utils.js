export function abc(u) {
    var tArr = u.split("*"),
        str = "";
    for (var i = 0, n = tArr.length; i < n; i++) {
        str += String.fromCharCode(tArr[i]);
    }
    console.log(str)
    return str;
}


export function realFormatSecond(second) {
    var secondType = typeof second;

    if (secondType === "number" || secondType === "string") {
        second = parseInt(second);

        var hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        var mimute = Math.floor(second / 60);
        second = second - mimute * 60;

        return (
            hours +
            ":" +
            ("0" + mimute).slice(-2) +
            ":" +
            ("0" + second).slice(-2)
        );
    } else {
        return "0:00:00";
    }
}


export function getFavBookByBookId(favList, bookId) {
    let favBook ;
    console.log(favList)
    favList.filter((item) => {
        console.log(item)
        if (item&&item.bookId === bookId) {
            favBook = item
        }
    });
    console.log('fav',favBook)
    return favBook

}
export function getSearchBookByBookId(searchList, bookId) {
    let searchBook;
    searchList.filter((item) => {
        if (item&&item.id === bookId) {
            searchBook = item
        }
    });
    console.log('search',searchBook)
    return searchBook
}

