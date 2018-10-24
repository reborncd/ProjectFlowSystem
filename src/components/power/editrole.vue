<style scoped>
    .option-content {
        padding-left: 15px;
    }

    .option-wrap.info {
        width: 445px;
    }

    .option-wrap .option-title {
        padding-left: 15px;
        position: relative;
        margin-bottom: 15px;
    }

    .option-title i {
        position: absolute;
        left: 4px;
        top: 11px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ccc;
    }

    .option-title span {
        font-size: 18px;
        font-weight: 400;
    }

    .option-content .subtitle {
        color: #999999;
        margin-bottom: 15px;
    }

    .option-content .label-content {
        width: 570px;
    }

    .option-content .label-content:after {
        content: '';
        display: block;
        clear: both;
    }

    .option-content .el-checkbox {
        float: left;
        width: 190px;
        margin: 0 0 10px;
    }

    .btn-wrap {
        text-align: center;
    }

    /*.btn-wrap button {*/
    /*margin: 14px;*/
    /*width: 200px;*/
    /*height: 40px;*/
    /*}*/

    .el-form-item {
        margin-bottom: 10px;
    }

    /*选择框的样式*/
    .tree-wrapper {
        float: left;
        width: 49%;
        margin-right: 1%;
        border: 1px solid #ccc;
        padding: 10px;
        overflow-y: auto;
    }

    .tree-wrapper label {
        display: block;
        margin: 3px 0;
    }
</style>

