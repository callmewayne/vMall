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
      <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd ><a href="javascript:void(0)"  @click="selectPrice('all')" v-bind:class="{'cur':currentPrice=='all'}">All</a></dd>
          <dd v-for="(price,index) in priceFilter" v-bind:key="index" >
            <a href="javascript:void(0)"  @click="selectPrice(index)" v-bind:class="{'cur':currentPrice==index}">{{price.startPrice}} - {{price.endPrice}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item,index) in goodslist" v-bind:key="index" >
              <div class="pic">
                <a href="#"><img  v-lazy="'/static/'+item.img" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.name}}</div>
                <div class="price">{{item.price}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
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
</style>
<script>
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
      ],
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
      overLayFlag: false
    };
  },
  methods: {
    selectPrice(index) {
      this.currentPrice = index;
      console.log(index);
      this.closePop();
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
