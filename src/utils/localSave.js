const currentBookKey = 'currentBookKey'
const favListKey = "favListKey"
const settingKey = "settingKey"
const loadTimeKey = "loadTimeKey" 

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
export function getSettings() {
    const settings = localStorage.getItem(settingKey)
    return JSON.parse(settings)
}

export function setSettings(settings) {
    settings = JSON.stringify(settings);
    return localStorage.setItem(settingKey, settings)
}


export function getBookChapterRunTime() {
    const chapterTimeList = localStorage.getItem(loadTimeKey)
    return JSON.parse(chapterTimeList)
}

export function setBookChapterRunTime(chapterTimeList) {
    chapterTimeList = JSON.stringify(chapterTimeList);
    return localStorage.setItem(loadTimeKey, chapterTimeList)
}

export function resetCache() {
    localStorage.removeItem(currentBookKey)
    localStorage.removeItem(favListKey)
    localStorage.removeItem(settingKey)
}
