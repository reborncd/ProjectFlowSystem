<template>
  <div class="rolelist common-card-wrap" style="height: 100%;"
     @click="$event.target.className == 'icon-more iconfont'?'':tabs.consoleActionVisible = false">
     <!-- <iframe width="500" height="500" src="http://192.180.51.7:9000/projects?sort=-analysis_date"></iframe> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p class="card-title por">
          <span class="back fl clear" @click="backPage" v-if="bugVisible">
            <i class="el-icon-arrow-left"></i>
            <i class="b">返回</i></span>
          BUG列表
        </p>
      </div>
      <div class="text item">
        <div class="content" v-if="!bugVisible">
          <div class="action clear">
            <el-button type="danger" @click="shouBug" size="mini">提交BUG</el-button>
            <el-select v-model="selectValues" placeholder="请选择状态"  filterable clearable size="mini">
              <el-option :key="index"
                  v-for="(item, index) in selectValue"
                  :label="item"
                  :value="index">
              </el-option>
            </el-select>
            <div class="fr">
              <div style="margin-right: 10px;" class="i-b">
                <el-date-picker
                    v-model="dateComp.value"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    size="mini"
                    @keyup.enter.native="searchHandle"
                    :picker-options="dateComp"
                >
                </el-date-picker>
              </div>
              <div class="search i-b">
                <el-input
                    clearable
                    placeholder="请输入检索关键字"
                    suffix-icon="icon-sousuo iconfont"
                    v-model="keyword"
                    @keyup.enter.native="searchHandle"
                    size="mini"
                >
                </el-input>
              </div>
              <el-button
               size="medium"
               type="primary"
               @click="searchHandle"
              >查询</el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table :data="table.tableData" border style="width: 100%" v-if="table.tableHeight"
                :height="table.tableHeight"
                highlight-current-row ref="bug_table" @row-click="handleCurrentChange">
              <el-table-column prop="bug_id" label="编号" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="bug_desc" label="描述" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :title=scope.row.description class="tab-opt" style="">{{scope.row.bug_desc}}</span>
                </template>
              </el-table-column> -->
              <el-table-column prop="user_name" label="提交人"></el-table-column>
              <!-- <el-table-column prop="system_TYPE" label="子系统" width="110" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="create_time" label="提交时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="bug_level" label="bug等级" show-overflow-tooltip></el-table-column>
              <el-table-column prop="state_name" label="状态" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="update_TIME" label="更新时间" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="buttons" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.buttons" :key="index">
                    <el-button size="mini" type="primary" v-if="item=='ANALYSIS'" @click.stop="handleCurrentChange2(scope.row)">分析</el-button>
                    <el-button size="mini" type="danger" v-if="item=='CANCEL'" @click.stop="cancelTask(scope.row,'cancel')">撤销</el-button>
                    <el-button size="mini" type="primary" v-if="item=='EDIT'" @click.stop="updateBug(scope.row)">修改</el-button>
                    <el-button size="mini" type="primary" v-if="item=='SPLIT'" @click.stop="handleCurrentChange2(scope.row,'split')">拆分任务</el-button>
                    <el-button size="mini" type="primary" v-if="item=='DEV_HANDLE'" @click.stop="taskHandle(scope.row,'dev')">任务处理</el-button>
                    <el-button size="mini" type="primary" v-if="item=='TEST_HANDLE'" @click.stop="taskHandle(scope.row,'test')">任务处理</el-button>
                    <el-button size="mini" type="primary" v-if="item=='TEST_CONFIRM'" @click.stop="taskHandle(scope.row,'confirm')">测试验收</el-button>
                    <el-button size="mini" type="primary" v-if="item=='PROD_CONFIRM'" @click.stop="prodHandle(scope.row,'PROD_CONFIRM')">生产验收</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页添加 -->
            <div class="table-pagination">
              <el-button-group>
                <el-button
                  size="mini"
                  @click="pageHandler('home')"
                  :disabled="homeDisabled"
                  icon="el-icon-d-arrow-left">
                  首页
                </el-button>
                <el-button
                  size="mini"
                  :loading="prevIsLoad"
                  @click="pageHandler('prev')"
                  :disabled="prevDisabled"
                  icon="el-icon-arrow-left">
                  上一页
                </el-button>
                <el-button
                  size="mini"
                  :loading="nextIsLoad"
                  :disabled="nextDisabled"
                  @click="pageHandler('next')">
                  下一页
                  <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
                <el-button
                  size="mini"
                  @click="pageHandler('end')"
                  :disabled="endDisabled">
                  末页
                  <i class="el-icon-d-arrow-right el-icon--right"></i>
                </el-button>
              </el-button-group>
            </div>
          </div>
          <div class="console-tab-wrapper" v-if="tabs.consoleWrapperVisible">
            <!-- <div class="console-tab-wrapper"> -->
            <div class="console-action-wrapper">
              <i class="el-icon-close close" @click="setConsoleVisible"></i>
            </div>
            <el-tabs v-model="tabs.activeName" type="card" @tab-click="tabClick">
              <el-tab-pane label="详情页" name="info" style="word-break:break-all;">
                <div class="console-tab-content">
                  <div>
                    <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">BUG详情</div>
                  </div>
                  <el-form ref="form" :model="form" label-width="80px" label-position="left">
                    <el-row :gutter="20" >
                      <el-col :span="12" :sm="12">
                        <el-form-item label="BUG编号">
                          {{tabs.form.id}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="标题">
                           {{tabs.form.title}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="提交人">
                          {{tabs.form.createUser}}
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :span="12" :sm="12">
                        <el-form-item label="关联技术需求">
                          <a href=javascript:void(0)
                            @click="$go(`/home/jsxq`, {neelId: tabs.form.relations}, {parmas:{'XQId': tabs.form.relations,}})">
                            {{tabs.form.relations}}
                          </a>
                        </el-form-item>
                      </el-col> -->
                      <el-col :span="12" :sm="12">
                        <el-form-item label="BUG等级">
                          {{tabs.activeTableInfo.priperty}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" :sm="24">
                        <el-form-item label="BUG描述">
                           {{tabs.form.description}}
                          <!-- <p>
                              <a style="margin-right: 20px; color: #66b1ff;" :key="index" v-for="(item,index) in tabs.form.downName" @click="downfile(item.id)" >{{item.name}}</a>
                          </p> -->
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="提交时间">
                          {{tabs.form.createTime}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="期望完成日期">
                          {{tabs.form.fixTime}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="tabs.form.downName.length" :sm="24">
                        <el-form-item label="BUG附件">
                          <p>
                              <a style="margin-right: 20px; color: #66b1ff;" :key="index" v-for="(item,index) in tabs.form.downName" @click="downfile(item.id)" >{{item.name}}</a>
                          </p>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="tabs.form.downName_dev.length" :sm="24">
                        <el-form-item label="上线附件">
                          <p>
                              <a style="margin-right: 20px; color: #66b1ff;" :key="index" v-for="(item,index) in tabs.form.downName_dev" @click="downfile(item.id)" >{{item.name}}</a>
                          </p>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="tabs.form.rejectReason" :sm="24">
                        <el-form-item label="驳回原因">
                          <span style="color:red;">{{tabs.form.rejectReason}}</span>
                        </el-form-item>
                      </el-col>
                      <!-- <div v-if="OPERATE_REFLAG == 1">
                        <div v-for="(item,index) in tabs.form.rejection">
                          <div v-if="item.operate_REFLAG == 1">
                            <el-col :span="12" :sm="12">
                              <el-form-item label="驳回人">
                                {{item.user_ID}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="驳回原因">
                                {{item.rejection}}
                              </el-form-item>
                            </el-col>
                          </div>
                        </div>
                      </div> -->
                      <div v-if="tabs.form.bugAnalysis.length">
                        <div>
                          <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">分析详情</div>
                        </div>
                        <div v-for="(item,index) in tabs.form.bugAnalysis" :key="index">
                            <el-col v-if="item.manager_name" :span="12" :sm="12">
                              <el-form-item label="分析人">
                                {{item.manager_name}}
                              </el-form-item>
                            </el-col>
                            <el-col v-if="item.analysis_time" :span="12" :sm="12">
                              <el-form-item label="分析时间">
                                {{item.analysis_time}}
                              </el-form-item>
                            </el-col>
                            <el-col v-if="item.bug_type_name" :span="12" :sm="12">
                              <el-form-item label="bug分类">
                                {{item.bug_type_name}}
                              </el-form-item>
                            </el-col>
                            <el-col v-if="item.bug_reason" :span="24" :sm="24">
                              <el-form-item label="bug原因">
                                {{item.bug_reason}}
                              </el-form-item>
                            </el-col>
                            <el-col v-if="item.carelessness_reason" :span="24" :sm="24">
                              <el-form-item label="生产验收不充分原因">
                                {{item.carelessness_reason}}
                              </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12" :sm="12" v-if="item.os_TYPE && item.os_TYPE != 'undefined'">
                              <el-form-item label="涉及系统">
                                {{item.os_TYPE}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12" v-if="item.system_TYPE">
                              <el-form-item label="子系统">
                                {{item.system_TYPE}}
                              </el-form-item>
                            </el-col> -->
                            <el-col v-if="item.improvement_action" :span="24" :sm="24">
                              <el-form-item label="改进措施">
                                {{item.improvement_action}}
                              </el-form-item>
                            </el-col>
                        </div>
                      </div>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="操作台" name="console">
                <div class="console-tab-content">
                  <div class="console-action-wrapper"> </div>
                  <el-form :model="form" label-width="100px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12" :sm="12">
                        <el-form-item label="状态">
                          <el-form-item label="">{{operate.status}}</el-form-item>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="发送人">
                          <el-form-item label="">{{operate.sender}}</el-form-item>
                        </el-form-item>
                      </el-col>
                       <!--拆分任务-->
                      <div v-if="split.splitvisible">
                        <div style="margin: 10px 0" class="clear">
                          <el-button style="float: right;" type="primary" @click="addsplitperson"
                                size="mini">新增人员
                          </el-button>
                        </div>
                        <div class="table-list">
                          <el-table :data="split.tableData" border style="width: 100%">
                            <el-table-column label="任务类型" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <span>{{scope.row.system_name?'开发任务':'测试任务'}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="assignee_name" label="人员" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="system_fname" label="系统名" show-overflow-tooltip></el-table-column>
                            <!-- <el-table-column prop="WORK_INFO_ID" label="任务编码" show-overflow-tooltip></el-table-column> -->
                            <el-table-column prop="expect_finish_time" label="完成日期" width="120" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="responsible_module" show-overflow-tooltip
                                    label="负责模块"></el-table-column>
                            <el-table-column prop="difficulty_level" label="难易度" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="expect_work_time" label="预计用时" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作">
                              <template slot-scope="scope">
                                <el-button size="mini" type="danger"
                                      @click="splitDelete(scope.$index, scope.row)">删除
                                </el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div class="tab-console-handler" style="margin-top:15px;">
                            <el-button type="primary" size="mini" @click="splitSubmit">提交</el-button>
                          </div>
                        </div>
                      </div>
                      <!-- 开发经理分析 -->
                      <div v-if="devLeaderVisiable">
                        <el-col :span="12">
                          <el-form-item label="BUG原因分类">
                            <el-select v-model="popup.popTxt.fault_reason_type" placeholder="请选择故障原因" clearable filterable style="width: 100%">
                              <el-option
                                v-for="item in popup.faultReason"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="BUG产生原因">
                            <el-input maxlength="500" placeholder="请输入BUG产生原因" type="textarea" v-model="popup.popTxt.fault_reason"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="生产验证不充分原因">
                            <el-input maxlength="500" placeholder="请输入生产验证不充分原因" type="textarea" v-model="popup.popTxt.fault_reason_bad"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="改进措施">
                            <el-input maxlength="500" placeholder="请输入改进措施" type="textarea" v-model="popup.popTxt.improvence"></el-input>
                          </el-form-item>
                        </el-col>
                        <!-- 开发经理分析 -->
                        <el-col style="text-align:center;">
                          <el-button size="mini" @click="devLeaderhandele('reject')" type="danger">驳回</el-button>
                          <el-button size="mini" @click="devLeaderhandele('ok')" type="primary">确认</el-button>
                        </el-col>
                      </div>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="开发任务操作台" name="codetask" v-if="devTabVisiable">
                <div class="console-tab-content">
                  <div class="table-list" v-if="split.codetask">
                    <div class="clear">
                      <!-- <el-button style="float: left;margin: 10px 0"
                             type="primary" size="mini" @click="showCodeBUG">BUG清单
                      </el-button> -->
                      <span style="color:red;">每个系统必须上传操作手册(同一系统多人开发，上传一份即可)，若有SQL请同步上传。</span>
                      <!--上传手册-->
                      <!-- <el-button style="float: left;margin: 10px" type="primary" size="mini" @click="startUpload('上传手册')">上传手册</el-button> -->
                    </div>
                    <el-table :data="split.codetask" border style="width: 100%">
                      <el-table-column prop="assignee_name" label="人员" width="80"></el-table-column>
                      <!-- <el-table-column prop="old_SYSTEM_NAME" label="原系统名" show-overflow-tooltip width="120"></el-table-column> -->
                      <el-table-column prop="system_name" label="当前系统名" show-overflow-tooltip width="120"></el-table-column>
                      <el-table-column prop="bug_info_id" label="任务编码" show-overflow-tooltip width="220"></el-table-column>
                      <el-table-column prop="expect_finish_time" show-overflow-tooltip label="完成日期" width="120"></el-table-column>
                      <!-- <el-table-column prop="old_RESPONSIBLE_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column> -->
                      <el-table-column prop="responsible_module" label="当前负责模块" width="120" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="difficulty_level" label="难易度" width="70"></el-table-column>
                      <!-- <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column> -->
                      <el-table-column prop="expect_work_time" label="现预计用时（小时）" width="200"></el-table-column>
                      <!-- <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column> -->
                      <el-table-column prop="actual_work_time" label="现实际用时（小时）" width="200"></el-table-column>
                      <!-- <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column> -->
                      <!-- <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column> -->
                      <!-- <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column> -->
                      <el-table-column width="160" label="上传附件" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-button v-if="scope.row.status == 1" type="primary" size="mini" @click="startUpload('上传附件',scope.row.sub_system_id)">操作手册&SQL</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-button size="mini" type="primary"
                                 v-if="scope.row.status == 1"
                                 @click="splitTaskFinish(scope.$index, scope.row)">完成
                          </el-button>
                          <!-- <span v-if="scope.row.state_ID == 319 && scope.row.sign == 2"
                              style="color: red">已转接</span>
                          <span v-if="scope.row.state_ID == 319 && scope.row.sign == 1"
                              style="color: green">已完成</span>
                          <span v-if="scope.row.state_ID == 320" style="color: red">已新建变更</span>
                          <span v-if="scope.row.state_ID == 321" style="color: red">已需求内变更</span>
                          <span v-if="scope.row.sign == 0" style="color: red">已挂起</span> -->
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="测试任务操作台" name="testtask" v-if="TestTabVisiable">
                <div class="console-tab-content">
                  <!--选择用例类型和展示任务-->
                  <div>
                    <div class="clear" style="margin: 20px 0;">
                      <!-- 用例类型 -->
                      <!-- <div class="fl">
                        <span style="margin-right: 10px;">用例类型</span>
                        <el-select v-model="testTask.type" filterable clearable placeholder="请选择用例类型"
                               v-if="!testTask.typevalue" size="mini" style="margin-right: 10px;">
                          <el-option :key="index"
                              v-for="(item, index) in testTask.typeArr"
                              :label="item.TYPE_NAME"
                              :value="item.TYPE_NAME">
                          </el-option>
                        </el-select>
                        <span style="color:red">{{testTask.typevalue}}</span>
                        <el-button type="primary" v-if="!testTask.typevalue" @click="chooseTestType"
                               size="mini">确定
                        </el-button>
                      </div> -->
                      <!--bug清单-->
                      <!-- <el-button class="fr" type="primary" size="mini" @click="showTestAllBug" style="margin-left: 10px;">BUG清单</el-button> -->
                      <!--上传测试报告-->
                      <!-- <el-button class="fr" type="primary" size="mini" @click="showTestReportUpload">上传测试报告</el-button> -->
                      <!--上传用例-->
                      <!-- <el-button class="fr" type="primary" size="mini" @click="startUpload('上传用例')">上传用例</el-button> -->
                    </div>
                    <!--测试的拆分任务-->
                    <div class="testTask-wrapper">
                      <div class="clear">
                        <el-button style="float: left;" type="primary"
                               @click="testTask.testtaskvisible = !testTask.testtaskvisible"
                               size="mini">
                          {{testTask.testtaskvisible?'收起':'展开'}}
                        </el-button>
                      </div>
                      <div class="table-list" v-if="testTask.testSplitData.length >0"
                         style="margin-top: 10px;">
                        <el-table :data="testTask.testSplitData" border style="width: 100%"
                              v-show="testTask.testtaskvisible">
                          <el-table-column prop="assignee_name" label="人员" width="200" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="bug_info_id" label="任务编码"
                                   width="260"></el-table-column>
                          <el-table-column prop="expect_finish_time" width="120" label="完成日期"></el-table-column>
                          <!-- <el-table-column prop="old_RESPONSIBLE_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column> -->
                          <el-table-column prop="responsible_module" label="当前负责模块" width="120" show-overflow-tooltip></el-table-column>
                          <!-- <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column> -->
                          <el-table-column prop="expect_work_time" label="现预计用时（小时）" width="200"></el-table-column>
                          <!-- <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column> -->
                          <el-table-column prop="actual_work_time" label="现实际用时（小时）" width="200"></el-table-column>
                          <!-- <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column> -->
                          <!-- <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column> -->
                          <!-- <el-table-column prop="test_RESULT" label="测试结果" show-overflow-tooltip></el-table-column> -->
                          <!-- <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column> -->
                          <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                              <div style="text-align: center">
                                <!-- <el-button size="mini" type="primary"
                                       style="float: none;display: inline-block" @click="goTestTask(scope.$index, scope.row)"
                                       v-if="scope.row.state_ID == 309 && scope.row.sign == 1">进入
                                </el-button> -->
                                <el-button size="mini" type="primary"
                                       style="float: none;display: inline-block" @click="splitTaskFinish(scope.$index, scope.row,'test')"
                                       v-if="scope.row.status == 1">完成
                                </el-button>
                                <!-- <span v-if="scope.row.state_ID == 319 && scope.row.sign == 1"
                                    style="color: green">已完成</span>
                                <span v-if="scope.row.state_ID == 319 && scope.row.sign == 2"
                                    style="color: red">已转接</span>
                                <span v-if="scope.row.state_ID == 320" style="color: red">已新建变更</span>
                                <span v-if="scope.row.state_ID == 321" style="color: red">已需求内变更</span>
                                <span v-if="scope.row.sign == 0" style="color: red">已挂起</span> -->
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </div>
                  <!--点击进入显示和添加步骤-->
                  <div v-if="testTask.showTaskStep">
                    <div class="table-list">
                      <div class="clear" style="margin-bottom: 10px;">
                        <el-button size="mini" type="primary" style="float: right;"
                               @click="testTask.addvisible = true">新增用例
                        </el-button>
                        <el-button size="mini" type="primary" style="float: right;margin-right: 10px;"
                               @click="addBUG">新增BUG
                        </el-button>
                      </div>
                      <el-table :data="testTask.tableData" border style="width: 100%">
                        <el-table-column type="index" label="编号" width="180"></el-table-column>
                        <el-table-column prop="TEST_STEP" label="步骤" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="TEST_EXPECT" label="预期" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" width=100>
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger"
                                   v-if="scope.row.TEST_STATE == undefined"
                                   @click="testTaskDel(scope.$index, scope.row)">删除
                            </el-button>
                            <i style="color: green;font-size: 20px"
                               @click="testTaskComplate(scope.row,scope.$index)"
                               class="el-icon-success"
                               v-if=" scope.row.TEST_STATE == 3"></i>
                            <i style="color: red;font-size: 20px" class="el-icon-error"
                               @click="testTaskNotAllow(scope.row,scope.$index)"
                               v-if=" scope.row.TEST_STATE == 3"></i>
                            <span v-if="scope.row.TEST_STATE == 1" style="color: green">已通过</span>
                            <span style="color: red"
                                v-if="scope.row.TEST_STATE == 0">不通过</span>
                            <span style="color: green"
                                v-if="scope.row.TEST_STATE == 2">已指派</span>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div class="clear" style="margin: 10px 0;">
                        <el-button size="mini" type="primary" @click="subTestTask">提交
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane label="拆分项目详情" name="split" v-if="devTabVisiable || TestTabVisiable">
                <div class="console-tab-content">
                  判断当前是否被拆分过任务
                  <el-button @click="relatedProject" type="primary" size="mini">关联项目</el-button>
                  <div class="table-list" v-if="split.hasSplitTaskDataByGroup.length>0">
                    <el-table :data="split.hasSplitTaskDataByGroup" show-summary border style="width: 100%"
                          highlight-current-row
                          @row-click="splitTaskClick">
                      <el-table-column prop="DEPT_NAME" label="部门"></el-table-column>
                      <el-table-column prop="PROJECT" label="项目编码"></el-table-column>
                      <el-table-column prop="SYSTEM_NAME" label="涉及系统"></el-table-column>
                      <el-table-column prop="allTime" label="实际用时（小时）"
                               width="100"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane> -->
              <el-tab-pane label="拆分详情" name="split" v-if="splitTabVisiable">
                <div class="console-tab-content">
                  <div class="table-list">
                    <el-table :data="split.splitDetail" border style="width: 100%">
                      <el-table-column prop="assignee_name" label="人员" width="80"></el-table-column>
                      <!-- <el-table-column prop="old_SYSTEM_NAME" label="原系统名" show-overflow-tooltip width="120"></el-table-column> -->
                      <el-table-column prop="system_name" label="当前系统名" show-overflow-tooltip width="120"></el-table-column>
                      <el-table-column prop="bug_info_id" label="任务编码" show-overflow-tooltip width="260"></el-table-column>
                      <el-table-column prop="expect_finish_time" show-overflow-tooltip label="完成日期" width="120"></el-table-column>
                      <!-- <el-table-column prop="old_RESPONSIBLE_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column> -->
                      <el-table-column prop="responsible_module" label="当前负责模块" width="120" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="difficulty_level" label="难易度" width="70"></el-table-column>
                      <!-- <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column> -->
                      <el-table-column prop="expect_work_time" label="现预计用时（小时）" width="200"></el-table-column>
                      <!-- <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column> -->
                      <el-table-column prop="actual_work_time" label="现实际用时（小时）" width="200"></el-table-column>
                      <!-- <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column> -->
                      <!-- <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column> -->
                      <!-- <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column> -->
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="全程跟踪" name="project">
                <div class="console-tab-content">
                  <el-form :model="form" label-width="100px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="8" :sm="8">
                        <el-form-item label="状态">
                          <el-form-item label="">{{operate.status}}</el-form-item>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" :sm="8">
                        <el-form-item label="发送人" label-width="100px">
                          <el-form-item label="">{{operate.sender}}</el-form-item>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" :sm="8">
                        <el-form-item>
                        <el-button size="mini" type="primary" @click="loadtrack('click')">
                          {{tracking.trackingvisiible?'列表模式':'视图模式'}}</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col class="col-div" :span="24" :sm="24" v-show="!tracking.trackingvisiible">
                        <div class="infoDiv" >
                          <p :key="key" v-for="(item,key) in way.information">
                            {{key+1}}、
                            <span>{{item.record_START | date}}</span>
                            <em>{{item.record_DESC}}</em>
                          </p>
                        </div>
                      </el-col>
                      <el-col :span="24" :sm="24" v-show="tracking.trackingvisiible">
                        <tracking :tracking="tracking"></tracking>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="content" v-if="bugVisible">
          <el-form :model="form" label-width="100px">
            <el-row :gutter="24">
              <!-- <el-col :span="12">
                <el-form-item label="BUG编号">
                  <el-input v-model="popup.popTxt.id" :disabled='error.disabled' style="width: 100%"></el-input>
                </el-form-item>
              </el-col> -->
            <!--</el-row>-->
            <!--<el-row :gutter="24">-->
              <el-col :span="24">
                <el-form-item label="BUG标题">
                  <el-input clearable placeholder="请输入BUG标题" type="text" maxlength="60" v-model="popup.popTxt.title" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12" >
                <el-form-item label="BUG等级">
                  <el-select v-model="popup.popTxt.priperty2" placeholder="故障等级" clearable filterable>
                    <el-option :key="index"
                      v-for="(item, index) in popup.priperty"
                      :label="item.name"
                      :value="item.name"
                      ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" >
                <el-form-item label="期望解决时间">
                  <el-date-picker type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" v-model="popup.popTxt.expectTime"
                             ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="详细描述">
                  <el-input clearable type="textarea" placeholder="请输入详细描述" maxlength="500" v-model="popup.popTxt.desc" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
            	  <el-col>
	              <el-form-item label="上传附件">
	                <!-- <el-input v-model="popup.popTxt.description" type="textarea" ></el-input> -->
	                <el-button type="primary">上传附件(选填)</el-button>
	                <input type="file" @change="getFile($event)" placeholder="上传附件" class="upload-input"
					             style="width:140px;height:30px;opacity: 0;position: absolute;left: 0px;top: 5px;">
					        <p :key="index" v-for ="(item,index) in popup.popTxt.uploadFiles">{{item}}
					          <i style="margin-left: 10px;cursor: pointer;color: red;"
					          	@click="popup.popTxt.fileList.splice(index,1);popup.popTxt.uploadFiles.splice(index,1)" class="el-icon-close"></i>
					        </p>
	              </el-form-item>
	               </el-col>
            </el-row>
            <!-- <el-row :gutter="24">
            	  <el-col>
	              <el-form-item label="提交人">
	                <el-input v-model="popup.popTxt.createUser" type="textarea"></el-input>
	              </el-form-item>
	              </el-col>
            </el-row> -->
            <el-row :gutter="24" v-if="assign.checkList.length > 0">
              <el-form-item label="人员列表">
                <el-button
                  type="text"
                  v-for="(item, index) in assign.checkList"
                  :key="item"
                  >
                  {{item.split('-')[1]}}
                  <i class="el-icon-close el-icon--right" @click="assign.checkList.splice(index, 1);panelTip.difineSelectUsers.splice(index, 1)"> </i>
                </el-button>
              </el-form-item>
            </el-row>
          </el-form>
          <div style="text-align: center">
            <el-button type="primary"
                   v-if="operate.fpvisible"
                   @click="assign.assignvisible=true">分配人员
            </el-button>
            <el-button type="danger" @click="subForm">确 定</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <SelectUser
      v-if="assign.assignvisible"
      :panelVisible.sync='assign.assignvisible'
      :panelTip='panelTip'
      :myurl='myurl'
      :type='2'
      @message='subAssign'
    ></SelectUser>
    <!--上传附件弹窗-->
    <upload :data="uploadAction"></upload>
    <el-dialog :close-on-click-modal="false" title="新增拆分任务人员" :visible="split.splitaddvisible" width="60%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <!-- <el-form-item label="任务编码">
          <el-input v-model="split.taskcode" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="系统名">
          <el-col :span="24">
            <el-radio v-model="split.splitradio" label="2" @change="chooseUserByTask">测试任务</el-radio>
            <el-radio v-model="split.splitradio" label="1" @change="chooseUserByTask">开发任务</el-radio>
            <el-select style="margin-left: 20px;" filterable clearable  v-model="split.choosesystem" @change="selectSys"
                   placeholder="请选择" v-if="split.splitradio == 1">
              <el-option v-for="item in split.choosesystemArr" :label="item.system_NAME" :key="item.system_ID"
                  :value="`${item.system_ID},${item.system_NAME}`" clearable></el-option>
            </el-select>
            <el-select style="margin-left: 20px;" filterable clearable  v-model="split.choosesystemSub"
                   placeholder="请选择" v-if="split.splitradio == 1">
              <el-option v-for="item in split.choosesystemArrSub" :label="item.system_NAME" :key="item.system_ID"
                  :value="`${item.system_ID},${item.system_NAME},${item.version_ID},${item.new_VERSION},`" clearable></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="人员">
          <el-select v-model="split.person"  filterable clearable placeholder="请选择人员"
                 style="width: 100%" @change="splitPersonChangeEvent($event)">
            <el-option v-for="item in split.personlist" :label="item.user_NAME" :key="item.user_ID"
                   :value="item.user_ID+'-'+item.user_NAME"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="split.finishdate"
                  :picker-options='filterDateOut'
                  style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="负责模块">
          <el-input v-model="split.model" placeholder="请输入负责模块" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="难易度" v-if="split.splitradio == 1">
          <el-select v-model="split.levelchoosen" filterable clearable  placeholder="请选择难易度"
                 style="width: 100%">
            <el-option v-for="item in split.level" :label="item.FACILITY_NAME" :key="item.FACILITY_ID"
                   :value="item.FACILITY_ID+'-'+item.FACILITY_NAME"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计用时">
          <el-col :span="24">
            <el-input v-model="split.usetime" placeholder="请输入预计用时（小时）"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="split.splitaddvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="splitPersonSub" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="完成任务" :visible="taskFinished.taskFinishedvisible" width="60%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <el-form label-width="140px">
        <!-- <el-form-item label="请填写不通过原因" v-if="taskFinished.testnotallow">
          <el-input v-model="taskFinished.testnotallowtext" type="textarea" ></el-input>
        </el-form-item> -->
        <el-form-item label="请填写实际用时">
          <el-input v-model="taskFinished.usetime"></el-input>
        </el-form-item>
        <!-- <el-form-item label="请填写超时原因" v-if="taskFinished.outtime">
          <el-input v-model="taskFinished.reason" type="textarea" ></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskFinished.taskFinishedvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="subFinishTask" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="验收" :visible="accept.visible" width="40%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <p class="text-center" style="font-size: 16px">请选择验收结果</p>
      <div slot="footer" class="dialog-footer">
        <!-- <div v-if="accept.isOnlineVisiable" style="margin-bottom:30px;font-size:18px;">
          是否需要上线
          <el-radio v-model="accept.isOnline" label="0">否</el-radio>
          <el-radio v-model="accept.isOnline" label="1">是</el-radio>
        </div> -->
        <el-button @click="confirmHandle('FAIL')" type="danger" size="mini" >不通过</el-button>
        <el-button @click="confirmHandle('SUCCESS')" type="primary" size="mini">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import cloneDeep from "lodash/cloneDeep";
  import tracking from "../needs/common/tracking.vue";//全程跟踪视图模式
  import SelectUser from '../common/SelectUser.vue';
  import upload from '../needs/common/upload.vue';//上传附件组件
  import moment from "moment";
  export default {
    props: [ 'userInfo' ],
    data(){
      return {
        homeDisabled:false,
        prevDisabled:false,
        nextDisabled:false,
        endDisabled:false,
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 15,
        total:'',
        maxPageNumber: null,
        //验收通过和不通过
        accept:{
          visible:false,
          isOnline:'',
          isOnlineVisiable:false,
          ifshow_t:true,//判断显
          ifshow_n:true
        },
        uploadAction:{
          uploadvisible:false,
          uploadFiles:[],
          fileIds:[],
          type:"",
          neel_id:"",
          SYSTEM_ID:''
        },
        //拆分任务完成的操作
        taskFinished: {
          obj:{},
          outtime:false,//是否超时
          taskFinishedvisible: false,//弹窗
          taskId: "",//当前任务ID
          usetime: "",//实际用时
          reason: "",//超时原因
          testnotallow:false,//通过和不通过
          testnotallowtext:"",//测试不通过原因
        },
        //测试任务操作台的内容
        testTask: {
          hasTask: false,//判断是否有测试任务
          typevalue: "",//用例类型选择的值（汉字）
          uploadFile:[],//上传的文件
          showTaskStep: false,//展示步骤的表格
          testtaskvisible: true,//拆分后的任务的表格
          testSplitData: [],//测试被分配的任务的表格信息
          typeArr: [],//测试任务用例类型
          type: "",//用例类型选择的值
          testTaskActiveInfo: "",//当前正在进行的任务
          tableData: [],//表格内容
          addvisible: false,//弹窗的展示
          step: "",//步骤
          result: "",//预期效果,
          fileList: "",//提交的文件列表
          buglistvisible: false,//bug清单的展示
          BUGActiveData: [],//选中的待分配的bug
          assignvisible: false,//分配给人员弹窗
          bugfiles:[],//当前bug的附件数据

          //------------------------测试指派bug给开发人员--------------------
          addbug:false,
          bugdes:"",//问题描述
          bughope:"",//预期效果
          rejectvisible:false,//分配bug的弹窗
          rejectReason:"",//不通过原因
          assignArr: [],//可以分配的人员的数组
          assignPerson: "",//分配给人员的信息
          test_code:"",//步骤ID
          step_index:"",//当前步骤的索引
          except:"",//预期效果
          uploadBugFiles:[],//上传的文件
          fileIds:[],//上传文件后的ID
          bugfilevisible:false,//bug附件的预览

          //-------------------------测试的bug清单------------------------
          allbuglistorigin:[],//源数据
          allbuglist:[],//所有bug的数据
          allbugvisible:false,
          bugidArr:[],//任务的数组
          bugid:"",//选择的ID

          codeBUGlistvisible: false,//展示开发人员的bug的弹窗
          codeBUGData: [],//开发人员的BUG的数据
          assignvisible_code: false,//开发转接人员的弹窗
          assignArr_code: [],//开发人员调用转接人员的数组
          assignPerson_code: "",//开发选择转接人员
          bugid_code: "",//开发人员转接的bugid


        },
        devTabVisiable:false,
        TestTabVisiable:false,
        splitTabVisiable:false,
        updateFlag:false,
        updateBugId:'',
        analysisId:'',
        devLeaderVisiable:false,
        system2:'',
        OPERATE_REFLAG:0,
        panelTip: {
          panelTitle: '分配',
          selectedUserTitle: '已选择人员名单',
          selectedUserTip: '请选择人员',
          selectUserTitle: '选择人员',
          difineSelectUsers: []
        },
        myurl: '/work/queryUserByDemand',
        bugVisible:false,
        tracking: {
          trackingvisiible: false,
          data:[],//数据
          hoverIndex:"",//移动上去的索引
          hoverData:[],//鼠标悬浮的信息
        },
        tabsList:{},
        table: {
          tableData: [],
          tableOriginData: [],
          tableHeight: "",
        },
        operate:{
          id:'',
          resubmitButton:'',//分配状态
          MANAGER_AUDIT:'',
          MANAGER_REJECT:'',
          withdrawButton:'',//状态数据判断
          status:'',//状态
          solution:'',//解决方案
          sender:'',//发送人
          reasonValue:'',//成因
          reasonSelect:'',
          effectScope:'',//影响范围
          system:'',//涉及系统
          system2:'',//涉及系统2
          subSystem:[],//子系统
          systemAll:[{"csty":""}],
          relation:'',//关联
          relationValue:'',
          glvisibble:false,
          topeople:'',//指派人
          topeopleSelect:'',
          fpvisible:true,//分配弹窗显示
          permission:false

        },
        way:{
          status:'',
          sender:'',
          information:''
        },
        keyword: "",
        options: [ ],
        selectValues:[],
        selectValue:{},
        page: {},
        form: {},
        error: {
          disabled: true
        },
        filterDateOut: {
          disabledDate(time){
            return time.getTime() < moment(moment().format("YYYY-MM-DD")).toDate().getTime();
          }
        },
        dateComp: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
 {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          value: ""
        },
        tabs: {
          activeName: 'info',
          consoleActionData: {
            "bugact": [{
              "name":"驳回"
            },{
              "name":"确认"
            }]
          },
          form:{
            rejection:[],
          	id:'',
          	title:'',
          	createUser:'',
            description:'',
            rejectReason:'',
          	downName:[]
          },
          consoleActionVisible: false,
          consoleWrapperVisible: false,
        },
        popup:{
          id:'',
          faultReason: [
            {
              'name': '程序问题',
              "value": "21"
            },
            {
              'name': '硬件环境',
              "value": "22"
            },
            {
              'name': '网络故障',
              "value": "23"
            },
            {
              'name': '人为错误',
              "value": "24"
            }],
        	priperty:[
          {
            'name':'S',
            "value": "101"
          },
          {
            'name':'A',
            "value": "102"
          },
          {
            'name':'B',
            "value": "103"
          },
          {
            'name':'C',
            "value": "104"
          },
          ],
          popTxt:{
            'id': '',//问题ID
			      'priperty2':'',//故障等级
			      'relationUser': "",			//故障分析人员
			      'description': "",				//故障描述
			      'descriptionEx': "",			//故障复盘分析
			      'sumEffect': "",				//交易量影响
			      'uploadFiles':[],        // 上传成功的文件数组
			      'fileList':[],        //上传附件
            fppeople:'',
            names:'',
            fault_reason:'',
            fault_reason_type:'',
            fault_reason_bad:'',
            improvence:'',
            expectTime:new Date().toLocaleDateString(),
		     },
        },
        //拆分任务
        split: {
          hasSplitvisible: false,
          //----------拆分项目相关
          hasSplitTaskDataByGroup: "",//展示拆分任务的分组
          hasSplitTaskDataByGroupOrigin:[],//分组的关联项目源数据
          hasSplitTaskData: [],//展示当前的分组拆分任务
          codetask: [],//开发的任务
          splitDetail:[],//全部详情
//          systemAll: [{
//            "name": "", "version": ""
//          }],//所有选择的系统集合
          splitradio: "",//拆分任务类型（1为测试任务，2为开发任务）
          splitvisible: false,
          splitaddvisible: false,//新增人员的显示框
          choosesystem: "",//选择的系统值
          choosesystemSub: "",//选择的子系统值
          choosesystemArr:[],//可选择的系统
          choosesystemArrSub:[],//可选择的子系统
//          systemFarr: [],//父级系统数组,
//          systemCarr: [],//父级系统数组,
          levelchoosen: "",//难易度选择的值,
          level: [],//难易度数组
          version: "",//版本号
          finishdate: "",//完成日期
          tableData: [],//拆分任务的表数据
          model: "",//负责模块
          taskcode: "",//任务编码
          personlist: [],//课选择人员的人员数组
          person: "",//选择的人员
          usertime: "",//预计用时
          names: [],//放置姓名的数组
          ids: [],//放置id的数组
          usetime: "",//预计用时
          //------------新增

          //-----------------需求分析结果
          reviewData:{
            TASK_RISK:"",//风险点
            ANALYSIS_RESULT:"",//分析结果
            ANALYSIS_TIME:"",//分析时间
            EXPECT_END:"",//预期结束时间
            EXPECT_START:"",//预期开始时间
          },

          //原拆分任务
          oldTaskButton:false,//查看元拆分任务的按钮展示
          oldTaskvisible:false,//弹窗
          oldTaskTableData:[],//原拆分任务弹窗展示
        },
        assign: {
          assignvisible: false,//分配的弹窗
          keyword: "",//分配的搜索人员
          left: true,//左侧的显示
          right: false,//右侧的显示
          checkList: [],//选择的数据
          leftOriginData: [],//左侧显示的数据
//          rightlistdata: [],//右侧显示的数据
          leftSearch: false,//左侧搜索出来的结构展示
          searchData: [],//左侧特殊结构，显示出来的搜索结果存放处
          assignDeptIndex:"",//当前选中的部门索引
        },
      }
    },
    filters: {
      date(time) {
        let d = new Date(time);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1)<10?'0' + (d.getMonth()+1) : '' + (d.getMonth()+ 1);
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        let hour = d.getHours()< 10 ? '0' + d.getHours() : '' + d.getHours();
        let minutes = d.getMinutes() <10 ? '0' + d.getMinutes() : '' + d.getMinutes();
        let seconds = d.getSeconds() <10 ? '0' + d.getSeconds() : '' + d.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
      },
      reason(val){
        if(val == 1){
          return '程序问题'
        }
        if(val == 2){
          return '硬件环境'
        }
        if(val == 3){
          return '网络故障'
        }
        if(val == 4
          ){
          return '人为错误'
        }
      },
    },
    computed:{
      computedValue:function(){
        let type=true;
        if(!this.dateComp.value.length && this.keyword == "" && !this.selectValues){
          type=false;
        }else{
          type=true;
        }
        return type
      }
    },
    watch:{
      computedValue:function(value,old){
        // console.log(value)
        !value && this.loadData();
      }
    },
    mounted(){
      this.calculate();
      this.loadData();
      // if(this.$route.params && this.$route.params.neelId){
      //   this.keyword = this.$route.params.neelId;
      //   // this.searchKeyword({keyCode: 13});
      // }else{
      //   this.loadData();
      // }
    },
    components:{
      "tracking":tracking,//全程跟踪视图模式
      SelectUser,
      "upload":upload,//上传文件
    },
    methods: {
      //上传测试报告和用例模板
      startUpload(type,id){
        this.$set(this.uploadAction,"uploadFiles",[]);
        this.$set(this.uploadAction,"fileIds",[]);
        // this.$set(this.uploadAction,"fileIds",[]);
        this.uploadAction.neel_id = this.tabs.activeTableInfo.bug_id;
        this.uploadAction.type=type;
        this.uploadAction.SYSTEM_ID=id;
        this.uploadAction.uploadvisible = true;
      },
      changeSystem2(val){
        let params = new URLSearchParams();
        params.append("SYSTEM_ID",val);
        console.log(this.system2);
        this.$axios.post("/fault/getsystemsById",params).then((res) => {
          let data = res.data;
          if(data.code == 200){
            console.log(data.result);
            this.operate.subSystem = data.result;
            console.log(this.operate.subSystem);
          }
        });
      },
      //-----------------------------------加载视图模式数据
      loadtrack(type){
        if(type === 'click') this.tracking.trackingvisiible  = !this.tracking.trackingvisiible;
        if(!this.tracking.trackingvisiible)return;
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.form.id);
        this.$axios.post("/fault/queryView",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            let res = data.result;
            let arr = [];
            let infos = [];
            for(let i of res){
              if(i.view_DESC){
                i.view_DESC = i.view_DESC.split(",");
              }
              arr.push(i)
            }
            this.$set(this.tracking, "data",arr);
          }
        });
      },
      calculate(){
        let height = document.querySelector(".mainr").offsetHeight;
//        let card_header_height = document.querySelector(".el-card__header").offsetHeight;
        let card_body = document.querySelector(".box-card .el-card__body");
        card_body.style.height = height - 36 -48 + "px";//此处需减去卡片头部
        //表格高度
        this.calculateTableHeight(this.tabs.consoleWrapperVisible);
        //tab高度
        if (this.tabs.consoleWrapperVisible) {
          this.calculateTabsHeight();
        }
        //控制台的内容区域高度
      },
      calculateTableHeight(type){
        let height = document.querySelector(".mainr").offsetHeight;
        // console.log(document.querySelector(".content .action").offsetHeight)
        let actionHeight = document.querySelector(".content .action")?document.querySelector(".content .action").offsetHeight:'';
        //true代表没有控制台
        if (!type) {
          //-----------------------body的上下padding--table的margin-top-卡片头部
          this.table.tableHeight = height - 36 - actionHeight - 20 - 20 - 48 -2;
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
      loadData(){
        this.calculate();
        this.setConsoleVisible();
        this.clearAddData();
        this.$maskin();
        let params = new URLSearchParams();
        let keyword=this.$route.params.neelId?this.$route.params.neelId:'';
        params.append('key',keyword);
        params.append('page',this.currentPageNumber);
        params.append('pageSize',this.defaultPageSize);
        this.$axios.post("/bug/queryAllBugs", params).then((res) => {
          let data = res.data;
          this.total=data.result.total;
          this.selectValue=data.result.bugStates;
          if(data.code=200){
            this.resetDisabled(false,false,false,false);
            this.setTableData(data);
            this.$maskoff();
          }
        })
      },
      pageHandler(handlerType){
        // 上下页按钮点击事件
        if(handlerType === 'prev'){
          if(this.currentPageNumber>1){
            this.currentPageNumber--
          }else{
            return this.$warn('已经是第一页了呢');
          }
        }else if(handlerType === 'next'){
          if(this.currentPageNumber<Math.ceil(this.total/this.defaultPageSize)){
            this.currentPageNumber++;
          }else{
            return this.$warn('已经是最后一页了呢');
          }
        }
        if(handlerType === 'home'){
          this.currentPageNumber=1;
        }
        if(handlerType === 'end'){
          this.currentPageNumber=Math.ceil(this.total/this.defaultPageSize);
        }
        this.loadData(handlerType);
      },
      resetDisabled(home,prev,next,end){
        this.homeDisabled=home;
        this.prevDisabled=prev;
        this.nextDisabled=next;
        this.endDisabled=end;
      },
      searchHandle(){
        this.$maskin();
        let params = new URLSearchParams();
        params.append('key',this.keyword);
        params.append('STATE_ID',this.selectValues);
        params.append('page','1');
        if(this.dateComp.value.length){
          params.append('startDate',this.dateComp.value[0]);
          params.append('endDate',this.dateComp.value[1]);
        }
        params.append('pageSize',this.total);
        this.$axios.post("/bug/queryAllBugs", params).then((res) => {
          let data = res.data;
          if(data.code=200){
            this.resetDisabled(true,true,true,true);
            this.setTableData(data);
            this.$maskoff();
          }
        })
      },
      setTableData(data){
        if (data.code == 200) {
          // let arr = [];
          // for (let i of data.result) {
          //   if (i.update_TIME) {
          //     let update = this.$format(i.update_TIME);
          //     i.update_TIME = `${update.year}-${update.mouth}-${update.day}`;
          //   }
          //   if (i.create_TIME) {
          //     let create = this.$format(i.create_TIME);
          //     i.create_TIME = `${create.year}-${create.mouth}-${create.day}`;
          //   }
          //   switch(i.status ){
          //     case 1:
          //       i.status = '待审核'
          //         break;
          //     case 2:
          //       i.status = '已完成'
          //         break;
          //     case 3:
          //       i.status = '已作废'
          //         break;
          //     case 4:
          //       i.status = '已驳回'
          //         break;
          //     case 5:
          //       i.status = '已关联'
          //         break;
          //     case 6:
          //       i.status = "审核中";
          //       break;
          //   }
          //   if (i.priperty == 101) {
          //     i.priperty = 'S'
          //   }
          //   if (i.priperty == 102) {
          //     i.priperty = 'A'
          //   }
          //   if (i.priperty == 103) {
          //     i.priperty = 'B'
          //   }
          //   if (i.priperty == 104) {
          //     i.priperty = 'C'
          //   }
          //   arr.push(i)
          // }
          this.$set(this.table, "tableData", data.result.bugs);
          this.$set(this.table, "tableOriginData", data.result.bugs);
          // if (this.$route.params.neelId) {
          //   let id = this.$route.params.neelId;
          //   for (let i = 0; i < data.result.length; i++) {
          //     if (data.result[i].id == id) {
          //       setTimeout(() => {
          //         this.tabs.index = i;
          //         this.$refs.bug_table.setCurrentRow(data.result[i]);
          //         this.handleCurrentChange(data.result[i]);
          //       }, 0);
          //       break;
          //     }
          //   }
          //   return;
          // }
          this.$maskoff();
        } else{
          this.$warn(data.message);
        }
      },
      //故障bug状态选择
       statusOpt(val){
       	this.setConsoleVisible()
				let params = new URLSearchParams();
				params.append("status",val);
				this.$axios.post("/fault/query?type=2", params).then((res) => {
					 let data = res.data;
            this.setTableData(data)
				})
      },
//      时间搜索
      timeChange(val){
        this.$maskin();
      	this.setConsoleVisible()
				let startTime=val[0]
				let endTime=val[1]
				startTime=Date.parse(startTime);
				endTime=Date.parse(endTime);
				let params = new URLSearchParams();
				params.append("startTime",startTime);
				params.append("endTime",endTime);
				this.$axios.post("/fault/query?type=2", params).then((res) => {
					 let data = res.data;
          this.setTableData(data)
				})
      },
      // 搜索关键字
      searchKeyword(e){
       	this.setConsoleVisible()
        if (e.keyCode == 13) {
        	this.keyword=this.keyword.replace(/(^\s*)|(\s*$)/g, "");
        	let params = new URLSearchParams();
        	params.append("key",this.keyword);
          this.$axios.post("/fault/query?type=2", params).then((res) => {
          	let data = res.data;
						if (data.code == 200) {
							this.$success('操作成功');
							let arr = [];
			      for (let i of data.result) {
			      if (i.update_TIME) {
			        let update = this.$format(i.update_TIME);
			        i.update_TIME = `${update.year}-${update.mouth}-${update.day}`;
			      }
			      if (i.create_TIME) {
			        let create = this.$format(i.create_TIME);
			        i.create_TIME = `${create.year}-${create.mouth}-${create.day}`;
			      }
			      switch(i.status ){
			      	 case 1:
			         i.status = '待审核'
			          break;
			          case 2:
			         i.status = '已完成'
			          break;
			          case 3:
			         i.status = '已作废'
			          break;
			          case 4:
			         i.status = '已驳回'
			          break;
			      }
			      if (i.priperty == 101) {
			        i.priperty = 'S'
			      }
			      if (i.priperty == 102) {
			        i.priperty = 'A'
			      }
			      if (i.priperty == 103) {
			        i.priperty = 'B'
			      }
            if (i.priperty == 104) {
              i.priperty = 'C'
            }
			      arr.push(i)
			      }
			      this.$set(this.table, "tableData", arr);
						}
          })
        }
       },
       selectSys(val){
        if(val.split(',')[2] == '1'){
          this.$message.warning('该版本已经上线，请新建版本');
          this.split.choosesystem = '';
        }
        let params = new URLSearchParams();
        let systemId = val.split(',')[0]
        params.append("SYSTEM_ID", systemId);
        this.$axios.post('/golive/systemson', params).then((res) => {
            if (res.data.code = 200) {
                let subsystems = [];
                let data = res.data.result;
                for (let i of data) {
                    subsystems.push(i);
                }
                this.$set(this.split, "choosesystemArrSub", subsystems);//子系统
            }
        })
      },
      //  开发经理分析
      devLeaderhandele(type){
        let self = this;
        if(type=='reject'){
          this.$prompt('确定进行驳回操作？', '请填写驳回理由', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /[\S]/,
            inputErrorMessage: '驳回理由不能为空'
          }).then(({
            value
          }) => {
            this.$maskin();
            let params = new URLSearchParams();
            params.append('oper','REJECT')
            params.append('bug_id', this.tabs.activeTableInfo.bug_id);
            params.append('reject_reason', value);
            this.$axios.post("/bug/updateBug", params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.$success(data.message);
                this.setConsoleVisible();
                this.devLeaderVisiable=false;
                this.loadData();
              } else {
                this.$warn(data.message);
              }
              this.$maskoff();
            });
          }).catch(() => {

          });
        }else{
          this.$maskin();
          let params=new URLSearchParams();
          // console.log(this.tabs.activeTableInfo)
          params.append('bug_id', this.tabs.activeTableInfo.bug_id);
          params.append('analysis_id', this.analysisId);
          params.append('bug_reason_type',this.popup.popTxt.fault_reason_type);
          params.append('bug_reason',this.popup.popTxt.fault_reason);
          params.append('carelessness_reason',this.popup.popTxt.fault_reason_bad);
          params.append('improvement_action',this.popup.popTxt.improvence);
          this.$axios.post('/bug/managerAnalysisBug',params).then(res=>{
            if(res.data.code=200){
              this.$success(res.data.message);
              this.$maskoff();
              this.loadData();
              this.devLeaderVisiable=false;
            }
          })
        }
      },
      // 撤销任务
      cancelTask(val){
        this.$maskin();
        let params=new URLSearchParams();
        params.append('bug_id',val.bug_id);
        params.append('oper','CANCEL');
        this.$axios.post('/bug/updateBug',params).then(res=>{
          if(res.data.code=200){
            this.$success(res.data.message);
            this.loadData();
            // this.
            this.$maskoff();
          }
        })
      },
      // 拆分任务
      splitTask(){
        // console.log('拆分任务');
        this.$maskin();
        let info = this.tabs.activeTableInfo;
        console.log(this.tabs.activeTableInfo)
        let params = new URLSearchParams();
        params.append("BASE_ID", info.work_NEET_ID);
        this.$axios.post("/work/baseInfoCheck", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.devLeaderVisiable =false;
            this.split.splitvisible = true;
            this.$set(this.split, "level", data.result.facility);//设置难易度集合
            // this.$set(this.split, "choosesystemArr", data.result.system);//设置系统集合
            this.$set(this.split, "personlist", data.result.dept.users);//设置人员集合
            // console.log(this.split.choosesystemArr);
            this.$maskoff();
          }
        })
      },
      //-----------------------------------拆分任务时间过滤器
      splitDataFormatter(row, col){
        if(row.end_DATE){
          let date = this.$format(row.end_DATE);
          return `${date.year}-${date.mouth}-${date.day}`
        }
      },
      splitSubmit(){
        if (this.split.tableData.length == 0) {
          this.$warn("请选择分配人员");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        let info = this.tabs.activeTableInfo;
        params.append("bugId", info.bug_id);
        params.append("bugAnalysisId", this.analysisId);
        params.append("bugInfoJson", JSON.stringify(this.split.tableData));
        this.$axios.post("/bug/managerSplitBug", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success("操作成功！");
            this.loadData();
            this.split.tableData=[];
            this.$maskoff();
          }
        });
      },
      addsplitperson(){
        let params = new URLSearchParams();
        this.$axios.post('/golive/systemlist', params).then((res) => {
            if (res.data.code = 200) {
                let systems = [];
                let data = res.data.result;
                for (let i of data) {
                    systems.push(i);
                }
                this.$set(this.split, "choosesystemArr", systems);//系统
            }
        })
        this.$axios.post("/work/BaseInfoID", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.split.splitaddvisible = true;
            this.split.taskcode = data.result;
          }
        })
      },
      // 根据开发或测试来选择人员
      chooseUserByTask(val){
        this.split.choosesystem = '';
        this.split.choosesystemSub = '';
        this.split.levelchoosen = '';
        if(val=='2'){
          let params = new URLSearchParams();
          this.$axios.post("/user/queryUsersByPosition", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              // this.review.reviewvisible =false;
              // this.split.splitvisible = true;
              this.$set(this.split, "personlist", data.result);//设置人员集合
              // this.$maskoff();
            }
          })
        }else{
          let info = this.tabs.activeTableInfo;
          // console.log(this.tabs.activeTableInfo)
          let params = new URLSearchParams();
          params.append("BASE_ID", info.work_NEET_ID);
          this.$axios.post("/work/baseInfoCheck", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              // this.review.reviewvisible =false;
              this.split.splitvisible = true;
              this.$set(this.split, "level", data.result.facility);//设置难易度集合
              // this.$set(this.split, "choosesystemArr", data.result.system);//设置系统集合
              this.$set(this.split, "personlist", data.result.dept.users);//设置人员集合
              // console.log(this.split.choosesystemArr);
              // this.$maskoff();
            }
        })
        }
      },
      //-----------------------------------选择拆分任务人员变化时判断该人员是否被分配过任务
      splitPersonChangeEvent(){
        let person = this.split.person;
        // console.log(this.tabs.activeTableInfo);
        let base_id  = this.tabs.activeTableInfo.bug_id;
        let params = new URLSearchParams();
        params.append("USER_ID",person.split("-")[0]);
        params.append("BASE_ID",base_id);
        this.$axios.post("/work/spiltCheck",params)
      },
      //-----------------------------------拆分任务新增人员确定操作
      splitPersonSub(){

        //1 是测试任务 2 是开发任务

        if (this.split.splitradio == "") {
          this.$warn("请选择任务类型");
          return;
        }
        //判断开发任务有没有选择系统
        if (this.split.splitradio ==1 && !this.split.choosesystem) {
          this.$warn("请选择系统名");
          return;
        }
        if (!this.split.person) {
          this.$warn("请选择分配人员");
          return;
        }
        if (!this.split.finishdate) {
          this.$warn("请选择完成日期");
          return;
        }
        if (!this.split.model) {
          this.$warn("请填写负责模块");
          return;
        }
        if (!this.split.levelchoosen && this.split.splitradio == 1) {
          this.$warn("请选择难易度");
          return;
        }
        if (!this.split.usetime) {
          this.$warn("请填写用时");
          return;
        }
        if (!this.$reg.number.test(this.split.usetime)) {
          this.$warn("用时格式不正确");
          return;
        }
        let end_data = this.$format(new Date(this.split.finishdate));
        let obj = {
          // WORK_INFO_ID: this.split.taskcode,//任务编号
          task_type:this.split.splitradio,
          assignee_name: this.split.person.split("-")[1],//人名
          assignee_id:this.split.person.split("-")[0],//id
          // SYSTEM_NAME_SHOW: this.split.choosesystemSub.split(",")[1],//隐藏只展示
          // SYSTEM_NAME: this.split.choosesystemSub.split(",")[1]+this.split.choosesystemSub.split(",")[3],//选择的系统名
          sub_system_id: this.split.choosesystemSub.split(",")[0],//选择的系统名
          system_fname: this.split.choosesystem.split(",")[1],//选择的系统名
          system_name: this.split.choosesystemSub.split(",")[1]+this.split.choosesystemSub.split(",")[3],//选择的系统名
          system_id: this.split.choosesystem.split(",")[0],//选择的父系统名
          version_id: this.split.choosesystemSub.split(",")[2],//选择的子系统版本id
          responsible_module: this.split.model,//负责模块
          // FACILITY_ID: this.split.splitradio == 2?
          //   this.split.levelchoosen.split("-")[0]:"",//难度ID
          difficulty_level: this.split.splitradio == 1?
            this.split.levelchoosen.split("-")[1]:"",//难度等级
          // END_DATE: this.split.finishdate,
          expect_finish_time: `${end_data.year}-${end_data.mouth}-${end_data.day}`,
          expect_work_time: this.split.usetime,
        };
        this.split.ids.push(this.split.person.split("-")[0]);
        this.split.names.push(this.split.person.split("-")[1]);
        this.split.tableData.push(obj);
        this.split.splitaddvisible = false;
        this.clearSplitAddPerson();
      },
      //-----------------------------------拆分任务删除人员操作
      splitDelete(index){
        this.split.tableData.splice(index, 1);
        this.split.names.splice(index, 1);
        this.split.ids.splice(index, 1)
      },
      //-----------------------------------拆分任务新增人员后清除新增的数据
      clearSplitAddPerson(){
        this.split.splitradio = "";//清空任务类型
        this.split.person = "";//清空选择的人
        this.split.choosesystem = "";//清空选择的系统值
        this.split.choosesystemSub = "";//清空选择的系统值
        this.split.levelchoosen = "";//清空难易度选择的值
        this.split.finishdate = "";//清空完成日期
        this.split.model = "";//清空负责模块
        this.split.taskcode = "";//清空任务编码
        this.split.person = "";//清空选择的人员
        this.split.usetime = "";//清空预计用时
      },
      //点击row显示详情
      handleCurrentChange2(val,type){
        this.handleCurrentChange(val);
        this.tabs.activeName = 'console';
        switch(type){
          case 'split':
            this.splitTask();
          break;
          // case 'cancel':
          //   this.cancelTask();
          // break;
        }
      },
      // 修改bug单
      updateBug(val){
        this.updateFlag=true;
        this.updateBugId=val.bug_id;
        this.bugVisible=true;
        let params=new URLSearchParams();
        params.append("bugId", val.bug_id);
        this.$axios.post('/bug/queryBugInfoByBugId',params).then((res)=>{
          let data = res.data;
          if(data.code=200){
            this.popup.popTxt.title=data.result.bug.title;
            this.popup.popTxt.priperty2=data.result.bug.bug_level;
            this.popup.popTxt.expectTime=data.result.bug.fix_time;
            this.popup.popTxt.desc=data.result.bug.bug_desc;
            let arr=[];
            let arrId=[];
            data.result.bug.attachments.forEach(item=>{
              arr.push(item.name);
              arrId.push(item.id);
            })
            this.popup.popTxt.uploadFiles=arr;
            this.popup.popTxt.fileList=arrId;
            let arrPeople=[];
            let str='';
            data.result.bug.bugAnalysis.forEach(item=>{
              arrPeople.push(`${item.manager_id}-${item.manager_name}`);
              str=`${item.manager_name},`;
            })
            this.popup.popTxt.names=str;
            this.assign.checkList=arrPeople;
          }
        })
      },
      // 开发测试处理任务
      taskHandle(val,type){
        if(type=='confirm'){
          this.accept.visible=true;
          this.tabs.activeTableInfo = val;
          return;
        }
        if(type=='test'){
          this.tabs.activeName='testtask';
        }
        if(type=='dev'){
          this.tabs.activeName='codetask';
        }
        this.handleCurrentChange(val);
      },
      // 生产验收
      prodHandle(val,type){
        this.$maskin();
        let params = new URLSearchParams();
        params.append('bug_id',val.bug_id);
        params.append('oper',type);
        this.$axios.post('/bug/updateBug',params).then(res=>{
          let data = res.data;
          if(data.code=200){
            this.$success(data.message);
            this.$maskoff();
            this.loadData();
          }
        })
      },
      // 测试验收
      confirmHandle(type){
        let params=new URLSearchParams();
        // if(type='SUCCESS'){
        //   this.accept.isOnlineVisiable=true;
        //   if(!this.accept.isOnline){
        //     return this.$warn('请选择是否上线');
        //   }
        //   params.append('isOnline',this.accept.isOnline)
        // }
        params.append('bug_id',this.tabs.activeTableInfo.bug_id);
        params.append('user_id',this.tabs.activeTableInfo.user_id);
        params.append('oper',type);
        this.$maskin();
        this.$axios.post('/bug/testConfirm',params).then(res=>{
          let data=res.data;
          if(data.code=200){
            this.$success(data.message)
            this.accept.visible=false;
            this.loadData();
            this.$maskoff();
          }
        })
      },
      // 开发测试处理任务完成
      splitTaskFinish(index, val,type){
        // if(type == "test" && !this.testTask.typevalue){
        //   this.$warn("请选择用例类型");
        //   return;
        // }
        this.taskFinished.obj={};
        this.taskFinished.obj=val;
        this.taskFinished.taskFinishedvisible = true;
      },
      subFinishTask(){
        if(!this.taskFinished.usetime){
          return this.$warn('请填写实际工时');
        }
        this.$maskin();
        let params = new URLSearchParams();
        if(this.taskFinished.obj.task_type=='1'){
          params.append("SYSTEM_ID",this.taskFinished.obj.sub_system_id);
        }
        params.append("analysis_id",this.taskFinished.obj.analysis_id);
        params.append("bug_info_id",this.taskFinished.obj.bug_info_id);
        params.append("actual_work_time",this.taskFinished.usetime);
        params.append("task_type",this.taskFinished.obj.task_type);
        params.append("user_id",this.tabs.activeTableInfo.user_id);
        params.append("bug_id",this.tabs.activeTableInfo.bug_id);
        this.$axios.post("/bug/completeTask",params).then((res)=>{
          let data = res.data;
          if(data.code == 200) {
            this.$success(data.message);
            this.taskFinished.taskFinishedvisible = false;
            this.setConsoleVisible();
            this.loadData();
            this.$maskoff();
          }
        });
      },
      handleCurrentChange(val){
        this.clearAddData()
        this.tabs.activeTableInfo = val;
        if (!this.tabs.consoleWrapperVisible) {
          this.tabs.consoleWrapperVisible = true;
          setTimeout(() => {
            this.calculate()
          }, 0);
        }
        this.loadInfo(val)
      },
      loadInfo(val){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("bugId", val.bug_id);
        this.$axios.post('/bug/queryBugInfoByBugId',params).then((res)=>{
          let data = res.data;
          if(data.code=200){
            this.tabs.form.id=data.result.bug.bug_id;
            let arr_dev=[];
            let arr_bug=[];
            data.result.bug.attachments.forEach(item=>{
              if(item.file_TYPE=='DEV_DOC'){
                arr_dev.push(item);
              }else if(item.file_TYPE=='BUG'){
                arr_bug.push(item);
              }
            })
            this.tabs.form.downName=arr_bug;
            this.tabs.form.downName_dev=arr_dev;
            this.tabs.form.title=data.result.bug.title;
            this.tabs.form.createUser=data.result.bug.user_name;
            this.tabs.activeTableInfo.priperty=data.result.bug.bug_level;
            this.tabs.form.description=data.result.bug.bug_desc;
            this.tabs.form.rejectReason=data.result.bug.reject_reason;
            this.tabs.form.createTime=data.result.bug.create_time;
            this.tabs.form.fixTime=data.result.bug.fix_time;
            this.tabs.form.bugAnalysis=data.result.bug.bugAnalysis;
            this.operate.status=data.result.bug.next_state_operator;
            this.operate.sender=data.result.bug.user_name;
            data.result.bug.buttons.forEach(item=>{
              if(item=='ANALYSIS'){
                this.devLeaderVisiable=true;
              }
              if(item=='DEV_TASK'){
                this.devTabVisiable=true;
              }
              if(item=='TEST_TASK'){
                this.TestTabVisiable=true;
              }
            })
            if(data.result.bug.bugInfos.length>0){
              this.splitTabVisiable=true;
              // let testArr=[];
              // let devArr=[];
              // data.result.bug.bugInfos.forEach(item=>{
              //   if(item.task_type=='1'){
              //     devArr.push(item);
              //   }else{
              //     testArr.push(item);
              //   }
              // });
              this.$set(this.split, "splitDetail", data.result.bug.bugInfos);
            }
            this.$set(this.testTask, "testSplitData", data.result.tasks);
            this.$set(this.split, "codetask", data.result.tasks);
            data.result.bug.bugAnalysis.forEach(item=>{
              if(item.manager_id===this.userInfo.user_ID){
                this.analysisId=item.analysis_id
              }
            })
            this.$set(this.way, "information", data.result.records);
            this.$maskoff();
          }
        })
      },
      loadTabsData(val){
          // if(val.status=='待审核'){
          //   this.operate.glvisibble=true
          // }
          // this.$maskin();
          console.log(val);
          let params = new URLSearchParams();
          // console.log(this.$route.params)
          params.append("bugId", val.bug_id);
          // params.append("neelId", this.$route.query.neelId);
          this.$axios.post("/bug/queryBugInfoByBugId", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.buttons = data.result.buttons && Object.keys(data.result.buttons).length === 0? false: true;
              console.log();
              this.operate.status =val.status
              this.operate.RE_STR = data.result.RE_STR;
              this.way.status =val.status
              this.tabs.form.id = data.result.fault.id;
              this.tabs.form.relations = data.result.relationList.join(',')
              this.tabs.form.title = data.result.fault.title;
              for(let i of data.result.faultOperates){
                console.log(data.result.faultOperates);
                console.log(i);
                if (i.operate_REFLAG == 1) {
                  this.OPERATE_REFLAG = 1;
                  break;
                }
                else{
                  this.OPERATE_REFLAG = 0;
                }
              }
              this.tabs.form.rejection = data.result.faultOperates;
              this.tabs.form.createUser = data.result.fault.create_USER;
              this.tabs.form.description = data.result.fault.description
              this.operate.sender=data.result.fault.create_USER;
              this.operate.withdrawButton = data.result.withdrawButton;
              this.operate.MANAGER_REJECT = data.result.MANAGER_REJECT;
              this.operate.MANAGER_AUDIT = data.result.MANAGER_AUDIT;
              this.operate.resubmitButton = data.result.resubmitButton;
              this.way.sender=data.result.fault.create_USER;
              this.operate.relation=data.result.technologys;
              this.operate.permission = data.result.permission;
              console.log(this.OPERATE_REFLAG);
              if(data.result.fault){
                if(data.result.fault.priperty == 101){
                  this.popup.popTxt.priperty2 = 'S';
                }
                if(data.result.fault.priperty == 102){
                  this.popup.popTxt.priperty2 = 'A';
                }
                if(data.result.fault.priperty == 103){
                  this.popup.popTxt.priperty2 = 'B';
                }
                if(data.result.fault.priperty == 104){
                  this.popup.popTxt.priperty2 = 'C';
                }
              }
              let arr=[];
              if(data.result.process.result.length>0){
              for(let i of data.result.process.result){
                arr.push(i);
              }
              this.$set(this.way, "information", arr);
              }
              else{
              arr=[];
              this.$set(this.way, "information", arr);
              }
              //操作台涉及系统
              this.operate.system = data.result.systemDept || '';
              this.operate.system2 = data.result.systemDept2;
//             	 操作台子系统显示
              let subSystems=[];
              let reason=[]
              for (let i of data.result.systems.result) {
              let obj = {
                "SYSTEM_NAME":i.SYSTEM_NAME,
                "SYSTEM_ID":i.SYSTEM_ID
              }
              subSystems.push(obj);
              }
              this.$set(this.operate, "subSystem", subSystems);
              for(let i of data.result.reasons.reasons){
                reason.push(i)
              }
              this.$set(this.operate, "subSystem", subSystems);
              this.$set(this.operate, "reasonSelect", reason);
              //显示下载附件
			        if(data.result.attachment.length>0){
			        	let down=[]
			        	for(let i of data.result.attachment){
			        		if(i.id){
			        			down.push(i);
			        		}
			        		 this.$set(this.tabs.form, "downName", down);
			        	}
			        }
              this.tabsList = this.tabs;
              console.log(this.tabsList);
              this.loadtrack('getData');
              this.$maskoff();
            }
          })
      },
      subAssign(poyload){
        this.assign.checkList = poyload.selectUsers;
        this.panelTip.difineSelectUsers = this.popup.popTxt.fppeople = poyload.userLists.split(',');
        this.popup.popTxt.names = poyload.nameLists;
      },
      //驳回 确认操作
      consoleActionEvent(val, f){
        if(val=='确认'){
          if(!this.operate.reasonValue){
//	      			this.$warn("请填写成因")
            this.$warn('请填写完整信息');
            return
          }
          if(!this.operate.effectScope){
//	      			this.$warn("请填写影响范围")
            this.$warn('请填写完整信息');
            return
          }
          let nameArr=[]
          let idArr=[]
          for(let i of this.operate.systemAll){
            let idTxt=i.csty.split(",")[0];//子系统id
            if(idArr.indexOf(idTxt)==-1){
              idArr.push(i.csty.split(",")[0])
              nameArr.push(i.csty.split(",")[1])
            }
            // else{
            //   this.$warn('请选择不同的子系统')
            //   return
            // }
          }
          // if(idArr[0]==''){
          //   this.$warn('请选择子系统')
          //   return
          // }
          if(!this.operate.solution){
//	          this.$warn("请填写解决方案")
            this.$warn('请填写完整信息');
            return
          }
          let params = new URLSearchParams();
          if(this.operate.system2.length == 0){
            if(this.operate.system == null){
              params.append("OS_TYPE", ''); //id
              params.append("OS_TYPE_ID", '');
            }
            else{
              params.append("OS_TYPE", this.operate.system.SYSTEM_NAME); //id
              params.append("OS_TYPE_ID", this.operate.system.SYSTEM_ID); //id
            }
          }
          else{
            console.log(this.operate.system2)
            let sysName;
            for(let item of this.operate.system2){
              if (item.SYSTEM_ID == this.system2) {
                sysName = item.SYSTEM_NAME;
              }
            }
            console.log(sysName);
            params.append("OS_TYPE_ID", this.system2); //id
            params.append("OS_TYPE", sysName);
          }
          params.append("id", this.tabs.form.id);	//id
          params.append("reason", this.operate.reasonValue);	//成因
          params.append("effectScope", this.operate.effectScope);	//影响范围
          params.append("solution", this.operate.solution);//解决方案
          params.append("systemTypeId", idArr);//子系统id
          params.append("systemType", nameArr);//子系统名称
          params.append("type", 2);//
          params.append("tech_NEET_ID", this.operate.relationValue);//故障ID
          params.append("userId", this.popup.popTxt.fppeople);//分配人id

          this.$axios.post("/fault/audit", params).then((res) => {
            if(res.status==200){
              this.$success("操作成功！");
              this.errorVisible=false;
              this.operate.status='已完成'
              this.loadData();
              this.handleCurrentChange(this.tabs.activeTableInfo);
              this.setConsoleVisible();
            }
            else{
              this.$warn(message);
            }
          })
        }
        if(val == '舍弃' || val == '重新提交'){
          let params = new URLSearchParams();
          let dengji;
          console.log(this.popup.popTxt.priperty2);
          switch(this.popup.popTxt.priperty2){
            case 'S':
              dengji = 101;
                break;
            case 'A':
              dengji = 102;
                break;
            case 'B':
              dengji = 103;
                break;
            case 'C':
              dengji = 104;
                break;
            default:
              dengji = this.popup.popTxt.priperty2;
              break;
          }

          params.append("description", this.tabsList.form.description);//BUG说明
          params.append("title",this.tabsList.activeTableInfo.title);//标题
          params.append('createUser',this.tabsList.activeTableInfo.createUser);//提交人
          params.append("type",2);//类型
          params.append("priperty",dengji);  //故障等级
          params.append("id",this.tabsList.form.id); //问题ID
          params.append("userId", this.popup.popTxt.fppeople);//分配人id
          params.append("attachmentId", JSON.stringify(this.popup.popTxt.fileList));
          if(val == '舍弃'){
            this.$axios.post("/fault/del", params).then((res) => {
              console.log(res);
              if (res.data.code == 200) {
                this.$success("操作成功！");
                this.operate.status='已舍弃';
                this.errorVisible = false;
                this.clearAddData();
                this.setConsoleVisible();
                this.loadData();
              }
              else {
                this.$warn(res.data.msg);
              }
            })
          }
          if(val == '重新提交'){
            if(!this.popup.popTxt.fppeople){
              this.$warn('请分配人员！');
              return;
            }
            // console.log('测试数据');
            // console.log(this.popup.popTxt.fppeople);
            this.$axios.post("/fault/update", params).then((res) => {
              console.log(res);
              if (res.data.code == 200) {
                this.$success("操作成功！");
                this.errorVisible = false;
                this.clearAddData();
                this.setConsoleVisible();
                this.loadData();
              }
              else {
                this.$warn(res.msg);
              }
            })
          }
        }
        if(val=='驳回'){
          let params = new URLSearchParams();
          params.append("type", 2);
          params.append("id", this.tabs.form.id);

          this.$prompt('请输入驳回原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
              if(!value){
                this.warn("清输入驳回意见！");
                return
              }
              params.append("REJECTION", value);
              this.$axios.post("/fault/reject", params).then((res) => {
              if(res.status==200){
                this.$success("操作成功！");
                this.errorVisible=false;
                this.operate.status='已驳回'
                this.clearAddData();
                this.loadData();
                this.handleCurrentChange(this.tabs.activeTableInfo);
                this.setConsoleVisible();
              }
              else{
                this.warn(data.message);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });


        }

      },
      closeDialog(){
        this.assign.assignvisible = false;//分配任务的弹窗
        this.split.splitaddvisible = false;//拆分任务添加人员的弹窗
        this.uploadAction.uploadvisible = false;//上传附件弹窗
        this.taskFinished.taskFinishedvisible = false;//任务完成
        this.accept.visible=false;//验收
      },
      getFile(e){
	    //上传附件
	    let config = {
	      headers: {
	      'Content-Type': 'multipart/form-data',
	      }
	    };
	    if(!e.target.files[0]){
	    	return;
      }
	     let params = new FormData();
       params.append("token",this.$getToken())
      //  console.log(e.target.files[0])
	     params.append("file",e.target.files[0]);
	     this.$axios.post("/bug/uploadBugFile", params,config).then((res)=>{
	     	let data =res.data;
	     	if(data.code == 200){
	     		if(typeof this.popup.popTxt.uploadFiles =="string"){
	     		this.$set(this.popup.popTxt,"uploadFiles",[])
	     		this.$set(this.popup.popTxt,"fileList",[])
	     		}
	     		this.popup.popTxt.uploadFiles.push(data.result.name)
	     		this.popup.popTxt.fileList.push(data.result.id)
        document.querySelector(".upload-input").value = "";
	     	}
	     })
	    },
      //下载附件
      downfile(val){
	    	let token=localStorage.getItem("token")
//	    	window.open("http://192.168.43.216:8082/fault/download?token="+token+"&id="+val);
			this.$axios.get("/fault/download?token="+token+"&id="+val)
	    },
      //提交bug弹窗显示
      shouBug(){
        this.bugVisible=true;
        this.updateFlag=false;
	    /*	let params = new URLSearchParams();
				params.append("status",2);
				this.$axios.post("/fault/getNo", params).then((res) => {
					 let data = res.data;
						this.$set(this.popup, "id",data.id);
				})*/
        // let params = new FormData();
        // params.append("status", 2);
        // params.append("token", this.$getToken());
        // this.$axios.post("/fault/getNo",params).then((res) => {
        //   let data = res.data;
        //   this.popup.popTxt.id=data.id;
        // })
	    },
      //提交bug表单
      subForm(){
        this.popup.popTxt.fppeople = Array.from(this.assign.checkList, item => item.split('-')[0]).join(',');
        let tipList = {
          title: '请填写标题',
          priperty2: '请选择BUG等级',
          desc: '请填写BUG详细描述',
          fppeople: '请分配人员'
        };
        for(let item of Object.entries(tipList)){
          if(!this.popup.popTxt[item[0]]){
            this.$warn(item[1]);
            return;
          }
        }
        //上传附件
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
        // console.log(this.popup.popTxt.fileList)
        // return;
        let params = new URLSearchParams();
        params.append("bug_desc", this.popup.popTxt.desc);//BUG说明
        params.append("names",this.popup.popTxt.names);//标题
		    params.append("title",this.popup.popTxt.title);//标题
		    params.append("bug_level",this.popup.popTxt.priperty2);//bug等级
        params.append("fix_time",this.popup.popTxt.expectTime);	//期望解决时间
        params.append("assignee_ids", this.popup.popTxt.fppeople);//分配人id
        params.append("attachmentIds", this.popup.popTxt.fileList);
        if(this.updateFlag){
          params.append("bug_id", this.updateBugId);
          this.$axios.post("/bug/updateBug", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.errorVisible=false;
              this.clearAddData();
              this.loadData();
            }
          });
        }else{
          this.$axios.post("/bug/saveBug", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.errorVisible=false;
              this.clearAddData();
              this.loadData();
            }
          });
        }
	      // this.$axios.post("/bug/saveBug", params).then((res) => {
	      //   let data = res.data;
	      //   if (data.code == 200) {
	      //     this.$success("操作成功！");
	      //     this.errorVisible=false;
	      //     this.clearAddData();
	      //     this.loadData();
	      //   }
        // });
        this.assign.checkList = [];
        this.panelTip.difineSelectUsers = [];
        this.bugVisible=false
      },
      //控制台切换
      tabClick(val){
        this.calculateTabsHeight();
      },
      //清除新增新增的表单
		    clearAddData(){
		    for (let i in this.popup.popTxt) {
		      this.popup.popTxt[i] = "";
		    }
        this.operate.reasonValue=''
        this.operate.effectScope=''
        this.operate.solution=''
        let len=this.operate.systemAll.length-1
        for (let i of this.operate.systemAll) {
          i.csty=''
        }
        this.operate.systemAll.splice(0,len)
        this.operate.system='';
		  },
			    //添加系统
      addsubStystem(index,e){
      	let type = e.target.className
      	if(type == "el-icon-plus"){
	      	if(!this.operate.systemAll[index].csty){
	      		this.$warn("请先选择子系统");
	      		return
	      	}
      		this.operate.systemAll.push({"fsty":"","csty":""});
      	}else{
      		this.operate.systemAll.splice(index,1)
      	}
      },
      setConsoleVisible(){
        this.tabs.consoleWrapperVisible = false;
        this.calculateTableHeight(false)
      },
      backPage(val){
       	this.loadData();
       	this.clearAddData();
      	this.bugVisible=false
        this.assign.checkList = [];
        this.panelTip.difineSelectUsers = [];
      }
    }
  }
