<style scoped>
    @import "../../static/css/login.css";
</style>

<template>
    <div>
        <div class="bg"></div>
        <div class="login-wrap">
            <img src="../../static/image/logo.png" alt="" class="logo">
            <div class="login-content">
                <div class="title">
                    <span class="static">找回密码</span>
                </div>
                <div class="label-wrap" @keyup="keyEvent($event)">
                    <el-input type="text" v-model="account" placeholder="请输入用户名">
                        <i slot="prefix" class="el-input__icon iconfont icon-gerenzhongxin"></i>
                    </el-input>
                    <el-input type="password" v-model="password" placeholder="请输入新密码">
                        <i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
                    </el-input>
                    <el-input type="text" v-model="phone" placeholder="请输入手机号码">
                        <i slot="prefix" class="el-input__icon iconfont icon-msnui-tel"></i>
                    </el-input>
                    <div class="action-wrap">
                        <el-button type="primary" @click="subreset">确定</el-button>
                        <el-button @click="back">返回</el-button>
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
    export default {
        data(){
            return {
                account: "",
                password: "",
                phone: ""
            }
        },
        created(){

        },
        methods: {
            keyEvent(ev){
                if (ev.keyCode == 13) {
                    this.subreset()
                }
            },
            subreset(){
                let reg = {
                    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                    account: /^[a-zA-Z]+$/,
                    password: /^[A-Za-z0-9]+$/,
                };
                if (this.account == "") {
                    this.$warn("请输入用户名");
                    return;
                }
                if (this.password == "") {
                    this.$warn("请输入新密码");
                    return;
                }
                if (this.phone == "") {
                    this.$warn("请输入手机号码");
                    return;
                }
//                if (!reg.account.test(this.account)) {
//                    this.$warn("用户名格式不正确");
//                    return;
//                }
//                if (!reg.password.test(this.password)) {
//                    this.$warn("新密码格式不正确");
//                    return;
//                }
//                if (!reg.phone.test(this.phone)) {
//                    this.$warn("手机号码格式不正确");
//                    return;
//                }
                this.$maskin()
                let params = new URLSearchParams();
                params.append('USER_ACCOUNT', this.account);
                params.append('PASSWORD', this.password);
                params.append('USER_PHONE', this.phone);
                this.$axios.post("/user/findPwd", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.alert("修改成功,请重新登录", () => {
                            localStorage.clear();
                            this.$go("/login")
                        })
                    } else {
                        this.$warn(data.message);
                    }
                    this.$maskoff();
                }).catch(()=>{
                    this.$warn("操作失败，请稍后重试");
                this.$maskoff();
                })
            },
            back(){
                this.$router.go(-1)
            }
        }
    }
</script>