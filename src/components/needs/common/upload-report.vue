<style scoped>

    .upload-wrapper{
        float: right;
        overflow: hidden;
        position: relative
    }
    .upload-input{
        position: absolute;
        height: 28px;
        opacity: 0;
        left: 0;
        top: 0;
    }
</style>

<template>
    <el-dialog title="上传测试报告" :visible="report.visible" width="60%"
               append-to-body modal-append-to-body
               :before-close="closeDialog">
        <el-form label-width="120px">
            <el-form-item label="报告类型">
                <el-select v-model="report.type" filterable clearable  placeholder="请选择类型"
                           style="width: 100%" @change="changeReportType">
                    <el-option :key="index" v-for="(item, index) in report.typeArr" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传文件">
                <div class="upload-wrapper" style="float:none;">
                    <el-button type="primary" size="mini">上传测试报告</el-button>
                    <input type="file" @change="uploadTestReport($event)" class="upload-input" style="width: 104px;top: 8px;">
                </div>
                <p :key="index" v-for ="(item,index) in report.uploadFile" style="margin-top: 10px;">{{item.name}}
                    <i style="margin-left: 10px;cursor: pointer;color: red;"
                    @click="report.uploadFile.splice(index,1);report.fileIds.splice(index,1)" class="el-icon-close"></i>
                </p>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="reportSub" size="mini">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        //CODE 开发手册
        //TEST 测试用例模板
        //TESTACC 准生产环境附件
        //TESTPROD 生产环境附件
        //TESTSICE 试环境附件
        props:["report"],
        data(){
            return {

            }
        },
        methods: {
            closeDialog(){
                this.report.visible = false;
            },
            //改变上传的类型
            changeReportType(){
                this.$set(this.report,"uploadFile",[]);
                this.$set(this.report,"fileIds",[]);
            },
            uploadTestReport(e){
                let file = e.target.files[0];
                if(!file){
                	return;
                }
                let params = new FormData();
                params.append("token",this.$getToken());
                params.append("TYPE","");
                params.append("file",file);
                this.$axios.post("/base/upload",params).then((res)=>{
                    let data = res.data;
                    if(data.code == 200){
                        this.report.fileIds.push(data.result.id);
                        this.report.uploadFile.push(file);
                        document.querySelector(".upload-input").value = "";
                    }
                });
            },
            reportSub(){
                if(!this.report.type){
                    this.$warn("请选择报告类型");
                    return;
                }
                if(!this.report.fileIds.length){
                    this.$warn("请上传文件")
                }
                this.$maskin();
                let type = this.report.type;//测试报告类型
                let params = new URLSearchParams();
                params.append("BASE_ID",this.report.neel_id);
                params.append("TYPE",type);
                params.append("attachmentId",this.report.fileIds);
                this.$axios.post("/base/uploadConfrim",params).then((res)=>{
                    let data = res.data;
                    if(data.code == 200){
                        this.$success("上传成功！");
                        this.report.visible = false;
                        this.$maskoff();
                    }
                })
            }

        }
    }
</script>
