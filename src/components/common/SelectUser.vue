/* ************************************************
# 字段说明:
  assignvisible: 控制显示还是隐藏
  panelTip: {
    panelTitle: '分配',
    selectedUserTitle: '已选择人员名单',
    selectedUserTip: '请选择人员',
    selectUserTitle: '选择人员',
    difineSelectUsers: []
  }
  myurl: 请求地址
  message: 提交按钮点击事件
  taskid: 任务id, 非必传

# 返回字段
  selectUser: 用户id, '1,2,3,4,5,6'

# 使用示例:
  <SelectUser
    v-if="assignvisible"
    :panelVisible.sync='assignvisible'
    :panelTip='panelTip'
    :myurl='myurl'
    @message='subAssign'
    :taskid='taskid'
    :type = '1'
  ></SelectUser>

# message函数示例
  subAssign(poyload){
    poyload.nameLists: 用户中文名数组
    poyload.userLists: 用户id数组
    selectUsers: 前面两个用-连接
  }

Author: ct
** ***********************************************/
<template>
  <el-dialog class="selectUserPanel"
    :title="panelTip.panelTitle || '分配'"
    :visible.sync="panelVisible"
    width="50%"
    append-to-body
    @close="panelClose"
    modal-append-to-body>
    <div class="panelTitle"> {{panelTip.selectedUserTitle || '已选择人员名单'}} </div>
    <div class="selectUser" v-if="selectUser.length == 0"> {{panelTip.selectedUserTip || '请选择人员'}} </div>
    <el-button type="text" v-for="(item, index) in selectUser" :key="index" >
      {{item.split('-')[1]}}
      <i class="el-icon-close el-icon--right" @click="selectUser.splice(index, 1)"> </i>
    </el-button>
    <div class="panelTitle">{{panelTip.selectUserTitle || '选择人员'}}</div>
    <el-input
      class="search-input"
      placeholder="请输入姓名"
      v-model="keyword"
      @keyup.13="searchUser"
      @change="searchUser" clearable>
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <!--左侧选择全部部门-->
    <div class="selectBox">
      <!--正常状态下展示部门-->
      <ul v-if="showType == 'dept'">
        <li :key="index" v-for="(item, index) in panelData" v-if="item.users.length>0">
          <span class="deptTitle" @click="deptIndex = index" style="cursor: pointer"><el-checkbox v-if="showAllButton" @change="chooseAll(item,$event)" style="position:relative;right:300px;">全选</el-checkbox> {{item.dept_name}} </span>
          <div class="selectUser" v-if="item.users.length == 0">无</div>
          <el-checkbox-group v-model="selectUser" v-show="index == deptIndex">
            <el-checkbox v-for="_item in item.users" :key="_item.user_ID" :label="_item.user_ID+'-'+_item.user_NAME" class="check-item">
              {{_item.user_NAME}}&nbsp;-&nbsp;{{_item.role_NAME}}
            </el-checkbox>
          </el-checkbox-group>
        </li>
      </ul>
      <!--搜索状态下不展示部门-->
      <div v-if="showType == 'user'">
        <div class="selectUser" v-if="checkList.length == 0">{{searchUserTip}}</div>
        <el-checkbox-group v-model="selectUser">
          <el-checkbox
            v-for="item in checkList"
            :key="item.user_ID"
            :label="item.user_ID+'-'+item.user_NAME"
            class="check-item">
            {{item.user_NAME}}&nbsp;-&nbsp;{{item.role_NAME}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="panelVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="submit" size="mini">{{panelTip.submitTip || '提交'}}</el-button>
    </div>
  </el-dialog>
</template>
<style lang="less">
@import './SelectUser.less';
</style>
<script>
  export default {
    name: 'SelectUser',
    props: ['panelTip', 'myurl', 'taskid', 'selectUsers', 'panelVisible' , 'type','showAllButton'],
    data() {
      return {
        searchUserTip: '未找到搜索结果',
        keyword: '',
        selectUser: [],
        showType: 'dept',
        deptIndex: '',
        checkList: [],
        panelData: [],
      }
    },
    created() {
      this.getAllUser();
    },
    methods: {
      submit(){
        if(this.selectUser.length === 0){
          this.$message.warning('未选中任何人!');
          return;
        }
        this.$emit('message', {
          selectUsers: this.selectUser,
          userLists: Array.from(this.selectUser, item => item.split('-')[0]).join(','),
          nameLists: Array.from(this.selectUser, item => item.split('-')[1]).join(',')
        })
        this.$emit('update:panelVisible', false);
      },
      chooseAll(item,e){
        if(e){
          let arr=[];
          item.users.forEach(item=>{
            arr.push(`${item.user_ID}-${item.user_NAME}`);
          })
          this.selectUser=arr;
        }else{
          this.selectUser=[];
        }
      },
      searchUser(){
        if(!this.keyword){
          this.showType = 'dept';
          this.checkList = [];
          return;
        }
        this.panelData.forEach(item => {
          item.users.forEach(user => {
            if(user.user_NAME.search(this.keyword) > -1)this.checkList.push(user);
          })
        });
        this.showType = 'user';
      },
      getAllUser(){
        this.$maskin();
        let params = new URLSearchParams();
        if (this.taskid) {
          params.append("TASK_ID", this.taskid);
        }
        if(this.type){
          params.append("type", this.type);
        }
        this.$axios.post(this.myurl, params).then((res) => {
          let data = res.data;
          if(data.code == 200){
            this.panelData = data.result[data.result.users?'users':'deptUsers'].sort((a, b) => a.dept_id > b.dept_id? 1 : -1);
            this.$maskoff();
            if(this.panelTip.difineSelectUsers && this.panelTip.difineSelectUsers.length){
              this.panelData.forEach(item => {
                item.users.forEach(user => {
                  if(this.panelTip.difineSelectUsers.findIndex(item => item === user.user_ID) > -1){
                    this.selectUser.push(`${user.user_ID}-${user.user_NAME}`);
                  }
                })
              })
            }
          }
        });
      },
      panelClose(){
        this.$emit('update:panelVisible', false);
      },
    }
  }
</script>
