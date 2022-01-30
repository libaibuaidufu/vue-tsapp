import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component:Layout,
    redirect: '/bookSearch',
    children: [
      {
        path: 'bookSearch',
        name:'BookSearch',
        component: () => import('../views/BookSearch.vue'),
        meta:{title:"搜索",isReturn:false},
      },{
        path: 'addOne',
        name:'AddOne',
        meta:{title:"收藏",isReturn:false},
        component: () => import('../views/AddOne.vue'),
      },{
        path: 'bookInfo',
        name:'BookInfo',
        meta:{title:"详情",isReturn:true},
        component: () => import('../views/BookInfo.vue'),
      }
    ]
  },{
    path:'/playMusic',
    name:'PlayMusic',
    component:()=>import('../views/PlayMusic.vue')
  }
]

const router = new VueRouter({
  // mode: 'history',   // 模式，默认hash
  routes
})

export default router
