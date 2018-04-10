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
import axios from "axios";
import NavHeader from "@/components/header.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavBread from "@/components/NavBread.vue";
import Model from "@/components/Model.vue";
export default {
  data() {
    return {
      msg: "hello vue",
    };
  },
 
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Model
  }
};
</script>