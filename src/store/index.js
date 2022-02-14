import Vue from 'vue';
import Vuex from 'vuex';
import { getCurrentBook, setCurrentBook, getFavList, setFavList ,getSettings,setSettings,getBookChapterRunTime,setBookChapterRunTime} from '../utils/localSave'
Vue.use(Vuex);
const state = {   //要设置的全局访问的state对象
    favList: getFavList() || [],
    searchList: [],
    currentBook: Object.assign({}, getCurrentBook()) || {
        bookId: 0,
        bookIntro: {},
        lastChapterTitle: '',
        lastChapterId: 0,
        fav: false,
        skip_start_time: 0,
        skip_end_time: 0,
        currentBookListen: []
    },
    settings:getSettings()|| {
        is_rellay_link: false,
    },
    bookChapterRunTime:getBookChapterRunTime()||[],
    isShow: false,
    isPlay: false,
    isSettings: false,
    //要设置的初始属性值
};
const getters = {   //实时监听state值的变化(最新状态)
    getFavList() {
        return state.favList
    },
    getSearchList() {
        return state.searchList
    },
    getCurrentBook() {
        return state.currentBook
    },
    getIsPlay() {
        return state.isPlay
    },
    getIsShow() {
        return state.isShow
    },
    getIsSettings() {
        return state.isSettings
    },
    getSettings(){
        return state.settings
    },
    getBookChapterRunTime(){
        return state.bookChapterRunTime
    }
};
const mutations = {
    newBookChapterRunTime(state,chapterList){
        state.bookChapterRunTime = chapterList
    },
    newFavList(state, favList) {
        state.favList = favList
    },
    newSearchList(state, searchList) {
        state.searchList = searchList
    },
    newCurrentBook(state, currentBook) {
        state.currentBook = currentBook
    },
    changeIsPlay(state, isPlay) {
        state.isPlay = isPlay
    },
    changeIsShow(state, isShow) {
        state.isShow = isShow
    },
    changeIsSettings(state, isSettings) {
        state.isSettings = isSettings
    },
    changeSettings(state, settings) {
        state.settings = settings
    }
};
const actions = {
    updateBookChapterRunTime(context,chapterList){
        setBookChapterRunTime(chapterList)
        context.commit('newBookChapterRunTime', chapterList)
    },
    updateSettings(context,settings){
        setSettings(settings)
        context.commit('changeSettings', settings)
    },
    updateIsPlay(context, isPlay) {
        context.commit('changeIsPlay', isPlay)
    },
    updateIsSettings(context, isSettings) {
        context.commit('changeIsSettings', isSettings)
    },
    updateIsShow(context, isShow) {
        try {
            window.androidinfo.saveShow(isShow)
        } catch (error) {
            console.log('web运行')
        }
        context.commit('changeIsShow', isShow)
    },
    updateFavList(context, favList) {
        setFavList(favList)
        context.commit('newFavList', favList)
    },
    setSearchList(context, searchList) {
        context.commit('newSearchList', searchList)
    },
    updateCurrentBook(context, currentBook) {
        setCurrentBook(currentBook)
        context.commit('newCurrentBook', currentBook)
    },
    addFav(context, fav) {
        let favList = getters.getFavList();
        favList.push(fav)
        favList = favList.filter(i => i)
        setFavList(favList)
        context.commit('newFavList', favList)
    },
    delFav(context, bookId) {
        let favList = getters.getFavList();
        favList.filter((item, index) => {
            if (item && item.bookId === bookId) {
                delete favList[index];
            }
        });
        favList = favList.filter(i => i)
        setFavList(favList)
        context.commit('newFavList', favList)
    },
    updateFav(context, fav) {
        setCurrentBook(fav)
        let favList = getters.getFavList();
        favList.filter((item, index) => {
            if (item && item.bookId === fav.bookId) {
                favList[index] = fav
            }
        });
        favList = favList.filter(i => i)
        setFavList(favList)
        context.commit('newFavList', favList)
    },
    resetCache(context) {
        context.commit('newFavList', [])
        context.commit('newCurrentBook', {
            bookId: 0,
            bookIntro: {},
            lastChapterTitle: '',
            lastChapterId: 0,
            lastChapterTime: 0,
            fav: false,
            skip_start_time: 0,
            skip_end_time: 0,
            currentBookListen: []
        })

    }
};
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
export default store;