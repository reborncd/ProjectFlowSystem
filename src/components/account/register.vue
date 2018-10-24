<style scoped>
    .el-form-item{
        margin-bottom:10px;
    }
    .label-wrap .el-input>>>input{
        margin-top:0;
    }
    .label-wrap .el-input>>>span{
        top: 0;
    }
    .label-wrap {
        margin: 10px 20px 0;
    }
    .el-date-editor.el-input{
        width: 100%;
    }
</style>

<template>
    <div>
        <div class="bg"></div>
        <div class="login-wrap">
            <img src="../../static/image/logo_kdb.png" alt="" class="logo">
            <div class="login-content">
                <div class="title">
                    <span class="static">注册</span>
                    <span class="go" @click="goLogin">去登录 <i class="el-icon-arrow-right"></i></span>
                </div>
                <div class="label-wrap" @keyup="keyEvent($event)">
                    <el-form  label-width="80px">
                        <el-form-item label="用户名">
                            <el-input type="text" v-model="account" placeholder="请输入用户名（只支持英文和数字）">
                                <i slot="prefix" class="el-input__icon iconfont icon-gerenzhongxin"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="登录密码">
                            <el-input type="password" v-model="password" placeholder="请输入登录密码">
                                <i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input type="text" v-model="name" placeholder="请输入姓名">
                                <i slot="prefix" class="el-input__icon iconfont icon-ID"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input type="text" v-model="phone" placeholder="请输入手机号">
                                <i slot="prefix" class="el-input__icon iconfont icon-msnui-tel"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio-group v-model="sex">
                                <el-radio  label="男"></el-radio>
                                <el-radio  label="女"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input type="text" v-model="email" placeholder="请输入邮箱">
                                <i slot="prefix" class="el-input__icon iconfont icon-youxiang"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="入职日期">
                            <el-date-picker
                                    v-model="date"
                                    type="date"
                                    placeholder="请选择日期"><i slot="prefix" class="el-input__icon iconfont icon-riqi"></i>
                            </el-date-picker>
                        </el-form-item>
                        <div class="action-wrap">
                            <el-button type="danger" @click="register">注册</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>

        <div id="mask">
            <i class="el-icon-loading" id="loading"></i>
        </div>
    </div>
</template>

<script>
    import "../../static/css/login.css";
    export default {
        data(){
            return {
                account: "",
                password: "",
                name: '',
                phone: '',
                sex:"",
                email:"",
                date:""
            }
        },
        methods: {
            goLogin(){
              this.$go("/login")
            },
            keyEvent(ev){
                if (ev.keyCode == 13) {
                    this.register()
                }
            },
            register(){
                let self = this;
                let reg = {
                    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                    account: /^[a-zA-Z0-9]+$/,
                    password: /^[A-Za-z0-9]+$/,
                    name: /^[\u4e00-\u9fa5]{0,7}$/,
                    // email:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    email:/^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/
                };
                if (this.account == "") {
                    this.$warn("请输入用户名");
                    return;
                }
                if (this.password == "") {
                    this.$warn("请输密码");
                    return;
                }
                if (this.name == "") {
                    this.$warn("请输入姓名");
                    return;
                }
                if (this.phone == "") {
                    this.$warn("请输入手机号码");
                    return;
                }
                if (this.sex == "") {
                    this.$warn("请选择性别");
                    return;
                }
                if (this.email == "") {
                    this.$warn("请输入邮箱");
                    return;
                }
//                if (this.date == "") {
//                    this.$warn("请输入入职日期");
//                    return;
//                }
                if (!reg.account.test(this.account)) {
                    this.$warn("用户名格式只支持英文和数字");
                    return;
                }
//                if (!reg.password.test(this.password)) {
//                    this.$warn("密码格式只支持数字和字母");
//                    return;
//                }
                if (!reg.name.test(this.name)) {
                    this.$warn("姓名格式不正确");
                    return;
                }
//                if (!reg.phone.test(this.phone)) {
//                    this.$warn("手机号码格式错误");
//                    return;
//                }
                if(String(this.phone).length != 11){
                      this.$warn("手机号码格式错误");
                      return;
                }
                if (!reg.email.test(this.email)) {
                    this.$warn("邮箱格式错误");
                    return;
                }
                this.$maskin();
                let dateFormat = this.$format(this.date);
                let date_upload = dateFormat.year+"-"+dateFormat.mouth+"-"+dateFormat.day;
                let params = new URLSearchParams();
                params.append('USER_ACCOUNT', this.account);
                params.append('USER_PWD', this.password);
                params.append('USER_NAME', this.name);
                params.append('USER_PHONE', this.phone);
                params.append('USER_SEX', this.sex=="男"?"1":"0");
                params.append('USER_MAIL', this.email);
                if(this.date){
                  params.append('USER_WORKER_TIME', this.date);
                }
                this.$axios.post("/user/add", params).then( (res)=>{
                    let data = res.data;
                    if (data.code == 200) {
                        this.$success("注册成功！");
                            this.$go("/login")
                    } else {
                        this.$warn(data.message);
                    }
                    this.$maskoff();
                }).catch((err) => {
                    this.$warn("注册失败");
                    this.$maskoff();
                })
            }
        }
    }
</script>
