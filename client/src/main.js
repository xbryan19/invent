import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import myPlugins from './plugins/myPlugins';
import VueIziToast from 'vue-izitoast'
import 'izitoast/dist/css/iziToast.css'
import 'izitoast/dist/css/iziToast.min.css'
import VueHtmlToPaper from 'vue-html-to-paper';
import VModal from 'vue-js-modal';
import VueBarcodeScanner from 'vue-barcode-scanner';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(myPlugins)
Vue.use(VueIziToast)
Vue.use(VModal)
Vue.use(VueBarcodeScanner)

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.use(VueHtmlToPaper, options);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
