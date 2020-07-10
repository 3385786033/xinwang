import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Home from '@/components/home'
import Login from '@/components/login'
import Order from '@/components/order'
import UserInfo from '@/components/userInfo'
import a from '@/components/a'
Vue.use(Router)

export default new Router({
  /*mode: 'history',
  base: '/history',*/
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
   /* {
      path: '/',
      name: 'a',
      component: a
    },*/
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/Order',
      name: 'Order',
      component: Order
    },
  ]
})
