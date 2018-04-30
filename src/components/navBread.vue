<template>
  <div>
      <div class="nav-breadcrumb-wrap">
  <div class="container">
    <nav class="nav-breadcrumb">
      <a href="/">Home</a>
      <slot></slot>
    </nav>
  </div>
</div>
  </div>
</template>
<style>
.bread {
  height: 45px;
  line-height: 45px;
  background-color: #f0f0f0;
}
.bread-wrap {
  padding: 0 10px;
  font-size: 14px;
  color: #a1a1a1;
}
.list_wrap:after {
  clear: both;
  content: "";
  height: 0;
  display: block;
  visibility: hidden;
}
.bread-wrap a {
  position: relative;
  margin-right: 20px;
}
.bread-wrap a:after {
  position: absolute;
  top: 0px;
  content: "/";
  height: 20px;
  line-height: 20px;
}
.bread-wrap span {
  color: #d1434a;
}

/* .btn:hover{
  background-color: 
} */
</style>
<script>
import axios from "axios";
import Model from "@/components/Model.vue";
export default {
  data() {
    return {
      msg: "hello vue"
    };
  }
};
</script>
