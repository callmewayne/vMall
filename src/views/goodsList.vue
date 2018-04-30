<template>
  <div>
    <nav-header></nav-header>
        <nav-bread>
            <span>goods</span>
        </nav-bread>
       <div class="accessory-result-page accessory-page">
          <div class="container">
            <div class="filter-nav">
              <span class="sortby">Sort by:</span>
              <a href="javascript:void(0)" class="default cur">Default</a>
              <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'short-up':!sortFlag,}"><use xlink:href="#icon-arrow-short"></use></svg></a>
              <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">Filter by</a>
            </div>
            <div class="accessory-result">
              <!-- filter -->
              <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
                <dl class="filter-price">
                  <dt>Price:</dt>
                  <dd ><a href="javascript:void(0)"  @click="setPriceFilter('all')" v-bind:class="{'cur':currentPrice=='all'}">All</a></dd>
                  <dd v-for="(price,index) in priceFilter" v-bind:key="index" >
                    <a href="javascript:void(0)"  @click="setPriceFilter(index)" v-bind:class="{'cur':currentPrice==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                  </dd>
                </dl>
              </div>

              <!-- search result accessories list -->
              <div class="accessory-list-wrap">
                <div class="accessory-list col-4">
                  <ul class="list_wrap">
                    <li v-for="(item,index) in goodslist" v-bind:key="index" >
                      <div class="pic">
                        <a href="#"><img  v-lazy="'/static/'+item.productImage" alt=""></a>
                      </div>
                      <div class="main">
                        <div class="name">{{item.productName}}</div>
                        <div class="price">{{item.salePrice}}</div>
                        <div class="btn-area">
                          <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="loadMore"  v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="100">
                    <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading " alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
        <div class="md-overlay " v-show="overLayFlag" @click="closePop"></div>
       <model v-bind:mdShow="mdShow" v-on:close='closeModel'>
          <p slot="message">
            请先登录，不然无法加入到购物车
          </p>
          <div slot="btnGroup">
            <a class="btn btn--m" @click="mdShow = false">关闭</a>
          </div>
        </model>
         <model v-bind:mdShow="mdShowCart" v-on:close='closeModel'>
          <p slot="message">
           <svg class="icon-status-ok">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                    </svg>
                      <span>加入购物车成功！</span>
          </p>
        
          <div slot="btnGroup">
            <a class="btn btn--m" @click="mdShowCart = false">去购物</a>
            <router-link class="btn btn--m" to="/cart" >
              查看购物车
            </router-link>
          </div>
        </model>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
.loadMore {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.icon-arrow-short {
  width: 11px;
  height: 11px;
  transition: all 0.3s ease-out;
}
.short-up {
  transform: rotate(180deg);
  transition: all 0.3s ease-out;
}
</style>

<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import axios from "axios";
import NavHeader from "@/components/header.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavBread from "@/components/NavBread.vue";
import Model from "@/components/Model.vue";
export default {
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Model
  },
  data() {
    return {
      mdShow: false,
      mdShowCart:false,
      sortFlag: true,
      page: 1,
      pageSize: 4,
      busy: true,
      loading: false,
      goodslist: [],
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "2000.00"
        },
        {
          startPrice: "2000.00",
          endPrice: "5000.00"
        }
      ],
      currentPrice: "all",
      filterBy: false,
      overLayFlag: false,
      priceChecked: "all"
    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceChecked: this.priceChecked
      };
      this.loading = true;
      console.log(this)
      var that = this
      axios
        .get("/goods/list", {
          params: param
        })
        .then(res => {
          console.log(that);
          let resp = res.data;
          that.loading = false;
          if (resp.status == 200) {
            console.log(resp);
            if (flag) {
              that.goodslist = that.goodslist.concat(resp.body.list);
              if (resp.body.totalCount == 0) {
                that.busy = true;
              } else {
                that.busy = false;
              }
            } else {
              that.goodslist = resp.body.list;
              that.busy = false;
            }
          } else {
            console.log("失败");
          }
        });
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      (this.page = 1), this.getGoodsList();
    },
    selectPrice(index) {
      this.currentPrice = index;
      console.log(index);
      this.closePop();
    },
    loadMore() {
      let busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
        this.busy = false;
      }, 1000);
    },
    setPriceFilter(index) {
      console.log(index);
      this.currentPrice = index;
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList();
      this.closePop();
    },
    // addCart(productId) {
    //   axios
    //     .post("/goods/addCart", {
    //       productId: productId
    //     })
    //     .then(res => {
    //       console.log(res)
    //       if(res.status ===200){
    //         alert(res.msg)
    //       }else{
    //          alert(res.msg)
    //       }
    //     });
    // },
    addCart(productId) {
      console.log(productId);
      let pid = parseInt(productId);
      console.log(pid);
      axios
        .post("/goods/addCart", {
          productId: pid
        })
        .then(res => {
          var res = res.data;
          console.log(res);
          if (res.status == 200) {
            this.mdShowCart = true;
            // this.$store.commit("updateCartCount",1);
            console.log(res.body);
          } else {
            this.mdShow = true;
          }
        });
    },
    showFilter() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    closeModel() {
        this.mdShowCart = false;
      this.mdShow = false;
    }
  }
};
</script>