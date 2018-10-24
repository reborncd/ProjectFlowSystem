<style scoped>

</style>

<template>
    <div>
      <el-table @selection-change="handleSelectionChange" :data="noticeList" border style="width: 100%">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column prop="title" label="已上传文本" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger"
                    @click="deleteNotices(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="padding:20px;" size="mini" type="danger"
              @click="MutilDeleteNotices">批量删除
      </el-button>
      <el-form label-width="100px">
        <el-col>
          <el-form-item :span="24" :md="8" label="选择添加类型">
            <el-radio v-model="type" label="1">首页通知</el-radio>
            <el-radio v-model="type" label="2">规范文档</el-radio>
          </el-form-item>
        </el-col>
        <el-col v-for="(item, index) in addConfig" :key="index">
            <div v-show="index=='0'">添加文本</div>
            <el-col
              v-for="myitem in [{name: '文本内容', mykey: 'text'}]"
              :span="7"
              :key="myitem.name">
              <el-form-item :label="myitem.name">
                <el-input size="medium" v-model="addConfig[index][myitem.mykey]" :placeholder="`请输入${myitem.name}`"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <i
                @click="handle(index)"
                :class="`anticon icon-${index === 0? 'plus': 'minus'}squareo`"
                style="font-size: 32px; color: blue; margin-left: 15px">
              </i>
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-form-item label="首页附件:">
              <el-upload
                :action="`${baseUrl}/daily/upload?token=${$getToken()}&fileType=DOC`"
                :on-success="uploadFileSuccess"
                auto-upload
                :on-preview="uploadFileClick"
                :on-remove="uploadClear"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已上传附件:">
              <div class="card-title" style="cursor:pointer;font-size:14px;color:blue;" v-for="(item,index) in fileListUpload" :key="index">
                <span title="点击可下载" @click="downloadFile(item.id)">{{item.name}}</span>
                <el-button style="margin-left:20px;" @click="deleteFile(item.id)" size="mini" type="danger">删除</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-col>
      </el-form>
      <!-- <el-table @selection-change="handleSelectionChange" :data="noticeList" border style="width: 100%">
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        <el-table-column prop="title" label="已上传文本" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger"
                    @click="splitDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <div id="mask">
            <i class="el-icon-loading" id="loading"></i>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
          type:'1',
          addConfig:[{text:''}],
          // fileList:[],
          fileListUpload:[],
          baseUrl:window._options.baseUrl,
          noticeList:[],
          multipleSelection: []
        }
    },
    mounted(){
      this.getFile();
      this.getNotice();
    },
    methods:{
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 删除
      deleteNotices(index,row){
        // console.log(index,row)
        this.$maskin();
        let arr=[];
        arr.push(row.id);
        let params=new URLSearchParams();
        params.append('ids',arr);
        this.$axios.post("/user/delNotices",params).then((res)=>{
          if(res.data.code=200){
            this.$maskoff();
            this.getNotice();
          }
        })
      },
      // 批量删除
      MutilDeleteNotices(){
        this.$maskin();
        let arr=[];
        this.multipleSelection.forEach(item=>{
          arr.push(item.id);
        });
        let params=new URLSearchParams();
        params.append('ids',arr);
        this.$axios.post("/user/delNotices",params).then((res)=>{
          if(res.data.code=200){
            this.$maskoff();
            this.getNotice();
          }
        })
      },
      getFile(){
        let params=new URLSearchParams();
        this.$maskin();
        params.append('fileType','DOC');
        this.$axios.post("/daily/getAttachmentsByType",params).then((res)=>{
          if(res.data.code=200){
            this.$maskoff();
            this.fileListUpload=res.data.result;
          }
        })
      },
      getNotice(){
        let params=new URLSearchParams();
        // params.append('type',this.type);
        this.$axios.post("/user/getNotices",params).then((res)=>{
          if(res.data.code=200){
            this.noticeList=res.data.result;
          }
        })
      },
       downloadFile(id){
        window.open(`${window._options.baseUrl}/daily/download?token=${this.$getToken()}&ID=${id}`);
      },
      deleteFile(id){
        let params=new URLSearchParams();
        params.append('ID',id);
        this.$maskin();
        this.$axios.post("/daily/delAttachment",params).then((res)=>{
          // this.fileListUpload=res.data.result;
          if(res.data.code=200){
            this.$success('删除成功')
            this.$maskoff();
            this.getFile();
          }
        })
      },
      clearData(){
        this.addConfig=[{text:''}];
      },
      submit(){
        // console.log(this.addConfig)
        let arr=[];
        this.addConfig.forEach(item=>{
          arr.push(item.text);
        })
        this.$maskin();
        let params=new URLSearchParams();
        params.append('titles',arr);
        params.append('type',this.type);
        this.$axios.post("/user/addNotice",params).then((res)=>{
          if(res.data.code=200){
            this.$success('添加成功');
            this.getNotice();
            this.clearData();
            this.$maskoff();
          }
        })
      },
      handle(index){
        if(index === 0){
          this.addConfig.push({text:''});
        }else{
          this.addConfig.splice(index, 1);
        }
      },
      uploadFileSuccess(res){
        // console.log(res+'上传附件');
        console.log(res);
        // 上传附件
        if(res.code === 200 && res.result.code === 200){
          // this.fileList.push({
          //   name: res.result.name,
          //   id: res.result.id,
          //   url: `${window._options.baseUrl}/daily/download?token=${this.$getToken()}&ID=${res.result.id}`
          // });
          this.getFile();
          // console.log(this.fileList[0].url)
        }else{
          this.$message.error(res.message);
        }
      },
      uploadFileClick(res){
        console.log(res.url);
        window.open(res.url);
      },
      uploadClear(){
        // 清空上传列表
        this.fileList=[];
      },
    }
}
</script>
