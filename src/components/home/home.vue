<style scoped>
    .header {
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 50px;
        z-index: 2;
    }

    /*logo*/
    .header .company {
        width: 224px;
        height: 50px;
        /* text-align: center; */
        /* background: #fff; */
        background: #CC312B;
        display: flex;
        flex-direction: row;
    }

    /* .header .company img {
        display: inline-block;
        margin: 14px 0;
    } */
    .company_logo{
      width: 50px;
      height: 50px;
      border: none;
    }

    /*菜单*/
    .nav {
        flex: 1;
        height: 50px;
        padding: 0 17px;
        background: #404d5d;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .nav ul {
        padding-top: 15px;
    }

    .nav ul li {
        float: left;
        color: white;
        padding: 0 10px;
        line-height: 35px;
        background: #677484;
        margin-right: 5px;
        cursor: pointer;
    }

    .nav ul li:hover {
        color: #e7615e;
        background: white;
    }

    .nav ul li.active {
        color: #e7615e;
        background: white;
    }

    /*个人用户*/
    .nav .el-dropdown-link {
        color: white;
    }

    .nav .logout {
        color: white;
        margin-left: 10px;
        cursor: pointer;
    }

    .nav .user {
        line-height: 50px;
    }

    .nav .user img {
        float: left;
        margin: 10px 8px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }

    /*左侧菜单*/
    .mainl {
        position: fixed;
        left: 0;
        top: 0;
        width: 224px;
        height: 100%;
        padding: 50px 0;
        background: #778494;
        z-index: 1;
    }

    .mainl .state {
        color: white;
        line-height: 40px;
        border-bottom: 1px solid #9caab7;
        margin-left: 15px;
    }

    .mainl .aside-wrap li {
        padding-left: 15px;
        color: white;
        cursor: pointer;
        line-height: 40px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .mainl .aside-wrap li.active {
        background: #939da7;
    }

    .mainl .aside-wrap li i {
        margin-right: 30px;
    }

    .mainl .aside-wrap li:hover {
        background: #939da7;
    }

    .mainl .aside-wrap li:hover {
        background: #939da7;
    }

    /*主题内容*/
    .mainr {
        position: fixed;
        left: 224px;
        top: 50px;
        overflow: hidden;
        z-index: 1;
        width: 100%;
        height: 586px;
        padding: 17px 0 17px 17px;
        z-index:10;
    }

    .mainr::-webkit-scrollbar {
        width: 0;
    }

    .mainr::-webkit-scrollbar-thumb {
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
</style>
<style>
    /*.el-dialog__wrapper .el-dialog{*/
        /*width: 60%;*/
        /*position: fixed;*/
        /*left: 50%;*/
        /*top: 50%;*/
        /*transform: translate(-50%,-50%);*/
        /*margin: 0!important;*/
    /*}*/
    .el-dialog__body {
        max-height: 500px;
        overflow-y: auto;
    }

    .el-dialog {
        margin: 70px auto 0 !important;
    }
</style>
<template>
    <div class="">
        <div class="header clear">
            <div class="company">
                <img class="company_logo" src="../../static/image/user_logo_kdb.png" alt="">
                <span style="magfont-weight:bold;font-size:18px;line-height:50px;color:#fff;">开店宝项目管理系统</span>
            </div>
            <div class="nav">
                <ul class="clear fl">
                    <li v-for="(item,index) in mainMenu" :key="index"
                        :class="menuActive == item.menu_id?'active':''"
                        @click="changeMainMenu(item)">{{item.menu_name}}
                    </li>
                </ul>
                <div class="fr user">
                    <el-dropdown @command="handleCommand" trigger="click">
                        <span class="el-dropdown-link" style="cursor: pointer">
                            <img src="../../static/image/user_logo_kdb.png" alt="" width="30" height="30">
                            {{userName}}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="work">工作汇报</el-dropdown-item>
                            <el-dropdown-item command="userInfo">个人资料</el-dropdown-item>
                            <el-dropdown-item command="resetPassword">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <i class="logout el-input__icon iconfont icon-guanji" @click="logout"></i>
                </div>
            </div>
        </div>
        <div class="mainl">
            <div class="state">{{activeTitle}}</div>
            <ul class="aside-wrap">
                <li v-for="item in subMenu" @click="subMenuAction(item)" :key="item.menu_id" :class="subActive == item.menu_id?'active':''">
                    <i class="el-input__icon  el-icon-tickets"></i>{{item.menu_name}}
                </li>
            </ul>
        </div>
        <div class="mainr" :style="content">
            <router-view ref="routerView" :username="userName" :userInfo="userInfo"></router-view>
        </div>
        <div id="mask">
            <i class="el-icon-loading" id="loading"></i>
        </div>
    </div>
</template>
<script>
    import "../../static/css/card.css";
    export default {
        created(){
            this.calculate();
        },
        data(){
            return {
                content: {
                    width: "",
                    height: ""
                },
                mainMenu: [],//主要大功能菜单
                subMenu: [],//大功能菜单下的小菜单
                menuActive: "",//大导航的当前活动项
                activeTitle: "",//左侧菜单抬头，只做展示
                subActive: "",//左侧菜单的当前活动项
                userName: "",//用户名
                userInfo: "",//用户名
            }
        },
        mounted(){
            window.onresize = () => {
                this.calculate();
                if(this.$refs.routerView.calculate){
                    this.$refs.routerView.calculate();
                }
            };
            this.loadData();
        },
        methods: {
            loadData(){
                let params = new URLSearchParams();
                this.$axios.post("/user/main", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        //添加权限按钮----------------
                        let action = [];
                        for(let i of data.result.menus){
                            if(i.childMenus && i.childMenus.length){
                                for(let j of i.childMenus){
                                    if(j.menu_action == 0){
                                        //当前是操作,将操作添加到数组中
                                        let obj = {"menu_fid":j.menu_fid,"act":j.menu_name,"menu_fname":i.menu_name};
                                        action.push(obj)
                                    }else{
                                        j.childMenus && (()=>{
                                            for(let _i of j.childMenus){
                                                let obj = {"menu_fid":_i.menu_fid,"act":_i.menu_name,"menu_fname":j.menu_name};
                                                action.push(obj)
                                            }
                                        })()
                                    }
                                }
                            }
                        }
                        localStorage.setItem("POWER",JSON.stringify(action));
                        if(data.result.user.role){
                            localStorage.setItem("ROLE",data.result.user.role.role_NAME);
                        }
                        this.userName = data.result.user.user_NAME;
                        this.userInfo = data.result.user;
                        this.mainMenu = data.result.menus;

                        //------------------------设置左边子目录和active
                       this.setActiveButton()
                    }
                })
            },
            setActiveButton(){
                let nowPath = this.$router.currentRoute.path;//当前的路径
                for (let i of this.mainMenu) {//根据当前路径判断标题的active
                    //当前是主菜单且有路由
                    if(i.menu_url && i.menu_url == nowPath ) {
                        //判断当前主菜单下面是页面还是操作，是操作则不展示
                        if(i.childMenus && i.childMenus.length
                            && i.childMenus[0].menu_action != 0) {
                            this.subMenu = i.childMenus;
                        }
                        this.subActive = "";//清空左侧active
                        this.menuActive = i.menu_id;//设置当前的主菜单
                        this.activeTitle = i.menu_name;//设置左侧抬头标题
                        break;
                    }
                    //当前是子菜单，主菜单没有路由
                    if(!i.menu_url  && i.childMenus){
                        for(let j of i.childMenus){
                            if(j.menu_action == 1 && j.menu_url == nowPath){
                                this.subMenu = i.childMenus;
                                this.menuActive = i.menu_id;//设置当前的主菜单
                                this.subActive = j.menu_id;//清空左侧active
                                this.activeTitle = i.menu_name;//设置左侧抬头标题
                                break;
                            }
                        }
                    }
                }
            },
            calculate(){
                let height = window.innerHeight;
                let width=window.innerWidth
                this.content = {
                    'width':`${width-224}px`,
                    'height': `${height - 50}px`
                };
            },
            //顶部菜单点击事件
            changeMainMenu(val){
                this.subMenu = [];
                this.menuActive = val.menu_id;
                this.activeTitle = val.menu_name;
                if (!val.menu_url) {
                    this.$go(val.childMenus[0]['menu_url']);
                    this.subActive = val.childMenus[0]['menu_id'];
                    this.subMenu = val.childMenus;
                } else {
                    this.$go(val.menu_url);
                    this.subActive = ""
                }
            },
            //左侧菜单点击事件
            subMenuAction(val){
                this.$go(val.menu_url);
                this.subActive = val.menu_id;
            },
            handleCommand(type){
                switch (type) {
                    case "resetPassword":
                        //重置密码
                        this.$go("/home/resetPassword");
                        break;
                    case "logout":
                        //退出登录
                        this.logout();
                        break;
                    case "userInfo":
                        //个人资料
                        this.$go("/home/userCenter");
                        break;
                    case "work":
                        //工作汇报
                        this.$go("/home/workreport");
                        break;
                }
            },
            resetPassword(){
                this.$go("/resetPassword");
            },
            logout(){
                this.confirm("确定退出登录？", () => {
                    let params = new URLSearchParams();
                    this.$axios.post("/user/logout", params).then((res) => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$success("退出成功");
                            let date = new Date();
                            let account = localStorage.getItem("ACCOUNT");
                            localStorage.clear();
                            document.cookie="token=''; expires="+date.toGMTString();
                            localStorage.setItem("ACCOUNT", account);
                            location.href = ""
                        }
                    })
                })
            }
        },
        watch: {
            // 如果路由有变化，会再次执行该方法
            "$route": "setActiveButton"
        }
    }
</script>
