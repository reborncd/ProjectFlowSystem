import Vue from 'vue'
import ElementUI from 'element-ui'
import './static/css/common.css'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import './static/css/iconfont.css'
import './static/css/table.css'
import './static/css/console.css'
import App from './App.vue'
import router from "./router.js";
import axios from "axios";
import echarts from  'echarts'
//3.22 start
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
//3.22 end
//富文本
import VueQuillEditor from 'vue-quill-editor';
import "./static/css/quill.core.css";
import "./static/css/quill.snow.css";
import "./static/css/quill.bubble.css";
Vue.use(VueQuillEditor);

Vue.use(ElementUI);
Vue.config.productionTip = false;

//----------------------------------------------------
//路由跳转
//----------------------------------------------------
Vue.prototype.$go = function (route, query, params,name) {
    this.$router.push({
        'path': route,
        "query": query,
        "params": params,
        "name":name
    });
};
Vue.prototype.$back = function (route) {
    this.$router.go(-1)
};

//----------------------------------------------------
//pdf生成 3.22 start
//----------------------------------------------------
Vue.prototype.getPdf= function(val) {
    let title =val+(new Date()).Format("yyyy-MM-dd")
    html2Canvas(document.querySelector('#pdfDom'), {
        allowTaint: true
    }).then(function(canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if(leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
            while(leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= 841.89
                if(leftHeight > 0) {
                    PDF.addPage()
                }
            }
        }
        PDF.save(title + '.pdf')
    })
};
//----------------------------------------------------
//日期格式  3.23 start
//----------------------------------------------------
Date.prototype.Format = function(fmt)
{
    let o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

//----------------------------------------------------
//定义弹窗----------------------------------------------------
//----------------------------------------------------
Vue.prototype.alert = function (msg, callback, option) {
    if (option) {
        this.$alert(msg, '提示', {
            confirmButtonText: '确定',
            lockScroll: false,
            callback: callback ? callback() : "",
            option
        });
    } else {
        this.$alert(msg, '提示', {
            confirmButtonText: '确定',
            lockScroll: false,
            callback: callback ? callback() : "",
        });
    }
};
Vue.prototype.confirm = function (msg, success, cancel, btn) {
    this.$confirm(msg, '提示', {
        confirmButtonText: btn ? btn[0] : "确定",
        cancelButtonText: btn ? btn[1] : '取消',
        lockScroll: false,
        type: 'warning'
    }).then(() => {
        success()
    }).catch(() => {
        cancel ? cancel() : ""
    });
};
Vue.prototype.prompt = function (title, msg, success, cancel) {
    this.$prompt(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(({value}) => {
        success({value})
    }).catch(() => {
        cancel ? cancel() : ""
    });
};
//数组去重
Vue.prototype.$unique = (arr) => {
    let res = [];
    let json = {};
    for (let i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
};
Vue.prototype.$success = function (msg) {
    this.$message({
        message: msg,
        type: 'success'
    });
};
Vue.prototype.$warn = function (msg) {
    this.$message({
        message: msg,
        type: 'warning'
    });
};
Vue.prototype.$err = function (msg) {
    this.$message.error(msg);
};
//----------------------------------------------------
//使用echarts----------------------------------------------------
//----------------------------------------------------
Vue.prototype.$echarts = echarts;
//----------------------------------------------------
//蒙版
//----------------------------------------------------
Vue.prototype.$maskin = (type) => {
    let mask = document.getElementById("mask");
    let load = document.getElementById("loading");
    mask.style.display = "block";
    // if(type){
    load.style.display = "block";
    // }
};
Vue.prototype.$maskoff = () => {
    let mask = document.getElementById("mask");
    let load = document.getElementById("loading");
    mask.style.display = "none";
    load.style.display = "none"
};
//日期格式化----------------------------------------------------
Vue.prototype.$format = (time) => {
    let date = new Date(time);
    let year = date.getFullYear();
    let mouth = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let second = date.getSeconds();
    return {
        "year": year,
        "mouth": mouth < 10 ? "0" + mouth : mouth,
        "day": day < 10 ? "0" + day : day,
        "hour": hour < 10 ? "0" + hour : hour,
        "min": min < 10 ? "0" + min : min,
        "second": second < 10 ? "0" + second : second,
    }
};

// axios配置------------------------------------------
window._options = {baseUrl: 'http://192.168.1.106:8080/angela'}; // 测试
// window._options = {baseUrl: 'http://192.168.1.207:61080/angela'}; // 生产
// window._options = {baseUrl: 'http://20.0.18.100:8080/angela'}; // 易玉煌
// window._options = {baseUrl: 'http://20.0.18.89:8081/JiFu_Project'}; // 郑阳
// window._options = {baseUrl: 'http://20.0.18.96:8080/JiFu_Project'}; // 杨武
// window._options = {baseUrl: 'http://127.0.0.1:8080/angela'};//本地

let instance = axios.create({
    baseURL: window._options.baseUrl,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    }
});
instance.defaults.withCredentials = true;
//请求拦截器
instance.interceptors.request.use(function (config) {
    config.baseURL = window._options.baseUrl;
    // 每次请求都添加一个token
    if (config.method == "post" && Vue.prototype.$getToken() &&
        config.data.constructor.name == "URLSearchParams") {
        let token = Vue.prototype.$getToken();
        config.data += `&token=${token}`;
    }
    return config;
}, function (err) {
    Vue.prototype.$warn("网络异常，请稍后再试");
    Vue.prototype.$maskoff();
});

//下载拦截器
const downloadUrl = (url) => {
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.onload = function () {
        document.body.removeChild(iframe)
    };
    document.body.appendChild(iframe)
};
//响应拦截器
instance.interceptors.response.use(function (response) {
    //下载拦截
    if (response.headers && (response.headers['content-type'] === 'application/x-msdownload'
        || response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        || response.headers['content-type'] === 'application/octet-stream;charset=UTF-8')) {
        downloadUrl(response.request.responseURL);
        return
    }

    //验证token是否失效
    if (response.data.token) {
        location.href = "";
        Vue.prototype.$warn("登录失效，请重新登录");
        Vue.prototype.$maskoff();
    }
    if (response.data.code == 205) {
        Vue.prototype.$warn(response.data.message);
        Vue.prototype.$maskoff();
    }
    if (response.data.code == 210) {
        Vue.prototype.$warn("您当前无权限操作，请重新登录或联系有关部门");
        Vue.prototype.$maskoff();
    }
    return response;
}, function (error) {
    Vue.prototype.$warn("网络异常，请稍后再试");
    Vue.prototype.$maskoff();
});
Vue.prototype.$axios = instance;

//-----------获取token
Vue.prototype.$getToken = ()=>{
    //优先获取localStorage
    let token = localStorage.getItem("token");
    if(token){
      return token;
    }
    let cookie = document.cookie.split(";");
    for(let i of cookie){
        if(i.split("=")[0] == "token"){
            token = i.split("=")[1];
        }
    }
    if(token){
        return token;
    }
};
//--------正则匹配
Vue.prototype.$reg = {
    "email": /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    "en": /[a-zA-Z]/,
    "cn": /[\u4e00-\u9fa5]/,
    "number": /^[0-9]*$/,
    "phone": /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
    "en_num": /^[A-Za-z0-9]+$/,
};
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    render: function (c) {
        return c(App)
    },
});
