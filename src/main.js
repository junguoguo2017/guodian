// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router/index'
import '@/iconfont/iconfont.css'
import fly_ui from "./install";
Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.use(fly_ui);
let VConsole = require('../node_modules/vconsole/dist/vconsole.min');
let vConsole = new VConsole();//初始化
Vue.use(vConsole);//设为全局
new Vue({
  el: '#app',
    router,
  components: { App },
  template: '<App/>'
})
