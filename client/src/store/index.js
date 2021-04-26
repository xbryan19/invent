import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import VueQRCodeComponent from 'vue-qr-generator'
import VueQrcodeReader from "vue-qrcode-reader";

Vue.use(VueQrcodeReader);
Vue.component('qr-code', VueQRCodeComponent)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}, // default empty object
    unRegister: []
  },
  mutations: {
    CHANGE_USER_INFO: (state, data) =>{
      state.userInfo = data
    },
    GETUNREGISTER: (state, data) => {
      state.unRegister = data
    }
  },
  actions: {
    
  },
  //save to web storage
  plugins : [createPersistedState()]
})