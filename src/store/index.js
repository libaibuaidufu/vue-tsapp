import Vue from 'vue';
import Vuex from 'vuex';
import { getCurrentBook, setCurrentBook, getFavList, setFavList } from '../utils/localSave'
Vue.use(Vuex);
const state = {   //要设置的全局访问的state对象
    favList: getFavList() || [],
    searchList: [],
    currentBook: Object.assign({}, getCurrentBook()) || {
        bookId: 0,
        bookIntro: {},
        lastChapterTitle: '',
        lastChapterId: 0,
        lastChapterTime: 0,
        fav: false,
        skip_start_time: 0,
        skip_end_time: 0,
        currentBookListen: []
    },
    isShow:false,
    isPlay:false,
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
    getIsPlay(){
        return state.isPlay
    },
    getIsShow(){
        return state.isShow
    }
};
const mutations = {
    newFavList(state, favList) {
        state.favList = favList
    },
    newSearchList(state, searchList) {
        state.searchList = searchList
    },
    newCurrentBook(state, currentBook) {
        state.currentBook = currentBook
    },
    changeIsPlay(state,isPlay){
        state.isPlay = isPlay
    },
    changeIsShow(state,isShow){
        state.isShow = isShow
    }
};
const actions = {
    updateIsPlay(context,isPlay){
        context.commit('changeIsPlay', isPlay)
    },
    updateIsShow(context,isShow){
        window.androidinfo.saveShow(isShow)
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
        console.log('222', favList)
        favList.push(fav)
        setFavList(favList)
        context.commit('newFavList', favList)
    },
    delFav(context, bookId) {
        let favList = getters.getFavList();
        favList.filter((item, index) => {
            if (item.bookId === bookId) {
                delete favList[index];
            }
        });
        setFavList(favList)
        context.commit('newFavList', favList)
    },
    updateFav(context, fav) {
        setCurrentBook(fav)
        let favList = getters.getFavList();
        favList.filter((item, index) => {
            if (item.bookId === fav.bookId) {
                favList[index] = fav
            }
        });
        setFavList(favList)
        context.commit('newFavList', favList)
    }
};
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
export default store;