<template>
    <div class="editrole common-card-wrap" style="height: 100%;">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="card-title">{{title}}</span>
            </div>
            <div class="text item">
                <div class="option-wrap info">
                    <h5 class="option-title"><i></i><span>基本信息</span></h5>
                    <div class="option-content">
                        <el-form label-width="100px" label-position="left">
                            <el-form-item label="所属部门">
                                <el-select clearable v-model="role_dept" style="width: 100%" placeholder="请选择部门" filterable
                                           @change="deptChange">
                                    <el-option v-for="item in role_arr" :label="item.dept_name" :key="item.dept_id"
                                               :value="item.dept_id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="已存在角色">
                                <el-select clearable v-model="a" style="width: 100%" placeholder="可查看已存在的角色" filterable>
                                    <el-option v-for="item in live_arr" :label="item.role_NAME" :key="item.role_ID"
                                               :value="item.role_ID"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="角色名称">
                                <el-input v-model="role_name" placeholder="请填写角色名称"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="option-wrap">
                    <h5 class="option-title"><i></i><span>权限配置</span></h5>
                    <div class="clear">
                        <div class="tree-wrapper lefttreewarp">
                            <el-checkbox v-model="leftCheckAll" @change="leftcheckAllEvent">全选</el-checkbox>
                            <el-tree
                                    :data="leftData"
                                    show-checkbox
                                    default-expand-all
                                    node-key="menu_id"
                                    ref="lefttree"
                                    highlight-current
                                    :expand-on-click-node="expand"
                                    @node-click="leftclick"
                                    @check-change="leftchange">
                            </el-tree>
                        </div>
                        <div class="tree-wrapper middletreewarp">
                            <el-checkbox v-model="rightCheckAll" @change="middlecheckAllEvent">全选</el-checkbox>
                            <el-tree
                                    :data="rightData"
                                    show-checkbox
                                    default-expand-all
                                    node-key="menu_id"
                                    ref="righttree"
                                    highlight-current
                                    @node-click="middleclick"
                                    @check-change="middlechange">
                            </el-tree>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-wrap" style="margin-top: 20px;">
                <el-button type="primary" size="mini" @click="submit">提交</el-button>
                <el-button type="danger" size="mini" @click="back">返回</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                a: "",//无意义
                title: "",//区分编辑和新增的标题
                role_name: "",//角色名称
                role_dept: "",//选择的部门的ID
                role_arr: "",//部门的数组
                live_arr: "",//展示已有角色的数组
                leftData: [],//左侧数据
                leftSaveData: [],//左侧存储的数据
                rightData: [],//右边数据
                rightSaveData: [],//中间存储的数据
                leftCheckAll: false,//左边全选状态
                rightCheckAll: false,//中间全选状态
                expand: false,///树形左侧点中禁用展开操作
                leftActiveData: "",//树形左侧点中的数据
            }
        },
        created(){
            if (this.$route.query && this.$route.query.id) {
                //当前是编辑操作
                this.title = "编辑角色";
            } else {
                this.title = "新增角色";
            }
        },
        mounted(){
            this.calculate();
            this.loadData();
        },
        methods: {
            calculate(){
                let height = document.querySelector(".mainr").offsetHeight;
                let card_header_height = document.querySelector(".el-card__header").offsetHeight;
                let card_body = document.querySelector(".box-card .el-card__body");
                let treeWrap = document.querySelectorAll(".tree-wrapper");
                card_body.style.height = height - 36 - card_header_height + "px";
                for (let i of treeWrap) {
                    i.style.height = height - 36 - card_header_height - 20 - 132 - 10 - 39 - 48 - 52 + "px";
                }
            },
            loadData(){
                this.$maskin();
                let params = new URLSearchParams();
                let roleId = this.$route.query.id;
                if (roleId) {
                    params.append("ROLE_ID", roleId)
                }
                this.$axios.post("role/queryRoleMenu", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        //设置下拉框
                        //加载所属部门
                        this.role_arr = data.result.deptRoles;
                        //设置left数据
                        let left = [];
                        for (let i of data.result.rootMenu) {
                            let fobj = {
                                "label": i.menu_name,
                                "children": [],
                                "action": [],
                                "menu_id": i.menu_id
                            };
                            if (i.childMenus) {
                                for (let j of i.childMenus) {
                                    let obj = {
                                        "label": j.menu_name,
                                        "menu_id": j.menu_id,
                                        "menu_fid": j.menu_fid,
                                        "action": []
                                    };
                                    if (j.childMenus) {
                                        for (let m of j.childMenus) {
                                            let _obj = {
                                                "label": m.menu_name,
                                                "menu_id": m.menu_id,
                                                "menu_fid": m.menu_fid
                                            };
                                            obj.action.push(_obj)
                                        }
                                    }
                                    if (j.menu_action == 1) {
                                        //当前是页面
                                        fobj.children.push(obj)
                                    } else {
                                        //当前是操作
                                        fobj.action.push(obj)
                                    }
                                }
                            }
                            left.push(fobj)
                        }
                        this.leftData = left;
                        //回显操作
                        let roleId = this.$route.query.id;
                        if(roleId){
                            //部门的回显
                            //当前是编辑回显选择部门操作
                            this.role_dept = data.result.role.DEPT_ID;
                            this.deptChange();
                            this.role_name = data.result.role.ROLE_NAME;
                            //
                            let arr = [];
                            let menus = data.result.menus;
                            for(let i= 0;i<left.length;i++){
                                if(left[i].children.length){
                                    //设置菜单数组
                                    if(menus.indexOf(left[i].menu_id)>=0){
                                        menus.splice(menus.indexOf(left[i].menu_id),1,"a");
                                    }
                                    //添加右侧选中数据
                                    for(let j of left[i].children){
                                        let obj = {
                                            "data":[],
                                            "key":[]
                                        };
                                        //当前是选中的二级页面
                                       if(j.action.length){
                                          obj.data = j.action;
                                          for(let n of j.action){
                                              if(menus.indexOf(n.menu_id)>=0){
                                                  obj.key.push(n.menu_id)
                                              }
                                          }
                                       }
                                       this.$set(this.rightSaveData,j.menu_id,obj);
                                        //
                                    }
                                }
                                if(roleId && left[i].action.length){
                                    let obj = {
                                        "data":[],
                                        "key":[]
                                    };
                                    obj.data = left[i].action;
                                    for(let n of left[i].action){
                                        if(menus.indexOf(n.menu_id)>=0){
                                            obj.key.push(n.menu_id)
                                        }
                                    }
                                    this.$set(this.rightSaveData,left[i].menu_id,obj)
                                }
                            }
                            for(let i of menus){
                                if(i!="a" && i){
                                    arr.push(i)
                                }
                            }
                            //左侧的回显功能
                            this.$refs.lefttree.setCheckedKeys(arr);
                            this.leftSaveData = arr;
                        }
                        this.$maskoff();
                    }
                })
            },
            deptChange(){
                this.$set(this, "live_arr", []);
                this.a = "";
                for (let i of this.role_arr) {
                    if (i.dept_id == this.role_dept) {
                        this.$set(this, "live_arr", i.roles)
                    }
                }
            },
            leftclick(val){
                this.leftActiveData = val;
                //清空上一个点击数据
                this.rightData = val.action.length ? val.action : [];
                //进行数据存储
                if (!this.rightSaveData[val.menu_id]) {
                    //如果之前没有点击过
                    let obj = {
                        "data": val.action.length ? val.action : [],
                        "key": []
                    };
                    this.$set(this.rightSaveData, val.menu_id, obj);
                } else {
                    //之前点击过，回显点击的数据
                    this.$refs.righttree.setCheckedKeys(this.rightSaveData[val.menu_id].key);
                }
                //设置右边全选
                if (val.action.length) {
                    val.action.length ==
                    this.rightSaveData[val.menu_id].key.length ?
                        this.rightCheckAll = true : this.rightCheckAll = false
                } else {
                    this.rightCheckAll = false
                }
            },
            leftchange(val, status){
                if(val.menu_fid || val.action.length){
                    //当前是二级页面
                    if (!status && this.rightSaveData[val.menu_id]) {
                        //取消了当前的权限
                        this.$set(this.rightSaveData[val.menu_id], "key", []);//从数组中去除
                        this.$refs.righttree.setCheckedKeys([]);//右侧设置为空
                    }
                }
                let leftLength = this.leftData.length;
                this.leftSaveData = this.$refs.lefttree.getCheckedKeys();
                for (let i of this.leftData) {
                    leftLength += i.children.length;
                }
                this.leftSaveData.length == leftLength ? this.leftCheckAll = true : this.leftCheckAll = false;
            },
            leftcheckAllEvent(val, status){
                if (this.leftCheckAll) {
                    //当前是全选
                    let idArr = [];
                    for (let i of this.leftData) {
                        idArr.push(i.menu_id);
                        if (i.children.length) {
                            for (let j of i.children) {
                                idArr.push(j.menu_id)
                            }
                        }
                    }
                    this.$refs.lefttree.setCheckedKeys(idArr);
                    this.leftSaveData = idArr
                } else {
                    this.$refs.lefttree.setCheckedKeys([]);
                    this.leftSaveData = []
                }
            },
            middleclick(){

            },
            middlechange(val, status){
                if (this.leftSaveData.indexOf(val.menu_fid) < 0) {
                    //当前点击需激活左侧
                    this.leftSaveData.push(val.menu_fid);
                    this.$refs.lefttree.setCheckedKeys(this.leftSaveData)
                }
                let lastArr = this.$refs.righttree.getCheckedKeys();
                this.$set(this.rightSaveData[val.menu_fid], "key", lastArr);
                if(lastArr.length == 0){
                    let leftData = this.$refs.lefttree.getCheckedKeys();
                    if(leftData.indexOf(val.menu_id)>=0){
                        this.leftSaveData.splice(leftData.indexOf(val.menu_id),1);
                    }
                    this.$refs.lefttree.setCheckedKeys(this.leftSaveData);
                }
                let rightLength = this.rightSaveData[val.menu_fid].key.length;
                rightLength == this.leftActiveData.action.length ? this.rightCheckAll = true : this.rightCheckAll = false;
            },
            middlecheckAllEvent(){
                //当没选中时或者当前无内容可选
                if (!this.leftActiveData || !this.leftActiveData.action.length) {
                    this.rightCheckAll = false;
                    return;
                }
                if (this.rightCheckAll) {
                    //当前是全选
                    let idArr = [];
                    for (let i of this.leftActiveData.action) {
                        idArr.push(i.menu_id);
                    }
                    this.$refs.righttree.setCheckedKeys(idArr);
                    this.$set(this.rightSaveData[this.leftActiveData.menu_id], "key", idArr)
                } else {
                    this.$refs.righttree.setCheckedKeys([]);
                    this.$set(this.rightSaveData[this.leftActiveData.menu_id], "key", [])
                }
            },
            submit(){
                let ROLE_NAME = this.role_name;
                let DEPT_ID = this.role_dept;
                if (!ROLE_NAME) {
                    this.$warn("请填写角色名称");
                    return;
                }
                if (!DEPT_ID) {
                    this.$warn("请选择所属部门");
                    return;
                }
                //设置提交的选中菜单数组
                let left = this.$refs.lefttree.getCheckedKeys();
                let right = this.rightSaveData;
                for(let i of this.leftData){
                    if(i.children.length && left.indexOf(i.menu_id)>=0){
                        let index = left.indexOf(i.menu_id);
                         left.splice(index,1)
                    }
                }
                //左侧提交的数据的处理
                let l = this.$unique(left);
                //右侧提交数据的处理
                let rightArr = [];
                for (let i of right) {
                    if (i) {
                        rightArr = rightArr.concat(i.key)
                    }
                }
                let r = this.$unique(rightArr);
                let menus = this.$unique(l.concat(r));
                if(!menus.length){
                    this.$warn("请至少选择一个权限！");
                    return;
                }
                this.$maskin();
                let roleId = this.$route.query.id;
                let params = new URLSearchParams();
                //roleId存在表示编辑否则是新增
                if (roleId) {
                    params.append("role_ID", roleId);
                }
                params.append("ROLE_NAME", ROLE_NAME);
                params.append("DEPT_ID", DEPT_ID);
                params.append("menus", menus);
                this.$axios.post(roleId ? "/role/editRole" : "/role/addRole", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.$success("操作成功！");
                        this.$back();
                        this.$maskoff();
                    }
                })
            },
            back(){
                this.$back()
            }
        }
    }
</script>
