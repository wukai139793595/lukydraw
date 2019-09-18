import Vue from 'vue'
import Router from 'vue-router'
import show from '@/components/show'
import login from '@/components/login'
import bind from '@/components/bind'
import index from '@/components/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'index',
      component:index,
      meta:{
        title:'抽签活动',
        requireAuth:true
      }
    },
    {
      path:'/show',
      name:'show',
      component:show,
      meta:{
        title:'商铺展示',
        requireAuth:true
      }
    },
    {
      path:'/login',
      name:'login',
      component:login,
      meta:{
        title:'系统登录'
      }
    },
    {
      path:'/bind',
      name:'bind',
      component:bind,
      meta:{
        title:'关系绑定',
        requireAuth:true
      }
    }
  ]
})
