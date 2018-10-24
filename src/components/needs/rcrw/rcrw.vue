<template>
  <div class="jcjs common-card-wrap"
       @click="$event.target.className == 'icon-more iconfont'?'':tabs.consoleActionVisible = false">
    <el-card class="box-card">
      <div class="text item">
        <div class="content">
          <div class="action clear">
            <el-button type="danger" v-if='ifMANAGER_SAVE' size="mini" @click="newneeds">技术经理提需求</el-button>
            <el-button type="danger" v-if='ifPRODUCT_SAVE' size="mini" @click="newneedsP">产品经理提需求</el-button>
            <el-select v-model="selectValueOn" placeholder="请选择状态" @change="selectStatOn" clearable size="mini">
              <el-option :key="index" v-for="(item, index) in optionsOn" :label="item.STATE_NAME" :value="item.STATE_ID">
              </el-option>
            </el-select>
            <div class="fr">
              <div style="margin-right: 10px;" class="i-b">
                <el-date-picker v-model="dateRange" @blur="pickDate(dateRange)" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini"
                                :picker-options="dateComp">
                </el-date-picker>
              </div>
              <div class="search i-b">
                <el-input placeholder="请输入检索关键字" suffix-icon="icon-sousuo iconfont" v-model="keyword" size="mini"
                          clearable @change="searchKeyword($event)">
                </el-input>
              </div>
            </div>
          </div>
          <!--表格部分-->
          <div class="table-list">
            <el-table :data="table.tableData" border style="width: 100%" v-if="table.tableHeight"
                      :height="table.tableHeight" ref="rcrw_table"
                      :default-sort = "{prop: 'start_DATE', order: 'descending'}"
                      highlight-current-row :row-class-name="tableRowClassName" @row-click="handleCurrentChange">
              <el-table-column sortable prop="daliy_NEET_ID" label="任务编号" width="200"></el-table-column>
              <el-table-column sortable prop="task_NAME" label="任务名称" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="start_DATE" label="申请日期" width="110"></el-table-column>
              <!--<el-table-column prop="start_TIME" label="申请时间" width="110"></el-table-column>-->
              <el-table-column sortable prop="end_DATE_STRING" label="期望上线时间" width="140"></el-table-column>
              <el-table-column sortable prop="user_NAME" label="申请人" width="110"></el-table-column>
              <el-table-column sortable prop="rriority_NAME" label="优先级" width="110"></el-table-column>
              <el-table-column sortable prop="isFast" label="是否加急" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="state_NAME" label="状态" width="100"></el-table-column>
              <el-table-column label="操作" width="130">
                <template slot-scope="scope" class="action-wrap">
                  <el-button v-if="scope.row.check_TYPE=='check'" @click="agreeRow(scope.row,$event)" size="small"
                             type="primary">确认
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='check'" @click="unagreeRow(scope.row,$event,'驳回')"
                             size="small" type="danger">驳回
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='assign'" @click="assignRow(scope.row,$event)" size="small"
                             type="primary">确认
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='assign'" @click="unagreeRow(scope.row,$event,'驳回')"
                             size="small" type="danger">驳回
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='review'" @click="review(scope.row,$event)" size="middle"
                             type="primary">需求评审
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="console-tab-wrapper" v-if="tabs.consoleWrapperVisible">
            <div class="console-action-wrapper">
              <i class="el-icon-close close" @click="setConsoleVisible"></i>
            </div>
            <el-tabs v-model="tabs.activeName" type="card" @tab-click="tabClick">
              <el-tab-pane label="详情页" name="info">
                <div class="console-tab-content">
                  <el-form label-width="100px" label-position="left">
                    <el-row :gutter="20">
                      <!--<el-col :span="24">-->
                        <!--<el-form-item v-if="tabs.data_one.daliy.design_SYSTEM" label="涉及系统">-->
                          <!--{{tabs.data_one.daliy.design_SYSTEM}}-->
                        <!--</el-form-item>-->
                      <!--</el-col>-->
                      <el-col :span="12">
                        <el-form-item label="任务编号">{{tabs.data_one.daliy.daliy_NEET_ID}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请人">{{tabs.data_one.daliy.user_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.daliy.reject_RESON && tabs.data_one.daliy.state_ID==212">
                        <el-form-item label="不通过原因" style="color: red">{{tabs.data_one.daliy.reject_RESON}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.daliy.reject_RESON && tabs.data_one.daliy.state_ID==209">
                        <el-form-item label="通过原因" style="color: red">{{tabs.data_one.daliy.reject_RESON}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="任务名称">{{tabs.data_one.daliy.task_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="任务来源">{{tabs.data_one.daliy.task_SOURCE}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请日期">{{tabs.data_one.daliy.start_DATE}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="期望上线时间">{{tabs.data_one.daliy.end_DATE_STRING}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="优先级">{{tabs.data_one.daliy.rriority_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="涉及产品线">{{tabs.data_one.daliy.prduct_LINE}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="重要程度">{{tabs.data_one.daliy.importance_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.daliy.ugent">
                        <el-form-item label="是否加急">是</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="!tabs.data_one.daliy.ugent">
                        <el-form-item label="是否加急">否</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="加急说明" v-if="tabs.data_one.daliy.ugent">{{tabs.data_one.daliy.ugent}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求描述">
                          <div class="task_DESCRIPTION"></div>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="tabs.review_GRADE">
                        <el-form-item label="评审等级">{{tabs.review_GRADE}}</el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="产品改造点">
                          <div class="prduct_FUNCTION"></div>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.daliy.check_TYPE">
                        <el-form-item label="需求评审结果 ">{{tabs.data_one.daliy.check_TYPE}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.daliy.check_TYPE">
                        <el-form-item label="评审时间 ">{{tabs.data_one.daliy.check_TIME | date}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.daliy.check_NAME">
                        <el-form-item label="参会人 ">{{tabs.data_one.daliy.check_NAME}}</el-form-item>
                      </el-col>
                    </el-row>
                    <!--需求文档-->
                    <el-col :span="24">
                      <el-form-item label="需求文档">
                        <span @click="showDownLoadData('需求文档')" style="cursor: pointer;color: red">点击查看</span>
                      </el-form-item>
                    </el-col>
                    <!------------------------------开发手册-->
                    <el-col :span="24">
                      <el-form-item label="开发手册">
                        <span style="cursor: pointer;color: orangered" @click="showDownLoadData('开发手册')">点击可查看</span>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </div>
              </el-tab-pane>

              <el-tab-pane label="操作台" name="console">
                <div class="console-tab-content">
                  <!--div class="console-action-wrapper"
                       v-if="tabs.ifConsole || tabs.ifAssign || tabs.ifSplit || tabs.ifEdit">
                    <i class="icon-more iconfont" @click="tabs.consoleActionVisible = !tabs.consoleActionVisible"></i>
                    <div class="console-action fr" v-if="tabs.consoleActionVisible">
											<span v-for="(item, index) in tabs.consoleActionData" @click="consoleActionEvent(item)">{{item.name}}
                                            </span>
                    </div>
                  </div-->

                  <el-form label-width="60px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12" :sm="12">
                        <el-form-item label="状态：">
                          <span style="color: red">{{tabs.state_NAME}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="发送人：" label-width="100px">
                          {{tabs.user_NAME}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-form label-width="120px" label-position="left" v-if="tabs.ifPing">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="评审等级">
                          <el-select v-model="tabs.rriority" clearable placeholder="请选择评审等级">
                            <el-option :key="index" v-for="(item, index) in tabs.rriorityArr" :label="item.RRIORITY_NAME"
                                       :value="item.RRIORITY_ID"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求评审结果">
                          <el-select v-model="tabs.checks" clearable placeholder="请选择需求评审结果">
                            <el-option :key="index" v-for="(item, index) in tabs.checksArr" :label="item.CHECK_NAME"
                                       :value="item.CHECK_ID+'-'+item.CHECK_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="评审时间">
                          <el-date-picker type="date"
                                          placeholder="选择评审日期" v-model="addneeds.addform.check_time"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="参会人">
                          <el-input v-model="addneeds.addform.check_name"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-form v-if="tabs.ifSplit" label-width="120px" label-position="right">
                    <el-row :span="24">
                      <el-col :span="12" :md="12">
                        <el-form-item label="涉及系统">
                          <el-select v-model="addneeds.addform.sjxt" multiple clearable placeholder="请选择涉及系统"
                                     style="width: 100%;">
                            <el-option :key="index" v-for="(item, index) in addneeds.addform.sjxtArr" :label="item.SYSTEM_NAME"
                                       :value="item.SYSTEM_ID+','+item.SYSTEM_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :span="24">
                      <el-col :span="24" style="text-align: center;position: relative;margin-bottom: 20px">
                        拆分任务：{{addneeds.addform.splitArr.length}}
                        <el-button type="primary" @click="distributionTask1" size="mini"
                                   style="position: absolute;right: 0;">分配任务
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-col :span="12" :md="12">
                      <el-form-item label="预计开始时间">
                        <el-date-picker type="date" placeholder="选择日期" @change="changeEnd"
                                        v-model="addneeds.addform.startTime" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :md="12">
                      <el-form-item label="预计完成时间">
                        <el-date-picker type="date" v-if="!addneeds.addform.startTime" disabled
                                        :picker-options="pickerOptions" placeholder="选择日期"
                                        v-model="addneeds.addform.endTime" style="width: 100%;"></el-date-picker>
                        <el-date-picker type="date" v-if="addneeds.addform.startTime" :picker-options="pickerOptions"
                                        placeholder="选择日期" v-model="addneeds.addform.endTime"
                                        style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :md="12">
                      <el-form-item label="分析时间">
                        <el-date-picker type="date" placeholder="选择日期" v-model="addneeds.addform.analysisTime"
                                        style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :md="12">
                      <el-form-item label="需求分析结果">
                        <el-select v-model="addneeds.addform.analysis" clearable placeholder="请选择需求分析结果"
                                   style="width: 100%;">
                          <el-option :key="index" v-for="(item, index) in addneeds.addform.analysisArr" :label="item"
                                     :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :md="12">
                      <el-form-item label="风险点">
                        <el-input v-model="addneeds.addform.RISK"></el-input>
                      </el-form-item>
                    </el-col>
                    <div class="table-list">
                      <el-table :data="addneeds.addform.splitArr" border style="width: 100%" height="200" show-summary
                                highlight-current-row>
                        <el-table-column prop="USER_NAME" label="人员"></el-table-column>
                        <el-table-column prop="xtname" label="系统名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="fzmk" label="负责模块" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="easy" label="难易度" width="70"></el-table-column>
                        <el-table-column prop="finishDate" label="完成日期" width="110"></el-table-column>
                        <el-table-column prop="willTime" label="预计用时(小时)" width="110"></el-table-column>
                        <el-table-column prop="taskNum" label="任务量" width="70"></el-table-column>
                      </el-table>

                    </div>
                  </el-form>
                  <!--操作按钮-->
                  <div class="tab-console-handler">
                      <el-button v-if="tabs.ifSplit" @click="createNewN" size="medium" type="primary">提交 </el-button>
                      <el-button v-if="tabs.ifPing" @click="checkDaliy" size="medium" type="primary">提交 </el-button>
                      <el-button v-if="tabs.ifReject" @click="unagreeRow(tabs,$event,'驳回')" size="medium" type="primary">驳回</el-button>
                      <el-button
                        v-for="(item, index) in tabs.consoleActionData"
                        :key="index"
                        @click="consoleActionEvent(item)"
                        size="mini"
                        type="primary"
                      >{{item.name}}</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="开发任务" name="console2" v-if="tabs.data_one.infos">
                <div class="console-tab-content">
                  <el-form label-width="0px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12" :sm="12">
                        <el-form-item style="position: relative;">
                          <!--<el-button type="primary">请选择附件</el-button>-->
                          <!--<input type="file" @change="getFile($event)" placeholder="请选择附件" style="width:90px;position: absolute;left: 0;top: 9px;opacity: 0;">-->
                          <!--<p v-for="(item,index) in popup.popTxt.uploadFiles">{{item}}-->
                          <!--<i style="margin-left: 10px;cursor: pointer;color: red;"-->
                          <!--@click="popup.popTxt.fileList.splice(index,1);popup.popTxt.uploadFiles.splice(index,1)" class="el-icon-close"></i>-->
                          <!--</p>-->
                          <!--<el-button type="primary" >确认上传附件</el-button>-->
                          <el-button style="float: left;margin: 10px" type="primary" size="mini"
                                     @click="startUpload('上传手册')">上传手册
                          </el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div class="table-list" style="margin-top: 40px;">
                    <el-table :data="tabs.data_one.infos" show-summary border style="width: 100%" highlight-current-row>
                      <el-table-column prop="user_NAME" label="人员"></el-table-column>
                      <el-table-column prop="system_NAME" label="系统名"></el-table-column>
                      <el-table-column prop="responsible_MODULE" label="负责模块"></el-table-column>
                      <el-table-column prop="''+end_DATE" :formatter="splitDataFormatter"
                                       label="完成日期"></el-table-column>
                      <el-table-column prop="expect_TIME" label="预计用时"></el-table-column>
                      <el-table-column prop="workload" label="任务量"></el-table-column>
                      <el-table-column label="操作" width="130">
                        <template slot-scope="scope" class="action-wrap">
                          <el-button v-if="scope.row.state_ID==205" @click="startTask(scope.row,scope,$event)"
                                     size="middle" type="primary">开始
                          </el-button>
                          <el-button v-if="scope.row.state_ID==206" @click="finishTask(scope.row,scope,$event)"
                                     size="middle" type="primary">完成
                          </el-button>
                          <!--<el-button  v-if="scope.row.state_ID==211"  @click="startTask(scope.row,scope,$event)" size="middle" type="primary">已完成
                                             </el-button>-->
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="拆分项目" name="split">
                <div class="console-tab-content">
                  <div class="table-list" v-if="tabs.data_one.deptSystem">
                    <el-table :data="tabs.data_one.deptSystem" show-summary border style="width: 100%"
                              highlight-current-row @row-click="splitTaskClick">
                      <el-table-column prop="dept_name" label="开发组"></el-table-column>
                      <el-table-column prop="project" label="项目编码"></el-table-column>
                      <el-table-column prop="system_NAME" label="涉及系统"></el-table-column>
                      <el-table-column prop="worktime" label="任务量" width="100"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="全程跟踪" name="log">
                <div class="console-tab-content">
                  <el-form label-width="60px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="6" :sm="6">
                        <el-form-item label="状态：">
                          <span style="color: red">{{tabs.state_NAME}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" :sm="6">
                        <el-form-item label="发送人：" label-width="100px">
                          {{tabs.user_NAME}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" :sm="6">
                        <el-form-item>
                          <el-button size="mini" type="primary" @click="loadtrack">视图模式</el-button>
                        </el-form-item>
                      </el-col>

                      <el-col :span="6" :sm="6" v-if="tabs.chooseDeptArr">
                        <el-form-item label-width="100px">
                          <el-select v-model="tabs.chooseDept" @change="chooseDeptF" clearable placeholder="请选择部门"
                                     style="float: right;">
                            <el-option :key="index" v-for="(item, index) in tabs.chooseDeptArr" :label="item.DEPT_NAME"
                                       :value="item.DEPT_ID"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="24" :sm="24" v-show="!tracking.trackingvisiible">
                        <p :key="index" v-for="(item,index) in tabs.genzong" class="genzong">
                          <span style="width: 30px;display: inline-block;">{{index+1}}.</span> <span
                          style="width: 150px;display: inline-block;">{{item.record_START | time}}</span>{{item.record_DESC}}
                        </p>
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
      </div>
    </el-card>

    <!--新建任务-->
    <el-dialog title="技术经理新建任务" :visible="addneeds.addvisible" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialog">
      <el-form :model="addneeds.addform" ref="addneeds.addform" label-width="100px" class="demo-ruleForm">
        <el-row :md="24" :gutter="20">
          <el-col :span="12" :md="12">
            <el-form-item label="涉及系统">
              <el-select v-model="addneeds.addform.sjxt" multiple clearable placeholder="请选择涉及系统" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.sjxtArr" :label="item.SYSTEM_NAME"
                           :value="item.SYSTEM_ID+','+item.SYSTEM_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="任务编号">
              <el-input v-model="addneeds.addform.code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请人">
              <el-input v-model="addneeds.addform.sxname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12" prop="name" :rules="[{required: true, message: '请输入', trigger: 'blur'}]">
            <el-form-item label="任务名称">
              <el-input v-model="addneeds.addform.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" :md="12">
            <el-form-item label="需求提出部门">
              <el-select v-model="addneeds.addform.fromdeptId" style="width: 100%;" clearable placeholder="请选择需求提出部门"
                         @change="fromdeptchange">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.fromdeptArr" :label="item.dept_name"
                           :value="item.dept_id+'-'+item.dept_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="提出人">
              <el-select v-model="addneeds.addform.fromdeptroleId" style="width: 100%;" clearable placeholder="请选择提出人">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.fromdeptroleArr" :label="item.user_NAME"
                           :value="item.user_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请日期">
              <el-date-picker type="date" @change="changeEnd" placeholder="选择日期" v-model="addneeds.addform.applyDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="期望上线时间">
              <el-date-picker type="date" v-if="!addneeds.addform.applyDate" disabled :picker-options="pickerOptions1"
                              placeholder="选择日期" v-model="addneeds.addform.jihuadate"
                              style="width: 100%;"></el-date-picker>
              <el-date-picker type="date" v-if="addneeds.addform.applyDate" :picker-options="pickerOptions1"
                              placeholder="选择日期" v-model="addneeds.addform.jihuadate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="需求描述">
              <!--<el-input type="textarea" v-model="addneeds.addform.needsname"></el-input>-->
              <v-vueQuillEditor-needsname
                :needsname="addneeds.addform.needsname" @setValue="setValue_needsname">
              </v-vueQuillEditor-needsname>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求划分归属">
              <el-select v-model="addneeds.addform.ascription" clearable placeholder="请选择需求划分归属" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.ascriptionArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求影响面">
              <el-select v-model="addneeds.addform.influece" clearable placeholder="请选择需求影响面" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.influeceArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="成果类型">
              <el-select v-model="addneeds.addform.result" clearable placeholder="请选择成果类型" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.resultArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求类型">
              <el-select v-model="addneeds.addform.daliyTypeName" clearable placeholder="请选择需求类型" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.daliyTypeNameArr" :label="item.NEEL_TYPE_NAME+'-'+item.TYPE"
                           :value="item.NEEL_TYPE_NAME+'-'+item.TYPE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="产品改造点">
              <!--<el-input v-model="addneeds.addform.prduct_function"></el-input>-->
              <v-vueQuillEditor-changepoint
                :changepoint="addneeds.addform.prduct_function" @setValue="setValue_changepoint">
              </v-vueQuillEditor-changepoint>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="涉及产品线">
              <el-input v-model="addneeds.addform.prduct_line"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="优先级">
              <el-select v-model="addneeds.addform.level" clearable placeholder="请选择优先级" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.levelArr" :label="item.RRIORITY_NAME"
                           :value="item.RRIORITY_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="是否加急" style="height: 42px">
              <el-row :span="24">
                <el-col :span="6" :md="6">
                  <el-radio v-model="addneeds.addform.jiaji" label="0">否</el-radio>
                  <el-radio v-model="addneeds.addform.jiaji" label="1">是</el-radio>
                </el-col>
                <el-col :span="18" :md="18">
                  <el-input placeholder="请填写加急原因" v-model="addneeds.addform.jiajireason"
                            v-if="addneeds.addform.jiaji ==1?true:false"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="重要程度">
              <el-select v-model="addneeds.addform.zhongyaochegndu" clearable placeholder="请选择重要程度"
                         style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.zhongyaochegnduArr" :label="item.IMPORTANCE_NAME"
                           :value="item.IMPORTANCE_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row :span="24" v-for="(content, index) in addneeds.addform.onlineContent">-->
        <!--<el-col :span="12">-->
        <!--<el-form-item label="系统名">-->
        <!--<el-select v-model="content.xtname" clearable placeholder="请选择系统名" style="width: 100%;">-->
        <!--<el-option v-for="(item, index) in addneeds.addform.systemArr" :label="item.SYSTEM_NAME" :value="item.SYSTEM_ID+','+item.SYSTEM_NAME"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="10">-->
        <!--<el-form-item label="版本号">-->
        <!--<el-input v-model="content.ban"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="2">-->
        <!--<i :class="index == 0 && addneeds.addform.onlineContent.length == 1?'el-icon-plus':index == addneeds.addform.onlineContent.length-1?'el-icon-plus':'el-icon-minus'" style="line-height: 40px;height: 40px;text-align: center;-->
        <!--font-size: 20px;margin-left: 20px;cursor: pointer;font-weight: bold" @click="systemEvent(index,$event)">-->
        <!--</i></el-col>-->
        <!--</el-row>-->
        <el-row :gutter="20" STYLE="margin-top: 20px">
          <el-col :span="12" :sm="12">
            <el-form-item label="上传需求文档" style="position: relative;">

              <el-button type="primary">上传需求文档</el-button>
              <input type="file" @change="getFile2($event)" placeholder="上传需求文档"
                     style="width:90px;position: absolute;left: 0;top: 9px;opacity: 0;">
              <p :key="index" v-for="(item,index) in popup.popTxt.uploadFiles">{{item}}
                <i style="margin-left: 10px;cursor: pointer;color: red;"
                   @click="popup.popTxt.fileList.splice(index,1);popup.popTxt.uploadFiles.splice(index,1)"
                   class="el-icon-close"></i>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24">
          <el-col :span="24" style="text-align: center;position: relative;"> 拆分任务：{{addneeds.addform.splitArr.length}}
            <el-button type="primary" @click="distributionTask" size="mini" style="position: absolute;right: 0;">分配任务
            </el-button>
          </el-col>
        </el-row>
        <el-row :span="24" style="margin-top: 20px;">
          <el-col :span="12" :md="12">
            <el-form-item label="预计开始时间">
              <el-date-picker type="date" placeholder="选择日期" @change="changeEnd" v-model="addneeds.addform.startTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="预计完成时间">
              <el-date-picker type="date" v-if="!addneeds.addform.startTime" disabled :picker-options="pickerOptions"
                              placeholder="选择日期" v-model="addneeds.addform.endTime"
                              style="width: 100%;"></el-date-picker>
              <el-date-picker type="date" v-if="addneeds.addform.startTime" :picker-options="pickerOptions"
                              placeholder="选择日期" v-model="addneeds.addform.endTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="分析时间">
              <el-date-picker type="date" placeholder="选择日期" v-model="addneeds.addform.analysisTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求分析结果">
              <el-select v-model="addneeds.addform.analysis" clearable placeholder="请选择需求分析结果" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.analysisArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="风险点">
              <el-input v-model="addneeds.addform.RISK"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="table-list">
          <el-table :data="addneeds.addform.splitArr" border style="width: 100%" height="200" show-summary
                    highlight-current-row>
            <el-table-column prop="USER_NAME" label="人员"></el-table-column>
            <el-table-column prop="xtname" label="系统名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fzmk" label="负责模块" show-overflow-tooltip></el-table-column>
            <el-table-column prop="easy" label="难易度" width="70"></el-table-column>
            <el-table-column prop="finishDate" label="完成日期" width="110"></el-table-column>
            <el-table-column prop="willTime" label="预计用时(小时)" width="110"></el-table-column>
            <el-table-column prop="taskNum" label="任务量" width="70"></el-table-column>
          </el-table>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="createNew" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!--产品经理-->
    <el-dialog title="产品经理新建任务" :visible="addneeds.addvisibleP" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialog">
      <el-form label-width="100px">
        <el-row :md="24" :gutter="20">
          <el-col :span="12" :md="12">
            <el-form-item label="任务编号">
              <el-input v-model="addneeds.addform.code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请人">
              <el-input v-model="addneeds.addform.sxname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="任务名称">
              <el-input v-model="addneeds.addform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求提出部门">
              <el-select v-model="addneeds.addform.fromdeptId" style="width: 100%;" clearable placeholder="请选择需求提出部门"
                         @change="fromdeptchange">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.fromdeptArr" :label="item.dept_name"
                           :value="item.dept_id+'-'+item.dept_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="提出人">
              <el-select v-model="addneeds.addform.fromdeptroleId" style="width: 100%;" clearable placeholder="请选择提出人">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.fromdeptroleArr" :label="item.user_NAME"
                           :value="item.user_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请日期">
              <el-date-picker type="date" @change="changeEnd" placeholder="选择日期" v-model="addneeds.addform.applyDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="期望上线时间">
              <el-date-picker type="date" v-if="!addneeds.addform.applyDate" disabled :picker-options="pickerOptions1"
                              placeholder="选择日期" v-model="addneeds.addform.jihuadate"
                              style="width: 100%;"></el-date-picker>
              <el-date-picker type="date" v-if="addneeds.addform.applyDate" :picker-options="pickerOptions1"
                              placeholder="选择日期" v-model="addneeds.addform.jihuadate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="需求描述">
              <!--<el-input v-model="addneeds.addform.needsname"></el-input>-->
              <v-vueQuillEditor-needsname
                :needsname="addneeds.addform.needsname" @setValue="setValue_needsname">
              </v-vueQuillEditor-needsname>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求划分归属">
              <el-select v-model="addneeds.addform.ascription" clearable placeholder="请选择需求划分归属" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.ascriptionArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求影响面">
              <el-select v-model="addneeds.addform.influece" clearable placeholder="请选择需求影响面" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.influeceArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="成果类型">
              <el-select v-model="addneeds.addform.result" clearable placeholder="请选择成果类型" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.resultArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求类型">
              <el-select v-model="addneeds.addform.daliyTypeName" clearable placeholder="请选择需求类型" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.daliyTypeNameArr" :label="item.NEEL_TYPE_NAME+'-'+item.TYPE"
                           :value="item.NEEL_TYPE_NAME+'-'+item.TYPE"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="产品改造点">
              <!--<el-input v-model="addneeds.addform.prduct_function"></el-input>-->
              <v-vueQuillEditor-changepoint
                :changepoint="addneeds.addform.prduct_function" @setValue="setValue_changepoint">
              </v-vueQuillEditor-changepoint>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="涉及产品线">
              <el-input v-model="addneeds.addform.prduct_line"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="优先级">
              <el-select v-model="addneeds.addform.level" clearable placeholder="请选择优先级" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.levelArr" :label="item.RRIORITY_NAME"
                           :value="item.RRIORITY_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" :md="12">
            <el-form-item label="重要程度">
              <el-select v-model="addneeds.addform.zhongyaochegndu" clearable placeholder="请选择重要程度"
                         style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.zhongyaochegnduArr" :label="item.IMPORTANCE_NAME"
                           :value="item.IMPORTANCE_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="是否加急" style="height: 42px">
              <el-row :span="24">
                <el-col :span="6" :md="6">
                  <el-radio v-model="addneeds.addform.jiaji" label="0">否</el-radio>
                  <el-radio v-model="addneeds.addform.jiaji" label="1">是</el-radio>
                </el-col>
                <el-col :span="18" :md="18">
                  <el-input placeholder="请填写加急原因" v-model="addneeds.addform.jiajireason"
                            v-if="addneeds.addform.jiaji ==1?true:false"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="createNew2" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <!--拆分任务-->
    <el-dialog title="新增拆分任务人员" :visible="addneeds.splitaddvisible" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialogS">
      <el-form label-width="120px">
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="人员">
              <el-select v-model="addneeds.addform.splitForm.name" placeholder="请选择人员">
                <el-option-group :key="index" v-for="(group, index) in addneeds.addform.frompeopleArr" :label="group.dept_name">
                  <el-option :key="`${index}h`" v-for="(item, index) in group.users" :label="item.user_NAME"
                             :value="item.user_ID+','+item.user_NAME">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子系统名">
              <el-select v-model="addneeds.addform.splitForm.xtname" clearable placeholder="请选择子系统"
                         style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.splitForm.fzmoduleArr" :label="item.SYSTEM_NAME"
                           :value="item.SYSTEM_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责模块">
              <el-input v-model="addneeds.addform.splitForm.fzmodule"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难易程度">
              <el-select v-model="addneeds.addform.splitForm.easy" clearable placeholder="请选择难易程度" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.easyArr" :label="item.FACILITY_NAME"
                           :value="item.FACILITY_ID+','+item.FACILITY_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="addneeds.addform.splitForm.allDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计用时(小时)">
              <el-input v-model="addneeds.addform.splitForm.willTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务量">
              <el-input v-model="addneeds.addform.splitForm.taskNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogS" size="mini">取 消</el-button>
        <el-button type="primary" @click="addOneTask" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!------------控制台拆分-------------->
    <el-dialog title="新增拆分任务人员" :visible="addneeds.splitaddvisibleN" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialogS">
      <el-form label-width="120px">
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="人员">
              <el-select v-model="addneeds.addform.splitForm.name" placeholder="请选择人员">
                <el-option-group :key="index" v-for="(group, index) in addneeds.addform.frompeopleArr" :label="group.dept_name">
                  <el-option :key="`${index}hh`" v-for="(item, index) in group.users" :label="item.user_NAME"
                             :value="item.user_ID+','+item.user_NAME">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子系统名">
              <el-select v-model="addneeds.addform.splitForm.xtname" clearable placeholder="请选择子系统"
                         style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.splitForm.fzmoduleArr" :label="item.SYSTEM_NAME"
                           :value="item.SYSTEM_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责模块">
              <el-input v-model="addneeds.addform.splitForm.fzmodule"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难易程度">
              <el-select v-model="addneeds.addform.splitForm.easy" clearable placeholder="请选择难易程度" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.easyArr" :label="item.FACILITY_NAME"
                           :value="item.FACILITY_ID+','+item.FACILITY_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="addneeds.addform.splitForm.allDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计用时(小时)">
              <el-input v-model="addneeds.addform.splitForm.willTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务量">
              <el-input v-model="addneeds.addform.splitForm.taskNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogS" size="mini">取 消</el-button>
        <el-button type="primary" @click="addOneTask1" size="mini">确定</el-button>
      </div>
    </el-dialog>

    <!--拆分任务详情-->
    <el-dialog title="拆分任务详情" :visible="addneeds.hasSplitvisible" width="80%" append-to-body modal-append-to-body
               :before-close="closeDialog">
      <el-form label-width="100px">
        <el-row :span="24" v-if="split.hasSplitTaskData" :key="index" v-for="(item, index) in split.hasSplitTaskData">
          <el-col :span="12" v-if="index==0">
            <el-form-item label="需求分析结果">{{item.analysis_RESULT}}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="index==0">
            <el-form-item label="分析时间">{{item.analysis_TIME | date}}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="index==0">
            <el-form-item label="预计开始时间">{{item.expect_START | date}}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="index==0">
            <el-form-item label="预计完成时间">{{item.expect_END | date}}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table-list">
        <el-table :data="split.hasSplitTaskData" border show-summary style="width: 100%">
          <el-table-column prop="user_NAME" label="人员"></el-table-column>
          <el-table-column prop="system_NAME" label="系统名" show-overflow-tooltip></el-table-column>
          <el-table-column prop="responsible_MODULE" label="负责模块" show-overflow-tooltip></el-table-column>
          <el-table-column prop="''+end_DATE" :formatter="splitDataFormatter" label="完成日期"
                           width="110"></el-table-column>
          <el-table-column prop="expect_TIME" label="预计用时" width="110"></el-table-column>
          <el-table-column prop="workload" label="任务量" width="70"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--确认-->
    <el-dialog title="确认" :visible="assign.assignvisible" width="30%" append-to-body modal-append-to-body
               :before-close="closeDialog" class="assgin-dialog">
      <div slot="title">
        <h2>分配</h2>
        <div class="tab clear">
          <span :class="{'active':assign.left}"
                @click="assign.left = true;assign.right = false;assign.searchData = assign.leftlistdata;assign.leftSearch = false">全部部门</span>
          <span :class="{'active':assign.right}"
                @click="assign.left = false;assign.right = true;assign.searchData = assign.rightlistdata;assign.leftSearch = true">本部门</span>
        </div>
        <el-input class="search-input" placeholder="请输入姓名" v-model="assign.keyword" @keyup.13="assignSearch"
                  @change="assignSearch" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <div class="assign-wrapper" v-if="assign.left">
        <ul v-if="!assign.leftSearch">
          <li :key="index" v-for="(item, index) in assign.searchData" v-if="item.users.length>0">
            <span class="deptTitle">{{item.dept_name}}</span>
            <el-checkbox-group v-model="assign.checkList">
              <el-checkbox :key="index" v-for="(_item, index) in item.users" :label="_item.user_ID+'-'+_item.user_NAME" class="check-item">
                {{_item.user_NAME}}
              </el-checkbox>
            </el-checkbox-group>
          </li>
        </ul>
        <div v-if="assign.leftSearch">
          <el-checkbox-group v-model="assign.checkList">
            <el-checkbox :key="index" v-for="(item, index) in assign.searchData" :label="item.user_ID+'-'+item.user_NAME" class="check-item">
              {{item.user_NAME}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="assign-wrapper" v-if="assign.right">
        <el-checkbox-group v-model="assign.checkList">
          <el-checkbox :key="index" v-for="(item, index) in assign.searchData" :label="item.user_ID+'-'+item.user_NAME" class="check-item">
            {{item.user_NAME}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assign.assignvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="subAssign" size="mini">提交</el-button>
      </div>
    </el-dialog>
    <!--全程跟踪视图模式-->
    <!--<el-dialog title="全程跟踪视图模式" :visible="tracking.trackingvisiible" width="95%"-->
    <!--append-to-body modal-append-to-body-->
    <!--:before-close="closeDialog">-->
    <!--<tracking :tracking="tracking"></tracking>-->
    <!--</el-dialog>-->
    <!--下载文件-->
    <download :download="download"></download>
    <!--上传附件弹窗-->
    <uploadN :data="uploadAction"></uploadN>
  </div>
</template>
<script>
  import vueQuillEditor_reform from '../common/vueQuillEditor_reform.vue';//需求背景
  import vueQuillEditor_changepoint from '../common/vueQuillEditor_changepoint.vue';//产品改造点
  import vueQuillEditor_needsname from '../common/vueQuillEditor_needsname.vue';//需求描述
  import download from "../common/download.vue";//下载弹窗
  import tracking from "../common/tracking.vue";//全程跟踪视图模式
  import uploadN from  "../common/uploadN.vue";//上传
  //上传附件组件
  export default {
    data() {
      return {
        addneeds: {
          addvisible: false,
          splitaddvisible: false,
          hasSplitvisible: false,
          splitaddvisibleN: false,
          addvisibleP: false,
          addType: '', //判断性质呢过类型，add 为重新立项，change 为新建变更 changeinset 为需求内变更
          addform: {
            "sjxt": "", //涉及系统
            "sjxtArr": "", //涉及系统数组
            "systemArr": '', //系统数组
            "code": "", //任务编号
            "name": "", //任务名称
            "sxname": "", //申请人
            "fromdeptId": "", //选择的任务来源部门ID
            "fromdeptArr": "", //任务来源数组
            "frompeopleArr": "",//人员数组
            "pepoleArr": "", //
            "fromdeptroleId": "", //选择的需求任务人
            "fromdeptroleArr": "", //择的需求来任务数组
            "zhongyaochegndu": "", //重要程度
            "zhongyaochegnduArr": "", //重要程度数组
            "ascription": "", //需求划分归属
            "ascriptionArr": "", //需求划分归属数组
            "daliyTypeName": "", //日常任务 需求类型
            "daliyTypeNameArr": "", //日常任务 需求类型
            "influece": "", //影响面
            "influeceArr": "", //影响面
            "result": "", //成果类型
            "resultArr": "", //成果类型
            "prduct_function": "", //产品改造点
            "prduct_line": "", //涉及产品线
            "level": "", //优先级
            "levelArr": "", //优先级数组
            "xtname": "", //系统名称
            "xtnameArr": "", //系统名称数组
            "jihuadate": "", //期望上线时间
            "startTime": "", //预计开始时间
            "applyDate": new Date(),//申请时间
            "endTime": "", //预计完成时间
            "analysisTime": "", //分析时间
            "analysis": '', //需求分析结果
            "analysisArr": '', //需求分析结果
            "RISK": "", //风险点
            "check_time": '', //评审时间
            "check_name": '', //评审参与人
            "jiaji": "", //是否加急
            "jiajireason": "", //加急的原因
            "ban": "", //版本号
            "needsname": "", //需求描述
            "onlineContent": [{
              "xtname": '',
              "ban": ''
            }],
            "splitForm": {
              "name": '', //人员
              "xtname": '', //系统
              "fzmodule": '', //负责模块
              "easy": '', //难易程度
              "allDate": '', //完成日期
              "willTime": '', //预计用时
              "taskNum": '', //任务量
              "splitAnalysis": {} //拆分分析
            },
            easyArr: [], //难易程度
            splitArr: [],
            splitShow: ""
          }
        },
        uploadAction: {
          uploadvisible: false,
          uploadFiles: [],
          fileIds: [],
          type: "",
          neel_id: ""
        },
        //下载文件的数据
        download: {
          visible: false,
          data: [],//表格数据
          title: "",//标题
        },//全程跟踪视图模式
        tracking: {
          trackingvisiible: false,
          data: [],//数据
          hoverIndex: "",//移动上去的索引
          hoverData: [],//鼠标悬浮的信息
        },
        split: {
          hasSplitTaskDataByGroup: [], //展示拆分任务的分组
          hasSplitTaskData: [], //展示当前的分组拆分任务
          codetask: [], //开发的任务
          systemAll: [{
            "name": "",
            "version": ""
          }], //所有选择的系统集合
          splitradio: "", //拆分任务类型（1为测试任务，2为开发任务）
          splitvisible: false,
          splitaddvisible: false, //新增人员的显示框
          choosesysyem: "", //选择的系统值
          systemarr: [], //所填写过的的系统数组,
          levelchoosen: "", //难易度选择的值,
          level: [], //难易度数组
          version: "", //版本号
          startdate: "", //预计开始日期
          enddate: "", //预计结束日期
          finishdate: "", //完成日期
          tableData: [], //拆分任务的表数据
          model: "", //负责模块
          taskcode: "", //任务编码
          personlist: [], //课选择人员的人员数组
          person: "", //选择的人员
          usertime: "", //预计用时
          names: [], //放置姓名的数组
          ids: [], //放置id的数组
          usetime: "", //预计用时
        },
        assign: {
          assignvisible: false,
          keyword: "",
          left: true,
          right: false,
          checkList: [],
          leftlistdata: [],
          leftSearch: false,
          rightlistdata: [],
          searchData: [],
          chooseId: ""
        },
        handle: {
          "daliy_NEET_ID": ''
        },
        table: {
          tableData: [],
          tableOriginData: [],
          tableHeight: "",
          hasGo:false,
        },
        keyword: "",
        screenKey: {
          "STATE": "",
          "DATE": "",
          "START_DATE": "",
          "END_DATE": ""
        },
        optionsOn: [],
        selectValueOn: "",
        dateComp: {},
        dateRange: '',
        tabs: {
          activeName: "info", //控制台的选中项
          consoleWrapperVisible: false, //控制台的显示
          consoleActionVisible: false, //控制台的操作显示/隐藏
          consoleActionData: [],
          activeTableInfo: "", //当前选中的信息表格
          data_one: {},
          data_chart: {},//放实时统计的数据
          rriority: "", //评定优先级
          rriorityArr: "", //评定优先级
          checks: "", //需求评审结果
          checksArr: "", //需求评审结果
          state_NAME: "", //状态
          user_NAME: "", //负责人
          genzong: "",
          genzongs: "",
          chooseDept: "", //追踪右边选框
          chooseDeptArr: [],
          ifConsole: '',
          ifEdit: '', //产品任务是否可编辑
          ifPing: '', //是否可评定
          ifReject: '',//是否可驳回
          daliy_NEET_ID:'',//当前选中的信息id
          ifAssign: '',
          ifcanEdit: '0', //是否可编辑
          ifSplit: ''
        }, //上传附件
        popup: {
          priperty: [{
            'name': '紧急',
            "value": "101"
          },
            {
              'name': '中等',
              "value": "102"
            },
            {
              'name': '一般',
              "value": "103"
            }
          ],
          popTxt: {
            'priperty2': '', //故障等级
            'relationUser': "", //故障分析人员
            'description': "", //故障描述
            'descriptionEx': "", //故障复盘分析
            'sumEffect': "", //交易量影响
            'uploadFiles': [], // 上传成功的文件数组
            'fileList': [], //上传附件
          }
        },
        ifMANAGER_SAVE: "", //是否技术经理新增
        ifPRODUCT_SAVE: "", //是否产品经理新增
        errorVsetTableDataisible: false,
        addOneTaskSuccess: false,
        pickerOptions: "",//结束时间限制
        // pickerOptions1: "",
        pickerOptions1:{
          disabledDate(time){
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      }
    },
    filters: {
      date: function (time) {
        let d = new Date(time);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1);
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        let hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
        let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
        let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
        return year + '-' + month + '-' + day;
      },
      time: function (time) {
        let d = new Date(time);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1);
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        let hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours();
        let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes();
        let seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
      },
    },
    components: {
      'v-vueQuillEditor-reform': vueQuillEditor_reform,
      'v-vueQuillEditor-changepoint': vueQuillEditor_changepoint,
      'v-vueQuillEditor-needsname': vueQuillEditor_needsname,
      "tracking": tracking,//全程跟踪视图模式
      "download": download,//下载文件
      "uploadN": uploadN//上传文件

    },
    mounted() {
      this.loadData()
    },
    methods: {
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
      //-----------------------------------计算表格高度
      calculateTableHeight(type){
        let height = document.querySelector(".mainr").offsetHeight;
        let actionHeight = document.querySelector(".content .action").offsetHeight;
        //true代表没有控制台
        if (!type) {
          //----------------------------------------------body的上下padding--table的margin-top-table上border
          this.table.tableHeight = height - 36 - actionHeight - 20 - 20 - 1;
        } else {
          this.table.tableHeight = height * 0.3;
        }
      },
      //-----------------------------------计算操作台的高度
      calculateTabsHeight(){
        let card_body = document.querySelector(".box-card .el-card__body");
        let actionHeight = document.querySelector(".content .action").offsetHeight;
        let allTabContent = document.querySelectorAll(".console-tab-content");
        for (let i of allTabContent) {
          //---------------el-card__body的可用内容高---------顶部操作栏的高---------表格部分的高------tab的头和margin的高----------操作台border
          i.style.height = (parseInt(card_body.style.height) - 20 ) - actionHeight - (this.table.tableHeight + 20) - (20 + 40) - 2 + "px";
        }
      },
      changeEnd(val){
        this.addneeds.addform.endTime = ''
        this.pickerOptions = {}
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() < val
          }
        }
      },
      loadData() {
        this.$maskin()
        this.optionsOn = []
        //初始化当前活动的控制台
        this.tabs.activeName = "info";
        //初始化控制台的可视情况
        this.tabs.consoleWrapperVisible = false;
        this.calculate();
        this.tabs.consoleWrapperVisible = false;
        let params = new URLSearchParams();
        //筛选列表
        params.append('STATE_ID', this.screenKey.STATE);
        if (this.screenKey.START_DATE) {
          params.append('startDate', this.screenKey.START_DATE);
          params.append('endDate', this.screenKey.END_DATE);
        }
        params.append('key', this.keyword);
        this.$axios.post("/daliy/queryAllDaliy", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.setTableData(data.result.daliys);
            this.ifMANAGER_SAVE = data.result.MANAGER_SAVE
            this.ifPRODUCT_SAVE = data.result.PRODUCT_SAVE
            for (let i of data.result.state) {
              this.optionsOn.push(i)
            }
            //判断是否有search跳转到对应的操作台
            if (this.$route.params.neelId && !this.table.hasGo) {
              let id = this.$route.params.neelId;
              for (let i = 0; i < data.result.daliys.length; i++) {
                if (data.result.daliys[i].daliy_NEET_ID == id) {
                  setTimeout(() => {
                    this.tabs.index = i;
                    this.$refs.rcrw_table.setCurrentRow(data.result.daliys[i]);
                    this.handleCurrentChange(data.result.daliys[i]);
                    this.table.hasGo = true
                  }, 0)
                  break;
                }
              }
              return;
            }
          } else {
            this.$warn(data.message);
          }
          this.$maskoff()
        })
      },
      tableRowClassName({row, rowIndex}) {
        if (row.daliy_NEET_ID == this.$route.params.neelId) {
          return 'td-current';
        }
        return '';
      },
      selectStatOn() {
        this.screenKey.STATE = '';
        this.screenKey.STATE = this.selectValueOn;
        this.loadData();
      },
      pickDate(value) {
        if (!value) {
          this.screenKey.START_DATE = ""
          this.screenKey.END_DATE = ""
          this.loadData();
          return
        }
        this.screenKey.START_DATE = '';
        this.screenKey.END_DATE = '';
        this.screenKey.START_DATE = value[0];
        this.screenKey.END_DATE = value[1];
        this.loadData();
      },
      //点击表格列表展示控制台
      handleCurrentChange(val) {
        this.$maskin();
        //全程跟踪视图模式
        this.tracking.trackingvisiible = false;
        this.innitFrom()
        //this.tabs.activeName = "info";
        this.clearData()
        this.tabs.activeTableInfo = val;
        if (!this.tabs.consoleWrapperVisible) {
          this.tabs.consoleWrapperVisible = true;
          setTimeout(() => {
            this.calculate()
          }, 0);
        }
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
        this.handle.daliy_NEET_ID = val.daliy_NEET_ID //赋值主键
        this.tabs.ifConsole = ''
        this.tabs.ifAssign = ''
        this.tabs.ifSplit = ''
        this.tabs.ifEdit = ''
        this.tabs.ifPing = ''
        this.popup.popTxt.fileList = [];
        this.$axios.post("/daliy/queryDaliyMessage", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$set(this.tabs, "data_one", data.result);
            this.tabs.state_NAME = data.result.daliy.state_NAME
            this.tabs.user_NAME = data.result.daliy.send_NAME
            this.tabs.ifConsole = data.result.confirm
            this.tabs.ifAssign = data.result.assign
            this.tabs.ifSplit = data.result.split
            this.tabs.ifEdit = data.result.EDIT
            this.tabs.ifPing = data.result.checkDaliy
            this.tabs.ifReject = data.result.REJECT
            this.tabs.daliy_NEET_ID = data.result.daliy.daliy_NEET_ID
            // console.log(this.tabs.daliy_NEET_ID)
            this.tabs.review_GRADE = data.result.daliy.review_GRADE_NAME;//评审等级
            this.$set(this.tabs, "rriorityArr", data.result.rriority);
            this.$set(this.tabs, "checksArr", data.result.checks);
            this.$set(this.tabs, "genzong", data.result.records);
            this.$set(this.tabs, "genzongs", data.result.records);
            this.$set(this.tabs, "chooseDeptArr", data.result.deptRecord);
            this.$set(this.addneeds.addform.splitForm, "splitAnalysis", data.result.deptSystem);
            this.consoleAction() //控制台按钮展示
            this.getSplit() //获取分配默认值
            let self = this
            var t = setTimeout(function () {
              self.setBrInfo(document.querySelector(".task_DESCRIPTION"), data.result.daliy.task_DESCRIPTION);
              self.setBrInfo(document.querySelector(".prduct_FUNCTION"), data.result.daliy.prduct_FUNCTION);
            }, 500)
          } else {
            this.$warn(data.message);
          }
          this.$maskoff()
        })
      },
      setBrInfo(dom, info){
        dom.innerHTML = "";
        dom.insertAdjacentHTML("beforeend", info);
      },
      //编辑产品经理建立的需求初始化数值
      proEdit() {
        let all = this.tabs.data_one.daliy
        this.addneeds.addform.code = all.daliy_NEET_ID
        this.addneeds.addform.sxname = all.user_NAME
        this.addneeds.addform.name = all.task_NAME
        this.addneeds.addform.jihuadate = new Date(Date.parse(all.end_DATE_STRING.replace(/-/g, "/")))
        this.addneeds.addform.applyDate = new Date(Date.parse(all.start_DATE.replace(/-/g, "/")))
        this.addneeds.addform.needsname = all.task_DESCRIPTION
        this.addneeds.addform.level = all.rriority
        this.addneeds.addform.ascription = all.ascription
        this.addneeds.addform.daliyTypeName = all.type
        this.addneeds.addform.result = all.result
        this.addneeds.addform.influece = all.influece
        this.addneeds.addform.prduct_function = all.prduct_FUNCTION
        this.addneeds.addform.prduct_line = all.prduct_LINE
        this.addneeds.addform.zhongyaochegndu = all.importance
        this.addneeds.addform.jiajireason = all.ugent
        if (all.ugent && all.ugent != "null") {
          this.addneeds.addform.jiaji = "1"
        } else {
          this.addneeds.addform.jiaji = "0"
          this.addneeds.addform.jiajireason = ''
        }
        this.addneeds.addform.fromdeptId = all.task_SOURCE.split('-')[0]
        this.addneeds.addform.fromdeptroleId = all.task_SOURCE.split('-')[1]
      },
      //拆分列表初始化
      getSplit() {
        this.$maskin();
        let params = new URLSearchParams();
        this.$axios.post("/daliy/saveInfoFront", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            //任务编号
            this.addneeds.addform.code = data.result.DALIY_NEET_ID
            this.$set(this.addneeds.addform, "systemArr", data.result.system)
            //本部门人员
            this.$set(this.addneeds.addform, "pepoleArr", data.result.deptUser.users)
            //难易程度
            this.$set(this.addneeds.addform, "easyArr", data.result.facility);
            //需求划分归属
            this.$set(this.addneeds.addform, "ascriptionArr", data.result.ascription);
            //需求类型
            this.$set(this.addneeds.addform, "daliyTypeNameArr", data.result.daliyTypeName);
            //影响面
            this.$set(this.addneeds.addform, "influeceArr", data.result.influece);
            //成果类型
            this.$set(this.addneeds.addform, "resultArr", data.result.result);
            //需求分析结果
            this.$set(this.addneeds.addform, "analysisArr", data.result.analysis);
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //控制台数据二次刷新
      handleCurrentChange2(val) {
        this.$maskin();
        this.clearData()
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', val);
        this.tabs.ifConsole = ''
        this.tabs.ifAssign = ''
        this.tabs.ifSplit = ''
        this.tabs.ifEdit = ''
        this.tabs.ifPing = ''
        this.popup.popTxt.fileList = []
        this.$axios.post("/daliy/queryDaliyMessage", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$set(this.tabs, "data_one", data.result);
            this.tabs.state_NAME = data.result.daliy.state_NAME
            this.tabs.user_NAME = data.result.daliy.send_NAME
            this.tabs.ifConsole = data.result.confirm
            this.tabs.ifAssign = data.result.assign
            this.tabs.ifSplit = data.result.split
            this.tabs.ifEdit = data.result.EDIT
            this.tabs.ifPing = data.result.checkDaliy
            this.tabs.review_GRADE = data.result.daliy.review_GRADE_NAME;//评审等级
            this.$set(this.tabs, "genzong", data.result.records);
            this.$set(this.tabs, "genzongs", data.result.records);
            this.$set(this.tabs, "chooseDeptArr", data.result.deptRecord);
            this.$set(this.addneeds.addform.splitForm, "splitAnalysis", data.result.deptSystem[0]);
            this.consoleAction()
            this.getSplit() //获取分配默认值
            let self = this
            var t = setTimeout(function () {
              self.setBrInfo(document.querySelector(".task_DESCRIPTION"), data.result.daliy.task_DESCRIPTION);
              self.setBrInfo(document.querySelector(".prduct_FUNCTION"), data.result.daliy.prduct_FUNCTION);
            }, 500)
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      mustCheck() {
        //TODO
        let firm = "1"
        if (!this.tabs.rriority) {
          this.$warn("请选择优先级评定");
          firm = "0"
        }
        if (!this.tabs.checks) {
          this.$warn("请选择需求评审结果");
          firm = "0"
        }
        if (!this.addneeds.addform.check_time) {
          this.$warn("请选择评审日期");
          firm = "0"
        }
        if (!this.addneeds.addform.check_name) {
          this.$warn("请填写参会人");
          firm = "0"
        }
        return firm
      },
      checkDaliy() {
        let accept = this.mustCheck()
        if (accept == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          params.append('DALIY_NEET_ID', this.handle.daliy_NEET_ID);
          params.append('CHECK_TYPE', this.tabs.checks.split('-')[1]);
          params.append('CHECK_ID', this.tabs.checks.split('-')[0]);
          params.append('RRIORITY', this.tabs.rriority);
          params.append('CHECK_TIME', this.addneeds.addform.check_time);
          params.append('CHECK_NAME', this.addneeds.addform.check_name);
          this.$axios.post("/daliy/checkDaliy", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.loadData();
              this.tabs.rriority = ''
              this.tabs.checks = ''
              this.addneeds.addform.check_time = ''
              this.addneeds.addform.check_name = ''
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          })
        }
      },
      //控制台action
      consoleAction() {
        this.tabs.consoleActionData = []
        if (this.tabs.ifConsole) {
          if (this.tabs.data_one.daliy.state_ID == 212) {
            this.tabs.consoleActionData.push({
              "key": '1',
              "name": '通过'
            })
          } else if (this.tabs.data_one.daliy.state_ID == 209) {
            this.tabs.consoleActionData.push({
              "key": '2',
              "name": '不通过'
            })
          } else {
            this.tabs.consoleActionData.push({
              "key": '1',
              "name": '通过'
            })
            this.tabs.consoleActionData.push({
              "key": '2',
              "name": '不通过'
            })
          }
        }

        /*      if(this.tabs.ifConsole && this.tabs.data_one.daliy.state_ID!=212) {
         this.tabs.consoleActionData.push({
         "key": '2',
         "name": '不通过'
         })
         }*/
        if (this.tabs.ifAssign) {
          this.tabs.consoleActionData.push({
            "key": '3',
            "name": '确认'
          })
          this.tabs.consoleActionData.push({
            "key": '4',
            "name": '驳回'
          })
        }
        if (this.tabs.ifSplit) {
          //					this.tabs.consoleActionData.push({
          //						"key": '5',
          //						"name": '确认'
          //					})
          this.tabs.consoleActionData.push({
            "key": '6',
            "name": '驳回'
          })
        }
        if (this.tabs.ifEdit) {
          this.tabs.consoleActionData.push({
            "key": '7',
            "name": '编辑'
          })
        }
      },
      //拆分任务点击事件
      splitTaskClick(val) {
        this.$set(this.split, "hasSplitTaskData", []);
        this.addneeds.hasSplitvisible = true;
        this.$set(this.split, "hasSplitTaskData", val.tasks)
      },
      setTableData(data) {
        data.map(item => item.isFast = item.ugent || "否");
        this.$set(this.table, "tableData", data);
        this.$set(this.table, "tableOriginData", data);
      },
      innitFrom() {
        this.$maskin();
        let params = new URLSearchParams();
        this.$axios.post("/daliy/saveDaliyFront", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.addneeds.addform.applyDate = new Date()
            //涉及系统
            this.$set(this.addneeds.addform, "sjxtArr", data.result.firstSystem)
            this.$set(this.addneeds.addform, "systemArr", data.result.system)
            //importance 重要程度
            this.$set(this.addneeds.addform, "zhongyaochegnduArr", data.result.importance)
            //rriority 优先级
            this.$set(this.addneeds.addform, "levelArr", data.result.rriority)
            //任务来源
            this.$set(this.addneeds.addform, "fromdeptArr", data.result.depts)
            //人员
            this.$set(this.addneeds.addform, "frompeopleArr", data.result.codeDepts)
            //难易程度
            this.$set(this.addneeds.addform, "easyArr", data.result.facility);
            //需求划分归属
            this.$set(this.addneeds.addform, "ascriptionArr", data.result.ascription);
            //需求类型
            this.$set(this.addneeds.addform, "daliyTypeNameArr", data.result.daliyTypeName);
            //影响面
            this.$set(this.addneeds.addform, "influeceArr", data.result.influece);
            //成果类型
            this.$set(this.addneeds.addform, "resultArr", data.result.result);
            //需求分析结果
            this.$set(this.addneeds.addform, "analysisArr", data.result.analysis);
            //申请人
            this.addneeds.addform.sxname = data.result.USER_NAME
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //最终建立新项目必填限制
      filterParam() {
        let flag = "1"
        if (!this.addneeds.addform.sjxt || this.addneeds.addform.sjxt.length == 0) {
          this.$warn("请选择涉及系统")
          flag = "0"
        }
        if (!this.addneeds.addform.sxname) {
          this.$warn("请填写申请人")
          flag = "0"
        }
        if (!this.addneeds.addform.name) {
          this.$warn("请填写任务名称")
          flag = "0"
        }
        if (!this.addneeds.addform.needsname) {
          this.$warn("请填写需求描述")
          flag = "0"
        }
        if(!this.addneeds.addform.jihuadate) {
        	this.$warn("请选择期望上线时间")
        	flag = "0"
        }
        if (!this.addneeds.addform.fromdeptId) {
          this.$warn("请选择需求提出部门")
          flag = "0"
        }
        if (!this.addneeds.addform.fromdeptroleId) {
          this.$warn("请选择提出人")
          flag = "0"
        }
        if (!this.addneeds.addform.ascription) {
          this.$warn("请选择需求划分归属")
          flag = "0"
        }
        if (!this.addneeds.addform.daliyTypeName) {
          this.$warn("请选择需求类型")
          flag = "0"
        }
        if (!this.addneeds.addform.result) {
          this.$warn("请选择成果类型")
          flag = "0"
        }
        if (!this.addneeds.addform.influece) {
          this.$warn("请选择需求影响面")
          flag = "0"
        }
        if (!this.addneeds.addform.prduct_function) {
          this.$warn("请填写产品改造点")
          flag = "0"
        }
        if (!this.addneeds.addform.prduct_line) {
          this.$warn("请填写涉及产品线")
          flag = "0"
        }
        if (!this.addneeds.addform.startTime) {
          this.$warn("请选择预计开始时间")
          flag = "0"
        }
        if (!this.addneeds.addform.endTime) {
          this.$warn("请选择预计完成时间")
          flag = "0"
        }
        if (!this.addneeds.addform.analysisTime) {
          this.$warn("请选择分析时间")
          flag = "0"
        }
        if (!this.addneeds.addform.RISK) {
          this.$warn("请填写风险点")
          flag = "0"
        }
        if (!this.addneeds.addform.analysis) {
          this.$warn("请选择需求分析结果")
          flag = "0"
        }
        if (!this.addneeds.addform.level) {
          this.$warn("请选择优先级")
          flag = "0"
        }
        if (!this.addneeds.addform.zhongyaochegndu) {
          this.$warn("请选择重要程度")
          flag = "0"
        }
        if (!this.addneeds.addform.jiaji) {
          this.$warn("请选择是否加急")
          flag = "0"
        }
        if (this.addneeds.addform.jiaji == "1" && !this.addneeds.addform.jiajireason) {
          this.$warn("请填写加急描述")
          flag = "0"
        }
        if (this.addneeds.addform.splitArr.length < 1) {
          this.$warn("请添加拆分")
          flag = "0"
        }
        // if(this.popup.popTxt.fileList.length==0){
        //    this.$warn("请上传附件")
        //    flag = "0"
        // }
        return flag
        //TODO

      },
      createNew() {
        if (this.filterParam() == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          let did = []
          for (let i of this.addneeds.addform.sjxt) {
            did.push(i.split(',')[1])
          }
          params.append("DESIGN_SYSTEM", did); //涉及系统
          params.append("DALIY_NEET_ID", this.addneeds.addform.code); //任务编号
          params.append("USER_NAME", this.addneeds.addform.sxname); //任务申请人
          params.append("TASK_NAME", this.addneeds.addform.name); //任务名称
          params.append("TASK_DESCRIPTION", this.addneeds.addform.needsname); //needsname 需求描述
          params.append("END_DATE", this.addneeds.addform.jihuadate); //期望上线时间
          params.append("NEW_DATE", this.addneeds.addform.applyDate); //申请时间
          params.append("TASK_SOURCE", (this.addneeds.addform.fromdeptId).split('-')[1] + '-' + this.addneeds.addform.fromdeptroleId); //任务来源 fromdeptId fromdeptroleId

          params.append("ASCRIPTION", this.addneeds.addform.ascription); //需求划分归属
          params.append("TYPE", this.addneeds.addform.daliyTypeName); //日常任务 需求类型
          params.append("RESULT", this.addneeds.addform.result); //成果类型
          params.append("INFLUECE", this.addneeds.addform.influece); //需求影响面

          params.append("PRDUCT_FUNCTION", this.addneeds.addform.prduct_function); //产品改造点
          params.append("PRDUCT_LINE", this.addneeds.addform.prduct_line); // 涉及产品线

          params.append("startTime", this.addneeds.addform.startTime); // 预计开始时间
          params.append("endTime", this.addneeds.addform.endTime); // 预计完成时间
          params.append("analysisTime", this.addneeds.addform.analysisTime); // 分析时间
          params.append("RISK", this.addneeds.addform.RISK); //  风险点

          params.append("ANA_RESULT", this.addneeds.addform.analysis); //  需求分析结果

          params.append("RRIORITY", this.addneeds.addform.level); //优先级
          params.append("IMPORTANCE", this.addneeds.addform.zhongyaochegndu); //重要程度
          params.append("UGENT", this.addneeds.addform.jiajireason); //加急描述
          params.append("infos", JSON.stringify(this.addneeds.addform.splitArr)); //拆分
          params.append("attachmentId", this.popup.popTxt.fileList); //附件
          this.$axios.post("/daliy/technologyAdd", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.closeDialog()
              this.loadData()
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          })
        }

      },
      //控制台拆分
      createNewNFilter() {
        let flag = "1"

        if (!this.addneeds.addform.startTime) {
          this.$warn("请选择预计开始时间")
          flag = "0"
        }
        if (!this.addneeds.addform.endTime) {
          this.$warn("请选择预计完成时间")
          flag = "0"
        }
        if (!this.addneeds.addform.analysisTime) {
          this.$warn("请选择分析时间")
          flag = "0"
        }
        if (!this.addneeds.addform.RISK) {
          this.$warn("请填写风险点")
          flag = "0"
        }
        if (!this.addneeds.addform.analysis) {
          this.$warn("请选择需求分析结果")
          flag = "0"
        }
        if (this.addneeds.addform.splitArr.length < 1) {
          this.$warn("请添加拆分")
          flag = "0"
        }

        return flag
        //TODO
      },
      createNewN() {
        if (this.createNewNFilter() == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          params.append("DALIY_NEET_ID", this.handle.daliy_NEET_ID); //任务编号
          params.append("startTime", this.addneeds.addform.startTime); // 预计开始时间
          params.append("endTime", this.addneeds.addform.endTime); // 预计完成时间
          params.append("analysisTime", this.addneeds.addform.analysisTime); // 分析时间
          params.append("RISK", this.addneeds.addform.RISK); //  风险点
          params.append("ANA_RESULT", this.addneeds.addform.analysis); //  需求分析结果
          params.append("infos", JSON.stringify(this.addneeds.addform.splitArr)); //拆分
          this.$axios.post("/daliy/managerSplit", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.loadData()
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          })
        }
      },
      proFilter() {
        let flag = "1"
        if (!this.addneeds.addform.sxname) {
          this.$warn("请填写申请人")
          flag = "0"
        }
        if (!this.addneeds.addform.name) {
          this.$warn("请填写任务名称")
          flag = "0"
        }
        if (!this.addneeds.addform.needsname) {
          this.$warn("请填写需求描述")
          flag = "0"
        }
        if(!this.addneeds.addform.jihuadate) {
        	this.$warn("请选择期望上线时间")
        	flag = "0"
        }
        if (!this.addneeds.addform.fromdeptId) {
          this.$warn("请选择需求提出部门")
          flag = "0"
        }
        if (!this.addneeds.addform.fromdeptroleId) {
          this.$warn("请选择提出人")
          flag = "0"
        }
        if (!this.addneeds.addform.ascription) {
          this.$warn("请选择需求划分归属")
          flag = "0"
        }
        if (!this.addneeds.addform.daliyTypeName) {
          this.$warn("请选择需求类型")
          flag = "0"
        }
        if (!this.addneeds.addform.result) {
          this.$warn("请选择成果类型")
          flag = "0"
        }
        if (!this.addneeds.addform.influece) {
          this.$warn("请选择需求影响面")
          flag = "0"
        }
        if (!this.addneeds.addform.prduct_function) {
          this.$warn("请填写产品改造点")
          flag = "0"
        }
        if (!this.addneeds.addform.prduct_line) {
          this.$warn("请填写涉及产品线")
          flag = "0"
        }
        //				if(!this.addneeds.addform.analysis){
        //					this.$warn("请选择需求分析结果")
        //					return
        //				}
        if (!this.addneeds.addform.level) {
          this.$warn("请选择优先级")
          flag = "0"
        }
        if (!this.addneeds.addform.zhongyaochegndu) {
          this.$warn("请选择重要程度")
          flag = "0"
        }
        if (!this.addneeds.addform.jiaji) {
          this.$warn("请选择是否加急")
          flag = "0"
        }
        if (this.addneeds.addform.jiaji == "1" && !this.addneeds.addform.jiajireason) {
          this.$warn("请填写加急描述")
          flag = "0"
        }
        return flag
        //TODO
      },
      //产品经理新建任务
      createNew2() {
        if (this.proFilter() == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          params.append("DALIY_NEET_ID", this.addneeds.addform.code); //任务编号
          params.append("USER_NAME", this.addneeds.addform.sxname); //任务申请人
          params.append("TASK_NAME", this.addneeds.addform.name); //任务名称
          params.append("TASK_DESCRIPTION", this.addneeds.addform.needsname); //needsname 需求描述
          params.append("END_DATE", this.addneeds.addform.jihuadate); //期望上线时间
          params.append("NEW_DATE", this.addneeds.addform.applyDate); //期望上线时间
          if ((this.addneeds.addform.fromdeptId).split('-').length > 1) {
            params.append("TASK_SOURCE", (this.addneeds.addform.fromdeptId).split('-')[1] + '-' + this.addneeds.addform.fromdeptroleId); //任务来源 fromdeptId fromdeptroleId
          } else {
            params.append("TASK_SOURCE", this.addneeds.addform.fromdeptId + '-' + this.addneeds.addform.fromdeptroleId); //任务来源 fromdeptId fromdeptroleId
          }

          params.append("RRIORITY", this.addneeds.addform.level); //优先级

          params.append("ASCRIPTION", this.addneeds.addform.ascription); //需求划分归属
          params.append("TYPE", this.addneeds.addform.daliyTypeName); //日常任务 需求类型
          params.append("RESULT", this.addneeds.addform.result); //成果类型
          params.append("INFLUECE", this.addneeds.addform.influece); //需求影响面

          params.append("PRDUCT_FUNCTION", this.addneeds.addform.prduct_function); //产品改造点
          params.append("PRDUCT_LINE", this.addneeds.addform.prduct_line); // 涉及产品线

          //				params.append("ANA_RESULT", this.addneeds.addform.analysis); //  需求分析结果

          params.append("IMPORTANCE", this.addneeds.addform.zhongyaochegndu); //重要程度
          params.append("UGENT", this.addneeds.addform.jiajireason); //加急描述
          params.append("EDIT", this.addneeds.addform.ifcanEdit);
          if (this.tabs.ifcanEdit == '0') {
            this.$axios.post("/daliy/productAdd", params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.closeDialog()
                this.loadData()
              } else {
                this.$warn(data.message);
              }
              this.$maskoff();
            })
          } else {
            this.$axios.post("/daliy/updateDaliy", params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.closeDialog()
                this.loadData()
              } else {
                this.$warn(data.message);
              }
              this.$maskoff();
            })
          }

        }
      },
      //新建任务技术经理
      newneeds() {
        this.addneeds.addvisible = true;
        let params = new URLSearchParams;
        this.$axios.post("/daliy/getNo", params).then((res) => {
          let data = res.data;
          console.log(data);
          if(data.code == 200){
            //任务编号
            if (!this.addneeds.addform.code) {
              this.addneeds.addform.code = data.result.DALIY_NEET_ID
            }
          }
        });
        this.clearData()
        this.loadData()
        this.innitFrom()
      },
      //新建任务产品经理
      newneedsP() {
        let params = new URLSearchParams;
        this.$axios.post("/daliy/getNo", params).then((res) => {
          let data = res.data;
          console.log(data);
          if(data.code == 200){
            //任务编号
            if (!this.addneeds.addform.code) {
              this.addneeds.addform.code = data.result.DALIY_NEET_ID
            }
          }
        });
        this.addneeds.addvisibleP = true;
        this.clearData()
        this.loadData()
        this.innitFrom()
      },
      //产品经理编辑任务
      newneedsP2() {
        this.addneeds.addvisibleP = true;
        this.clearData()
        this.loadData()
        this.innitFrom()
        this.proEdit()
      },
      //拆分任务版本拼接
      distributionTask() {
        if (this.addneeds.addform.sjxt.length == 0) {
          this.$warn("请选择涉及系统")
        } else {
          let params = new URLSearchParams();
          this.addneeds.addvisible = false
          this.addneeds.splitaddvisible = true
          let ids = []
          for (let i of this.addneeds.addform.sjxt) {
            ids.push(i.split(',')[0])
          }
          params.append("ids", ids);
          this.$axios.post("/daliy/querySystemById", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$set(this.addneeds.addform.splitForm, "fzmoduleArr", data.result);
            } else {

            }

          })
        }


      },
      //控制台拆分任务
      distributionTask1() {
        if (this.addneeds.addform.sjxt.length == 0) {
          this.$warn("请选择涉及系统")
        } else {
          let params = new URLSearchParams();
          this.addneeds.addvisible = false
          this.addneeds.splitaddvisibleN = true

          let ids = []
          for (let i of this.addneeds.addform.sjxt) {
            ids.push(i.split(',')[0])
          }
          params.append("ids", ids);
          this.$axios.post("/daliy/querySystemById", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$set(this.addneeds.addform.splitForm, "fzmoduleArr", data.result);
            } else {

            }

          })
        }

      },
      //分配任务搜索功能
      assignSearch() {
        let keyword = this.assign.keyword;
        let type;
        if (this.assign.left) {
          type = "left"
        } else {
          type = "right"
        }
        //搜索关键字判断
        if (keyword == "") {
          //为空
          this.assign.leftSearch = false;
          this.$set(this.assign, "searchData", type == "left" ? this.assign.leftlistdata : this.assign.rightlistdata)
        } else {
          //不为空
          let arr = [];
          if (type == "left") {
            for (let i of this.assign.leftlistdata) {
              for (let j of i.users) {
                if (j.user_NAME.indexOf(keyword) >= 0) {
                  arr.push(j)
                }
              }
            }
            this.assign.leftSearch = true;
          } else {
            for (let i of this.assign.rightlistdata) {
              if (i.user_NAME.indexOf(keyword) >= 0) {
                arr.push(i)
              }
            }
          }
          this.$set(this.assign, "searchData", arr);
        }
      },
      //添加一行拆分任务必填控制
      addOneFilter() {
        this.addOneTaskSuccess = true
        if (!this.addneeds.addform.splitForm.name) {
          this.$warn("请选择人员")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.xtname) {
          this.$warn("请选择系统名")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.fzmodule) {
          this.$warn("请填写负责模块")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.easy) {
          this.$warn("请选择难易程度")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.allDate) {
          this.$warn("请选择完成日期")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.willTime) {
          this.$warn("请填写预计用时")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.willTime.match(/^[0-9]*$/)) {
          this.$warn("预计用时请填写纯数字")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.taskNum) {
          this.$warn("请填写任务量")
          this.addOneTaskSuccess = false
        }

        //TODO
      },
      //添加一行拆分任务
      addOneTask() {
        this.addOneFilter()
        if (this.addOneTaskSuccess) {
          let finish = this.$format(new Date(this.addneeds.addform.splitForm.allDate));
          let obj = {
            "USER_NAME": (this.addneeds.addform.splitForm.name).split(',')[1],
            "USER_ID": (this.addneeds.addform.splitForm.name).split(',')[0],
            "xtname": (this.addneeds.addform.splitForm.xtname),
            "SYSTEM_NAME": (this.addneeds.addform.splitForm.xtname),
            "fzmk": this.addneeds.addform.splitForm.fzmodule,
            "RESPONSIBLE_MODULE": this.addneeds.addform.splitForm.fzmodule,
            "easy": (this.addneeds.addform.splitForm.easy).split(',')[1],
            "FACILITY_ID": (this.addneeds.addform.splitForm.easy).split(',')[0],
            "finishDate": `${finish.year}-${finish.mouth}-${finish.day}`,
            "END_DATE": this.addneeds.addform.splitForm.allDate,
            "willTime": this.addneeds.addform.splitForm.willTime,
            "EXPECT_TIME": this.addneeds.addform.splitForm.willTime,
            "WORKLOAD": this.addneeds.addform.splitForm.taskNum,
            "taskNum": this.addneeds.addform.splitForm.taskNum
          }
          this.addneeds.addform.splitArr.push(obj)
          this.closeDialogS()
        }

      },
      //控制台拆分组数据
      addOneTask1() {
        this.addOneFilter()
        if (this.addOneTaskSuccess) {
          let finish = this.$format(new Date(this.addneeds.addform.splitForm.allDate));
          let obj = {
            "USER_NAME": (this.addneeds.addform.splitForm.name).split(',')[1],
            "USER_ID": (this.addneeds.addform.splitForm.name).split(',')[0],
            "xtname": (this.addneeds.addform.splitForm.xtname),
            "SYSTEM_NAME": (this.addneeds.addform.splitForm.xtname),
            "fzmk": this.addneeds.addform.splitForm.fzmodule,
            "RESPONSIBLE_MODULE": this.addneeds.addform.splitForm.fzmodule,
            "easy": (this.addneeds.addform.splitForm.easy).split(',')[1],
            "FACILITY_ID": (this.addneeds.addform.splitForm.easy).split(',')[0],
            "finishDate": `${finish.year}-${finish.mouth}-${finish.day}`,
            "END_DATE": this.addneeds.addform.splitForm.allDate,
            "willTime": this.addneeds.addform.splitForm.willTime,
            "EXPECT_TIME": this.addneeds.addform.splitForm.willTime,
            "WORKLOAD": this.addneeds.addform.splitForm.taskNum,
            "taskNum": this.addneeds.addform.splitForm.taskNum
          }
          this.addneeds.addform.splitArr.push(obj)
          this.addneeds.splitaddvisibleN = false;
          for (var name in this.addneeds.addform.splitForm) {
            this.addneeds.addform.splitForm[name] = ""
          }
        }
      },
      //新需求来源二级联动
      fromdeptchange(val) {
        this.addneeds.addform.fromdeptroleArr = [];
        this.addneeds.addform.fromdeptroleId = "";
        let deptroleArr = [];
        for (let i of this.addneeds.addform.fromdeptArr) {
          if (val.split('-')[0] == i.dept_id) {
            for (let j of i.users) {
              let obj = {
                "user_NAME": j.user_NAME,
                "user_ID": j.user_ID
              };
              deptroleArr.push(obj)
            }
          }
        }
        this.$set(this.addneeds.addform, "fromdeptroleArr", deptroleArr);
      },
      //-----------------------------------加载视图模式数据
      loadtrack(){
        this.tracking.trackingvisiible ? this.tracking.trackingvisiible = false :
          this.tracking.trackingvisiible = true
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', this.handle.daliy_NEET_ID);
        this.$axios.post("/daliy/queryView", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let res = data.result;
            let arr = [];
            let infos = [];
            for (let i of res) {
              if (i.view_DESC) {
                i.view_DESC = i.view_DESC.split(",");
              }
              arr.push(i)
            }
            this.$set(this.tracking, "data", arr);
            //                        this.tracking.trackingvisiible = true;
          }
        });
      },
      closeDialog() {
        this.addneeds.addvisible = false; //新建项目的弹窗
        this.addneeds.splitaddvisible = false; //拆分任务弹窗
        this.addneeds.splitaddvisibleN = false;
        this.addneeds.addvisibleP = false
        this.assign.assignvisible = false
        this.addneeds.hasSplitvisible = false
        this.tabs.ifEdit = ''
        this.addneeds.addform.code = ''
        this.tabs.ifcanEdit = '0'
        this.tracking.trackingvisiible = false;//全程跟踪视图模式的弹窗
      },
      clearData() {
        this.tabs.chooseDept = ''
        this.addneeds.addform.sjxt = []
        this.addneeds.addform.name = ''
        this.addneeds.addform.jihuadate = ''
        this.addneeds.addform.applyDate = ''
        this.addneeds.addform.ascription = ''
        this.addneeds.addform.daliyTypeName = ''
        this.addneeds.addform.result = ''
        this.addneeds.addform.influece = ''
        this.addneeds.addform.prduct_function = ''
        this.addneeds.addform.prduct_line = ''
        this.addneeds.addform.fromdeptId = ''
        this.addneeds.addform.fromdeptroleId = ''
        this.addneeds.addform.needsname = ''
        this.addneeds.addform.level = ''
        this.addneeds.addform.analysis = ''
        this.addneeds.addform.startTime = ''
        this.addneeds.addform.endTime = ''
        this.addneeds.addform.analysisTime = ''
        this.addneeds.addform.RISK = ''
        this.addneeds.addform.jiaji = ''
        this.addneeds.addform.jiajireason = ''
        this.addneeds.addform.zhongyaochegndu = ''
        this.addneeds.addform.onlineContent = [{
          "xtname": '',
          "ban": ''
        }]
        this.addneeds.addform.splitArr = []
        this.popup.popTxt.uploadFiles = []
      },
      closeDialogS() {
        this.addneeds.splitaddvisible = false; //拆分任务弹窗
        this.addneeds.splitaddvisibleN = false; //拆分任务弹窗
        if (!this.tabs.consoleWrapperVisible) {
          this.addneeds.addvisible = true; //新建项目的弹窗
          this.addOneTaskSuccess = false
        }
        for (var name in this.addneeds.addform.splitForm) {
          this.addneeds.addform.splitForm[name] = ""
        }
      },
      //新增涉及系统
      systemEvent(index, e) {
        let className = e.target.className;
        if (className == "el-icon-plus") {
          //当期是新增操作
          if (this.addneeds.addform.onlineContent[index].xtname == "") {
            this.$warn("请选择系统");
            return;
          }
          if (this.addneeds.addform.onlineContent[index].ban == "") {
            this.$warn("请填写版本号");
            return;
          }
          if (this.addneeds.addform.onlineContent[index].ban.indexOf("v") < 0) {
            this.$warn("版本号格式有误");
            return;
          }
          this.addneeds.addform.onlineContent.push({
            "xtname": '',
            "ban": ''
          })
        } else {
          //当前是删除操作
          this.addneeds.addform.onlineContent.splice(index, 1)
        }
      },
      pickDate(value) {
        this.screenKey.START_DATE = value[0];
        this.screenKey.END_DATE = value[1];
        this.loadData();
      },
      //确认
      agreeRow(val, e) {
        e.cancelBubble = true;
        this.$maskin();
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
        this.$axios.post("/daliy/daliyCheck", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success(data.message);
            this.loadData();
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //通过
      agreeRow1(val, e) {
        e.cancelBubble = true;
        let params = new URLSearchParams();
        if (this.tabs.data_one.daliy.state_ID == 212) {
          let self = this
          let text = "通过"
          this.$prompt('确定进行' + text + '操作？', '请填写' + text + '理由', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /[\S]/,
            inputErrorMessage: '' + text + '理由不能为空'
          }).then(({
            value
          }) => {

            this.$maskin();
            let params = new URLSearchParams();
            params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
            params.append('REJECT_RESON', value);
            this.$axios.post("/daliy/daliyConfrim", params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.$success(data.message);
                this.loadData();
              } else {
                this.$warn(data.message);
              }
              this.$maskoff();
            });
          }).catch(() => {

          });
        } else {
          this.$maskin();
          params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
          this.$axios.post("/daliy/daliyConfrim", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.loadData();
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          })
        }

      },
      //分配
      assignRow(val, e) {
        e.cancelBubble = true;
        this.$maskin();
        this.assign.eyword = "";
        this.assign.chooseId = ""
        this.assign.checkList = [];
        this.assign.assignvisible = true;
        let params = new URLSearchParams();
        this.$axios.post("/daliy/queryDeptUser", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$set(this.assign, "searchData", data.result.allDept);
            this.$set(this.assign, "leftlistdata", data.result.allDept);
            if (data.result.dept) {
              this.$set(this.assign, "rightlistdata", data.result.dept.users);
            }
            this.assign.chooseId = val.daliy_NEET_ID
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //提交分配任务
      subAssign() {
        let result = this.assign.checkList;
        if (result.length == 0) {
          this.$warn("当前没有选择任何人员");
        } else {
          let temp = [];
          let idArr = [];
          let nameArr = [];
          for (let i of result) {
            temp.push(i.split("-"))
          }
          for (let i of temp) {
            idArr.push(i[0]);
            nameArr.push(i[1]);
          }

          this.$maskin();
          let info = this.tabs.activeTableInfo;
          let params = new URLSearchParams();
          params.append("names", nameArr);
          params.append("ids", idArr);
          params.append("DALIY_NEET_ID", this.assign.chooseId);
          this.$axios.post("/daliy/assignManager", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.assign.assignvisible = false;
              this.$success("操作成功");
              this.loadData();
              this.calculate();
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          })
        }
      },
      //打开需求平时你
      review(val, e) {
        //				e.cancelBubble = true;
        this.tabs.activeName = "console";
        this.clearData()
        this.tabs.activeTableInfo = val;
        if (!this.tabs.consoleWrapperVisible) {
          this.tabs.consoleWrapperVisible = true;
          setTimeout(() => {
            this.calculate()
          }, 0);
        }
      },
      //不通过
      unagreeRow1(val, e, text) {
        e.cancelBubble = true;
        let self = this
        this.$prompt('确定进行' + text + '操作？', '请填写' + text + '理由', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\S]/,
          inputErrorMessage: '' + text + '理由不能为空'
        }).then(({
          value
        }) => {
          this.$maskin();
          let params = new URLSearchParams();
          params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
          params.append('REJECT_RESON', value);
          this.$axios.post("/daliy/daliyReject", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.loadData();
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          });
        }).catch(() => {

        });
      },
      //驳回
      unagreeRow(val, e, text) {
        e.cancelBubble = true;
        let self = this
        this.$prompt('确定进行' + text + '操作？', '请填写' + text + '理由', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\S]/,
          inputErrorMessage: '' + text + '理由不能为空'
        }).then(({
          value
        }) => {
          this.$maskin();
          let params = new URLSearchParams();
          params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
          params.append('REJECT_RESON', value);
          this.$axios.post("/daliy/daliyCheck", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.loadData();
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          });
        }).catch(() => {

        });
      },
      // 开始任务startTask
      startTask(val, e) {
        e.cancelBubble = true;
        this.$maskin();
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', this.handle.daliy_NEET_ID);
        params.append('DALIY_INFO_ID', val.daliy_INFO_ID);
        this.$axios.post("/daliy/codeStart", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success(data.message);
            this.handleCurrentChange2(this.handle.daliy_NEET_ID)
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })

      },
      //完成任务 finishTask
      finishTask(val, e) {
        e.cancelBubble = true;
        this.$maskin();
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', this.handle.daliy_NEET_ID);
        params.append('DALIY_INFO_ID', val.daliy_INFO_ID);
        this.$axios.post("/daliy/codeEnd", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success(data.message);
            this.loadData()
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //搜索关键字
      chooseDeptF(value) {
        let arr = []
        if (value) {
          for (let i of this.tabs.genzongs) {
            if (value == i.dept_ID) {
              arr.push(i)
            }
          }
          this.$set(this.tabs, "genzong", arr)
        } else {
          this.$set(this.tabs, "genzong", this.tabs.genzongs)
        }
      },
      searchKeyword() {
        this.loadData()
      },
      //操作台的事件
      consoleActionEvent(val) {
        switch (val.key) {
          case "1":
            this.agreeRow1(this.handle, event)
            break;
          case "2":
            this.unagreeRow1(this.handle, event, '不通过')
            break;
          case "3":
            this.assignRow(this.handle, event)
            break;
          case "4":
            this.unagreeRow(this.handle, event, '驳回')
            break;
          case "5":
            this.createNewN()
            break;
          case "6":
            this.unagreeRow(this.handle, event, '驳回')
            break;
          case "7":
            this.tabs.ifcanEdit = "1"
            this.newneedsP2()
            break;
        }
        this.tabs.consoleActionVisible = false;
      },
      setConsoleVisible() {
        this.tabs.consoleWrapperVisible = false;
        this.calculateTableHeight(false)
      },
      //拆分任务时间过滤器
      splitDataFormatter(row, col) {
        let date = this.$format(row.end_DATE);
        return `${date.year}-${date.mouth}-${date.day}`
      },
      getFile(e) {
        //上传附件
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        };
        let params = new FormData();
        params.append("token", localStorage.getItem("token"))
        params.append("DALIY_NEET_ID", this.handle.daliy_NEET_ID)
        params.append("file", e.target.files[0]);
        this.$axios.post("/daliy/upload", params, config).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            if (typeof this.popup.popTxt.uploadFiles == "string") {
              this.$set(this.popup.popTxt, "uploadFiles", [])
              this.$set(this.popup.popTxt, "fileList", [])
            }
            this.popup.popTxt.uploadFiles.push(data.name)
            this.popup.popTxt.fileList.push(data.id)
          } else {
            this.$warn(data.message);
          }
        })
      },
      getFile2(e) {
        //上传需求文档
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        };
        if (!e.target.files[0]) {
          return;
        }
        let params = new FormData();
        params.append("file", e.target.files[0]);
        params.append("token", localStorage.getItem("token"));
        this.$axios.post("/daliy/uploadNell", params, config).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            if (typeof this.popup.popTxt.uploadFiles == "string") {
              this.$set(this.popup.popTxt, "uploadFiles", [])
              this.$set(this.popup.popTxt, "fileList", [])
            }
            this.popup.popTxt.uploadFiles.push(data.result.name)
            this.popup.popTxt.fileList.push(data.result.id)
          } else {
            this.$warn(data.message);
          }
        })
      },
      //下载文件弹窗
      showDownLoadData(title){
        let type = "";
        if (title == "开发手册") {
          type = "CODE";
        }
        if (title == "需求文档") {
          type = "NELL";
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("DALIY_NEET_ID", this.handle.daliy_NEET_ID);
        params.append("TYPE", type);
        this.$axios.post("/daliy/queryFileByType", params).then((res) => {
          let data = res.data;
          if (data.code = 200) {
            this.$set(this.download, "data", data.result);
            this.download.title = title;
            this.download.visible = true;
            this.$maskoff();
          }
        });
      },
      //上传测试报告和用例模板
      startUpload(type){
        this.$set(this.uploadAction, "uploadFiles", []);
        this.$set(this.uploadAction, "fileIds", []);
        this.uploadAction.neel_id = this.handle.daliy_NEET_ID;
        this.uploadAction.type = type;
        this.uploadAction.uploadvisible = true;
      },
      setValue_needsname(data){
        this.addneeds.addform.needsname = data
      },
      setValue_changepoint(data){
        this.addneeds.addform.prduct_function = data
      },
      //下载附件
      downfile(val) {
        this.$axios.get(`/daliy/download?ID=${val}&token=${localStorage.getItem("token")}`)
      },
      tabClick(val) {
        this.calculateTabsHeight();
        // if(val.name=="realtime"){
        // 	let datashow=this.tabs.data_one.nowTimeList
        // 	let yaxis=[]
        // 	let startTime=[]
        // 	let nowTime=[]
        // 	let endTime=[]
        // 	for(let i of datashow){
        // 		yaxis.push(i.deptName)
        // 		startTime.push(new Date(i.startTime))
        // 		nowTime.push(new Date(i.date))
        // 		endTime.push(new Date(i.endTime))
        // 	}
        // 	this.realTime(yaxis,startTime,nowTime,endTime)
        // }
      },
      realTime(yaxis, startTime, nowTime, endTime) {
        var echarts = require('echarts');
        var proBar = echarts.init(document.getElementById("system")); //实时统计
        proBar.clear()
        let option = {}
        option = {
          legend: {
            data: ['实时统计']
          },
          xAxis: {
            type: 'time'
          },

          yAxis: {
            data: yaxis
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              var res = params[0].name + "</br>"
              var date0 = params[0].data;
              var date1 = params[1].data;
              date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
              date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
              res += params[0].seriesName + ":" + date0 + "</br>"
              res += params[1].seriesName + ":" + date1 + "</br>"
              return res;
            }
          },
          series: [

            {
              name: '开始时间',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)',
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                }
              },
              data: startTime
            }, {
              name: '结束时间',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: '#52b4f7',
                  barBorderRadius: 20,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                  shadowBlur: 20
                }
              },
              data: endTime
            },
            {
              name: '结束时间',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  color: 'red',
                  shadowColor: 'rgba(255, 255, 255, 0.3)',
                }
              },
              data: nowTime
            }, {
              name: '时间',
              type: 'bar',
              stack: '总量',
//							barWidth : 15,
              itemStyle: {
                normal: {
                  color: 'red',
                  barBorderRadius: 20,
                  shadowColor: 'rgba(255, 255, 255, 0.3)',
                  shadowBlur: 20
                }
              },
              data: endTime
            }
          ]
        };
        proBar.setOption(option);
      }
    }
  }
</script>
<style lang="less">
@import '../needs.less';
</style>
<style scoped>
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

  .el-table td,
  .el-table th {
    padding: 5px 0;
  }

  .el-button {
    padding: 6px 10px;
  }

  .console-tab-content .add {
    position: absolute;
    font-size: 20px;
    height: 20px;
    cursor: pointer;
    top: 0;
    bottom: 0;
    right: 5px;
    margin: auto;
  }

  .addCol {
    position: relative;
    padding: 0 30px 0 0 !important;
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

  .assgin-dialog .tab span.active {
    color: dodgerblue;
  }

  /*.assign-wrapper {*/
  /*height: 300px;*/
  /*overflow-y: auto;*/
  /*}*/

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

  .el-form-item__label {
    width: 120px !important;
  }
</style>
