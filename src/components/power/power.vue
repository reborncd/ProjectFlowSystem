<style scoped>
    .search .el-input {
        width: auto;
    }

    .table-list {
        margin-top: 30px;
        text-align: center !important;
    }

    .table-list table th div {
        text-align: center !important;
    }

    .el-table--border tr td:last-child, .el-table--border tr th:last-child {
        border-right: 0 !important;
    }

</style>
<style>
    .powerlist .el-table--border tr td:last-child,
    .powerlist .el-table--border tr th:last-child {
        border-right: none;
    }

    .powerlist .el-table td {
        padding: 6px 0 !important;
    }
</style>
<template>
    <div class="powerlist common-card-wrap" style="height: 100%;">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="card-title">权限列表</span>
            </div>
            <div class="text item">
                <div class="content">
                    <div class="table-list">
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column algin="center" prop="page" label="页面" width="120"></el-table-column>
                            <el-table-column algin="center" prop="power" label="权限" width="150"></el-table-column>
                            <el-table-column algin="center" prop="role" label="匹配角色"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!--<div style="text-align: center;margin-top: 20px;" @click="a">-->
                <!--<el-button>返回</el-button>-->
            <!--</div>-->
        </el-card>
    </div>
</template>

<script>
    import powerStatic from "../../static/js/power";
    export default {
        data(){
            return {
                tableData:powerStatic
            }
        },
        mounted(){
            let height = document.querySelector(".mainr").offsetHeight;
            let card_header_height = document.querySelector(".el-card__header").offsetHeight;
            let card_body = document.querySelector(".box-card .el-card__body");
            card_body.style.height = height - card_header_height - 36 + "px";
        },
        methods: {
            a(){
                this.$router.go(-1)
            }
        }
    }
</script>