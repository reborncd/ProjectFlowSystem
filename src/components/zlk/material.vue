<style scoped>
    @import "../../static/css/table.css";
    @import "../../static/css/console.css";

    .word {
        text-align: center;
        line-height: 50px;
        height: 50px;
        font-size: 24px;
        font-weight: bold;
    }
</style>
<style>
    .zlk .el-table .cell {
        text-align: center;
    }
</style>
<template>
    <div class="zlk common-card-wrap" style="height: 100%;">
        <div style="height:60px;width:100%;padding:10px;">
            <el-button type="primary" @click="fanhui">返回</el-button>
        </div>
        <el-card class="box-card">
            <div class="text item">
                <div class="content">
                    <h2 class="word">{{name}}</h2>
                    <el-form label-width="100px" label-position="left">
                        <el-form-item label="文档编号">
                            {{code}}
                        </el-form-item>
                        <el-form-item label="文档名称">
                            {{name}}
                        </el-form-item>
                        <el-form-item label="文档版本">
                            {{version}}
                        </el-form-item>
                        <el-form-item label="关联系统">
                            {{system}}
                        </el-form-item>
                        <el-form-item label="录入人员">
                            {{person}}
                        </el-form-item>
                        <el-form-item label="录入时间">
                            {{date}}
                        </el-form-item>
                        <el-form-item label="文档简介">
                            {{des}}
                        </el-form-item>
                    </el-form>
                    <div class="table-list">
                        <el-table :data="fileList" border style="width: 100%">
                            <el-table-column prop="at_FILENAME" label="文档名"></el-table-column>
                            <el-table-column prop="at_FILESIZE" :formatter="filesize" label="大小" width="100"></el-table-column>
                            <el-table-column label="操作" width=100>
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="download(scope.row)">下载</el-button>
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
                fileList:[],//文档数据数组
                file: "",
                code: "",//编号
                name: "",//文档名称
                version: "",//文档版本
                dir: "",//目录位置
                system: "",//关联系统
                person: "",//录入人员
                date: "",//录入时间
                des: "",//文档简介
            }
        },
        filters: {
            "yyyy-mm-dd": function (time) {
                let d = new Date(time);
                let year = d.getFullYear();
                let month = d.getMonth() + 1 < 10 ? '0' + d.getMonth() : '' + d.getMonth();
                let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
                let hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
                let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
                let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
                return year + '-' + month + '-' + day;
            },
        },
        mounted(){
            this.loadData()
        },
        methods: {
            fanhui(){
                this.$go('zlk')
            },
            change(e){
                this.file = e.target.files[0]
            },
            calculate(){
                let height = document.querySelector(".mainr").offsetHeight;
                let card_body = document.querySelector(".box-card .el-card__body");
                card_body.style.height = height - 36 + "px";
            },
            filesize(val){
                let size = parseFloat(val.at_FILESIZE/1000).toFixed(2);
                return size+"kb"
            },
            loadData(){
                this.calculate();
                let id = this.$route.query.id;//获取当前的ID
                if(id){
                    this.$maskin();
                    let params = new URLSearchParams();
                    params.append("DATUM_ID",id);
                    this.$axios.post("/datum/getDatumById",params).then((res)=>{
                        let data = res.data;
                        if(data.code == 200){
                            let result = data.result;
                            let date = this.$format(result.date_TIME);
                            this.fileList =result.datumATDetails;
                            this.code = result.datum_ID;
                            this.name = result.datum_NAME;
                            this.version = result.datum_VERSION;
                            this.dir = result.directory_LOCATION;
                            this.system = result.interconnected_SYSTEM;
                            this.person = result.user_NAME;
                            this.date =`${date.year}-${date.mouth}-${date.day}  ${date.hour}:${date.min}:${date.second}`;
                            this.des = result.file_DESCRIPTIOON;
                            this.$maskoff();
                        }
                    })
                }
            },
            //下载
            download(row){
                let id = row.at_ID;
                this.$axios.get(`/datum/download?type=2&fileId=${id}&token=${this.$getToken()}`)
            }
        }
    }
</script>