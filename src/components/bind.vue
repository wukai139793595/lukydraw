<template>
    <div class="content">
        <p class="row">
            <span>抽签序号</span>
            <input type="text" v-model="number" placeholder="请输入抽签的号码" >
        </p>
        <div class="row">
            <span>选中的商铺号</span>
            <input type="text" v-for='(item,index) in num' :key="index" v-model="num[index]" placeholder="请输入商铺号"/> <button @click="add">添加</button>
        </div>
        <p class="row">
            <button @click='commit()'>提交</button>
            <router-link to='/show'>查看商铺</router-link>
        </p>
    </div>
</template>

<script>
import {setClientDetail} from '@/api/api'
export default {
    data(){return{
        num:[''],
        number:''
    }},
    watch:{
        num:function(){}
    },
    methods:{
        add:function(){
            this.num.push('');
        },
        commit:function(){
            var userId=this.number,
                shangIdStr=this.num.join(',').replace(/,$/,'');
            setClientDetail(userId,shangIdStr).then(res=>{
                this.$message({
                    showClose: true,
                    message: '提交成功',
                    type: 'success'
                });
            })
        }
    }
}
</script>

<style scoped>
.content{
    width: 600px;
    margin:50px auto;
}
.row{
    width: 100%;
    text-align: left;
    margin:20px 0;
}
.row span{
    width: 120px;
    display: inline-block;
}
.row input{
    width: 200px ;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    box-sizing: border-box;
    padding:0 5px;
    border-radius: 4px;
    border:1px solid #999;
}
button{
    padding:5px 10px;
}

</style>


