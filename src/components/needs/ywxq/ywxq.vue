<template>
  <div class="jcjs common-card-wrap"
     @click="$event.target.className == 'icon-more iconfont'?'':tabs.consoleActionVisible = false">
    <el-card class="box-card">
      <div class="text item">
        <div class="content">
          <div class="action clear">
            <el-button type="danger" size="mini" @click="newneeds" v-if="addneeds.addif">新增</el-button>
            <el-select v-model="selectValue"  placeholder="请选择状态"
                   filterable clearable size="mini" @change="queryTableData($event,'select')">
              <el-option
                  v-for="item in states"
                  :key="item.state_ID"
                  :label="item.state_NAME"
                  :value="item.state_ID">
              </el-option>
            </el-select>
            <div class="fr">
              <div style="margin-right: 10px;" class="i-b">
                <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    size="mini"
                    :picker-options="dateComp"
                    @keyup.enter.native="searchHandle"
                    @keyup.13="queryTableData($event,'date')"
                    @change="queryTableData($event,'date')"
                >
                </el-date-picker>
              </div>
              <div class="search i-b">
                <!-- @keyup.13="searchHandle" -->
                <el-input
                    placeholder="检索编号,名称或相关人"
                    suffix-icon="icon-sousuo iconfont"
                    v-model="keyword"
                    size="mini"
                    clearable
                    @keyup.enter.native="searchHandle"
                    @change="queryTableData($event,'keyword')"
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
          <!--表格部分-->
          <div class="table-list">
            <el-table :data="table.tableData" border style="width: 100%" v-if="table.tableHeight"
                  :height="table.tableHeight"
                  highlight-current-row
                  ref="ywxq_table"
                  :default-sort = "{prop: 'work_NEET_ID', order: 'descending'}"
                  @row-click="handleCurrentChange">
              <el-table-column sortable prop="work_NEET_ID" label="需求编号" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="neel_NAME" label="需求名称" width="180" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="send_NAME" label="需求提出人" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="prod_MANAGER_NAME" label="产品负责人" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="start_DATE" :formatter="tableFormatter_start" label="申请日期" width="120"
                       show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="end_DATE" :formatter="tableFormatter_end" label="期望上线日期" width="140"
                       show-overflow-tooltip></el-table-column>
              <!--<template slot-scope="scope">-->
              <!--<p :title="scope.row.neel_NAME" style="width:160px;">{{scope.row.neel_NAME}}</p>-->
              <!--</template>-->
              <!--<el-table-column prop="aa" label="涉及系统"></el-table-column>-->
              <el-table-column sortable prop="rriority_NAME" label="优先级" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column sortable prop="isFast" label="是否加急" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="state_NAME" label="状态" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" fixed="right" width="230">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary"
                         v-for="(name, key) in scope.row.buttons"
                         style="margin-left: 3px;"
                         :key="key"
                         @click="consoleActionEvent({type: key}, scope.row, $event)">
                    {{name}}
                  </el-button>
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'review'"
                         @click="tableAction(scope.$index, scope.row,$event,'review')">需求评审
                  </el-button>
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'confrim'"
                         @click="tableAction(scope.$index, scope.row,$event,'confrim')">分配
                  </el-button>
                  <!-- 曹俊卿通过和驳回 -->

                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'PRODUCT_MANAGER_CHECK'"
                         @click="tableAction(scope.$index, scope.row,$event,'Cpass')">通过
                  </el-button>
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'PRODUCT_MANAGER_CHECK'"
                         @click="tableAction(scope.$index, scope.row,$event,'Cback')">驳回
                  </el-button>
                  <!-- 曹俊卿通过和驳回 -->
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'accept'"
                         @click="tableAction(scope.$index, scope.row,$event,'accept')">验收
                  </el-button>
                  <!--scope.row.assignor_PERSON_ID可能返回多个id用逗号隔开-->
                  <el-button size="mini" type="primary"
                        v-if="scope.row.check_TYPE == 'J_analysis'"
                         @click="tableAction(scope.$index, scope.row, $event, 305)">需求分析
                  </el-button>
                  <el-button size="mini" type="primary"
                        v-if="['deal_K', 'deal_J', 'deal_T'].indexOf(scope.row.check_TYPE) > -1"
                         @click="tableAction(scope.$index, scope.row, $event, scope.row.check_TYPE)">任务处理
                  </el-button>
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'J_split'"
                         @click="tableAction(scope.$index, scope.row, $event, scope.row.check_TYPE)">拆分任务
                  </el-button>
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'acceptance_310'"
                         @click="tableAction(scope.$index, scope.row, $event, scope.row.check_TYPE)">测试验收
                  </el-button>
                  <el-button size="mini" type="primary"
                         v-if="scope.row.check_TYPE == 'acceptance_329'"
                         @click="consoleActionEvent({type:'PROD_CHECK'},scope.row,$event)">产品验收
                  </el-button>
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
          <!--表格部分-->
          <!--控制台部分-->
          <div class="console-tab-wrapper" v-if="tabs.consoleWrapperVisible">
            <div class="console-action-wrapper">
              <i class="el-icon-close close" @click="setConsoleVisible"></i>
            </div>
            <el-tabs v-model="tabs.activeName" type="card" @tab-click="tabClick">
              <el-tab-pane label="详情页" name="info">
                <div class="console-tab-content">
                  <el-form label-width="120px" label-position="left">
                    <el-row :gutter="20">
                      <el-col>
                        <div style="font-weight:bold;text-align:center;font-size:18px;">需求详情</div>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="状态" style="color: red">
                          {{tabs.tabsData.state_NAME}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.oldcode">
                        <el-form-item label="原需求编号">
                          <span @click="goNeedList($event,tabs.tabsData.oldcode,'old')" style="color: #ffa005;cursor: pointer;">{{tabs.tabsData.oldcode}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.newcode">
                        <el-form-item label="新需求编号" >
                          <span @click="goNeedList($event,tabs.tabsData.newcode,'new')" style="color: #ffa005;cursor: pointer;">{{tabs.tabsData.newcode}}</span>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="需求编号">{{tabs.tabsData.work_NEET_ID}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求名称">{{tabs.tabsData.neel_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求类型">{{tabs.tabsData.type}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="成果类型">{{tabs.tabsData.result}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求影响面">{{tabs.tabsData.influece}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="优先级评定">{{tabs.tabsData.rriority_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求划分归属">{{tabs.tabsData.ascription}}</el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="涉及产品线">{{tabs.tabsData.prduct_LINE}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请日期">{{tabs.tabsData.start_DATE}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="期望上线日期">{{tabs.tabsData.end_DATE}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求来源">{{tabs.tabsData.dept_NAME}} | {{tabs.tabsData.user_NAME}} </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="产品负责人">{{tabs.tabsData.apply_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="重要程度">{{tabs.tabsData.importance_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="委员会评审">
                          <span style="margin-right: 40px;">{{tabs.tabsData.prodReview=='1'?'是':'否'}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="是否加急">
                          <span style="margin-right: 40px;">{{tabs.tabsData.urgentOrNot}}</span>
                          <span style="color: red!important;">{{tabs.tabsData.urgent}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="需求背景">
                          <div class="background"></div>
                          <!--{{tabs.tabsData.background}}-->
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="产品改造点">
                          <div class="product_FUNCTION"></div>
                          <!--{{tabs.tabsData.product_FUNCTION}}-->
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="需求描述">
                          <div class="neel_DESCRIPTION"></div>
                          <!--{{tabs.tabsData.neel_DESCRIPTION}}-->
                        </el-form-item>
                      </el-col>


                      <!----------------------------------需判断部分-->

                      <!--需求文档-->
                      <el-col :span="24" v-if="addneeds.hasUploadFile.length">
                        <el-form-item label="需求文档">
                          <span @click="showDownLoadData(addneeds.hasUploadFile,'需求文档')" style="cursor: pointer;color: red">点击查看</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="开发手册" >
                          <span style="cursor: pointer;color: orangered" @click="showDownLoadData('','开发手册')">点击可查看</span>
                        </el-form-item>
                      </el-col>
                      <!------------------------------当前用例-->
                      <el-col :span="24">
                        <el-form-item label="当前用例" >
                          <span style="cursor: pointer;color: orangered" @click="showDownLoadData('','当前用例')">点击可查看</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="测试环境附件" >
                          <span style="cursor: pointer;color: orangered"
                              @click="showDownLoadData('','测试环境附件')">点击可查看</span>
                        </el-form-item>
                      </el-col>
                      <!--驳回原因-->
                      <el-col :span="24" v-if="tabs.tabsData.reject_RESON" style="color: red">
                        <el-form-item label="驳回原因">{{tabs.tabsData.reject_RESON}}</el-form-item>
                      </el-col>
                      <!---------------------------原产品改造点和产品描述-->
                      <el-col :span="24" v-if="tabs.tabsData.oldchangepoint" style="color: #ffa005">
                        <el-form-item label="原产品改造点">
                          <!--div class="oldchangepoint"></div-->
                          {{tabs.tabsData.oldchangepoint}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="tabs.tabsData.oldneedsname" style="color: #ffa005">
                        <el-form-item label="原需求描述">
                          <!--div class="oldneedsname"></div-->
                          {{tabs.tabsData.oldneedsname}}
                        </el-form-item>
                      </el-col>

                      <!---------------------------新产品改造点和产品描述-->
                      <el-col :span="24" v-if="tabs.tabsData.newchangepoint" style="color: #ffa005">
                        <el-form-item label="新产品改造点">
                          <div class="newchangepoint"></div>
                          <!--{{tabs.tabsData.newchangepoint}}-->
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" v-if="tabs.tabsData.newneedsname" style="color: #ffa005">
                        <el-form-item label="新产品描述">
                          <div class="newneedsname"></div>
                          <!--{{tabs.tabsData.newneedsname}}-->
                        </el-form-item>
                      </el-col>

                      <!---------------------------技术管理部评审结果-->
                      <el-col>
                        <div v-if="tabs.tabsData.pingDate" style="text-align:center;font-weight:bold;font-size:18px;">技术管理部评审结果</div>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.pingDate">
                        <el-form-item label="评审时间">{{tabs.tabsData.pingDate}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="tabs.tabsData.review_GRADE">
                        <el-form-item label="评审等级">{{tabs.tabsData.review_GRADE}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.pingPeople">
                        <el-form-item label="参会人">{{tabs.tabsData.pingPeople}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.pingResult">
                        <el-form-item label="评审结果">{{tabs.tabsData.pingResult}}</el-form-item>
                      </el-col>

                      <!---------------------------产品委员会评审结果-->
                      <el-col>
                        <div v-if="tabs.tabsData.pingDateProd" style="text-align:center;font-weight:bold;font-size:18px;">产品委员会评审结果</div>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.pingDateProd">
                        <el-form-item label="评审时间">{{tabs.tabsData.pingDateProd}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-show="tabs.tabsData.review_level">
                        <el-form-item label="评审等级">{{tabs.tabsData.review_level}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.pingPeopleProd">
                        <el-form-item label="参会人">{{tabs.tabsData.pingPeopleProd}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.pingResultProd">
                        <el-form-item label="评审结果">{{tabs.tabsData.pingResultProd}}</el-form-item>
                      </el-col>

                      <!------------------------------当前用例-->
                      <!-- <el-col :span="24">
                        <el-form-item label="当前用例" >
                          <span style="cursor: pointer;color: orangered" @click="showDownLoadData('','当前用例')">点击可查看</span>
                        </el-form-item>
                      </el-col> -->
                      <!------------------------------开发手册-->
                      <!-- <el-col :span="24">
                        <el-form-item label="开发手册" >
                          <span style="cursor: pointer;color: orangered" @click="showDownLoadData('','开发手册')">点击可查看</span>
                        </el-form-item>
                      </el-col> -->


                      <!------------------------------生产环境附件-->
                      <!-- <el-col :span="24">
                        <el-form-item label="生产环境附件" >
                          <span style="cursor: pointer;color: orangered"
                              @click="showDownLoadData('','生产环境附件')">点击可查看</span>
                        </el-form-item>
                      </el-col> -->
                      <!------------------------------测试环境附件-->
                      <!-- <el-col :span="24">
                        <el-form-item label="测试环境附件" >
                          <span style="cursor: pointer;color: orangered"
                              @click="showDownLoadData('','测试环境附件')">点击可查看</span>
                        </el-form-item>
                      </el-col> -->
                      <!------------------------------准生产环境附件-->
                      <!-- <el-col :span="24">
                        <el-form-item label="准生产环境附件" >
                          <span style="cursor: pointer;color: orangered"
                              @click="showDownLoadData('','准生产环境附件')">点击可查看</span>
                        </el-form-item>
                      </el-col> -->

                      <!--bug清单-->
                      <el-col :span="24" v-if="tabs.allBug.length>0">
                        <el-form-item label="BUG清单" style="color:orangered">
                          <span @click="loadAllBugs" style="cursor: pointer">点击可查看</span></el-form-item>
                      </el-col>
                      <!--驳回原因-->
                      <!-- <el-col :span="24" v-if="tabs.tabsData.reject_RESON" style="color: red">
                        <el-form-item label="驳回原因">{{tabs.tabsData.reject_RESON}}</el-form-item>
                      </el-col> -->
                      <!--验收不通过-->
                      <el-col :span="24" v-if="tabs.tabsData.fail" style="color: red">
                        <el-form-item label="验收不通过原因">{{tabs.tabsData.fail}}</el-form-item>
                      </el-col>
                      <!--验收通过原因-->
                      <el-col :span="24" v-if="tabs.tabsData.success" style="color: red">
                        <el-form-item label="验收通过原因">{{tabs.tabsData.success}}</el-form-item>
                      </el-col>

                      <!--开发和测试的完成开始时间-->
                      <el-col :span="12" v-if="tabs.tabsData.code_start">
                        <el-form-item label="开发开始时间">{{tabs.tabsData.code_start | date_y_m_d}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.code_end">
                        <el-form-item label="开发完成时间">{{tabs.tabsData.code_end | date_y_m_d}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.test_start">
                        <el-form-item label="测试开始时间">{{tabs.tabsData.test_start | date_y_m_d}}</el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="tabs.tabsData.test_end">
                        <el-form-item label="测试完成时间">{{tabs.tabsData.test_end | date_y_m_d}}</el-form-item>
                      </el-col>
                      <!----------------------------------需判断部分-->


                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="操作台" name="console" v-if="split.hasSplitTaskDataByGroup">
                <div class="console-tab-content">
                  <!--div class="console-action-wrapper" v-if="tabs.consoleActionData.length">
                    <i class="icon-more iconfont"
                       @click="tabs.consoleActionVisible = !tabs.consoleActionVisible"></i>
                    <div class="console-action fr" v-if="tabs.consoleActionVisible">
                      <span v-for="(item, index) in tabs.consoleActionData"
                          @click="consoleActionEvent(item)">{{item.name}}
                      </span>
                    </div>
                  </div-->
                  <!--状态记录和发送人-->
                  <el-form label-width="100px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="状态" style="color: red">
                          {{tabs.tabsData.state_NAME}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="发送人">{{tabs.tabsData.fasong_NAME}}</el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
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
                            <span>{{scope.row.SYSTEM_NAME?'开发任务':'测试任务'}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="USER_NAME" label="人员" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="SYSTEM_NAME_SHOW" label="系统名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="WORK_INFO_ID" label="任务编码" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="end_data_format" label="完成日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="RESPONSIBLE_MODULE" show-overflow-tooltip
                                 label="负责模块"></el-table-column>
                        <el-table-column prop="FACILITY_NAME" label="难易度" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="REQUIRED_TIME" label="预计用时" show-overflow-tooltip></el-table-column>
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
                  <!--技术管理部评审-->
                  <el-form style="margin-top: 20px;" v-if="ifPing.visible" label-width="120px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="评审等级">
                          <el-select v-model="ifPing.rriority" filterable clearable placeholder="请选择评审等级" style="width: 100%">
                            <el-option v-for="item in ifPing.rriorityArr" :label="item.RRIORITY_NAME"
                                   :key="item.RRIORITY_ID" :value="item.RRIORITY_ID"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求评审结果">
                          <el-select v-model="ifPing.checks" filterable clearable placeholder="请选择需求评审结果" style="width: 100%">
                            <el-option v-for="item in ifPing.checksArr" :label="item.CHECK_NAME" :key="item.CHECK_ID"
                                   :value="item.CHECK_ID+'-'+item.CHECK_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="评审时间">
                          <el-date-picker type="date"
                            placeholder="选择评审日期"
                            v-model="ifPing.date"
                            :picker-options='filterDate'
                            style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="参会人">
                          <el-input v-model="ifPing.person"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <!--产品委员会评审-->
                  <el-form style="margin-top: 20px;" v-if="ifPingProd.visible" label-width="120px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="评审等级">
                          <el-select v-model="ifPingProd.rriority" filterable clearable placeholder="请选择评审等级" style="width: 100%">
                            <el-option v-for="item in ifPingProd.rriorityArr" :label="item.RRIORITY_NAME"
                                   :key="item.RRIORITY_ID" :value="item.RRIORITY_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="需求评审结果">
                          <el-select v-model="ifPingProd.checks" filterable clearable placeholder="请选择需求评审结果" style="width: 100%">
                            <el-option v-for="item in ifPingProd.checksArr" :label="item.CHECK_NAME" :key="item.CHECK_ID"
                                   :value="item.CHECK_ID+'-'+item.CHECK_NAME"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="评审时间">
                          <el-date-picker type="date"
                            placeholder="选择评审日期"
                            v-model="ifPingProd.date"
                            :picker-options='filterDate'
                            style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="参会人">
                          <el-input v-model="ifPingProd.person"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <!--挂起/转接/恢复/编辑 操作-->
                  <div v-if="hang.hangvisible">
                    <div class="table-list" style="margin-top: 30px;">
                      <el-table :data="hang.hangtableData" height="280" border
                            style="width: 100%">
                        <el-table-column label="任务类型" width="100" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <div style="text-align: center">
                              {{scope.row.system_NAME?'开发任务':'测试任务'}}
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="user_NAME" label="人员" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="system_NAME" label="系统名" show-overflow-tooltip></el-table-column>
                        <!--<el-table-column prop="task_ID" label="任务编码"-->
                        <!--width="190"></el-table-column>-->
                        <el-table-column prop="end_DATE" :formatter="splitDataFormatter" wdith="120" label="完成日期"
                                 show-overflow-tooltip></el-table-column>
                        <el-table-column prop="responsible_MODULE" label="负责模块" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="facility_NAME" label="难易度" width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column>
                        <el-table-column prop="required_TIME" label="现预计用时（小时）" width="100"></el-table-column>
                        <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column>
                        <el-table-column prop="work_TIME" label="现实际用时（小时）" width="100"></el-table-column>
                        <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column>
                        <el-table-column prop="sign_REAMRK" label="挂起原因" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="remark" label="转接原因" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column>
                        <el-table-column label="状态" width="100" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <!--<div style="text-align: center">-->
                            <!--判断是否是新建变更，新建变更去除其他状态信息，统一变成已新建变更-->
                            <div v-if="tabs.activeTableInfo.state_ID != 320">
                                <span v-if="scope.row.sign == 0"
                                    style="color: red">已挂起</span>
                              <span v-if="scope.row.state_ID ==307 && scope.row.sign == 1"
                                  style="color: red">开发中</span>
                              <span v-if="scope.row.state_ID ==309 && scope.row.sign == 1"
                                  style="color: red">测试中</span>
                              <span v-if="scope.row.state_ID ==319  && scope.row.sign == 1"
                                  style="color: green">已完成</span>
                              <span v-if="scope.row.state_ID == 319 && scope.row.sign == 2"
                                  style="color: red">已转接</span>
                            </div>
                            <span v-if="tabs.activeTableInfo.state_ID == 320" style="color: red">已新建变更</span>
                            <!--</div>-->
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="160">
                          <template slot-scope="scope">
                            <div style="text-align: center">
                              <!--判断是否是新建变更，新建变更去除掉挂起，转接，恢复操作，只保留编辑用时操作-->
                              <div v-if="tabs.activeTableInfo.state_ID != 320">
                                <el-button type="primary" size="mini"
                                       v-if="scope.row.sign == 1 && scope.row.state_ID != 319"
                                       @click="hangAction(scope.row,scope.$index)">挂起</el-button>
                                <el-button type="primary" size="mini"
                                       v-if="scope.row.sign == 1 && scope.row.state_ID != 319"
                                       @click="transferAction(scope.row,scope.$index)">转接</el-button>
                                <el-button type="primary" size="mini"
                                       v-if="scope.row.sign == 0 && scope.row.state_ID != 319"
                                       @click="restore(scope.row)">恢复</el-button>
                              </div>

                              <el-button type="primary" size="mini"
                                     v-if="scope.row.state_ID == 319 || scope.row.state_ID == 320"
                                     @click="editTaskUseTime(scope.row,scope.$index)">编辑</el-button>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <!--技术经理分析需求-->
                  <el-form v-if="review.reviewvisible" label-width="120px" label-position="left">
                    <el-row :span="24" :gutter="20" style="margin-top: 20px;">
                      <el-col :span="12" :md="12">
                        <el-form-item label="预计开始时间">
                          <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            :picker-options="filterDateBegin"
                            v-model="review.startDate"
                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :md="12">
                        <el-form-item label="预计完成时间">
                          <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            :picker-options="filterDateEnd"
                            v-model="review.endDate"
                            style="width: 100%;"></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :md="12">
                        <el-form-item label="分析时间">
                          <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            v-model="review.fxDate"
                            :picker-options='filterDate'
                            style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" :md="12">
                        <el-form-item label="需求分析结果">
                          <el-select v-model="review.result" filterable clearable placeholder="请选择需求分析结果" style="width: 100%;">
                            <el-option :key="index" v-for="(item, index) in review.resultArr" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" :md="24">
                        <el-form-item label="风险点">
                          <el-input type="textarea" v-model="review.risk"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <!--技术经理确认变更-->
                  <div v-if="changeInset.visible">
                    <!--<p style="color: red;">注：提交编辑后即为修改原拆分任务！</p>-->
                    <div class="table-list">
                      <el-table :data="changeInset.tableData" border style="width: 100%">
                        <el-table-column label="任务类型"  show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{scope.row.system_NAME?"开发任务":"测试任务"}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="user_NAME" label="人员"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="work_INFO_ID" label="任务编码" width="190" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="system_NAME" label="原系统名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="now_system_NAME" label="现系统名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="end_DATE" :formatter="changeInsetMatter" label="原完成日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="now_end_DATE" :formatter="changeInsetMatter_now" label="现完成日期" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="responsible_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="now_responsible_MODULE" label="现负责模块" width="120" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="facility_NAME" label="原难易度" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="now_facility_NAME" label="现难易度" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="required_TIME" label="原预计用时（小时）" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="old_REQUIRED_TIME" label="现预计用时（小时）" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="work_TIME" label="原实际用时（小时）" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="old_ACTUAL_TIME" label="现实际用时（小时）" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="actual_TIME" label="总工时" width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip>
                          <template slot-scope="scope">
                            <el-button size="mini" type="primary" v-if="scope.row.state_ID !=319"
                                   @click="editChangeInset(scope.$index, scope.row)">编辑
                            </el-button>
                            <span v-if="scope.row.state_ID ==319" style="color: red">已完成任务</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <!--操作按钮-->
                  <div class="tab-console-handler">
                    <template v-if="tabs && tabs.consoleActionData && tabs.consoleActionData.findIndex(item => item.type === 'CONFRIMUPDATE') === -1">
                      <el-button v-if="changeInset.visible" style="float: none" type="primary" size="mini" @click="subChangeInset">确认变更</el-button>
                      <el-button size="mini" type="primary" style="float: none" v-if="review.reviewvisible" @click="reviewSub">提交分析结果</el-button>
                      <el-button size="mini" type="primary" style="float: none" v-if="review.reviewvisible" @click="consoleActionEvent({name: '驳回', type: 'DRAW'})">驳回</el-button>
                      <el-button @click="subPing" v-if="ifPing.visible" size="mini" type="primary">提交审批</el-button>
                      <el-button @click="subPingProd" v-if="ifPingProd.visible" size="mini" type="primary">提交审批</el-button>
                      <el-button v-if="split.splitvisible" size="mini" type="primary" @click="splitSubmit">提交</el-button>
                    </template>
                    <el-button
                      v-for="(item, index) in tabs.consoleActionData"
                      :key="index"
                      @click="consoleActionEvent(item)"
                      size="mini"
                      type="primary"
                      v-if="!(split.splitvisible || hang.hangvisible) || [307, 309].indexOf(tabs.tabsData.state_ID) === -1"
                    >{{item.name}}</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="开发任务操作台" name="codetask" v-if="tabs.codetask && tabs.tabsData.isShowDevOrTest">
                <div class="console-tab-content">
                  <div class="table-list" v-if="split.codetask">
                    <div class="clear">
                      <el-button style="float: left;margin: 10px 0"
                             type="primary" size="mini" @click="showCodeBUG">BUG清单
                      </el-button>
                      <span style="color:red;">每个系统必须上传操作手册(同一系统多人开发，上传一份即可)，若有SQL请同步上传。</span>
                      <!--上传手册-->
                      <!-- <el-button style="float: left;margin: 10px" type="primary" size="mini" @click="startUpload('上传手册')">上传手册</el-button> -->
                    </div>
                    <el-table :data="split.codetask" border style="width: 100%">
                      <el-table-column prop="user_NAME" label="人员" width="80"></el-table-column>
                      <el-table-column prop="old_SYSTEM_NAME" label="原系统名" show-overflow-tooltip width="120"></el-table-column>
                      <el-table-column prop="system_NAME" label="当前系统名" show-overflow-tooltip width="120"></el-table-column>
                      <el-table-column prop="work_INFO_ID" label="任务编码" show-overflow-tooltip width="200"></el-table-column>
                      <el-table-column prop="end_DATE" :formatter="splitDataFormatter" show-overflow-tooltip label="完成日期" width="120"></el-table-column>
                      <el-table-column prop="old_RESPONSIBLE_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="responsible_MODULE" label="当前负责模块" width="120" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="facility_NAME" label="难易度" width="70"></el-table-column>
                      <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column>
                      <el-table-column prop="required_TIME" label="现预计用时（小时）" width="100"></el-table-column>
                      <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column>
                      <el-table-column prop="work_TIME" label="现实际用时（小时）" width="100"></el-table-column>
                      <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column>
                      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column>
                      <el-table-column width="160" label="上传附件" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <el-button v-if="scope.row.state_ID == 307 && scope.row.sign == 1" type="primary" size="mini" @click="startUpload('上传附件',scope.row.systemson_ID)">操作手册&SQL</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <!--<el-button size="mini" type="primary"-->
                          <!--v-if="scope.row.state_ID == 306 && scope.row.user_NAME != '合计'"-->
                          <!--@click="splitCodeStart(scope.$index, scope.row)">开始-->
                          <!--</el-button>-->
                          <!-- <el-button v-if="scope.row.state_ID == 307 && scope.row.sign == 1" type="primary" size="mini" @click="startUpload('上传手册')">上传手册</el-button> -->
                          <el-button size="mini" type="primary"
                                 v-if="scope.row.state_ID == 307 && scope.row.sign == 1"
                                 @click="splitTaskFinish(scope.$index, scope.row)">完成
                          </el-button>
                          <span v-if="scope.row.state_ID == 319 && scope.row.sign == 2"
                              style="color: red">已转接</span>
                          <span v-if="scope.row.state_ID == 319 && scope.row.sign == 1"
                              style="color: green">已完成</span>
                          <span v-if="scope.row.state_ID == 320" style="color: red">已新建变更</span>
                          <span v-if="scope.row.state_ID == 321" style="color: red">已需求内变更</span>
                          <span v-if="scope.row.sign == 0" style="color: red">已挂起</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="测试任务操作台" name="testtask" v-if="tabs.testtask && tabs.tabsData.isShowDevOrTest">
                <div class="console-tab-content">
                  <!--选择用例类型和展示任务-->
                  <div v-if="testTask.hasTask">
                    <div class="clear" style="margin: 20px 0;">
                      <!--用例类型-->
                      <div class="fl">
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
                      </div>
                      <!--bug清单-->
                      <el-button class="fr" type="primary" size="mini" @click="showTestAllBug" style="margin-left: 10px;">BUG清单</el-button>
                      <!--上传测试报告-->
                      <el-button class="fr" type="primary" size="mini" @click="showTestReportUpload">上传测试报告</el-button>
                      <!--上传用例-->
                      <el-button class="fr" type="primary" size="mini" @click="startUpload('上传用例')">上传用例</el-button>
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
                          <el-table-column prop="user_NAME" label="人员" width="80" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="work_INFO_ID" label="任务编码"
                                   width="200"></el-table-column>
                          <el-table-column prop="end_DATE" :formatter="splitDataFormatter" width="120" label="完成日期"></el-table-column>
                          <el-table-column prop="old_RESPONSIBLE_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="responsible_MODULE" label="当前负责模块" width="120" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column>
                          <el-table-column prop="required_TIME" label="现预计用时（小时）" width="100"></el-table-column>
                          <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column>
                          <el-table-column prop="work_TIME" label="现实际用时（小时）" width="100"></el-table-column>
                          <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column>
                          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="test_RESULT" label="测试结果" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column>
                          <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                              <div style="text-align: center">
                                <el-button size="mini" type="primary"
                                       style="float: none;display: inline-block" @click="goTestTask(scope.$index, scope.row)"
                                       v-if="scope.row.state_ID == 309 && scope.row.sign == 1">进入
                                </el-button>
                                <el-button size="mini" type="primary"
                                       style="float: none;display: inline-block" @click="splitTaskFinish(scope.$index, scope.row,'test')"
                                       v-if="scope.row.state_ID == 309 && scope.row.sign == 1">完成
                                </el-button>
                                <span v-if="scope.row.state_ID == 319 && scope.row.sign == 1"
                                    style="color: green">已完成</span>
                                <span v-if="scope.row.state_ID == 319 && scope.row.sign == 2"
                                    style="color: red">已转接</span>
                                <span v-if="scope.row.state_ID == 320" style="color: red">已新建变更</span>
                                <span v-if="scope.row.state_ID == 321" style="color: red">已需求内变更</span>
                                <span v-if="scope.row.sign == 0" style="color: red">已挂起</span>
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
              <el-tab-pane label="拆分项目详情" name="split" v-if="tabs.allSplittask">
                <div class="console-tab-content">
                  <!--判断当前是否被拆分过任务-->
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
              </el-tab-pane>
              <el-tab-pane label="全程跟踪" name="log">
                <div class="console-tab-content">
                  <el-form label-width="60px" label-position="left">
                    <el-row :gutter="20">
                      <el-col :span="6" :sm="6">
                        <el-form-item label="状态" style="color: red">
                          {{tabs.tabsData.state_NAME}}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" :sm="6">
                        <el-form-item label="发送人">{{tabs.tabsData.send_NAME}}</el-form-item>
                      </el-col>
                      <el-col :span="6" :sm="6">
                        <el-form-item>
                        <el-button size="mini" type="primary" @click="loadtrack">
                          {{tracking.trackingvisiible?'列表模式':'视图模式'}}</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" :sm="6">
                        <el-form-item>
                          <el-select size="mini" v-model="tabs.genzongchoosen" filterable clearable placeholder="请选择筛选部门"
                                 style="width: 100%" @change="genzongChange">
                            <el-option v-for="item in tabs.genzongArr" :label="item.DEPT_NAME" :key="item.DEPT_ID"
                                   :value="item.DEPT_ID"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24" :sm="24" v-show="!tracking.trackingvisiible">
                        <p :key="index" v-for="(item,index) in tabs.genzong" class="genzong">
                          <span style="display: inline-block;width: 30px">{{index+1}}.</span> <span>{{item.record_START | date}}</span>{{item.record_DESC}}
                        </p>
                      </el-col>
                      <el-col :span="24" :sm="24" v-show="tracking.trackingvisiible">
                        <tracking :tracking="tracking"></tracking>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="实时统计" name="count">
                <!--<realtime :sstj="sstj"></realtime>-->
                <div class="console-tab-content">
                  <el-tabs v-model="sstj.activeName" class="sstabs" style="width: 100%;height: 100%">
                    <el-tab-pane label="周期" name="first" clearable>
                      <!--周期-->
                      <h1 v-if="sstj.hidezqvisible"
                        style="text-align: center; font-weight: bold; color: #b5b5b5;font-size: 22px">暂无周期信息</h1>
                      <div v-show="!sstj.hidezqvisible" id="system" clearable style="width:1000px;height: 200px;margin: 20px 0;"></div>
                    </el-tab-pane>
                    <el-tab-pane label="工时" name="second" clearable>
                      <h1 v-if="sstj.hidegsvisible"
                        style="text-align: center;font-weight: bold; color: #b5b5b5;font-size: 22px">暂无工时进度</h1>
                      <ul v-if="!sstj.hidegsvisible" style="margin-bottom: 10px">
                        <li :key="index" v-for="(item, index) in sstj.info" style="width: 30%;display: inline-block">
                          {{item.DEPT_NAME}}总工时:{{item.requiredTime}}&nbsp;&nbsp;Bug数:{{item.bugCount}}
                        </li>
                      </ul>
                      <div  v-show="!sstj.hidegsvisible" style="width: 1000px;" class="clear" id="hours-div">
                        <h1 style="text-align: center; font-weight: 900;font-size: 22px">工时统计</h1>
                      </div>
                      <div v-show="!sstj.hidegsvisible" style="width: 1000px;"  id="user-div" class="clear"></div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!--控制台部分-->
        </div>
      </div>
    </el-card>
    <!--新增-->
    <el-dialog :close-on-click-modal="false" :title="addneeds.addform.title" :visible="addneeds.addvisible" width="80%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-row :md="24" :gutter="20">
          <!--原需求编号-->
          <el-col :span="24" :md="24" v-if="addneeds.addform.oldcode">
            <el-form-item label="原需求编号">
              <span style="color: #FF6600;cursor: pointer">{{addneeds.addform.oldcode}}</span>
            </el-form-item>
          </el-col>
          <!--原需求编号-->
          <el-col :span="12" :md="12">
            <el-form-item label="需求编号">
              <el-input :disabled="addneeds.notAllowChooseType" v-model="addneeds.addform.code" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求名称">
              <el-input v-model="addneeds.addform.name" :disabled="addneeds.addType == 'changeInset'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求类型">
              <el-select filterable clearable :disabled="addneeds.addType == 'changeInset'"
                     v-model="addneeds.addform.needstype"
                     placeholder="请选择需求类型"
                     style="width: 100%">
                <el-option v-for="item in addneeds.addform.needstypeArr" :label="item.NEEL_TYPE_NAME" :key="item.NEEL_TYPE_NAME"
                       :value="item.NEEL_TYPE_NAME"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="成果类型">
              <el-select :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.resulttype"  filterable clearable  placeholder="请选择成果类型"
                     style="width: 100%">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.resulttypeArr" :label="item"
                       :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求影响面">
              <el-select v-model="addneeds.addform.affect"  filterable clearable  placeholder="请选择影响面"
                     :disabled="addneeds.addType == 'changeInset'" style="width: 100%">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.affectArr" :label="item"
                       :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="优先级评定">
              <el-select :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.level"  filterable clearable  placeholder="请选择优先级"
                     style="width: 100%;">
                <el-option v-for="item in addneeds.addform.levelArr" :label="item.RRIORITY_NAME" :key="item.RRIORITY_ID"
                       :value="item.RRIORITY_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求划分归属">
              <el-select :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.attribution"  filterable clearable  placeholder="请选择需求划分归属"
                     style="width: 100%;">
                <el-option :key="index" v-for="(item, index) in addneeds.addform.attributionArr" :label="item"
                       :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="重要程度">
              <el-select :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.zhongyaochegndu"  filterable clearable  placeholder="请选择重要程度"
                     style="width: 100%;">
                <el-option v-for="item in addneeds.addform.zhongyaochegnduArr"
                      :label="item.importance_NAME" :value="item.importance_ID" :key="item.importance_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="申请日期">
              <el-date-picker
                :disabled="addneeds.addType == 'changeInset'"
                type="date"
                placeholder="选择日期"
                :picker-options="filterDateStart"
                v-model="addneeds.addform.shenqingdate"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="期望上线日期">
              <el-date-picker
                :disabled="addneeds.addType == 'changeInset'"
                type="date"
                placeholder="选择日期"
                :picker-options="filterDateDeploy"
                v-model="addneeds.addform.designdate"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求提出部门">
              <el-select :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.fromdeptId"
                     filterable clearable  placeholder="请选择部门"
                     style="width: 100%" @change="fromdeptchange">
                <el-option v-for="item in addneeds.addform.fromdeptArr" :label="item.dept_name" :key="item.dept_id"
                       :value="item.dept_id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <el-form-item label="需求提出人">
              <el-select :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.fromdeptroleId"  filterable clearable  placeholder="请选择人员"
                     style="width: 100%;">
                <el-option v-for="item in addneeds.addform.fromdeptroleArr" :label="item.user_NAME" :key="item.user_ID"
                       :value="item.user_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :md="12">
            <!--el-form-item label="产品负责人">
              <el-input :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.sxname"></el-input>
            </el-form-item-->
            <el-form-item label="产品负责人">
              <el-select
                style="width: 100%"
                v-model="addneeds.addform.sxname"
                filterable
                placeholder="请选择产品负责人"
                @change="Text"
                filterable
                disabled
                >
                <el-option v-for="item in userData" :label="item.user_NAME"
                  :value="item.user_ID" :key="item.user_ID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="委员会评审" style="height: 42px">
              <el-row :span="24">
                <el-col :span="6" :md="6">
                  <el-radio v-model="addneeds.addform.toProductCommittee" label="0" :disabled="addneeds.addType == 'changeInset' || addneeds.addType=='edit'">否</el-radio>
                  <el-radio v-model="addneeds.addform.toProductCommittee" label="1" :disabled="addneeds.addType == 'changeInset' || addneeds.addType=='edit'">是</el-radio>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="是否加急" style="height: 42px">
              <el-row :span="24">
                <el-col :span="6" :md="6">
                  <el-radio v-model="addneeds.addform.jiaji" label="0" :disabled="addneeds.addType == 'changeInset'">否</el-radio>
                  <el-radio v-model="addneeds.addform.jiaji" label="1" :disabled="addneeds.addType == 'changeInset'">是</el-radio>
                </el-col>
                <el-col :span="18" :md="18">
                  <el-input placeholder="请填写加急原因" :disabled="addneeds.addType == 'changeInset'" v-model="addneeds.addform.jiajireason"
                        v-if="addneeds.addform.jiaji ==1?true:false"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="涉及产品线">
              <el-input :disabled="addneeds.addType == 'changeInset'" type="textarea"
                    v-model="addneeds.addform.productline"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24">
            <el-form-item label="需求背景">
              <!--<el-input :disabled="addneeds.addType == 'changeInset'"-->
              <!--type="textarea" v-model="addneeds.addform.reform"></el-input>-->
              <v-vueQuillEditor-reform
                  ref="reform"
                  v-if="addneeds.addType != 'changeInset'"
                  :reform="addneeds.addform.reform" @setValue="setValue_reform">
              </v-vueQuillEditor-reform>
              <div v-if="addneeds.addType == 'changeInset'" class="reform_change"></div>
              <!--{{addneeds.addform.reform}}-->
            </el-form-item>
          </el-col>

          <!--产品改造点-->
          <el-col :span="24" :md="24">
            <el-form-item label="产品改造点">
              <!--<el-input v-model="addneeds.addform.changepoint" type="textarea" ></el-input>-->
              <v-vueQuillEditor-changepoint
                  :changepoint="addneeds.addform.changepoint" @setValue="setValue_changepoint">
              </v-vueQuillEditor-changepoint>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24" v-if="addneeds.addform.oldchangepoint">
            <el-form-item label="原产品改造点">
              <div class="oldchangepoint_change"></div>
              <!--{{addneeds.addform.oldchangepoint}}-->
            </el-form-item>
          </el-col>
          <!--产品改造点-->

          <!--需求描述-->
          <el-col :span="24" :md="24">
            <el-form-item label="需求描述">
              <!--<el-input type="textarea" v-model="addneeds.addform.needsname"></el-input>-->
              <v-vueQuillEditor-needsname
                  :needsname="addneeds.addform.needsname" @setValue="setValue_needsname">
              </v-vueQuillEditor-needsname>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="24" v-if="addneeds.addform.oldneedsname">
            <el-form-item label="原需求描述">
              <div class="oldneedsname_change"></div>
              <!--{{addneeds.addform.oldneedsname}}-->
            </el-form-item>
          </el-col>
          <!--需求描述-->
          <!--上传需求文档-->
          <el-col :span="24" :md="24">
            <el-form-item label="上传需求文档">
              <div class="upload-wrapper" style="float: none">
                <el-button type="primary" size="mini">上传需求文档</el-button>
                <input type="file" @change="uploadneeds($event)" class="upload-input" style="width: 104px;top: 8px;">
              </div>
              <p :key="index" v-for ="(item,index) in addneeds.uploadFiles">{{item.name}}
                <i style="margin-left: 10px;cursor: pointer;color: red;"
                   @click="addneeds.fileIds.splice(index,1);addneeds.uploadFiles.splice(index,1)" class="el-icon-close"></i>
              </p>
            </el-form-item>
          </el-col>
          <!--上传需求文档-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addneeds.addvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="subaddForm" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配-->
    <SelectUser
      v-if="assignvisible"
      :panelVisible.sync='assignvisible'
      :panelTip='panelTip'
      :myurl='myurl'
      v-on:message='subAssign'
      :taskid='taskid'
    ></SelectUser>
    <!--拆分任务-->
    <el-dialog :close-on-click-modal="false" title="新增拆分任务人员" :visible="split.splitaddvisible" width="60%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="任务编码">
          <el-input v-model="split.taskcode" disabled></el-input>
        </el-form-item>
        <el-form-item label="系统名">
          <el-col :span="24">
            <el-radio v-model="split.splitradio" label="1" @change="chooseUserByTask">测试任务</el-radio>
            <el-radio v-model="split.splitradio" label="2" @change="chooseUserByTask">开发任务</el-radio>
            <el-select style="margin-left: 20px;" filterable clearable  v-model="split.choosesystem" @change="selectSys"
                   placeholder="请选择" v-if="split.splitradio == 2">
              <el-option v-for="item in split.choosesystemArr" :label="item.system_NAME" :key="item.system_ID"
                  :value="`${item.system_ID},${item.system_NAME}`" clearable></el-option>
            </el-select>
            <el-select style="margin-left: 20px;" filterable clearable  v-model="split.choosesystemSub"
                   placeholder="请选择" v-if="split.splitradio == 2">
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
        <el-form-item label="难易度" v-if="split.splitradio == 2">
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
    <!--开发和测试点击完成-->
    <el-dialog :close-on-click-modal="false" title="完成任务" :visible="taskFinished.taskFinishedvisible" width="60%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <el-form label-width="140px">
        <el-form-item label="请填写不通过原因" v-if="taskFinished.testnotallow">
          <el-input v-model="taskFinished.testnotallowtext" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="请填写实际用时">
          <el-input v-model="taskFinished.usetime"></el-input>
        </el-form-item>
        <el-form-item label="请填写超时原因" v-if="taskFinished.outtime">
          <el-input v-model="taskFinished.reason" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskFinished.taskFinishedvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="subFinishTask" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!--拆分任务详情-->
    <el-dialog :close-on-click-modal="false" title="拆分项目详情和分析结果" :visible="split.hasSplitvisible" width="90%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <!--评审结果-->
      <split-ping :data="split.reviewData"></split-ping>
      <!--具体拆分任务-->
      <split-task :data="split.hasSplitTaskData" :tabs="tabs.activeTableInfo"></split-task>
    </el-dialog>
    <!--测试新增步骤-->
    <el-dialog :close-on-click-modal="false" title="新增步骤" :visible="testTask.addvisible" width="60%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <el-form label-width="100px"
           label-position="left">
        <el-form-item label="步骤">
          <el-input v-model="testTask.step" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="预期">
          <el-input v-model="testTask.result" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="testTask.addvisible = false;testTask.step = '';testTask.result = ''" size="mini">取
          消
        </el-button>
        <el-button type="primary" @click="addTestStep" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!--展示给开发人员的bug-->
    <el-dialog :close-on-click-modal="false" title="当前BUG" :visible="testTask.codeBUGlistvisible"
           append-to-body modal-append-to-body width="85%"
           :before-close="closeDialog">
      <div class="table-list">
        <el-table :data="testTask.codeBUGData" border style="width: 100%">
          <el-table-column prop="work_BUG_ID" label="编号" width="190" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_DATE" label="提交日期" width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="start_TIME" label="提交时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assignor_NAME" label="提交人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="desired_RESULT" label="预期效果" show-overflow-tooltip></el-table-column>
          <el-table-column prop="problem_DESCRIPTION" label="问题描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="first_PERSON_NAME" label="指派人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="user_NAME" label="完成人" show-overflow-tooltip></el-table-column>
          <el-table-column label="附件">
            <template slot-scope="scope">
              <span style="color: #409EFF;"  @click="showDownLoadData(testTask.allbuglist,'BUG附件',scope.row)">查看</span>
              <!--<el-button type="primary" size="mini" @click="showBUGFile(scope.row)">查看</el-button>-->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div style="text-align: center">
                <el-button size="mini" type="primary" style="display: inline-block;float: none"
                       v-if="scope.row.bug_STATE ==0"
                       @click="codeBUGAction(scope.$index, scope.row,'完成')">完成
                </el-button>
                <!-- <el-button size="mini" type="danger" style="display: inline-block;float: none"
                       v-if="scope.row.bug_STATE ==0"
                       @click="codeBUGAction(scope.$index, scope.row,'转接')">转接
                </el-button> -->
                <span v-if="scope.row.bug_STATE == 1" style="color: green">已提交</span>
                <span v-if="scope.row.bug_STATE == 2" style="color: green">已关闭</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :close-on-click-modal="false" title="请选择转接人员" :visible="testTask.assignvisible_code" width="40%"
             append-to-body modal-append-to-body :before-close="closeAssign_code">
        <el-select v-model="testTask.assignPerson_code" filterable clearable  placeholder="请选择" style="float: none;display: block;">
          <el-option
              v-for="item in testTask.assignArr_code"
              :key="item.user_ID"
              :label="item.user_NAME"
              :value="item.user_ID+','+item.user_NAME">
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignpersonAction($event,'code')" size="mini" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!--所有的bug清单-->
    <all-bug :data="allbug"></all-bug>
    <!--挂起的实际用时-->
    <el-dialog :close-on-click-modal="false" title="挂起" :visible="hang.dialogvisible" width="60%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <el-form label-width="120px">
        <el-form-item label="请填写实际用时">
          <el-input v-model="hang.usetime"></el-input>
        </el-form-item>
        <el-form-item label="请填写挂起原因">
          <el-input v-model="hang.reason" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hang.dialogvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="hangsub" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!--转接的实际用时-->
    <el-dialog :close-on-click-modal="false" title="转接" :visible="transfer.dialogvisible" width="60%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <el-form label-width="120px">
        <el-form-item label="请选择转接人员">
          <el-select v-model="transfer.person" filterable clearable  placeholder="请选择人员"
                 style="width: 100%">
            <el-option :key="index" v-for="(item, index) in transfer.personArr" :label="item.user_NAME"
                   :value="item.user_ID+'-'+item.user_NAME"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请填写实际用时">
          <el-input v-model="transfer.usetime"></el-input>
        </el-form-item>
        <el-form-item label="请填写转接原因">
          <el-input v-model="transfer.reason" type="textarea" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transfer.dialogvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="transferSub" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑原拆分任务-->
    <el-dialog :close-on-click-modal="false" title="编辑拆分任务人员" :visible="changeInset.splitaddvisible" width="60%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="任务编码">
          {{changeInset.taskcode}}
        </el-form-item>
        <el-form-item label="系统名" v-if="changeInset.system_NAME">
          <el-col :span="24">
            {{changeInset.system_NAME?'开发任务':'测试任务'}}
            <el-select style="margin-left: 20px;" filterable clearable  v-model="changeInset.choosesystem"
                   placeholder="请选择" >
              <el-option :key="index" v-for="(item, index) in changeInset.allsystem" :label="item.SYSTEM_NAME"
                     clearable :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="人员">
          {{changeInset.person}}
        </el-form-item>
        <el-form-item label="完成日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="changeInset.finishdate"
                  style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="负责模块">
          <el-input v-model="changeInset.model" placeholder="请输入负责模块" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="难易度" v-if="changeInset.system_NAME">
          <el-select v-model="changeInset.levelchoosen" filterable clearable  placeholder="请选择难易度"
                 style="width: 100%">
            <el-option :key="index" v-for="(item, index) in changeInset.level" :label="item.FACILITY_NAME"
                   :value="item.FACILITY_ID+'-'+item.FACILITY_NAME"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计用时">
          <el-col :span="24">
            <el-input v-model="changeInset.usetime" placeholder="请输入现预计用时（小时）"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="原实际用时">
          <el-col :span="24">
            <el-input v-model="changeInset.truetime" placeholder="请输入预计用时（小时）"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeInset.splitaddvisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="changeInsetPersonSub" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!--测试指派bug给开发-->
    <el-dialog :close-on-click-modal="false" title="请选择指派人员" :visible="testTask.rejectvisible" width="40%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-form-item v-if="testTask.addbug" label="问题描述">
          <el-input v-model="testTask.bugdes" placeholder="请填写问题描述" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item v-if="testTask.addbug" label="预期效果">
          <el-input v-model="testTask.bughope" placeholder="请填写预期效果" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item v-if="!testTask.addbug" label="原因">
          <el-input v-model="testTask.rejectReason" placeholder="请填写不通过原因" type="textarea" ></el-input>
        </el-form-item>
        <el-form-item label="分配人员">
          <el-select v-model="testTask.assignPerson" filterable clearable  placeholder="请选择" style="width: 100%">
            <el-option-group :key="index" v-for="(group, index) in testTask.assignArr" :label="group.dept_name">
              <el-option :key="index"
                  v-for="(item, index) in group.users"
                  :label="item.user_NAME+'——'+(item.role_NAME?item.role_NAME:'')"
                  :value="item.user_ID+','+item.user_NAME">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="上传BUG附件">
          <div class="upload-wrapper" style="float: none;">
            <el-button type="primary" size="mini">上传附件</el-button>
            <input type="file" @change="uploadBUG($event)" class="upload-input" style="width: 104px;top: 8px;">
          </div>
          <p :key="index" v-for ="(item,index) in testTask.uploadBugFiles">{{item.name}}
            <i style="margin-left: 10px;cursor: pointer;color: red;"
               @click="testTask.uploadBugFiles.splice(index,1);testTask.fileIds.splice(index,1)" class="el-icon-close"></i>
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="testTask.rejectvisible = false;" size="mini">取 消</el-button>
        <el-button type="primary" @click="doTestAssignBug" size="mini">确定</el-button>
      </div>
    </el-dialog>
    <!--测试的bug清单-->
    <el-dialog :close-on-click-modal="false" title="BUG清单" :visible="testTask.allbugvisible" width="80%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-select v-model="testTask.bugid" placeholder="可选择任务ID"
             @change="chooseBUgID"  filterable clearable >
        <el-option :key="index" v-for="(item, index) in testTask.bugidArr" :label="item" :value="item"></el-option>
      </el-select>
      <div class="table-list">
        <el-table :data="testTask.allbuglist" border style="width: 100%">
          <el-table-column prop="work_BUG_ID" label="编号" width="190"></el-table-column>
          <el-table-column prop="start_DATE" label="提交日期" width="110"></el-table-column>
          <el-table-column prop="start_TIME" label="提交时间"></el-table-column>
          <el-table-column prop="assignor_NAME" label="提交人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="desired_RESULT" label="预期效果" show-overflow-tooltip></el-table-column>
          <el-table-column prop="problem_DESCRIPTION" label="问题描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="first_PERSON_NAME" label="指派人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assignor_PERSON_NAME" width="120" label="当前执行人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="user_NAME" label="完成人" show-overflow-tooltip></el-table-column>
          <el-table-column label="附件">
            <template slot-scope="scope">
              <span style="color: #409EFF;"  @click="showDownLoadData(testTask.allbuglist,'BUG附件',scope.row)">查看</span>
              <!--<el-button size="mini" type="primary">查看</el-button>-->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div style="text-align: center">
                <el-button size="mini" type="primary" style="display: inline-block;float: none"
                       v-if="scope.row.bug_STATE ==1"
                       @click="testBUGAction(scope.$index, scope.row,'关闭')">关闭
                </el-button>
                <el-button size="mini" type="danger" style="display: inline-block;float: none"
                       v-if="scope.row.bug_STATE ==1"
                       @click="testBUGAction(scope.$index, scope.row,'激活')">激活
                </el-button>
                <span v-if="scope.row.bug_STATE == 0" style="color: red">处理中</span>
                <span v-if="scope.row.bug_STATE == 2" style="color: green">已关闭</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
    <upload :data="uploadAction"></upload>
    <!--上传测试报告弹窗-->
    <upload-report :report="testReport"></upload-report>
    <!--验收-->
    <el-dialog :close-on-click-modal="false" title="验收" :visible="accept.visible" width="40%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <p class="text-center" style="font-size: 16px">请选择验收结果</p>
      <div slot="footer" class="dialog-footer">
        <div v-if="accept.isOnlineVisiable" style="margin-bottom:30px;font-size:18px;">
          是否需要上线
          <el-radio v-model="accept.isOnline" label="1">上线</el-radio>
          <el-radio v-model="accept.isOnline" label="0">不上线</el-radio>
        </div>
        <el-button @click="accept_not" type="danger" size="mini" v-if="accept.ifshow_n && tabs.activeTableInfo.state_ID !== 330">不通过</el-button>
        <el-button @click="accept_allow" type="primary" size="mini" v-if="accept.ifshow_t">通过</el-button>
      </div>
    </el-dialog>
    <!--测试通过和不通过-->
    <el-dialog :close-on-click-modal="false" title="验收" :visible="testComplete.visible" width="40%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <p class="text-center" style="font-size: 16px">请选择测试结果</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="test_notallow" type="danger" size="mini">不通过</el-button>
        <el-button @click="test_allow" type="primary" size="mini">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import vueQuillEditor_reform from '../common/vueQuillEditor_reform.vue';//需求背景
  import vueQuillEditor_changepoint from '../common/vueQuillEditor_changepoint.vue';//产品改造点
  import vueQuillEditor_needsname from '../common/vueQuillEditor_needsname.vue';//需求描述
  //-----------------加载静态组件
  import moment from "moment";
  import cloneDeep from 'lodash/cloneDeep';
  import oldTaskCode from "../common/old-task-code.vue";//开发的原任务
  import oldTaskTest from "../common/old-task-test.vue";//测试的原任务
  import splitTask from "../common/splitTask.vue";//拆分项目里的所有拆分任务
  import splitPing from "../common/split-ping.vue";//拆分你项目的评审结果
  import tracking from "../common/tracking.vue";//全程跟踪视图模式
  import download from "../common/download.vue";//全程跟踪视图模式
  import allbug from "../common/allbug.vue";//详情页的所有BUG
  import upload from "../common/upload.vue";//上传附件组件
  import uploadReport from "../common/upload-report.vue";//上传附件组件
  import realtime from "../common/realtime.vue";//实时统计组件
  let store = {};
  import SelectUser from '../../common/SelectUser.vue';
  export default {
    props: [ 'userInfo' ],
    data(){
      return {
        homeDisabled:false,
        prevDisabled:false,
        nextDisabled:false,
        endDisabled:false,
        //新增需求
        currentHandlerTableRow: undefined, // 表格按钮点击时储存表格数据
        filterDateDeploy: {
          disabledDate(time){
            // console.log(typeof(store.addneeds.addform.shenqingdate));
            return time.getTime() < new Date(store.addneeds.addform.shenqingdate).getTime()
          }
        },
        filterDateStart: {
          disabledDate(time){
            if(!store.addneeds.addform.designdate)return false;
            return time.getTime() > store.addneeds.addform.designdate.getTime()
          }
        },
        filterDateEnd: {
          disabledDate(time){
            if(!store.review.startDate)return false;
            return time.getTime() < store.review.startDate.getTime()
          }
        },
        filterDateBegin: {
          disabledDate(time){
            if(!store.review.endDate)return false;
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        filterDate: {
          disabledDate(time){
            return time.getTime() > Date.now()
          }
        },
        filterDateOut: {
          disabledDate(time){
            return time.getTime() < moment(moment().format("YYYY-MM-DD")).toDate().getTime();
          }
        },
        //分配任务
        assignvisible: false,
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 15,
        maxPageNumber: null,
        taskid: '',
        myurl: '',
        UserName:'',
        panelTip: {},
        current_user_id: '',
        userData: [],
        addneeds: {
          filevisible:false,//需求文档的弹窗
          notAllowChooseType: false,//是否能修改需求类型
          addif:false,//新增按钮的判断
          addvisible: false ,
          addType: "",//判断性质呢过类型，add 为重新新增，change 为新建变更 changeInset 为需求内变更,edit表示被驳回后编辑
          uploadFiles:[],//上传的文件
          fileIds:[],//上传后返回的ID
          hasUploadFile:[],//上传后的回显
          addform: {
            "oldcode": "",//原需求编号
            "newcode":"",//新需求编号
            "code": "",//需求编号
            "name": "",//需求名称
            "sxname": "",//提出人
            "fromdeptId": "",//选择的需求来源部门ID
            "fromdeptArr": "",//部门数组
            "fromdeptroleId": "",//选择的需求来源人
            "fromdeptroleArr": "",//择的需求来源人数组
            "zhongyaochegndu": "",//重要程度
            "zhongyaochegnduArr": "",//重要程度数组
            "level": "",//优先级
            "levelArr": "",//优先级数组
            "shenqingdate": "",//申请日期
            "designdate": "",//期望上线投产日期
            "jiaji": "",//是否加急
            "toProductCommittee":'',//产品委员会
            "jiajireason": "",//加急的原因
            "oldneedsname": "",//原需求描述
            "needsname": "",//需求描述
            "newneedsname":"",//新需求描述
            "code_start":"",//开发开始时间
            "code_end":"",//开发结束时间
            "test_start":"",//测试开始时间
            "test_end":"",//测试结束时间
            // ------------------------------新增的
            "needstypeArr":[],//需求类型
            "needstype":[],//需求类型
            "resulttypeArr":[],//成果类型
            "resulttype":[],//成果类型
            "affectArr":[],//影响面
            "affect":[],//影响面
            "attributionArr":[],//归属划分
            "attribution":[],//归属划分
            "productline":"",//涉及产品线
            "reform":"",//需求背景
            "changepoint":"",//产品改造点
            "oldchangepoint": "",//原产品改造点
            "newchangepoint": "",//新产品改造点
            "state_id":""//当前stateId
          }
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
        //拆分任务
        split: {
          hasSplitvisible: false,
          //----------拆分项目相关
          hasSplitTaskDataByGroup: "",//展示拆分任务的分组
          hasSplitTaskDataByGroupOrigin:[],//分组的关联项目源数据
          hasSplitTaskData: [],//展示当前的分组拆分任务
          codetask: [],//开发的任务
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
        //表格数据
        table: {
          tableData: [],//表格展示的数据
          tableOriginData: [],//表格的源数据
          tableHeight: "",//表格高度
          hasGo:false,
        },
        dateValue: "",
        keyword: "",
        states: [],
        selectValue: "",
        dateComp: {},
        //控制台
        tabs: {
          addProject: false,//新增权限判断
          codetask: false,//开发的栏目判断（开始结束任务）
          testtask: false,//测试的栏目判断（开始结束任务）
          allSplittask: false,//测试的栏目判断（技术经理能看到所有的项目）
          activeName: "info",//控制台的选中项
          consoleWrapperVisible: false,//控制台的显示
          consoleActionVisible: false,//控制台的操作显示/隐藏
          originActionData:[],//原所有操作
          consoleActionData: [],//展示的操作
          codeActionData: [],//开发人员的操作权限
          testActionData: [],//测试人员的操作权限
          activeTableInfo: {},//当前选中的信息表格
          tabsData: {
            //控制台的信息页展示内容
            state_NAME:"",//当前状态
            send_NAME:"",//发送人

            work_NEET_ID:"",//需求编号
            neel_NAME:"",//需求名称
            type:"",//需求类型
            result:"",//成果类型
            influece:"",//需求影响面
            rriority_NAME:"",//优先级评定
            ascription:"",//需求划分归属
            prduct_LINE:"",//涉及产品线
            start_DATE:"",//申请日期
            end_DATE:"",//期望上线日期
            dept_NAME:"",//需求来源部门
            user_NAME:"",//需求来源人员
            apply_NAME:"",//产品负责人
            fasong_NAME:"",
            importance_NAME:"",//重要程度
            prodReview:'',//委员会评审
            urgentOrNot:"",//是否加急
            urgent:"",//加急原因
            background:"",//需求背景
            product_FUNCTION:"",//产品改造点
            neel_DESCRIPTION:"",//需求描述
            fail:"",//验收不通过

            //技术管理部评审结果的展示
            pingResult:"",//需求评审结果
            pingDate:"",//评审时间
            pingPeople:"",//参会人
            //产品委员会评审结果的展示
            pingResultProd:"",//需求评审结果
            pingDateProd:"",//评审时间
            pingPeopleProd:"",//参会人
          },
          state_NAME: "",//状态
          user_NAME: "",//负责人
          genzong: [],//全程跟踪的数据
          genzongOrigin:[],//全程跟踪的源数据
          genzongArr:[],//全程跟踪的部门数组
          genzongchoosen:'',//选择的全程跟踪部门
          allBug:[],//bug清单
        },
        //需求审批
        ifPing:{
          visible:false,
          rriority:"",//优先级的值
          rriorityArr:[],//优先级数组
          checksArr:[],//评审结果数组
          checks:"",//评审结果
          date:"",//评审日期
          person:"",//参会人
        },
        //产品委员会需求审批
        ifPingProd:{
          visible:false,
          rriority:"",//优先级的值
          rriorityArr:[],//优先级数组
          checksArr:[],//评审结果数组
          checks:"",//评审结果
          date:"",//评审日期
          person:"",//参会人
        },
        //拆分任务完成的操作
        taskFinished: {
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
        //详情页所有bug清单
        allbug:{
          allBUGvisible: false,//BUG清单的展示
          allBugs: [],//所有的bug信息
        },
        //全程跟踪视图模式
        tracking:{
          trackingvisiible:false,
          data:[],//数据
          hoverIndex:"",//移动上去的索引
          hoverData:[],//鼠标悬浮的信息
        },
        //挂起对应操作
        hang: {
          hangvisible: false,//挂起操作栏
          dialogvisible:false,//挂起的弹窗
          hangtableData: [],//表格数据
          hangActiveData:[],//选中的挂起信息
          usetime:"",//实际用时
          reason:"",//挂起原因
          task_id:"",//任务ID
          systemName:"",//系统名
        },
        //转接操作
        transfer:{
          dialogvisible:false,
          personArr:[],//人员数组
          person:"",//选择的人员
          reason:"",//理由
          usetime:"",//实际用时
          systemName:"",//系统名
          task_id:"",//任务ID
        },
        //技术经理分析
        review:{
          reviewvisible:false,//
          fxDate: '', //分析时间
          risk:"",//风险点
          resultArr:[],//分析结果数组
          result:"",//分析结果
          startDate:"",//开始时间
          endDate:"",//结束时间
        },
        //开发的上传脚本
        codeupload:{
          uploadFile:[],//上传的文件信息
        },
        //上传测试报告
        testReport:{
          typeArr:[
            {"name":"测试环境附件","id":"TESTSICE"},
            // {"name":"准生产环境附件","id":"TESTACC"},
            // {"name":"生产环境附件","id":"TESTPROD"}
          ],//报告类型
          type:"",//报告类型的值
          visible:false,
          uploadFile:[],//测试报告文件存放地方
          fileIds:[],//上传文件存储的ID
          neel_id:""
        },
        //需求内变更确认
        changeInset:{
          index:"",//当前选择的索引
          splitaddvisible:false,
          visible :false,
          tableData:[],//表格数据
          allsystem:[],//可选择的现有的子系统
          level:[],//难易度
          system_NAME:"",//系统名
          choosesystem:"",//选择的系统
          finishdate:"",//完成日期
          model:"",//负责模块
          person:"",//人员
          levelchoosen:"",//选择的难易度
          taskcode:"",//任务编码
          usetime:"",//现预计用时
//          oldusetime:"",//原实际用时
          truetime:"",//实际用时
          subData:[],//提交的变更的信息
        },
        //下载文件的数据
        download:{
          visible:false,
          data:[],//表格数据
          title:"",//标题
        },
        uploadAction:{
          uploadvisible:false,
          uploadFiles:[],
          fileIds:[],
          type:"",
          neel_id:"",
          SYSTEM_ID:''
        },
        sstj:{
          info:'',//信息
          allTime:'',//总工时
          bugCount:'',//bug数
          activeName:'first',
          deptName:"",
          len:"",
          requiredTime:"",
          leaveTime:"",
        },
        //验收通过和不通过
        accept:{
          isOnlineVisiable:false,
          isOnline:'',
          visible:false,
          ifshow_t:true,//判断显
          ifshow_n:true
        },
        //测试通过和不通过
        testComplete:{
          visible:false
        },
        // 数据总数
        total:''
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
      date_y_m_d(time){
        let d = new Date(time);
        let year = d.getFullYear();
        let month = (d.getMonth() + 1)<10?'0' + (d.getMonth()+1) : '' + (d.getMonth()+ 1);
        let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
        return year + '-' + month + '-' + day
      }
    },
    components:{
      "old-task-code":oldTaskCode,//开发的原任务
      "old-task-test":oldTaskTest,//测试的原任务
      "split-task":splitTask,//拆分项目里的所有拆分任务
      "split-ping":splitPing,//拆分你项目的评审结果
      "tracking":tracking,//全程跟踪视图模式
      "download":download,//下载文件
      "all-bug":allbug,//所有bug
      "upload":upload,//上传文件
      "upload-report":uploadReport,//上传测试报告
      "realtime":realtime,//实时统计
      'v-vueQuillEditor-reform': vueQuillEditor_reform,
      'v-vueQuillEditor-changepoint': vueQuillEditor_changepoint,
      'v-vueQuillEditor-needsname': vueQuillEditor_needsname,
      'SelectUser': SelectUser
    },
    mounted(){
      this.loadData();
      store = this;
    },
    computed:{
      computedValue:function(){
        let type=true;
        if(!this.dateValue && this.keyword == "" && !this.selectValue){
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
      Text(val){
        console.log(val);
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
      setValue_reform(data){
        this.addneeds.addform.reform = data
        console.log(data)
      },
      setValue_changepoint(data){
        this.addneeds.addform.changepoint = data
      },
      setValue_needsname(data){
        this.addneeds.addform.needsname = data
      },
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<通用计算和点击表格部分>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      calculate(){
        let height = document.querySelector(".mainr").offsetHeight;
//        let card_header_height = document.querySelector(".el-card__header").offsetHeight;
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
          this.table.tableHeight = height - 36 - actionHeight - 20 - 20-1;
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
      //-----------------------------------设置控制台的展示
      setConsoleVisible(){
        this.tabs.consoleWrapperVisible = false;
        this.calculateTableHeight(false);
      },
      //-----------------------------------控制台选项卡点击事件
      tabClick(val){
        this.calculateTabsHeight();
      },
      //-----------------------------------转换表格时间格式
      tableFormatter_start(row){
        let data = this.$format(row.start_DATE)
        return `${data.year}-${data.mouth}-${data.day}`
      },
      tableFormatter_end(row){
        let data = this.$format(row.end_DATE)
        return `${data.year}-${data.mouth}-${data.day}`
      },
      //-----------------------------------加载请求
      loadData(type){
        //初始化当前活动的控制台
        this.tabs.activeName = "info";
        //初始化控制台的可视情况
        this.tabs.consoleWrapperVisible = false;
        //清楚新增新增的表单
        this.clearAddData();
        //加载权限
        this.calculate();
        this.$maskin();
        let params = new URLSearchParams();
        let key=this.$route.params.neelId?this.$route.params.neelId:'';
        params.append('page',this.currentPageNumber)
        params.append('pageSize',this.defaultPageSize)
        params.append('key',key)
        if(this.currentPageNumber <= 0 || (this.maxPageNumber && this.maxPageNumber < this.currentPageNumber)){
          if(this.currentPageNumber <= 0)this.currentPageNumber == 1;
          this.$maskoff();
          return;
        }
        this.$axios.post("/work/queryAll", params).then((res) => {
          //判断是否有新增权限
          let data= res.data;
          this.total=data.result.total;
          if(data.code == 200){
            this.resetDisabled(false,false,false,false)
            if(data.result.bases.length === 0 && type){
              if(type === 'next'){
                this.currentPageNumber--;
                this.maxPageNumber = this.currentPageNumber;
              }
              this.$maskoff();
              return;
            }
            this.current_user_id = data.result.current_user_id;
            //判断是否有新增按钮功能
            if(data.result.DEPT_SAVE){
              this.addneeds.addif = true;
            }
            this.setTableData(data.result);
            //加载状态筛选
            this.states = data.result.states;
          }
        })
      },
      //-----------------------------------加载表格数据
      setTableData(data){
        data.bases.map(item => item.isFast = item.urgent || "否");
        console.log(data.bases);
        this.$set(this.table, "tableData", data.bases);
        this.$set(this.table, "tableOriginData", data.bases);
        //判断是否有search跳转到对应的操作台
        if(this.$route.params.neelId && !this.table.hasGo){
          console.log(this.$route.params.neelId)
          let id = this.$route.params.neelId;
          for(let i=0;i<data.bases.length;i++){
            console.log('进入循环')
            if(data.bases[i].work_NEET_ID == id){
              console.log('进入方法')
              setTimeout(()=>{
                this.tabs.index = i;
              this.$refs.ywxq_table.setCurrentRow(data.bases[i]);
              this.handleCurrentChange(data.bases[i]);
                this.table.hasGo = true
            },0)
              break;
            }
          }
          return;
        }
        console.log('return出去')
        this.$maskoff();
      },
      //-----------------------------------查询功能
      queryTableData(e,type){
        console.log('回车搜索')
        // this.$maskin();
        // if(!this.dateValue && this.keyword == "" && !this.selectValue){
        //   this.$set(this.table,"tableData",this.table.tableOriginData);
        //   this.$maskoff();
        //   return
        // }
        // let params = new URLSearchParams();
        // if(type == "date" && this.dateValue){
        //   params.append("startDate",this.dateValue[0]);
        //   params.append("endDate",this.dateValue[1]);
        // }else if(type == "keyword"){
        //   params.append("key",this.keyword)
        // }else if(type == "select"){
        //   params.append("STATE_ID",this.selectValue)
        // }
        // params.append('page','1')
        // params.append('pageSize',this.total)
        // this.$axios.post("/work/queryAll",params).then((res)=>{
        //   let data = res.data;
        //   if(data.code == 200){
        //     this.current_user_id = data.result.current_user_id;
        //     data.result.bases.map(item => {
        //       item.isFast = item.urgent || "否";
        //     });
        //     this.$set(this.table,"tableData", data.result.bases);
        //     this.$maskoff();
        //   }
        // })

      },
      // 搜索功能
      searchHandle(){
          if(!this.dateValue && !this.selectValue && !this.keyword) return this.$warn('请至少选择一项检索条件')
          this.$maskin();
          let params = new URLSearchParams();
          if(this.dateValue){
            params.append("startDate",this.dateValue[0]);
            params.append("endDate",this.dateValue[1]);
          }
          params.append("key",this.keyword.trim())
          params.append("STATE_ID",this.selectValue)
          params.append('page','1')
          params.append('pageSize',this.total)
          this.$axios.post("/work/queryAll",params).then((res)=>{
            let data = res.data;
            if(data.code == 200){
              this.resetDisabled(true,true,true,true);
              this.current_user_id = data.result.current_user_id;
              data.result.bases.map(item => {
                item.isFast = item.urgent || "否";
              });
              this.$set(this.table,"tableData", data.result.bases);
              this.$maskoff();
            }
          })
      },
      //-----------------------------------根据日期搜索
      searchByDate(){
        if(!this.dateComp.value){
          this.$set(this.table,"tableData",this.table.tableOriginData);
          return;
        }
        let left = (new Date(this.dateComp.value[0])).getTime();
        let right = (new Date(this.dateComp.value[1])).getTime();
        let arr = [];
        for(let i of this.table.tableOriginData){
          let start = (new Date(i.start_DATE)).getTime();
          let end = (new Date(i.end_DATE)).getTime();
          if(start>=left && end<=right){
            arr.push(i)
          }
        }
        this.$set(this.table,"tableData",arr);
      },
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<通用计算和点击表格部分>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<新建需求>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //-----------------------------------新建弹窗
      newneeds(){
        // console.log(this.userInfo.user_NAME)
        this.$maskin();
        this.addneeds.addType = "add";//当前是重新建立变更
        let params = new URLSearchParams();
        this.$axios.post("/work/baseSaveFront", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.clearAddData();
            this.addneeds.addform.code = data.result.WORK_NEET_ID;//需求编号
            this.addneeds.addform.sxname = data.result.USERNAME;//产品提出人
            this.$set(this.addneeds.addform, "fromdeptArr", data.result.depts);//来源部门数组
            this.$set(this.addneeds.addform, "zhongyaochegnduArr", data.result.importance);//重要程度
            this.$set(this.addneeds.addform, "levelArr", data.result.priority);//优先级
            this.$set(this.addneeds.addform, "needstypeArr", data.result.baseTypeName);//需求类型
            this.$set(this.addneeds.addform, "affectArr", data.result.influece);//影响面
            this.$set(this.addneeds.addform, "resulttypeArr", data.result.result);//成果类型
            this.$set(this.addneeds.addform, "attributionArr", data.result.ascription);//需求归属划分
            this.userData = cloneDeep(data.result.allUser)
            this.addneeds.addform.shenqingdate = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
            this.addneeds.addform.title = "新增";
            this.addneeds.addvisible = true;
            this.$maskoff();
          }
        })
      },
      //-----------------------------------上传需求文档
      uploadneeds(e){
        this.$maskin();
        let file = e.target.files[0];
        if(!file){
          return;
        }
        let params = new FormData();
        params.append("token",this.$getToken());
        params.append("file",file);
        this.$axios.post("/work/uploadNell",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.$success("上传成功！");
            this.addneeds.uploadFiles.push(file);
            this.addneeds.fileIds.push(data.result.id);
            document.querySelector(".upload-input").value = "";
            this.$maskoff();
          }
        })
      },
      //-----------------------------------新需求来源二级联动
      fromdeptchange(val){
//        this.addneeds.addform.fromdeptroleArr = [];
        this.addneeds.addform.fromdeptroleId = "";
        let deptroleArr = [];
        for (let i of this.addneeds.addform.fromdeptArr) {
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
        this.$set(this.addneeds.addform, "fromdeptroleArr", deptroleArr);
      },
      //-----------------------------------提交新增
      subaddForm(){
        // console.log(this.userInfo.user_ID)
        let url = "";
        if(!this.addneeds.addform.name){
          this.$warn("请填写需求名称");
          return;
        }
        if(!this.addneeds.addform.needstype){
          this.$warn("请选择需求类型");
          return;
        }
        if(!this.addneeds.addform.resulttype){
          this.$warn("请选择成果类型");
          return;
        }
        if(!this.addneeds.addform.affect){
          this.$warn("请选择需求影响面");
          return;
        }
        if(!this.addneeds.addform.level){
          this.$warn("请选择优先级");
          return;
        }
        if(!this.addneeds.addform.attribution){
          this.$warn("请选择需求划分归属");
          return;
        }
        if(!this.addneeds.addform.zhongyaochegndu){
          this.$warn("请填写重要程度");
          return;
        }
        if(!this.addneeds.addform.shenqingdate){
          this.$warn("请填写申请日期");
          return;
        }
        if(!this.addneeds.addform.designdate){
          this.$warn("请填写期望上线日期");
          return;
        }
        let start = moment(moment(this.addneeds.addform.shenqingdate).format().slice(0, 10), "YYYY-MM-DD").toDate();
        let end =   moment(moment(this.addneeds.addform.designdate).format().slice(0, 10), "YYYY-MM-DD").toDate();
        if(start > end){
          this.$warn("申请日期必须小于期望上线日期");
          return;
        }
        if(!this.addneeds.addform.fromdeptId){
          this.$warn("请选择提出部门");
          return;
        }
        if(!this.addneeds.addform.fromdeptroleId){
          this.$warn("请选择提出人");
          return;
        }
        if(!this.addneeds.addform.sxname){
          this.$warn("请选择负责人");
          return;
        }
        if(this.addneeds.addform.jiaji == ""){
          this.$warn("请选择是否加急");
          return;
        }
        if(this.addneeds.addform.toProductCommittee == ""){
          this.$warn("请选择是否经过委员会评审");
          return;
        }
        if(this.addneeds.addform.jiaji == "1" && this.addneeds.addform.jiajireason == ""){
          this.$warn("请填写加急原因");
          return;
        }
        if(!this.addneeds.addform.productline){
          this.$warn("请填写涉及产品线");
          return;
        }
        if(!this.addneeds.addform.reform){
          this.$warn("请填写需求背景");
          return;
        }
        if(!this.addneeds.addform.changepoint){
          this.$warn("请填写产品改造点");
          return;
        }
        if(!this.addneeds.addform.needsname){
          this.$warn("请填写需求描述");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("toProductCommittee", this.addneeds.addform.toProductCommittee);  //需求编码
        params.append("WORK_NEET_ID", this.addneeds.addform.code);  //需求编码
        params.append("NEEL_NAME", this.addneeds.addform.name); //需求名称
        params.append("START_DATE", this.addneeds.addform.shenqingdate);//申请日期
        params.append("END_DATE", this.addneeds.addform.designdate);//计划投产日期
        params.append("PRODUCT_FUNCTION", this.addneeds.addform.changepoint);//产品改造点
        params.append("USER_ID", this.userInfo.user_ID);//需求来源
        params.append("APPLY_ID", this.addneeds.addform.fromdeptroleId);//需求来源
        let userName;
        console.log(this.addneeds.addform.fromdeptroleArr)
        for(let item of this.addneeds.addform.fromdeptroleArr){
          if(item.user_ID == this.addneeds.addform.fromdeptroleId){
            userName = item.user_NAME;
          }
        }
        // console.log('userName',userName)
        params.append("SEND_NAME", userName);//需求来源
        // console.log(userName);
        params.append("RRIORITY", this.addneeds.addform.level);//（t_communal;）优先级ID 101：紧急 102：中等 103：一般
        params.append("IMPORTANCE", this.addneeds.addform.zhongyaochegndu);//重要程度ID 201：普通  202：重要
        params.append("NEEL_DESCRIPTION", this.addneeds.addform.needsname);//需求描述
        // params.append("PROD_MANAGER", this.addneeds.addform.sxname);//申请人名
        params.append("PROD_MANAGER", this.userInfo.user_ID);//申请人名id
        //------------------新增
        params.append("INFLUECE", this.addneeds.addform.affect);//需求影响面
        params.append("RESULT", this.addneeds.addform.resulttype);//成果类型
        params.append("TYPE", this.addneeds.addform.needstype);//需求类型
        params.append("ASCRIPTION", this.addneeds.addform.attribution);//需求划分归属
        params.append("PRDUCT_LINE", this.addneeds.addform.productline);//涉及产品线
        params.append("BACKGROUND", this.addneeds.addform.reform);//需求背景
        if(this.addneeds.addType == "changeInset"){
          params.append("attachmentIds", this.addneeds.fileIds);//上传的文件
        }else{
          params.append("attachmentId", this.addneeds.fileIds);//上传的文件
        }
        // params.append("attachmentId", this.addneeds.fileIds);//上传的文件
        //------------------新增
        //加急的判断
        if (this.addneeds.addform.jiaji == 1) {
          params.append("URGENT", this.addneeds.addform.jiajireason);//加急描述
        }
        if(this.addneeds.addType == "change"){
          //新建变更
          params.append("WORK_NEET_FID",this.addneeds.addform.oldcode);
          url = "/work/newUpdate"
        }else if (this.addneeds.addType == "add"){
          //新建
          url = "/work/saveBaseConstruct"
        }else if(this.addneeds.addType == "changeInset"){
          //需求内变更
          url = "/work/innerUpdate";
//          params.append("WORK_NEET_FID",this.addneeds.addform.oldcode);
        }else if(this.addneeds.addType == "edit"){
          //修改编辑
          params.append("STATE_ID",this.addneeds.addform.state_id);
          url = "/work/updateBaseByApply";
        }
        this.$axios.post(url,params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            //清空新增的数据
            this.addneeds.addvisible = false;
            this.$maskoff();
            this.clearAddData();
            this.loadData();
          }
        })
        this.loadData();
      },
      //-----------------------------------清除新增新增的表单
      clearAddData(){
        this.addneeds.notAllowChooseType = false;
        for (let i in this.addneeds.addform) {
          this.addneeds.addform[i] = "";
        }
        this.$set(this.addneeds,"fileIds",[]);//上传后的ID
        this.$set(this.addneeds,"uploadFiles",[]);//上传后的ID
      },
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<新建需求>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<关闭弹窗>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      closeDialog(){
        this.addneeds.addvisible = false;//新建项目的弹窗
        this.assign.assignvisible = false;//分配任务的弹窗
        this.split.splitaddvisible = false;//拆分任务添加人员的弹窗
        this.taskFinished.taskFinishedvisible = false;//开发人员超时填写原因和实际用时的弹窗
        this.split.hasSplitvisible = false;//查看已拆分任务详情
        this.testTask.addvisible = false;//测试新增步骤弹窗
        this.testTask.buglistvisible = false;//测试的bug待分配弹窗
        this.testTask.codeBUGlistvisible = false;//开发人员查看bug的弹窗
        this.testTask.codeBUGlistvisible = false;//开发转接bug弹窗
        this.tracking.trackingvisiible = false;//全程跟踪视图模式的弹窗
        this.hang.dialogvisible = false;//挂起原因
        this.testReport.visible = false;//上传测试报告的弹窗
        this.changeInset.splitaddvisible = false;//编辑查分任务的弹窗
        this.testTask.rejectvisible = false;//测试指派bug的弹窗
        this.testTask.allbugvisible = false;//测试的bug清单弹窗
        this.transfer.dialogvisible =false;//转接的弹窗
        this.accept.visible = false;//验收的弹窗
        this.testComplete.visible = false;//测试通过和不通过
      },
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<关闭弹窗>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<点击表格列表展示控制台>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //-----------------------------------初始化当前选中操作遗留的数据
      resetAllStatus(){
        //初始化当前活动的控制台
        this.tabs.activeName = "info";
        //初始化栏目展示情况
        this.tabs.codetask = false;//开发控制台
        this.tabs.testtask = false;//测试控制台
        this.tabs.allSplittask = false;//所有的拆分项目详情
        //初始化技术管理部评审
        this.clearPingData();
        //测试进入拆分任务的提交步骤
        this.testTask.showTaskStep = false;
        //初始化技术经理的分析
        this.review.reviewvisible = false;
        //清空拆分任务的操作台
        this.clearSplitSub();
        this.testTask.typevalue = "";
        this.testTask.type = "";
        //初始化恢复/挂起功能
        this.hang.hangvisible = false;
        //关闭确认需求的表格
        this.changeInset.visible = false;
        //全程跟踪视图模式
        this.tracking.trackingvisiible = false;
      },
      //-----------------------------------初始化技术经理还技术管理部的操作台的视图
      resetConsoleVisible(){
        this.split.splitvisible = false;//拆分任务
        this.ifPing.visible = false;//技术管理部评审
        this.ifPingProd.visible = false;//产品委员会评审
        this.hang.hangvisible = false;//挂起操作
        this.review.reviewvisible = false;//技术经理分析需求
        this.changeInset.visible = false;//技术经理确认变更
      },
      //-----------------------------------表格点击事件
      handleCurrentChange(val, e){
        //点击时初始化操作
        this.$maskin();
        this.resetAllStatus();
        this.tabs.activeTableInfo = val;
        this.tabs.activeEvent = e;
        if (!this.tabs.consoleWrapperVisible) {
          this.tabs.consoleWrapperVisible = true;
          setTimeout(() => {
            this.calculate()
          }, 0);
        }

        //更改scrollTop，将选中置顶
        let scrollTop = 0;
        let table_body = this.$refs.ywxq_table.$el.querySelector(".el-table__body-wrapper");
        if(!e){
          let row = document.querySelector(".el-table__body-wrapper");
          if(this.tabs.index != undefined)scrollTop = row.getElementsByTagName("tr")[this.tabs.index].offsetTop;
        } else if(!e.target.classList.contains("el-table__row")){
          for(let i of e.path){
            if(i.classList.contains("el-table__row")){
              scrollTop = i.offsetTop;
              break;
            }
          }
        }else{
          scrollTop = e.target.offsetTop
        }
        setTimeout(()=>{
          table_body.scrollTop = scrollTop;
        },0)

        if (val.work_NEET_ID) {
          this.loadTabsData(val)
        }
        if(val.state_ID == 305 &&
            this.current_user_id &&
            val.assignor_PERSON_ID &&
            val.assignor_PERSON_ID.split(',').findIndex(item => item == this.current_user_id) > -1){
          this.consoleActionEvent({type: 'PERSONCHECK'});
        }
        if(val.check_TYPE == "J_split"){
          this.consoleActionEvent({
            name : "拆分任务",
            type : "SPLIT"
          });
        }
      },
      //-----------------------------------表格后面按钮的点击事件
      tableAction(index, row, e, type){
        if(e)e.stopPropagation();
        this.tabs.index = index
        this.tabs.activeTableInfo = row;
        this.$refs.ywxq_table.setCurrentRow(row);
        this.currentHandlerTableRow = cloneDeep(row);
        // 测试验收 加上线判断
        if(type=='acceptance_310'){
          this.accept.isOnlineVisiable=true;
        }
        switch (type) {
          case "review":
            //需求评审
            this.handleCurrentChange(row);
            this.tabs.activeName = "console";
            break;
          case "Cpass":
            //曹俊卿通过
            this.prodCheckPass(row,e,);
            break;
          case "Cback":
            //曹俊卿驳回
            this.prodCheckBack(row,e,'驳回');
            break;
          case "confrim":
            //分配
            this.getAssign();
            break;
          case "edit":
            //编辑
            this.editNeed(row);
            break;
          case "back":
            //撤回
            this.back();
            break;
          case "accept":
            //验收
            this.acceptance();
            break;
          case 305:
            //需求分析
            this.handleCurrentChange(row);
            this.tabs.activeName = "console";
            this.consoleActionEvent({type: 'PERSONCHECK'},row);
            break;
          case 'J_split':
            this.handleCurrentChange(row);
            this.tabs.activeName = "console";
            this.consoleActionEvent({
              name : "拆分任务",
              type : "SPLIT"
            },'',e);
            break;
          case 'deal_K':
            // 开发人员
            this.handleCurrentChange(row);
            this.tabs.activeName = "codetask";
            break;
          case 'deal_J':
            // 技术经理
            this.handleCurrentChange(row);
            this.tabs.activeName = "console";
            break;
          case 'deal_T':
            // 测试人员
            this.handleCurrentChange(row);
            this.tabs.activeName = "testtask";
            break;
          case 'acceptance_310':
            // 测试验收
            this.consoleActionEvent({
              name: "验收",
              type: "CONFRIM"
            });
            break
        }
      },
      //-----------------------------------请求点击的数据信息-----------------------------------
      loadTabsData(val){
        let params = new URLSearchParams();
        params.append("WORK_NEET_ID", val.work_NEET_ID);
        this.$axios.post("/work/queryBaseMessage", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            //以下是初始化其需要根据状态变化而展示数据
            this.tabs.tabsData.oldcode = "";//原需求ID
            this.tabs.tabsData.oldchangepoint = "";//原产品功能
            this.tabs.tabsData.oldneedsname = "";//原需求描述
            this.tabs.tabsData.newcode = "";//新需求ID
            this.tabs.tabsData.newchangepoint = "";//新产品功能
            this.tabs.tabsData.newneedsname = "";//新需求描述
            //开发和测试的开始完成时间
            this.tabs.tabsData.code_start = "";
            this.tabs.tabsData.code_end = "";
            this.tabs.tabsData.test_start = "";
            this.tabs.tabsData.test_end = "";
            //评审结果的初始化
            this.tabs.tabsData.pingDate = "";//评审时间
            this.tabs.tabsData.pingPeople = "";//评审人
            this.tabs.tabsData.pingResult = "";//评审结果
            this.tabs.tabsData.isShowDevOrTest = data.result.CODE_TEST_OPER;// 当为0时控制台的开发和测试tab不显示

            //--------------------------加载展示数据
            let base = data.result.base;
            this.tabs.tabsData.state_NAME = base.state_NAME;
            this.tabs.tabsData.state_ID = base.state_ID;
            this.tabs.tabsData.work_NEET_ID = base.work_NEET_ID;//需求编号
            this.tabs.tabsData.neel_NAME = base.neel_NAME;//需求名称
            this.tabs.tabsData.type = base.type;//需求类型
            this.tabs.tabsData.result = base.result;//成果类型
            this.tabs.tabsData.influece = base.influece;//需求影响面
            this.tabs.tabsData.rriority_NAME = base.rriority_NAME;//优先级评定
            this.tabs.tabsData.review_GRADE = base.review_GRADE_NAME;//评审等级
            this.tabs.tabsData.review_level = base.review_level;//产品委员会评审等级
            this.tabs.tabsData.ascription = base.ascription;//需求划分归属
            this.tabs.tabsData.prduct_LINE = base.prduct_LINE;//涉及产品线
            let start_date = this.$format(base.start_DATE);
            let end_date = this.$format(base.end_DATE);
            this.tabs.tabsData.start_DATE = `${start_date.year}-${start_date.mouth}-${start_date.day}`;//申请日期
            this.tabs.tabsData.end_DATE = `${end_date.year}-${end_date.mouth}-${end_date.day}`;//期望上线日期
            this.tabs.tabsData.dept_NAME = base.dept_NAME;//需求来源部门
            this.tabs.tabsData.user_NAME = base.user_NAME;//需求来源人员
            this.tabs.tabsData.apply_NAME = base.prod_MANAGER_NAME;//产品负责人
            this.tabs.tabsData.fasong_NAME = base.apply_NAME;
            this.tabs.tabsData.importance_NAME = base.importance_NAME;//重要程度
            this.tabs.tabsData.IS_PASS = data.result.IS_PASS;
            //判断加急
            //判断加急
            if(!base.urgent){
              this.tabs.tabsData.urgentOrNot = "否";
              this.tabs.tabsData.urgent = "";
            }else{
              this.tabs.tabsData.urgentOrNot = "是";
              this.tabs.tabsData.urgent = base.urgent;
            }
            if(base.toProductCommittee){
              this.tabs.tabsData.prodReview=base.toProductCommittee;
            }
            //this.tabs.tabsData.background = base.background;//需求背景
            //this.tabs.tabsData.product_FUNCTION = base.product_FUNCTION;//产品改造点
            //this.tabs.tabsData.neel_DESCRIPTION = base.neel_DESCRIPTION;//需求描述
            setTimeout(()=>{
              this.setBrInfo(document.querySelector(".background"),base.background);
              this.setBrInfo(document.querySelector(".product_FUNCTION"),base.product_FUNCTION);
              this.setBrInfo(document.querySelector(".neel_DESCRIPTION"),base.neel_DESCRIPTION);
            },0);

            //--------------------------判断需求评审结果--------------------------
            if(base.check_TIME){
              let ping_date = this.$format(base.check_TIME);
              this.tabs.tabsData.pingDate = `${ping_date.year}-${ping_date.mouth}-${ping_date.day}`;//评审时间
              this.tabs.tabsData.pingPeople = base.check_NAME;//评审人
              this.tabs.tabsData.pingResult = base.check_TYPE;//评审结果
            }

            if(base.review_time){
              this.tabs.tabsData.pingDateProd = base.review_time;//评审时间
              this.tabs.tabsData.pingPeopleProd = base.reviewers;//评审人
              this.tabs.tabsData.pingResultProd = base.review_result;//评审结果
            }

            //--------------------------需求文档的判断--------------------------
            if(data.result.nellFiles && data.result.nellFiles.length){
              this.$set(this.addneeds,"hasUploadFile",data.result.nellFiles);
            }

            //--------------------------判断开发和测试控制台的加载--------------------------
            if(data.result.codeInfos){
              this.tabs.codetask = true;
              //是否有开发任务
              if(data.result.codeInfos.length>0){
                this.$set(this.split, "codetask", data.result.codeInfos);
                //添加合计
                this.setCodeAndTestTaskTotal(data.result.codeInfos,this.split.codetask)
              }else{
                this.$set(this.split, "codetask", [])
              }
            }

            if(data.result.testInfos){
              //是否有测试任务
              this.testTask.testTaskActiveInfo = "";
              if (data.result.testInfos.length > 0) {
                this.tabs.testtask = true;
                this.$set(this.testTask, "testSplitData", data.result.testInfos);
                this.testTask.hasTask = true;
                //添加合计
                this.setCodeAndTestTaskTotal(data.result.testInfos,this.testTask.testSplitData)
              } else {
                this.$set(this.testTask, "testSplitData", []);
                this.testTask.hasTask = false;
              }
            }

            //--------------------------判断用例类型
            //--------------------------未选择过
            data.result.types ?
              this.$set(this.testTask, "typeArr", data.result.types) :
              this.$set(this.testTask, "typeArr", []);
            //--------------------------选择过则展示
            data.result.TYPE_NAME ? this.testTask.typevalue = data.result.TYPE_NAME : data.result.TYPE_NAME = "";

            //加载首页bug清单
            this.$set(this.tabs,"allBug",data.result.bugs);

            //--------------------------设置全程跟踪数据和发送人和筛选数组
            this.tabs.tabsData.state_NAME = base.state_NAME;
            this.tabs.tabsData.send_NAME = base.send_NAME;
            this.tabs.user_NAME = base.apply_NAME;
            this.$set(this.tabs, "genzong", data.result.records);
            this.$set(this.tabs, "genzongOrigin", data.result.records);
            this.$set(this.tabs,"genzongArr",data.result.deptRecord);
            //--------------------------判断当前任务是否被拆分过（只有技术管理部和技术经理才能看到所有的拆分任务）
            if (data.result.systemDepts && data.result.systemDepts.length) {
              this.$set(this.split, "hasSplitTaskDataByGroupOrigin", data.result.systemDepts);
              //在选择关联项目之前只展示当前部门的任务，如果当前人是管理层或者提出者，则默认展示所有（arr为空）
              let arr = [];
              for(let i of data.result.systemDepts){
                if(data.result.DEPT_ID == i.DEPT_ID){
                  arr.push(i)
                }
              }
              if(arr.length){
                this.$set(this.split, "hasSplitTaskDataByGroup", arr);
              }else{
                this.$set(this.split, "hasSplitTaskDataByGroup", data.result.systemDepts);
              }
              this.tabs.allSplittask = true;
            } else {
              this.tabs.allSplittask = false;
              this.$set(this.split, "hasSplitTaskDataByGroup", []);
            }

            //--------------------------判断是否有驳回理由
            this.tabs.tabsData.reject_RESON =
              base.reject_RESON ? base.reject_RESON : "";

            //--------------------------判断是否验收不通过
            this.tabs.tabsData.fail =
              base.fail ? base.fail : "";
            //--------------------------判断是否曾经不通过过，显示通过理由
            this.tabs.tabsData.success =
              base.success ? base.success : "";

            //被新建变更后的数据
            if(base.state_ID == 320){
              this.tabs.tabsData.newcode = base.work_NEW_ID;//新需求ID
              this.tabs.tabsData.newchangepoint = base.product_NEW_FUNCTION;//新产品改造点
              this.tabs.tabsData.newneedsname = base.neel_NEW_DESCRIPTION;//新需求描述
              setTimeout(()=>{
                this.setBrInfo(document.querySelector(".newchangepoint"),base.product_NEW_FUNCTION);//新产品改造点
                this.setBrInfo(document.querySelector(".newneedsname"),base.neel_NEW_DESCRIPTION);//新需求描述
              },0)

            }

            //新建变更后  在原需求上展示新需求信息
            if(base.demand_SIGN == 2 && base.work_NEW_ID){
              this.tabs.tabsData.newcode = base.work_NEW_ID;//新需求ID
              this.tabs.tabsData.newchangepoint = base.product_NEW_FUNCTION;//新产品改造点
              this.tabs.tabsData.newneedsname = base.neel_NEW_DESCRIPTION;//新需求描述
              setTimeout(()=>{
                this.setBrInfo(document.querySelector(".newchangepoint"),base.product_NEW_FUNCTION);
                this.setBrInfo(document.querySelector(".newneedsname"),base.neel_NEW_DESCRIPTION);
              },0)
            }

            //--------------------------新建变更的判断
            //DEMAND_SIGN   1：需求内变更 2：新建变更,
            if(base.demand_SIGN == 2 && base.work_OLD_ID){
              //当期是新建的变更要展示原需求编号ID等
              //当前是变更前的数据当前要展示新需求ID描述的等
              this.tabs.tabsData.oldcode = base.work_NEET_FID;//原需求ID
              this.tabs.tabsData.oldchangepoint = base.product_OLD_FUNCTION;//原产品改造点
              this.tabs.tabsData.oldneedsname = base.neel_OLD_DESCRIPTION;//原需求描述
              // setTimeout(()=>{
              //   this.setBrInfo(document.querySelector(".oldchangepoint"),base.product_OLD_FUNCTION);
              //   this.setBrInfo(document.querySelector(".oldneedsname"),base.neel_OLD_DESCRIPTION);
              // },0)
            }else{
              // 此次改动需要将old_PRODUCT_FUNCTION和old_NEEL_DESCRIPTION有则显示
              this.tabs.tabsData.oldchangepoint = base.old_PRODUCT_FUNCTION || '';//原产品产品改造点
              this.tabs.tabsData.oldneedsname = base.old_NEEL_DESCRIPTION || '';//原需求描述
            }

            /*--------------------------当前是被变更的需求信息
            if(base.demand_SIGN == 1){
              //当前是变更前的数据当前要展示新需求ID描述的等
//              this.tabs.tabsData.newcode = base.work_NEW_ID;//新需求ID
              this.tabs.tabsData.oldchangepoint = base.old_PRODUCT_FUNCTION;//原产品产品改造点
              this.tabs.tabsData.oldneedsname = base.old_NEEL_DESCRIPTION;//原需求描述
              setTimeout(()=>{
                this.setBrInfo(document.querySelector(".oldchangepoint"),base.old_PRODUCT_FUNCTION);
                this.setBrInfo(document.querySelector(".oldneedsname"),base.old_NEEL_DESCRIPTION);
              },0)
            }*/

            //-------------------判断是否有完成时间，有则展示
            //开发的开始完成时间
            if(base.code_START_DATETIME || base.code_END_DATETIME){
              this.tabs.tabsData.code_start = base.code_START_DATETIME;
              this.tabs.tabsData.code_end = base.code_END_DATETIME;
            }
            //测试的开始完成时间
            if(base.test_END_DATETIME || base.test_START_DATETIME){
              this.tabs.tabsData.test_start = base.test_START_DATETIME;
              this.tabs.tabsData.test_end = base.test_END_DATETIME;
            }

            //----------------------加载权限
            this.setStateAction(data.result);

            //加载实时统计数据
            if(data.result.systemDepts_0){
              //默认显示信息
              this.sstj.hidezqvisible = false;
              this.sstj.hidegsvisible = false;
              this.setRealTime(
                data.result.systemDepts_0,
                data.result.currentTime,
                data.result.workTime)
            }else if(data.result.systemDepts_1 && data.result.systemDepts_1.length){
              //默认显示信息
              this.sstj.hidezqvisible = false;
              this.sstj.hidegsvisible = false;
              let arr = [];
              for(let i of  data.result.systemDepts_1){
                if(i.myGroup){
                  arr.push(i)
                }
              }
              this.setRealTime(
                arr,
                data.result.currentTime,
                data.result.workTime)
            }else{
              //当前没有分配给技术经理，全部不显示信息
              this.sstj.hidezqvisible = true;
              this.sstj.hidegsvisible = true;
            }
            this.$maskoff();
          }
        })
      },
      //设置换行数据
      setBrInfo(dom,info){
        if(dom){
          dom.innerHTML = "";
          dom.insertAdjacentHTML("beforeend",info);
        }
      },
      //设置实时统计数据
      setRealTime(systemDepts,currentTime,workTime){

//        this.$set(this, "selectValue", statusArr);
        let datashow = systemDepts;
        let nowTime = currentTime;
        let yaxis = []; //y轴显示
        let startTime = []; //预期开始时间
        let endTime = []; //预期结束时间
        let actualTime = []; //实际完成时间
        let timeInfo=[]; //所有信息
        let deptName=[];//部门
        let allTime=[];//部门实际工时
        let requiredTime=[];//部门总工时
        let leaveTime=[];//部门剩余工时

        let userName=[];//人员
        let userallTime=[];//个人实际工时
        let userequiredTime=[];//个人总工时
        let userleaveTime=[];//个人剩余工时
        for(let i of datashow) {
          if(!i.EXPECT_END && !i.EXPECT_START){
            //该项目没有被评审，跳过添加数据，跳过部门
            continue;
          }
          timeInfo.push(i);
          let start = this.$format(new Date(i.EXPECT_START));
          let end = this.$format(new Date(i.EXPECT_END));
          let arr =  [
            `${start.mouth}/${start.day}`,
            `${end.mouth}/${end.day}`
          ];
//          yaxis.push(i.DEPT_NAME+arr[0]+'-'+arr[1]);
          yaxis.push(i.DEPT_NAME);
          if(i.EXPECT_START){
            startTime.push((new Date(i.EXPECT_START)).getTime());
          }
          if(i.EXPECT_END){
            endTime.push((new Date(i.EXPECT_END)).getTime());
          }
          if(i.realy_date){
            //任务正在进行中
            actualTime.push((new Date(i.realy_date)).getTime());//完成日期
          }else{
            actualTime.push((new Date()).getTime());//完成日期
          }
          //所有人员的实际用时
          if(i.allTime){
            allTime.push(i.allTime);
            deptName.push(i.DEPT_NAME);
            requiredTime.push(i.requiredTime);
            leaveTime.push(i.requiredTime-i.allTime)
          }
          this.$set(this.sstj, "info", timeInfo);
        }
        //REAL_TIME 预计用时
        //ALL_TIME  实际用时
        if(workTime && workTime.length){
          for(let j of workTime){
            console.log(j)
            userName.push(j.USER_NAME)
            userallTime.push(j.ALL_TIME)
            userequiredTime.push(j.REAL_TIME)
            userleaveTime.push(j.REAL_TIME-j.ALL_TIME)
          }
        }
        this.userworkTime(userName,userallTime,userequiredTime,userleaveTime)
        if(!yaxis.length){
          //没有信息则不显示图表
          this.sstj.hidegsvisible = true;
          this.sstj.hidezqvisible = true;
          return;
        }
        this.realTime(yaxis,startTime,endTime,actualTime);
        this.workTime(deptName,leaveTime,requiredTime,allTime);

      },
      //实时统计周期
      realTime(yaxis, startTime, endTime, actualTime) {
          console.log(startTime)
        console.log(endTime)
        console.log(actualTime)
      let proBar = this.$echarts.init(document.getElementById("system")); //实时统计
      proBar.clear();
      let end_time = [];//放置结束如期
      let actual_time = [];//放置实际用时
      let now = new Date();
      for (let i = 0; i < yaxis.length; i++) {
          end_time.push(endTime[i]+86400000)
          if (endTime[i]+86400000 > actualTime[i]) {
            actual_time.push(null)
          } else if (endTime[i] < actualTime[i]) {
            actual_time.push(actualTime[i])
          } else {
            actual_time.push(actualTime[i])
          }
        }
      let option = {
        title: {
        text: '周期统计',
        x: 'center'
        },
        xAxis: {
        type: 'time',
          min: startTime
        },
        yAxis: {
//            type:"category",
        data: yaxis,
        },
        tooltip: {
        trigger: 'axis',
        formatter: (params) => {
            console.log(params)
            let res = params[0].name + "</br>";
            let start = this.$format(new Date(params[0].data));
            let act = this.$format(new Date(params[1].data));
            let end = this.$format(new Date(params[2].data));
            let date0 = start.year + "-" + start.mouth + "-" + start.day;//开始时间
            let date1 = act.year + "-" + act.mouth + "-" + act.day;//实际时间
            let date2 = end.year + "-" + end.mouth + "-" + end.day;//结束时间;
            res += params[0].seriesName + ":" + date0 + "</br>";
            res += params[2].seriesName + ":" + date2 + "</br>";
            if(params[1].data>params[2].data){
              //实际结束时间
              res += params[1].seriesName + ":" + date1 + "</br>";
            }
            return res;
          }
      },
        series: [{
            name: '预计结束时间',
            type: 'bar',
            stack: '开始时间',
            itemStyle: {
              color: '#2E91BD',
            },
            data: end_time,
          }, {
          name: '实际结束时间',
          type: 'bar',
          stack: '开始时间',
          itemStyle: {
            color: '#F4201B',
          },
          data: actual_time
        }
      ]
      };
      proBar.setOption(option);
      },
      //工时
      workTime(deptName,leaveTime,requiredTime,allTime){
        let father = document.getElementById("hours-div");
        if(father){
          let allChild = document.querySelectorAll("#hours-div .hour-child");
          for(let i of allChild){
            father.removeChild(i)
          }
          setTimeout(()=>{
            for(let i=0;i<deptName.length;i++){
              let txtName
              if(leaveTime[i]>=0){
                txtName='剩余工时'
              }
              else{
                txtName='超出工时'
                leaveTime[i]=-leaveTime[i]
              }
              let div = '<div id="workHours'+i+'" class="hour-child" style="height: 150px;width: 300px;float: left;"></div>';
              father.insertAdjacentHTML("beforeend",div);
              let option = {
                axisLabel: {
                  interval:0//横轴信息全部显示
                },
                title: {
                  text: deptName[i],
                  left: 'center',
                  top: 0,
                },
                tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                  {
                    name: deptName[i],
                    type: 'pie',
                    radius : "60%",
                    center: ['60%', '50%'],
                    data:[
                      {value:leaveTime[i], name:txtName},
                      {value:allTime[i], name:'实际工时'}
                    ],
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              };
              let proBar= this.$echarts.init(document.getElementById("workHours"+i)); //实时统计
              proBar.setOption(option);
            }
          },0)

        }
      },
      //人员工时
      userworkTime(userName,userallTime,userequiredTime,userleaveTime){
        let father = document.getElementById("user-div");
        if(father){
          let allChild = document.querySelectorAll("#user-div .user-child");
          for(let i of allChild){
            father.removeChild(i)
          }
          setTimeout(()=>{
            for(let i=0;i<userName.length;i++){
              let txtName
              if(userleaveTime[i]>=0){
                txtName='剩余工时'
              }
              else{
                txtName='超出工时'
                userleaveTime[i]=-userleaveTime[i]
              }
              let div = '<div id="userworkHours'+i+'" class="user-child" style="height: 150px;width: 300px;float: left;"></div>';
              father.insertAdjacentHTML("beforeend",div);
              let option = {
                title: {
                  text: userName[i],
                  left: 'center',
                  top: 0,
                },
                axisLabel: {
                  interval:0//横轴信息全部显示
                },
                tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                  {
                    name: userName[i],
                    type: 'pie',
                    radius : "60%",
                    center: ['60%', '50%'],
                    data:[
                      {value:userleaveTime[i], name:txtName},
                      {value:userallTime[i], name:'实际工时'}
                    ],
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              };
              let proBar= this.$echarts.init(document.getElementById("userworkHours"+i)); //实时统计
              proBar.setOption(option);
            }
          },0)
        }
      },
      //-----------------------------------添加开发任务和测试任务的和合计
      setCodeAndTestTaskTotal(origin,view){
        let old_REQUIRED_TIME = 0;//原预计用时
        let required_TIME = 0;//预计用时
        let old_ACTUAL_TIME = 0;//原实际用时
        let work_TIME = 0;//实际用时
        let actual_TIME = 0;//总工时
        for(let i of origin){
          old_REQUIRED_TIME+= i.old_REQUIRED_TIME?i.old_REQUIRED_TIME:0;
          required_TIME+= i.required_TIME?i.required_TIME:0;
          old_ACTUAL_TIME+= i.old_ACTUAL_TIME?i.old_ACTUAL_TIME:0;
          work_TIME+= i.work_TIME?i.work_TIME:0;
          actual_TIME+= i.actual_TIME?i.actual_TIME:0;
        }
        view.push({
          "user_NAME":"合计",
          "old_REQUIRED_TIME":old_REQUIRED_TIME,
          "required_TIME":required_TIME,
          "old_ACTUAL_TIME":old_ACTUAL_TIME,
          "work_TIME":work_TIME,
          "actual_TIME":actual_TIME,
        })
      },
      //-----------------------------------设置当前状态的下的操作
      setStateAction(base){
        //根据当前状态配置对应权限
        //初始化评审
        this.ifPing.visible = false;
        this.ifPingProd.visible = false;
        //判断是否可评审
        if(base.REVIEW){
          this.setReviewData(base);
        };
        // 产品委员会评审
        if(base.COMMITTEE_CHECK){
          this.setReviewDataProd(base);
        }
        //以下特殊情况不需展示到操作的下拉列表中
        //需求审批
        //测试类型 （测试类型也是string，除去这项）
        //关联项目 （dept_id是当前部门ID）
        let arr= [];
        for(let i in base){
          if(base.hasOwnProperty(i)){
            if(typeof base[i] == "string" &&
              i !="TYPE_NAME" &&
              i !="REVIEW" &&
              i !="DEPT_ID"){
              arr.push({"type":i,"name":base[i]})
            }
          }
        }
        if(base.CONFRIMUPDATE && typeof(base.CONFRIMUPDATE) === 'string'){
          // 当有确认变更按钮时全部按钮不显示
          //this.tabs.consoleActionData = [{type: 'CONFRIMUPDATE', name: base.CONFRIMUPDATE}];
          this.tabs.consoleActionData = [];
        }else{
          this.$set(this.tabs,"consoleActionData",arr)
        }
      },
      //-----------------------------------点击新需求和旧需求进行跳转
      goNeedList(e,code,type){
        let data = this.table.tableOriginData;
        for(let i=0;i<data.length;i++){
          if(data[i].work_NEET_ID == code){
            setTimeout(()=>{
            this.tabs.index= i;
            this.$refs.ywxq_table.setCurrentRow(data[i])
            this.handleCurrentChange(data[i]);
          },0);
            break
          }
        }
      },
      //-----------------------------------全程跟踪根据组选择切换
      genzongChange(){
        let value = this.tabs.genzongchoosen;
        this.$maskin();
        if(value == ""){
          this.$set(this.tabs,"genzong",this.tabs.genzongOrigin);
          this.$maskoff();
          return;
        }
        let arr  = [];
        for(let i of this.tabs.genzongOrigin){
          if(i.dept_ID == value){
            arr.push(i)
          }
        }
        this.$set(this.tabs,"genzong",arr);
        this.$maskoff();
      },
      //-----------------------------------加载所有BUG
      loadAllBugs(){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/queryBugByNeel",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            if(!data.result.length){
              this.$success("当前暂无相关信息");
              this.$maskoff()
              return
            }
            this.$set(this.allbug,"allBugs",data.result);
            this.allbug.allBUGvisible = true;
            this.$maskoff()
          }
        })
      },
      //上传测试报告和用例模板
      startUpload(type,id){
        this.$set(this.uploadAction,"uploadFiles",[]);
        this.$set(this.uploadAction,"fileIds",[]);
        // this.$set(this.uploadAction,"fileIds",[]);
        this.uploadAction.neel_id = this.tabs.activeTableInfo.work_NEET_ID;
        this.uploadAction.type=type;
        this.uploadAction.SYSTEM_ID=id;
        this.uploadAction.uploadvisible = true;
      },
      //下载文件弹窗
      showDownLoadData(val,title,row){
        if(title == "BUG附件"){
          let params = new URLSearchParams();
          params.append("BUG_ID",row.work_BUG_ID);
          this.$axios.post("base/queryBugFile",params).then((res)=>{
            let data = res.data;
            if(data.code == 200){
              this.$set(this.download,"data",data.result);
              this.download.title = title;
              this.download.visible = true;
            }
          });
          return;
        }
        // if(val == ""){
          let type = "";
          switch (title){
            case "开发手册":
              type = "DEV_DOC";
              break;
            case "当前用例":
              type = "TEST";
              break;
            case "准生产环境附件":
              type = "TESTACC";
              break;
            case "生产环境附件":
              type = "TESTPROD";
              break;
            case "测试环境附件":
              type = "TESTSICE";
              break;
            case "需求文档":
              type = "NELL";
              break;
          }
          this.$maskin();
          let params = new URLSearchParams();
          params.append("BASE_ID", this.tabs.activeTableInfo.work_NEET_ID);
          params.append("TYPE",type);
          this.$axios.post("/work/queryFileByType",params).then((res)=>{
            let data =res.data;
            if(data.code = 200){
              this.$set(this.download,"data",data.result);
              this.download.title = title;
              this.download.visible = true;
              this.$maskoff();
            }
          });
          return;
        // }
        this.$set(this.download,"data",val);
        this.download.title = title;
        this.download.visible = true;
      },
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<点击表格列表展示控制台>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<操作台的事件判断>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      consoleActionEvent(val, scope=undefined, e=undefined){
        console.log(val)
        console.log(scope)
        if(e)e.stopPropagation();
        // if(!this.tabs.activeTableInfo.work_NEET_ID) this.tabs.activeTableInfo.work_NEET_ID = scope.work_NEET_ID;
        this.tabs.consoleActionVisible = false;
        if(scope) this.tabs.activeTableInfo=scope;
        switch (val.type) {
          case "COMMITTEE_CHECK":
            //产品委员会需求评审
            this.handleCurrentChange(scope);
            this.tabs.activeName = "console";
            break;
          case "REJECT":
            //撤回任务
            this.back();
            break;
          case "ASSIGN":
            //分配任务
            this.resetConsoleVisible();
            this.getAssign();
            break;
          case "SPLIT":
            //拆分任务
            this.resetConsoleVisible();
            this.splitTask();
            break;
          case "NEWUPDATE":
            //新建变更
            this.newchange("change");
            break;
          case "INNERUPDATE":
            //需求内变更
            this.resetConsoleVisible();
            this.newchange("changeInset");
            break;
          case "DRAW":
            //驳回
            this.rejected();
            break;
          case "CONFRIM":
            //验收
            this.acceptance();
            break;
          case "EDIT":
            //被驳回或者审批之前编辑
            this.editNeed(scope);
            break;
          case "SIGN":
            //转接/挂起/恢复操作（编辑任务）
            this.resetConsoleVisible();
            this.loadHangData();
            break;
          case "PERSONCHECK":
            //技术经理需求分析
            this.resetConsoleVisible();
            this.beginreview();
            break;
          case "CONFRIMUPDATE":
            //技术经理确认变更
            this.resetConsoleVisible();
            this.doChangeInset();
            break;
          case "PROD_CHECK":
            this.acceptance();
            break;
          case 'POSTPONE_REVIEW':
            // 延后评审
            val.url = 'work/postponeReview';
            this.taskClick(val);
            break;
          case 'INVALID':
            // 无效
            val.url = 'work/invalid';
            this.taskClick(val);
            break;
        }
      },
      taskClick(val){
        // 单次点击, 不带用户交互
        this.$confirm(`执行 ${val.name} 操作, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$maskin();
          let params = new URLSearchParams();
          params.append("WORK_NEEL_ID", this.tabs.activeTableInfo.work_NEET_ID);
          this.$axios.post(val.url, params).then((res)=>{
            let data=res.data;
            if(data.code == 200){
              this.$success("操作成功！");
              this.$maskoff();
              this.loadData();
            }
          });
        }).catch(() => {});
      },
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<操作台的事件判断>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<操作台的具体事件>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      //-----------------------------------编辑操作
      editNeed(row){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",row? row.work_NEET_ID: this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/updateBaseFront",params).then((res)=>{
          let data=res.data;
          if(data.code == 200){
            let info = data.result.base;
            //--初始化
            this.clearAddData();
            this.userData = cloneDeep(data.result.allUser)

            //加载数据
            this.addneeds.notAllowChooseType = true;
            this.addneeds.addform.code = info.work_NEET_ID;//需求编号
            this.addneeds.addform.name = info.neel_NAME;//需求名称
            this.addneeds.addform.needstypeArr = data.result.baseTypeName;//需求类型
            this.addneeds.addform.needstype = info.type;//需求类型
            this.addneeds.addform.resulttypeArr = data.result.result;//成果类型
            this.addneeds.addform.resulttype = info.result;//成果类型
            this.addneeds.addform.affectArr =  data.result.influece;//需求影响面
            this.addneeds.addform.affect = info.influece;//需求影响面
            this.addneeds.addform.levelArr = data.result.priority;//优先级评定
            this.addneeds.addform.level = info.rriority;//优先级评定
            this.addneeds.addform.attributionArr = data.result.ascription;//需求划分归属
            this.addneeds.addform.attribution = info.ascription;//需求划分归属
            this.addneeds.addform.productline = info.prduct_LINE;//涉及产品线
            this.addneeds.addform.shenqingdate = new Date(info.start_DATE);//申请日期
            this.addneeds.addform.designdate = new Date(info.end_DATE);//期望上线日期
            this.addneeds.addform.fromdeptArr = data.result.depts;//需求提出部门
            this.addneeds.addform.fromdeptId = parseInt(info.dept_ID);//需求提出部门
            this.fromdeptchange(info.dept_ID);
            // this.addneeds.addform.fromdeptroleId = info.send_NAME;//需求提出人
            this.addneeds.addform.fromdeptroleId = info.apply_ID;//需求提出人
            this.addneeds.addform.sxname = info.apply_NAME;//产品负责人
            this.addneeds.addform.zhongyaochegnduArr = data.result.importance;//重要程度
            this.addneeds.addform.zhongyaochegndu = info.importance;//重要程度
            this.addneeds.addform.toProductCommittee = info.toProductCommittee;//是否加急
            this.addneeds.addform.jiaji = info.urgent?"1":"0";//是否加急
            this.addneeds.addform.jiajireason = info.urgent?info.urgent:"";//加急原因
            this.addneeds.addform.reform = info.background;//需求背景
            this.addneeds.addform.changepoint = info.product_FUNCTION;//产品改造点
            this.addneeds.addform.needsname = info.neel_DESCRIPTION;//需求描述
            this.addneeds.addType = "edit";//当前是编辑状态
            this.addneeds.addform.state_id = info.state_ID;//当前状态
            this.addneeds.addform.title = "编辑需求";
            let fileIds = [];//上传的文件ID
            if(data.result.nellFiles && data.result.nellFiles.length){
              for(let i of data.result.nellFiles){
                fileIds.push(i.id);
              }
              this.$set(this.addneeds,"uploadFiles",data.result.nellFiles);
              this.$set(this.addneeds,"fileIds",fileIds);
            }
            //显示弹窗
            this.addneeds.addvisible = true;
            this.$maskoff();
          }
        })
      },
      //-----------------------------------挂起/恢复/转接/编辑的操作
      loadHangData(){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID", this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/querySplitInfo", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.hang.hangvisible = true;
            this.$set(this.hang, "hangtableData", data.result);
            this.$maskoff();
          }
        })
      },
      //-----------------------------------挂起点击操作
      //sing:0挂起，1恢复
      hangAction(val){
        this.hang.task_id = val.work_INFO_ID;
        this.hang.systemName = val.system_NAME;
        this.hang.dialogvisible = true;
      },
      //-----------------------------------挂起提交
      hangsub(){
        if(!this.hang.usetime){
          this.$warn("请填写实际用时");
          return;
        }
        if(!this.hang.reason){
          this.$warn("请填写挂起原因");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("ACTUAL_TIME",this.hang.usetime);//实际用时
        params.append("SIGN_REAMRK",this.hang.reason);//原因
        params.append("WORK_INFO_ID",this.hang.task_id);//任务ID
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);//需求ID
        params.append("SYSTEM_NAME",this.hang.systemName);//系统名
        this.$axios.post("/work/signInfo",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.hang.usetime = "";
            this.hang.reason = "";
            this.hang.systemName = "";
            this.hang.dialogvisible = false;
            this.$success("操作成功！");
            this.loadHangData();
            this.$maskoff();
          }
        })
      },
      //-----------------------------------恢复操作
      restore(row){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        params.append("WORK_INFO_ID",row.work_INFO_ID);
//        params.append("SYSTEM_NAME",row.system_NAME?row.system_NAME:"");
        this.$axios.post("/work/signReject",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            this.loadHangData();
            this.$maskoff()
          }
        })
      },
      //-----------------------------------转接操作
      transferAction(row){
        this.$maskin();
        let params = new URLSearchParams();
        this.$axios.post("/work/queryPersonByDept",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.transfer.systemName = row.system_NAME;
            this.transfer.task_id = row.work_INFO_ID;
            if(row.system_NAME){
              this.$set(this.transfer,"personArr",data.result.dept.users);
            }
            this.transfer.dialogvisible = true;
            this.$maskoff();
          }
        });
        if(!row.system_NAME){
          this.$axios.post("/user/queryUsersByPosition", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$set(this.transfer,"personArr",data.result);
              // this.$set(this.split, "personlist", data.result);//设置人员集合
            }
          })
        }
      },
      //-----------------------------------提交转接操作
      transferSub(){
        let info = this.transfer;
        // console.log(info);
        let params = new URLSearchParams();
        if(!info.person){
          return this.$warn('请选择转接人员')
        }
        if(!info.usetime){
          return this.$warn('请填写实际工时')
        }
        if(!info.reason){
          return this.$warn('请填写转接原因')
        }
        this.$maskin();
        params.append("WORK_INFO_ID",info.task_id);//拆分任务ID
        params.append("ACTUAL_TIME",info.usetime);//实际用时
        params.append("PERSON_ID",info.person.split("-")[0]);
        params.append("PERSON_NAME",info.person.split("-")[1]);
        params.append("REMARK",info.reason);
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);//需求ID
        params.append("SYSTEM_NAME",info.systemName);
        this.$axios.post("/work/updateTaskPerson",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            //清除数据
            this.transfer.usetime = "";
            this.transfer.reason = "";
            this.transfer.systemName = "";
            this.transfer.person = "";
            this.transfer.dialogvisible = false;
            this.$success("操作成功！");
            //转接过后存在任务消失或新增现象，不能局部刷新，要重新拉取数据
            this.handleCurrentChange(this.tabs.activeTableInfo);
          }
        })
      },
      //-----------------------------------编辑实际用时
      editTaskUseTime(row,index){
        let task_id = row.work_INFO_ID;//任务ID
        this.prompt("编辑实际用时","请填写实际用时",(value)=>{
          this.$maskin();
          let params = new URLSearchParams();
          params.append("TASK_ID",task_id);//任务ID
          params.append("WORK_TIME",value.value);//工作时间
          params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID)
          this.$axios.post("/work/editSplitTask ",params).then((res)=>{
            let data = res.data;
            if(data.code == 200){
              this.loadHangData();
            }
          })
        })
      },
      //-----------------------------------技术管理部审批
      setReviewData(base){
        this.clearPingData();
        this.ifPing.visible = true;
        this.$set(this.ifPing,"rriorityArr",base.rriority);//优先级
        this.$set(this.ifPing,"checksArr",base.checks);//评审结果
      },
      //-----------------------------------产品委员会审批
      setReviewDataProd(base){
        this.clearPingData();
        this.ifPingProd.visible = true;
        this.$set(this.ifPingProd,"rriorityArr",base.rriority);//优先级
        this.$set(this.ifPingProd,"checksArr",base.checks);//评审结果
        console.log(base)
        console.log(this.ifPingProd)
      },
      //-----------------------------------提交技术管理部审批
      subPing(){
        let ping = this.ifPing;
        if(!ping.rriority){
          this.$warn("请选择优先级");
          return;
        }
        if(!ping.checks){
          this.$warn("请选择评审结果");
          return;
        }
        if(!ping.date){
          this.$warn("请选择评审时间");
          return;
        }
        if(!ping.person){
          this.$warn("请填写参会人");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("WORK_NEET_ID",this.tabs.activeTableInfo.work_NEET_ID);
        params.append("CHECK_TYPE",ping.checks.split("-")[1]);
        params.append("CHECK_ID",ping.checks.split("-")[0]);
        params.append("CHECK_TIME",ping.date);
        params.append("CHECK_NAME",ping.person);
        params.append("RRIORITY",ping.rriority);
        this.$axios.post("/work/reviewBase",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            this.clearPingData()
            this.loadData();
          }
        })
      },
      // 产品委员会审批
      subPingProd(){
        let ping = this.ifPingProd;
        if(!ping.rriority){
          this.$warn("请选择优先级");
          return;
        }
        if(!ping.checks){
          this.$warn("请选择评审结果");
          return;
        }
        if(!ping.date){
          this.$warn("请选择评审时间");
          return;
        }
        if(!ping.person){
          this.$warn("请填写参会人");
          return;
        }
        let date=this.$format(ping.date)
        this.$maskin();
        let params = new URLSearchParams();
        params.append("need_id",this.tabs.activeTableInfo.work_NEET_ID);
        params.append("stateId",parseInt(this.tabs.activeTableInfo.state_ID));
        params.append("prodManagerId",this.tabs.activeTableInfo.prod_MANAGER);
        params.append("review_result",ping.checks.split('-')[1]);
        params.append("review_time",`${date.year}-${date.mouth}-${date.day}`);
        params.append("reviewers",ping.person);
        params.append("review_level",ping.rriority);
        params.append("oper",'PASS');
        this.$axios.post("/work/committeeCheck",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            this.clearPingData()
            this.loadData();
          }
        })
      },
      // 曹俊卿审批
      prodCheckPass(val,e){
        e.cancelBubble = true;
        this.$maskin();
        console.log(val);
        // console.log(type)
        let params = new URLSearchParams();
        params.append("WORK_NEET_ID",val.work_NEET_ID);
        // if(type == 'back'){
        //   params.append("CHECK_TYPE",'REJECT');
        // }
        params.append("CHECK_ID",'4');
        // params.append("CHECK_NAME",val.check_NAME);
        this.$axios.post("/work/reviewBase",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            this.loadData();
          }
        })
      },
      //驳回
      prodCheckBack(val, e, text) {
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
          params.append('WORK_NEET_ID', val.work_NEET_ID);
          params.append('REJECT_RESON', value);
          params.append("CHECK_TYPE",'REJECT');
          params.append("CHECK_ID",'4');
          this.$axios.post("/work/reviewBase", params).then((res) => {
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
      //-----------------------------------初始化技术管理部审批数据
      clearPingData(){
        this.ifPing.rriority = "";
        this.ifPing.checks = "";
        this.ifPing.date = "";
        this.ifPing.person = "";
        this.ifPing.visible = false;
      },
      //-----------------------------------技术经理需求分析
      beginreview(){
        this.$maskin();
        let params = new URLSearchParams();
        this.$axios.post("/work/personCheckFront",params).then((res)=>{
          let data =res.data;
          if(data.code ==200){
            let review = this.review;
            for(let i in review){
              if(review.hasOwnProperty(i)){
                review[i] = ""
              }
            }
            this.review.reviewvisible = true;
            this.$set(this.review,"resultArr",data.result);
            this.$maskoff();
          }
        })
      },
      //-----------------------------------提交技术经理需求分析
      reviewSub(){
        if(!this.review.startDate){
          this.$warn("请选择预计开始日期");
          return;
        }
        if(!this.review.endDate){
          this.$warn("请选择预计完成日期");
          return;
        }
      //  let start = (new Date(this.review.startDate)).getTime();
      //  let end = (new Date(this.review.endDate)).getTime();
      //  if(start>=end){
       //   this.$warn("完成日期须大于开始日期");
       // return;
       // }
        if(!this.review.fxDate){
          this.$warn("请选择分析日期");
          return;
        }
        if(!this.review.result){
          this.$warn("请选择分析结果");
          return;
        }
        if(!this.review.risk){
          this.$warn("请填写风险点");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        params.append("EXPECT_START",this.review.startDate);
        params.append("EXPECT_END",this.review.endDate);//
        params.append("ANALYSIS_TIME",this.review.fxDate);//分析时间
        params.append("ANALYSIS_RESULT",this.review.result);//分析结果
        params.append("TASK_RISK",this.review.risk);//风险点
        this.$axios.post("/work/personCheck",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            let review = this.review;
            for(let i in review){
              if(review.hasOwnProperty(i)){
                review[i] = ""
              }
            }
            // this.review.reviewvisible = false;
            this.$set(this.review,'reviewvisible',false)
            this.loadTabsData(this.tabs.activeTableInfo);
            this.loadData()
          }
        })
      },
      //-----------------------------------验收操作
      acceptance(){
        this.accept.visible = true;
        let state = this.tabs.activeTableInfo.state_ID;
        //311  已验收状态 只给不通过
        //322 只给通过
        if(state != 311 && state != 322){
          this.accept.ifshow_t = true;
          this.accept.ifshow_n = true
        } else if(state == 311){
          this.accept.ifshow_t = false;
          this.accept.ifshow_n = true
        }else if(state == 322){
          this.accept.ifshow_t = true;
          this.accept.ifshow_n = false
        }else if(state == 330){
          this.accept.ifshow_t = true;
          this.accept.ifshow_n = false;
        }
      },
      //验收通过事件
      accept_allow(){
        // 20180629 注释此问题
        // if(this.currentHandlerTableRow !== undefined){
        //   if(('IS_PASS' in this.currentHandlerTableRow) && !this.currentHandlerTableRow.IS_PASS){
        //     this.$message.warning('验收不通过后一周内不许通过');
        //     return;
        //   }
        //   this.currentHandlerTableRow = undefined;
        // }else{
        //   if(('IS_PASS' in this.tabs.tabsData) && !this.tabs.tabsData.IS_PASS){
        //     this.$message.warning('验收不通过后一周内不许通过');
        //     return;
        //   }
        // }
        let reason =  this.tabs.tabsData.fail;
        let info = this.tabs.activeTableInfo;
        let params = new URLSearchParams();
        if(reason){
          //曾经验收不通过过
          this.prompt("验收通过","请填写验收通过理由",(value)=> {
            if(!value.value){
              this.$warn("请填写理由");
              return;
            }
            this.$maskin();
            params.append("REJECT_RESON", value.value);
          });
        }else{
          //y验收通过
          this.$maskin();
        }
        params.append("WORK_NEEL_ID", info.work_NEET_ID);
        if([329, 330].indexOf(this.tabs.activeTableInfo.state_ID) > -1){
          params.append("oper","OK");
        }else{
          params.append("OPER","OK");
        }
        if(this.accept.isOnlineVisiable){
          if(!this.accept.isOnline){
            this.$maskoff();
            return this.$warn('请选择是否上线');
          }
          params.append("isOnline",this.accept.isOnline);
        }
        this.acceptSub(params);
      },
      //验收不通过实践
      accept_not(){
        this.prompt("验收不通过","请填写不通过理由",(value)=>{
          if(!value.value){
            this.$warn("请填写不通过理由");
            return;
          }
          let info = this.tabs.activeTableInfo;
          this.$maskin();
          let params = new URLSearchParams();
          params.append("WORK_NEEL_ID", info.work_NEET_ID);
          if(this.tabs.activeTableInfo.state_ID === 329){
            params.append("oper","FAIL");
          }else{
            params.append("OPER","FAIL");
          }
          params.append("REJECT_RESON",value.value);
          this.acceptSub(params);
        })
      },
      //请求接口
      acceptSub(params){
        let apiPath = '';
        if([329, 330].indexOf(this.tabs.activeTableInfo.state_ID) > -1){
          apiPath = 'work/prodCheck';
        }else{
          apiPath = '/work/baseAccept';
        }
        this.$axios.post(apiPath, params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success("操作成功！");
            this.accept.visible =false;
            this.$maskoff();
            this.loadData();
          }
        })
      },
      //-----------------------------------撤回需求的操作
      back(){
        this.confirm("确定进行撤回操作吗？", () => {
          this.$maskin();
          let params = new URLSearchParams();
          let info = this.tabs.activeTableInfo;//设置当前信息
          params.append("BASE_ID", info.work_NEET_ID);
          this.$axios.post("/work/baseRegret", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.$maskoff();
              this.loadData();
            }
          })
        })
      },
      //-----------------------------------新建变更和需求内变更
      newchange(type){
        this.$maskin();
        if(type=="change"){
          this.clearAddData();
          this.addneeds.addform.title = "新建变更";
          this.addneeds.addType = "change";//当前是新建变更
        }else{
          this.addneeds.addform.title = "需求内变更";
          this.addneeds.addType = "changeInset";//当前是需求内变更
        }
        let params = new URLSearchParams();
        params.append("WORK_NELL_ID",this.tabs.activeTableInfo.work_NEET_ID);
        console.log(123);
        this.$axios.post("/work/baseSaveFront",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            let base = data.result.base;
            let attachments=data.result.attachments;
            this.addneeds.addform.sxname = data.result.USERNAME;//产品提出人
            this.$set(this.addneeds.addform, "fromdeptArr", data.result.depts);//来源部门数组
            this.$set(this.addneeds.addform, "zhongyaochegnduArr", data.result.importance);//重要程度
            this.$set(this.addneeds.addform, "levelArr", data.result.priority);//优先级
            this.$set(this.addneeds.addform, "needstypeArr", data.result.baseTypeName);//需求类型
            this.$set(this.addneeds.addform, "affectArr", data.result.influece);//影响面
            this.$set(this.addneeds.addform, "resulttypeArr", data.result.result);//成果类型
            this.$set(this.addneeds.addform, "attributionArr", data.result.ascription);//需求归属划分
            if(type=="changeInset"){
              //需求内变更需展示
              this.addneeds.addform.code = base.work_NEET_ID;//当前的新需求ID
              this.addneeds.addform.oldchangepoint = base.product_FUNCTION;//原需求功能
              this.addneeds.addform.oldneedsname = base.neel_DESCRIPTION;//原需求描述
              //操作过快导致dom没加载出来会出现null，暂时用settimeout替代下
              setTimeout(()=>{
                this.setBrInfo(document.querySelector(".oldchangepoint_change"),base.product_FUNCTION);
                this.setBrInfo(document.querySelector(".oldneedsname_change"),base.neel_DESCRIPTION);
              },0)
            }else{
              //新建变更展示原需求编号
              this.addneeds.addform.code = data.result.WORK_NEET_ID;//当前的新需求ID
              this.addneeds.addform.oldcode = base.work_NEET_ID;
              this.addneeds.addform.shenqingdate = new Date();
              this.addneeds.addform.oldgongneng = "";
              this.addneeds.addform.oldneedsname = "";
            }
            if(type == "changeInset"){
              this.showOldData(base,attachments);
            }
            this.addneeds.addvisible = true;
            this.$maskoff();
          }
        })
      },
      //-----------------------------------需求内变更的回显操作
      showOldData(info,attachments){
        this.addneeds.addform.code = info.work_NEET_ID;//需求编号
        this.addneeds.addform.name = info.neel_NAME;//需求名称
        this.addneeds.addform.needstype = info.type;//需求类型
        this.addneeds.addform.resulttypeArr = info.result;//成果类型
        this.addneeds.addform.resulttype = info.result;//成果类型
        this.addneeds.addform.affect = info.influece;//需求影响面
        this.addneeds.addform.level = info.rriority;//优先级评定
        this.addneeds.addform.attribution = info.ascription;//需求划分归属
        this.addneeds.addform.productline = info.prduct_LINE;//涉及产品线
        this.addneeds.addform.shenqingdate = new Date(info.start_DATE);//申请日期
        this.addneeds.addform.designdate = new Date(info.end_DATE);//期望上线日期
        this.addneeds.addform.fromdeptId = parseInt(info.dept_ID);//需求提出部门
        this.fromdeptchange(info.dept_ID);
        this.addneeds.addform.fromdeptroleId = info.user_ID;//需求提出人
        this.addneeds.addform.sxname = info.apply_NAME;//产品负责人
        this.addneeds.addform.zhongyaochegndu = info.importance;//重要程度
        this.addneeds.addform.jiaji = info.urgent?"1":"0";//是否加急
        this.addneeds.addform.jiajireason = info.urgent?info.urgent:"";//加急原因
        this.addneeds.addform.reform = info.background;//需求背景
        let fileIds=[];
        if(attachments.length){
          for(let i of attachments){
            fileIds.push(i.id);
          }
          this.$set(this.addneeds,"uploadFiles",attachments);
          this.$set(this.addneeds,"fileIds",fileIds);
        }
        setTimeout(()=> {
          this.setBrInfo(document.querySelector(".reform_change"), info.background);
        },0)
//        this.addneeds.addform.changepoint = info.product_FUNCTION;//产品改造点
//        this.addneeds.addform.needsname = info.neel_DESCRIPTION;//需求描述
      },
      //-----------------------------------分配任务
      getAssign(){
        let info = this.tabs.activeTableInfo;
        if (info.state_ID == 304) {
          this.taskid = info.work_NEET_ID;
        }
        this.panelTip = {
          panelTitle: '分配',
          selectedUserTitle: '已选择人员名单',
          selectedUserTip: '请选择人员',
          selectUserTitle: '选择人员',
        }
        this.myurl = "/work/queryUserByDemand";
        this.assignvisible = true;
      },
      //-----------------------------------分配任务搜索功能
      assignSearch(){
        let keyword = this.assign.keyword;
//        let type;
//        if (this.assign.left) {
//          type = "left"
//        } else {
//          type = "right"
//        }
        //搜索关键字判断
        if (keyword == "") {
          //为空
          this.assign.leftSearch = false;
//          this.$set(this.assign, "searchData", type == "left" ? this.assign.leftOriginData : this.assign.rightlistdata)
          this.$set(this.assign, "searchData",this.assign.leftOriginData)
        } else {
          //不为空
          let arr = [];
//          if (type == "left") {
          for (let i of this.assign.leftOriginData) {
            for (let j of i.users) {
              if (j.user_NAME.indexOf(keyword) >= 0) {
                arr.push(j)
              }
            }
          }
          this.assign.leftSearch = true;
//          } else {
//            for (let i of this.assign.rightlistdata) {
//              if (i.user_NAME.indexOf(keyword) >= 0) {
//                arr.push(i)
//              }
//            }
//          }
          this.$set(this.assign, "searchData", arr);
        }
      },
      //-----------------------------------提交分配任务
      subAssign(poyload){
        if (!poyload.userLists) {
          this.$warn("当前没有选择任何人员");
        } else {
          this.$maskin();
          let info = this.tabs.activeTableInfo;
          let params = new URLSearchParams();
          params.append("names", poyload.nameLists);
          params.append("ids", poyload.userLists);
          params.append("BASE_ID", info.work_NEET_ID);
          this.$axios.post("/work/checkBase", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功");
              this.loadData();
              this.$maskoff();
            }
          })
        }
      },
      //-----------------------------------驳回
      rejected(){
        let info = this.tabs.activeTableInfo;
        this.prompt("确定进行驳回操作？", "请填写驳回理由", (val) => {
          if (val.value == "") {
            this.$warn("请填写驳回理由");
            return;
          }
          this.$maskin();
          let params = new URLSearchParams();
          params.append("BASE_ID", info.work_NEET_ID);
          params.append("RESON", val.value);
          this.$axios.post("/work/baseReject", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.$maskoff();
              this.loadData();
            }
          })
        })
      },
      // 根据开发或测试来选择人员
      chooseUserByTask(val){
        this.split.choosesystem = '';
        this.split.choosesystemSub = '';
        this.split.levelchoosen = '';
        if(val=='1'){
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
              this.review.reviewvisible =false;
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
      //---------------------------------------------拆分任务-----------------------------------
      splitTask(){
        // console.log('拆分任务');
        console.log(this.review.reviewvisible);
        // this.review.reviewvisible =false;
        this.$maskin();
        let info = this.tabs.activeTableInfo;
        console.log(this.tabs.activeTableInfo)
        let params = new URLSearchParams();
        params.append("BASE_ID", info.work_NEET_ID);
        this.$axios.post("/work/baseInfoCheck", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.review.reviewvisible =false;
            this.split.splitvisible = true;
            this.$set(this.split, "level", data.result.facility);//设置难易度集合
            // this.$set(this.split, "choosesystemArr", data.result.system);//设置系统集合
            this.$set(this.split, "personlist", data.result.dept.users);//设置人员集合
            // console.log(this.split.choosesystemArr);
            this.$maskoff();
          }
        })
        // this.$axios.post("/user/queryUsersByPosition", params).then((res) => {
        //   let data = res.data;
        //   if (data.code == 200) {
        //     // this.review.reviewvisible =false;
        //     // this.split.splitvisible = true;
        //     // this.$set(this.split, "personlist", data.result.dept.users);//设置人员集合
        //     // this.$maskoff();
        //   }
        // })
      },
      //-----------------------------------拆分任务时间过滤器
      splitDataFormatter(row, col){
        if(row.end_DATE){
          let date = this.$format(row.end_DATE);
          return `${date.year}-${date.mouth}-${date.day}`
        }
      },
      //-----------------------------------拆分任务新增人员弹窗
      addsplitperson(){
//        let systemChooseArr = this.split.systemAll;
//        if (systemChooseArr.length != 1) {
//          if (systemChooseArr[systemChooseArr.length - 1].name == "" || systemChooseArr[systemChooseArr.length - 1].version == "") {
//            this.split.systemAll.pop()
//          }
//        } else {
//          if (systemChooseArr[systemChooseArr.length - 1].name == "" || systemChooseArr[systemChooseArr.length - 1].version == "") {
//            this.$warn("请先选择涉及系统");
//            return
//          }
//        }
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
      //-----------------------------------选择拆分任务人员变化时判断该人员是否被分配过任务
      splitPersonChangeEvent(){
        let person = this.split.person;
        let base_id  = this.tabs.activeTableInfo.work_NEET_ID;
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
        if (this.split.splitradio ==2 && !this.split.choosesystem) {
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
        if (!this.split.levelchoosen && this.split.splitradio == 2) {
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
          WORK_INFO_ID: this.split.taskcode,//任务编号
          USER_NAME: this.split.person.split("-")[1],//人名
          SYSTEM_NAME_SHOW: this.split.choosesystemSub.split(",")[1],//隐藏只展示
          SYSTEM_NAME: this.split.choosesystemSub.split(",")[1]+this.split.choosesystemSub.split(",")[3],//选择的系统名
          SYSTEM_ID: this.split.choosesystemSub.split(",")[0],//选择的系统名
          SYSTEM_FNAME: this.split.choosesystem.split(",")[1],//选择的系统名
          SYSTEM_FID: this.split.choosesystem.split(",")[0],//选择的父系统名
          VERSION_ID: this.split.choosesystemSub.split(",")[2],//选择的子系统版本id
          RESPONSIBLE_MODULE: this.split.model,//负责模块
          FACILITY_ID: this.split.splitradio == 2?
            this.split.levelchoosen.split("-")[0]:"",//难度ID
          FACILITY_NAME: this.split.splitradio == 2?
            this.split.levelchoosen.split("-")[1]:"",//难度等级
          END_DATE: this.split.finishdate,
          end_data_format: `${end_data.year}-${end_data.mouth}-${end_data.day}`,
          REQUIRED_TIME: this.split.usetime,
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
      //-----------------------------------提交拆分任务结果
      splitSubmit(){
//        let endTime = this.split.enddate;//预计结束日期
//        let startTime = this.split.startdate;//预计开始日期
//        if (!startTime) {
//          this.$warn("请选择预计开始日期");
//          return;
//        }
//        if (!endTime) {
//          this.$warn("请选择预计结束日期");
//          return;
//        }
        if (this.split.tableData.length == 0) {
          this.$warn("请选择分配人员");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        let info = this.tabs.activeTableInfo;
        let BASE_ID = info.work_NEET_ID;//需求ID
        let OLD_STATE = info.state_ID;//当前状态码
        params.append("BASE_ID", BASE_ID);
        params.append("OLD_STATE", OLD_STATE);
//        params.append("endTime", endTime)
//        params.append("startTime", startTime)
        params.append("names", this.split.names);
        params.append("ids", this.split.ids);
        params.append("bics", JSON.stringify(this.split.tableData));
        this.$axios.post("/work/addInfos", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success("操作成功！");
            this.$set(this.split,"names",[]);
            this.$set(this.split,"ids",[]);
            this.loadData();
            this.$maskoff();
          }
        });
      },
      //-----------------------------------清空拆分任务界面
      clearSplitSub(){
        this.split.splitvisible = false;//关闭操作台
        this.$set(this.split,"tableData",[]);
      },

      //-----------------------------------拆分任务详情点击事件，展示数据-----------------------------------------
      splitTaskClick(val){
        this.$set(this.split, "hasSplitTaskData", []);
        //为空时不展示内容
        if (!val.infos || val.infos.length == 0) {
          return;
        }
        let old_REQUIRED_TIME = 0;//原预计用时
        let required_TIME = 0;//现预计用时
        let old_ACTUAL_TIME = 0;//原实际用时
        let work_TIME = 0;//现实际用时
        let actual_TIME = 0;//总工时
        for(let i of val.infos){
          old_REQUIRED_TIME += i.old_REQUIRED_TIME?i.old_REQUIRED_TIME:0;
          required_TIME += i.required_TIME?i.required_TIME:0;
          old_ACTUAL_TIME += i.old_ACTUAL_TIME?i.old_ACTUAL_TIME:0;
          work_TIME += i.work_TIME?i.work_TIME:0;
          actual_TIME += i.actual_TIME?i.actual_TIME:0;
        }
        this.split.hasSplitvisible = true;
        this.$set(this.split, "hasSplitTaskData", val.infos);
        //添加合计用时
        if(this.split.hasSplitTaskData[this.split.hasSplitTaskData.length-1].user_NAME != "合计") {
          this.split.hasSplitTaskData.push({
            "user_NAME":"合计",
            "old_REQUIRED_TIME":old_REQUIRED_TIME,
            "required_TIME":required_TIME,
            "old_ACTUAL_TIME":old_ACTUAL_TIME,
            "work_TIME":work_TIME,
            "actual_TIME":actual_TIME
          })
        }

        this.split.reviewData.TASK_RISK = val.TASK_RISK;//风险点
        this.split.reviewData.ANALYSIS_RESULT = val.ANALYSIS_RESULT;//分析结果
        this.split.reviewData.ANALYSIS_TIME = val.ANALYSIS_TIME;//分析时间
        this.split.reviewData.EXPECT_END = val.EXPECT_END;//预期结束时间
        this.split.reviewData.EXPECT_START = val.EXPECT_START;//预期开始时间
      },

      //-----------------------------------开发的任务操作--------------------------------------
      //-----------------------------------开发的开始操作
//      splitCodeStart(index, val){
//        let info = this.tabs.activeTableInfo;
//        let params = new URLSearchParams();
//        params.append("BASE_ID", info.work_NEET_ID);
//        params.append("WORK_INFO_ID", val.work_INFO_ID);
//        params.append("OLD_STATE", val.state_ID);
//        this.$axios.post("/work/beginInfo", params).then((res) => {
//          let data = res.data;
//          if (data.code == 200) {
//            this.$success("操作成功！");
//            this.loadData();
//          }
//        })
//      },
      //-----------------------------------开发的完成操作（测试的完成操作同样在此，type为"test"为测试的完成操作，不传则为开发的完成操作）
      splitTaskFinish(index, val,type){
        if(type == "test" && !this.testTask.typevalue){
          this.$warn("请选择用例类型");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("TEST_INFO_ID",val.work_INFO_ID);
        params.append("neelId",val.work_NEET_ID);
        params.append("systemId",val.systemson_ID);
        this.$axios.post("/work/checkTestConfrim",params).then((res)=>{
          let data = res.data;
          if(data.code == 200) {
            let msg = "";
            if (data.result) {
              msg = data.result+"，确定通过该项任务？"
            } else {
              msg = "确定通过该项任务？"
            }
            this.taskFinished.usetime = "";//实际用时
            this.taskFinished.reason = "";//超时原因
            this.taskFinished.outtime = false;//隐藏超时原因
            this.taskFinished.taskId = val.work_INFO_ID;//当前任务ID
            this.taskFinished.testnotallow = false;//通过和不通过
            this.taskFinished.testnotallowtext = "";//测试不通过原因
            let nowDate= (new Date()).getTime();
            if (nowDate > val.end_DATE+86400000) {
              //对比当前时间和预计完成时间显示超时原因
              this.taskFinished.outtime = true;//显示超时原因
            }else{
              this.taskFinished.outtime = false;
            }
            if(!type){
              //当前是开发点击完成任务
              this.taskFinished.taskFinishedvisible = true;
            }
            if(type == "test"){
              this.testComplete.visible = true;
//              this.confirm(msg, () => {
//                //通过测试
//                this.taskFinished.taskFinishedvisible = true;
//              }, () => {
              //不通过测试
//                this.taskFinished.taskFinishedvisible = true;
//                this.taskFinished.testnotallow = true;//测试不通过
//              }, ["通过", "不通过"]);
              this.$maskoff();
              return;
            }
            this.$maskoff();
          }
        });
      },
      //测试不通过
      test_notallow(){
        //不通过测试
        this.taskFinished.taskFinishedvisible = true;
        this.taskFinished.testnotallow = true;//测试不通过
      },
      //测试通过
      test_allow(){
        //通过测试
        this.taskFinished.taskFinishedvisible = true;
      },
      //-----------------------------------完成提交操作
      subFinishTask(){
        if(!this.taskFinished.testnotallowtext && this.taskFinished.testnotallow){
          this.$warn("请填写不通过原因");
          return;
        }
        if(!this.taskFinished.usetime){
          this.$warn("请填写实际用时");
          return;
        }
        if(!this.$reg.number.test(this.taskFinished.usetime)){
          this.$warn("实际用时格式不正确");
          return;
        }
        if(this.taskFinished.outtime && !this.taskFinished.reason){
          this.$warn("请填写超时原因");
          return;
        }
        this.$maskin();
        let info = this.tabs.activeTableInfo;
        let params = new URLSearchParams();
        params.append("BASE_ID", info.work_NEET_ID);//需求ID
        params.append("WORK_INFO_ID", this.taskFinished.taskId);//当前拆分任务ID
        params.append("TEST_RESULT",this.taskFinished.testnotallowtext);//不通过原因
        if(this.taskFinished.outtime){
          params.append("REMARK", this.taskFinished.reason);//原因
        }
        params.append("WORK_TIME", this.taskFinished.usetime);//实际用时
        this.$axios.post("/work/completeInfo", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.taskFinished.taskFinishedvisible = false;
            this.testComplete.visible = false;
            this.$success("操作成功！");
            this.$maskoff();
            this.loadData();
          }
        })
      },
      //-----------------------------------展示给开发人员的bug
      showCodeBUG(){
        let info = this.tabs.activeTableInfo;
        let params = new URLSearchParams();
        params.append("BASE_ID", info.work_NEET_ID);
        this.$axios.post("/work/queryBugByCode", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            if(data.result.bugs.length){
              this.$set(this.testTask, "codeBUGData", data.result.bugs);
              this.testTask.codeBUGlistvisible = true;
            }else{
              this.$success("当前无BUG待处理");
            }
          }
        })
      },
      //-----------------------------------开发BUG完成和转接操作
      codeBUGAction(index, val, type){
        let info = this.tabs.activeTableInfo;
        let params = new URLSearchParams();
        if (type == "完成") {
          this.$maskin();
          params.append("BUG_STATE", 1);
          params.append("BUG_ID", val.work_BUG_ID);
          params.append("BASE_ID", info.work_NEET_ID);
          this.$axios.post("/work/updateBugState", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.$maskoff();
              this.showCodeBUG();
            }
          })
        } else {
          this.testTask.bugid_code = val.work_BUG_ID;
          let params = new URLSearchParams();
          this.$axios.post("/work/queryPersonByDept", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$set(this.testTask, "assignArr_code", data.result.dept.users);
              this.testTask.assignvisible_code = true;
            }
          });
        }
      },


      //-----------------------------------测试的任务操作-----------------------------------------
      //-----------------------------------选择用例类型
      chooseTestType(){
        if (!this.testTask.type) {
          this.$warn("请选择用例类型");
          return;
        }
        let info = this.tabs.activeTableInfo;
        let params = new URLSearchParams();
        params.append("BASE_ID", info.work_NEET_ID);
        params.append("TYPE_NAME", this.testTask.type);
        this.$axios.post("/work/confirmType", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.testTask.typevalue = this.testTask.type;
          }
        })
      },
      //-----------------------------------进入测试任务
      goTestTask(index, val){
        if (!this.testTask.typevalue) {
          this.$warn("请先选择用例类型");
          return;
        }
        this.$maskin();
        this.testTask.testtaskvisible = false;
        this.testTask.testTaskActiveInfo = val;
        let params = new URLSearchParams();
        params.append("TASK_ID", val.work_INFO_ID);
        this.$axios.post("/work/queryTestRecord", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.testTask.showTaskStep = true;
            if (data.result.btcs) {
              this.$set(this.testTask, "tableData", data.result.btcs)
            }
            this.$maskoff()
          }
        })
      },
      //-----------------------------------测试新增步骤
      addTestStep(){
        if (!this.testTask.step) {
          this.$warn("请填写步骤");
          return;
        }
        if (!this.testTask.result) {
          this.$warn("请填写预期");
          return;
        }
        let subObj = {
          "TEST_STEP": this.testTask.step,
          "TEST_EXPECT": this.testTask.result,
        };
        this.testTask.tableData.push(subObj);
        this.testTask.step = "";
        this.testTask.result = "";
        this.testTask.addvisible = false;
      },
      //-----------------------------------删除新增的步骤
      testTaskDel(index, val){
        this.testTask.tableData.splice(index, 1);
      },
      //-----------------------------------提交步骤
      subTestTask(){
        if (!this.testTask.tableData.length) {
          this.$warn("请添加步骤");
          return;
        }
        let arr = [];
        for (let i of this.testTask.tableData) {
          if (i.TEST_STATE == undefined) {
            arr.push(i)
          }
        }
        if (arr.length == 0) {
          this.$warn("请添加用例后再提交");
          return;
        }
        this.$maskin();
        let info = this.testTask.testTaskActiveInfo;
        let params = new URLSearchParams();
        params.append("TASK_ID", info.work_INFO_ID);
        params.append("btcs", JSON.stringify(arr));
        this.$axios.post("/work/addTestRecord", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$success("操作成功！");
            this.$set(this.testTask, "tableData", data.result.btcs);
            this.$maskoff();
          }
        })
      },
      //-----------------------------------测试通过
      testTaskComplate(val, index){
        this.confirm("是否通过该项测试？", () => {
          this.$maskin();
          let params = new URLSearchParams();
          params.append("TEST_STATE", 1);
          params.append("TEST_ID", val.TEST_ID);
          this.$axios.post("/work/updateTestRecord", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.$set(this.testTask.tableData[index], "TEST_STATE", 1);
              this.$maskoff();
            }
          })
        })
      },
      //-----------------------------------测试不通过
      testTaskNotAllow(val, index){
        this.testTask.rejectReason = "";
        this.testTask.assignPerson = "";
        this.testTask.except = val.TEST_EXPECT ,//预期效果
          this.testTask.test_code = val.TEST_ID;//步骤ID
        this.testTask.step_index = index;//步骤ID
        let params = new URLSearchParams();
        this.$axios.post("/work/queryPerson",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            let result = data.result.depts;
            this.$set(this.testTask,"assignArr", result);
            this.testTask.rejectvisible = true;
          }
        });
      },
      //-----------------------------------测试上传BUG图片
      uploadBUG(e){
        this.$maskin()
        let file = e.target.files[0];//上传的文件
        let params = new FormData();
        params.append("token",this.$getToken());
        params.append("file",file);
        this.$axios.post("/work/uploadTest",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("上传成功");
            this.testTask.fileIds.push(data.result.id)
            this.testTask.uploadBugFiles.push(file);
            this.$maskoff();

          }
        })
      },
      //-----------------------------------直接新增BUG
      addBUG(){
        let params = new URLSearchParams();
        this.$axios.post("/work/queryPerson",params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            let result = data.result.depts;
            this.$set(this.testTask,"assignArr", result);
            this.testTask.addbug = true;
            this.testTask.rejectvisible = true;
          }
        });
      },
      //-----------------------------------测试分配给开发bug
      doTestAssignBug(){
        //新增bug用“addBug”接口，用例不通过用“updateTestRecord”接口
        let url = "";
        if(this.testTask.addbug){
          url = "/work/addBug";
        }else{
          url = "/work/updateTestRecord";
        }
        let person = this.testTask.assignPerson;
        if(!this.testTask.rejectReason && !this.testTask.addbug){
          this.$warn("请填写不通过原因");
          return;
        }
        if(this.testTask.addbug && !this.testTask.bugdes){
          this.$warn("请填写问提描述");
          return;
        }
        if(this.testTask.addbug && !this.testTask.bughope){
          this.$warn("请填写预期效果");
          return;
        }
        if(!person){
          this.$warn("请选择人员");
          return;
        }
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);//需求ID
        params.append("TEST_INFO_ID",this.testTask.testTaskActiveInfo.work_INFO_ID);//任务ID;
        params.append("PERSON_ID",person.split(",")[0]);//人员ID
        params.append("PERSON_NAME",person.split(",")[1]);//人员姓名
        params.append("attachmentId",this.testTask.fileIds);//选中上传的文件
        if(!this.testTask.addbug){
          //当前是用例不通过
          params.append("TEST_ID",this.testTask.test_code);//步骤ID
          params.append("TEST_DESC",this.testTask.rejectReason);//理由
          params.append("TEST_EXPECT",this.testTask.except);//预期效果
          params.append("TEST_STATE", 0);//表示指派bug
        }else{
          params.append("PROBLEM_DESCRIPTION",this.testTask.bugdes);//问题描述
          params.append("DESIRED_RESULT",this.testTask.bughope);//预期效果
        }
        this.$axios.post(url,params).then((res)=>{
          let data =res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            this.testTask.rejectvisible = false;
            if(!this.testTask.addbug){
              this.$set(this.testTask.tableData[this.testTask.step_index], "TEST_STATE", 0);
            }
            this.$maskoff();
            this.clearAssignBug();//清除选择的数据
          }
        })
      },
      //-----------------------------------清除选择的人员
      clearAssignBug(){
        this.testTask.rejectReason = "";//不通过原因
        this.testTask.assignPerson = "";//分配给人员的信息
        this.testTask.test_code = "";//步骤ID
        this.testTask.step_index = "";//当前步骤的索引
        this.testTask.except = "";//预期效果
        this.testTask.bugdes = "";//问题描述
        this.testTask.bughope = "";//预期效果
        this.testTask.addbug = false;//初始化是新增bug还是不通过用例
        this.$set(this.testTask,"fileIds",[]);//清空上传的文件
        this.$set(this.testTask,"uploadBugFiles",[]);//清空上传的文件
      },
      //-----------------------------------测试的bug清单
      showTestAllBug(){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/queryBugByTest",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.testTask.allbugvisible = true;
            let arr = [];
            for(let i of data.result.bugs){
              arr.push(i.test_INFO_ID);
            }
            this.$set(this.testTask,"bugidArr",this.$unique(arr))
            this.$set(this.testTask,"allbuglist",data.result.bugs);
            this.$set(this.testTask,"allbuglistorigin",data.result.bugs);
            this.$maskoff()
          }
        })
      },
      //-----------------------------------选择任务ID筛选测试BUG清单的BUG
      chooseBUgID(){
        let id = this.testTask.bugid
        if(!id){
          this.$set(this.testTask,"allbuglist",this.testTask.allbuglistorigin);
          return;
        }
        let arr = [];
        for(let i of this.testTask.allbuglistorigin){
          if(i.test_INFO_ID == id){
            arr.push(i)
          }
        }
        this.$set(this.testTask,"allbuglist",arr);
      },
      //-----------------------------------测试的bug操作
      testBUGAction(index,row,type){
        this.$maskin();
        let bugState = type == "激活"?0:2;
        let params = new URLSearchParams();
        params.append("BUG_ID",row.work_BUG_ID);
        params.append("BUG_STATE",bugState);
        this.$axios.post("/work/updateBugStateByTest",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.showTestAllBug();//重新加载bug清单
            this.$maskoff();
          }
        })
      },
      //-----------------------------------关闭开发选择转接人员
      closeAssign_code(){
        this.testTask.assignvisible_code = false;
      },
      //-----------------------------------选中人员后进行分配操作(开发的转接bug同样在此处)
      assignpersonAction(e, code){
        if (!code) {
          if (!this.testTask.assignPerson) {
            this.$warn("请选择人员");
            return;
          }
          //当前是测试人员的操作
          let param = new URLSearchParams();
          let choosen = this.testTask.assignPerson;
          let name = choosen.split(",")[1];
          let id = choosen.split(",")[0];
          let arr = [];//选中的问题的数组
          for (let i of this.testTask.BUGActiveData) {
            arr.push(i.TEST_ID)
          }
          let need_id = this.tabs.activeTableInfo.work_NEET_ID;//需求ID
          param.append("PERSON_NAME", name);
          param.append("PERSON_ID", id);
          param.append("ids", arr);
          param.append("BASE_ID", need_id);
          this.$axios.post("/work/addBug", param).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.loadbuglist();
              this.goTestTask("", this.testTask.testTaskActiveInfo)
              this.testTask.assignPerson = "";//清空选中的人员
              this.testTask.assignvisible = false;
            }
          });
        } else {
          if (!this.testTask.assignPerson_code) {
            this.$warn("请选择人员");
            return;
          }
          //当前是开发的操作
          let params = new URLSearchParams();
          let BUG_ID = this.testTask.bugid_code;
          let BASE_ID = this.tabs.activeTableInfo.work_NEET_ID;
          let PERSON_ID = this.testTask.assignPerson_code.split(",")[0];
          let PERSON_NAME = this.testTask.assignPerson_code.split(",")[1];
          params.append("BUG_ID", BUG_ID);
          params.append("BASE_ID", BASE_ID);
          params.append("PERSON_ID", PERSON_ID);
          params.append("PERSON_NAME", PERSON_NAME);
          this.$axios.post("/work/updateBugState", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success("操作成功！");
              this.testTask.assignArr_code = false;
              this.testTask.assignvisible_code = false;
              this.testTask.assignPerson_code = "";
              this.$set(this.testTask, "codeBUGData", data.result.bugs)
            }
          })
        }
      },
      //-----------------------------------开启上传测试报告弹窗
      showTestReportUpload(){
        this.testReport.type = "";
        this.$set(this.testReport,"uploadFile",[]);
        this.$set(this.testReport,"fileIds",[]);
        this.testReport.neel_id = this.tabs.activeTableInfo.work_NEET_ID;
        this.testReport.visible = true;
      },
      //-----------------------------------技术经理确认变更-------------------------------------
      doChangeInset(){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/confrimInnerCheck",params).then((res)=>{
          let data= res.data;
          if(data.code == 200){
            //this.changeInset.visible = true;
//            let arr = data.result.oldInfos;
//            for(let i of arr){
//              i["ACTUAL_TIME"] = 0;
//            }
            //let system = [];
            //for(let i of data.result.system){
            //  i.value = i.SYSTEM_ID+','+i.SYSTEM_NAME
            //  system.push(i)
            //}
            ////回显
            //this.$set(this.changeInset,"tableData",data.result.oldInfos);//原拆分任务
            //this.$set(this.changeInset,"allsystem",system);//可选择的所有系统
            //this.$set(this.changeInset,"level",data.result.facility);//难易度
            //this.$maskoff();
            this.handleCurrentChange(this.tabs.activeTableInfo, this.tabs.activeEvent)
            this.loadData();
          }
        })

      },
      //-----------------------------------过滤器
      changeInsetMatter(row){
        //原完成日期
        let data = this.$format(row.end_DATE);
        return `${data.year}-${data.mouth}-${data.day}`
      },
      changeInsetMatter_now(row){
        //现完成如期
        if(!row.now_end_DATE){
          return "";
        }
        let data = this.$format(row.now_end_DATE);
        return `${data.year}-${data.mouth}-${data.day}`
      },
      //-----------------------------------编辑回显操作
      editChangeInset(index,row){
        this.changeInset.index = index;
        this.changeInset.splitaddvisible = true;
        this.changeInset.taskcode = row.work_INFO_ID;//原需求ID
        this.changeInset.system_NAME = row.system_NAME;//系统名
        //测试任务没有系统
        if(row.system_ID && row.system_NAME){
          this.changeInset.choosesystem = row.system_ID+','+row.system_NAME;//系统名
        }else{
          this.changeInset.choosesystem = ""
        }
        this.changeInset.person = row.user_NAME;//人员
        this.changeInset.finishdate = row.end_DATE;//完成日期
        this.changeInset.model = row.responsible_MODULE;//负责模块
        //测试任务没有难易度
        if(row.facility_ID && row.facility_NAME){
          this.changeInset.levelchoosen = row.facility_ID+','+row.facility_NAME;//系统名
        }else{
          this.changeInset.levelchoosen = ""
        }
        this.changeInset.levelchoosen = row.facility_ID+'-'+row.facility_NAME;//难易度
        this.changeInset.usetime = row.required_TIME;//预计用时
        this.changeInset.truetime = "";//实际用时
      },
      //-----------------------------------编辑原任务提交
      changeInsetPersonSub(){
        if (this.changeInset.choosesystem == "" && this.changeInset.system_NAME) {
          this.$warn("请选择系统");
          return;
        }
        if (!this.changeInset.person) {
          this.$warn("请选择分配人员");
          return;
        }
        if (!this.changeInset.finishdate) {
          this.$warn("请选择完成日期");
          return;
        }
        if (!this.changeInset.model) {
          this.$warn("请填写负责模块");
          return;
        }
        if (!this.changeInset.levelchoosen && this.changeInset.system_NAME) {
          this.$warn("请选择难易度");
          return;
        }
        if (!this.changeInset.usetime) {
          this.$warn("请填写现预计用时");
          return;
        }
        if (!this.changeInset.truetime) {
          this.$warn("请填写实际用时");
          return;
        }
        if (!this.$reg.number.test(this.changeInset.usetime)) {
          this.$warn("预计用时格式不正确");
          return;
        }
        if (!this.$reg.number.test(this.changeInset.truetime)) {
          this.$warn("实际用时格式不正确");
          return;
        }
        let end_data = this.$format(this.changeInset.finishdate);
        let info = this.changeInset;
        let index = this.changeInset.index;
        //设置表格的数据
        this.setChangeTaskInfo(index,"now_system_NAME",info.choosesystem.split(",")[1]);//系统名
        this.setChangeTaskInfo(index,"now_end_DATE",`${end_data.year}-${end_data.mouth}-${end_data.day}`);//完成日期
        this.setChangeTaskInfo(index,"now_responsible_MODULE",info.model);//负责模块
        this.setChangeTaskInfo(index,"now_facility_NAME",info.system_NAME?info.levelchoosen.split("-")[1]:"");//难易度
        this.setChangeTaskInfo(index,"old_REQUIRED_TIME",info.usetime);//预计用时
        this.setChangeTaskInfo(index,"work_TIME",info.truetime);//实际用时
        this.setChangeTaskInfo(index,"actual_TIME",info.truetime);//总工时
        this.changeInset.splitaddvisible = false;
        let obj = {
          WORK_INFO_ID: this.changeInset.taskcode,//任务编号
          USER_NAME: this.changeInset.person,//人名
          SYSTEM_NAME: this.changeInset.choosesystem?this.changeInset.choosesystem.split(",")[1]:"",//选择的系统
          SYSTEM_ID: this.changeInset.choosesystem?this.changeInset.choosesystem.split(",")[0]:"",//选择的系统
          RESPONSIBLE_MODULE: this.changeInset.model,//负责模块
          FACILITY_ID: this.changeInset.system_NAME?
            this.changeInset.levelchoosen.split("-")[0]:"",//难度ID
          END_DATE: this.changeInset.finishdate,
          REQUIRED_TIME: this.changeInset.usetime,
          OLD_ACTUAL_TIME: this.changeInset.truetime,//实际用时
        };
        this.changeInset.subData[index] = obj;
      },
      //-----------------------------------提交需求内变更结果
      subChangeInset(){
        this.$maskin();
        let params = new URLSearchParams();
        params.append("bics",JSON.stringify(this.changeInset.subData));
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/updateInfos",params).then((res)=>{
          let data = res.data;
          if(data.code == 200){
            this.$success("操作成功！");
            this.loadData();
            this.$maskoff();
          }
        })
      },
      setChangeTaskInfo(index,key,value){
        this.$set(this.changeInset.tableData[index],key,value)
      },
      //-----------------------------------加载视图模式数据
      loadtrack(){
        this.tracking.trackingvisiible  = !this.tracking.trackingvisiible;
        let params = new URLSearchParams();
        params.append("BASE_ID",this.tabs.activeTableInfo.work_NEET_ID);
        this.$axios.post("/work/queryView",params).then((res)=>{
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
            console.log(arr.filter(t => t.view_DESC[0] != ''));
            this.$set(this.tracking, "data",arr.filter(t => t.view_DESC[0] != ''));
            console.log(this.tracking.data);
          }
        });
      },
      //关联项目
      relatedProject(){
        this.$set(this.split, "hasSplitTaskDataByGroup", this.split.hasSplitTaskDataByGroupOrigin);
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
          this.$maskin();
          this.currentPageNumber=1;
          let params = new URLSearchParams();
          params.append('page',this.currentPageNumber)
          params.append('pageSize',this.defaultPageSize)
          return this.$axios.post("/work/queryAll",params).then((res)=>{
            let data = res.data;
            if(data.code == 200){
              this.current_user_id = data.result.current_user_id;
              data.result.bases.map(item => {
                item.isFast = item.urgent || "否";
              });
              this.$set(this.table,"tableData", data.result.bases);
              this.$maskoff();
            }
          })
        }
        if(handlerType === 'end'){
          this.$maskin();
          let params = new URLSearchParams();
          this.currentPageNumber=Math.ceil(this.total/this.defaultPageSize);
          params.append('page',this.currentPageNumber)
          params.append('pageSize',this.defaultPageSize)
          return this.$axios.post("/work/queryAll",params).then((res)=>{
            let data = res.data;
            if(data.code == 200){
              this.current_user_id = data.result.current_user_id;
              data.result.bases.map(item => {
                item.isFast = item.urgent || "否";
              });
              this.$set(this.table,"tableData", data.result.bases);
              this.$maskoff();
            }
          })
        }
        this.loadData(handlerType);
      },
      resetDisabled(home,prev,next,end){
        this.homeDisabled=home;
        this.prevDisabled=prev;
        this.nextDisabled=next;
        this.endDisabled=end;
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
  .el-table .cell button {
    display: inline-block;
    margin: 0;
  }
  .el-form-item {
    margin-bottom: 10px;
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
  .testTask_bugtable table.el-table__header th {
    background: white !important;
  }

  .upload-wrapper{
    float: right;
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
<style>
  .jcjs .el-table td, .jcjs .el-table th {
    padding: 10px 0 !important;
  }

</style>
