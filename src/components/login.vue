<template>
    <div>
        <h2>抽签系统</h2>
        <div class="row-box">
            <p class="row"><label for="username">用户名：</label><input type="text" name="username" v-model.trim="username" placeholder="请输入用户名"></p>
            <p class="row"><label for="password">密码：</label><input type="password" name="password" v-model.trim="password" placeholder="请输入密码"></p>
            <p class="row"><button @click="userlogin">登陆</button></p>
        </div>
    </div>
</template>

<script>
import {subLogin} from '@/api/api'
export default {
    data(){return{
        username:'',
        password:'',
        path:'/index'
    }},
    created:function(){
        var param=this.$route.query;
        console.log(param);
        if(param.redirect){
            this.path=param.redirect;
        }
    },
    methods:{
        userlogin:function(){
            var username=this.username,
                password=this.password,
                path=this.path;
            subLogin(username,password).then(res=>{
                var uid='123';
                sessionStorage.setItem('uid',uid);
                this.$router.push({path:path});
            })
        }
    }
}
</script>

<style scoped>
h2{
    text-align: center;
    font-size: 32px;
    margin:50px auto;
}
.row-box{
    width: 500px;
    height: 300px;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    margin:0 auto;
    box-sizing: border-box;
    padding:50px 0;
}
.row{
    margin-bottom: 35px;
}
button{
    width: 100px;
    height: 30px;
    border-radius: 5px;
    background-color: red;
    border:none;
    color: #fff;
    font-size: 14px;
}
label{
    display: inline-block;
    width: 100px;
    text-align: right;
}
input{
    height: 30px;
    line-height: 30px;
    width: 200px;
    box-shadow: none;
    border-radius: 5px;
    box-sizing: border-box;
    padding:0 5px;
    outline: none;
    border:1px solid #999;
}
</style>


