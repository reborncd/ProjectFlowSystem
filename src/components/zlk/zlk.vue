<style scoped>
    @import "../../static/css/table.css";
    @import "../../static/css/console.css";
</style>
<style>
    .authManageTitle{
      font-size: 18px;
      line-height: 24px;
    }
    .zlk .el-table .cell {
        text-align: center;
    }
    .docedit .el-select{
        width: 100%;
    }
    .docedit-wrap .el-form-item{
        margin-bottom: 10px;
    }
    .docedit-wrap .el-dialog__body{
        padding: 15px 20px;
    }
</style>
<style lang="less">
@import '../commonless/tree_and_table.less';
.uploadBox{
  width: 100%;
  .el-upload{
    width: 100%;
    .el-upload-dragger{
      width: 100%;
    }
  }
}
</style>
<template>
    <div class="zlk common-card-wrap" style="height: 100%;">
        <div
          class="handlerPanel"
          @mouseenter="setDsq('clear')"
          @mouseleave="setDsq"
          :style="`left: ${handlerPanel.left}px;top: ${handlerPanel.top}px`"
          v-if="handlerPanel.dirHandlerVisible"
          ref="handlerPanelNode">
            <el-button type="text" size="medium" @click="handlerDirWithServer(2)" v-if="isDir == '0'">重命名</el-button>
            <el-button type="text" size="medium" @click="handlerDirWithServer(1)" v-if="isDir == '0'">新建文件夹</el-button>
            <el-button type="text" size="medium" @click="handlerDirWithServer(3)" v-if="isDir == '0'">删除文件夹</el-button>
            <el-button type="text" size="medium" @click="addZL" v-if="isAdded == '0'">上传资料</el-button>
            <el-button type="text" size="medium" @click="authSetting('add')" v-if="isPower == '0'">权限设置</el-button>
            <el-button type="text" size="medium" @click="downDir" v-if="isDir == '0'">下载</el-button>
        </div>
        <el-card class="box-card">
            <div class="text item">
                <div class="content">
                    <div class=" action clear" style="height: 45px; line-height: 45px">
                        <el-button type="primary"  size="mini" @click="editNo" v-if="dirManage == '0'">文档编号管理</el-button>
                        <el-select v-model="selectValue" style="float: right"  size="mini" @change="changeTree" filterable>
                            <el-option
                                    v-for="(item, index) in options"
                                    :label="item.key"
                                    :key="index"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="clear" >
                        <div class="tree-wrapper  left-tree" style="overflow-x: auto">
                          <div class="left-tree-title">{{selectValue == 1?'选择目录':'选择系统'}}</div>
                          <el-tree
                            :data="treeData"
                            @node-click="leftClick"
                            @node-contextmenu="RightClick"
                            node-key="id"
                            @node-expand="handlerPanel.dirHandlerVisible = false"
                            @node-collapse="handlerPanel.dirHandlerVisible = false"
                            >
                          </el-tree>
                        </div>
                        <div class="tree-wrapper  right-table">
                            <div class="table-list" style="margin-top: 0;">
                                <el-table :data="table.tableData" border style="width: 100%"
                                          :height="table.tableHeight" v-if="table.tableHeight"
                                          highlight-current-row>
                                    <el-table-column prop="datum_ID" label="文档编号"></el-table-column>
                                    <el-table-column prop="datum_NAME" label="文档名称"></el-table-column>
                                    <el-table-column prop="file_DESCRIPTIOON" label="文档简介" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="date_TIME" :formatter="dataFormatter" width="120"
                                                     label="录入时间"></el-table-column>
                                    <el-table-column prop="user_NAME" width="80" label="录入人员"></el-table-column>
                                    <el-table-column label="操作" width="220">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="primary"
                                                       @click="viewrow(scope.$index, scope.row)">查看
                                            </el-button>
                                            <el-button size="mini" type="primary"
                                                       @click="downloadrow(scope.$index, scope.row)">下载
                                            </el-button>
                                            <el-button size="mini" type="danger"
                                                       @click="deleteFile(scope.$index, scope.row)">删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <SelectUser
          v-if="authManageVisible"
          :panelVisible.sync='authManageVisible'
          :panelTip='panelTip'
          :myurl='myurl'
          :showAllButton="true"
          v-on:message='submitAuthHandle'
        ></SelectUser>
        <!--新建资料-->
        <el-dialog class="docedit-wrap" title="上传资料" :close-on-click-modal="false" :visible="add.addvisible" width="50%"
                   append-to-body modal-append-to-body :before-close="closeDialog">
            <el-form label-width="100px">
                <el-row :md="24" :gutter="20">
                    <el-col :span="24" :md="24">
                        <el-form-item label="文档编号" class="docedit">
                            <el-col :span="8" style="padding-left: 0">
                                <el-select v-model="add.subform.company" placeholder="企业代号" filterable>
                                    <el-option
                                            v-for="item in add.subform.companyArr"
                                            :key="item.no_ID"
                                            :label="item.no_REMARK+'（'+item.no_NAME+'）'"
                                            :value="item.no_NAME">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" style="padding-left: 0">
                                <el-select v-model="add.subform.system" placeholder="系统代号" filterable>
                                    <el-option
                                            v-for="item in add.subform.systemArr"
                                            :key="item.no_ID"
                                            :label="item.no_REMARK+'（'+item.no_NAME+'）'"
                                            :value="item.no_NAME">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" style="padding-left: 0">
                                <el-select v-model="add.subform.doc" placeholder="文档类型" filterable>
                                    <el-option
                                            v-for="item in add.subform.docArr"
                                            :key="item.no_ID"
                                            :label="item.no_REMARK+'（'+item.no_NAME+'）'"
                                            :value="`${item.no_NAME}-${item.no_ID}`">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6" style="padding-left: 0; margin-top: 10px">
                                <el-input v-model="add.subform.code" disabled size="small"></el-input>
                            </el-col>
                            <el-col :span="6" style="padding-left: 0; margin-top: 10px">
                                <el-input v-model="add.subform.year" disabled size="small"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="文档路径">
                            <span>{{handlerPanel.currentItem? handlerPanel.currentItem.data.path: ''}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="文档名称">
                            <el-input v-model="add.subform.wordname" placeholder="默认为上传文件的文件名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="文档名版本">
                            <el-col style="padding: 0">
                                <el-input v-model="add.subform.version">
                                    <template slot="prepend">V</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="关联系统" style="width: 100%">
                            <el-select v-model="add.subform.sysF" placeholder="请选择关联系统" filterable
                                       @change="sysChange" style="width: 50%">
                                <el-option
                                        v-for="item in add.subform.sysFather"
                                        :key="item.system_ID"
                                        :label="item.system_NAME"
                                        :value="item.system_ID+','+item.system_NAME">
                                </el-option>
                            </el-select>
                            <el-select v-model="add.subform.sysC" style="width: 50%; float: right" filterable placeholder="请选择关联系统">
                                <el-option
                                        v-for="item in add.subform.sysChild"
                                        :key="item.system_ID"
                                        :label="item.system_NAME"
                                        :value="item.system_ID+','+item.system_NAME">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="录入人员" >
                            <el-input placeholder="请输入内容" v-model="add.subform.write_user">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="文档简介">
                            <el-input
                                    maxlength="500"
                                    type="textarea"
                                    :rows="4"
                                    placeholder="请输入内容"
                                    v-model="add.subform.intro">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" :md="24">
                        <el-form-item label="上传文档" :span="12" :md="12">
                            <div style="position: relative;overflow: hidden">
                                <el-button type="primary" size="mini">上传附件</el-button>
                                <input type="file" @change="getFile" ref="fileUp" placeholder="上传附件"
                                       style="width:78px;height: 28px;opacity: 0;position: absolute;left: 0;top: 6px;">
                            </div>
                            <p v-for="(item,index) in add.subform.uploadFiles" :key="index">{{item.name}}
                                <i style="margin-left: 10px;cursor: pointer;color: red;"
                                   @click="add.subform.uploadFiles.splice(index,1);add.subform.fileIds.splice(index,1); $refs.fileUp.value=''"
                                   class="el-icon-close"></i>
                            </p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="add.addvisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="subaddForm" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <!--下载-->
        <el-dialog title="下载资料" :visible="download.downloadvisible" width="80%"
                   append-to-body modal-append-to-body :before-close="closeDialog">
            <div class="table-list">
                <el-table :data="download.data" border style="width: 100%">
                    <el-table-column prop="at_FILENAME" label="文档名"></el-table-column>
                    <el-table-column prop="at_FILESIZE" :formatter="filesize" label="大小" width="100"></el-table-column>
                    <el-table-column label="操作" width=100>
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="dlFromTable(scope.row)">下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="download.downloadvisible = false" size="mini">取 消</el-button>
            </div>
        </el-dialog>
      <!-----------维护编号412-------------->
      <el-dialog title="文档编号管理" :visible="maintain.visible" width="80%"
                 append-to-body modal-append-to-body :before-close="closeDialog">
        <!--------系统代号---------文档类型-->
        <el-form label-width="100px">
          <el-row :md="24" :gutter="20">
            <el-col :span="24" :md="24">
              <el-form-item label="企业代号">
                <el-col :span="8" :md="8" v-for="(item) in maintain.maintainData.qydhlist">{{item.NO_NAME}}{{item.NO_REMARK}}</el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="24">
              <el-form-item label="操作">
                <el-button size="mini" type="success" @click="maintainAdd(1,maintain.maintainData.qydhlist)">新增</el-button>
                <el-button size="mini" type="primary" @click="maintainEdit(1,maintain.maintainData.qydhlist)">修改</el-button>
                <el-button size="mini" type="danger" @click="maintainRemove(1,maintain.maintainData.qydhlist)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :md="24" :gutter="20">
            <el-col :span="24" :md="24">
              <el-form-item label="系统代号">
                <el-col :span="8" :md="8" v-for="(item) in maintain.maintainData.xtdhlist">{{item.NO_NAME}}{{item.NO_REMARK}}</el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="24">
              <el-form-item label="操作">
                <el-button size="mini" type="success" @click="maintainAdd(2,maintain.maintainData.xtdhlist)">新增</el-button>
                <el-button size="mini" type="primary" @click="maintainEdit(2,maintain.maintainData.xtdhlist)">修改</el-button>
                <el-button size="mini" type="danger" @click="maintainRemove(2,maintain.maintainData.xtdhlist)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :md="24" :gutter="20">
            <el-col :span="24" :md="24">
              <el-form-item label="文档类型">
                <el-col :span="8" :md="8" v-for="(item) in maintain.maintainData.wdlxlist">{{item.NO_NAME}}{{item.NO_REMARK}}</el-col>
              </el-form-item>
            </el-col>
            <el-col :span="24" :md="24">
              <el-form-item label="操作">
                <el-button size="mini" type="success" @click="maintainAdd(3,maintain.maintainData.wdlxlist)">新增</el-button>
                <el-button size="mini" type="primary" @click="maintainEdit(3,maintain.maintainData.wdlxlist)">修改</el-button>
                <el-button size="mini" type="danger" @click="maintainRemove(3,maintain.maintainData.wdlxlist)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>

      <el-dialog :title="maintain.name" :visible="maintain.editVisible" width="40%"
                 append-to-body modal-append-to-body :before-close="closeEdit">
        <!--------系统代号---------文档类型-->
        <el-form>
          <el-row :md="24" :gutter="20" v-for="(content,index) in maintain.maintainDataadd.qydh" >
            <el-col :span="10">
              <el-form-item label="" >
                <el-input placeholder="请输入编号" v-model="content.NO_NAME">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="" >
                <el-input placeholder="请输入名字" v-model="content.NO_REMARK">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" v-if="maintain.type==1">
            <i :class="index == 0 && maintain.maintainDataadd.qydh.length == 1?'el-icon-plus':index == maintain.maintainDataadd.qydh.length-1?'el-icon-plus':'el-icon-minus'" style="line-height: 40px;height: 40px;text-align: center;
            font-size: 20px;margin-left: 20px;cursor: pointer;font-weight: bold" @click="systemEvent(index,$event)">
            </i></el-col>
            <el-col :span="2" v-if="maintain.type==3">
              <i class="el-icon-minus" style="line-height: 40px;height: 40px;text-align: center;
            font-size: 20px;margin-left: 20px;cursor: pointer;font-weight: bold" @click="removeMain(content,index,$event)">
              </i></el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="maintain.type!=3">
          <el-button type="primary" @click="sureEdit" size="mini">确 定</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-if="maintain.type==3">
          <el-button type="primary" @click="maintain.editVisible=false" size="mini">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加文件" :visible="addFileVisible" width="40%"
                  append-to-body modal-append-to-body>
        <el-upload
          drag
          class="uploadBox"
          ref="uploadBox"
          :auto-upload="false"
          :action="`${baseUrl}/online/upload?token=${$getToken()}`"
          :before-upload="uploadPriview"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-dialog>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SelectUser from '../common/SelectUser.vue';
    export default {
        props: {
            username: ''
        },
        components: { SelectUser },
        data(){
            return {
                fileList: {},
                baseUrl: window._options.baseUrl,
                addFileVisible: false,
                isAdded: '',
                dirManage: '',
                isDir: '',
                isPower: '',
                deptMap: {},
                dsq: null,
                handlerPanel:{
                  dirHandlerVisible: false,
                  top: 0,
                  left: 0,
                  currentData: null
                },
                myurl: '/role/queryDept',
                panelTip: {
                  panelTitle: '权限设置',
                  selectedUserTitle: '已选择受限人员名单',
                  selectedUserTip: '请选择受限人员',
                  selectUserTitle: '选择人员',
                  submitTip: '提交限制名单'
                },
                authManageVisible: false,
                noHavePowerList: [],
                maintain:{
                  visible:false,
                   editVisible:false,
                   type:"",
                   name:'',
                   no_type:'',
                   NO_TYPE:"",
                   maintainDataadd:{qydh:[{NO_NAME:'',NO_REMARK:'',NO_TYPE:'1'}]},
                   maintainData:{},
                   maintainDataOrg:{}
                 },
                download: {
                    downloadvisible: false,
                    data: [],//表格数据
                },
                tableDataVisible: false,//表格数据的展示
                infoVisible: true,//详情页
                leftData: [],//左侧的树形菜单数据
                selectValue: "1",//选择的筛选的值
                options: [{"key": "按目录检索", "value": "1"}, {"key": "按系统检索", "value": "2"}],
                add: {
                    clickDataCopy: {},
                    addvisible: false,
                    subform: {
                        company: "",//企业值
                        companyArr: [],//企业代号数组
                        system: "",//系统代号值
                        systemArr: [],//系统代号数组
                        doc: "",//文档类型值
                        docArr: [],//文档类型数组
                        code: "",//文档呢编号
                        year: "",//编制年份
                        wordname: "",//文档名称
                        version: "",//文件版本
                        intro: "",//文档简介
                        write_user: this.username,// 录入人员
                        uploadFiles: [],//选中的文件
                        fileIds: [],//要上传的文件ID
                        dirFather: [],//目录位置的父位置
                        dirF: "",//选择的值
                        dirChild: [],//目录位置的子位置
                        dirC: "",//选择的值
                        sysFather: [],//系统的父级
                        sysF: "",//系统的父级的值
                        sysChildOrigin: [],//系统子集的源数据
                        sysChild: [],//系统的子集的数组
                        sysC: "",//系统的子集的值
                    }
                },
                table: {
                    tableHeight: "",//
                    tableOriginData: [],//表格源数据
                    tableData: [],//表格展示的数据
                },
              treeData: [],
              allDepts: {"label":"全部","childs":[],"flag":'all'},
              oneAllDepts: [],
              deptUserData: [],
              dialogOption: {
                lockScroll: false,
                appendToBody: false,
                dialog_dep_visible: false,
                dialog_system_visible:false,
                showClose: false,
                dialogTitle: "",
                modal: false,
                infoShow: false
              },
              keyword: "",
              tableData: [],//展示的表格数据
              originTableData: [],//表格的备份源数据做搜索用
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
            testClick(e,data,node,that){
              console.log(data)
            },
            downDir(){
              this.handlerPanel.dirHandlerVisible = false;
              this.$axios.get(`/datum/downloadZip?CATALOG_ID=${this.handlerPanel.currentItem.data.id}&token=${this.$getToken()}`);
            },
            parseData(data){
              // 格式化数据, 数组数据转换成树结构数据
              this.deptMap = {};
              let deptArr = [], ans = [];
              data.forEach(item => {
                if(item.system_FID != null){
                  if(!this.deptMap[item.system_FID]){
                    this.deptMap[item.system_FID] = []
                  }
                  this.deptMap[item.system_FID].push(cloneDeep(item));
                }else{
                  deptArr.push(cloneDeep(item));
                }
              });
              deptArr.forEach(item => ans.push({
                label: item.system_NAME,
                children: this.parseTree(item.system_ID),
                system_FID: item.system_FID,
                system_ID: item.system_ID
              }));
              return ans;
            },
            parseTree(system_ID){
              // 递归处理数据生成树结构
              let deptArr = this.deptMap[system_ID];
              let data = [];
              if(deptArr && deptArr.length > 0){
                for(let item of deptArr){
                  data.push({
                    label: item.system_NAME,
                    children: this.parseTree(item.system_ID),
                    system_FID: item.system_FID,
                    system_ID: item.system_ID
                  })
                }
              }
              return data;
            },
            addHandler(element, type, handler){
              if(element.addEventListener){
                  element.addEventListener(type, handler, false);
              }else{
                  element.attachEvent('on' + type, handler);
              }
            },
              getCheckList(){
                console.log(this.maintain.checkList)
              },
              calculate(){
                  let height = document.querySelector(".mainr").offsetHeight;
                  let card_body = document.querySelector(".box-card .el-card__body");
                  let treeWrap = document.querySelectorAll(".tree-wrapper");
                  let actionHeight = document.querySelector(".content .action").offsetHeight;
                  card_body.style.height = height - 36 + "px";
                  for (let i of treeWrap) {
                      //
                      i.style.height = height - 36 - 20 - 20 - 1 - actionHeight + "px";
                      this.table.tableHeight = height - 36 - 20 - 20 - 1 - actionHeight;
                  }
              },
              loadData(){
                  this.calculate();
                  //默认按目录搜索
                  this.loadTreeByDir()
              },
              //按目录搜索
              loadTreeByDir(){
                  // this.$maskin();
                  let params = new URLSearchParams();
                  params.append("CONDITION_FLAG", 1);
                  //按目录检索
                  this.$axios.post("/datum/getMenuList1", params).then((res) => {
                      let data = res.data;
                      if (data.code == 200) {
                          this.calculate();
                          data.result.tree.map(item => {
                            item.ancestor = item.id;
                            item.path = '/' + item.name;
                          })
                          this.treeData = [this.allDepts, ...this.parseDataDir({childs: data.result.tree}).childs];
                          this.isAdded = data.result.dutumFlag;
                          this.dirManage = data.result.dutumNoFlag;
                          this.isDir = data.result.dutumCatalogFlag;
                          this.isPower = data.result.datumPowerFlag;
                      }
                  });
                  this.getTreeTableData(1);
              },
              parseDataDir(data){
                // 递归处理数据
                if(data.name){
                  let dataCopy = cloneDeep(data);
                  if(dataCopy.childs && dataCopy.childs.length > 0)delete dataCopy.childs;
                  this.allDepts.childs.push(dataCopy);
                  data.label = data.name;
                }
                if(!data.childs || data.childs.length === 0){
                  data.childs = [];
                  return data;
                }
                for(let i in data.childs){
                  if(data.ancestor){
                    data.childs[i].ancestor = data.ancestor;
                    data.childs[i].path = `${data.path}/${data.childs[i].name}`;
                  }
                  data.childs[i] = this.parseDataDir(data.childs[i]);
                }
                data.children = data.childs;
                return data;
              },
                //按系统级检索
              loadTreeBySystem(){
                  this.$maskin();
                  let params = new URLSearchParams();
                  params.append("CONDITION_FLAG", 2);
                  //按目录检索
                  this.$axios.post("/datum/getMenuList3", params).then((res) => {
                      let data = res.data;
                      if (data.code == 200) {
                          this.treeData = [{label: '全部', children: []}, ...this.parseData(data.result)];
                          this.calculate();
                          this.$maskoff();
                      }
                  });
                  this.getTreeTableData(2);
              },
              //加载所有表格数据
              getTreeTableData(type){
                  let params = new URLSearchParams();
                  params.append("CONDITION_FLAG", type);
                  this.$axios.post("/datum/getDatumlist", params).then((res) => {
                      let data = res.data;
                      if (data.code == 200) {
                          this.$set(this.table, "tableData", data.result);
                          this.$set(this.table, "tableOriginData", data.result);
                          this.$maskoff()
                      }
                  });
              },
              //筛选框下拉事件
              changeTree(){
                  if (this.selectValue == '1') {
                      this.loadTreeByDir()
                  } else {
                      this.loadTreeBySystem()
                  }
              },
              //关闭弹窗
              closeDialog(){
                  if (this.download.downloadvisible) {
                      this.download.downloadvisible = false;
                  } else {
                      this.add.addvisible = false;
                      let dialogData = this.add.subform;
                      for (let i in dialogData) {
                        if(typeof(dialogData[i]) === typeof([])){
                          dialogData[i] = [];
                        }else if(typeof(dialogData[i]) === typeof('')){
                          dialogData[i] = '';
                        }
                      }
                  }
                  this.maintain.visible=false
              },
              //新增资料
              addZL(){
                  this.$maskin();
                  this.add.addvisible = true;
                  this.add.subform.uploadFiles=[];
                  let params = new URLSearchParams();
                  this.$axios.post("/datum/getDatumnoList", params).then((res) => {
                      let data = res.data;
                      if (data.code == 200) {
                          this.add.addvisible = true;
                          this.$set(this.add.subform, "companyArr", data.result.type1);
                          this.$set(this.add.subform, "systemArr", data.result.type2);
                          this.$set(this.add.subform, "docArr", data.result.type3);
                          this.add.subform.code = data.result.seq;
                          this.add.subform.year = data.result.year;
                          //添加目录位置数据
                          this.$set(this.add.subform, "dirFather", data.result.type4.father);
                          this.$set(this.add.subform, "dirChild", data.result.type4.child);
                          //添加系统位置数据
                          let farr = [];
                          let carr = [];
                          for (let i of data.result.type5) {
                              if (i.system_FID) {
                                  carr.push(i)
                              } else {
                                  farr.push(i)
                              }
                          }
                          // this.$set(this.add.subform, "sysFather", farr);
                          // this.$set(this.add.subform, "sysChildOrigin", carr);
                          this.add.subform.sysFather = cloneDeep(farr)
                          this.add.subform.sysChildOrigin = cloneDeep(carr)
                          this.add.subform.write_user = this.username;// 录入人员
                          this.$maskoff();
                          this.handlerPanel.dirHandlerVisible = false;
                      }
                  })
              },
              //关联系统的父级change事件
              sysChange(){
                  let id = this.add.subform.sysF.split(",")[0];
                  let arr = [];
                  this.add.subform.sysC = "";
                  for (let i of this.add.subform.sysChildOrigin) {
                      if (i.system_FID == id) {
                          arr.push(i)
                      }
                  }
                  this.$set(this.add.subform, "sysChild", arr);
              },
              //提交
              subaddForm(){
                  let subform = this.add.subform;
                  if (!subform.company) {
                      this.$warn("请选择企业代号");
                      return;
                  }
                  if (!subform.system) {
                      this.$warn("请选择系统代号");
                      return;
                  }
                  if (!subform.doc) {
                      this.$warn("请选择文档类型");
                      return;
                  }
                  if (!subform.wordname) {
                      this.$warn("请填写文档名称");
                      return;
                  }
                  if (!subform.version) {
                      this.$warn("请填写文档版本");
                      return;
                  }
                  if (!subform.sysF || !subform.sysC) {
                      this.$warn("请选择完整的系统");
                      return;
                  }
                  if (!subform.intro) {
                      this.$warn("请填写文档简介");
                      return;
                  }
                  if (!subform.write_user) {
                      this.$warn("请填写录入人员");
                      return;
                  }
                  if (!subform.fileIds.length) {
                      this.$warn("请至少上传一个文档");
                      return;
                  }
                  this.$maskin();
                  let code = `${subform.company}_${subform.system}_${subform.doc.split('-')[0]}_${subform.code}_${subform.year}`;//文档编号
                  let name = subform.wordname;//文档名称
                  let version = subform.version;//版本
                  let intro = subform.intro;//描述
                  let params = new URLSearchParams();
                  params.append("DATUM_ID", code); // 文档编码
                  params.append("DATUM_NAME", name);// 文档名称
                  params.append("DATUM_VERSION", version);// 文本版本
                  params.append("WRITE_USER", subform.write_user);
                  params.append("FILE_DESCRIPTIOON", intro);// 文档简介
                  params.append("uploadfileIds", subform.fileIds);//上传文件
                  params.append("CONDITION_FLAGM", subform.doc.split('-')[0]);// 目录位置
                  params.append("INTERCONNECTED_SYSTEM",
                      subform.sysF.split(",")[1] + '-' + subform.sysC.split(",")[1]);//关联系统
                  params.append("CONDITION_FLAGF",
                      `${this.handlerPanel.currentItem.data.ancestor},${subform.sysF.split(",")[0]}`);//系统和目录的父级ID
                  params.append("CONDITION_FLAGC",
                      `${this.handlerPanel.currentItem.data.id},${subform.sysC.split(",")[0]}`);//系统和目录的子集ID

                  this.$axios.post("datum/addDatum", params).then((res) => {
                      let data = res.data;
                      if (data.code == 200) {
                          this.$success("操作成功");
                          this.$maskoff();
                          this.closeDialog();
                          this.leftClick(this.add.clickDataCopy);
                          this.$refs.fileUp.value='';
                      }
                  })
              },
              //查看功能
              viewrow(index, val){
                  this.$go("material", {
                      "id": val.datum_ID
                  })
              },
              //下载功能
              downloadrow(index, val){
                  let id = val.datumATDetails[0].at_ID;
                  this.$axios.get(`/datum/download?type=2&fileId=${id}&token=${this.$getToken()}`);
                  // 多文件改单文件注释
                  // this.$set(this.download, "data", val.datumATDetails);
                  // this.download.downloadvisible = true;
              },
              // 删除功能
              deleteFile(index, val){
                console.log(val);
                let params=new URLSearchParams();
                params.append('DATUM_ID',val.datum_ID);
                this.$axios.post('datum//deleteDatum',params).then(res=>{
                  let data=res.data;
                  if(data.code=200){
                    this.$success('删除成功');
                    this.loadData()
                  }
                })
              },
              //文件上传的操作
              getFile(e){
                  if(this.add.subform.wordname === '' && e && e.target.files && e.target.files.length > 0){
                      this.add.subform.wordname = e.target.files[0].name;
                  }
                  let file = Array.prototype.slice.call(e.target.files);
                  let config = {
                      headers: {
                          'Content-Type': 'multipart/form-data',
                      }
                  };
                  let params = new FormData();
                  params.append("token", this.$getToken());
                  params.append("file", file[0]);
                  params.append("CATALOG_ID", this.handlerPanel.currentItem.data.id);
                  this.$axios.post("/datum/upload", params, config).then((res) => {
                      let data = res.data;
                      if (data.code == 200) {
                          if (typeof this.add.subform.uploadFiles == "string" ||
                              typeof this.add.subform.fileIds == "string") {
                              this.$set(this.add.subform, "uploadFiles", []);
                              this.$set(this.add.subform, "fileIds", []);
                          }
                          this.add.subform.uploadFiles.push(file[0]);
                          this.add.subform.fileIds.push(data.result.attachmentId);
                          // this.add.subform.uploadFiles = file;
                          // this.add.subform.fileIds = [data.result.attachmentId];
                          this.$refs.fileUp.value='';
                      }
                  });
              },
              //时间格式
              dataFormatter(row, col){
                  let date = this.$format(row.date_TIME);
                  return `${date.year}-${date.mouth}-${date.day}`
              },
              filesize(val){
                  let size = parseFloat(val.at_FILESIZE / 1000).toFixed(2);
                  return size + "kb"
              },
              dlFromTable(row){
                  let id = row.at_ID;//文件ID
                  this.$axios.get(`/datum/download?type=2&fileId=${id}&token=${this.$getToken()}`)
              },
              editNo(){
                this.$maskin();
                let params = new URLSearchParams();
                this.$axios.post("/datum/getDatumnoList", params).then((res) => {
                  let data = res.data;
                  if (data.code == 200) {
                    let qydhlist=[]
                    let xtdhlist=[]
                    let wdlxlist=[]
                    for(let i of data.result.type1){
                      qydhlist.push({NO_ID:i.no_ID,NO_NAME:i.no_NAME,NO_REMARK:i.no_REMARK,NO_TYPE:i.no_TYPE})
                    }
                    for(let i of data.result.type2){
                      xtdhlist.push({NO_ID:i.no_ID,NO_NAME:i.no_NAME,NO_REMARK:i.no_REMARK,NO_TYPE:i.no_TYPE})
                    }
                    for(let i of data.result.type3){
                      wdlxlist.push({NO_ID:i.no_ID,NO_NAME:i.no_NAME,NO_REMARK:i.no_REMARK,NO_TYPE:i.no_TYPE})
                    }
                    this.$set( this.maintain.maintainData, "qydhlist", qydhlist);
                    this.$set( this.maintain.maintainData, "xtdhlist", xtdhlist);
                    this.$set( this.maintain.maintainData, "wdlxlist", wdlxlist);
                    this.maintain.visible=true
                  }

                  this.$maskoff();
                })
              },
            getName(){
              switch(this.maintain.no_type)
              {
                case 1:
                  this.maintain.name="企业代号"
                  break;
                default:
              }
            },
            maintainAdd(name,list){
                this.maintain.type=1
                this.maintain.no_type=name
                this.getName()
                this.maintain.name=this.maintain.name+"新增"
                this.maintain.maintainDataadd.qydh=[{NO_NAME:'',NO_REMARK:'',NO_TYPE:this.maintain.no_type}]
                this.maintain.editVisible=true
            },
            maintainEdit(name,list){
              this.maintain.type=2
              this.maintain.no_type=name
              this.getName()
              this.maintain.name=this.maintain.name+"修改"
              this.maintain.maintainDataadd.qydh=list
              console.log(this.maintain.maintainDataadd.qydh)
              this.maintain.editVisible=true
            },
            maintainRemove(name,list){
              this.maintain.type=3
              this.maintain.no_type=name
              this.getName()
              this.maintain.name=this.maintain.name+"删除"
              this.maintain.maintainDataadd.qydh=list
              this.maintain.editVisible=true
            },
            sureEdit(){
              this.$maskin();
              let params = new URLSearchParams();
              params.append("type",this.maintain.type);
              params.append("list",JSON.stringify(this.maintain.maintainDataadd.qydh));
              console.log(this.maintain.maintainDataadd.qydh)
              this.$axios.post("/datum/operateDatumNo", params).then((res) => {
                let data = res.data;
                if (data.code == 200) {
                  this.closeEdit()
                }
              this.$maskoff();
              })
            },
            closeEdit(){
              this.editNo()
              this.maintain.editVisible=false
            },
            removeMain(content,index,e){
              this.$confirm('确认删除？')
                .then(_ => {
                  this.$maskin();
                  let params = new URLSearchParams();
                  params.append("type",this.maintain.type);
                  let arr=[]
                  arr.push(content)
                  params.append("list",JSON.stringify(arr));
                  this.$axios.post("/datum/operateDatumNo", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                      this.maintain.maintainDataadd.qydh.splice(index, 1)
                    }
                    this.$maskoff();
                  })
                })
                .catch(_ => {});
            },
            systemEvent(index, e) {
              let className = e.target.className;
              if (className == "el-icon-plus") {
                this.maintain.maintainDataadd.qydh.push({
                  "NO_NAME": '',
                  "NO_REMARK": '',
                  "NO_TYPE":this.maintain.no_type
                })
              } else {
                //当前是删除操作
                this.maintain.maintainDataadd.qydh.splice(index, 1)
              }
            },
            append(data) {
              console.log(data)
              const newChild = {name: 'testtest', childs: [] };
              if (!data.childs) {
                this.$set(data, 'childs', []);
              }
              data.childs.push(newChild);
            },
            handlerDirWithServer(handleType){
              // 文件夹操作
              let operName = ['', '新建文件夹', '重命名文件夹', '删除文件夹'];
              let postData = (param, value) => {
                this.$axios.post('datum/operateDatumCatalog', param).then((res) => {
                  let data = res.data;
                  if (data.code == 200) {
                    let that = this;
                    if(handleType === 1){
                      // 新建文件夹
                      // console.log(this.handlerPanel.currentItem.data.flag)
                      let children = this.handlerPanel.currentItem.data.children || [];
                      if(!this.handlerPanel.currentItem.data.flag){
                        children.push({
                          id: data.result.add.CATALOG_ID,
                          fid: data.result.add.CATALOG_FID,
                          label: value,
                          children: [],
                          ancestor: this.handlerPanel.currentItem.data.ancestor,
                          path: `${this.handlerPanel.currentItem.data.path}/${value}`,
                        });
                        this.handlerPanel.currentItem.data.children = children;
                        this.handlerPanel.currentItem.updateChildren(this.handlerPanel.currentItem.data.id, children);
                        if(!this.treeData.handle)this.treeData.handle = 1;
                        this.treeData.handle++;
                      }
                      this.loadData();
                    }else if(handleType === 2){
                      // 重命名
                      this.handlerPanel.currentItem.data.label = value;
                    }else if(handleType === 3){
                      this.loadData();
                      // 删除
                      if(this.handlerPanel.currentItem.level == 1){
                        let index = this.treeData.findIndex(item => item.id == this.handlerPanel.currentItem.data.id);
                        this.treeData.splice(index, 1);
                      }else{
                        let index = this.handlerPanel.currentItem.parent.data.children.findIndex(item => item.id == this.handlerPanel.currentItem.data.id)
                        this.handlerPanel.currentItem.parent.data.children.splice(index, 1);
                      }
                    }
                  }
                });
              }
              let params = new URLSearchParams();
              params.append("type", handleType);
              // if(this.handlerPanel.currentItem.data.fid){
                params.append("CATALOG_FID", this.handlerPanel.currentItem.data.fid || 'root');
              // }
              // if(this.handleType===3 && !this.handlerPanel.currentItem.data.fid){
              //   params.append("CATALOG_FID", 'root');
              // }
              if(this.handlerPanel.currentItem.data.id){
                params.append("CATALOG_ID", this.handlerPanel.currentItem.data.id || '');
              }
              this[handleType === 3?'$alert':'$prompt'](handleType === 3?'删除操作将删除目录及子目录请谨慎操作!':'请输入文件夹名称', operName[handleType], {
                confirmButtonText: handleType === 3?'删除':'确定',
                cancelButtonText: '取消',
              }).then(({ value }) => {
                if(handleType === 1 || handleType === 2){
                  params.append("CATALOG_NAME", value)
                }
                postData(params, value);
							}).catch(() => {
              });
              this.handlerPanel.dirHandlerVisible = false;
            },
            leftClick(val){
                this.add.clickDataCopy = val;
                this.handlerPanel.dirHandlerVisible = false;
                this.$maskin();
                let params = new URLSearchParams();
                params.append("CONDITION_FLAG", this.selectValue);
                if(this.selectValue === '1' && val.label !== '全部'){
                    params.append("CONDITION_FLAGC", val.id);
                    params.append("CONDITION_FLAGF", val.ancestor);
                }else if(this.selectValue !== '1' && val.label !== '全部'){
                  if(val.system_FID === null){
                    params.append("CONDITION_FLAGF", val.system_ID);
                  }else{
                    params.append("CONDITION_FLAGF", val.system_FID);
                    params.append("CONDITION_FLAGC", val.system_ID);
                  }
                }
                this.$axios.post("/datum/getDatumlist", params).then((res) => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.calculate();
                        this.$set(this.table, "tableData", data.result);
                        this.$set(this.table, "tableOriginData", data.result);
                        this.$maskoff();
                    }
                })
            },
            RightClick(e,data,node,that){
              // if(!node.data.id)return;
              this.handlerPanel.left = e.pageX;
              this.handlerPanel.top = e.pageY;
              clearTimeout(this.dsq);
              this.handlerPanel.dirHandlerVisible = true;
              this.handlerPanel.currentItem = node;//{id: data.id, fid: data.fid, label: data.label};
              this.setDsq();
            },
          leftTreeClick(val){
            //this.tableData = val.depts;
            if(val.label == '全部'){
              this.tableData = val.depts;
            }else{
              this.oneAllDepts = [];
              this.getAllByDept(val);
              this.tableData = [val, ...this.oneAllDepts];
            }
          },
          setDsq(type){
            if(type === 'clear'){
              clearTimeout(this.dsq);
            }else{
              this.dsq = setTimeout(_ => this.handlerPanel.dirHandlerVisible = false, 3000);
            }
          },
          authSetting(){
            let apiPath = '/datum/getUerIdsByCatalogId';
            let params = new URLSearchParams();
            params.append("catalogId", this.handlerPanel.currentItem.data.id);
            this.$axios.post(apiPath, params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.panelTip.difineSelectUsers = data.result;
                this.handlerPanel.dirHandlerVisible = false;
                this.authManageVisible = true;
              }
            })
          },
          submitAuthHandle(poyload){
            this.$maskin();
            let params = new URLSearchParams();
            params.append("type", 1);
            params.append("catalogId", this.handlerPanel.currentItem.data.id);
            params.append("userIds", JSON.stringify(poyload.userLists.split(',')));
            this.$axios.post('/datum/operateDatumPower', params).then((res) => {
              let data = res.data;
              if(data.code == 200){
                this.$message.success('权限设置成功');
                this.$maskoff();
              }
            });
          },
          uploadPriview(file){
            if(this.fileList[`${file.name}-${file.size}`]){
              this.$message.warning(`文件 ${file.name} 重复, 忽略上传`);
              return false;
            }
            this.fileList[`${file.name}-${file.size}`] = true;
          },
          submitUpload(){
            this.$refs.uploadBox.submit();
          }
        }
    }
</script>
