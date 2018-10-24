<style scoped>
    .form {
        width: 600px;
        padding-top: 50px;
    }

    .form >>>input {
        width: 350px;
        /*margin-right: 10px;*/
    }

    .form .is-disabled {
        width: auto;
    }

    .form #upload {
        position: absolute;
        left: 0;
        top: 6px;
        width: 80px;
        height: 32px;
        opacity: 0;
    }

    .reset-wrap {
        width: 430px;
        text-align: center;
    }

    .reset-wrap button {
        margin: 0 15px
    }

    .two > > > input {
        width: auto;
    }

</style>

<template>
    <el-card class="box-card" style="margin-right: 17px;">
        <div class="text item">
            <div class="content">
                <div class="form" v-if="userInfo">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="用户名称">
                            <el-input v-model="form.account" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="form.name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="form.phone" :disabled="true"></el-input>
                            <el-button @click.prevent="changePhone">修改手机号码</el-button>
                        </el-form-item>
                        <el-form-item label="个人邮箱">
                            <el-input v-model="form.email" :disabled="form.departmentAble"></el-input>
                            <el-button @click.prevent="changeEamil">修改邮箱</el-button>
                        </el-form-item>
                        <el-form-item label="所属部门">
                            <el-input v-model="form.dept" :disabled="form.departmentAble"></el-input>
                        </el-form-item>
                        <el-form-item label="个人角色">
                            <el-input v-model="form.role" :disabled="form.departmentAble"></el-input>
                        </el-form-item>
                        <el-form-item label="个人职位">
                            <el-input v-model="form.position" :disabled="form.departmentAble"></el-input>
                        </el-form-item>
                        <el-form-item label="在职时间">
                            <el-input v-model="form.intime" :disabled="form.departmentAble"></el-input>
                        </el-form-item>
                        <el-form-item label="直属上级">
                            <el-input v-model="form.boss" :disabled="form.departmentAble"></el-input>
                        </el-form-item>

                        <!--<el-form-item label="所属部门">-->
                        <!--<el-input v-model="form.department" :disabled="form.departmentAble"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="个人职务">-->
                        <!--<el-input v-model="form.position" :disabled="form.positionAble"></el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="上传头像">-->
                        <!--<el-button size="small" type="primary">点击上传</el-button>-->
                        <!--<input type="file" id="upload">-->
                        <!--</el-form-item>-->
                        <el-form-item>
                            <el-button type="primary" @click="goLog">操作日志</el-button>
                            <el-button>返回</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-if="resetPhone">
                    <div class="form ">
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="用户名称">
                                <el-input v-model="form.account" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="登陆密码">
                                <el-input v-model="reset.password" :disabled="false" type="password"></el-input>
                            </el-form-item>
                            <el-form-item label="新手机号">
                                <el-input v-model="reset.phone" :disabled="false"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="reset-wrap">
                            <el-button type="primary" @click="resetSub">确定</el-button>
                            <el-button @click="back">返回</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
    export default {
        mounted(){
            this.loadData();
        },
        data(){
            return {
                resetPhone: false,
                userInfo: true,
                form: {
                    account: '',
                    name: '',
                    phone: '',
                    dept: '',
                    role: '',
                    position:'',
                    email:'',
                    intime: '',
                    boss: '',
                    departmentAble: true,
                    positionAble: false,
                    roles_value: ""
                },
                reset: {
                    password: "",
                    phone: ""
                }
            }
        },
        methods: {
            loadData(){
                this.calculate();
                this.$maskin();
                let params = new URLSearchParams();
                this.$axios.post('/user/userMessage', params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        let boss_dept = data.result.F_DEPT_NAME ? data.result.F_DEPT_NAME : "";
                        let boss_name = data.result.F_USER_NAME ? data.result.F_USER_NAME : "";
                        this.form.name = data.result.USER_NAME;//姓名
                        this.form.account = data.result.USER_ACCOUNT;//账号
                        this.form.phone = data.result.USER_PHONE;//
                        this.form.email = data.result.USER_MAIL ? data.result.USER_MAIL : "";
                        this.form.dept = data.result.DEPT_NAME ? data.result.DEPT_NAME : "";
                        this.form.role = data.result.ROLE_NAME ? data.result.ROLE_NAME : "";
                        this.form.position = data.result.POSITION ? data.result.POSITION : "";
                        this.form.intime = data.result.Days?data.result.Days + "天":"";
                        this.form.boss = `${boss_dept}——${boss_name}`;
                        this.$maskoff();
                    }
                })
            },
            calculate(){
                let height = document.querySelector(".mainr").offsetHeight;
                let card_body = document.querySelector(".box-card .el-card__body");
//                document.querySelector(".box-card").style.width = width - 224 - 30 + "px";
                card_body.style.height = height - 36 + "px";
            },
            changePhone(){
                this.resetPhone = !this.resetPhone;
                this.userInfo = !this.userInfo;
                this.reset.password = "";
                this.reset.phone = "";
            },
            back(){
                this.changePhone()
            },
            //修改邮箱
            changeEamil(){
                this.prompt("修改邮箱","请填写新邮箱",(val)=>{
                    if(!val.value){
                        this.$warn("请填写新邮箱地址");
                        return;
                    }
                    if(!this.$reg.email.test(val.value)){
                        this.$warn("邮箱格式不正确");
                        return;
                    }
                    let params = new URLSearchParams();
                    params.append("Mail",val.value);
                    this.$axios.post("user/updateMail",params).then((res)=>{
                        let data= res.data;
                        if(data.code == 200){
                            this.$success("修改成功");
                            this.loadData();
                        }
                    })
                })
            },
            resetSub(){
                let reg = {
                    phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
                    password: /^[A-Za-z0-9]+$/,
                };
                let params = new URLSearchParams();
                params.append('oldPwd', this.reset.password);
                params.append('newPhone', this.reset.phone);
                if (this.reset.password == "") {
                    this.$warn("请输入密码");
                    return
                }
                if (this.reset.phone == "") {
                    this.$warn("请输入手机号码");
                    return
                }
                if (!reg.password.test(this.reset.password)) {
                    this.$warn("密码格式有误");
                    return
                }
                if (!reg.phone.test(this.reset.phone)) {
                    this.$warn("手机格式有误");
                    return
                }
                this.$axios.post("/user/updatePhone", params).then((res) => {
                    let data = res.data;
                    if (data.result == 1) {
                        this.alert("修改成功", () => {
                            this.back()
                        })
                    } else if (data.result == 0) {
                        this.$warn(data.message);
                    }
                })
            },
          //操作日志
          goLog(){
            	this.$go("/home/czrz")
          }
        }
    }
</script>
