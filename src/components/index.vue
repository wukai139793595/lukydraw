<template> 
  <div class='draw'>
    <div class="number-wrap">
      抽签号码：
      <span class="current-number">
        {{currentNum}}
      </span>
    </div>
    <div class="shop-wrap">
      {{currentShop}}
    </div>
    <div :class="{point:lock==true&&jumpLock==true}" class="jump" @click="jumpClient($event)">
      跳过
    </div>
    <div class="btn-wrap">
      <div :class="{point:lock==true}" class="btn begin" v-if="btnType===0" @click="beginActive($event)">活动开始</div>
      <div :class="{point:lock==true}" class="btn select" v-else-if="btnType===1" @click="toDraw($event)">戳我抽签</div>
      <div :class="{point:lock==true}" class="btn selectNum" v-else-if="btnType===2" @click="endDraw($event)">停止</div>
      <div class="btn next" v-else-if="btnType===3">商户选号中</div>
      <div class="btn end" v-else-if="btnType===4">抽签结束</div>
    </div>
    <div class="mask-wrap" v-if="btnType===3">
      <div class="mask" >
        <p class="text">
          恭喜
          <span class="buyer">
            {{currentNum}}号
          </span>
          抽中
          <span class="shop-num">
            {{currentShop}}
          </span>
          商铺
        </p>
        <div :class="[{point:lock==true},{noclick:noclick}]" class="confirm" @click="confirmDraw($event)">确定</div>
        <div :class="{point:lock==true}" class="re-select" @click="reSelect($event)">
          重抽
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
import {findClient,findFirstClient,findDetail,setDetailStatus,getChou} from '../api/api.js' 
export default{
  data(){
    return{
      currentNum: '',   //当前抽奖客户
      currentShop: '',  //抽奖时闪动的商户编号
      btnType: 0,        //当前按钮的状态
      unSelect: [],      //未选中的商户编号
      endSelect: [],     //可选中的商户编号
      resultCache: '',    //选中结果
      lock: true,           //按钮点击锁
      jumpLock: false,       //跳过按钮锁
      noclick: true          
    }
  },
  methods:{
    requestIndex(){   //刷新时获取用户和商铺信息
      this.lock = false;
      Promise.all([findFirstClient(),findDetail(),getChou()]).then(res=>{
        this.lock = true;
        console.log(res)
        if(res[0].data.code === 0 && res[1].data.code === 0 && res[2].data.code === 0){
          if(res[0].data.body == 'end'){
            this.btnType = 4;
            this.lock = false;
            this.jumpLock = false;
            this.currentNum = '';
            this.currentShop = '';
          }else{
            this.currentNum = res[0].data.body.user_id;
            this.unSelect = res[1].data.body;
            if(res[0].data.body.chou !== "0" && res[0].data.body.chou !== null){
              if(res[0].data.body.chou.indexOf('.') != -1){
                this.endSelect = res[0].data.body.chou.split('.');
              }else{
                console.log('只有一个预定')
                this.endSelect = [res[0].data.body.chou];
              }
            }else{
              this.endSelect = res[2].data.body;
            }
            this.btnType = 1;
          }
        }else{
          console.log('网络未请求成功')
        }
      },err=>{
        console.log("requestIndex",err);
        this.lock = true;
      })
    },
    nextClient(){    //获取下一位客户的信息 
      this.lock = false;
      findClient().then(res=>{
        console.log("findClient--res:", res);
        if(res.data.code === 0){
          if(res.data.body == 'end'){
            this.btnType = 4;
            this.lock = false;
            this.jumpLock = false;
            this.currentNum = '';
            this.currentShop = '';
          }else{
            this.currentNum = res.data.body.user_id;   //下一位客户请求成功后，页面展示请求返回的客户
            this.currentShop = '';
            Promise.all([findDetail(),getChou()]).then(resArr=>{
              this.lock = true;
              console.log("findClient--resArr:", resArr);
              this.unSelect = resArr[0].data.body;
              if(res.data.body.chou !== "0"  && res.data.body.chou !== null){
                if(res.data.body.chou.indexOf('.') != -1){
                  this.endSelect = res.data.body.chou.split('.');
                }else{
                  this.endSelect = [res.data.body.chou];
                  console.log('只有一个预定')           
                }
              }else{
                this.endSelect = resArr[1].data.body;      
                console.log("mockjs",this.endSelect);        
              }
            },err=>{
              this.lock = true;
              console.log("findDetail","getChou",err)
            })            
          }
          
        }
      },err=>{
        this.lock = true;
        console.log("findClient--err",err)
      })
    },
    beginActive(event){
      if(this.lock){
        this.jumpLock = true;
        this.requestIndex();
      }
    },
    toDraw(event){
      if(!this.lock){
        return ;
      }
      this.btnType = 2;
      var len = this.unSelect.length,
          randNum = null,
          endLen = this.endSelect.length,
          randEndNum = Math.floor(Math.random()*endLen);
      this.resultCache = this.endSelect[randEndNum];
      this.timer = setInterval(()=>{
        randNum = Math.floor(Math.random()*len);
        this.currentShop = this.unSelect[randNum].shang_id;
      }, 40)
    },
    endDraw(event){
      clearInterval(this.timer);
      this.currentShop = this.resultCache;
      this.btnType = 3; 
      console.log('noclick',this.noclick);
      setTimeout(()=>{
        this.noclick = false;
      },3000)
    },
    confirmDraw(event){
      if(this.noclick){
        return;
      }
      this.btnType = 1;
      this.lock = false;
      console.log(this.currentShop,this.currentNum);
      setDetailStatus(this.currentShop,this.currentNum).then(res=>{
        this.lock = true;
        console.log("setDetailStatus",res)
          if(res.data.code === 0){
            this.currentShop = '';
            this.requestIndex();
          }
          this.noclick = true;
      },err=>{
        this.lock = true;
        this.noclick = true;
        console.log("setDetailStatus--err",err)
      })
    },
    reSelect(event){
      console.log(this.currentNum,this.currentShop);
      this.btnType = 1;
      this.currentShop = '';
    },
    jumpClient(event){
      if(!this.lock || !this.jumpLock){
        return;
      }
      this.nextClient();
    }
  },
  created(){

  }
}
</script>
<style lang="less" scoped>
.draw{
  width: 100%;
  height: 100%;
  background-image: url(../assets/bg_01.png);
  background-size: 100% 100%;
  position:relative;
  overflow: hidden;
  .point{
    cursor: pointer;
  }
  .number-wrap{
    position: absolute;
    height:89px;
    font-size:65px;
    font-weight:500;
    width: 100%;
    text-align: center;
    color:rgba(255,254,254,1);
    line-height:89px;
    top: 41%;
    // left: 50%;
    // transform: translateX(-50%);
  }
  .shop-wrap{
    position: absolute;
    width: 100%;
    height:73px;
    font-size:65px;
    font-weight:500;
    color:rgba(255,231,40,1);
    line-height:73px;
    text-align: center;
    top: 63%;
  }
  .jump{
    position: absolute;
    bottom: 118px;
    left: 96px;
    display: inline-block;
    font-size:36px;
    font-weight:400;
    color:rgba(209,192,255,1);
  }
  .btn-wrap{
    width: 180px;
    height: 180px;
    position: absolute;
    top: 62%;
    right: 81px; 

    .btn{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #FFE728;
      text-align: center;
      font-size: 42px;
      font-weight:800;
      color:rgba(166,64,225,1);
      line-height:180px;
      text-shadow:0px 3px 6px rgba(200,180,16,1);
      box-shadow: 0 8px 5px #A39206;
    }
  }
  .mask-wrap{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .mask{
      width: 881px;
      height: 571px;
      margin: 100px auto;
      background-image: url(../assets/bg_02.png);
      background-color: #fff;
      background-size: 100% 100%;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      .text{
        margin: 283px auto 60px;
        text-align: center;
        font-size: 52px;
        .buyer{
          color: #B723D3;
          font-weight: 600;
        }
        .shop-num{
          color: #B723D3;
          font-weight: 600;
          font-size: 60px;
        }
      }
      .confirm{
        margin: auto;
        border-radius: 40px;
        background:linear-gradient(0deg,rgba(217,205,18,1) 0%,rgba(254,246,108,1) 100%);
        font-size: 60px;
        font-weight: 600;
        text-align: center;
        color: #BA30D5;
        font-size: 40px;
        width:254px;
        height:80px;
        border-radius:36px;
        line-height: 80px;
        box-shadow: 0px 5px 5px #C5B00B;
      }
      .noclick{
        background: linear-gradient(0deg,#aaa 0%,#bbb 100%)!important;
      }
      .re-select{
        position: absolute;
        left: 40px;
        bottom: 40px;
        font-size: 28px;
        font-weight: 400;
        color: rgb(153,153,153);
      }
    }
  }
}
</style>
