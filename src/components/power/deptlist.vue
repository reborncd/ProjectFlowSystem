<template>
  <div class="rolemanage common-card-wrap" style="height: 100%;">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: none">
        <span class="card-title">部门管理</span>
      </div>
      <div class="handle-bar action">
        <el-button size="mini" type="primary" @click="createDept">新建部门</el-button>
        <div class="search fr">
          <el-input size="mini" v-model="keyword" placeholder="输入检索关键字" clearable @change="search" @keyup.13="search"></el-input>
          <el-button size="mini" type="primary" @click="search" >检索</el-button>
        </div>
      </div>
      <div class="text item">
        <div class="content">
          <div class="table-list">
            <div class="role-tree left-tree">
              <div class="left-tree-title">选择部门</div>
              <el-tree :data="treeData" @node-click="leftTreeClick"></el-tree>
            </div>

            <el-table class="right-table role-el-table" :data="tableData" border :height="tableHeight"
                      v-if="tableHeight" empty-text="请选择部门或当前部门没有数据">
              <el-table-column align="center" prop="dept_name" label="部门名称"></el-table-column>
              <el-table-column align="center" prop="project" label="项目编码"></el-table-column>
              <el-table-column align="center" prop="system_NAME" label="涉及系统"></el-table-column>
              <el-table-column align="center" prop="manager_NAME" label="负责人"></el-table-column>
              <el-table-column align="center" prop="manager_PHONE" label="联系方式"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="editRow(scope.row,scope)" size="small" type="primary">
                    编辑
                  </el-button>
                  <el-button @click="deleteRow(scope.row,scope)" size="small" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog title="新增部门" :visible="dialogOption.dialog_dep_visible" center
           label-position="left" width="50%" append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="上级部门">
          <el-select style="width: 100%" clearable v-model="dialogData.deptData.fNewDeptId"
                filterable  placeholder="请选选择上级部门（可为空）" filterable>

            <!--@change="deptChangeEvent"-->
            <el-option v-for="item in dialogData.deptData.roleDept" :label="item.dept_name"
                   :value="item.dept_id" :key="item.dept_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新增部门">
          <el-input v-model="dialogData.deptData.newDeptName"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            style="width: 100%"
            v-model="dialogData.deptData.newDeptManageId"
            @change="selectManage"
            filterable
            placeholder="请选择部门负责人"
            filterable>
            <el-option v-for="item in deptUserData" :label="item.user_NAME"
                   :value="item.user_ID" :key="item.user_ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="dialogData.deptData.newDeptPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="addDept">创建</el-button>
        <el-button size="mini" @click="dialogOption.dialog_dep_visible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑涉及系统" :visible="dialogOption.dialog_system_visible" center
           label-position="left" width="50%" append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="所选部门">
          <el-input v-model="dialogData.systemData.dept_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前项目编码">
          <el-input v-model="dialogData.systemData.project" disabled></el-input>
        </el-form-item>
        <el-form-item label="请选择系统">
          <el-select style="width: 100%" clearable v-model="dialogData.systemData.choosensystem_ID"
                 placeholder="请选选择涉及系统" filterable>
            <!--@change="deptChangeEvent"--><!--multiple-->
            <el-option v-for="item in dialogData.systemData.systemArr" :label="item.system_NAME"
                   :key="item.system_ID"
                   :value="item.system_ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            style="width: 100%"
            v-model="dialogData.deptData.newDeptManageId"
            @change="selectManage"
            filterable
            placeholder="请选择部门负责人"
            filterable>
            <el-option v-for="item in deptUserData" :label="item.user_NAME"
                   :value="item.user_ID" :key="item.user_ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="dialogData.deptData.newDeptPhone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="changeSystem">确定</el-button>
        <el-button size="mini" @click="dialogOption.dialog_system_visible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from  "axios";
  import cloneDeep from 'lodash/cloneDeep';
  export default {
    data(){
      return {
        allDepts: {"label":"全部","depts":[]},
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
        tableHeight: "",
        treeData: [],
        dialogData: {
          deptData: {
            newDeptManageId: "",
            newDeptManage: '',
            newDeptPhone: '',
            roleDept: [],//根部门数组
//            subDept:[],//二级部门的数组
//            subDeptID:"",//已存在的二级部门的值，没意义只做展示
            newDeptName: "",//新增部门的名称
            fNewDeptId: ""//新增父级部门的ID
          },
          systemData:{
            choosenDeptId:"",//当前部门的ID
            dept_name:"",//当前部门的名称
            project:"",//当前部门的项目编码
            choosensystem_ID:"",//选择的涉及系统的ID
            systemArr:[]//所有的系统的数组
          }
        },
      }
    },
    mounted(){
      this.loadData();
    },
    methods: {
      selectManage(userid){
        // 新建部门->选择负责人后联动显示手机号
        this.deptUserData.forEach(item => {
          if(item.user_ID === userid){
          this.dialogData.deptData.newDeptManage = item.user_NAME;
          this.dialogData.deptData.newDeptPhone = item.user_PHONE;
          }
        })
      },
      calculate(){
        let height = document.querySelector(".mainr").offsetHeight;
        let leftTree = document.querySelector(".left-tree");
        let card_header_height = document.querySelector(".el-card__header").offsetHeight;
        let card_body = document.querySelector(".box-card .el-card__body");
        card_body.style.height = ( height - 34) - card_header_height + "px";
        //             总高度    -   卡片头高度   -card_body上下padding-操作栏高度28-margin-top的15px
        leftTree.style.height = (height - 34) - card_header_height - 20 - 28 - 22 + "px";
        this.tableHeight = (height - 34) - card_header_height - 20 - 28 - 22;
      },
      parseData(data){
        // 递归处理数据
        if(data.dept_name){
          let dataCopy = cloneDeep(data);
          if(dataCopy.depts && dataCopy.depts.length > 0)delete dataCopy.depts;
          this.allDepts.depts.push(dataCopy);
          data.label = data.dept_name;
        }
        if(!data.depts || data.depts.length === 0){
          data.depts = [];
          return data;
        }
        for(let i in data.depts){
          data.depts[i] = this.parseData(data.depts[i]);
        }
        data.children = data.depts;
        return data;
      },
      loadData(){
        this.calculate();
        this.dialogOption.dialog_system_visible = false;
        this.originTableData = [];
        let params = new URLSearchParams();
        this.$maskin();
        this.$axios.post("/role/queryAllDeptSystem", params,).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let arr = [this.allDepts, ...this.parseData({depts: [...data.result]}).depts];
            this.treeData = arr;
            this.tableData = arr[0].depts;//魔默认展示所有部门
          }
          this.$maskoff()
        })
      },
      closeDialog(){
        this.dialogOption.dialog_system_visible = false;
        this.dialogOption.dialog_dep_visible = false;
      },
      getAllByDept(data){
        for(let i in data.depts){
          let dataCopy = cloneDeep(data.depts[i]);
          delete dataCopy.depts;
          this.oneAllDepts.push(dataCopy);
          this.getAllByDept(data.depts[i]);
        }
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
      //编辑部门
      editRow(el, scope){
        this.dialogData.deptData.newDeptPhone = scope.row.manager_PHONE;
        this.dialogData.deptData.newDeptManageId = scope.row.manager_ID;
        this.dialogData.deptData.newDeptManage = scope.row.manager_NAME;
        let params = new URLSearchParams();
        params.append("dept_id", scope.row.dept_id);
        this.$axios.post("/role/editDeptSystemFront", params).then((res) => {
          let data = res.data;
          if(data.code == 200){
//            systemData:{
//              c:"",//当前部门的ID
//                dept_name:"",//当前部门的名称
//                project:"",//当前部门的项目编码
//                choosensystem_ID:"",//选择的涉及系统的ID
//                systemArr:[]//所有的系统的数组
//            }
            this.dialogOption.dialog_system_visible = true;
            this.dialogData.systemData.dept_name = data.result.dept.dept_name;
            this.dialogData.systemData.choosenDeptId = data.result.dept.dept_id;
            this.dialogData.systemData.project = data.result.dept.project;
            this.$set(this.dialogData.systemData,"systemArr", data.result.systems);
            this.dialogData.systemData.choosensystem_ID = data.result.dept.system_ID?data.result.dept.system_ID:"";
          }
        })
        this.getAllUser();
      },
      //编辑系统确定操作
      changeSystem(){
        let params = new URLSearchParams();
        params.append("dept_id",this.dialogData.systemData.choosenDeptId);
        params.append("PROJECT",this.dialogData.systemData.project);
        params.append("system_ID",this.dialogData.systemData.choosensystem_ID);//.join(','));
        params.append("manager_PHONE", this.dialogData.deptData.newDeptPhone);
        params.append("manager_ID", this.dialogData.deptData.newDeptManageId);
        params.append("manager_NAME", this.dialogData.deptData.newDeptManage);
        this.$axios.post("/role/updateDeptSystem ", params).then((res) => {
          let data = res.data;
          if(data.code == 200){
            this.$success("修改成功");
            this.loadData();
          }
        })
      },
      createDept(){
        this.$maskin();
        this.dialogData.deptData.newDeptPhone = "";
        this.dialogData.deptData.newDeptManageId = "";
        this.dialogData.deptData.newDeptManage = "";
        this.dialogData.deptData.roleDept = [];
        this.dialogData.deptData.newDeptName = "";
        this.dialogData.deptData.fNewDeptId = "";
        let params = new URLSearchParams();
        this.$axios.post("/role/queryAllDept", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let arr  = [];
            for(let i of data.result){
              arr.push(i);
              if(i.depts.length){
                for(let j of i.depts){
                  arr.push(j)
                }
              }
            }
            this.$set(this.dialogData.deptData, "roleDept", arr);
            this.$maskoff();
            this.dialogOption.dialog_dep_visible = true;
          }
        })
        this.getAllUser();
      },
      getAllUser(){
        this.$axios.post("/role/queryDept", new URLSearchParams()).then((res) => {
          let data = res.data;
          if(data.code == 200){
            this.deptUserData = cloneDeep(data.result.allUser)
          }
        });
      },
