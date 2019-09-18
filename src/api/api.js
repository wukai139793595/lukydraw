import request from './index'
import Qs from 'qs'


//获取下一位抽签人编号
export function findClient(){
    return request({
        url: '/pc/detail/findClient',
        method: 'post',
        data:Qs.stringify({
            type:0
        })
    })
}
//刷新时，获取抽签人的编号 
export function findFirstClient(){
    return request({
        url: '/pc/detail/findFristClient',
        method: 'post',
        data:Qs.stringify({
            type:0
        })
    })
}
//获取所有未抽中的商铺信息
export function findDetail(status=0){
    return request({
        url: '/pc/detail/findDetail',
        method: 'post',
        data:Qs.stringify({
            status,
        })
    })
}
//获取当前可抽信息
export function getChou(){
    return request({
        url: '/pc/detail/getChou',
        method: 'post'
    })
}
//获取所有商铺信息
export function findAllDetail(){
    return request({
        url: '/pc/detail/findDetail',
        method: 'post'
    })
}
//修改商铺状态
export function setDetailStatus(shangId,userId){
    return request({
        url: '/pc/detail/setDetailStatus',
        method: 'post',
        data:Qs.stringify({
            shangId,
            userId
        })
    })
}
//修改多个商铺状态
export function setClientDetail(userId,shangIdStr){
    return request({
        url: '/pc/detail/setClientDetail',
        method: 'post',
        data:Qs.stringify({
            userId,
            shangIdStr
        })
    })
}
//用户登陆
export function subLogin(username,password){
    return request({
        url: '/admin/userManage/subLogin',
        method: 'post',
        data:Qs.stringify({
            username,
            password
        })
    })
}
