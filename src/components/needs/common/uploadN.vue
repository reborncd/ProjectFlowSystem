<style scoped>
    .upload-wrapper{
        float: none;
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
    <el-dialog title="上传附件" :visible="data.uploadvisible" width="80%"
               append-to-body modal-append-to-body :before-close="closeDialog">
        <div class="upload-wrapper" style="margin-top: 10px;">
            <el-button type="primary" size="mini">上传附件</el-button>
            <input type="file" @change="uploadModel($event)" class="upload-input" style="width: 80px;">
        </div>
        <p :key="index" v-for ="(item,index) in data.uploadFiles" style="margin-top: 10px;">{{item.name}}
            <i style="margin-left: 10px;cursor: pointer;color: red;"
               @click="data.fileIds.splice(index,1);data.uploadFiles.splice(index,1)" class="el-icon-close"></i>
        </p>
        <div slot="footer" class="dialog-footer">
            <el-button @click="data.uploadvisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="subFiles" size="mini">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props:["data"],
        data(){
            return {}
        },
        methods: {
            closeDialog(){
                this.data.uploadvisible = false;
                this.$set(this.data,"fileIds",[]);
                this.$set(this.data,"uploadFiles",[]);
            },
            uploadModel(e){
                //CODE 开发手册
                //TEST 测试用例模板
                //TESTACC 准生产环境附件
                //TESTPROD 生产环境附件
                //TESTSICE 试环境附件
                let type = "";
                switch (this.data.type){
                    case "上传手册":
                        type = "CODE"
                        break;
                    case "上传用例模板":
                        type = "TEST"
                        break;
                }
                let file = e.target.files[0];
                let params = new FormData();
                params.append("token",localStorage.getItem("token"));
                // params.append("TYPE",type);
//                params.append("BASE_ID",this.data.neel_id);
                params.append("file",file);
                this.$axios.post("/daliy/upload",params).then((res)=>{
                    let data = res.data;
                    if(data.code == 200){
                        this.data.fileIds.push(data.result.id);
                        this.data.uploadFiles.push(file);
                    }
                });
            },
            //提交上传的文件
            subFiles(){
                if(!this.data.fileIds.length){
                    this.$warn("请上传文件")
                }
                this.$maskin();
                let params = new URLSearchParams();
                params.append("DALIY_NEET_ID", this.data.neel_id);
                params.append("attachmentId",this.data.fileIds);
                this.$axios.post("/daliy/uploadConfrim",params).then((res)=>{
                    let data = res.data;
                    if(data.code == 200){
                        this.$success("上传成功！");
                        this.data.uploadvisible = false;
                        this.$maskoff();
                    }
                })
            }
        }
    }
</script>
