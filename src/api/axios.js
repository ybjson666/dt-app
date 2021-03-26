import axios from 'axios'
import store from '../store/index'
import router from '../router/index'
import { Loading,Message } from 'element-ui'
import qs from 'qs';
import {getHHmmssOrFull} from '../utils/dateUtil'
let load
var needLoadingRequestCount = 0 //当前正在请求的数量
let openLoading = () => {
    load = Loading.service({
        lock: true,
        text: '正在加载中……',
        spinner: 'el-icon-loading'
    })
}
let closeLoading = () => {
    load.close()
}

// import qs from 'qs'
let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
  //baseUrl = '/server'
  //baseUrl="http://192.168.101.27:8080/"  //李颖周
  baseUrl="http://192.168.101.16:8080/"   //周刚
  // 需要测试服务器去代理到接口服务器
} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = 'http://127.0.0.1:808/'
  baseUrl = 'http://testapp.tinntay.com/'
}

axios.defaults.baseURL = baseUrl
// 设置请求超时时间
axios.defaults.timeout = 100000
// 设置请求带 cookie
axios.defaults.withCredentials = false

// 设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截
axios.interceptors.request.use(config => {
  // 如果未登录 就是null
  if (localStorage.getItem('token') != null) {
      config.headers.common = {
          'TINNTAYMESSGE': localStorage.getItem('token')
      }
  }
  // 开启蒙层
  needLoadingRequestCount++
  openLoading()
  // 在发送请求之前做些什么 验证token之类的
  return config
}, error => {
  // 对请求错误做些什么
  closeLoading()
  needLoadingRequestCount = 0
  return Promise.error(error)
})

// 响应拦截
axios.interceptors.response.use(response => {
  // "status"
  needLoadingRequestCount--  //调用完一个接口就进行-1
  if(needLoadingRequestCount == 0){  //当接口都调用完时
    closeLoading()
  }
  return response
}, error => {
  // 对响应错误做点什么 
  closeLoading()
  needLoadingRequestCount = 0
  if (error.response.code == 502) {
    if (router.history.current.fullPath !== '/container') {
        Message({
            message: '登录后才能访问哦 ~',
            type: 'info',
            offset: 50
        })
    }
    localStorage.removeItem('token')
    localStorage.removeItem('users')
    let users = {
        birthday: null,
        channel: '',
        headPic: null,
        id: '',
        name: '',
        newUser: '',
        nickname: '',
        openid: null,
        phone: '',
        rimToken: null,
        sex: null,
        token: '',
        userType: null
    }
    store.commit('updateUsers', users)
    router.replace({
        path: '/login',
        query: { is_time_out: 1 }
    })
    Message({
      message: error.response.msg,
      type: 'info',
      offset: 50
    })
  }
  return Promise.reject(error)
})

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  // console.warn("req:get-->" + getHHmmssOrFull(), url, params);
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      // console.log("res:" + getHHmmssOrFull(), res.data);
      resolve(res.data)
    }).catch(err => {
      // console.error("res:" + getHHmmssOrFull(), err);
      reject(err.data)
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postXwww(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

function reqFormCheck(a) {
  // null "null" undefined "undefined" NaN 不进行通过
  if (a == "undefined" || a == "null" || !a && (isNaN(a) || a == null || a == undefined)) return true;
  // "0" 0 "" {} [] false 通过
  return false;
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postForm(url, params) {
  let rqParams = new FormData()  // 创建form对象
  for (let key in params) {
    if (!reqFormCheck(params[key])) rqParams.append(key, params[key])
  }
  let config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }


  return new Promise((resolve, reject) => {
    axios.post(url, rqParams, config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        console.error("res:" + getHHmmssOrFull(), err);
        reject(err.data)
      })
  })
}


/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postJson(url, params) {
  // console.log("req:postJson-->" + getHHmmssOrFull(), url, params);
  return new Promise((resolve, reject) => {
    axios.post(url, JSON.stringify(params))
      .then(res => {
        // console.error("res:" + getHHmmssOrFull(), res.data);
        resolve(res.data)
      })
      .catch(err => {
        console.error("res:" + getHHmmssOrFull(), err);
        reject(err.data)
      })
  })
}
