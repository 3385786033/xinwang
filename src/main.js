// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//播放器
import 'bootstrap/dist/css/bootstrap.css'
//直播评论
// mint ui
import Mint from 'mint-ui';
Vue.use(Mint);
//muse
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Loading from 'muse-ui-loading';
Vue.use(Loading);
Vue.use(MuseUI);
//icon图标
import "@/assets/icon/iconfont.css"
//微信分享
import wx from 'weixin-js-sdk'
//请求

window.fns = {

};
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$qs = qs
axios.defaults.baseURL = 'http://xielei.test.xw518.com'
axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Accept': 'application/json',
      'Authorization': JSON.parse(decodeURI(localStorage.getItem('authstrLogin')))
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  })
Vue.use(function(Vue){
  Vue.prototype.$axios = axios
})
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
