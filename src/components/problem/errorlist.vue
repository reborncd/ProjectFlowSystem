<template>
  <div class="rolelist common-card-wrap" style="height: 100%;position:relative;"
       @click="$event.target.className == 'icon-more iconfont'?'':tabs.consoleActionVisible = false">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <p class="card-title por">
          <!--<span class="back fl clear" @click="errorVisible = !errorVsetTableDataisible" v-if="errorVisible">-->
          <span class="back fl clear" v-if="errorVisible" @click="backPage">
                        <i class="el-icon-arrow-left"></i>
                        <i class="b">返回</i></span>
          {{!errorVisible?'故障清单':'故障提交单'}}
        </p>
      </div>
      <div class="text item">
        <div class="content" v-if="!errorVisible">
          <div class="action clear">
            <el-button type="danger" @click="addPopup" size="mini">提交故障</el-button>
            <!-- <el-select v-model="selectValues" clearable placeholder="请选择状态" @change="statusOpt" size="mini" filterable>
              <el-option :key="index"
                v-for="(item, index) in selectValue"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select> -->
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
                  :picker-options="dateComp"
                >
                </el-date-picker>
              </div>
              <div class="search i-b">
                <el-input clearable @keyup.enter.native="searchHandle" placeholder="请输入检索关键字" suffix-icon="icon-sousuo iconfont" v-model="keyword" size="mini">
                </el-input>
              </div>
              <el-button
                size="medium"
                type="primary"
                @click="searchHandle"
                >查询</el-button>
                <el-button
                size="medium"
                type="primary"
                @click="getExcel"
                >导出</el-button>
            </div>
          </div>
          <div class="table-list">
            <el-table :data="table.tableData" border style="width: 100%" v-if="table.tableHeight"
                      :height="table.tableHeight" highlight-current-row
                      @row-click="handleCurrentChange" ref="err_table">
              <el-table-column prop="id" label="故障编号" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="title" label="故障名称"  width="260" show-overflow-tooltip></el-table-column>
              <!-- <el-table-column prop="description" label="故障描述" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :title=scope.row.description class="tab-opt" style="">{{scope.row.description}}</span>
                </template>
              </el-table-column> -->
              <el-table-column prop="os_TYPE" label="涉及系统"></el-table-column>
              <!-- <el-table-column prop="system_TYPE" label="子系统" width="110" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="fault_REASON" width="100" label="故障成因" show-overflow-tooltip></el-table-column>
              <el-table-column prop="create_USER" width="100" label="故障提交人" show-overflow-tooltip></el-table-column>
              <el-table-column prop="create_TIME" label="提交日期" width="110" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fault_LEVEL" label="故障等级" width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fault_START_TIME" label="故障发生时间" width="110" show-overflow-tooltip></el-table-column>
              <el-table-column prop="fault_CONTINUED_TIME" width="100" label="持续时间|分" show-overflow-tooltip></el-table-column>
              <el-table-column prop="buttons" width="140" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" v-if="scope.row.status=='1'" @click.stop="handleCurrentChange2(scope.row)">修改</el-button>
                  <el-button size="mini" type="danger" v-if="scope.row.status=='1'" @click.stop="deleteFault(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
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
            <div class="console-action-wrapper">
              <i class="el-icon-close close" @click="setConsoleVisible"></i>
            </div>
            <el-tabs style="height:100%;" v-model="tabs.activeName" type="card" @tab-click="tabClick">
              <el-tab-pane label="详情页" name="info" style="word-break:break-all;">
                <div class="console-tab-content">
                  <el-form ref="form" :model="form" label-width="100px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障编号">
                          {{tabs.form.id}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障名称">
                        	{{tabs.form.title}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="涉及系统">
                        	{{tabs.form.os_TYPE}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="涉及子系统">
                        	{{tabs.form.system_TYPE}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障发生时间">
                        	{{tabs.form.fault_START_TIME}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障修复时间">
                        	{{tabs.form.fault_END_TIME}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" style="width:100%;" :sm="12">
                        <el-form-item label="故障持续时间">
                        	{{tabs.form.fault_CONTINUED_TIME}}分钟
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障原因">
                        	{{tabs.form.fault_reason}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障等级">
                        	{{tabs.form.fault_LEVEL}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="故障处理人员">
                          {{tabs.form.handle_USER}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="责任人">
                          {{tabs.form.responsibility_USER}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" style="width:100%;" :sm="12">
                        <el-form-item label="交易量影响">
                          {{tabs.form.sum_EFFECT}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" style="width:100%;" :sm="12">
                        <el-form-item label="故障描述">
                          {{tabs.form.description}}
    			               <!-- <p>
    			               	<a style="margin-right: 20px;color: #66b1ff" :key="index" v-for="(item,index) in tabs.downName" @click="downfile(item.id)" >{{item.name}}</a>
    			               </p> -->
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" style="width:100%;" :sm="12">
                        <el-form-item label="故障复盘分析">
                          {{tabs.form.description_EX}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" style="width:100%;" :sm="12">
                        <el-form-item label="解决方案">
                          {{tabs.form.solution}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.form.attachments.length">
                        <el-form-item label="附件:">
                          <template>
                            <div v-for="(item,index) in tabs.form.attachments" :key="index" style="color: #409EFF; cursor:pointer;" @click="downloadAtt(item.id)">{{item.name}}</div>
                          </template>
                        </el-form-item>
                      </el-col>
                      <!-- <div v-if="operate.faultReviewResult">
                        <el-col :span="24"></el-col>
                        <el-col :span="24" :sm="24">
                          <el-form-item label="处理人:">
                            {{operate.faultReviewResult.createuser}}
                          </el-form-item>
                        </el-col>
                        <el-col v-if="operate.faultReviewResult.review_GRADE" :span="12" :sm="12">
                          <el-form-item label="总监评审等级:">
                            {{operate.faultReviewResult.review_GRADE | reviewGRADE}}
                          </el-form-item>
                        </el-col>
                        <el-col v-if="operate.faultReviewResult.review_NAME" :span="12" :sm="12">
                          <el-form-item label="总监评审意见:">
                            {{operate.faultReviewResult.review_NAME}}
                          </el-form-item>
                        </el-col>
                        <el-col v-if="operate.faultReviewResult.rejection" :span="12" :sm="12">
                          <el-form-item label="总监驳回原因:">
                            {{operate.faultReviewResult.rejection}}
                          </el-form-item>
                        </el-col>
                      </div> -->
                      <!-- <div v-if="information.length">
                        <div v-for="(item,index) in information">
                          <el-col :span="24" :sm="24">
                            <el-form-item label="处理人">
                              {{item.user_ID}}
                            </el-form-item>
                          </el-col>
                          <div v-if='item.rejection'>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="驳回原因">
                                {{item.rejection}}
                              </el-form-item>
                            </el-col>
                          </div>
                          <div v-if='!item.rejection'>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="成因">
                                {{item.reason | reason}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="原因备注">
                                {{item.reason_MARK}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="影响范围">
                                {{item.effect_SCOPE}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="解决方案">
                                {{item.solution}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="预计修复时间">
                                {{item.repair_TIME | time_repair}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="影响时间">
                                {{item.influence_TIME}}
                              </el-form-item>
                            </el-col>
                            <el-col :span="12" :sm="12">
                              <el-form-item label="关联系统">
                                {{item.system_TYPE_ID}}
                              </el-form-item>
                            </el-col>
                          </div>
                        </div>
                      </div> -->
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="操作台" v-if="false" name="console">
                <div class="console-action-wrapper">
                  <!--<i class="icon-more iconfont"-->
                     <!--@click="tabs.consoleActionVisible = !tabs.consoleActionVisible" v-if="operate.status=='待审核'"></i>-->
                  <!--<div class="console-action fr" v-if="tabs.consoleActionVisible">-->
                        <!--<span v-for="(item, index) in tabs.consoleActionData.erract"-->
                              <!--@click="consoleActionEvent(item.name,'erract')">{{item.name}}</span>-->
                  <!--</div>-->
                </div>
                <div class="console-tab-content">
                  <el-form :model="form" label-width="100px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12" :sm="12">
                        <el-form-item label="状态">
                          <el-form-item label="">{{operate.status}} {{operate.RE_STR}}</el-form-item>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="发送人">
                          <el-form-item label="">{{operate.relation_USER}}</el-form-item>
                        </el-form-item>
                      </el-col>
                      <!-- 总监评审 -->
                      <div class="opt-show" v-if="operate.allotButton && operate.permission">
                        <el-col :span="12" :sm="12">
                          <el-form-item label="故障编号">
                            <el-form-item label="">{{tabs.form.id}}</el-form-item>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12">
                          <el-form-item label="故障标题">
                            <el-form-item label="">{{chief.title}}</el-form-item>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12">
                          <el-form-item label="评审等级">
                            <el-select v-model="popup.popTxt.priperty2" placeholder="评审等级" clearable filterable style="width: 100%">
                              <el-option
                                v-for="item in popup.priperty"
                                :key="item.rriority_ID"
                                :label="item.rriority_NAME"
                                :value="item.rriority_ID"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">

                        </el-col>
                        <el-col :span="24" :sm="24">
                          <el-form-item label="评审意见">
                            <el-input type="textarea" v-model="chief.opinion">{{chief.opinion}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :gutter="24" v-if="assign.checkList.length > 0">
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
                        </el-col>
                        <el-col align="center" v-if="operate.permission">
                                <el-button v-if="operate.allotButton" type="primary" @click="assign.assignvisible=true">分配人员</el-button>
                                <el-button v-if="operate.reject" type="" size="medium" value="驳回" name="'bh" @click="consoleActionEvent('reject')">驳回</el-button>
                                <el-button v-if="operate.updateButton" type="primary" size="medium" value="修改" @click="consoleActionEvent('修改')">重新分配</el-button>
                                <el-button v-if="operate.confirmButton" type="primary" size="medium" value="完成" @click="consoleActionEvent('完成')">确认完成</el-button>
                                <el-button v-if="operate.addButton" type="primary" size="medium" value="确认" @click="consoleActionEvent('确认')">确认</el-button>
                        </el-col>
                      </div>
                      <!-- 经理评审 -->
                      <div class="opt-show" v-if="operate.MANAGER_AUDIT && operate.permission">
                        <el-col :span="12" :sm="12">
                          <el-form-item label="成因">
                              <el-select v-model="operate.operateTxt.reasonValue" filterable clearable style='width: 100%;'>
                                <el-option
                                        v-for="_item in operate.operateTxt.reasonSelect"
                                        :key="_item.ID"
                                        :label="_item.REASON_NAME"
                                        :value="_item.ID"
                                ></el-option>
                              </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12">
                          <el-form-item label="影响范围">
                            <el-input v-model="operate.operateTxt.effectScope">{{operate.operateTxt.effectScope}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12">
                          <el-form-item label=" 预计修复时间">
                            <el-date-picker
                              v-model="operate.operateTxt.time"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12">
                          <el-form-item label="影响时间">
                            <el-input v-model="operate.operateTxt.effectTime"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24" :sm="12">
                          <el-form-item label="原因备注">
                            <el-input v-model="operate.operateTxt.reason"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12" v-if="operate.system2.length == 0">
                          <el-form-item  label="涉及系统">
                            <el-form-item label="">{{operate.system.SYSTEM_NAME}}</el-form-item>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12" :sm="12" v-if="operate.system2.length != 0">
                          <el-form-item  label="涉及系统">
                            <el-select v-model="system2" placeholder="涉及系统" style='width: 100%;' filterable @change="changeSystem2">
                              <el-option
                                v-for="(_item, index) in operate.system2"
                                :key="_item.SYSTEM_ID"
                                :label="_item.SYSTEM_NAME"
                                :value="_item.SYSTEM_ID"
                                ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24" :sm="12">
                          <el-form-item label="子系统" class='sunSystem' :key="index" v-for="(item,index) in operate.systemAll">
                            <el-select v-model="item.csty" placeholder="子系统" clearable style="width:90%" filterable>
                              <el-option
                                v-for="_item in operate.subSystem"
                                :key="_item.SYSTEM_ID"
                                :label="_item.SYSTEM_NAME"
                                :value="_item.SYSTEM_ID+','+_item.SYSTEM_NAME"
                              ></el-option>
                            </el-select>
                            <i
                              :class="index == 0 && operate.systemAll.length ==1?'el-icon-plus':index == operate.systemAll.length-1?'el-icon-plus':'el-icon-minus'"
                              @click="addsubStystem(index,$event)"
                              style="line-height: 40px;height: 40px;text-align: right;width: 8%; font-size: 20px;cursor: pointer;font-weight: bold">
                            </i>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24" :sm="24">
                          <el-form-item label="解决方案">
                            <el-input type="textarea" v-model="operate.operateTxt.solution"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col align="center">
                                <el-button type="" size="medium" value="驳回" name="'bh" @click="consoleActionEvent('驳回')">驳回</el-button>
                                <el-button type="primary" size="medium" value="确认" @click="consoleActionEvent('同意')">确认</el-button>
                        </el-col>
                      </div>
                      <!-- 发起人查看驳回通知单 -->
                      <div class="opt-show" v-if="operate.resubmitButton && operate.withdrawButton">
                        <el-col :span="12">
                          <el-form-item label="故障ID">
                            <el-input v-model="tabsList.form.id" disabled>{{tabsList.form.id}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="标题">
                            <el-input v-model="tabsList.activeTableInfo.title">{{tabsList.activeTableInfo.title}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="故障分析人员">
                            <el-input v-model="tabsList.form.relationUser">{{tabsList.form.relationUser}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="故障等级">
                            <!--<el-input v-model="popup.priperty"></el-input>-->
                            <el-select v-model="popup.popTxt.priperty2" placeholder="故障等级" clearable filterable style="width: 100%">
                              <el-option
                                v-for="item in popup.priperty"
                                :key="item.rriority_ID"
                                :label="item.rriority_NAME"
                                :value="item.rriority_ID"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="故障描述" style="position: relative;">
                            <el-input v-model="tabsList.form.description" type="textarea">{{tabsList.form.description}}</el-input>
                            <el-button type="primary">上传附件</el-button>
                            <input type="file" @change="getFile($event)" placeholder="上传附件" class="upload-input"
                                   style="width:78px;opacity: 0;position: absolute;left: 0;top: 63px;">
                            <p :key="index" v-for ="(item,index) in popup.popTxt.uploadFiles">{{item}}
                              <i style="margin-left: 10px;cursor: pointer;color: red;"
                                @click="spliceText(index)" class="el-icon-close"></i>
                            </p>
                            <!-- <p>
                            <a style="margin-right: 20px;color: #66b1ff" :key="index" v-for="(item,index) in tabs.downName" @click="downfile(item.id)" >{{item.name}}<i style="margin-left: 10px;cursor: pointer;color: red;"
                                @click="spliceText(index)" class="el-icon-close"></i></a>
                           </p> -->
                           <!-- <p :key="index" v-for ="(item,index) in popup.popTxt.uploadFiles">{{item}}
                              <i style="margin-left: 10px;cursor: pointer;color: red;"
                                @click="popup.popTxt.fileList.splice(index,1);popup.popTxt.uploadFiles.splice(index,1)" class="el-icon-close"></i>
                            </p> -->
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="故障复盘分析">
                            <el-input v-model="tabsList.form.descriptionEx" type="textarea">{{tabsList.form.descriptionEx}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24">
                          <el-form-item label="交易量影响">
                            <el-input v-model="tabsList.form.sumEffect" type="textarea">{{tabsList.form.sumEffect}}</el-input>
                          </el-form-item>
                        </el-col>
                        <el-col align="center">
                          <el-button type="" size="medium" value="驳回" name="'bh" @click="consoleActionEvent('舍弃')">作废</el-button>
                          <el-button type="primary" size="medium" value="确认" @click="consoleActionEvent('重新提交')">重新提交</el-button>
                        </el-col>
                      </div>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="全程跟踪" v-if="false" name="project">
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
                          <el-form-item label="">{{way.relation_USER}}</el-form-item>
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
        <!--故障提交单弹窗-->
        <div class="content" v-if="errorVisible" style='background: white;z-index: 10;'>
          <el-form :model="form" label-width="120px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="故障编号">
                  <el-input disabled v-model="popup.popTxt.id"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item  label="故障名称">
                  <el-input clearable maxlength="60" v-model="popup.popTxt.title" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :md="12">
                <el-form-item label="故障发生时间">
                  <el-date-picker
                    type="datetime"
                    placeholder="请选择故障发生时间"
                    v-model="popup.popTxt.fault_start_time"
                    :picker-options='filterDate'
                    style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" :md="12">
                <el-form-item label="故障修复时间">
                  <el-date-picker
                    type="datetime"
                    placeholder="请选择故障修复时间"
                    v-model="popup.popTxt.fault_fix_time"
                    :picker-options='filterDate'
                    style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="故障原因">
                  <el-select v-model="popup.popTxt.fault_reason" placeholder="请选择故障原因" clearable filterable style="width: 100%">
                    <el-option
                      v-for="item in popup.faultReason"
                      :key="item.value"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="故障等级">
                  <el-select v-model="popup.popTxt.priperty2" placeholder="故障等级" clearable filterable style="width: 100%">
                    <el-option
                      v-for="item in popup.priperty"
                      :key="item.rriority_ID"
                      :label="item.rriority_NAME"
                      :value="item.rriority_NAME"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="故障处理人员">
                  <el-select v-model="popup.popTxt.dealPeople" placeholder="请选择故障处理人员(可多选)" multiple clearable filterable style="width: 100%">
                    <el-option
                      v-for="item in popup.popTxt.allUser"
                      :key="item.user_ID"
                      :label="item.user_NAME"
                      :value="item.user_NAME"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="责任人">
                  <el-select v-model="popup.popTxt.responsePeople" placeholder="请选择责任人(可多选)" multiple clearable filterable style="width: 100%">
                    <el-option
                      v-for="item in popup.popTxt.allUser"
                      :key="item.user_ID"
                      :label="item.user_NAME"
                      :value="item.user_NAME+'-'+item.user_ID"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="涉及系统">
                  <el-col :span="24">
                    <el-select filterable clearable  v-model="popup.popTxt.choosesystem" @change="selectSys"
                          placeholder="请选择涉及系统">
                      <el-option v-for="item in popup.popTxt.choosesystemArr" :label="item.system_NAME" :key="item.system_ID"
                          :value="`${item.system_ID},${item.system_NAME}`" clearable></el-option>
                    </el-select>
                    <el-select  filterable clearable  v-model="popup.popTxt.choosesystemSub"
                          placeholder="请选择子系统">
                      <el-option v-for="item in popup.popTxt.choosesystemArrSub" :label="item.system_NAME" :key="item.system_ID"
                          :value="`${item.system_ID},${item.system_NAME}`" clearable></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="交易量影响">
                  <el-input clearable maxlength="150" placeholder="需输入影响交易笔数、影响交易金额" v-model="popup.popTxt.sum_effect" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="故障详细描述">
                  <el-input clearable maxlength="1000" placeholder="请详细描述故障发生及解决过程" v-model="popup.popTxt.description" type="textarea"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="故障复盘和分析">
                  <el-input clearable maxlength="1000" placeholder="请描述复盘经过与分析结果" v-model="popup.popTxt.descriptionEx" type="textarea"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="影响范围">
                  <el-input clearable maxlength="150" type="textarea" v-model="popup.popTxt.effect_range"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- TODO -->
            <el-row :gutter="24">
              <el-col :span="24">
              <el-form-item label="上传附件(选填):">
                <el-upload
                  :limit="1"
                  :action="`${baseUrl}/fault/uploadNell?token=${$getToken()}`"
                  :on-success="uploadFileSuccessOperation"
                  auto-upload
                  :on-preview="uploadFileClick"
                  :on-exceed="uploadFileOut"
                  :on-remove="uploadClearOperation"
                  :file-list="operationFileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="24">
              <el-col :span="24">
              <el-form-item label="故障描述" style="position: relative;">
                <el-input v-model="popup.popTxt.description" type="textarea"></el-input>
                <el-button type="primary">上传附件</el-button>
                <input type="file" @change="getFile($event)" placeholder="上传附件" class="upload-input"
                       style="width:78px;opacity: 0;position: absolute;left: 0;top: 63px;">
                <p :key="index" v-for ="(item,index) in popup.popTxt.uploadFiles">{{item}}
                  <i style="margin-left: 10px;cursor: pointer;color: red;"
                  	@click="popup.popTxt.fileList.splice(index,1);popup.popTxt.uploadFiles.splice(index,1)" class="el-icon-close"></i>
                </p>
                </el-upload>
              </el-form-item>
              </el-col>
            </el-row> -->
            <el-row :gutter="24">
              <el-col :span="24">
              <el-form-item label="解决方案">
                <el-input maxlength="1000" v-model="popup.popTxt.solution" type="textarea"></el-input>
              </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="24" v-if="assign.checkList.length > 0">
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
            </el-row> -->
          </el-form>
          <div style="text-align: center">
            <!-- <el-button type="primary" @click="assign.assignvisible=true">分配人员</el-button> -->
            <el-button type="danger" @click="subForm">确 定</el-button>
          </div>
        </div>
        <!--分配-->
        <SelectUser
          v-if="assign.assignvisible"
          :panelVisible.sync='assign.assignvisible'
          :panelTip='panelTip'
          :myurl='myurl'
          @message='subAssign'
        ></SelectUser>
      </div>
    </el-card>

  </div>
</template>
<script>
  import tracking from "../needs/common/tracking.vue";//全程跟踪视图模式
  import SelectUser from '../common/SelectUser.vue';
  import cloneDeep from "lodash/cloneDeep";
  Date.prototype.format = function (fmt) { //author: meizz
      var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
}
  export default {
    data(){
      return {
        updateFlag:false,
        updateSysId:'',
        baseUrl:window._options.baseUrl,
        operationFileList:[],
        homeDisabled:false,
        prevDisabled:false,
        nextDisabled:false,
        endDisabled:false,
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 15,
        maxPageNumber: null,
        total:'',// 数据总数
        panelTip: {
          panelTitle: '分配',
          selectedUserTitle: '已选择人员名单',
          selectedUserTip: '请选择人员',
          selectUserTitle: '选择人员',
          difineSelectUsers: []
        },
        myurl: '/fault/queryUserByDemand',
        errorVisible: false,
        tracking: {
          trackingvisiible: false,
          data:[],//数据
          hoverIndex:"",//移动上去的索引
          hoverData:[],//鼠标悬浮的信息
        },
        table: {
          tableData: [],
          tableOriginData: [],
          tableHeight: "",
        },
        chief:{
          opinion: '',//意见
          review_GRADE: '' ,
          review_NAME:'',
        },//z总监
        manager:{},//经理
        operate: {
          id: '',
          RE_STR:'',
          updateButton: '',//分配状态
          addButton:'',
          allotButton:'',
          confirmButton:'',
          reject:'',
          resubmitButton:'',
          withdrawButton:'',
          MANAGER_AUDIT:'',
          MANAGER_REJECT:'',//状态数据判断
          faultReviewResult:{},//总监评审内容
          title:'',//标题
          status: '',//状态
          relation_USER: '',//发送人
          system: '',//涉及系统
          system2:'',
          systemAll: [{"fsty": "", "csty": ""}],
          subSystem: [],//子系统
          operateTxt:{
            'reasonValue': '',//成因
            'reasonSelect':'',
            'effectScope': '',//影响范围
            'solution': '',//解决方案
            'reason':'',//原因
            'time':'',//预计修复时间
            'effectTime':'',//影响时间
          },
          fpvisible:true,//分配弹窗显示
          permission:false
        },
        way: {
          status: '',
          sender: '',
          information: ''
        },
        keyword: "",
        options: [],
        selectValues: [],
        selectValue: [
        {
          'id': 1,
          "value": '待审核'
        }, {
          'id': '2',
          "value": '已完成'
        },
          {
            'id': '4',
            "value": '已驳回'
          },
        ],
        page: {},
        form: {},
        error: {
          disabled: true
        },
        filterDate: {
          disabledDate(time){
            return time.getTime() > Date.now()
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
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
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
        tabsList:{},
        information:[],
        tabs: {
          activeTableInfo: "",
          form: {
            id: "",
            pripoerty: '',
            relationUser: "",
            handle_USER:'',
            os_TYPE:'',
            system_TYPE:'',
            fault_LEVEL:'',
            fault_CONTINUED_TIME:'',
            description: "",
            sumEffect: "",
            descriptionEx: "",
            downName:[]
          },
          activeName: 'info',
          consoleActionData: {
            "erract": [{
              "name": "驳回"
            }, {
              "name": "确认"
            }]
          },
          consoleActionVisible: false,
          consoleWrapperVisible: false,

        },
        popup: {
          priperty: [
          {
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
          }],
          faultReason: [
          {
            'name': '程序问题',
            "value": "104"
          },
          {
            'name': '硬件环境',
            "value": "105"
          },
          {
            'name': '网络故障',
            "value": "106"
          },
          {
            'name': '人为错误',
            "value": "107"
          }],
          popTxt:{
            'id':'',//问题编号
            'title':'',//故障标题
            'fault_start_time':'',//故障发生时间
            'fault_fix_time':'',//故障修复时间
            'sum_effect':'',//交易量影响
            'priperty2':'',//故障等级
            'dealPeople': "",			//故障处理人员
            'responsePeople':"",//责任人
            'description': "",				//故障详细描述
            'descriptionEx': "",			//故障复盘分析
            'fault_reason': "",			//故障原因
            'effect_range': "",			//影响范围
            'choosesystem': "",			//选择系统
            'choosesystemSub': "",			//选择子系统
            'solution': "",			//解决方案
            'uploadFiles':[],              // 上传成功的文件数组
            'fileList':[],                //上传附件
            fppeople:'',//分配人员
          }

        },
        split:{
          splitaddvisible:false
        },
        assign: {
          assignvisible: false,//分配的弹窗
          keyword: "",//分配的搜索人员
          left: true,//左侧的显示
          right: false,//右侧的显示
          checkList: [],//选择的数据
          leftOriginData: [],//左侧显示的数据
          //                    rightlistdata: [],//右侧显示的数据
          leftSearch: false,//左侧搜索出来的结构展示
          searchData: [],//左侧特殊结构，显示出来的搜索结果存放处
          assignDeptIndex:"",//当前选中的部门索引
        },
        activeinfo:'',
        errorVsetTableDataisible: false,
      }
    },
    filters: {
      date(time) {
        let d = new Date(time);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1)<10?'0' + (d.getMonth()+1) : '' + d.getMonth()+ 1;
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        let hour = d.getHours()< 10 ? '0' + d.getHours() : '' + d.getHours();
        let minutes = d.getMinutes() <10 ? '0' + d.getMinutes() : '' + d.getMinutes();
        let seconds = d.getSeconds() <10 ? '0' + d.getSeconds() : '' + d.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
      },
      time_repair(time){
        let d = new Date(time);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1)<10?'0' + (d.getMonth()+1) : '' + d.getMonth()+ 1;
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        return year + '-' + month + '-' + day;
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
      reviewGRADE(val){
        if(val == 101){
          return 'S'
        }
        if(val == 102){
          return 'A'
        }
        if(val == 103){
          return 'B'
        }
        if(val == 104){
          return 'C'
        }
      }
    },
    mounted(){
      this.calculate();
      this.loadData();
      // this.getNo();
      // this.getAllUser();
      // this.getAllSystem();
    },
    computed:{
      computedValue:function(){
        let type=true;
        if(!this.dateComp.value && this.keyword == ""){
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
    components:{
      "tracking":tracking,//全程跟踪视图模式
      SelectUser
    },
    methods: {
      // 生成excel报告
      getExcel() {
        // if(!this.dateComp.value && !this.keyword){
        //   return this.$warn('请至少选择一项')
        // }
        let params = new URLSearchParams();
        if(this.keyword){
          params.append("key", this.keyword);
        }
        if(this.dateComp.value){
          let startTime = this.dateComp.value[0];
          let endTime = this.dateComp.value[1];
          params.append("startDate", startTime);
          params.append("endDate", endTime);
        }
        console.log('生成报告', decodeURI(params.toString()));
        console.log(`${window._options.baseUrl}/fault/exportPFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
        window.open(`${window._options.baseUrl}/fault/exportPFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
      },
      uploadFileSuccessOperation(res){
        if(res.code === 200 && res.result.code === 200){
          this.operationFileList.push({
            name: res.result.name,
            id: res.result.id,
            url: `${window._options.baseUrl}/fault/download?token=${this.$getToken()}&id=${res.result.id}`
          });
        }else{
          this.$message.error(res.message);
        }
      },
      uploadFileClick(res){
        window.open(res.url);
      },
      uploadFileOut(res){
        this.$message.warning('只能上传一个文件');
      },
      uploadClearOperation(){
        this.operationFileList=[];
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
      testScope(val){
        console.log(val);
      },
      spliceText(index){
        if (this.popup.popTxt.fileList) {
          this.popup.popTxt.fileList.splice(index,1);
        }
        this.popup.popTxt.uploadFiles.splice(index,1);
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
        let card_body = document.querySelector(".box-card .el-card__body");
        card_body.style.height = height - 36 - 48 + "px";//此处需减去卡片头部
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
        let actionHeight = document.querySelector(".content .action").offsetHeight;
        //true代表没有控制台
        if (!type) {
          //-----------------------body的上下padding--table的margin-top-卡片头部
          this.table.tableHeight = height - 36 - actionHeight - 20 - 20 - 48 - 2;
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
          // i.style.height = 986+'px';
        }
      },
      //-----首次加载刷新表单数据
      loadData(){
        //清除新增新增的表单
        this.clearAddData();
        let params = new URLSearchParams();
        params.append("page", this.currentPageNumber);
        params.append("pageSize", this.defaultPageSize);
        params.append("key", '');
        this.$maskin();
        this.$axios.post("/fault/query", params).then((res) => {
          let data = res.data;
          this.total=data.total;
          this.setTableData(data.data);
          this.resetDisabled(false,false,false,false);
          this.$maskoff();
        })
      },
      getNo(){
          let params = new FormData();
          params.append("status", 1);
          params.append("token", this.$getToken());
          this.$axios.post("/fault/getNo",params).then((res) => {
          let data = res.data;
          this.popup.priperty = data.rriorityList;
          // console.log(this.popup.priperty);
          this.popup.popTxt.id=data.id;
        })
      },
      getAllUser() {
        let params = new URLSearchParams();
        this.$maskin();
        this.$axios.post("fault/getAllUser", params).then((res) => {
          let data = res.data;
          this.$set(this.popup.popTxt,"allUser",data.allUser)//所有人员
          this.$maskoff();
        })
      },
      getAllSystem() {
        let params = new URLSearchParams();
        this.$axios.post('/golive/systemlist', params).then((res) => {
            if (res.data.code = 200) {
                let systems = [];
                let data = res.data.result;
                for (let i of data) {
                    systems.push(i);
                }
                this.$set(this.popup.popTxt, "choosesystemArr", systems);//系统
            }
        })
      },
      selectSys(val){
        // if(val.split(',')[2] == '1'){
        //   this.$message.warning('该版本已经上线，请新建版本');
        //   this.split.choosesystem = '';
        // }
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
                this.$set(this.popup.popTxt, "choosesystemArrSub", subsystems);//子系统
            }
        })
      },
      setTableData(data){
          let arr = [];
          for (let i of data) {
            if (i.fault_START_TIME) {
              let start = this.$format(i.fault_START_TIME);
              i.fault_START_TIME = `${start.year}-${start.mouth}-${start.day}`;
            }
            if (i.create_TIME) {
              let create = this.$format(i.create_TIME);
              i.create_TIME = `${create.year}-${create.mouth}-${create.day}`;
            }
            // if (i.status == 1) {
            //   i.status = '待审核'
            // }
            // if (i.status == 2) {
            //   i.status = '已完成'
            // }
            // if (i.status == 3) {
            //   i.status = '已废弃'
            // }
            // if (i.status == 4) {
            //   i.status = '已驳回'
            // }
            // if (i.status == 7) {
            //   i.status = '处理中'
            // }
            // if (i.priperty == 101) {
            //   i.priperty = 'S'
            // }
            // if (i.priperty == 102) {
            //   i.priperty = 'A'
            // }
            // if (i.priperty == 103) {
            //   i.priperty = 'B'
            // }
            // if (i.priperty == 104) {
            //   i.priperty = 'C'
            // }
            // if(i.reason){
            //   if(i.reason==1){
            //     i.reason='程序问题'
            //   }
            //   if(i.reason==2){
            //     i.reason='硬件环境'
            //   }
            //   if(i.reason==3){
            //     i.reason='网络故障'
            //   }
            //   if(i.reason==4){
            //     i.reason='人为错误'
            //   }
            // }
            arr.push(i)
          }
          this.$set(this.table, "tableData", arr);
          this.$set(this.table, "tableOriginData", arr);
          if (this.$route.params.neelId) {
            let id = this.$route.params.neelId;
            for (let i = 0; i < data.result.length; i++) {
              if (data.result[i].id == id) {
                setTimeout(() => {
                  this.tabs.index = i;
                  this.$refs.err_table.setCurrentRow(data.result[i]);
                  this.handleCurrentChange(data.result[i]);
                }, 0);
                break;
              }
            }
            return;
          }
          this.$maskoff();
      },
      //-----------------------------------提交分配任务
      subAssign(poyload){
        this.assign.checkList = poyload.selectUsers;
        this.panelTip.difineSelectUsers = this.popup.popTxt.fppeople = poyload.userLists.split(',');
      },
      //故障bug状态选择
      statusOpt(val){
        this.setConsoleVisible();
        let params = new URLSearchParams();
        params.append("status", val);
        this.$axios.post("/fault/query?type=1", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
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
              if (i.status == 1) {
                i.status = '待审核'
              }
              if (i.status == 2) {
                i.status = '已完成'
              }
              if (i.status == 3) {
                i.status = '已作废'
              }
              if (i.status == 4) {
                i.status = '已驳回'
              }
              if (i.priperty == 101) {
                i.priperty = '紧急'
              }
              if (i.priperty == 102) {
                i.priperty = '中等'
              }
              if (i.priperty == 103) {
                i.priperty = '一般'
              }
              arr.push(i)
            }
            this.$set(this.table, "tableData", arr);
          }
        })
      },
      // 搜索
      searchHandle() {
        let params = new URLSearchParams();
        if(this.dateComp.value){
          let startTime = this.dateComp.value[0];
          let endTime = this.dateComp.value[1];
          params.append("startDate", startTime);
          params.append("endDate", endTime);
        }
        params.append("key", this.keyword);
        params.append("page", this.currentPageNumber);
        params.append("pageSize", this.total);
        this.$maskin();
        this.$axios.post("/fault/query", params).then((res) => {
          let data = res.data;
          this.setTableData(data.data);
          this.resetDisabled(true,true,true,true);
          this.$maskoff();
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
      //时间搜索
      timeChange(val){
        this.setConsoleVisible()
          let startTime = val[0]
          let endTime = val[1]
        //   startTime = Date.parse(startTime);
        // endTime = Date.parse(endTime);
        let params = new URLSearchParams();
         params.append("page", '1');
          params.append("pageSize", '15');
        params.append("startDate", startTime);
        params.append("endDate", endTime);
        this.$axios.post("/fault/query", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
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
                i.priperty = '紧急'
              }
              if (i.priperty == 102) {
                i.priperty = '中等'
              }
              if (i.priperty == 103) {
                i.priperty = '一般'
              }
              arr.push(i)
            }
            this.$set(this.table, "tableData", arr);
          }
        })
      },
      deleteFault(val){
        this.confirm('确定要删除此条故障，删除后将不可恢复',()=>{
          let params = new URLSearchParams();
          this.$maskin();
          params.append('ID',val.id)
          params.append('type','delete')
          this.$axios.post('/fault/submit',params).then(res=>{
            if(res.data.code=200){
              this.$success('删除成功')
              this.loadData();
              this.$maskoff();
            }
          })
        })
      },
      //详情显示
      handleCurrentChange2(val){
        // this.getNo();
        this.popup.priperty = [{rriority_ID:101,rriority_NAME:"S"},{rriority_ID:102,rriority_NAME:"A"},{rriority_ID:103,rriority_NAME:"B"},{rriority_ID:104,rriority_NAME:"C"}];
        this.clearAddData();
        this.loadTabsData(val);
        this.getAllUser();
        this.getAllSystem();
        this.updateFlag=true;
        // this.tabs.activeName = 'console';
        this.errorVisible=!this.errorVisible;
      },
      handleCurrentChange(val){
        console.log(val);
        console.log(this.tabs);
        this.clearAddData();
        this.assign.checkList = [];
        this.tabs.activeTableInfo = val;
        this.panelTip.difineSelectUsers = [];
        if (!this.tabs.consoleWrapperVisible) {
          this.tabs.consoleWrapperVisible = true;
          setTimeout(() => {
            this.calculate()
          }, 0);
        }
        this.loadTabsData(val);
      },
      filterDateStr(val) {
        let start = this.$format(val);
        return `${start.year}-${start.mouth}-${start.day}-${start.hour}:${start.min}:${start.second}`;
      },
      loadTabsData(val){
        this.activeinfo=val;
        this.$maskin();
        this.clearAddData();
        this.operate.id=val.status;
        let params = new URLSearchParams();
        params.append("id", val.id);
        this.$axios.post("/fault/get", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            //以下是设置展示数据
            // switch (data.result.fault.priperty) {
            //   case 101:
            //     this.tabs.form.pripoerty='S'
            //       break;
            //   case 102:
            //     this.tabs.form.pripoerty = 'A'
            //       break;
            //   case 103:
            //     this.tabs.form.pripoerty = 'B'
            //       break;
            //   case 104:
            //     this.tabs.form.pripoerty = 'C'
            //       break;
            // }
            this.$set(this.tabs.form,'attachments',data.nellFiles);
            // console.log('赋值附件结束')
            // this.tabs.form.attachments=data.nellFiles;//附件
            data.nellFiles.forEach(item=>{
              let obj={};
              obj.name=item.name;
              obj.id=item.id;
              obj.url=`${window._options.baseUrl}/fault/download?token=${this.$getToken()}&id=${item.id}`
              this.operationFileList.push(obj);
            })
            this.tabs.form.id = data.result.id;
            this.tabs.form.title = data.result.title;
            this.tabs.form.fault_reason = data.result.fault_REASON;
            this.tabs.form.os_TYPE = data.result.os_TYPE;
            this.tabs.form.system_TYPE = data.result.system_TYPE;
            this.tabs.form.fault_START_TIME = this.filterDateStr(data.result.fault_START_TIME);
            this.tabs.form.fault_END_TIME = this.filterDateStr(data.result.fault_END_TIME);
            this.tabs.form.fault_LEVEL = data.result.fault_LEVEL;
            this.tabs.form.fault_CONTINUED_TIME = data.result.fault_CONTINUED_TIME;
            this.tabs.form.handle_USER = data.result.handle_USER;
            this.tabs.form.responsibility_USER = data.result.responsibility_USER;
            this.tabs.form.description = data.result.description;
            this.tabs.form.sum_EFFECT = data.result.sum_EFFECT; //交易量影响
            this.tabs.form.description_EX = data.result.description_EX;
            this.tabs.form.solution = data.result.solution;
            // 回显数据
            this.popup.popTxt.id=data.result.id;
            this.popup.popTxt.title=data.result.title;
            // this.popup.popTxt.fault_start_time=this.filterDateStr(data.result.fault_START_TIME);
            // this.popup.popTxt.fault_fix_time=this.filterDateStr(data.result.fault_END_TIME);
            this.popup.popTxt.fault_start_time=new Date(data.result.fault_START_TIME);
            this.popup.popTxt.fault_fix_time=new Date(data.result.fault_END_TIME);
            this.popup.popTxt.fault_reason=data.result.fault_REASON;
            this.popup.popTxt.priperty2=data.result.fault_LEVEL;
            this.popup.popTxt.dealPeople=data.result.handle_USER?data.result.handle_USER.split(','):'';
            this.popup.popTxt.responsePeople=data.result.responsibility_USER?data.result.responsibility_USER.split(','):'';
            this.popup.popTxt.choosesystem=data.result.os_TYPE;
            this.selectSys(`${data.result.os_TYPE_ID},${data.result.os_TYPE}`);
            this.popup.popTxt.choosesystemSub=data.result.system_TYPE;
            this.updateSysId=`${data.result.os_TYPE_ID},${data.result.system_TYPE_ID}`;
            this.popup.popTxt.sum_effect=data.result.sum_EFFECT;
            this.popup.popTxt.description=data.result.description;
            this.popup.popTxt.descriptionEx=data.result.description_EX;
            this.popup.popTxt.effect_range=data.result.effect_SCOPE;
            this.popup.popTxt.solution=data.result.solution;
            // this.operate.status =val.status;
            // this.operate.RE_STR = data.result.RE_STR;
            // this.operate.title =data.result.title;
            // this.operate.updateButton = data.result.updateButton;
            // this.operate.addButton = data.result.addButton;
            // this.operate.allotButton = data.result.allotButton;
            // this.operate.confirmButton = data.result.confirmButton;
            // this.operate.faultReviewResult = data.result.faultReviewResult;
            // this.operate.reject = data.result.reject;
            // this.operate.withdrawButton = data.result.withdrawButton;
            // this.operate.resubmitButton = data.result.resubmitButton;
            // this.operate.MANAGER_AUDIT = data.result.MANAGER_AUDIT;
            // this.operate.MANAGER_REJECT = data.result.MANAGER_REJECT;
            // this.operate.relation_USER = data.result.fault.relation_USER;
            // this.operate.permission = data.result.permission;
            // this.$set(this.chief, "opinion", data.result.faultReview.review_NAME);
            // if(data.result.faultReview){
            //   if(data.result.faultReview.review_GRADE == 101){
            //     this.popup.popTxt.priperty2 = 'S';
            //   }
            //   if(data.result.faultReview.review_GRADE == 102){
            //     this.popup.popTxt.priperty2 = 'A';
            //   }
            //   if(data.result.faultReview.review_GRADE == 103){
            //     this.popup.popTxt.priperty2 = 'B';
            //   }
            //   if(data.result.faultReview.review_GRADE == 104){
            //     this.popup.popTxt.priperty2 = 'C';
            //   }
            // }
            // if(data.result.fault){
            //   if(data.result.fault.priperty == 101){
            //     this.popup.popTxt.priperty2 = 'S';
            //   }
            //   if(data.result.fault.priperty == 102){
            //     this.popup.popTxt.priperty2 = 'A';
            //   }
            //   if(data.result.fault.priperty == 103){
            //     this.popup.popTxt.priperty2 = 'B';
            //   }
            //   if(data.result.fault.priperty == 104){
            //     this.popup.popTxt.priperty2 = 'C';
            //   }
            // }
            // this.way.relation_USER = data.result.fault.relation_USER;
            // let arr = [];
            // let reason=[]
            //   for(let i of data.result.reasons.reasons){
            //     reason.push(i)
            //   }
            // this.$set(this.operate.operateTxt, "reasonSelect", reason);
            // if (data.result.process.result.length > 0) {
            //   for (let i of data.result.process.result) {
            //     arr.push(i);
            //   }

            //   this.$set(this.way, "information", arr);
            // }
            // else {
            //   arr = [];
            //   this.$set(this.way, "information", arr);
            // }
            //操作台涉及系统
            // this.operate.system = data.result.systemDept || '';
            // this.operate.system2 = data.result.systemDept2;
            //           操作台子系统显示
            // let subSystems = [];
            // for (let i of data.result.systems.result) {
            //   let obj = {
            //     "SYSTEM_NAME":i.SYSTEM_NAME,
            //     "SYSTEM_ID":i.SYSTEM_ID
            //   }
            //   subSystems.push(obj);
            // }
            // this.$set(this.operate, "subSystem", subSystems);

            //显示下载附件
            // if(data.result.attachment.length>0){
            //   let down=[]
            //     for(let i of data.result.attachment){
            //       if(i.id){
            //         down.push(i);
            //       }
            //       this.$set(this.tabs, "downName", down);
            //     }
            // }
            // this.chief = this.operate;
            // this.chief.opinion = '';
            // this.manager = this.operate;
            // this.tabsList = this.tabs;
            // this.information = data.result.faultOperates;
            // this.loadtrack('getData');
            this.$maskoff();
          }

        })
      },
      //搜索
      searchKeyword(e){
        this.tabs.consoleActionVisible = false
          if (e.keyCode == 13) {
            this.keyword = this.keyword.replace(/(^\s*)|(\s*$)/g, "");
            let params = new URLSearchParams();
            params.append("key", this.keyword);
            this.$axios.post("/fault/query?type=1", params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
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
                    i.priperty = '紧急'
                  }
                  if (i.priperty == 102) {
                    i.priperty = '中等'
                  }
                  if (i.priperty == 103) {
                    i.priperty = '一般'
                  }
                  arr.push(i)
                }
                this.$set(this.table, "tableData", arr);
              }
            })
          }
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
          params.append("file",e.target.files[0]);
        this.$axios.post("/fault/upload", params,config).then((res)=>{
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
      downloadAtt(id){
        window.open(`${this.baseUrl}/fault/download?token=${this.$getToken()}&id=${id}`);
      },
      //下载附件
      downfile(val){
        let token=localStorage.getItem("token")
          //    	window.open("http://192.168.43.216:8082/fault/download?token="+token+"&id="+val);
          this.$axios.get("/fault/download?token="+token+"&id="+val+'&type=2')
      },
      addPopup(){
        // let params = new FormData();
        // params.append("status", 1);
        // params.append("token", this.$getToken());
        // this.$axios.post("/fault/getNo",params).then((res) => {
        //   let data = res.data;
        //   console.log(data);
        //   this.popup.priperty = data.rriorityList;
        //   // console.log(this.popup.priperty);
        //   this.popup.popTxt.id=data.id;
        // })
        this.getNo();
        this.getAllUser();
        this.getAllSystem();
        this.setConsoleVisible();
        this.updateFlag=false;
        this.errorVisible=!this.errorVisible;
        this.clearAddData();
      },
      //提交故障单
      subForm(){
        //提交故障提交单
        // this.popup.popTxt.fppeople = Array.from(this.assign.checkList, item => item.split('-')[0]).join(',');
        let tipList = {
          title:'请填写故障名称',
          fault_start_time: '请选择故障发生时间',
          fault_fix_time: '请选择故障修复时间',
          sum_effect: '请填写交易量影响',
          priperty2: '请选择故障等级',
          // dealPeople: '请选择故障处理人员',
          // responsePeople: '请选择责任人',
          description: '请填写故障详细描述',
          descriptionEx: '请填写故障复盘分析',
          // fault_reason: '请选择故障原因',
          effect_range: '请填写影响范围',
          // choosesystem: '请填写故障涉及系统',
          // choosesystemSub: '请填写故障涉及子系统',
          solution: '请填写解决方案',
        };
        for(let item of Object.entries(tipList)){
          if(!this.popup.popTxt[item[0]]){
            this.$warn(item[1]);
            return;
          }
        }
        this.$maskin();
        let nameArr=[];
        let idArr=[];
        this.popup.popTxt.responsePeople.forEach(item=>{
          nameArr.push(item.split('-')[0]);
          idArr.push(item.split('-')[1]);
        })
        // console.log(this.popup.popTxt.responsePeople);
        // let params = new FormData();
        let params = new URLSearchParams();
        params.append("token",this.$getToken());//
        params.append("ID",this.popup.popTxt.id);//问题ID
        params.append("TITLE", this.popup.popTxt.title);//标题
        params.append("DESCRIPTION",this.popup.popTxt.description);//故障描述
        params.append("DESCRIPTION_EX",this.popup.popTxt.descriptionEx);//故障复盘分析
        params.append("FAULT_START_TIME", this.popup.popTxt.fault_start_time);	//故障发生时间
        params.append("FAULT_END_TIME", this.popup.popTxt.fault_fix_time);	//故障修复时间
        params.append("SUM_EFFECT", this.popup.popTxt.sum_effect);//交易量影响
        params.append("FAULT_LEVEL", this.popup.popTxt.priperty2);//故障等级
        params.append("HANDLE_USER", this.popup.popTxt.dealPeople);//故障处理人员
        params.append("RESPONSIBILITY_USER", nameArr);//责任人name
        params.append("user_zr_id", idArr);//责任人id
        params.append("FAULT_REASON", this.popup.popTxt.fault_reason);//故障原因
        params.append("EFFECT_SCOPE", this.popup.popTxt.effect_range);//影响范围
        params.append("SOLUTION", this.popup.popTxt.solution);//解决方案
        // console.log(this.popup.popTxt.choosesystem.split(',').length)
        // return;
        if(this.popup.popTxt.choosesystem){
          if(this.popup.popTxt.choosesystem.split(',').length>1){
            params.append("OS_TYPE_ID", this.popup.popTxt.choosesystem.split(',')[0]);//故障原因
            params.append("OS_TYPE", this.popup.popTxt.choosesystem.split(',')[1]);//故障原因
            params.append("SYSTEM_TYPE_ID", this.popup.popTxt.choosesystemSub.split(',')[0]);//故障原因
            params.append("SYSTEM_TYPE", this.popup.popTxt.choosesystemSub.split(',')[1]);//故障原因
          }else{
            params.append("OS_TYPE_ID", this.updateSysId.split(',')[0]);//故障原因
            params.append("OS_TYPE", this.popup.popTxt.choosesystem.split(',')[0]);//故障原因
            params.append("SYSTEM_TYPE_ID", this.updateSysId.split(',')[1]);//故障原因
            params.append("SYSTEM_TYPE", this.popup.popTxt.choosesystemSub.split(',')[0]);//故障原因
          }
        }
        // params.append("OS_TYPE_ID", this.popup.popTxt.choosesystem.split(',')[0]);//故障原因
        // params.append("OS_TYPE", this.popup.popTxt.choosesystem.split(',')[1]);//故障原因
        // params.append("SYSTEM_TYPE_ID", this.popup.popTxt.choosesystemSub.split(',')[0]);//故障原因
        // params.append("SYSTEM_TYPE", this.popup.popTxt.choosesystemSub.split(',')[1]);//故障原因
        if(this.operationFileList.length>0){
          params.append("attachmentId", this.operationFileList[0].id); //任务编号
        }
        // if(this.updateFlag){
        //   this.updateFlag=!this.updateFlag;
        //   this.$axios.post("/fault/update", params).then((res) => {
        //     let data = res.data;
        //     if (data.code == 200) {
        //       this.$maskoff();
        //       this.$success("操作成功！");
        //       this.errorVisible = false;
        //       // this.updateFlag=false;
        //       this.clearAddData();
        //       this.loadData();
        //       this.assign.checkList = [];//初始化选中的数据
        //     }
        //   });
        // }else{
        //   this.$axios.post("/fault/submit", params).then((res) => {
        //     let data = res.data;
        //     if (data.code == 200) {
        //       this.$maskoff();
        //       this.$success("操作成功！");
        //       this.errorVisible = false;
        //       this.clearAddData();
        //       this.loadData();
        //       this.assign.checkList = [];//初始化选中的数据
        //     }
        //   });
        // }
        if(this.updateFlag){
          params.append("type",'update');
        }else{
          params.append("type",'add');
        }
        this.$axios.post("/fault/submit", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$maskoff();
            this.$success("操作成功！");
            this.errorVisible = false;
            this.clearAddData();
            this.operationFileList=[];
            this.loadData();
            this.updateFlag=false;
            this.assign.checkList = [];//初始化选中的数据
          }
        });
      },
      //控制台切换
      tabClick(val){
        this.calculateTabsHeight();
      },
      closeDialog(){
        this.assign.assignvisible = false;//分配任务的弹窗
        this.split.splitaddvisible = false;//拆分任务添加人员的弹窗
      },
      //清除新增新增的表单
      clearAddData(){
        for (let i in this.popup.popTxt) {
          this.popup.popTxt[i] = "";
        }
        for (let i in this.operate.operateTxt) {
          this.operate.operateTxt[i] = "";
        }
        let len=this.operate.systemAll.length-1;
        for (let i of this.operate.systemAll) {
          i.csty=''
        }
        this.operationFileList=[];
        this.operate.systemAll.splice(0,len);
        this.operate.system='';
        this.tabs.downName='';
      },
      //添加系统
      addsubStystem(index, e){
        let type = e.target.className
          if (type == "el-icon-plus") {
            if (!this.operate.systemAll[index].csty) {
              this.$warn("请先选择子系统");
              return
            }
            this.operate.systemAll.push({"fsty": "", "csty": ""});
          } else {
            this.operate.systemAll.splice(index, 1)
          }
      },
      setConsoleVisible(){
        this.clearAddData();
        this.tabs.consoleWrapperVisible = false;
        this.calculateTableHeight(false)
      },
      //驳回 确认操作
      consoleActionEvent(val, f){
        if (val == '同意') {
          console.log(typeof(this.operate.operateTxt.effectTime));
          console.log(/^[0-9]*$/gm.test(this.operate.operateTxt.effectTime));
          if(!/^[0-9]*$/gm.test(this.operate.operateTxt.effectTime)){
            this.$warn('影响时间请填写数字！');
            return
          }
          if (!this.operate.operateTxt.reasonValue) {
            this.$warn('请填写完整信息');
            return
          }
          if (!this.operate.operateTxt.effectScope) {
            this.$warn('请填写完整信息');
            return
          }
          if (!this.operate.operateTxt.solution) {
            this.$warn('请填写完整信息');
            return
          }
          if (!this.operate.operateTxt.reason) {
            this.$warn('请填写完整信息');
            return
          }
          if (!this.operate.operateTxt.time) {
            this.$warn('请填写完整信息');
            return
          }
          if (!this.operate.operateTxt.effectTime) {
            this.$warn('请填写完整信息');
            return
          }
          let nameArr = []
            let idArr = []
            for (let i of this.operate.systemAll) {
              let idTxt = i.csty.split(",")[0];//子系统id
              if (idArr.indexOf(idTxt) == -1) {
                idArr.push(i.csty.split(",")[0])
                  nameArr.push(i.csty.split(",")[1])
              }
              else {
                this.$warn('请选择不同的子系统')
                  return
              }
            }
          // if (idArr[0] == '') {
          //   this.$warn('请选择子系统')
          //     return
          // }
          let params = new URLSearchParams();
          if(this.operate.system2.length == 0){
            console.log(this.operate.system.SYSTEM_NAME);
            params.append("OS_TYPE", this.operate.system.SYSTEM_NAME); //id
            params.append("OS_TYPE_ID", this.operate.system.SYSTEM_ID); //id
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
          this.operate.operateTxt.time = new Date(Date.parse(this.operate.operateTxt.time)).format('yyyy-MM-dd');
          console.log(this.operate.operateTxt.time);
          console.log(typeof(this.operate.operateTxt.effectTime));
          params.append("REPAIR_TIME", this.operate.operateTxt.time);//预计修复时间
          params.append("INFLUENCE_TIME", this.operate.operateTxt.effectTime);//影响时间
          params.append("id", this.tabs.form.id);	//id
          params.append("reason", this.operate.operateTxt.reasonValue);	//成因
          params.append("reasonMark", this.operate.operateTxt.reason); //成因备注
          params.append("effectScope", this.operate.operateTxt.effectScope);	//影响范围
          params.append("solution", this.operate.operateTxt.solution);//解决方案
          params.append("systemTypeId", idArr);//子系统id
          params.append("systemType", nameArr);//分配人员
          params.append("type", 1);//子系统id
          this.$axios.post("/fault/audit", params).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.$success("操作成功！");
              this.operate.status='已完成';
              this.errorVisible = false;
              this.setConsoleVisible();
              this.loadData();
            }
            else{
              this.$warn(res.re);
              this.setConsoleVisible();
            }
          })
        }
        if(val == '确认' || val == '修改' || val == '完成' || val == 'reject'){
          if(val != 'reject' &&  val != '完成'){
            if (!this.popup.popTxt.priperty2) {
              this.$warn('请填写完整信息');
              return
            }
            if (!this.chief.opinion) {
              this.$warn('请填写完整信息');
              return
            }
          }
          if(val == '确认'){
            if (!this.popup.popTxt.fppeople){
              this.$warn('请选择分配人员');
              return
            }
          }
          let params = new URLSearchParams();
          switch(val){
            case '确认':
              params.append("opreateType", 1); //id
                break;
            case '修改':
              params.append("opreateType", 2); //id
                break;
            case '完成':
              params.append("opreateType", 3); //id
                break;
            case 'reject':
              params.append("opreateType", 4); //id
                break;
          }
          params.append("REVIEW_NAME", this.chief.opinion); //意见
          params.append("REVIEW_GRADE", this.popup.popTxt.priperty2);  //等级
          params.append("FAULT_ID", this.tabs.form.id);//故障id
          params.append("userIds", this.popup.popTxt.fppeople);//分配人员
          if (val == 'reject') {
            this.$prompt('请输入驳回原因', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {
                if(!value){
                  this.warn("清输入驳回意见！");
                  return
                }
                params.append("REJECTION", value);
                this.$axios.post("/fault/directorFaultAudit", params).then((res) => {
                console.log(res);
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
          else{
            this.$axios.post("fault/directorFaultAudit", params).then((res) => {
              console.log(res);
              if (res.data.code == 200) {
                this.$success("操作成功！");
                this.operate.status='已完成';
                this.errorVisible = false;
                this.setConsoleVisible();
                this.loadData();
              }
              else{
                this.$warn(res.data.result.re);
                this.setConsoleVisible();
              }
            })
          }

        }
        if(val == '舍弃' || val == '重新提交'){
          let params = new URLSearchParams();
          switch(this.popup.popTxt.priperty2){
            case 'S':
              this.popup.popTxt.priperty2 = 101;
                break;
            case 'A':
              this.popup.popTxt.priperty2 = 102;
                break;
            case 'B':
              this.popup.popTxt.priperty2 = 103;
                break;
            case 'C':
              this.popup.popTxt.priperty2 = 104;
                break;
            default:
              this.popup.popTxt.priperty2 = this.popup.popTxt.priperty2;
              break;
          }
          params.append("priperty", this.popup.popTxt.priperty2); //故障等级
          params.append("relationUser", this.tabsList.form.relationUser);  //故障分析人员
          params.append("description", this.tabsList.form.description);//故障描述
          params.append("descriptionEx", this.tabsList.form.descriptionEx);//故障复盘分析
          params.append("sumEffect", this.tabsList.form.sumEffect);//交易量影响
          params.append("type", 1);//类型
          params.append("title", this.tabsList.activeTableInfo.title);//标题
          params.append("id",this.tabsList.form.id);//问题ID
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
                this.$warn(data.message);
              }
            })
          }
          if(val == '重新提交'){
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
        if (val == '驳回') {
          let params = new URLSearchParams();
          params.append("id", this.tabs.form.id);
          params.append("type", 1);
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
          // this.$axios.post("/fault/reject", params).then((res) => {
          //   if (res.status == 200) {
          //     this.$success("操作成功！");
          //     this.errorVisible = false;
          //     this.operate.status='已驳回'
          //     this.setConsoleVisible();
          //     this.clearAddData();
          //     this.loadData();
          //   }
          //   else {
          //     this.warn(data.message);
          //   }
          // })
        }
        this.loadData();
      },
      //返回
      backPage(val){
        this.loadData();
        this.clearAddData();
        this.errorVisible = false
      }
    }
  }
</script>
<style scoped>
  @import "../../static/css/table.css";
  @import "../../static/css/console.css";

  .table-pagination{
    margin: 20px 0;
  }
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

  .console-tab-content .add {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    cursor: pointer;
    vertical-align: middle;
    /*margin-left:10px;*/
  }

  .col-div {
    position: relative;
  }

  .infoDiv {
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
