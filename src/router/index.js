import Vue from 'vue'
import Router from 'vue-router'
import goodsList from './../views/goodsList'
import Cart from './../views/Cart'
import Address from './../views/Address'
import  OrderConfirm from "./../views/OrderConfirm";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'goodsList',
      component: goodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component:  Address
    },
    {
      path: '/orderConfirm',
      name: 'OrderConfirm',
      component:  OrderConfirm
    },
    
  ]
})
