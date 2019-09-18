<template>
    <div>
        <div><p class="head"></p><span>未抽中</span><p class="head red"></p><span>已抽中</span><span @click="export2Excel" class="shou" >导出</span></div>
        <div class="box">
            <p v-for="(item,index) in shop" :key='index' :class='item.status? "red":""'>
                商铺号：{{item.shang_id}}<br/>
                所属人：<i v-if="item.user_id!=0">{{item.user_id}}</i>
            </p>
        </div>
    </div>
</template>

<script>
import {findAllDetail} from '@/api/api'
export default {
    data(){return{
        shop:[]
    }},
    created:function(){
        findAllDetail().then(res=>{
            this.shop=res.data.body;
        })
    },
    methods:{
        export2Excel:function(){
            var that = this;
            var list = that.shop;
            var arr=[];
            // list.forEach(function(v1,i1,a1){
            //     var l=arr.map(function(v2,i2,a2){
            //         if(v1.user_id==v2.user_id){
            //             var back={
            //                 user_id:v1.user_id,
            //                 shang_id:v1.shang_id,
            //                 index:i2
            //             }
            //             return back
            //         }
            //     })
            //     if(l.length===0){
            //         var s={
            //             user_id:v1.user_id,
            //             shang_id:new Array(v1.shang_id)
            //         }
            //         arr.push(s)
            //     }else{
            //         console.log(l)
            //     }
            //     //console.log(arr)
            // })
            //console.log(arr)
            // require.ensure([], () => {
            //     const { export_json_to_excel } = require('../vendor/Export2Excel'); //这里必须使用绝对路径
            //     const tHeader = ['user_id','status','shang_id']; // 导出的表头名
            //     const filterVal = ['user_id','status','shang_id']; // 导出的表头字段名
                
            //     const data = that.formatJson(filterVal, list);
            //     export_json_to_excel(tHeader, data, '表格实例');// 导出的表格名称，根据需要自己命名
            // })
        },
        formatJson: function(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        }
    }
}
</script>

<style scoped>
.head{
    width: 20px;
    height: 10px;
    margin:0 20px;
}
p{
    width: 100px;
    height: 50px;
    border:2px solid #666;
    font-size: 12px;
    display: inline-block;
    margin:20px;
    text-align: left;
    line-height: 20px;
    box-sizing: border-box;
    padding:0 5px;
}
p.red{
    background-color: red;
    color: #fff;
}
span{
    display: inline-block;
    margin:0 20px;
}
.box{
    width: 1200px;
    margin:50px auto;
    display:flex;
    flex-wrap:wrap;
    justify-content: flex-start;
}
.shou{
    cursor: pointer;
}
</style>

