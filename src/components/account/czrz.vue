<style scoped>
    @import "../../static/css/table.css";
.title{
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    line-height: 30px;
}
</style>
<style>
    .czrz .el-table td, .czrz .el-table th {
        padding: 10px 0 !important;
    }
</style>
<template>
    <div class="czrz common-card-wrap" style="height: 100%;">
        <el-card class="box-card">
            <div class="text item">
                <div class="content">
                    <div class="table-list">
                        <h2 class="title">操作日志</h2>
                        <el-table :data="table.tableData" border style="width: 100%"
                                  v-if="table.tableHeight" :height="table.tableHeight">
                          <el-table-column prop="record_SUBJECT" label="操作类型" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="record_DESC" label="操作描述" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="record_START" :formatter="data" label="操作时间" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </div>
                <div class="block" style="text-align: right;margin-top: 10px;">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                :page-size="table.pageBy"
                                layout="total, prev, pager, next"
                                :total="table.tableOriginData.length">
                        </el-pagination>
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
                table:{
                    tableData:[],//当前展示的表格数据
                    tableOriginData:[],//表格源数据
                    tableHeight:"",//表格高度
                    pageBy:15,//一页展示的条数
                }
            }
        },
        mounted(){
            this.loadData()
        },
        methods: {
            calculate(){
                let height = document.querySelector(".mainr").offsetHeight;
                let card_body = document.querySelector(".box-card .el-card__body");
                card_body.style.height = height - 36 + "px";
                this.calculateTableHeight();
            },
            calculateTableHeight(){
                let height = document.querySelector(".mainr").offsetHeight;
                this.table.tableHeight = height -36-130;
            },
            data(val){
                let time = this.$format(val.record_START);
                return `${time.year}-${time.mouth}-${time.day} ${time.hour}:${time.min}:${time.second}`
            },
            loadData(){
                this.calculate();
                let params = new URLSearchParams();
                this.$axios.post("/user/queryRecord",params).then((res)=>{
                    let data = res.data;
                    if(data.code == 200){
                        this.$set(this.table,"tableData",data.result.slice(0,this.table.pageBy));
                        this.$set(this.table,"tableOriginData",data.result);
                    }
                })
            },
            handleCurrentChange(val){
                let page = val;//当前页数
                let size= this.table.pageBy;
                let nowData = this.table.tableOriginData.slice((page-1)*size,page*size);
                this.$set(this.table,"tableData",nowData)
            }
        }
    }
</script>
