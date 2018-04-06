<template>
  <div>
    <nav-header></nav-header>
        <nav-bread>
            <span>goods</span>
        </nav-bread>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import NavHeader from "@/components/header.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavBread from "@/components/NavBread.vue";
export default {
  data() {
    return {
      msg: "hello vue",
      goodslist: [
        {
          name: "小爱同学",
          price: 199,
          img: "1.jpg"
        },
        {
          name: "小米6",
          price: 1199,
          img: "2.jpg"
        },
        {
          name: "电视",
          price: 2999,
          img: "3.jpg"
        },
        {
          name: "空调",
          price: 4999,
          img: "4.jpg"
        }
      ]
    };
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  }
};
</script>