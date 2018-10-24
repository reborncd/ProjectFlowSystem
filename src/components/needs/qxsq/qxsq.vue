<template>
  <div class="jcjs common-card-wrap"
       @click="$event.target.className == 'icon-more iconfont'?'':tabs.consoleActionVisible = false">
    <el-card class="box-card">
      <div class="text item">
        <div class="content">
          <div class="action clear">
            <!-- <el-button type="danger"  size="mini" @click="dataHandle">数据抽取</el-button> -->
            <el-button type="danger"  size="mini" @click="powerApply">新增</el-button>
            <!-- <el-button type="danger"  size="mini" @click="eventApply">新增</el-button> -->
            <el-select v-model="selectValueOn" placeholder="请选择状态" @change="selectStatOn" clearable size="mini">
              <el-option :key="index" v-for="(item, index) in optionsOn" :label="item.STATE_NAME" :value="item.STATE_ID">
              </el-option>
            </el-select>
            <div class="fr">
              <div style="margin-right: 10px;" class="i-b">
                <el-date-picker @keyup.enter.native="searchHandle" v-model="dateRange" @blur="pickDate(dateRange)" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" align="right" size="mini"
                                :picker-options="dateComp">
                </el-date-picker>
              </div>
              <div class="search i-b">
                <el-input @keyup.enter.native="searchHandle" placeholder="请输入检索关键字" suffix-icon="icon-sousuo iconfont" v-model="keyword" size="mini"
                          clearable>
                </el-input>
              </div>
              <el-button
               size="medium"
               type="primary"
               @click="searchHandle"
              >查询</el-button>
            </div>
          </div>
          <!--表格部分-->
          <div class="table-list">
            <el-table :data="table.tableData" border style="width: 100%" v-if="table.tableHeight"
                      :height="table.tableHeight" ref="rcrw_table"
                      :default-sort = "{prop: 'neel_id', order: 'descending'}"
                      highlight-current-row :row-class-name="tableRowClassName" @row-click="handleCurrentChange">
              <el-table-column sortable prop="neel_id" label="任务编号" width="260" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="task_name" label="任务名称" width="160" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="create_time" label="申请时间" width="180"></el-table-column>
              <el-table-column sortable prop="apply_date" label="期望授权日期" width="180"></el-table-column>
              <el-table-column sortable prop="user_name" label="申请人" width="110"></el-table-column>
              <!-- <el-table-column sortable prop="rriority_NAME" label="优先级" width="110"></el-table-column> -->
              <!-- <el-table-column sortable prop="is_urgent" label="是否紧急" width="120" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="state_name" label="状态"></el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope" class="action-wrap">
                  <!-- 崔老师 -->
                  <el-button v-if="scope.row.col=='DEPT_LEADER_CHECK'" @click="agreeRow(scope.row,$event,'PASS')" size="small"
                             type="primary">通过
                  </el-button>
                  <el-button v-if="scope.row.col=='DEPT_LEADER_CHECK'" @click="unagreeRow(scope.row,$event,'驳回','REJECT')"
                             size="small" type="danger">驳回
                  </el-button>
                  <!-- 崔老师 -->
                  <!-- 桑玉珍 -->
                  <el-button v-if="scope.row.col=='QUALITY_DEPARTMENT_CHECK'" @click="assignRow(scope.row,$event)" size="small"
                             type="primary">分配
                  </el-button>
                  <el-button v-if="scope.row.col=='QUALITY_DEPARTMENT_CHECK'" @click="unagreeRow(scope.row,$event,'驳回','REJECT')"
                             size="small" type="danger">驳回
                  </el-button>
                  <!-- 桑玉珍 -->
                  <!-- 施展 -->
                  <el-button v-if="scope.row.col=='DATA_CENTER_CHECK'" @click="agreeRow(scope.row,$event,'PASS')" size="small"
                             type="primary">通过
                  </el-button>
                  <el-button v-if="scope.row.col=='DATA_CENTER_CHECK'" @click="unagreeRow(scope.row,$event,'驳回','REJECT')"
                             size="small" type="danger">驳回
                  </el-button>
                  <el-button v-if="scope.row.col=='DATA_CENTER_EXECUTE'" @click="TaskProcess(scope.row,$event)"
                             size="small" type="primary">确认结果
                  </el-button>
                  <!-- 施展 -->
                  <!-- 申请人签收 -->
                  <el-button v-if="scope.row.col=='APPLY_CONFIRM'" @click="applyCheckHandle(scope.row,$event,'PASS')"
                             size="small" type="primary">验收
                  </el-button>
                  <!-- 申请人签收 -->
                  <!-- 申请人修改 -->
                  <el-button v-if="scope.row.col=='APPLY_RECOMMIT'" @click="updateEvent(scope.row,$event,'APPLY_RECOMMIT')"
                             size="small" type="primary">修改
                  </el-button>
                  <el-button v-if="scope.row.col=='APPLY_UPDATE'" @click="updateEvent(scope.row,$event,'UPDATE')"
                             size="small" type="primary">修改
                  </el-button>
                  <!-- 申请人修改 -->
                  <!-- 申请人撤回 -->
                  <el-button v-if="scope.row.col=='APPLY_UPDATE' || scope.row.col=='APPLY_RECOMMIT'" @click="cancelPower(scope.row,$event,'CANCEL')"
                             size="small" type="primary">撤回
                  </el-button>
                  <!-- 申请人撤回 -->
                  <!-- <el-button v-if="scope.row.check_TYPE=='TECH_MANAGER_SPLIT'" @click="assignRow(scope.row,$event)" size="small"
                             type="primary">需求分析
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='TECH_MANAGER_SPLIT'" @click="unagreeRow(scope.row,$event,'驳回')"
                             size="small" type="danger">驳回
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='APPLY_RECOMMIT'" @click="updateNeeds(scope.row,$event)"
                             size="small" type="primary">修改
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='APPLY_CONFIRM'" @click="Finished(scope.row,$event)"
                             size="small" type="primary">验收
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='DEVELOPING'" @click="TaskProcess(scope.row,$event)"
                             size="small" type="primary">任务处理
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='DATA_CENTER_CHECK'" @click="DateCenter(scope.row,$event)"
                             size="small" type="primary">通过
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='DATA_CENTER_CHECK'" @click="unagreeRow(scope.row,$event,'驳回','finished')"
                             size="small" type="primary">驳回
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='REJECT_AND_UPDATE_DEVELOP'" @click="DevUpdate(scope.row,$event)"
                             size="small" type="primary">重新提交
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='QUALITY_DEPARTMENT_CHECK'" @click="TaskProcess(scope.row,$event)"
                             size="small" type="primary">审核
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='QUALITY_DEPARTMENT_CHECK'" @click="unagreeRow(scope.row,$event,'驳回','finished')"
                             size="small" type="primary">驳回
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='DATA_CENTER_EXECUTE'" @click="TaskProcess(scope.row,$event)"
                             size="small" type="primary">确认结果
                  </el-button>
                  <el-button v-if="scope.row.check_TYPE=='review'" @click="review(scope.row,$event)" size="middle"
                             type="primary">需求评审
                  </el-button> -->
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
            <div class="console-action-wrapper">
              <i class="el-icon-close close" @click="setConsoleVisible"></i>
            </div>
            <el-tabs v-model="tabs.activeName" type="card" @tab-click="tabClick">
              <el-tab-pane label="详情页" name="info">
                <div class="console-tab-content">
                  <el-form label-width="150px" label-position="left">
                    <el-row :gutter="20">
                      <el-row :span="12">
                        <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">事件详情</div>
                      </el-row>
                      <el-col :span="12">
                        <el-form-item label="任务编号">{{tabs.data_one.neel_id}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="任务名称">{{tabs.data_one.task_name}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请来源">{{tabs.data_one.dept_name}}-{{tabs.data_one.user_name}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请类型">{{tabs.data_one.apply_type}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="权限类型">{{tabs.data_one.rights_type}}<span v-if="!!tabs.data_one.rights_type_other">({{tabs.data_one.rights_type_other}})</span></el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="申请地址"><span>{{tabs.data_one.changeSystems}}</span></el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="权限使用人">{{tabs.data_one.rights_user}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="联系电话">{{tabs.data_one.mobile_no}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请授权日期">{{tabs.data_one.apply_date}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请时间">{{tabs.data_one.apply_time}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.valid_date">
                        <el-form-item label="到期时间">{{tabs.data_one.valid_date}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请原因">{{tabs.data_one.apply_reason}}</el-form-item>
                      </el-col>
                      <!-- <el-col :span="12">
                        <el-form-item label="是否紧急">{{tabs.data_one.is_urgent}}</el-form-item>
                      </el-col> -->
                      <el-col :span="12" v-if="tabs.data_one.attachments.length">
                        <el-form-item label="附件">
                          <template>
                            <span v-for="(item,index) in tabs.data_one.attachments" :key="index" style="color: #409EFF; cursor:pointer;margin-right:10px;" @click="downloadAtt(item.id)">{{item.name}}</span>
                            <!-- <div style="color: #409EFF; cursor:pointer;" @click="downloadAtt(tabs.data_one.attachments[0].id)">{{tabs.data_one.attachments[0].name}}</div> -->
                          </template>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.data_one.reject_reason">
                        <el-form-item label="驳回原因"><span style="color:red;">{{tabs.data_one.reject_reason}}</span></el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-form label-width="150px" v-for="(item,index) in tabs.data_one.onlineInfoConfirm" :key="index" label-position="left" v-if="tabs.data_one.onlineInfoConfirm.length>0">
                    <el-row :gutter="20">
                      <el-row :span="12">
                        <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">运维详情</div>
                        <el-col :span="12">
                          <el-form-item label="执行人员">{{item.confirm_NAME}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="执行结果">{{item.status}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="item.remarks">
                          <el-form-item label="事件记录">{{item.remarks}}</el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="item.actual_online_time">
                          <el-form-item label="实际上线时间">{{item.actual_online_time}}</el-form-item>
                        </el-col>
                      </el-row>
                    </el-row>
                  </el-form>
                  <el-form v-if="tabs.data_one.result" label-width="150px" label-position="left">
                    <el-row :span="12">
                        <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">验收结果</div>
                        <el-col :span="12">
                          <el-form-item label="验收结果"><span style="color:red;">{{tabs.data_one.result}}</span></el-form-item>
                        </el-col>
                      </el-row>
                  </el-form>
                </div>
              </el-tab-pane>

              <el-tab-pane label="操作台" name="console">
                <div class="console-tab-content">
                  <el-form label-width="60px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12" :sm="12">
                        <el-form-item label="状态：">
                          <span style="color: red">{{tabs.state_name}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :sm="12">
                        <el-form-item label="发送人：" label-width="100px">
                          {{tabs.user_NAME}}
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <!-- 开发人员操作台 -->
                  <!-- <el-form :model="consoleData" label-width="120px" label-position="left" v-if="tabs.data_one.daliy.check_TYPE=='DEVELOPING' || tabs.data_one.daliy.check_TYPE=='REJECT_AND_UPDATE_DEVELOP'">
                    <div style="text-align:left;font-size:18px;color:#000;">数据源</div>
                      <el-row class="subItem" v-for="(item, index) in consoleData.changeSystemJson" :key="index">
                        <el-col
                          v-for="myitem in [{name: '系统名称', mykey: 'SYSTEM_NAME'}, {name: 'IP地址', mykey: 'IP_ADDRESS'}]"
                          :span="7"
                          :key="myitem.name">
                          <el-form-item :label="myitem.name">
                            <el-input size="mini" v-model="consoleData.changeSystemJson[index][myitem.mykey]" :placeholder="`请输入${myitem.name}`"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <i
                            @click="changeObjectClick(index)"
                            :class="`anticon icon-${index === 0? 'plus': 'minus'}squareo`"
                            style="font-size: 32px; color: blue; margin-left: 15px">
                          </i>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-form-item label="数据类型">
                          <MyCheckboxComp
                            v-if="consoleInfoData.dataType.length"
                            :selectData="consoleData.ORI_DATA_TYPE"
                            :inputData="consoleData.ori_other_data_type"
                            :config="['ORI_DATA_TYPE', 'ori_other_data_type']"
                            @updateData="updateData"
                            :itemList="consoleInfoData.dataType">
                          </MyCheckboxComp>
                          </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="数据路径">
                          <el-input size="mini" v-model="consoleData.ORI_DATA_PATH"></el-input>
                        </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="敏感信息">
                          <MyCheckboxComp
                            v-if="consoleInfoData.sensitiveData.length"
                            :selectData="consoleData.ORI_SENSITIVE_DATA"
                            :config="['ORI_SENSITIVE_DATA']"
                            @updateData="updateData"
                            :itemList="consoleInfoData.sensitiveData">
                          </MyCheckboxComp>
                          </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="是否脱敏">
                          <el-radio-group v-model="consoleData.IS_HIDDEN_SENSITIVE_DATA">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="脱敏方式">
                          <MyCheckboxComp
                            v-if="consoleInfoData.sensitiveWay.length"
                            :selectData="consoleData.HIDDEN_WAY"
                            :config="['HIDDEN_WAY']"
                            @updateData="updateData"
                            :itemList="consoleInfoData.sensitiveWay">
                          </MyCheckboxComp>
                          </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="其他说明:">
                          <el-input size="mini" v-model="consoleData.ORI_REMARKS"></el-input>
                        </el-form-item>
                      </el-row>
                      <div style="text-align:left;font-size:18px;color:#000;">数据目标</div>
                      <el-row class="subItem" v-for="(item, index) in consoleData.changeSystemJson_target" :key="index">
                        <el-col
                          v-for="myitem in [{name: '系统名称', mykey: 'SYSTEM_NAME'}, {name: 'IP地址', mykey: 'IP_ADDRESS'}]"
                          :span="7"
                          :key="myitem.name">
                          <el-form-item :label="myitem.name">
                            <el-input size="mini" v-model="consoleData.changeSystemJson_target[index][myitem.mykey]" :placeholder="`请输入${myitem.name}`"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2">
                          <i
                            @click="changeObjectClickTarget(index)"
                            :class="`anticon icon-${index === 0? 'plus': 'minus'}squareo`"
                            style="font-size: 32px; color: blue; margin-left: 15px">
                          </i>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-form-item label="数据路径">
                          <el-input size="mini" v-model="consoleData.DES_DATA_PATH"></el-input>
                        </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="其他说明:">
                          <el-input size="mini" v-model="consoleData.DES_REMARKS"></el-input>
                        </el-form-item>
                      </el-row>
                      <div style="text-align:left;font-size:18px;color:#000;">数据风险</div>
                      <el-row>
                        <el-form-item label="风险等级:">
                          <el-radio-group v-model="consoleData.RISK_LEVEL">
                            <el-radio
                              v-for="item in consoleInfoData.riskLevel"
                              :key="item.id"
                              :label="parseInt(item.id)">
                              {{item.name}}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="风险说明:">
                          <el-input size="mini" v-model="consoleData.RISK_DESC"></el-input>
                        </el-form-item>
                      </el-row>
                      <el-row>
                        <el-form-item label="控制措施:">
                          <el-input size="mini" v-model="consoleData.RISK_MEASURE"></el-input>
                        </el-form-item>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="上传附件(必填):">
                            <el-upload
                              :limit="1"
                              :action="`${baseUrl}/daily/upload?token=${$getToken()}`"
                              :on-success="uploadFileSuccess"
                              auto-upload
                              :on-preview="uploadFileClick"
                              :on-exceed="uploadFileOut"
                              :on-remove="uploadClear"
                              :file-list="consoleData.fileList">
                              <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="实际工时(小时):">
                            <el-input size="mini" v-model="consoleData.ACTUAL_WORK_TIME"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                  </el-form> -->
                  <!-- <el-form label-width="120px" label-position="left" v-if="tabs.data_one.daliy.check_TYPE=='DEVELOP_MANAGER_CHECK'">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="评审等级">
                          <el-select v-model="tabs.rriority" clearable placeholder="请选择评审等级">
                            <el-option :key="index" v-for="(item, index) in tabs.rriorityArr" :label="item.RRIORITY_NAME"
                            :value="item.RRIORITY_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求评审结果">
                          <el-select v-model="tabs.checks" clearable placeholder="请选择需求评审结果">
                            <el-option :key="index" v-for="(item, index) in tabs.checksArr" :label="item.CHECK_NAME"
                                       :value="item.CHECK_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="评审时间">
                          <el-date-picker type="date"
                                          placeholder="选择评审日期" v-model="tabs.check_time"
                                          style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="assign.checkList.length > 0">
                          <el-form-item label="人员列表">
                            <el-button
                              type="text"
                              v-for="(item, index) in assign.checkList"
                              :key="item"
                              >
                              {{item.split('-')[1]}}
                              <i class="el-icon-close el-icon--right" @click="assign.checkList.splice(index, 1)"> </i>
                            </el-button>
                          </el-form-item>
                        </el-col>
                    </el-row>
                  </el-form> -->
                  <!-- <el-form v-if="tabs.data_one.daliy.check_TYPE=='TECH_MANAGER_SPLIT'" label-width="120px" label-position="right">
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
                    <div>
                    <div style="margin: 10px 0" class="clear">
                      <el-button style="float: right;" type="primary" @click="addsplitperson"
                             size="mini">新增人员
                      </el-button>
                    </div>
                    <div class="table-list">
                      <el-table :data="addneeds.addform.splitArr" border style="width: 100%">
                        <el-table-column prop="USER_NAME" label="人员" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="DALIY_INFO_ID" label="任务编码" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="RESPONSIBLE_MODULE" show-overflow-tooltip label="负责模块"></el-table-column>
                        <el-table-column prop="EXPECT_TIME" label="预计用时" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button size="mini" type="danger"
                                   @click="splitDelete(scope.$index, scope.row)">删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  </el-form>
                  <el-form v-if="tabs.data_one.daliy.check_TYPE=='DATA_CENTER_EXECUTE'" label-width="120px" label-position="right">
                    <el-row>
                      <el-form-item label="执行结果">
                        <el-select
                          v-model="operationResult"
                          filterable
                          clearable
                          placeholder="请选择执行结果">
                          <el-option label="成功" value="1"></el-option>
                          <el-option label="失败" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="上传附件(选填):">
                        <el-upload
                          :limit="1"
                          :action="`${baseUrl}/daily/upload?token=${$getToken()}`"
                          :on-success="uploadFileSuccessOperation"
                          auto-upload
                          :on-preview="uploadFileClick"
                          :on-exceed="uploadFileOut"
                          :on-remove="uploadClearOperation"
                          :file-list="operationFileList">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="备注(选填)">
                        <el-input v-model="operationRemarks"></el-input>
                      </el-form-item>
                    </el-row>
                  </el-form> -->
                  <!--操作按钮-->
                  <div class="tab-console-handler">
                      <div v-if="assignList.length > 0" style="margin-right:15px;">已分配人员</div>
                      <el-button
                        type="text"
                        v-for="(item, index) in assignList"
                        :key="item"
                        >
                        {{item.split('-')[1]}}
                        <i class="el-icon-close el-icon--right" @click="assignList.splice(index, 1)"> </i>
                      </el-button>
                      <el-button v-if="tabs.data_one.col=='QUALITY_DEPARTMENT_CHECK'" @click="assignOperation" size="medium" type="primary">分配</el-button>
                      <el-button v-if="tabs.data_one.col=='QUALITY_DEPARTMENT_CHECK'" @click="QualityCheck" size="medium" type="primary">通过</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="全程跟踪" name="log">
                <div class="console-tab-content">
                  <el-form label-width="60px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="6" :sm="6">
                        <el-form-item label="状态：">
                          <span style="color: red">{{tabs.state_name}}</span>
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
                          style="width: 180px;display: inline-block;">{{item.record_START | time}}</span>{{item.record_DESC}}
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
    <!--产品经理-->
    <el-dialog :close-on-click-modal="false" title="数据抽取" :visible="addneeds.addvisibleP" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialog">
      <el-form label-width="100px">
        <el-row :md="24" :gutter="20">
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="任务编号">
              <el-input v-model="addneeds.addform.code" disabled></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12" :md="12">
            <el-form-item label="任务名称">
              <el-input maxlength="64" v-model="addneeds.addform.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请人">
              <el-input disabled v-model="addneeds.addform.sxname"></el-input>
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
                           :value="item.user_ID+'-'+item.user_NAME"></el-option>
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
            <el-form-item label="期望完成日期">
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
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="需求划分归属">
              <el-select v-model="addneeds.addform.ascription" clearable placeholder="请选择需求划分归属" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.ascriptionArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="需求影响面">
              <el-select v-model="addneeds.addform.influece" clearable placeholder="请选择需求影响面" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.influeceArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="成果类型">
              <el-select v-model="addneeds.addform.result" clearable placeholder="请选择成果类型" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.resultArr" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="需求类型">
              <el-select v-model="addneeds.addform.daliyTypeName" clearable placeholder="请选择需求类型" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.daliyTypeNameArr" :label="item.NEEL_TYPE_NAME+'-'+item.TYPE"
                           :value="item.NEEL_TYPE_NAME+'-'+item.TYPE"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24" :md="24">
            <el-form-item label="产品改造点">
              <v-vueQuillEditor-changepoint
                :changepoint="addneeds.addform.prduct_function" @setValue="setValue_changepoint">
              </v-vueQuillEditor-changepoint>
            </el-form-item>
          </el-col> -->
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
          <!-- <el-col :span="24" :md="24">
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
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="createNew2" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限申请 -->
    <el-dialog :close-on-click-modal="false" title="权限申请" :visible="addpower.visiable" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialog">
      <el-form label-width="100px">
        <el-row :md="24" :gutter="20">
          <el-col :span="12" :md="12">
            <el-form-item label="审批单编号">
              <el-input disabled maxlength="64" v-model="addpower.form.neel_id"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="提交日期">
              <el-date-picker type="date" @change="changeEnd" placeholder="选择日期" v-model="addneeds.addform.applyDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="任务名称">
              <el-input maxlength="64" v-model="addpower.form.task_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="申请类型">
              <!-- <el-select
                  v-model="addpower.form.applyType"
                  placeholder="请选择申请类型"
                  clearable
                  filterable
                  multiple
              >
                <el-option
                  v-for="item in addpower.applyTypeArr"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select> -->
              <MyCheckboxComp
                :selectData="addpower.form.applyType"
                :config="['applyType']"
                @updateData="updateDataPower"
                :itemList="addpower.applyTypeArr"
                :flag="checkBox_flag">
              </MyCheckboxComp>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="权限类型">
              <MyCheckboxComp
                :selectData="addpower.form.powerType"
                :inputData="addpower.form.powerTypeOther"
                :config="['powerType','powerTypeOther']"
                @updateData="updateDataPower"
                :itemList="addpower.powerTypeArr"
                :flag="checkBox_flag">
              </MyCheckboxComp>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请人">
              <el-input disabled v-model="addpower.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请人部门">
              <el-select disabled v-model="addpower.form.fromdeptId" style="width: 100%;" clearable placeholder="请选择需求提出部门"
                         @change="fromdeptchange">
                <el-option :key="index" v-for="(item, index) in addpower.fromdeptArr" :label="item.dept_name"
                           :value="item.dept_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="权限使用人">
              <el-input v-model="addpower.form.rights_user"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="联系电话">
              <el-input v-model="addpower.form.mobile_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请授权日期">
              <el-date-picker value-format="yyyy-MM-dd" type="date" @change="changeEnd" placeholder="选择日期" v-model="addpower.form.apply_date"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请时间">
              <el-radio v-model="addpower.form.apply_time" label="40">永久</el-radio>
              <el-radio v-model="addpower.form.apply_time" label="41">临时</el-radio>
              <span style="font-size:12px;" v-if="addpower.form.apply_time=='41'">（临时默认时间为申请日起30天内）</span>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="申请原因:">
              <el-input v-model="addpower.form.apply_reason"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="subItem" v-for="(item, index) in addpower.form.applySystemInfo" :key="index">
            <div v-show="index=='0'">申请访问生产环境:</div>
            <el-col
              v-for="myitem in [{name: 'IP地址', mykey: 'IP_ADDRESS'}, {name: '系统用户名称', mykey: 'SYSTEM_NAME'}]"
              :span="7"
              :key="myitem.name">
              <el-form-item :label="myitem.name">
                <el-input size="mini" v-model="addpower.form.applySystemInfo[index][myitem.mykey]" :placeholder="`请输入${myitem.name}`"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <i
                @click="changeObjectClickApply(index)"
                :class="`anticon icon-${index === 0? 'plus': 'minus'}squareo`"
                style="font-size: 32px; color: blue; margin-left: 15px">
              </i>
            </el-col>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="上传附件:">
              <el-upload
                :action="`${baseUrl}/daily/upload?token=${$getToken()}&&neelId=${addpower.form.neel_id}`"
                :on-success="uploadFileSuccessOperation"
                auto-upload
                :on-preview="uploadFileClick"
                :on-exceed="uploadFileOut"
                :on-remove="uploadClearOperation"
                :file-list="operationFileList">
                <el-button size="small" type="primary">点击上传(选填)</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="权限说明:">
              <span style="color:red;">生产环境访问账号及临时远程访问账号仅供申请人本人使用，申请人不得将以上账号泄露他人，不得将以上账号提供他人使用，申请人对以上账号产生的所有操作内容负责。</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="powerApplyHandle" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限申请 -->
    <!-- 事件受理 -->
    <el-dialog :close-on-click-modal="false" title="事件受理" :visible="addEvent.visiable" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialog">
      <el-form label-width="100px">
        <el-row :md="24" :gutter="20">
          <el-col :span="12" :md="12">
            <el-form-item label="工单编号">
              <el-input disabled v-model="addEvent.form.neel_id"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" :md="12">
            <el-form-item label="事件申请时间">
              <el-date-picker type="date" @change="changeEnd" placeholder="选择日期" v-model="addneeds.addform.applyDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="任务名称">
              <el-input clearable maxlength="64" v-model="addEvent.form.task_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="提交人姓名">
              <el-input disabled v-model="addEvent.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="提交人电话">
              <el-input clearable v-model="addEvent.form.mobile_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求提出部门">
              <el-select v-model="addEvent.form.fromdeptId"
                     filterable clearable  placeholder="请选择部门"
                     style="width: 100%" @change="fromdeptchangeEvent">
                <el-option v-for="item in addEvent.fromdeptArr" :label="item.dept_name" :key="item.dept_id"
                       :value="item.dept_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求提出人">
              <el-select v-model="addEvent.form.apply_id"  filterable clearable  placeholder="请选择人员"
                     style="width: 100%;">
                <el-option v-for="item in addEvent.fromdeptroleArr" :label="item.user_NAME" :key="item.user_ID"
                       :value="item.user_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="是否紧急">
              <el-radio v-model="addEvent.form.is_urgent"  :label="20">常规</el-radio>
              <el-radio v-model="addEvent.form.is_urgent"  :label="19">紧急</el-radio>
              <!-- <el-input v-if="consoleData.CHANGE_TYPE==1" size="mini" v-model="consoleData.URGENT_DESC" placeholder="请填写加急原因"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="计划完成时间">
              <el-date-picker value-format="yyyy-MM-dd" type="date" @change="changeEnd" placeholder="选择日期" v-model="addEvent.form.finish_time"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="事件来源">
              <MyCheckboxComp
                :selectData="addEvent.form.eventFrom"
                :inputData="addEvent.form.eventFromOther"
                :config="['eventFrom','eventFromOther']"
                @updateData="updateDataEvent"
                :itemList="addEvent.eventFromArr"
                :flag="checkBox_flag">
              </MyCheckboxComp>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="事件类型">
              <MyCheckboxComp
                :selectData="addEvent.form.eventType"
                :inputData="addEvent.form.eventTypeOther"
                :config="['eventType','eventTypeOther']"
                @updateData="updateDataEvent"
                :itemList="addEvent.eventTypeArr"
                :flag="checkBox_flag">
              </MyCheckboxComp>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="width:100%;" :md="12">
            <el-form-item label="事件描述:">
              <el-input type="textarea" clearable maxlength="1000" v-model="addEvent.form.event_desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="eventApplyHandle" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 事件受理 -->
    <!--拆分任务-->
    <el-dialog :close-on-click-modal="false" title="新增拆分任务人员" :visible="addneeds.splitaddvisible" width="60%" append-to-body modal-append-to-body
               :before-close="closeDialogS">
      <el-form label-width="120px">
        <el-form-item label="任务编码">
          <el-input v-model="split.taskcode" disabled></el-input>
        </el-form-item>
        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="负责模块">
              <el-input v-model="addneeds.addform.splitForm.fzmodule"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员">
              <el-select v-model="addneeds.addform.splitForm.name" placeholder="请选择人员">
                <!-- <el-option-group :key="index" v-for="(group, index) in addneeds.addform.frompeopleArr" :label="group.dept_name">
                  <el-option :key="`${index}h`" v-for="(item, index) in group.users" :label="item.user_NAME"
                             :value="item.user_ID+','+item.user_NAME">
                  </el-option>
                </el-option-group> -->
                <el-option :key="`${index}h`" v-for="(item, index) in addneeds.addform.frompeopleArr" :label="item.user_NAME"
                             :value="item.user_ID+','+item.user_NAME">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="子系统名">
              <el-select v-model="addneeds.addform.splitForm.xtname" clearable placeholder="请选择子系统"
                         style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.splitForm.fzmoduleArr" :label="item.SYSTEM_NAME"
                           :value="item.SYSTEM_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="12">
            <el-form-item label="难易程度">
              <el-select v-model="addneeds.addform.splitForm.easy" clearable placeholder="请选择难易程度" style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.easyArr" :label="item.FACILITY_NAME"
                           :value="item.FACILITY_ID+','+item.FACILITY_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="完成日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="addneeds.addform.splitForm.allDate"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="预计用时(小时)">
              <el-input v-model="addneeds.addform.splitForm.willTime"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="任务量">
              <el-input v-model="addneeds.addform.splitForm.taskNum"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogS" size="mini">取 消</el-button>
        <el-button type="primary" @click="addOneTask" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!------------控制台拆分-------------->
    <el-dialog :close-on-click-modal="false" title="新增拆分任务人员" :visible="addneeds.splitaddvisibleN" width="60%" append-to-body modal-append-to-body
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
    <el-dialog :close-on-click-modal="false" title="拆分任务详情" :visible="addneeds.hasSplitvisible" width="80%" append-to-body modal-append-to-body
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
          <el-table-column prop="daliy_INFO_ID" label="任务名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="user_NAME" label="人员"></el-table-column>
          <el-table-column prop="responsible_MODULE" label="负责模块" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="''+end_DATE" :formatter="splitDataFormatter" label="完成日期"
                           width="110"></el-table-column> -->
          <el-table-column prop="expect_TIME" label="预计用时" width="110"></el-table-column>
          <!-- <el-table-column prop="workload" label="任务量" width="70"></el-table-column> -->
        </el-table>
      </div>
    </el-dialog>

    <!--确认-->
    <el-dialog :close-on-click-modal="false" title="确认" :visible="assign.assignvisible" width="30%" append-to-body modal-append-to-body
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
        <el-button type="primary" @click="subAssign" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="权限申请"
      append-to-body
      :visible.sync="operationHandle.visiable">
      <el-form label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="处理结果:" style="height: 42px">
              <el-radio v-model="operationResult" label="1">成功</el-radio>
              <el-radio v-model="operationResult" label="0">失败</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际处理时间:">
              <el-date-picker
                v-model="operationTime"
                type="datetime"
                style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="事件记录:">
              <el-input type="textarea" maxlength="500" v-model="operationRemarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="operationHandle.visiable = false">取 消</el-button>
        <el-button size="small" type="primary" @click="OperationCheck">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="申请人验收"
      append-to-body
      :visible.sync="applyCheck">
      <el-form label-width="110px">
        <el-form-item label="" style="height: 42px">
              <el-row :span="24">
                <el-col :span="6" :md="6">
                  <el-radio style="margin-left:30px;" v-model="applyResult" label="0" >完成，与目标一致</el-radio>
                  <el-radio v-model="applyResult" label="1" >完成，接受建议解决方案</el-radio>
                  <el-radio v-model="applyResult" label="2" >未完成，关闭事件，原因： <el-input maxlength="100" placeholder="请输入原因" v-model="failReason" v-if="applyResult=='2'"></el-input></el-radio>
                  <el-radio v-model="applyResult" label="3" >未完成，继续处理，原因： <el-input maxlength="100" placeholder="请输入原因" v-model="failReason" v-if="applyResult=='3'"></el-input></el-radio>
                  <el-radio v-model="applyResult" label="4" >取消事件，原因： <el-input maxlength="100" placeholder="请输入原因" v-model="failReason" v-if="applyResult=='4'"></el-input></el-radio>
                </el-col>
              </el-row>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="applyCheck = false">取 消</el-button>
        <el-button size="small" type="primary" @click="applyCheckSure">确 定</el-button>
      </span>
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
    <!--质量部分配-->
    <SelectUser
      v-if="assignvisible"
      :panelVisible.sync='assignvisible'
      :panelTip='panelTip'
      :myurl='myurl'
      v-on:message='subAssignQuality'
    ></SelectUser>
    <!-- 崔老师分配 -->
    <SelectUser
      v-if="assignvisible_tech"
      :panelVisible.sync='assignvisible_tech'
      :panelTip='panelTip_tech'
      :myurl='myurl_tech'
      v-on:message='subAssign_tech'
    ></SelectUser>
  </div>
</template>
<script>
  import vueQuillEditor_reform from '../common/vueQuillEditor_reform.vue';//需求背景
  import vueQuillEditor_changepoint from '../common/vueQuillEditor_changepoint.vue';//产品改造点
  import vueQuillEditor_needsname from '../common/vueQuillEditor_needsname.vue';//需求描述
  import download from "../common/download.vue";//下载弹窗
  import tracking from "../common/tracking.vue";//全程跟踪视图模式
  import uploadN from  "../common/uploadN.vue";//上传
  import MyCheckboxComp from '../../common/MyCheckboxComp.vue'
  import SelectUser from '../../common/SelectUser.vue';
  import moment from 'moment';
  //上传附件组件
  export default {
    data() {
      return {
        operationHandle:{
          visiable:false,
        },
        applyCheck:false,
        failReason:'',
        applyResult:'',
        operationResult:'',
        operationFileList:[],
        operationRemarks:'',
        operationTime:'',
        confirm_id:'',
        confirm_name:'',
        confirm_id_tech:'',
        confirm_name_tech:'',
        assignvisible: false,
        myurl: '',
        panelTip: {},
        assignvisible_tech: false,
        myurl_tech: '',
        panelTip_tech: {},
        assignList:[],
        baseUrl:window._options.baseUrl,
        consoleInfoData:{
          dataType:[
            {id:'2',name:'数据库数据'},
            {id:'3',name:'配置文件'},
            {id:'4',name:'账务文件'},
            {id:'5',name:'日志文件'},
            {id:'6',name:'密钥信息'},
            {id:'7',name:'其它'},
          ],
          sensitiveData:[
            {id:'8',name:'持卡人个人信息'},
            {id:'9',name:'卡号'},
            {id:'10',name:'交易记录'},
            {id:'11',name:'系统用户及口令'},
            {id:'12',name:'密钥明文'}
          ],
          sensitiveWay:[
            {id:'13',name:'自动化脚本'},
            {id:'14',name:'操作手册'}
          ],
          riskLevel:[
            {id:'16',name:'高风险'},
            {id:'17',name:'中风险'},
            {id:'18',name:'低风险'}
          ]
        },
        addpower:{
          isEdit:false,
          visiable:false,
          fromdeptArr:[],
          applyTypeArr:[
            { id : 32, name : '新增用户及授权'},
            { id : 33, name : '授权范围变更'},
            { id : 34, name : '撤销用户及授权'},
            { id : 35, name : '证书'}
          ],
          powerTypeArr:[
            { id : 36, name : '服务器'},
            { id : 37, name : 'VPN'},
            { id : 38, name : 'SVN'},
            { id : 39, name : 'GitLab'},
            { id : 7, name : '其他'}
          ],
          form:{
            neel_id:'',
            task_name:'',
            apply_date:'',
            applyType:[],
            powerType:[],
            user_id:'',
            rights_user:'',
            mobile_no:'',
            apply_time:'',
            apply_reason:'',
            powerTypeOther:'',
            fromdeptId:'',
            applySystemInfo: [{
              IP_ADDRESS: '',
              SYSTEM_NAME: ''
            }],
            // TODO
          }
        },
        updateType:'',//修改类型
        addEvent:{
          isEdit:false,
          visiable:false,
          fromdeptArr:'',
          fromdeptroleArr:'',
          eventFromArr:[
            { id : 21, name : '外部申请'},
            { id : 22, name : '内部申请'},
            { id : 23, name : '自动监控'},
            { id : 24, name : '人工检查'},
            { id : 7, name : '其他'}
          ],
          eventTypeArr:[
            { id : 26, name : '故障申告'},
            { id : 27, name : '系统告警'},
            { id : 28, name : '网络安全'},
            { id : 29, name : '服务器申请'},
            { id : 30, name : '内存条等PC配件申请'},
            { id : 31, name : '服务域名等开通类事件器申请'},
            { id : 25, name : '服务请求'},
            { id : 7, name : '其他'},
          ],
          form:{
            neel_id:'',//工单编号
            task_name:'',//任务名称
            user_id:'',//用户id
            mobile_no:'',//用户手机号
            apply_id:'',//申请人id
            is_urgent:'',//是否紧急
            finish_time:'',//计划完成时间
            event_desc:'',//时间描述
            eventFrom:[],
            eventFromOther:'',
            eventType:[],
            eventTypeOther:''
          }
        },
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
          "neel_id": ''
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
          check_time:'',//需求评审时间
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
        },
        state_id:'',//流程id
        consoleData:{},
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 15,
        maxPageNumber: null,
        total:'',
        homeDisabled:false,
        prevDisabled:false,
        nextDisabled:false,
        endDisabled:false,
        checkBox_flag:false,
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
      "uploadN": uploadN,//上传文件
      "MyCheckboxComp":MyCheckboxComp,//多选框
      "SelectUser":SelectUser//分配人员

    },
    mounted() {
      this.loadData()
      this.initData()
    },
    computed:{
      computedValue:function(){
        let type=true;
        if(!this.screenKey.STATE && this.keyword == "" && !this.dateRange){
          type=false;
        }else{
          type=true;
        }
        return type
      }
    },
    watch:{
      computedValue:function(value,old){
        console.log(value)
        !value && this.loadData();
      }
    },
    methods: {
      updateData(val){
        this.consoleData[val[0]] = val[1];
      },
      updateDataEvent(val){
        this.addEvent.form[val[0]] = val[1];
      },
      updateDataPower(val){
        this.addpower.form[val[0]] = val[1];
      },
      uploadFileSuccess(res){
        console.log(res+'上传附件')
        // 上传附件
        if(res.code === 200 && res.result.code === 200){
          this.consoleData.fileList.push({
            name: res.result.name,
            id: res.result.id,
            url: `${window._options.baseUrl}/online/download?token=${this.$getToken()}&id=${res.result.id}`
          });
        }else{
          this.$message.error(res.message);
        }
      },
      uploadFileSuccessOperation(res){
        if(res.code === 200 && res.result.code === 200){
          this.operationFileList.push({
            name: res.result.name,
            id: res.result.id,
            url: `${window._options.baseUrl}/online/download?token=${this.$getToken()}&id=${res.result.id}`
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
      uploadClear(){
        // 清空上传列表
        this.consoleData.fileList=[];
      },
      uploadClearOperation(e){
        let arr=[];
        this.operationFileList.forEach(item=>{
          if(item!==e){
            arr.push(item);
          }
        })
        this.operationFileList=arr;
        // this.operationFileList=[];
      },
      initData(){
          this.consoleData = {
            ACTUAL_WORK_TIME: '', // 实际工时
            ORI_DATA_TYPE:[], // 源数据类型
            ori_other_data_type:'',//源数据其他类型
            ORI_DATA_PATH:'', // 源数据路径
            ORI_SENSITIVE_DATA:[], // 源敏感信息
            IS_HIDDEN_SENSITIVE_DATA:'', // 是否脱敏：1-是；0-否
            HIDDEN_WAY:[], // 脱敏方式
            ORI_REMARKS:'', // 目标数据说明
            DES_REMARKS:'', // 源数据说明
            RISK_LEVEL:'', // 风险等级
            RISK_DESC:'', // 风险说明
            RISK_MEASURE:'', // 风险措施
            changeSystemJson: [{
              SYSTEM_NAME: '',
              IP_ADDRESS: ''
            }],
            changeSystemJson_target: [{
              SYSTEM_NAME: '',
              IP_ADDRESS: ''
            }],
            fileList:[]
        }
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
      // 清空数据
      clearAddData() {
        for (let i in this.addpower.form) {
          if(i=='applyType' || i=='powerType'){
            this.addpower.form[i] = [];
          }else{
            this.addpower.form[i] = "";
          }
        }
        this.addpower.form.applySystemInfo=[{ IP_ADDRESS: '',SYSTEM_NAME: ''}];
        this.checkBox_flag=true;
      },
      // 搜索功能
      searchHandle() {
        if(!this.screenKey.STATE && !this.screenKey.START_DATE && !this.screenKey.END_DATE && !this.keyword) return this.$warn('请至少选择一项检索条件');
        this.$maskin();
        this.optionsOn = [];
        let params = new URLSearchParams();
        params.append('STATE_ID', this.screenKey.STATE);
        if (this.screenKey.START_DATE) {
          params.append('startDate', this.screenKey.START_DATE);
          params.append('endDate', this.screenKey.END_DATE);
        }
        params.append('key', this.keyword.trim());
        params.append('page','1')
        params.append('pageSize',this.total)
        this.$axios.post("/daily/queryAllDailyRights",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            console.log('按钮disabled')
            this.resetDisabled(true,true,true,true);
            this.setTableData(data.result.dailyRights);
            for (let i of data.result.state) {
              this.optionsOn.push(i)
            }
            // this.resetDisabled(true,true,true,true);
            // this.current_user_id = data.result.current_user_id;
            // data.result.bases.map(item => {
            //   item.isFast = item.urgent || "否";
            // });
            // this.$set(this.table,"tableData", data.result.bases);
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
          // this.$maskin();
          this.currentPageNumber=1;
          // let params = new URLSearchParams();
          // params.append('page',this.currentPageNumber)
          // params.append('pageSize',this.defaultPageSize)
          // return this.$axios.post("/daily/queryAllDailyEvents",params).then((res)=>{
          //   let data = res.data;
          //   if(data.code == 200){
          //   this.setTableData(data.result.dailyEvents);
          //     // for (let i of data.result.state) {
          //     //   this.optionsOn.push(i)
          //     // }
          //     // this.resetDisabled(true,true,true,true);
          //     // this.current_user_id = data.result.current_user_id;
          //     // data.result.bases.map(item => {
          //     //   item.isFast = item.urgent || "否";
          //     // });
          //     // this.$set(this.table,"tableData", data.result.bases);
          //     this.$maskoff();
          //   }
          // })
        }
        if(handlerType === 'end'){
          // this.$maskin();
          // let params = new URLSearchParams();
          this.currentPageNumber=Math.ceil(this.total/this.defaultPageSize);
          // params.append('page',this.currentPageNumber)
          // params.append('pageSize',this.defaultPageSize)
          // return this.$axios.post("/daily/queryAllDailyEvents",params).then((res)=>{
          //   let data = res.data;
          //   if(data.code == 200){
          //   this.setTableData(data.result.dailyEvents);
          //     // for (let i of data.result.state) {
          //     //   this.optionsOn.push(i)
          //     // }
          //     // this.resetDisabled(true,true,true,true);
          //     // this.current_user_id = data.result.current_user_id;
          //     // data.result.bases.map(item => {
          //     //   item.isFast = item.urgent || "否";
          //     // });
          //     // this.$set(this.table,"tableData", data.result.bases);
          //     this.$maskoff();
          //   }
          // })
        }
        this.loadData(handlerType);
      },
      resetDisabled(home,prev,next,end){
        this.homeDisabled=home;
        this.prevDisabled=prev;
        this.nextDisabled=next;
        this.endDisabled=end;
      },
      loadData(type) {
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
        let key=this.$route.params.neelId?this.$route.params.neelId:'';
        params.append('key', key);
        params.append('page',this.currentPageNumber);
        params.append('pageSize',this.defaultPageSize);
        if(this.currentPageNumber <= 0 || (this.maxPageNumber && this.maxPageNumber < this.currentPageNumber)){
          if(this.currentPageNumber <= 0)this.currentPageNumber == 1;
          this.$maskoff();
          return;
        }
        // TODO
        this.$axios.post("/daily/queryAllDailyRights", params).then((res) => {
          let data = res.data;
          // data.result.dailyEvents.forEach(item => {
          //   item.is_urgent=='19'?item.is_urgent='紧急':item.is_urgent='常规';
          // });
          this.setTableData(data.result.dailyRights);
          this.total=data.result.total;
          // if (data.code == 200) {
            // this.resetDisabled(false,false,false,false)
          //   if(data.result.daliys.length === 0 && type){
          //     if(type === 'next'){
          //       this.currentPageNumber--;
          //       this.maxPageNumber = this.currentPageNumber;
          //     }
          //     this.$maskoff();
          //     return;
          //   }
          //   this.setTableData(data.result.daliys);
          //   // this.ifMANAGER_SAVE = data.result.MANAGER_SAVE
          //   // this.ifPRODUCT_SAVE = data.result.PRODUCT_SAVE
            for (let i of data.result.state) {
              this.optionsOn.push(i)
            }
          //   //判断是否有search跳转到对应的操作台
          //   if (this.$route.params.neelId && !this.table.hasGo) {
          //     let id = this.$route.params.neelId;
          //     for (let i = 0; i < data.result.daliys.length; i++) {
          //       if (data.result.daliys[i].daliy_NEET_ID == id) {
          //         setTimeout(() => {
          //           this.tabs.index = i;
          //           this.$refs.rcrw_table.setCurrentRow(data.result.daliys[i]);
          //           this.handleCurrentChange(data.result.daliys[i]);
          //           this.table.hasGo = true
          //         }, 0)
          //         break;
          //       }
          //     }
          //     return;
          //   }
          // } else {
          //   this.$warn(data.message);
          // }
          this.$maskoff()
        })
      },
      changeObjectClick(index){
        if(index === 0){
          this.consoleData.changeSystemJson.push({ SYSTEM_NAME: '', IP_ADDRESS: '' });
        }else{
          this.consoleData.changeSystemJson.splice(index, 1);
        }
      },
      changeObjectClickTarget(index){
        if(index === 0){
          this.consoleData.changeSystemJson_target.push({ SYSTEM_NAME: '', IP_ADDRESS: '' });
        }else{
          this.consoleData.changeSystemJson_target.splice(index, 1);
        }
      },
      // 申请访问权限系统信息
      changeObjectClickApply(index){
        if(index === 0){
          this.addpower.form.applySystemInfo.push({ IP_ADDRESS: '', SYSTEM_NAME: '' });
        }else{
          this.addpower.form.applySystemInfo.splice(index, 1);
        }
      },
      tableRowClassName({row, rowIndex}) {
        // if (row.daliy_NEET_ID == this.$route.params.neelId) {
        //   return 'td-current';
        // }
        return '';
      },
      selectStatOn() {
        this.screenKey.STATE = '';
        this.screenKey.STATE = this.selectValueOn;
        // this.loadData();
      },
      pickDate(value) {
        if (!value) {
          this.screenKey.START_DATE = ""
          this.screenKey.END_DATE = ""
          // this.loadData();
          return
        }
        this.screenKey.START_DATE = '';
        this.screenKey.END_DATE = '';
        this.screenKey.START_DATE = value[0];
        this.screenKey.END_DATE = value[1];
        // this.loadData();
      },
      //点击表格列表展示控制台
      handleCurrentChange(val) {
        this.$maskin();
        //全程跟踪视图模式
        this.tracking.trackingvisiible = false;
        // this.innitFrom()
        this.tabs.activeName = "info";
        this.clearData()
        this.tabs.activeTableInfo = val;
        if (!this.tabs.consoleWrapperVisible) {
          console.log('打开控制台')
          this.tabs.consoleWrapperVisible = true;
          setTimeout(() => {
            this.calculate()
          }, 0);
        }
        console.log(this.tabs.consoleWrapperVisible)
        let params = new URLSearchParams();
        params.append('neel_id', val.neel_id);
        this.handle.neel_id=val.neel_id;
        this.$axios.post("/daily/getDailyRights", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let str='';
            data.result.dailyRights.changeSystems.forEach((item,index)=>{
              str+=`${index+1}  .   (${item.ip_ADDRESS}-${item.system_USER})  `;
            })
            data.result.dailyRights.changeSystems=str;
            this.$set(this.tabs, "data_one", data.result.dailyRights);
            this.$set(this.tabs, "genzong", data.result.records);
            this.$set(this.tabs, "genzongs", data.result.records);
            this.tabs.state_name = data.result.dailyRights.state_name
            this.tabs.user_NAME = data.result.dailyRights.user_name
          } else {
            this.$warn(data.message);
          }
          this.$maskoff()
        })
      },
      setBrInfo(dom, info){
        console.log(dom)
        dom.innerHTML = "";
        dom.insertAdjacentHTML("beforeend", info);
      },
      //编辑产品经理建立的需求初始化数值
      proEdit() {
        console.log('编辑初始化数据')
        let all = this.tabs.data_one.daliy
        console.log(all)
        console.log('初始化进行中')
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
            // this.addneeds.addform.code = data.result.DALIY_NEET_ID
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
              // self.setBrInfo(document.querySelector(".prduct_FUNCTION"), data.result.daliy.prduct_FUNCTION);
            }, 500)
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      mustCheck() {
        let firm = "1"
        if (!this.tabs.rriority) {
          this.$warn("请选择优先级评定");
          firm = "0"
        }
        if (!this.tabs.checks) {
          this.$warn("请选择需求评审结果");
          firm = "0"
        }
        if (!this.tabs.check_time) {
          this.$warn("请选择评审日期");
          firm = "0"
        }
        if (!this.assign.checkList.length) {
          this.$warn("请分配人员");
          firm = "0"
        }
        return firm
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
        console.log(val.tasks)
        this.$set(this.split, "hasSplitTaskData", val.tasks)
      },
      setTableData(data) {
        // data.map(item => item.isFast = item.ugent || "否");
        this.$set(this.table, "tableData", data);
        this.$set(this.table, "tableOriginData", data);
      },
      innitFrom() {
        this.$maskin();
        console.log('初始化表单数据')
        let params = new URLSearchParams();
        this.$axios.post("/daily/saveDailyFront", params).then((res) => {
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
            this.$set(this.addneeds.addform, "frompeopleArr", data.result.developUsers)
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
          // params.append("DALIY_NEET_ID", this.addneeds.addform.code); //任务编号
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
          this.$warn("请分配人员")
          flag = "0"
        }

        return flag
        //TODO
      },
      //开发字段过滤
      createDevFilter(){
        let flag = "1"
        if (this.consoleData.changeSystemJson.length=0) {
          this.$warn("请填写数据源系统信息")
          flag = "0"
        }

        if (!this.consoleData.ORI_DATA_TYPE) {
          this.$warn("请选择数据类型")
          flag = "0"
        }

        if (!this.consoleData.ORI_DATA_PATH) {
          this.$warn("请填写数据路径")
          flag = "0"
        }

        if (!this.consoleData.ORI_DATA_TYPE) {
          this.$warn("请选择敏感信息")
          flag = "0"
        }
        return flag
      },
      createNewN() {
        if (this.createNewNFilter() == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          // params.append("DALIY_NEET_ID", this.handle.daliy_NEET_ID); //任务编号
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
        if (this.addneeds.addform.needsname.length>1000) {
          this.$warn("需求描述超过最大长度")
          flag = "0"
        }
        if(!this.addneeds.addform.jihuadate) {
        	this.$warn("请选择期望完成日期")
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
        if (!this.addneeds.addform.prduct_line) {
          this.$warn("请填写涉及产品线")
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
        return flag
      },
      //所有人员新建任务
      createNew2() {
        if (this.proFilter() == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          // params.append("DALIY_NEET_ID", this.addneeds.addform.code); //任务编号
          params.append("USER_NAME", this.addneeds.addform.sxname); //任务申请人
          params.append("TASK_NAME", this.addneeds.addform.name); //任务名称
          params.append("TASK_DESCRIPTION", this.addneeds.addform.needsname); //needsname 需求描述
          params.append("END_DATE", this.addneeds.addform.jihuadate); //期望完成日期
          params.append("NEW_DATE", this.addneeds.addform.applyDate); //申请日期
          if ((this.addneeds.addform.fromdeptId).split('-').length > 1 && (this.addneeds.addform.fromdeptroleId).split('-').length > 1) {
            params.append("TASK_SOURCE", (this.addneeds.addform.fromdeptId).split('-')[1] + '-' + this.addneeds.addform.fromdeptroleId.split('-')[1]); //任务来源 fromdeptId fromdeptroleId
          } else {
            params.append("TASK_SOURCE", this.addneeds.addform.fromdeptId + '-' + this.addneeds.addform.fromdeptroleId); //任务来源 fromdeptId fromdeptroleId
          }
          params.append("RRIORITY", this.addneeds.addform.level); //优先级

          params.append("PRDUCT_LINE", this.addneeds.addform.prduct_line); // 涉及产品线

          params.append("IMPORTANCE", this.addneeds.addform.zhongyaochegndu); //重要程度
          // params.append("EDIT", this.addneeds.addform.ifcanEdit);
          console.log(this.addneeds.addform.fromdeptroleId.split('-')[0])
          console.log(this.addneeds.addform.fromdeptroleId.split('-')[1])
          // return;
          if (this.tabs.ifcanEdit == '0') {
            if((this.addneeds.addform.fromdeptroleId).split('-').length < 1){
              params.append("SEND_ID", this.tabs.data_one.daliy.send_ID); //提出人id
            }else{
              params.append("SEND_ID", this.addneeds.addform.fromdeptroleId.split('-')[0]); //提出人id
            }
            params.append("SEND_NAME", this.addneeds.addform.fromdeptroleId.split('-')[1]); //提出人姓名
            this.$axios.post("/daily/addDailyTask", params).then((res) => {
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
            params.append("DALIY_NEET_ID", this.addneeds.addform.code); //任务编号
            params.append("STATE_ID", this.state_id); //状态
            this.$axios.post("/daily/updateDaily", params).then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.$success(data.message);
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
        this.clearData()
        this.loadData()
        this.innitFrom()
      },
      //新建数据抽取
      dataHandle() {
        this.closeDialog();
        this.clearData()
        this.loadData()
        this.innitFrom()
        this.addneeds.addvisibleP = true;
      },
      //新建权限申请
      powerApply() {
        this.$maskin();
        // this.clearAddData();
        this.addpower.isEdit=false;
        // this.addpower.isEdit=!this.addpower.isEdit;
        let params = new URLSearchParams();
        params.append('idType','DAILY_RIGHTS');
        this.$axios.post("/daily/getDataBeforeAddDailyEvent",params).then((res)=>{
          let data=res.data;
          if(data.code=='200'){
            // console.log(data.result)
            this.clearAddData();
            // this.loadData();
            this.addpower.form.neel_id=data.result.neelId;
            this.addpower.form.user_id=data.result.userId;
            this.addpower.form.mobile_no=data.result.userPhone;
            this.addpower.userName=data.result.userName;
            this.addpower.fromdeptArr=data.result.deptsAndUsers;
            this.addpower.form.fromdeptId=data.result.deptId;
            this.fromdeptchangeEvent(data.result.deptId)
            this.$maskoff();
            this.addpower.visiable=true;
          }
        })
      },
      //事件受理
      eventApply() {
        this.$maskin();
        let params = new URLSearchParams();
        params.append('idType','DAILY_EVENT');
        this.$axios.post("/daily/getDataBeforeAddDailyEvent",params).then((res)=>{
          let data=res.data;
          if(data.code=='200'){
            // console.log(data.result)
            this.clearAddData();
            this.loadData();
            this.addEvent.form.neel_id=data.result.neelId;
            this.addEvent.form.user_id=data.result.userId;
            this.addEvent.form.mobile_no=data.result.userPhone;
            this.addEvent.userName=data.result.userName;
            this.addEvent.fromdeptArr=data.result.deptsAndUsers;
            this.$maskoff();
            this.addEvent.visiable=true;
          }
        })
      },
      // 撤回权限单
      cancelPower(val,e,type){
        e.cancelBubble=true;
        this.$maskin();
        let params = new URLSearchParams();
        this.addEvent.form.neel_id=val.neel_id;
        params.append('neel_id', val.neel_id);
        params.append('oper', type);
        params.append('state_id', '109');
        this.$axios.post("/daily/updateDailyRights",params).then((res)=>{
          let data = res.data;
          if(data.code=='200'){
            this.clearAddData();
            this.$maskoff();
            this.$success(data.message);
            this.loadData();
            this.addEvent.visiable=false;
          }
        })
      },
      // 修改权限单
      updateEvent(val,e,type){
        this.clearAddData();
        e.cancelBubble=true;
        // this.eventApply();
        this.$maskin();
        this.updateType=type;
        let params = new URLSearchParams();
        this.addpower.form.neel_id=val.neel_id;
        params.append('neel_id', val.neel_id);
        params.append('isId', '1');
        this.addpower.isEdit=true;
        // this.handle.neel_id=val.neel_id;
        console.log(this.addpower.isEdit)
        this.$axios.post("/daily/getDailyRights", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.addpower.visiable=true;
            // this.addpower.isEdit=true;
            this.addpower.form.mobile_no=data.result.dailyRights.mobile_no;
            this.addpower.form.user_id=data.result.dailyRights.user_id;
            this.addpower.userName=data.result.dailyRights.user_name;
            this.addpower.form.task_name=data.result.dailyRights.task_name;
            // this.addpower.form.is_urgent=parseInt(data.result.dailyEvent.is_urgent);
            this.addpower.form.finish_time=data.result.dailyRights.finish_time;
            this.addpower.form.event_desc=data.result.dailyRights.event_desc;
            this.addpower.form.applyType=this.dealCheckBox(data.result.dailyRights.apply_type);
            this.addpower.form.powerType=this.dealCheckBox(data.result.dailyRights.rights_type);
            // this.addpower.form.apply_time=this.dealCheckBox(data.result.dailyRights.apply_time);
            this.addpower.form.apply_time=data.result.dailyRights.apply_time;
            this.addpower.form.powerTypeOther=data.result.dailyRights.rights_type_other;
            this.addpower.form.apply_date=data.result.dailyRights.apply_date;
            this.addpower.fromdeptArr=data.result.deptsAndUsers;
            this.addpower.form.fromdeptId=parseInt(data.result.dailyRights.dept_id);
            // this.fromdeptchangeEvent(data.result.dailyRights.apply_dept)
            this.addpower.form.apply_reason=data.result.dailyRights.apply_reason;
            this.addpower.form.rights_user=data.result.dailyRights.rights_user;
            this.checkBox_flag=false;
            this.operationFileList=data.result.dailyRights.attachments;
            let arr = [];
            data.result.dailyRights.changeSystems.forEach(item=>{
              let obj={};
              obj.IP_ADDRESS=item.ip_ADDRESS;
              obj.SYSTEM_NAME=item.system_USER;
              obj.id=item.id;
              arr.push(obj);
            })
            this.addpower.form.applySystemInfo=arr;
            // this.$set(this.tabs, "data_one", data.result.dailyEvent);
            // this.$set(this.tabs, "genzong", data.result.records);
            // this.$set(this.tabs, "genzongs", data.result.records);
            // this.tabs.state_name = data.result.dailyEvent.state_name
            // this.tabs.user_NAME = data.result.dailyEvent.user_name
          } else {
            this.$warn(data.message);
          }
          this.$maskoff()
        })
      },
      dealCheckBox(val) {
        let newArr=[];
        val.split(',').map(item=>{
          newArr.push(parseInt(item));
        })
        return newArr;
      },
      // 事件受理确认事件
      eventApplyHandle() {
        if(!this.addEvent.form.task_name){
          return this.$warn('请输入任务名称');
        }
        if(!this.addEvent.form.fromdeptId){
          return this.$warn('请选择需求提出部门');
        }
        if(!this.addEvent.form.apply_id){
          return this.$warn('请选择需求提出人');
        }
        if(!this.addEvent.form.is_urgent){
          return this.$warn('请选择是否紧急');
        }
        if(!this.addEvent.form.finish_time){
          return this.$warn('请选择计划完成时间');
        }
        if(!this.addEvent.form.eventFrom && !this.addEvent.form.eventFromOther){
          return this.$warn('请选择事件来源');
        }
        if(!this.addEvent.form.eventType && !this.addEvent.form.eventTypeOther){
          return this.$warn('请选择事件类型');
        }
        if(!this.addEvent.form.event_desc){
          return this.$warn('请输入事件描述');
        }
        if(this.addEvent.form.event_desc.length>1000){
          return this.$warn('输入字符大于1000');
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append('state_id','108');
        params.append('neel_id',this.addEvent.form.neel_id);
        params.append('task_name',this.addEvent.form.task_name);
        params.append('user_id',this.addEvent.form.user_id);
        params.append('mobile_no',this.addEvent.form.mobile_no);
        params.append('apply_id',this.addEvent.form.apply_id);
        params.append('is_urgent',this.addEvent.form.is_urgent);
        params.append('finish_time',this.addEvent.form.finish_time);
        params.append('event_source',this.addEvent.form.eventFrom);
        params.append('event_source_other',this.addEvent.form.eventFromOther);
        params.append('event_type',this.addEvent.form.eventType);
        params.append('event_type_other',this.addEvent.form.eventTypeOther);
        params.append('event_desc',this.addEvent.form.event_desc);
        // TODO
        if(this.addEvent.isEdit){
          params.append('oper',this.updateType);
          this.$axios.post("/daily/auditDailyEventAndRights",params).then((res)=>{
            let data = res.data;
            if(data.code=='200'){
              this.clearData();
              this.$maskoff();
              this.$success(data.message);
              this.loadData();
              this.addEvent.visiable=false;
            }
          })
        }else{
          this.$axios.post("/daily/addDailyEvent",params).then((res)=>{
            let data = res.data;
            if(data.code=='200'){
              this.clearData();
              this.$maskoff();
              this.$success(data.message);
              this.loadData();
              this.addEvent.visiable=false;
            }
          })
        }
      },
      // 权限申请确认
      powerApplyHandle(){
        if(!this.addpower.form.task_name){
          return this.$warn('请输入任务名称');
        }
        if(!this.addpower.form.applyType.length){
          return this.$warn('请选择申请类型');
        }
        if(!this.addpower.form.powerType.length){
          return this.$warn('请选择权限类型');
        }
        if(!this.addpower.form.fromdeptId){
          return this.$warn('请选择申请人部门');
        }
        if(!this.addpower.form.rights_user){
          return this.$warn('请填写权限使用人');
        }
        if(!this.addpower.form.mobile_no){
          return this.$warn('请填写联系电话');
        }
        if(!this.addpower.form.apply_date){
          return this.$warn('请选择申请授权日期');
        }
        if(!this.addpower.form.apply_time){
          return this.$warn('请选择申请时间');
        }
        if(!this.addpower.form.apply_reason){
          return this.$warn('请填写申请原因');
        }
        let flagIp =true;
        let flagUser =true;
        this.addpower.form.applySystemInfo.forEach(item=>{
          if(item.IP_ADDRESS==''){
            flagIp=false;
          }
          if(item.SYSTEM_NAME==''){
            flagUser=false;
          }
        })
        if(!flagIp){
          return this.$warn('请填写系统ip地址');
        }
        if(!flagUser){
          return this.$warn('请填写系统用户名称');
        }
        let str='';
        this.addpower.form.applySystemInfo.forEach(item=>{
          str+=`${item.IP_ADDRESS}##${item.SYSTEM_NAME}##${item.id?item.id:''}__`
        })
        this.$maskin();
        // console.log(this.addpower.form.applySystemInfo);
        let params = new URLSearchParams();
        params.append('state_id','108');
        params.append('neel_id',this.addpower.form.neel_id);
        params.append('task_name',this.addpower.form.task_name);
        params.append('user_id',this.addpower.form.user_id);
        params.append('mobile_no',this.addpower.form.mobile_no);
        params.append('apply_reason',this.addpower.form.apply_reason);
        params.append('apply_date',this.addpower.form.apply_date);
        params.append('apply_time',this.addpower.form.apply_time);
        params.append('apply_type',this.addpower.form.applyType);
        params.append('rights_type',this.addpower.form.powerType);
        params.append('rights_user',this.addpower.form.rights_user);
        if(this.addpower.form.powerTypeOther){
          params.append('rights_type_other',this.addpower.form.powerTypeOther);
        }
        params.append('onlineSystemJson',str);
        if(this.addpower.isEdit){
          let arr=[];
          this.operationFileList.forEach(item=>{
            arr.push(item.id);
          })
          params.append('attachmentIds',arr);
          params.append('oper',this.updateType);
          this.$axios.post("/daily/updateDailyRights",params).then((res)=>{
            let data = res.data;
            if(data.code=='200'){
              this.clearAddData();
              this.$maskoff();
              this.$success(data.message);
              this.loadData();
              this.addpower.visiable=false;
            }
          })
        }else{
          this.$axios.post("/daily/addDailyRights",params).then((res)=>{
            let data = res.data;
            if(data.code=='200'){
              this.clearAddData();
              this.$maskoff();
              this.$success(data.message);
              this.loadData();
              this.addpower.visiable=false;
            }
          })
        }
        // params.append('event_desc',this.addpower.form.event_desc);
      },
      //-----------------------------------新需求来源二级联动
      fromdeptchangeEvent(val){
        this.addEvent.fromdeptroleId = '';
        let deptroleArr = [];
        for (let i of this.addEvent.fromdeptArr) {
          if (val == i.dept_id) {
            for (let j of i.users) {
              let obj = {
                "user_NAME": j.user_NAME,
                "user_ID": j.user_ID
              };
              deptroleArr.push(obj)
            }
          }
        }
        console.log('人员列表')
        this.$set(this.addEvent, "fromdeptroleArr", deptroleArr);
      },
      //产品经理编辑任务
      newneedsP2() {
        this.clearData()
        // this.loadData()
        this.innitFrom()
        this.proEdit()
        this.addneeds.addvisibleP = true;
      },
      // 修改任务
      updateNeeds(val,e) {
        e.stopPropagation();
        console.log(val.nell_TYPE)
        this.state_id=val.nell_TYPE=='1'?'102':'101';
        this.$set(this.tabs,'ifcanEdit','1')
        this.queryDetails(val);
        this.innitFrom();
        setTimeout(()=>{
          this.proEdit();
        },1000)
        this.addneeds.addvisibleP = true;
        console.log(this.tabs.ifcanEdit)
      },
      //查询详细信息
      queryDetails(val){
        let params = new URLSearchParams();
        params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
        this.handle.daliy_NEET_ID = val.daliy_NEET_ID //赋值主键
        this.tabs.ifConsole = ''
        this.tabs.ifAssign = ''
        this.tabs.ifSplit = ''
        this.tabs.ifEdit = ''
        this.tabs.ifPing = ''
        this.popup.popTxt.fileList = [];
        this.$axios.post("/daily/queryDailyMessage", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            console.log('开始赋值原数据')
            this.$set(this.tabs, "data_one", data.result);
            this.tabs.state_NAME = data.result.daliy.state_NAME
            this.tabs.user_NAME = data.result.daliy.send_NAME
            this.tabs.ifConsole = data.result.confirm
            this.tabs.ifAssign = data.result.assign
            this.tabs.ifSplit = data.result.split
            this.tabs.ifEdit = data.result.EDIT
            // this.tabs.ifPing = data.result.checkDaliy
            this.tabs.ifReject = data.result.REJECT
            this.tabs.daliy_NEET_ID = data.result.daliy.daliy_NEET_ID
            // console.log(this.tabs.daliy_NEET_ID)
            this.tabs.review_GRADE = data.result.daliy.review_GRADE_NAME;//评审等级
            // this.$set(this.tabs, "rriorityArr", data.result.rriority);
            this.$set(this.tabs, "rriorityArr", data.result.reviewLevel);
            // this.$set(this.tabs, "checksArr", data.result.checks);
            this.$set(this.tabs, "genzong", data.result.records);
            this.$set(this.tabs, "genzongs", data.result.records);
            this.$set(this.tabs, "chooseDeptArr", data.result.deptRecord);
            this.$set(this.addneeds.addform.splitForm, "splitAnalysis", data.result.deptSystem);
            this.consoleAction() //控制台按钮展示
            this.getSplit() //获取分配默认值
            let self = this
            // var t = setTimeout(function () {
            //   self.setBrInfo(document.querySelector(".task_DESCRIPTION"), data.result.daliy.task_DESCRIPTION);
            //   // self.setBrInfo(document.querySelector(".prduct_FUNCTION"), data.result.daliy.prduct_FUNCTION);
            // }, 0)
          } else {
            this.$warn(data.message);
          }
          this.$maskoff()
        })
      },
      //新增人员
      addsplitperson() {
        let params = new URLSearchParams();
        this.$axios.post("/daily/getDailyInfoId", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.addneeds.splitaddvisible = true;
            this.split.taskcode = data.result;
          }
        })
        // this.addneeds.splitaddvisible=true;
      },
      splitDelete(index){
        this.addneeds.addform.splitArr.splice(index, 1);
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
        // if (!this.addneeds.addform.splitForm.xtname) {
        //   this.$warn("请选择系统名")
        //   this.addOneTaskSuccess = false
        // }
        if (!this.addneeds.addform.splitForm.fzmodule) {
          this.$warn("请填写负责模块")
          this.addOneTaskSuccess = false
        }
        // if (!this.addneeds.addform.splitForm.easy) {
        //   this.$warn("请选择难易程度")
        //   this.addOneTaskSuccess = false
        // }
        // if (!this.addneeds.addform.splitForm.allDate) {
        //   this.$warn("请选择完成日期")
        //   this.addOneTaskSuccess = false
        // }
        if (!this.addneeds.addform.splitForm.willTime) {
          this.$warn("请填写预计用时")
          this.addOneTaskSuccess = false
        }
        if (!this.addneeds.addform.splitForm.willTime.match(/^[0-9]*$/)) {
          this.$warn("预计用时请填写纯数字")
          this.addOneTaskSuccess = false
        }
        // if (!this.addneeds.addform.splitForm.taskNum) {
        //   this.$warn("请填写任务量")
        //   this.addOneTaskSuccess = false
        // }

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
            "RESPONSIBLE_MODULE": this.addneeds.addform.splitForm.fzmodule,
            "DALIY_INFO_ID": this.split.taskcode,
            "EXPECT_TIME": this.addneeds.addform.splitForm.willTime,
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
            // "SYSTEM_NAME": (this.addneeds.addform.splitForm.xtname),
            "fzmk": this.addneeds.addform.splitForm.fzmodule,
            "RESPONSIBLE_MODULE": this.addneeds.addform.splitForm.fzmodule,
            // "easy": (this.addneeds.addform.splitForm.easy).split(',')[1],
            // "FACILITY_ID": (this.addneeds.addform.splitForm.easy).split(',')[0],
            // "finishDate": `${finish.year}-${finish.mouth}-${finish.day}`,
            // "END_DATE": this.addneeds.addform.splitForm.allDate,
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
        this.addpower.visiable = false; //权限申请的弹窗
        this.addneeds.addvisible = false; //数据抽取的弹窗
        this.addEvent.visiable = false; //事件受理的弹窗
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
        this.addneeds.addform.splitArr = [];
        this.popup.popTxt.uploadFiles = [];
        // form:{
        //     neel_id:'',//工单编号
        //     task_name:'',//任务名称
        //     user_id:'',//用户id
        //     mobile_no:'',//用户手机号
        //     apply_id:'',//申请人id
        //     is_urgent:'',//是否紧急
        //     finish_time:'',//计划完成时间
        //     event_desc:'',//时间描述
        //     eventFrom:[],
        //     eventFromOther:'',
        //     eventType:[],
        //     eventTypeOther:''
        //   }
        // this.addEvent.form.map(item=>{
        //   item='';
        // })
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
      // pickDate(value) {
      //   this.screenKey.START_DATE = value[0];
      //   this.screenKey.END_DATE = value[1];
      //   this.loadData();
      // },
      //崔老师审核通过
      agreeRow(val, e,type) {
        e.cancelBubble = true;
        this.$maskin();
        let params = new URLSearchParams();
        params.append('neel_id', val.neel_id);
        params.append('oper', type);
        this.$axios.post("/daily/updateDailyRights", params).then((res) => {
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
      applyCheckHandle(val, e,type) {
        this.handle.neel_id=val.neel_id;
        e.cancelBubble = true;
        this.applyCheck=true;
      },
      applyCheckSure() {
        // console.log(this.applyResult)
        let str='';
        switch(this.applyResult){
          case '0':
           str='完成，与目标一致';
          break;
          case '1':
           str='完成，接受建议解决方案';
          break;
          case '2':
           str='未完成，关闭事件，原因：';
          break;
          case '3':
           str='未完成，继续处理，原因：';
          break;
          case '4':
           str='取消事件，原因：';
          break;
        };
        let reason='';
        if((this.applyResult=='2' || this.applyResult=='3' || this.applyResult=='4') && !this.failReason){
          return this.$warn('请输入原因')
        }
        if(this.failReason.length>50){
          return this.$warn('原因字数限制100以内')
        }
        reason=str+''+this.failReason;
        // console.log(reason)
        this.$maskin();
        let params = new URLSearchParams();
        params.append('neel_id', this.handle.neel_id);
        params.append('oper', 'PASS');
        params.append('result', reason);
        this.$axios.post("/daily/updateDailyRights", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success(data.message);
            this.applyCheck=false;
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
      //操作台分配人员
      assignPeople() {
        this.panelTip_tech = {
          panelTitle: '分配',
          selectedUserTitle: '已选择人员名单',
          selectedUserTip: '请选择人员',
          selectUserTitle: '选择人员',
        }
        this.myurl_tech = "/work/queryUserByDemand";
        this.assignvisible_tech = true;
        // this.assign.assignvisible=true;
        // this.$maskin();
        // this.assign.eyword = "";
        // this.assign.chooseId = "";
        // this.assign.checkList = [];
        // let params = new URLSearchParams();
        // this.$axios.post("/daliy/queryDeptUser", params).then((res) => {
        //   let data = res.data;
        //   if (data.code == 200) {
        //     this.$set(this.assign, "searchData", data.result.allDept);
        //     this.$set(this.assign, "leftlistdata", data.result.allDept);
        //     if (data.result.dept) {
        //       this.$set(this.assign, "rightlistdata", data.result.dept.users);
        //     }
        //     // this.assign.chooseId = val.daliy_NEET_ID
        //   } else {
        //     this.$warn(data.message);
        //   }
        //   this.$maskoff();
        // })
      },
      //分配
      assignRow(val, e) {
        e.cancelBubble = true;
        this.handleCurrentChange(val)
        this.tabs.activeName = "console";
      },
      //运维人员任务处理
      TaskProcess(val, e){
        e.cancelBubble = true;
        // this.handleCurrentChange(val)
        // this.tabs.activeName = "console";
        this.handle.neel_id=val.neel_id;
        this.operationHandle.visiable=true;
      },
      //开发人员修改
      DevUpdate(val, e) {
        e.cancelBubble = true;
        this.handleCurrentChange(val);
        this.tabs.activeName = "console";
        let params = new URLSearchParams();
        params.append("DAILY_NEET_ID", val.daliy_NEET_ID);
        this.$axios.post("/daily/queryDailyDevelopInfo", params).then((res) => {
            let data = res.data.result;
            this.consoleData.ACTUAL_WORK_TIME=data.actual_WORK_TIME?data.actual_WORK_TIME:'';
            this.consoleData.RISK_LEVEL=data.risk_LEVEL=='高风险'?16:data.risk_LEVEL=='中风险'?17:18;
            this.consoleData.IS_HIDDEN_SENSITIVE_DATA=data.is_HIDDEN_SENSITIVE_DATA=='是'?1:0;
            this.consoleData.fileList=[{'id':data.attachment_ID,'name':data.attachment_NAME,url:`${window._options.baseUrl}/daily/download?token=${this.$getToken()}&id=${data.attachment_ID}`}];
            this.consoleData.RISK_MEASURE=data.risk_MEASURE?data.risk_MEASURE:'';
            this.consoleData.RISK_DESC=data.risk_DESC?data.risk_DESC:'';
            this.consoleData.DES_REMARKS=data.des_REMARKS?data.des_REMARKS:'';
            // console.log(data.des_DATA_PATH)
            this.consoleData.DES_DATA_PATH=(data.des_DATA_PATH=='undefined' || !data.des_DATA_PATH)?'':data.des_DATA_PATH;
            // console.log(this.consoleData.DES_DATA_PATH)
            this.consoleData.ORI_REMARKS=data.ori_REMARKS?data.ori_REMARKS:'';
            this.consoleData.ORI_DATA_PATH=data.ori_DATA_PATH?data.ori_DATA_PATH:'';
            this.consoleData.ori_other_data_type=data.ori_OTHER_DATA_TYPE?data.ori_OTHER_DATA_TYPE:'';
            let HIDDEN_WAY_ARR=[];
            if(data.hidden_WAY && data.hidden_WAY.indexOf('自动化脚本')>-1){
              HIDDEN_WAY_ARR=[13];
            }
            if(data.hidden_WAY && data.hidden_WAY.indexOf('操作手册')>-1){
              HIDDEN_WAY_ARR=[14];
            }
            if(data.hidden_WAY && data.hidden_WAY.indexOf('自动化脚本')>-1 && data.hidden_WAY.indexOf('操作手册')>-1){
              HIDDEN_WAY_ARR=[13,14];
            }
            this.consoleData.HIDDEN_WAY=HIDDEN_WAY_ARR;
            let ori_SENSITIVE_DATA_ARR=[];
            console.log(data.ori_SENSITIVE_DATA.indexOf(this.consoleInfoData.sensitiveData[0].name),this.consoleInfoData.sensitiveData[0].name)
            for(let i in this.consoleInfoData.sensitiveData){
              if(data.ori_SENSITIVE_DATA.indexOf(this.consoleInfoData.sensitiveData[i].name)>-1){
                ori_SENSITIVE_DATA_ARR.push(parseInt(this.consoleInfoData.sensitiveData[i].id))
              }
            }
            this.consoleData.ORI_SENSITIVE_DATA=ori_SENSITIVE_DATA_ARR;
            let ORI_DATA_TYPE_ARR=[];
            console.log(data.ori_DATA_TYPE,data.ori_DATA_TYPE.indexOf(this.consoleInfoData.dataType[5].name),this.consoleInfoData.dataType[5].name)
            for(let i in this.consoleInfoData.dataType){
              if(data.ori_DATA_TYPE.indexOf(this.consoleInfoData.dataType[i].name)>-1){
                ORI_DATA_TYPE_ARR.push(parseInt(this.consoleInfoData.dataType[i].id))
              }
            }
            this.consoleData.ORI_DATA_TYPE=ORI_DATA_TYPE_ARR;
            this.consoleData.changeSystemJson=this.dealStr(data.ori_SYSTEM_NAME,data.ori_SYSTEM_IP);
            this.consoleData.changeSystemJson_target=this.dealStr(data.des_SYSTEM_NAME,data.des_SYSTEM_IP);
            this.$maskoff();
          })
      },
      //处理字符串方法
      dealStr(name,ip){
        let tempArr=[];
        if(name.indexOf(',')>-1 || ip.indexOf(',')>-1){
          let nameArr=name.substring(0,name.length-1).split(',');
          let ipArr=ip.substring(0,name.length-1).split(',');
          for(let i in nameArr){
            tempArr.push({
              SYSTEM_NAME: '',
              IP_ADDRESS: ''
            })
            tempArr[i].SYSTEM_NAME=name.substring(0,name.length-1).split(',')[i];
            tempArr[i].IP_ADDRESS=ip.substring(0,ip.length-1).split(',')[i];
          }
        }else{
          tempArr=[{
            SYSTEM_NAME: name,
            IP_ADDRESS: ip
          }]
        }
        return tempArr;
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
          console.log(nameArr)
          this.assign.assignvisible = false;
          // this.$maskin();
          // let info = this.tabs.activeTableInfo;
          // let params = new URLSearchParams();
          // params.append("names", nameArr);
          // params.append("ids", idArr);
          // params.append("DALIY_NEET_ID", this.assign.chooseId);
          // this.$axios.post("/daliy/assignManager", params).then((res) => {
          //   let data = res.data;
          //   if (data.code == 200) {
          //     this.assign.assignvisible = false;
          //     this.$success("操作成功");
          //     this.loadData();
          //     this.calculate();
          //   } else {
          //     this.$warn(data.message);
          //   }
          //   this.$maskoff();
          // })
        }
      },
      //技术经理提交分析
      checkDaliyTech() {
        let accept = this.createNewNFilter();
        if (accept == "1") {
          this.$maskin();
          let params = new URLSearchParams();
          params.append("dailyNeetId", this.handle.daliy_NEET_ID); //任务编号
          params.append("startTime", this.addneeds.addform.startTime); // 预计开始时间
          params.append("endTime", this.addneeds.addform.endTime); // 预计完成时间
          params.append("analysisTime", this.addneeds.addform.analysisTime); // 分析时间
          params.append("risk", this.addneeds.addform.RISK); //  风险点
          params.append("analysisResult", this.addneeds.addform.analysis); //  需求分析结果
          params.append("infos", JSON.stringify(this.addneeds.addform.splitArr)); //拆分
          this.$axios.post("/daily/managerSplit", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message)
              this.loadData()
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          })
        }
      },
      chooseMore(target,item){
        let str='';
        if(target.length>1){
          for(let i in target){
            if(item=='SYSTEM_NAME'){
              str+=target[i].SYSTEM_NAME+',';
            }else{
              str+=target[i].IP_ADDRESS+',';
            }
          }
        }else{
          if(item=='SYSTEM_NAME'){
            str=target[0].SYSTEM_NAME;
          }else{
            str=target[0].IP_ADDRESS;
          }
        }
        return str;
      },
      //开发人员完成
      checkDaliyDev() {
        if(this.consoleData.fileList.length==0){
          return this.$warn('请上传附件');
        }
        if (!this.$reg.number.test(this.consoleData.ACTUAL_WORK_TIME)) {
          this.$warn("实际工时格式不正确");
          return;
        }
        if (!this.consoleData.ACTUAL_WORK_TIME) {
          this.$warn("请填写实际工时");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("DAILY_NEET_ID", this.handle.daliy_NEET_ID); //任务编号
        params.append("ATTACHMENT_ID", this.consoleData.fileList[0].id); //附件id
        params.append("ACTUAL_WORK_TIME", this.consoleData.ACTUAL_WORK_TIME); //实际工时
        params.append("ORI_SYSTEM_NAME", this.chooseMore(this.consoleData.changeSystemJson,'SYSTEM_NAME')); //源系统名
        params.append("ORI_SYSTEM_IP", this.chooseMore(this.consoleData.changeSystemJson,'IP_ADDRESS')); //源系统ip
        params.append("DES_SYSTEM_NAME", this.chooseMore(this.consoleData.changeSystemJson_target,'SYSTEM_NAME')); //目标系统名
        params.append("DES_SYSTEM_IP", this.chooseMore(this.consoleData.changeSystemJson_target,'IP_ADDRESS')); //目标系统ip
        params.append("ORI_DATA_TYPE", this.consoleData.ORI_DATA_TYPE); //源数据类型
        // if(this.consoleData.ori_other_data_type){
          params.append("ORI_OTHER_DATA_TYPE", this.consoleData.ori_other_data_type); //源数据其他类型
        // }
        params.append("ORI_DATA_PATH", this.consoleData.ORI_DATA_PATH); //源数据路径
        params.append("ORI_SENSITIVE_DATA", this.consoleData.ORI_SENSITIVE_DATA); //源敏感信息
        params.append("IS_HIDDEN_SENSITIVE_DATA", this.consoleData.IS_HIDDEN_SENSITIVE_DATA); //是否脱敏：1-是；0-否
        params.append("HIDDEN_WAY", this.consoleData.HIDDEN_WAY); //脱敏方式
        params.append("ORI_REMARKS", this.consoleData.ORI_REMARKS); //源数据说明
        params.append("DES_DATA_PATH", this.consoleData.DES_DATA_PATH); //目标数据路径
        params.append("DES_REMARKS", this.consoleData.DES_REMARKS); //目标数据说明
        params.append("RISK_DESC", this.consoleData.RISK_DESC); //风险说明
        params.append("RISK_MEASURE", this.consoleData.RISK_MEASURE); //风险措施
        params.append("RISK_LEVEL", this.consoleData.RISK_LEVEL); //风险措施
        // console.log(this.consoleData.fileList)
        this.$axios.post("/daily/dailyTaskDevelopedFinished", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success(data.message)
            this.loadData()
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })

      },
      //质量部通过
      QualityCheck() {
        if(this.assignList.length===0){
          return this.$warn('请分配人员');
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("names", this.confirm_name);
        params.append("ids", this.confirm_id);
        params.append("neel_id", this.handle.neel_id);
        params.append("oper", 'PASS');
        this.$axios.post("/daily/updateDailyRights", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success("操作成功");
            this.loadData();
            this.$maskoff();
          }
        })
      },
      //质量部分配
      assignOperation(){
        // let info = this.tabs.activeTableInfo;
        // if (info.state_ID == 304) {
        //   this.taskid = info.work_NEET_ID;
        // }
        this.panelTip = {
          panelTitle: '分配',
          selectedUserTitle: '已选择人员名单',
          selectedUserTip: '请选择人员',
          selectUserTitle: '选择人员',
        }
        this.myurl = "/online/getOperation";
        this.assignvisible = true;
      },
      subAssign_tech(poyload) {
        if (!poyload.userLists) {
          this.$warn("当前没有选择任何人员");
        } else {
          console.log(poyload.userLists)
          this.assign.checkList=poyload.selectUsers;
          this.confirm_id_tech=poyload.userLists;
          this.confirm_name_tech=poyload.nameLists;
          // this.$maskin();
          // let params = new URLSearchParams();
          // params.append("names", poyload.nameLists);
          // params.append("ids", poyload.userLists);
          // params.append("BASE_ID", info.work_NEET_ID);
          // this.$axios.post("/work/checkBase", params).then((res) => {
          //   let data = res.data;
          //   if (data.code == 200) {
          //     this.$success("操作成功");
          //     this.loadData();
          //     this.$maskoff();
          //   }
          // })
        }
      },
      subAssignQuality(poyload) {
        if (!poyload.userLists) {
          this.$warn("当前没有选择任何人员");
        } else {
          console.log(poyload.userLists)
          this.assignList=poyload.selectUsers;
          this.confirm_id=poyload.userLists;
          this.confirm_name=poyload.nameLists;
          // this.$maskin();
          // let params = new URLSearchParams();
          // params.append("names", poyload.nameLists);
          // params.append("ids", poyload.userLists);
          // params.append("BASE_ID", info.work_NEET_ID);
          // this.$axios.post("/work/checkBase", params).then((res) => {
          //   let data = res.data;
          //   if (data.code == 200) {
          //     this.$success("操作成功");
          //     this.loadData();
          //     this.$maskoff();
          //   }
          // })
        }
      },
      //运维人员执行
      OperationCheck(){
        if(!this.operationResult){
          return this.$warn('请选择执行结果');
        }
        if(this.operationRemarks.length>500){
          return this.$warn('输入字符大于500');
        }
        if(!this.operationTime){
          return this.$warn('请选择操作时间');
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("DAILY_NEET_ID", this.handle.neel_id); //事件编号
        params.append("remarks", this.operationRemarks); //事件记录
        params.append("status", this.operationResult); //处理结果
        params.append("actualOnlineTime", this.operationTime);//实际上线时间 DAILY_EVENT
        params.append("type", 'DAILY_RIGHTS');
        this.$axios.post("/daily/dataCenterExecute", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success('操作完成');
            this.loadData();
            this.operationHandle.visiable=false;
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //开发人员修改
      checkDaliyDevUpdate() {
        this.$maskin();
        let params = new URLSearchParams();
        params.append("DAILY_NEET_ID", this.handle.daliy_NEET_ID); //任务编号
        params.append("ATTACHMENT_ID", this.consoleData.fileList[0].id); //附件id
        params.append("ACTUAL_WORK_TIME", this.consoleData.ACTUAL_WORK_TIME); //实际工时
        params.append("ORI_SYSTEM_NAME", this.chooseMore(this.consoleData.changeSystemJson,'SYSTEM_NAME')); //源系统名
        params.append("ORI_SYSTEM_IP", this.chooseMore(this.consoleData.changeSystemJson,'IP_ADDRESS')); //源系统ip
        params.append("DES_SYSTEM_NAME", this.chooseMore(this.consoleData.changeSystemJson_target,'SYSTEM_NAME')); //目标系统名
        params.append("DES_SYSTEM_IP", this.chooseMore(this.consoleData.changeSystemJson_target,'IP_ADDRESS')); //目标系统ip
        params.append("ORI_DATA_TYPE", this.consoleData.ORI_DATA_TYPE); //源数据类型
        // if(this.consoleData.ori_other_data_type){
          params.append("ORI_OTHER_DATA_TYPE", this.consoleData.ori_other_data_type); //源数据其他类型
        // }
        params.append("ORI_DATA_PATH", this.consoleData.ORI_DATA_PATH); //源数据路径
        params.append("ORI_SENSITIVE_DATA", this.consoleData.ORI_SENSITIVE_DATA); //源敏感信息
        params.append("IS_HIDDEN_SENSITIVE_DATA", this.consoleData.IS_HIDDEN_SENSITIVE_DATA); //是否脱敏：1-是；0-否
        params.append("HIDDEN_WAY", this.consoleData.HIDDEN_WAY); //脱敏方式
        params.append("ORI_REMARKS", this.consoleData.ORI_REMARKS); //源数据说明
        params.append("DES_DATA_PATH", this.consoleData.DES_DATA_PATH); //目标数据路径
        params.append("DES_REMARKS", this.consoleData.DES_REMARKS); //目标数据说明
        params.append("RISK_DESC", this.consoleData.RISK_DESC); //风险说明
        params.append("RISK_MEASURE", this.consoleData.RISK_MEASURE); //风险措施
        params.append("RISK_LEVEL", this.consoleData.RISK_LEVEL); //风险措施
        this.$axios.post("/daily/updateDailyTaskDevelopInfo", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success(data.message)
            this.loadData()
          } else {
            this.$warn(data.message);
          }
          this.$maskoff();
        })
      },
      //分配提交
      checkDaliy() {
        let accept = this.mustCheck()
        if (accept == "1") {
          // let result = this.assign.checkList;
          // let temp = [];
          // let idArr = [];
          // let nameArr = [];
          // for (let i of result) {
          //   temp.push(i.split("-"))
          // }
          // for (let i of temp) {
          //   idArr.push(i[0]);
          //   nameArr.push(i[1]);
          // }
          this.$maskin();
          let info = this.tabs.activeTableInfo;
          console.log(info)
          let params = new URLSearchParams();
          params.append("names", this.confirm_name_tech);
          params.append("ids", this.confirm_id_tech);
          params.append("DALIY_NEET_ID", this.handle.daliy_NEET_ID);
          params.append('reviewLevel', this.tabs.rriority);
          params.append('reviewTime', this.tabs.check_time);
          params.append('reviewResult', this.tabs.checks);
          this.$axios.post("/daily/assignManager", params).then((res) => {
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
          // this.$maskin();
          // let params = new URLSearchParams();
          // params.append('DALIY_NEET_ID', this.handle.daliy_NEET_ID);
          // params.append('CHECK_TYPE', this.tabs.checks.split('-')[1]);
          // params.append('CHECK_ID', this.tabs.checks.split('-')[0]);
          // params.append('RRIORITY', this.tabs.rriority);
          // params.append('CHECK_TIME', this.addneeds.addform.check_time);
          // params.append('CHECK_NAME', this.addneeds.addform.check_name);
          // this.$axios.post("/daliy/checkDaliy", params).then((res) => {
          //   let data = res.data;
          //   if (data.code == 200) {
          //     this.$success(data.message);
          //     this.loadData();
          //     this.tabs.rriority = ''
          //     this.tabs.checks = ''
          //     this.addneeds.addform.check_time = ''
          //     this.addneeds.addform.check_name = ''
          //   } else {
          //     this.$warn(data.message);
          //   }
          //   this.$maskoff();
          // })
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
      //验收
      Finished(val){
        this.$maskin();
          let params = new URLSearchParams();
          params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
          params.append('STATE_ID', val.state_NEXT);
          params.append('REJECT_RESON', '');
          this.$axios.post("/daily/updateDaily", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.loadData();
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          });
      },
      //数据中心施展审核
      DateCenter(val) {
          this.$maskin();
          let params = new URLSearchParams();
          params.append('DALIY_NEET_ID', val.daliy_NEET_ID);
          params.append('STATE_ID', val.state_NEXT);
          params.append('REJECT_RESON', '');
          this.$axios.post("/daily/updateDaily", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.loadData();
            } else {
              this.$warn(data.message);
            }
            this.$maskoff();
          });
      },
      //驳回
      unagreeRow(val, e, text,type) {
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
          params.append('neel_id', val.neel_id);
          params.append('oper', type);
          params.append('reject_reason', value);
          this.$axios.post("/daily/updateDailyRights", params).then((res) => {
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
      },
      downloadAtt(id){
        window.open(`${window._options.baseUrl}/daily/download?token=${this.$getToken()}&ID=${id}`);
      },
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