</script>
<style>
.rolelist #pane-info .el-form-item__label{
  width: 150px!important;
}
</style>
<style scoped>
  @import "../../static/css/table.css";
  @import "../../static/css/console.css";

  .search .el-input {
    width: auto;
  }

  .back {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 13px;
    cursor: pointer;
    line-height: 21px;
  }

  .back i.b {
    color: #606266;
    font-style: normal;
  }

  .el-date-editor--datetimerange.el-input__inner {
    width: 370px;
  }

  .el-textarea textarea {
    height: 100px;
  }

  .el-table td, .el-table th {
    padding: 5px 0;
  }

  .el-button {
    padding: 6px 10px;
  }
  .console-tab-content .add{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    cursor: pointer;
    vertical-align: middle;
    /*margin-left:10px;*/
  }
  .col-div{
    position: relative;
  }
  .infoDiv{
    position: absolute;
    top: 1px;
    left: 10px;

  }
  .tab-opt{
    display: inline-block;
    width: 90px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .assign-wrapper li {
    margin-bottom: 6px;
    padding: 0 10px;
    min-height: 70px;
  }
  .assign-wrapper li .deptTitle {
    display: block;
    width: 100%;
    line-height: 34px;
    border: 1px solid #ccc;
    text-align: center;
    font-size: 14px;
    margin: 5px auto;
  }
  .assign-wrapper .check-item {
    margin: 5px 0;
    display: block;
  }
  .genzong span {
    color: #4f4f4f;
    margin: 0 8px;
  }
  .assgin-dialog h2 {
    margin-bottom: 10px;
    font-size: 20px;
  }
  .assgin-dialog .tab span {
    float: left;
    width: 50%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
</style>
