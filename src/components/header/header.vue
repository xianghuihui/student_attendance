<template>
  <div class="detail">
    <div class="title">
      <van-nav-bar left-text="" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
        <template #title>
          <van-tabs type="card" @click="onClick">
            <van-tab title="入园" name="0"></van-tab>
            <van-tab title="出园" name="1"></van-tab>
          </van-tabs>
        </template>
        <template #right>
          <van-icon name="filter-o" size="20"/>
        </template>
      </van-nav-bar>
    </div>

    <router-view :message = "in_out"></router-view>

  </div>
</template>

<script>
  import Main from '../main/main'
  import { NavBar, Toast, Tab, Tabs, Icon } from "vant"
  export default {
    components:{
      [NavBar.name]:NavBar,
      [Toast.name]:Toast,
      [Tab.name]:Tab,
      [Tabs.name]:Tabs,
      [Icon.name]:Icon,
      Main,
    },
    data () {
      return {
        in_out:0
      }
    },
    methods: {
      onClick(name, title) {
        this.in_out = name
      },
      onClickLeft() {
        this.$router.go(-1);
      },
      onClickRight() {
        Toast('按钮');
      },
    },
    mounted () {

    }

  }
</script>

<style scoped>
  .van-nav-bar{
    background-color: rgb(222,77,54);
  }
</style>
<style>
  .van-nav-bar .van-icon{
    color: white;
  }
  .van-nav-bar__text{
    color: white;
  }
  .van-tabs__nav--card{
    border-radius: 5px;
    border: 1px solid white;
  }
  .van-tabs__nav--card .van-tab.van-tab--active{
    border-radius: 5px;
  }
  .van-tab__text--ellipsis{
    padding: 0 20px;
  }
  .van-tabs__nav--card .van-tab{
    border-right: none;
  }
</style>
