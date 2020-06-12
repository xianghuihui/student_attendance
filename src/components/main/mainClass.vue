<template>
  <div>
    <van-row type="flex" justify="space-between">
      <van-col span="9"><em><span @click="prevDate">< </span>{{ nowDate }}<span @click="nextDate"> ></span></em></van-col>
      <van-col span="4" offset="12">{{ nowWeek }}</van-col>
    </van-row>

    <van-row>
      <van-col span="8" class="van-colAll"><p>总人数</p><span style="font-size: 2rem"><em>{{ classes.class_all_count }}</em></span></van-col>
      <van-col span="16"><div id="main1"></div></van-col>
    </van-row>


    <van-row type="flex" justify="center">
      <van-col span="22" class="class1">
        <p>{{ classes.name }}</p>
      </van-col>
    </van-row>


    <van-row type="flex" justify="center">
      <van-col span="22" class="class2">
        <van-col span="8" class="class2_1">学号</van-col>
        <van-col span="8" class="class2_1">姓名</van-col>
        <van-col span="8">状态</van-col>
      </van-col>
    </van-row>
    <van-row type="flex" justify="center" v-for="(item,i) in classDetail">
      <van-col span="22" class="class3">
        <van-col span="8">{{ item.code }}</van-col>
        <van-col span="8">{{ item.name }}</van-col>
        <van-col span="8">
          <span v-if="item.status == 0" style="color: #F3371B">未签到</span>
          <span v-if="item.status == 1" style="color: #07F317">已签到</span>
        </van-col>
      </van-col>
    </van-row>

  </div>
</template>

<script>
  import { Icon, Col, Row } from "vant"
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入饼状图组件
  require('echarts/lib/chart/pie')
  // 引入组件
  require('echarts/lib/component/legend');
  require("echarts/lib/component/legendScroll");

  export default {
    components:{
      [Icon.name]:Icon,
      [Col.name]:Col,
      [Row.name]:Row,
    },data () {
      return {
        timer: null,
        nowDate: '',
        nowWeek: '',
        allCount: 0,
        in_out: 0,
        classes: this.$route.params.classes,
        classDetail: []
      }
    },
    props:['message'],
    created(){
      this.in_out=this.message
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数将数据放在当前组件的数据内
        //this.classes = this.$route.params.classes;
        this.initData(this.classes.class_sign_in_count,this.classes.class_not_sign_in_count);

        this.$nextTick(() => {
          this.$axios.defaults.headers.common['school_id'] = 1007;
          this.$axios({
            method: 'get',
            url: '/app/card/v1/onecard/sign-record',
            /*hraders: {
              'school_id' : 1007,
            },*/
            params:{
              union_id:'000816',
              datetime:this.nowDate,
              in_out:this.in_out,
              class_id:this.classes.id,
            }
          })
            .then(res=>{
              this.classDetail = res.data.extra
            })
            .catch(error=>{
              console.log(error)
            })
        })
      },
      prevDate() {
        //前一天
        let odata = new Date(
          new Date(this.nowDate).getTime() - 24 * 60 * 60 * 1000
        ); //计算当前日期 -1
        this.timer = this.setNowTimes(odata); //格式化日期并赋值
      },
      nextDate() {
        //后一天
        let odata = new Date(
          new Date(this.nowDate).getTime() + 24 * 60 * 60 * 1000
        ); //计算当前日期 +1
        this.timer = this.setNowTimes(odata); //格式化日期并赋值
      },
      setNowTimes (date) {
        let myDate = new Date(date)
        //console.log(myDate)
        let wk = myDate.getDay()
        let yy = String(myDate.getFullYear())
        let mm = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
        let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        let week = weeks[wk]
        this.nowDate = yy + '-' + mm + '-' + dd
        this.nowWeek = week
        this.getParams();
      },
      //初始化数据
      initData(signInCount,notSignInCount) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main1'));
        // 绘制图表
        myChart.setOption({
          legend: {
            orient: 'vertical',
            left: 20,
            top: 30,
            data: ['已签到','未签到'],
            formatter: function(name) {
              if(name === '已签到') {
                return name + " "+signInCount;
              } else if(name === '未签到') {
                return name + " "+notSignInCount;
              }
            },
            itemWidth: 15,
            itemHeight: 15,
            textStyle:{
              fontSize: 13
            }
          },
          color:['#07F317','#F3371B'],
          series: [
            {
              name: '',
              type: 'pie',
              radius : '90%',
              center: ['70%', '55%'],
              hoverAnimation:false,
              label: {
                show: false,
                position: 'center'
              },

              labelLine: {
                show: false
              },
              data:[
                {value:signInCount, name:'已签到'},
                {value:notSignInCount, name:'未签到'},
              ],
            }
          ]
        });
      },
    },
    mounted () {
      this.timer = this.setNowTimes(new Date());
    },
    //这里用watch方法来监听父组件传过来的值，来实现实时更新
    watch:{
      message(val){ //message即为父组件的值，val参数为值
        this.in_out = val //将父组件的值赋给in_out 子组件的值
        //this.getInfo();
      },

      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>

<style scoped>

  .van-row{
    padding-top: 0.3rem;
  }
  .van-colAll{
    color: #1989fa;
  }
  #main1{
    height: 6rem;
  }
  .class1{
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    text-align: left;
    margin: 0.4rem 0;
  }
  .class1 p{
    margin: 0.5rem 0;
  }
  .class2{
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    padding: 0.2rem;
  }
  .class2_1{
    border-right: 1px solid #E6E6E6;
  }
  .class3{
    font-size: 14px;
    border-bottom: 1px dashed #E6E6E6;
    padding: 0.3rem;
  }

</style>