//      deptChangeEvent(value){
//        this.dialogData.deptData.subDept = "";
//        this.dialogData.deptData.subDeptID = "";
//        for(let i of this.dialogData.deptData.roleDept){
//          if(value == i.dept_id){
//            this.$set(this.dialogData.deptData,"subDept",i.depts)
//          }
//        }
//      },
      addDept(){
        if (this.dialogData.deptData.newDeptName == "") {
          this.$warn("请填写部门名称");
          return;
        }
        if (!this.dialogData.deptData.newDeptManageId) {
          this.$warn("部门负责人不能为空");
          return;
        }
        if (!this.dialogData.deptData.newDeptPhone) {
          this.$warn("部门负责人联系方式不能为空");
          return;
        }
        let params = new URLSearchParams();
        params.append("DEPT_NAME", this.dialogData.deptData.newDeptName);
        params.append("DEPT_FID", this.dialogData.deptData.fNewDeptId);
        // 部门负责人id
        params.append("MANAGER_NAME", this.dialogData.deptData.newDeptManage);
        params.append("MANAGER_ID", this.dialogData.deptData.newDeptManageId);
        // 部门负责人联系电话
        params.append("MANAGER_PHONE", this.dialogData.deptData.newDeptPhone);
        this.$axios.post("/role/addDept", params).then((res) => {
          let data = res.data;
          if (data.message) {
            this.$warn(data.message);
          } else if (data.code == 200) {
            this.dialogOption.dialog_dep_visible = false;
            this.loadData();
            this.$success("新增成功！");
          }
        })
      },
      //删除部门
      deleteRow(row,index){
        // console.log(row)
        this.confirm("确认删除此部门吗？此操作将不可恢复！",()=>{
          let params = new URLSearchParams();
          params.append("dept_id",row.dept_id);
          this.$axios.post("/role/deleteDept",params).then((res)=>{
            let data = res.data;
            if(data.code ==200){
              this.$success("操作成功！");
              this.loadData()
            }
          })
        });
      },
      search(){
        if(this.keyword == ""){
          this.tableData = this.originTableData;
        }else{
          let arr = [];
          for(let i of this.originTableData){
            if(JSON.stringify(i).indexOf(this.keyword)>=0){
              arr.push(i)
            }
          }
          this.tableData = arr
        }
      }
    }
  }
</script>
<style lang="less">
@import '../commonless/tree_and_table.less';
</style>
<style>
  .rolemanage .search .el-input {
    width: auto;
  }

  .rolemanage .el-card__header{
    display: none;
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

  .rolemanage .el-table--border tr td:last-child,
  .rolemanage .el-table--border tr th:last-child {
    border-right: none;
  }

  .rolemanage .el-table td {
    padding: 6px 0 !important;
  }
</style>
