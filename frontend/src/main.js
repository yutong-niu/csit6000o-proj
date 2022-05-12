import Vue from 'vue'
import VueRouter from 'vue-router'


import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
import App from './App'
import router from './router'
import vuetify from '@/plugins/vuetify'
import store from './store/store'
import {
  components
} from 'aws-amplify-vue';

import CartButton from "@/components/CartButton.vue";
import CartDrawer from "@/components/CartDrawer.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import Product from "@/components/Product.vue";
import CartQuantityEditor from "@/components/CartQuantityEditor.vue"

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuelidate)
Vue.use(VueMask);

Vue.component('cart-button', CartButton)
Vue.component('cart-drawer', CartDrawer)
Vue.component('loading-overlay', LoadingOverlay)
Vue.component('product', Product)
Vue.component('cart-quantity-editor', CartQuantityEditor)


new Vue({
  render: h => h(App),
  router,
  vuetify,
  store,
  components: {
    ...components
  }
}).$mount('#app')
