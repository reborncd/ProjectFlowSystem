<style>
    .rolemanage .el-card__header{
        display: none;
    }
    .rolemanage .search .el-input {
        width: auto;
    }

    .rolemanage .table-list {
        margin-top: 10px;
        text-align: center !important;
    }

    .rolemanage .table-list table th div {
        text-align: center !important;
    }

    .rolemanage .el-table--border tr td:last-child, .el-table--border tr th:last-child {
        border-right: 0 !important;
    }

    .rolemanage .el-button--small {
        padding: 6px 10px;
    }

    .rolemanage .el-button + .el-button {
        margin-left: 3px;
    }

</style>
<style>
    .rolemanage .el-table--border tr td:last-child,
    .rolemanage .el-table--border tr th:last-child {
        border-right: none;
    }

    .rolemanage .el-table td {
        padding: 6px 0 !important;
    }
</style>
<style lang="less">
@import '../commonless/tree_and_table.less';
</style>
<template>
    <div class="rolemanage common-card-wrap" style="height: 100%;">
        <el-card class="box-card">
            <div slot="header" class="clearfix" style="display: none">
                <span class="card-title">角色管理</span>
            </div>
            <div class="handle-bar action">
                <router-link :to="{path:'addrole'}">
                    <el-button size="mini" type="primary">新建角色</el-button>
                </router-link>
                <!--<router-link to="power">-->
                    <!--<el-button size="mini">权限列表</el-button>-->
                <!--</router-link>-->
                <!--<div class="search fr">-->
                    <!--<el-input size="mini" v-model="search" placeholder="输入检索关键字"></el-input>-->
                    <!--<el-button size="mini" type="primary">检索</el-button>-->
                <!--</div>-->
            </div>
            <div class="text item">
                <div class="content">
                    <div class="table-list">
                        <div class="left-tree role-tree">
                            <div class="left-tree-title">选择部门</div>
                            <el-tree :data="treeData" @node-click="leftTreeClick"></el-tree>
                        </div>

                        <el-table class="right-table role-el-table" :data="tableData" border :height="tableHeight"
                                  v-if="tableHeight" empty-text="请选择部门或当前部门没有数据">
                            <el-table-column align="center" prop="role_NAME" label="所属角色"></el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <router-link :to="{path:'editrole',query:{id: scope.row.role_ID}}">
                                        <el-button size="small" type="primary">编辑</el-button>
                                    </router-link>
                                    <el-button @click="deleteRow(scope.row,scope)" size="small" type="danger">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                search: "",
                tableData: [],
                tableHeight: "",
                treeData: [],
                leftTreeData: []
            }
        },
        mounted(){
            this.loadData()
        },
        methods: {
            calculate(){
                let height = document.querySelector(".mainr").offsetHeight;
                let leftTree = document.querySelector(".left-tree");
                let card_header_height = document.querySelector(".el-card__header").offsetHeight;
                let card_body = document.querySelector(".box-card .el-card__body");
                card_body.style.height = ( height - 34) - card_header_height + "px";
                //                         总高度        -   卡片头高度     -card_body上下padding-操作栏高度28-margin-top的15px
                leftTree.style.height = (height - 34) - card_header_height - 20 - 28 - 22 + "px";
                this.tableHeight = (height - 34) - card_header_height - 20 - 28 - 22;
            },
            loadData(){
                this.calculate();
                this.tableData =[];
                let params = new URLSearchParams();
                this.$maskin();
                this.$axios.post("/role/queryRoleMenu", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        let arr = [];
                        for (let i of data.result.deptRoles) {
                            if(!i.dept_fid){
                                let treeObj = {
                                    "label": i.dept_name,
                                    "id": i.dept_id,
                                    "children": [],
                                    "roles": i.roles,
                                };
                                for(let j of data.result.deptRoles){
                                    if (j.dept_fid && j.dept_fid == i.dept_id) {
                                        //当前不是父级，则把当前的信息添加到对应fID的父级进去
                                        let obj ={
                                            'label':j.dept_name,
                                            'id':j.dept_id,
                                            "roles": j.roles,
                                            "children":[]
                                        };
                                        for(let n of data.result.deptRoles){
                                            if(n.dept_fid && n.dept_fid == j.dept_id){
                                                let cobj = {
                                                    'label':n.dept_name,
                                                    'id':n.dept_id,
                                                    "roles": n.roles,
                                                };
                                                obj.children.push(cobj)
                                            }
                                        }
                                        treeObj.children.push(obj)
                                    }
                                }
                                arr.push(treeObj)
                            }
                        }
                        this.treeData = arr;
                        this.$maskoff()
                    }
                })
            },
            leftTreeClick(val){
                this.tableData = val.roles
            },
            deleteRow(el, scope){
                let params = new URLSearchParams();
                params.append("ROLE_ID", el.role_ID)
                this.confirm("确定删除该角色？", () => {
                  this.$maskin();
                    this.$axios.post("/role/deleteRole", params).then((res) => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$success("操作成功！");
                            this.loadData()
                        }
                    })
                })
            }
        }
    }
</script>
