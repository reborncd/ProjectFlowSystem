<style scoped>
    .form {
        width: 600px;
        padding-top: 50px;
    }

    .form input {
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
</style>

<template>
    <div class="form ">
        <el-form   label-width="80px">
            <el-form-item label="用户名称">
                <el-input v-model="account" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="旧密码">
                <el-input v-model="reset.oldPw" :disabled="false" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="reset.newPw" :disabled="false" type="password"></el-input>
            </el-form-item>
        </el-form>
        <div class="reset-wrap">
            <el-button type="primary" @click="resetSub">确定</el-button>
            <el-button @click="back">返回</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            account:localStorage.getItem("ACCOUNT"),
            reset:{
                oldPw:"",
                newPw:""
            }
        }
    },
    created(){

    },
    methods:{
        resetSub(){
            let reg_pwd = /^[A-Za-z0-9]+$/;
            if(this.reset.oldPw == ""){
                this.$warn("请输入旧密码");
                return;
            }
            if(this.reset.newPw == ""){
                this.$warn("请输入新密码");
                return;
            }
//            if (!reg_pwd.test(this.reset.oldPw)) {
//                this.$warn("旧密码格式有误");
//                return
//            }
//            if (!reg_pwd.test(this.reset.newPw)) {
//                this.$warn("新密码格式有误");
//                return
//            }
            let params = new URLSearchParams();
            params.append('oldPwd',  this.reset.oldPw);
            params.append('newPwd', this.reset.newPw);
            this.$axios.post("/user/updatePwd ", params).then((res) => {
              let data = res.data;
              if(data.code == 200){
                this.alert("修改成功,请重新登录", () => {
                      localStorage.clear();
                      this.$router.replace("/login")
                })
              }else{
                this.$warn(data.message);
              }
                // let data = res.data;
                // if (data.result == 1) {
                //     this.alert("修改成功,请重新登录", () => {
                //         localStorage.clear();
                //         this.$router.replace("/login")
                //     })
                // } else if (data.result == 0) {
                //     this.$warn(data.message);
                // }
            })
        },
        back(){
            this.$go("/home/index")
        }
    }
}
</script>
