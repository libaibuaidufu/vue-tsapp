const currentBookKey = 'currentBookKey'
const favListKey = "favListKey"

export function getCurrentBook() {
    const currentBook = localStorage.getItem(currentBookKey)
    return JSON.parse(currentBook)
}

export function setCurrentBook(currentBook) {
    currentBook = JSON.stringify(currentBook);
    return localStorage.setItem(currentBookKey, currentBook)
}

export function getFavList() {
    const favList = localStorage.getItem(favListKey)
    return JSON.parse(favList)
}

export function setFavList(favList) {
    favList = JSON.stringify(favList);
    return localStorage.setItem(favListKey, favList)
}

export function resetCache(){
    localStorage.removeItem(currentBookKey)
    localStorage.removeItem(favListKey)
}