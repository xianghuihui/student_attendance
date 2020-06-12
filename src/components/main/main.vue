<template>
    <div>
      <van-row type="flex" justify="space-between">
        <van-col span="9"><em><span @click="prevDate">< </span>{{ nowDate }}<span @click="nextDate"> ></span></em></van-col>
        <van-col span="4" offset="12">{{ nowWeek }}</van-col>
      </van-row>

      <van-row>
        <van-col span="8" class="van-colAll"><p>总人数</p><span style="font-size: 2rem"><em>{{ allCount }}</em></span></van-col>
        <van-col span="16"><div id="main1"></div></van-col>
      </van-row>

      <van-row type="flex" justify="center">
        <van-col span="22" class="leave"><!--  v-for="(item,i) in leave" <p>{{ item.number }}</p><p>{{ item.name }}</p>-->
          <p style="text-align: left;margin: 0"><van-icon name="manager"  style="margin: 0.4rem 1rem 0 1rem" size="16"/><B>今日请假&nbsp;{{ leaveAll }}人</B></p>
          <div class="leaves">
            <ul :style="{ width: ulStyle }">
              <li class="leaves_1" v-for="(item,i) in leave"><p>{{ item.number }}</p><p>{{ item.name }}</p></li>
            </ul>
          </div>
        </van-col>
      </van-row>

      <van-row type="flex" justify="center" v-for="(item,i) in class1">
        <van-col span="22" class="class1" @click="class1Click(item)">
          <p>{{ item.name }}</p>
          <span>已签到：<span style="color: #07F317">{{ item.class_sign_in_count }}</span>人</span>
          <span>未签到：<span style="color: #F3371B">{{ item.class_not_sign_in_count }}</span>人</span>
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
    },
    data () {
      return {
        timer: null,
        nowDate: '',
        nowWeek: '',
        allCount: 0,
        in_out: 0,
        leave: [],
        leaveAll: 0,
        class1: [],
        ulStyle: '',
      }
    },
    props:['message'],
    created(){
      this.in_out=this.message;
    },
    methods: {
      class1Click(classes){
        this.$router.push({
          name: 'mainClass',
          params: {
            classes: classes
          }
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
        this.getInfo();
      },
      getInfo(){
        this.$nextTick(() => {
          this.$axios.defaults.headers.common['school_id'] = 1007;
          this.$axios({
            method: 'get',
            url: '/app/card/v1/onecard/sign-num-record',
            /*hraders: {
              'school_id' : 1007,
            },*/
            params:{
              union_id:'000816',
              is_admin:0,
              datetime:this.nowDate,
              in_out:this.in_out,
            }
          })
            .then(res=>{
              this.allCount = res.data.extra.allCount;
              this.initData(res.data.extra.signInCount,res.data.extra.notSignInCount);
              this.leave = res.data.extra.leave;
              this.leaveAll = res.data.extra.leave[0].number + res.data.extra.leave[1].number + res.data.extra.leave[2].number;
              this.ulStyle = res.data.extra.leave.length * 7 + 'rem';
              this.class1 = res.data.extra.class;
              })
            .catch(error=>{
              console.log(error)
            })
        })
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
        this.getInfo();
      }
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
  .leave{
    border: 1px solid #E6E6E6;
    border-radius: 5px;
    margin: 0.5rem 0 1rem 0;
  }
  .leaves{
    overflow: hidden;
    overflow-x:auto;
  }
  .leaves_1{
    float: left;
    padding: 0 2.5rem;
  }
  .class1{
    border: 1px solid #7FCCCC;
    border-radius: 5px;
    text-align: left;
    padding: 0 0 0.5rem 0.2rem;
    margin: 0.2rem 0;
  }
  .class1 p{
    margin-top: 0.5rem;
  }
  .class1 span{
    font-size: 14px;
  }
</style>
