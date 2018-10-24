<style scoped>
    .action-wrap{
        position: relative;
    }
    .backpassword{
        position: absolute;
        right: 0;
        top:0;
        color: #409EFF;
    }
</style>

<template>
    <div>
        <div class="bg"></div>
        <div class="login-wrap">
            <img src="../../static/image/logo_kdb.png" alt="" class="logo">
            <div class="login-content">
                <div class="title">
                    <span class="static">登录</span>
                    <span class="go" @click="goRegister">去注册 <i class="el-icon-arrow-right"></i></span>
                </div>
                <div class="label-wrap" @keyup="keyEvent($event)">
                    <el-input type="text" v-model="account" placeholder="请输入用户名">
                        <i slot="prefix" class="el-input__icon iconfont icon-gerenzhongxin"></i>
                    </el-input>
                    <el-input type="password" v-model="password" placeholder="请输入登录密码">
                        <i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
                    </el-input>
                    <div class="action-wrap">
                        <el-checkbox v-model="remember">记住密码</el-checkbox>
                        <el-checkbox v-model="auto">自动登录</el-checkbox>
                        <router-link to="backpassword" class="fr backpassword">忘记密码</router-link>
                    </div>
                    <div class="action-wrap">
                        <el-button type="primary" @click="login">登录</el-button>
                    </div>
                </div>
            </div>
        </div>
        <div id="mask">
            <i class="el-icon-loading" id="loading"></i>
        </div>
    </div>
</template>

<script>
    import  "../../static/css/login.css";
    export default {
        data(){
            return {
                account: "",
                password: "",
                remember:true,
                auto: true
            }
        },
        created(){
            let type = localStorage.getItem("TYPE");
            //判断登录方式
            if (type == "REMEMBER") {
                //记住密码
                this.account = localStorage.getItem("ACCOUNT");
                this.password = localStorage.getItem("PW");
                this.remember = true;
            }
        },
        methods: {
            goRegister(){
                this.$router.push({'path': '/register'})
            },
            keyEvent(ev){
                if (ev.keyCode == 13) {
                    this.login()
                }
            },
            login(){
                let reg = {
                    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                    account: /^[a-zA-Z]+$/,
                    password: /^[A-Za-z0-9]+$/,
                    name: /^[\u4e00-\u9fa5]{0,}$/
                };
                if (this.account == "") {
                    this.$warn("请输入用户名");
                    return;
                }
                if (this.password == "") {
                    this.$warn("请输入密码");
                    return;
                }
//                if (!reg.account.test(this.account)) {
//                    this.$warn("用户名格式错误");
//                    return;
//                }
                this.$maskin();
                let params = new URLSearchParams();
                params.append('USER_ACCOUNT', this.account);
                params.append('USER_PWD', this.password);
                this.$axios.post("/user/login", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        localStorage.clear();//清除旧数据
                        if (this.auto) {
                            //选择了自动登录
                            localStorage.setItem("TYPE", 'AUTO');
                            localStorage.setItem("token", data.result.token);
                        } else if (this.remember) {
                            //记住密码
                            localStorage.setItem("TYPE", 'REMEMBER');
                            localStorage.setItem("PW", data.result.pwd);
                            document.cookie = `token=${data.result.token}`;
                        } else {
                            //什么都不选择
                            localStorage.setItem("TYPE", '');
                            document.cookie = `token=${data.result.token}`;
                        }
                        localStorage.setItem("ACCOUNT", this.account);
                        this.$go("/home")
                    } else if (data.result == 0) {
                        this.$warn("登录失败");
                    }
                    this.$maskoff();
                }).catch(()=> {
                    this.$warn("登录失败");
                    this.$maskoff();
                })
            },
        }
    }
</script>
