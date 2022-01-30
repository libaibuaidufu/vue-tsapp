export function saveCurrentBook(book){
    localStorage.setItem('book',JSON.stringify(book)) 
}
export function loadCurrentBook(){
    let book = localStorage.getItem('book') || '{}'
    return JSON.parse(book)
}

export function loadFavList() {
    let favList = localStorage.getItem('favList') || '[]'
    return JSON.parse(favList)
}


export function setFavList(favList) {
    favList = favList.filter((n) => n);
    favList = JSON.stringify(favList);
    localStorage.setItem("favList", favList);
}
export function removeFavSetFavList(bookId, favDict) {
    let favList = loadFavList()
    favList.filter((item, index) => {
        if (item.bookId === bookId) {
            delete favList[index];
        }
    });
    favList.push(favDict);
    setFavList(favList)
}
export function pushFavSetFavList(favDict) {
    let favList = loadFavList()
    favList.push(favDict);
    setFavList(favList)
}
export function isFav(bookId) {
    let favList = loadFavList()
    let is_fav = false
    favList.filter((item) => {
        if (item.bookId === bookId) {
            is_fav = true
        }
    });
    return is_fav
}
export function getFav(bookId,defaultFav={}) {
    let favList = loadFavList()
    let fav = defaultFav
    favList.filter((item) => {
        if (item.bookId === bookId) {
            fav = item
        }
    });
    return fav
}