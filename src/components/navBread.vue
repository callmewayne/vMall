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
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
.loadMore {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
<script>
import axios from "axios";
export default {
  data() {
    return {
      msg: "hello vue",
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
      axios
        .get("/goods", {
          params: param
        })
        .then(res => {
          console.log(res);
          let resp = res.data;
          this.loading = false;
          if (resp.status == 200) {
            console.log(resp);
            if (flag) {
              this.goodslist = this.goodslist.concat(resp.body.list);
              if (resp.body.totalCount == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodslist = resp.body.list;
              this.busy = false;
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
     addCart(productId){
       console.log(productId)
       let pid =  parseInt(productId)
      console.log(pid)
                axios.post("/goods/addCart",{
                  productId:pid
                }).then((res)=>{
                    var res = res.data;
                     console.log(res)
                    if(res.status==0){
                        // this.mdShowCart = true;
                        // this.$store.commit("updateCartCount",1);
                       
                    }else{
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
    }
  }
};
</script>
