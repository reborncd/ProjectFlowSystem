<style scoped>
    @import "../../static/css/table.css";
    @import "../../static/css/console.css";

    .search .el-input {
        width: auto;
    }

    .el-date-editor--datetimerange.el-input__inner {
        width: 370px;
    }

    .el-textarea textarea {
        height: 100px;
    }

    .el-button {
        /*padding: 6px 10px;*/
    }

    .console-tab-content .add {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        cursor: pointer;
        vertical-align: middle;
        /*margin-left:10px;*/
    }

    .edition-line {
        /*background: #EEEEEE;*/
        /*padding: 0 20px;*/
        padding: 0 3%;
    }

    .edition-line ul li span {
        display: inline-block;
        width: 96%;
        border-bottom: 3px solid #666;
        position: absolute;
        /*top: 18%;*/
        top:8px;
        margin-top: -1px;
        left: 14px;

    }

    .edition-line {
        margin: 0 auto;
    }

    .edition-line ul {
        height: 50px;
    }

    .edition-line ul li {
        height: 50px;
        position: relative;
        float: left;
    }

    .edition-line li em {
        width: 16px;
        float: left;
        height: 16px;
        background: white;
        background-size: 20px 19px;
        position: absolute;
        left: -2px;
        top: 14%;
        cursor: pointer;
        border-radius: 50px;
        border: 1px solid #333333;
    }

    .edition-line li span {
        left: 20px;
        width: 80%;
        height: 10px;
    }

    .edition-line li p.banP {
        position: absolute;
        top: 45%;
        left: 0;
        -webkit-transform: translate(-50%,0);
        -moz-transform: translate(-50%,0);
        -ms-transform: translate(-50%,0);
        -o-transform: translate(-50%,0);
        transform: translate(-50%,0);
        /*width: 100%;*/
        text-align: left;
    }

    .edition-line li.last_li span {
        width: 0;
    }

    .edition-line li .infoDiv {
        position: absolute;
        width:180px;
        left: 7px;
        bottom: 35px;
        padding: 5px 10px;
        background: #939da9;
        z-index: 100;
        color: white;
        border-radius: 5px;
    }

    .edition-line li .infoDiv p {
        word-break: break-all;
    }

    .el-dialog__body .el-select {
        width: 100%;
    }

    .detail-table.el-table td {
        padding: 0;
        text-align: center !important;
    }

    .el-table th > .cell {
        text-align: center !important;
    }

    .el-table .cell{
        text-align: center !important;
    }

    .tab-opt {
        color: orange;
        text-decoration: underline;
        display: inline-block;
        width: 90px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
<style lang="less">
@import '../commonless/tree_and_table.less';
</style>

<template>
    <div class="rolelist common-card-wrap" style="height: 100%;">
        <el-card class="box-card">
            <div class="text item">
                <div class="content">
                    <div class="action handle-bar">
                        <!-- <el-button type="danger" @click="showdialog" size="mini">添加版本</el-button> -->
                        <div class="fr">
                            <div class="search i-b" @keyup="searchKeyword($event)">
                                <el-input clearable placeholder="请输入检索关键字"
                                        suffix-icon="icon-sousuo iconfont" v-model="keyword" size="mini">
                                </el-input>
                            </div>
                        </div>
                    </div>

                        <div class="left-tree role-tree" style="margin-top: 10px">
                            <div class="left-tree-title">涉及系统</div>
                                <el-tree :data="treeData" @node-click="leftTreeClick" ></el-tree>
                        </div>
                        <div class="right-table">
                          <div class="table-list" style="margin-top: 10px">
                            <el-table :data="table.tableData" :highlight-current="true" v-if="table.tableHeight"
                                      :height="table.tableHeight" border style="width: 100%"
                                      empty-text="请选择系统或当前系统没有数据" highlight-current-row
                                      @row-click="handleCurrentChange">
                              <el-table-column prop="system_NAME" label="子系统" show-overflow-tooltip></el-table-column>
                              <el-table-column prop="new_VERSION" label="最新版本" show-overflow-tooltip></el-table-column>
                              <el-table-column prop="current_STATE" label="版本状态" show-overflow-tooltip></el-table-column>
                              <el-table-column prop="rdate" label="版本创建日期" show-overflow-tooltip></el-table-column>
                              <el-table-column prop="start_DATE" label="版本上线日期" show-overflow-tooltip></el-table-column>
                              <!--el-table-column label="需求名称" show-overflow-tooltip>
                                <template slot-scope="scope">
                                  <div @click="goneeds($event,scope.row)" :title=scope.row.neel_DESCRIPTION
                                       class="tab-opt neel_DESCRIPTION" style="line-height:1;"
                                       :data-text="scope.row.neel_DESCRIPTION">{{scope.row.neel_DESCRIPTION}}</div>
                                </template>
                              </el-table-column-->
                            </el-table>
                          </div>
                          <!--详情表格-->
                          <div class="console-tab-wrapper" v-if="tabs.consoleWrapperVisible">
                            <div class="console-action-wrapper">
                              <i class="el-icon-close close" @click="setConsoleVisible"></i>
                            </div>
                            <el-tabs v-model="tabs.activeName" type="card" @tab-click="tabClick">
                              <el-tab-pane label="详情页" name="info">
                                <div class="console-tab-content">
                                  <el-table class='detail-table' :data="table.tableDetail" border style="width: 100%;margin-top:20px;text-align: center;"
                                            highlight-current-row >
                                    <el-table-column prop="system_FNAME" label="涉及系统" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="system_NAME" label="子系统"  show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="new_VERSION" label="版本号" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="current_STATE" label="版本状态" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="rdate" label="版本创建时间" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="start_DATE" label="版本上线日期" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="neel_DESCRIPTION" label="查看需求" show-overflow-tooltip>
                                      <template slot-scope="scope">
                                        <span v-if="tabs.versionLine[scope.$index].needs.length === 0">暂无需求</span>
                                        <a href="javascript:void(0)"
                                          @click="showSelect(scope)" v-else>
                                          查看相关需求
                                        </a>
                                        <!--div @click="goneeds($event,scope.row)" :title=scope.row.neel_DESCRIPTION
                                             class="tab-opt neel_DESCRIPTION" style="line-height:1;"
                                             :data-text="scope.row.neel_DESCRIPTION">{{scope.row.neel_DESCRIPTION}}
                                        </div-->
                                      </template>
                                    </el-table-column>
                                  </el-table>
                                  <div class="edition-line clearfix" v-if="tabs.consoleWrapperVisible">
                                    <ul class="edition-line-ul clearfix">
                                      <li :key="index" v-for='(item,index) in tabs.versionLine'
                                          :style="{ width: tabs.width}" v-model="item.version"
                                          :class="index==tabs.versionLine.length-1?'last_li':'line_li'">
                                        <em @mouseover="showInfo(index)" @mouseleave="hiddenInfo(index)"></em>
                                        <span></span>
                                        <p class="banP">{{item.new_VERSION}}</p>
                                        <div class="infoDiv" style=""  v-if="tabs.infoshowVisible && tabs.activeLineIndex == index" v-model="tabs.infoshowVisible">
                                          <p>操作人：{{item.user_NAME}}</p>
                                          <p>操作说明：{{item.czsm}}</p>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </el-tab-pane>
                            </el-tabs>
                          </div>
                        </div>
                    <el-dialog title="添加版本" :visible="dialog.dialogVisible"
                               append-to-body modal-append-to-body :before-close="closeAddDialog">
                        <el-form label-width="80px">
                            <el-row>
                                <el-col>
                                    <el-form-item label="系统">
                                        <el-select v-model="dialog.systemValue" placeholder="请选择" @change="systemOpt" filterable>
                                            <el-option
                                                v-for="item in dialog.systemSelect"
                                                :key="item.system_ID"
                                                :label="item.system_NAME"
                                                :value="item.system_ID+'-'+item.system_NAME"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col>
                                    <el-form-item label="子系统">
                                        <el-select v-model="dialog.subsystemValue" placeholder="请选择" filterable>
                                            <el-option
                                                    v-for="item in dialog.subSystemSelect"
                                                    :key="item.system_ID"
                                                    :label="item.system_NAME"
                                                    :value="item.system_ID+'-'+item.system_NAME"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col class="" :span='24' style='position: relative;'>
                                    <el-form-item label="版本" class=''>
                                      <span style="display: inline-block;width: 3%">v</span>&nbsp;
                                        <el-input v-model="dialog.banben" placeholder="请填写版本号,格式1.2.0"
                                                  style="width: 95%;"></el-input>

                                    </el-form-item>
                                </el-col>
                                <el-col style="text-align: center;">
                                    <el-button type="primary" @click="postSystem" size="medium">提交</el-button>
                                    <el-button @click="backPage" size="medium">返回</el-button>
                                </el-col>
                            </el-row>
                            <div slot="footer" class="dialog-footer" :visible="dialog.dialogVisible">

                            </div>
                        </el-form>

                    </el-dialog>
                    <el-dialog title="点击跳转" :visible.sync="selectDialog.selectVisible"
                               append-to-body modal-append-to-body >
                      <el-table
                        :data="selectDialog.selectTableData"
                        style="width: 100%">
                        <el-table-column
                          prop="neel_NAME"
                          label="需求名称" >
                        </el-table-column>
                        <el-table-column
                          label="需求id" >
                           <template slot-scope="scope">
                             <span style="color: #923535" @click="goneeds($event,scope.row)">{{scope.row.neel_ID}}</span>
                           </template>
                        </el-table-column>
                      </el-table>
                    </el-dialog>
                </div>
            </div>
        </el-card>
    </div>

</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';
    export default {
        data(){
            return {
                treeData:[],
                dialog: {
                    name: '',
                    systemValue: '',
                    subsystemValue: '',
                    dialogVisible: false,
                    classic: [],
                    systemSelect: [],
                    subSystemSelect: [],
                    banben: '',
                },
                selectDialog: {
                  selectVisible: false,
                  selectTableData: []
                },
                errorVisible: false,
                table: {
                    tableData: [],
                    tableOriginData: [],
                    tableDetail: [],
                    tableHeight: "",

                },
                keyword: "",
                options: {
                    name: '',
                    value: ''
                },
                selectValue: "全部",
                form: {},
                error: {
                    disabled: true
                },
                tabs: {
                    versionLine: [{
                        'version': ''
                    }],
                    activeTableInfo: "",
                    form: {
                        bianhao: "",
                        fxry: "",
                        gzmsh: "",
                        yx: "",
                        fx: "",
                    },
                    activeLineIndex: "",
                    activeName: 'info',
                    consoleActionVisible: false,
                    consoleWrapperVisible: false,
                    infoshowVisible: false,
                    width: '',
                },
                addneeds: {
                    addInsetvisible: true,
                    addvisible: false,
                    changeInset: false,
                    addform: {
                        name: ""
                    },
                    sysName: {
                        name: ""
                    }
                },
                dialogOption: {
                    lockScroll: false,
                    appendToBody: false,
                    dialog_person_visible: false,
                    dialog_dep_visible: false,
                    showClose: false,
                    dialogTitle: "",
                    modal: false,
                    infoShow: false
                },
            }
        },
        mounted(){
            this.calculate();
            this.loadData();
        },
        methods: {
          showSelect(scope){
            if(this.tabs.versionLine[scope.$index].needs.length === 0)return;
            this.selectDialog.selectTableData = cloneDeep(this.tabs.versionLine[scope.$index].needs);
            this.selectDialog.selectVisible = true;
          },
            calculate(){
              let height = document.querySelector(".mainr").offsetHeight;
//                let card_header_height = document.querySelector(".el-card__header").offsetHeight;
              let card_body = document.querySelector(".box-card .el-card__body");
              card_body.style.height = height - 36 + "px";
              //表格高度
              this.calculateTableHeight(this.tabs.consoleWrapperVisible);
              //tab高度
              if (this.tabs.consoleWrapperVisible) {
                this.calculateTabsHeight();
              }
            },
          calculateTableHeight(type){
            let leftTree = document.querySelector(".left-tree");
            let height = document.querySelector(".mainr").offsetHeight;
            let actionHeight = document.querySelector(".content .action").offsetHeight;
            leftTree.style.height = height - 36 - actionHeight - 20 - 20 - 2 + "px";
            //true代表没有控制台
            if (!type) {
              //-----------------------body的上下padding--table的margin-top-卡片头部
              this.table.tableHeight = height - 36 - actionHeight - 20 - 20 - 2;
            } else {
              this.table.tableHeight = height * 0.3;
            }
          },
          calculateTabsHeight(){
            let card_body = document.querySelector(".box-card .el-card__body");
            let actionHeight = document.querySelector(".content .action").offsetHeight;
            let allTabContent = document.querySelectorAll(".console-tab-content");
            for (let i of allTabContent) {
              //---------------el-card__body的可用内容高---------顶部操作栏的高---------表格部分的高------tab的头和margin的高----------操作台border-卡片头部
              i.style.height = (parseInt(card_body.style.height) - 20 ) - actionHeight - (this.table.tableHeight + 20) - (20 + 40) - 2 + "px";
            }
          },
            //表格渲染
            loadData(){
                this.$maskin();
                this.calculate()
                let params = new URLSearchParams();
                this.$axios.post('/version/versionlist', params).then((res) => {
                    if (res.code = 200) {
                        let sysArr=[]
                        let data = res.data.result;
                        let temp = []
                        for (let i of data) {
                                let obj = {
                                    "label": i.system_FNAME,
                                    "id": i.system_ID,
                                };
                                if(temp.indexOf(i.system_ID) == -1){
                                    temp.push(i.system_ID)
                                    sysArr.push(obj)
                                }
                        }
                        this.treeData = sysArr;
                        this.$maskoff();
                    }
                })
            },
            setTableData(data){
                this.$set(this.table, "tableData", data);
                this.$set(this.table, "tableOriginData", data);
                this.$maskoff();
            },
            //版本详情显示
          handleCurrentChange(val){
            console.log(val)
                this.$maskin();
               if (!this.tabs.consoleWrapperVisible) {
                  this.tabs.consoleWrapperVisible = true;
                  setTimeout(() => {
                    this.calculate()
                  }, 0);
                }
                let params = new URLSearchParams();
                if (val.neel_ID) {
                    params.append("NEEL_ID", val.neel_ID);
                    params.append("SYSTEM_ID", val.system_ID);
                    // params.append("SUBSYSTEM", val.subsystem);
                    params.append("SYSTEM_SNAME", val.system_NAME);
                } else {
                    params.append("SYSTEM_ID", val.system_ID);
                    // params.append("SUBSYSTEM", val.subsystem);
                    params.append("SYSTEM_SNAME", val.system_NAME);
                }
                this.$axios.post("/version/sonversionlist", params).then((res) => {
                    if (res.data.code == 200) {
                        let data = res.data.result;
                        data.map(item => {
                          item.is_current = item.current_STATE;
                          item.current_STATE = item.current_STATE=='0'?'未上线':item.current_STATE=='1'?'上线成功':'上线失败';
                          let date = this.$format(item.rdate);
                          item.rdate=`${date.year}-${date.mouth}-${date.day}`;
                        })
                        this.table.tableDetail = cloneDeep(data)
                        if(data.length > 0 && !data[data.length - 1].is_current){
                          data = [...data, data[data.length - 1]];
                        }
                        this.tabs.versionLine = cloneDeep(data);
                        this.dialogOption.dialog_person_visible = true;
                        this.$maskoff();
                    }
                })
                return false;
            },
            //版本轴信息显示
            showInfo(index){
                this.tabs.infoshowVisible = true;
                this.tabs.activeLineIndex = index
            },
            //版本轴信息隐藏
            hiddenInfo(){
                this.tabs.infoshowVisible = false;
                this.tabs.activeLineIndex = ""
            },

            //添加版本
            showdialog(){
                this.dialog.dialogVisible = true;
                this.calculate()
                let params = new URLSearchParams();
                this.$axios.post('/golive/systemlist', params).then((res) => {
                    if (res.data.code = 200) {
                        let systems = [];
                        let data = res.data.result;
                        for (let i of data) {
                            systems.push(i);
                        }
                        this.$set(this.dialog, "systemSelect", systems);//系统
                    }
                })
//                })
            },
            systemOpt(){
                let params = new URLSearchParams();
                let systemId = this.dialog.systemValue.split("-")[0]
                params.append("SYSTEM_ID", systemId);
                this.$axios.post('/golive/systemson', params).then((res) => {
                    if (res.data.code = 200) {
                        let subsystems = [];
                        let data = res.data.result;
                        for (let i of data) {
                            subsystems.push(i);
                        }
                        this.$set(this.dialog, "subSystemSelect", subsystems);//子系统
                    }
                })
            },
            //添加版本提交
            postSystem(){
                let params = new URLSearchParams();
                let subSystem = []
                let systemList = [];
                if (!this.dialog.systemValue) {
//                    this.$warn('涉及系统不能为空');
                    this.$warn('请填写完整信息');
                    return;
                }
                if (!this.dialog.subsystemValue) {
//                    this.$warn('子系统系统不能为空');
                    this.$warn('请填写完整信息');
                    return;
                }
                if (!this.dialog.banben) {
//                    this.$warn('版本不能为空');
                    this.$warn('请填写完整信息');
                    return;
                }
                let reg = /^\d+\.\d+\.\d+$/;
                if (!reg.test(this.dialog.banben)) {
                    this.$warn("版本号格式有误");
                    return;
                }
                params.append("SYSTEM_ID", this.dialog.systemValue.split("-")[0])//涉及系统id
                params.append("SYSTEM_NAME", this.dialog.systemValue.split("-")[1])//涉及系统名称
                params.append("SYSTEM_SID", this.dialog.subsystemValue.split("-")[0])//子系统id
                params.append("SYSTEM_SNAME", this.dialog.subsystemValue.split("-")[1])//子系统名称
                params.append("NEW_VERSION", 'v' + this.dialog.banben)//版本号
                this.$axios.post('/version/addversion ', params).then((res) => {
                    if (res.data.code = 200) {
                        let data = res.data.result;
//                        this.loadData();
//                        this.clearAddData();
                    }
                })
                this.loadData();
                this.clearAddData();
                this.dialog.dialogVisible = false;
                return
            },
            //搜索
            searchKeyword(e){
                this.setConsoleVisible()
                if (e.keyCode == 13) {
                    let params = new URLSearchParams();
                    params.append("SOUSS", this.keyword);
                    this.$axios.post('/version/versionlist', params).then((res) => {
                        if (res.code = 200) {

                            let data = res.data.result
                            this.setTableData(data);

                        }
                    })
                }
            },
            setConsoleVisible(){
                this.tabs.consoleWrapperVisible = false;
                this.calculateTableHeight(false)
            },
//         //弹窗关闭
            closeAddDialog(){
                this.clearAddData();
                this.dialog.dialogVisible = false
            },
            //清除新增新增的表单
            clearAddData(){
                for (let i in this.dialog) {
                    this.dialog[i] = "";
                }
//                this.dialog.systemSelect = '';
//                this.dialog.subsystem = '';
//                this.dialog.banben = '';
            },
            tabClick(val){
                this.calculateTabsHeight();
            },
            //返回
            backPage(val){
                this.loadData();
                this.clearAddData();
                this.dialog.dialogVisible = false
            },
//            点击左侧树
            leftTreeClick(val){
              this.tabs.consoleWrapperVisible = false
              this.calculateTableHeight(false)
                let params = new URLSearchParams();
                params.append('SYSTEM_ID', val.id);
                this.$axios.post("/version/versionlist", params).then((res) => {
                    if (res.status = 200) {
                        let subsystems = [];
                        let data = res.data.result;
                        for (let i of data) {
                            // i.current_VERSION = i.current_VERSION || '未上线';
                            i.current_STATE = i.current_STATE=='0'?'未上线':i.current_STATE=='1'?'上线成功':'上线失败';
                            let date = this.$format(i.rdate);
                            i.rdate=`${date.year}-${date.mouth}-${date.day}`;
                            subsystems.push(i);
                        }
                        this.$set(this.table, "tableData", subsystems);//子系统
                    }
                })
            },
            closeDialog(){
                this.dialogOption.dialog_person_visible = false;
            },
            cancelForm(){
                this.dialogOption.dialog_person_visible = false;
            },
            //跳转到需求页面
            goneeds(e, val){
                e.stopPropagation();
                let path = "";
                switch(val.type){
                  case "TECH":
                    path = "技术需求";
                    break;
                  case "PROD":
                    path = "业务需求"
                    break;
                  case "BASE":
                    path = "基础建设"
                    break;
                }
                this.$go("", "", {"neelId": val.neel_ID}, path);
            }
        }
    }
</script>
