/* ************************************************
Author: ct
** ***********************************************/
<template>
  <div class="tableConsole">
    <div class="table-main" :style="`height: calc(100% - ${baseBlowHeight} - 48px)`">
      <el-table
        ref="mainTable"
        tooltip-effect="dark"
        style="width: 100%"
        border
        highlight-current-row
        :data="tableData"
        @row-click="tableRowClick"
        @expand-change="expandChange"
        :row-class-name="tableRowClassName"
        :default-sort = "{prop: 'online_ID', order: 'descending'}"
      >
        <el-table-column
          sortable
          show-overflow-tooltip
          v-for="item in tableConfig"
          :key="item.prop"
          :prop="item.prop"
          :width="item.width"
          :label="item.label">
        </el-table-column>
        <el-table-column type="expand" @expand="expandText" label="查看相关系统" width="120">
          <template slot-scope="props">
            <div class="subTableBox">
              <div class="subTableTitle">相关系统</div>
              <el-table
                class="subTable"
                size="mini"
                :data="subTableData">
                <el-table-column
                  v-for="item in subTableConfig"
                  :key="item.prop"
                  :prop="item.prop"
                  :width="item.width"
                  :label="item.label">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="scope.row.buttons.ONLINE_AUDIT || scope.row.buttons.RE_ONLINE || scope.row.buttons.ONLINE_SUBMIT || scope.row.buttons.UPDATE || scope.row.buttons.MANAGER_CONFIRM" @click.stop="tabsClick(scope.row)">{{scope.row.buttons | tablebutton }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-pagination" v-if="showPagination">
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
          @click="pageHandler('prev')"
          :disabled="prevDisabled"
          icon="el-icon-arrow-left">
          上一页
        </el-button>
        <el-button
          size="mini"
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
    <div class="console-box" v-show="baseBlowHeight === '0px'? false: true">
      <div class="closeConsole" style="z-index: 10000">
        <el-button
          v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_SUBMIT && (consoleInfoData.systems.length > 0 || consoleInfoData.buttons.UPDATE) || maxShow || (consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_SUBMIT && (consoleInfoData.data.STATUS == '7' || consoleInfoData.data.STATUS == '1') || maxShow)"
          type="primary"
          @click="goSubmit"
          size="mini">
          提交
        </el-button>
        <i :class="`anticon icon-${baseBlowHeight === '100%'? 'reload1': 'upload'}`" @click="handlerTab('full')">
          {{baseBlowHeight === '100%'? '还原': '最大化'}}
        </i>
        <i class="anticon icon-download" @click="handlerTab('close')">关闭</i>
      </div>
      <el-tabs v-model="activeTab" type="card" class="consoleTab"
        :style="`height: ${baseBlowHeight}`">
        <el-tab-pane label="详情页" name="info">
          <div class="status-box">
            <div>状态: {{consoleInfoData && consoleInfoData.data && consoleInfoData.data.STATUS_NAME}}</div>
            <div v-if="consoleInfoData.checkUser!=='生产验收通过'">下一步: {{consoleInfoData && consoleInfoData.data && consoleInfoData.checkUser}}</div>
            <div v-if="consoleInfoData && consoleInfoData.data && consoleInfoData.confirm_name.length>0">运维操作人员: <span v-for="(item,index) in consoleInfoData.confirm_name" :key="index">{{item}}|</span></div>
            <div>发送人: {{consoleInfoData && consoleInfoData.data && consoleInfoData.data.PROD_MANAGER}}</div>
          </div>
          <el-form label-width="80px">
            <el-row :span="12">
              <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">上线详情</div>
            </el-row>
            <el-row v-if="consoleInfoData.data">
              <el-col :span="item.width || 12" v-if="consoleInfoData.data[item.prop] && consoleInfoData.data[item.prop].search('undefined') === -1" v-for="item in consoleInfoConfig" :key="item.label">
                <el-form-item :label="item.label">
                  <span v-if="item.prop=='URGENT_DESC'" style="color:red;">{{consoleInfoData.data['URGENT_DESC']}}</span>
                  <div v-if="item.prop=='SHOW_CHANGE_SYSTEM'" style="font-weight:bold;">{{consoleInfoData.data['SHOW_CHANGE_SYSTEM']}}</div>
                  <!-- <div v-if="item.prop=='SHOW_CHANGE_SYSTEM'" v-for="(sys,index) in consoleInfoData.data['SHOW_CHANGE_SYSTEM']" :key="index" style="font-weight:bold;">{{index+1}} . {{sys.SYSTEM_NAME}} - {{sys.IP_ADDRESS}} - {{sys.SYSTEM_USER}}</div> -->
                  <span v-if="item.prop!=='URGENT_DESC' && item.prop!=='SHOW_CHANGE_SYSTEM'">{{consoleInfoData.data[item.prop]}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form v-for="(item,index) in consoleInfoData.infos" :key="index" label-width="150px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="涉及系统:">{{item.SYSTEM_NAME}} - {{item.SUB_SYSTEM_NAME}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上线模块:">{{item.MODULE}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上线内容:">{{item.CONTENT}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否停止交易:">{{item.IS_TRADE=='1'?'否':'是'}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form label-width="150px" v-for="(item,index) in consoleInfoData.bugList" :key="index" v-if="consoleInfoData.bugList.length>0">
            <el-row :span="12">
              <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">BUG详情</div>
            </el-row>
            <el-col :span="24" v-if="item.USER_NAME">
              <el-form-item label="分析人:">{{item.USER_NAME}}</el-form-item>
            </el-col>
            <el-col :span="24" v-if="item.BUG_REASON">
              <el-form-item label="BUG原因:">{{item.BUG_REASON}}</el-form-item>
            </el-col>
            <el-col :span="24" v-if="item.CARELESSNESS_REASON">
              <el-form-item label="生产验证不充分原因:">{{item.CARELESSNESS_REASON}}</el-form-item>
            </el-col>
            <el-col :span="24" v-if="item.IMPROVEMENT_ACTION">
              <el-form-item label="改进措施:">{{item.IMPROVEMENT_ACTION}}</el-form-item>
            </el-col>
          </el-form>
          <el-form label-width="150px" v-for="(item,index) in consoleInfoData.dbExecutionInfos" :key="index" v-if="consoleInfoData.dbExecutionInfos.length>0">
            <el-row :gutter="20">
              <el-row :span="12">
                <div style="text-align:center;color:#000;font-size:18px;font-weight:bold;">运维详情</div>
              </el-row>
              <el-col :span="24">
                <el-form-item label="执行系统:"><span style="font-weight:bold;">{{item.system_name}} - {{item.sub_system_name}}</span></el-form-item>
              </el-col>
              <div v-for="(itemSub,index) in item.onlineInfoConfirms" :key="index">
                <el-col :span="12" v-if="itemSub.confirm_NAME">
                  <el-form-item label="运维人员:"><span style="color:red;">{{itemSub.confirm_NAME}}</span></el-form-item>
                </el-col>
                <el-col :span="12" v-if="itemSub.status">
                  <el-form-item label="上线结果:">{{itemSub.status}}</el-form-item>
                </el-col>
                <el-col :span="12" v-if="itemSub.update_time">
                  <el-form-item label="执行时间:">{{itemSub.update_time}}</el-form-item>
                </el-col>
                <el-col :span="12" v-if="itemSub.actual_online_time">
                  <el-form-item label="实际上线时间:">{{itemSub.actual_online_time}}</el-form-item>
                </el-col>
                <el-col :span="12" v-if="itemSub.remarks">
                  <el-form-item label="操作说明:">{{itemSub.remarks}}</el-form-item>
                </el-col>
              </div>
              <!-- <el-col :span="12">
                <el-form-item label="执行系统:" v-if="item.onlineChangeSystems.length">
                  <div style="display:inline-block;" :key="index"  v-for="(itemSub,index) in item.onlineChangeSystems">
                    {{itemSub.system_NAME}}-{{itemSub.ip_ADDRESS!=='null'?itemSub.ip_ADDRESS:''}}-{{itemSub.system_USER!=='null'?itemSub.system_USER:''}}&nbsp; &nbsp; &nbsp;
                  </div>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作台" name="console" class="console">
          <div class="status-box">
            <div>状态: {{consoleInfoData && consoleInfoData.data && consoleInfoData.data.STATUS_NAME}}</div>
            <div v-if="consoleInfoData.checkUser!=='生产验收通过'">下一步: {{consoleInfoData && consoleInfoData.data && consoleInfoData.checkUser}}</div>
            <div v-if="consoleInfoData && consoleInfoData.data && consoleInfoData.confirm_name.length>0">运维操作人员: <span v-for="(item,index) in consoleInfoData.confirm_name" :key="index">{{item}}|</span></div>
            <div>发送人: {{consoleInfoData && consoleInfoData.data && consoleInfoData.data.PROD_MANAGER}}</div>
          </div>
          <!-- <div style="font-size:20px;font-weight:bold;" v-if=" consoleInfoData && consoleInfoData.data && consoleInfoData.data.AUDIT_OPINION">应用运维部审批意见:{{consoleInfoData.data.AUDIT_OPINION}}</div> -->
          <el-form :model="consoleData" label-width="80px" v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_SUBMIT && (consoleInfoData.data.STATUS == '7' || consoleInfoData.data.STATUS == '1') || maxShow">
            <el-row>
              <el-col :span="24">
                <el-form-item label="变更类型">
                  <el-radio v-model="consoleData.CHANGE_TYPE" :label="0">常规</el-radio>
                  <el-radio v-model="consoleData.CHANGE_TYPE" :label="1">紧急</el-radio>
                  <el-input v-if="consoleData.CHANGE_TYPE==1" size="mini" v-model="consoleData.URGENT_DESC" placeholder="请填写加急原因"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="变更原因">
                  <el-input size="mini" v-model="consoleData.CHANGE_REASON" placeholder="请输入变更原因"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="变更对象">
                  <MyCheckboxComp
                    v-if="consoleInfoData.changeObjectSelect.length"
                    :selectData="consoleData.CHANGE_OBJECT_ID"
                    :inputData="consoleData.OPER_TYPE_REMARK"
                    :config="['CHANGE_OBJECT_ID', 'CHANGE_OBJECT_REMARK']"
                    @updateData="updateData"
                    :itemList="consoleInfoData.changeObjectSelect">
                  </MyCheckboxComp>
                  <el-row class="subItem" v-for="(item, index) in consoleData.changeSystemJson" :key="index">
                    <!-- <el-col
                      v-for="myitem in [{name: '系统名称', mykey: 'SYSTEM_NAME'}, {name: 'IP地址', mykey: 'IP_ADDRESS'}, {name: '系统用户', mykey: 'SYSTEM_USER'}]"
                      :span="7"
                      :key="myitem.name">
                      <el-form-item :label="myitem.name">
                        <el-input size="mini" v-model="consoleData.changeSystemJson[index][myitem.mykey]" :placeholder="`请输入${myitem.name}`"></el-input>
                      </el-form-item>
                    </el-col> -->
                    <el-col
                      v-for="myitem in [{name: '系统名称', mykey: 'SYSTEM_NAME'}]"
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
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="操作类型">
                  <MyCheckboxComp
                    v-if="consoleInfoData.operTypeSelect.length"
                    :selectData="consoleData.OPER_TYPE_ID"
                    :inputData="consoleData.OPER_TYPE_REMARK"
                    :config="['OPER_TYPE_ID', 'OPER_TYPE_REMARK']"
                    @updateData="updateData"
                    :itemList="consoleInfoData.operTypeSelect">
                  </MyCheckboxComp>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="变更概述">
                  <el-input
                    size="mini"
                    v-model="consoleData.CHANGE_DESC"
                    :rows="2"
                    placeholder="请输入变更概述"
                    type="textarea">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="业务影响">
                  <MyCheckboxComp
                    v-if="consoleInfoData.businessEffectSelect.length"
                    :selectData="consoleData.BUSINESS_EFFECT_ID"
                    :inputData="consoleData.BUSINESS_EFFECT_REMARK"
                    :config="['BUSINESS_EFFECT_ID', 'BUSINESS_EFFECT_REMARK']"
                    @updateData="updateData"
                    :itemList="consoleInfoData.businessEffectSelect">
                  </MyCheckboxComp>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="风险控制">
                  <el-row class="subItem">
                    <el-col :span="20">
                      <el-form-item label="风险等级:">
                        <el-radio-group v-model="consoleData.RISK_ID">
                          <el-radio
                            v-for="item in consoleInfoData.riskSelect"
                            :key="item.id"
                            :label="parseInt(item.id)">
                            {{item.name}}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item
                        v-for="item in [{name: '风险说明', mykey: 'RISK_REMARK'}, {name: '风险内容', mykey: 'RISK_CONTENT'}, {name: '控制措施', mykey: 'RISK_SOLUTION'}]"
                        :key="item.mykey"
                        :label="`${item.name}:`">
                        <el-input
                          size="mini"
                          :placeholder="`请输入${item.name}`"
                          v-model="consoleData[item.mykey]">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="变更测试结果">
                  <el-row class="subItemLong">
                    <el-col
                      v-for="item in [{name: '是否功能达到预期目标:', mykey: 'IS_EXPECT_TARGET'}, {name: '是否对原有功能无影响:', mykey: 'IS_INHERE_FUNC'}, {name: '是否测试与生成环境一致:', mykey: 'IS_DEV_TEST_EQ'}]"
                      :key="item.mykey"
                      :span="24">
                      <el-form-item :label="item.name">
                        <el-radio-group v-model="consoleData[item.mykey]">
                          <el-radio :label="0">否</el-radio>
                          <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="说明:">
                        <el-input size="mini" v-model="consoleData.CHANGE_TEST_REMARK"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="变更支持">
                  <el-row class="subItem">
                    <el-col :span="20">
                      <el-form-item label="支持部门:">
                        <el-checkbox-group v-model="consoleData.CHANGE_SUPPORT_ID">
                          <el-checkbox
                            :label="parseInt(item.id)"
                            v-for="item in consoleInfoData.changeSupport"
                            :key="item.id">
                            {{item.name}}
                          </el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="支持内容:">
                        <el-input size="mini" v-model="consoleData.CHANGE_SUPPORT_CONTENT"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div
            v-for="(data, index) in [consoleTableAdd.data, consoleInfoData.infos]"
            v-if="(index === 0 && consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_SUBMIT && (consoleInfoData.systems.length > 0 || consoleInfoData.buttons.UPDATE)) || index === 1 || maxShow"
            :key="index">
            <div class="subTablesTitle">
              {{['选择提交系统', '已经提交系统'][index]}}
              <el-button
                style="float: right; margin-bottom: 8px"
                type="primary"
                size="mini"
                v-if="index === 0"
                :disabled="consoleInfoData.systemsInfo && consoleInfoData.systemsInfo.length === 0? true: false"
                @click="consoleTableAddClick">
                添加
              </el-button>
            </div>
            <el-table
              tooltip-effect="dark"
              style="width: 100%"
              border
              highlight-current-row
              :data="data">
              <el-table-column
                v-for="item in consoleTableConfig"
                v-if="item.prop"
                :key="item.prop"
                :prop="item.prop"
                :width="item.width"
                :label="item.label">
              </el-table-column>
              <!-- <el-table-column
                v-if="index === 1"
                width="160"
                label="附件">
                <template slot-scope="scope">
                  <div style="color: #409EFF;" @click="downloadAtt(scope.row.ATTACHMENT_ID)">{{scope.row.ATT_NAME}}</div>
                </template>
              </el-table-column> -->
              <el-table-column
                v-if="index === 1"
                width="160"
                label="附件">
                <template slot-scope="scope">
                  <el-button size="mini" @click="showDownload(scope.row)" type="primary">点击查看附件</el-button>
                </template>
              </el-table-column>
              <el-table-column
                width="160"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <div v-if="index === 0 && consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_SUBMIT || (maxShow && index === 0) || (consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_SUBMIT && (consoleInfoData.data.STATUS == '7' || consoleInfoData.data.STATUS == '1'))">
                    <el-button v-if="scope.row.STATUS!==5" size="mini" @click="handerClickOther(scope, 'edit')" type="primary">编辑</el-button>
                    <el-button v-if="index === 0" size="mini" @click="handerClickOther(scope, 'delete')" type="primary">删除</el-button>
                  </div>
                  <div v-if="index === 1">
                    <el-button size="mini" type="primary" disabled
                      v-if="consoleInfoData && consoleInfoData.buttons && consoleInfoData.buttons.UPDATE">
                      被驳回
                    </el-button>
                    <el-button size="mini" type="primary"
                      @click="handleSureOnline(scope)"
                      v-if="scope.row.BUTTONS && scope.row.BUTTONS.MANAGER_CONFIRM">
                      确认上线
                    </el-button>
                    <el-button size="mini" type="primary"
                      :disabled="maxShow? true: false"
                      @click="handerClickOther(scope, 'reOnline')"
                      v-if="scope.row.BUTTONS && scope.row.BUTTONS.RE_ONLINE">
                      重新申请
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="activeRowData && activeRowData.buttons && activeRowData.buttons.MANAGER_CONFIRM">
              <el-form
                :inline="true"
                :label-position="left"
                v-if="onlineSystemJsonDisabled"
                v-for="(item,index) in onlineSystemJsonDisabled"
                :span="12"
                :key="index">
                <el-form-item label="系统名称:">
                  <span>{{item.system_NAME}}</span>
                </el-form-item>
                <el-form-item  label="ip地址:">
                  <el-input size="medium " v-model="item.ip_ADDRESS" disabled="" placeholder="请输入ip地址"></el-input>
                </el-form-item>
                <el-form-item label="系统用户:">
                  <el-input size="medium " v-model="item.system_USER" disabled="" placeholder="请输入系统用户"></el-input>
                </el-form-item>
              </el-form>
            <el-form
                :inline="true"
                v-if="onlineSystemJson"
                v-for="(item,index) in onlineSystemJson"
                :span="12"
                :key="index">
                <el-form-item label="系统名称:">
                  <div>{{item.system_NAME}}</div>
                </el-form-item>
                <el-form-item label="ip地址:">
                  <el-input wid clearable="" size="medium " v-model="item.ip_ADDRESS" placeholder="请输入ip地址"></el-input>
                </el-form-item>
                <el-form-item label="系统用户:">
                  <el-input clearable="" size="medium " v-model="item.system_USER" placeholder="请输入系统用户"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align:center;" v-if="onlineSystemJson.length>0">
              <el-button size="mini"  type="primary" @click="onSubmitSystem">提交系统信息</el-button>
            </div>
          </div>
          <div class="handlerBtn">
            <!-- <el-col :span="12" v-if="assignList.length > 0"> -->
              <div v-if="assignList.length > 0" style="margin-right:15px;">已分配人员</div>
              <!-- <el-form-item label="已分配人员"> -->
                <el-button
                  type="text"
                  v-for="(item, index) in assignList"
                  :key="item"
                  >
                  {{item.split('-')[1]}}
                  <i class="el-icon-close el-icon--right" @click="assignList.splice(index, 1)"> </i>
                </el-button>
              <!-- </el-form-item> -->
            <!-- </el-col> -->
            <!-- <el-button size="mini" type="primary"
              @click="assignOperation"
              v-if="consoleInfoData.data && consoleInfoData.data.STATUS=='12'">
              分配
            </el-button> -->
            <div style="color:red;" v-if=" consoleInfoData && consoleInfoData.data && consoleInfoData.data.AUDIT_OPINION">应用运维部审批意见:{{consoleInfoData.data.AUDIT_OPINION}}</div>
            <el-input clearable v-model="audit_opinion" style="width:200px;margin-right:10px;" size="mini" placeholder="请输入审批意见(选填)" v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_AUDIT && consoleInfoData.data.STATUS=='18'"></el-input>
            <el-button size="mini" type="primary"
              @click="assignOperation"
              v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_AUDIT && consoleInfoData.data.STATUS=='18'">
              分配
            </el-button>
            <el-button size="mini" type="primary"
              @click="handerClick({row: {}}, 'ONLINE_AUDIT', 1)"
              v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_AUDIT">
              通过
            </el-button>
            <el-button size="mini" type="primary"
              @click="handerClickOther({row: {}}, 'ONLINE_AUDIT')"
              v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_AUDIT">
              驳回
            </el-button>
            <el-button size="mini" type="primary"
              @click="handerClickOther({row: {}}, 'reOnline')"
              v-if="consoleInfoData.buttons && consoleInfoData.buttons.ONLINE_AUDI">
              {{scope.row.BUTTONS.RE_ONLINE}}
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="全程跟踪" name="log">
          <div class="status-box">
            <div>状态: {{consoleInfoData && consoleInfoData.data && consoleInfoData.data.STATUS_NAME}}</div>
            <div v-if="consoleInfoData.checkUser!=='生产验收通过'">下一步: {{consoleInfoData && consoleInfoData.data && consoleInfoData.checkUser}}</div>
            <div v-if="consoleInfoData && consoleInfoData.data && consoleInfoData.confirm_name.length>0">运维操作人员: <span v-for="(item,index) in consoleInfoData.confirm_name" :key="index">{{item}}|</span></div>
            <div>发送人: {{consoleInfoData && consoleInfoData.data && consoleInfoData.data.PROD_MANAGER}}</div>
            <el-button size="mini" type="primary" @click="trackingvisiible = !trackingvisiible">
              {{trackingvisiible?'列表模式':'视图模式'}}
            </el-button>
          </div>
          <el-row>
            <el-col :span="24" :sm="24" v-show="!trackingvisiible">
              <p :key="index" v-for="(item,index) in tracking.data" class="genzong">
                <span v-if="item.view_DESC[0] != ''">
                <span style="display: inline-block;width: 30px">{{index+1}}.</span>
                <span>{{item.view_DATE}}</span>
                <span  v-html="$options.filters.replace(item.view_DESC[0])"></span>
                </span>
              </p>
            </el-col>
            <el-col :span="24" :sm="24" v-show="trackingvisiible">
              <tracking :tracking="tracking"></tracking>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--分配-->
    <SelectUser
      v-if="assignvisible"
      :panelVisible.sync='assignvisible'
      :panelTip='panelTip'
      :myurl='myurl'
      v-on:message='subAssign'
    ></SelectUser>
    <el-dialog
      :close-on-click-modal="false"
      title="添加"
      append-to-body
      class="consoleTableAdd"
      :visible.sync="consoleTableAddShow">
      <el-form :model="consoleTableAdd.inputData" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="系统及子系统:">
              <el-cascader
                @change="HandlechangeSystem"
                v-if="consoleTableAdd.type === 'added'"
                v-model="consoleTableAdd.inputData.SYSTEM_DATA"
                :options="consoleInfoData.systemsInfo"
                style="width: 100%"
              ></el-cascader>
              <el-input
                v-if="consoleTableAdd.type === 'edit'"
                :placeholder="`${consoleTableAdd.inputData.SYSTEM_NAME} / ${consoleTableAdd.inputData.SUB_SYSTEM_NAME}`"
                :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="预计上线时间:">
              <el-date-picker
                v-model="consoleTableAdd.inputData.EXPECT_ONLINE_TIME"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col
            v-for="item in [{name: '上线模块', mykey: 'MODULE'}, {name: '上线内容', mykey: 'CONTENT'}]"
            :key="item.mykey"
            :span="24">
            <el-form-item
              :label="`${item.name}:`">
              <el-input
                :placeholder="`请输入${item.name}`"
                v-model="consoleTableAdd.inputData[item.mykey]">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-for="item in [['项目负责人', 'PROJECT_MANAGER_DATA'], ['产品负责人', 'PROD_MANAGER_DATA'], ['开发负责人', 'DEV_MANAGER_DATA'], ['测试负责人', 'TEST_MANAGER_DATA']]"
            :key="item[1]">
            <el-form-item :label="`${item[0]}:`">
              <el-select
                v-model="consoleTableAdd.inputData[item[1]]"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="user in consoleInfoData.allUser"
                  :key="user.user_ID"
                  :label="user.user_NAME"
                  :value="`${user.user_ID}-${user.user_NAME}`">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否暂停交易:">
              <el-radio v-model="consoleTableAdd.inputData.IS_TRADE" :label="0">是</el-radio>
              <el-radio v-model="consoleTableAdd.inputData.IS_TRADE" :label="1">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响时间(分钟):">
              <el-input-number v-model="consoleTableAdd.inputData.EFFECT_TIME" controls-position="right" :min="1">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="consoleTableAdd.uploadFiles.length>0">
            <el-form-item label="已上传附件:">
              <div @click="downloadAtt(item.id)" title="点击可下载" style="cursor:pointer;font-size:14px;color:blue;" v-for="(item,index) in consoleTableAdd.uploadFiles" :key="index">{{item.name}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传附件:">
              <!-- <el-upload
                :limit="1"
                :action="`${baseUrl}/online/upload?token=${$getToken()}`"
                :on-success="uploadFileSuccess"
                auto-upload
                :on-preview="uploadFileClick"
                :on-exceed="uploadFileOut"
                :on-remove="uploadClear"
                :file-list="consoleTableAdd.fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload> -->
              <el-button @click="startUpload('上传附件')" size="small" type="primary">点击上传</el-button>
              <template>
                <div style="color:red;">若开发已上传此处可不传</div>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="consoleTableAddShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="consoleTableAddOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="上线确认"
      append-to-body
      class="consoleTableAdd"
      :visible.sync="consoleOnline.visible">
      <el-form :model="consoleOnline.inputData" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="发布负责人:">
              <el-select
                style="width: 100%"
                v-model="consoleOnline.inputData.releaseManagerData"
                filterable
                clearable
                placeholder="请输入">
                <el-option
                  v-for="user in consoleInfoData.allUser"
                  :key="user.user_ID"
                  :label="user.user_NAME"
                  :value="`${user.user_ID}-${user.user_NAME}`">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col
          v-if="onlineSystemJsonDisabled"
            v-for="(item,index) in onlineSystemJsonDisabled"
            :span="12"
            :key="index">
            <el-form-item label="系统名称:">
              <div>{{item.system_NAME}}</div>
            </el-form-item>
            <el-col>
            <el-form-item  label="ip地址:">
              <el-input size="mini" v-model="item.ip_ADDRESS" disabled="" placeholder="请输入ip地址"></el-input>
            </el-form-item>
            <el-form-item label="系统用户:">
              <el-input size="mini" v-model="item.system_USER" disabled="" placeholder="请输入系统用户"></el-input>
            </el-form-item>
            </el-col>
          </el-col>
          <el-col
          v-if="onlineSystemJson"
            v-for="(item,index) in onlineSystemJson"
            :span="12"
            :key="index">
            <el-form-item label="系统名称:">
              <div>{{item.system_NAME}}</div>
            </el-form-item>
            <el-col>
            <el-form-item  label="ip地址:">
              <el-input size="mini" v-model="item.ip_ADDRESS" placeholder="请输入ip地址"></el-input>
            </el-form-item>
            <el-form-item label="系统用户:">
              <el-input size="mini" v-model="item.system_USER" placeholder="请输入系统用户"></el-input>
            </el-form-item>
            </el-col>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="上线结果:" style="height: 42px">
              <el-radio v-model="consoleOnline.inputData.onlineResult" label="1">成功</el-radio>
              <el-radio v-model="consoleOnline.inputData.onlineResult" label="0">失败</el-radio>
              <el-radio v-model="consoleOnline.inputData.onlineResult" label="2">未上线</el-radio>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="操作日期时间:">
              <el-date-picker
                :picker-options='filterDate'
                v-model="consoleOnline.inputData.releaseOperTime"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="实际上线时间:">
              <el-date-picker
                :picker-options='filterDate'
                v-model="consoleOnline.inputData.realOnlineTime"
                type="datetime"
                style="width: 100%"
                :disabled="consoleOnline.inputData.onlineResult === '1'? false: true"
                placeholder="当上线结果为成功时选择">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作说明:">
              <el-input type="textarea" v-model="consoleOnline.inputData.releaseOperRemark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="consoleOnline.visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handerClick(undefined, 'MANAGER_CONFIRM', 2)">确 定</el-button>
      </span>
    </el-dialog>
    <download :download="download"></download>
    <upload :data="uploadAction"></upload>
  </div>
</template>
<style lang="less">
@import './TableConsole.less';
</style>
<script>
  import moment from 'moment';
  import MyCheckboxComp from './MyCheckboxComp.vue'
  import cloneDeep from 'lodash/cloneDeep';
  import { onlineTip } from './tipMap';
  import SelectUser from './SelectUser.vue';
  import tracking from "../needs/common/tracking.vue";//全程跟踪视图模式
  import download from "../needs/common/download.vue";//下载组件
  import upload from "../needs/common/upload.vue";//上传附件组件
  // let view_Index = 0;
  export default {
    name: 'TableConsole',
    props: ['tracking', 'tableData', 'subTableData', 'consoleInfoData', 'config' ,'viewIndex','homeDisabled','prevDisabled','nextDisabled','endDisabled','showOpen'],
    components: {
      MyCheckboxComp,
      tracking,
      SelectUser,
      download,
      upload
    },
    data() {
      return {
        audit_opinion:'',//应用运维部审批意见
        download:{
          visible:false,
          data:[],//表格数据
          title:"",//标题
          url:'online',
          id:true
        },
        uploadAction:{
          uploadvisible:false,
          uploadFiles:[],
          fileIds:[],
          type:"",
          neel_id:"",
          SYSTEM_ID:''
        },
        filterDate: {
          disabledDate(time){
            return time.getTime() > Date.now()
          }
        },
        // 运维系统填写
        onlineSystemJson:[],
        onlineSystemJsonDisabled:[],
        userId:'',
        //分配任务
        confirm_id:'',
        confirm_name:'',
        assignvisible: false,
        myurl: '',
        panelTip: {},
        assignList:[],
        ZhuanmenID:'',
        trackingvisiible: false,
        subTables: ['show', 'show'],
        maxShow: false,
        clickType:true,//区分行点击和展开列
        oper: 'add',
        baseUrl: window._options.baseUrl,
        activeRowData: {},
        subActiveRowData: {},
        tableConfig: [
          { label: '上线编号', prop: 'online_ID', width: '210' },
          { label: '需求编号', prop: 'neet_ID' },
          { label: '需求名称', prop: 'neel_NAME' },
          { label: '创建时间', prop: 'createTime' ,width: '160'},
          { label: '产品负责人', prop: 'prod_MANAGER',width: '130' },
          { label: '需求状态', prop: 'show_online_STATUS' },
          { label: '上线节点', prop: 'state_GOLIVE_NAME' },
          { label: '变更类型', prop: 'change_TYPE' },
        ],
        subTableConfig: [
          { label: '版本ID', prop: 'VERSION_ID' },
          { label: '涉及系统', prop: 'SYSTEM_NAME' },
          { label: '子系统', prop: 'SYSTEMSON_NAME' },
          { label: '版本', prop: 'BAN' },
        ],
        consoleTableAddShow: false,
        consoleTableConfig: [
          { label: '涉及系统', prop: 'SYSTEM_NAME' },
          { label: '子系统', prop: 'SUB_SYSTEM_NAME' },
          { label: '状态', prop: 'STATUS_NAME' },
          { label: '预计上线时间', prop: 'EXPECT_ONLINE_TIME', width: 155 },
          { label: '影响时间(分钟)', prop: 'EFFECT_TIME', width: 115 },
          { label: '项目负责人', prop: 'PROJECT_MANAGER', width: 95 },
          { label: '产品负责人', prop: 'PROD_MANAGER', width: 95 },
          { label: '开发负责人', prop: 'DEV_MANAGER', width: 95 },
          { label: '测试负责人', prop: 'TEST_MANAGER', width: 95 },
        ],
        consoleInfoConfig: [
          { label: '变更类型', prop: 'SHOW_CHANGE_TYPE' },
          { label: '紧急原因', prop: 'URGENT_DESC' },
          { label: '需求名称', prop: 'NEEL_NAME' },
          { label: '需求编号', prop: 'NEED_ID' },
          { label: '需求状态', prop: 'SHOW_ONLINE_STATUS' },
          { label: '上线编号', prop: 'ONLINE_ID' },
          { label: '产品负责人', prop: 'PROD_MANAGER' },
          { label: '变更原因', prop: 'CHANGE_REASON' },
          { label: '变更对象', prop: 'SHOW_CHANGE_OBJECT_ID', width: 24 },
          { label: '', prop: 'SHOW_CHANGE_SYSTEM', width: 24 },
          { label: '操作类型', prop: 'SHOW_OPER_TYPE_ID', width: 24 },
          { label: '变更概述', prop: 'CHANGE_DESC', width: 24 },
          { label: '业务影响', prop: 'SHOW_BUSINESS_EFFECT_ID', width: 24 },
          { label: '风险控制', prop: 'SHOW_RISK', width: 24 },
          { label: '', prop: 'SHOW_RISK_REMARK', width: 24 },
          { label: '', prop: 'SHOW_RISK_CONTENT', width: 24 },
          { label: '', prop: 'SHOW_RISK_SOLUTION', width: 24 },
          { label: '变更测试结果', prop: 'SHOW_IS_EXPECT_TARGET', width: 24 },
          { label: '', prop: 'SHOW_IS_INHERE_FUNC', width: 24 },
          { label: '', prop: 'SHOW_IS_DEV_TEST_EQ', width: 24 },
          { label: '', prop: 'SHOW_CHANGE_TEST_REMARK', width: 24 },
          { label: '变更支持', prop: 'SHOW_CHANGE_SUPPORT_ID', width: 24 },
          { label: '', prop: 'SHOW_CHANGE_SUPPORT_CONTENT', width: 24 },
        ],
        consoleOnline: {
          visible: false,
          inputData: {}
        },
        consoleTableAdd: {
          uploadFiles:[],
          rowNum: undefined,
          type: 'added',
          inputData: {},
          data: [], // 表格数据
          info: {}, // 获取的已知数据, 用于用户选择
          fileList: [],
        },
        tableHandler: [
          { btnLabel: '通过', handleType: 'check', btnType: 'primary', btnSize: 'small' }
        ],
        showPagination: true,
        prevIsLoad: false,
        nextIsLoad: false,
        consoleVisible: true,
        activeTab: 'info',
        baseBlowHeight: '0px',
        baseBlowHeightOrigin: '0px',
        showExpandRowVal: null,
        showExpandRowId: -1,
        consoleData: { },
        tableList:[],
        consoleText:true,
      }
    },
    filters:{
      tablebutton(val){
        if(val.ONLINE_AUDIT || val.MANAGER_CONFIRM){
          // console.log(val);
          return '任务审批'
        }
        if(val.RE_ONLINE || val.ONLINE_SUBMIT){
          // console.log(val);
          return '上线执行'
        }
        if(val.UPDATE){
          // console.log(val);
          return '修改'
        }
      },
      replace(val){
        return val.replace(/,/g,"<br />");
      },
    },
    created() {
      // console.log(this.showOpen)
      // if(this.showOpen){
      //   this.baseBlowHeight = `${452}px`;
      // }
      // this.baseBlowHeight = `${parseInt(this.baseBlowHeight) + 452}px`;
      // this.activeTab = 'console';
      // this.$emit('emitHandle', {type: 'tableRowClick', data: {
      //   online_ID: 'ONLINE2018042639262741',
      //   neet_ID: 'PROD2018042332771916'
      // }});
      this.audit_opinion=this.consoleInfoData.data.AUDIT_OPINION || '';
      this.initData({addDialog: true, consoleData: true});
    },
    updated() {
      if(this.showOpen){
        this.baseBlowHeight = `${452}px`;
        // this.activeTab='console';
      }
      setTimeout(()=>{
        this.showOpen=false;
      },1000)
    },
    computed: {
      filteredItems: function () {
        return this.items.slice(0, 10)
      },
    },
    beforeCreate() {
    },
    methods: {
      // viewAdd(){
      //   view_Index++;
      //   console.log(view_Index);
      //   return this.view_Index
      // },
      // disabledComputed(value){
      //   if(value && value!=='null'){
      //     return true;
      //   }
      // },
      expandText(){
        console.log(123);
      },
      tabsClick(val){
        this.activeTab = 'console';
        this.tableRowClick(val);
      },
      //-----------------------------------分配任务
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
      subAssign(poyload) {
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
      updateData(val){
        this.consoleData[val[0]] = val[1];
      },
      initData({addDialog, consoleData, consoleInfoConfig}){
        if(addDialog){
          this.consoleTableAdd.inputData = {
            EFFECT_TIME: 1,
            IS_TRADE: 1,
            MODULE: '', // 上线模块
            CONTENT: '', // 上线内容
            SYSTEM_DATA: [],
            PROJECT_MANAGER_DATA: '',
            PROD_MANAGER_DATA: '',
            DEV_MANAGER_DATA: '',
            TEST_MANAGER_DATA: '',
            EXPECT_ONLINE_TIME: '',
          }
          this.consoleTableAdd.fileList = [];
        }
        if(consoleData){
          this.consoleData = {
            CHANGE_TYPE: 0, // 变更类型
            CHANGE_REASON: '', // 变更原因
            CHANGE_OBJECT_ID: [], // 变更对象
            OPER_TYPE_ID: [], // 操作类型
            CHANGE_DESC: '', // 变更概述
            BUSINESS_EFFECT_ID: [], // 业务影响ID
            RISK_ID: undefined, // 风险控制ID, 35
            IS_EXPECT_TARGET: undefined, // 是否达到预期目标(0:否,1:是)
            IS_INHERE_FUNC: undefined, // 是否对原有功能无影响(0:否,1:是)
            IS_DEV_TEST_EQ: undefined, // 是否测试环境与生产环境一致(0:否,1:是)
            CHANGE_TEST_REMARK: '', // 变更测试结果说明
            CHANGE_SUPPORT_ID: [], // 变更支持ID
            CHANGE_SUPPORT_CONTENT: '', // 变更支持内容
            RISK_REMARK: '', // 风险说明
            RISK_CONTENT: '', // 风险内容
            RISK_SOLUTION: '', // 控制措施
            OPER_TYPE_REMARK: '', // 操作类型其它输入框
            BUSINESS_EFFECT_REMARK: '', // 业务影响其它输入框
            CHANGE_OBJECT_REMARK: '', // 变更对象其它输入框
            changeSystemJson: [{
              SYSTEM_NAME: '',
              IP_ADDRESS: '',
              SYSTEM_USER: ''
            }],
          }
        }
        if(consoleInfoConfig && this.consoleInfoData.data){
          this.consoleInfoConfig.forEach(item => this.consoleInfoData.data[item.prop] = '');
        }
      },
      handerClickOther(scope, type){
        // 其他类型按钮事件
        console.log(scope);
        this.subSystemId=scope.row.SUB_SYSTEM_ID;
        if(type === 'ONLINE_AUDIT'){
          // 驳回
          this.$prompt('请输入驳回理由', '提示', {
            confirmButtonText: '提交',
            inputValidator: (value) => {
              if(value.trim() === '')return '驳回原因不能为空';
            }
          }).then(({ value }) => {
            scope.row.rejectReason = value;
            this.handerClick(scope, type, 0);
          }).catch(() => {
          });
        }else if(type === 'edit'){
          // 编辑
          this.consoleTableAdd.type = 'edit';
          this.consoleTableAdd.rowNum = scope.$index;
          console.log(scope.row);
          this.ZhuanmenID = scope.row.ID;
          console.log(this.ZhuanmenID);

          console.log(this.consoleTableAdd.rowNum);
          this.consoleTableAdd.inputData.SYSTEM_DATA = [
            `${scope.row.SYSTEM_ID}-${scope.row.SYSTEM_NAME}`,
            `${scope.row.SUB_SYSTEM_ID}-${scope.row.SUB_SYSTEM_NAME}-${scope.row.VERSION_ID}-${scope.row.BAN}`
          ];

          console.log(this.consoleTableAdd.inputData.SYSTEM_DATA);

          [this.consoleTableAdd.inputData.SYSTEM_NAME, this.consoleTableAdd.inputData.SUB_SYSTEM_NAME] = [scope.row.SYSTEM_NAME, scope.row.SUB_SYSTEM_NAME];

          ['PROJECT_MANAGER', 'PROD_MANAGER', 'DEV_MANAGER', 'TEST_MANAGER'].forEach(key => this.consoleTableAdd.inputData[`${key}_DATA`] = `${scope.row[key + '_ID']}-${scope.row[key]}`);

          this.consoleTableAdd.inputData.EXPECT_ONLINE_TIME = new Date(scope.row.EXPECT_ONLINE_TIME);

          ['IS_TRADE', 'EFFECT_TIME', 'MODULE', 'CONTENT'].forEach(key => this.consoleTableAdd.inputData[key] = scope.row[key]);
          this.consoleTableAdd.inputData.ID = this.ZhuanmenID;
          if(scope.row.ATTACHMENT_ID && (scope.row.ATT_NAME || scope.row.ATTACHMENT_NAME)){
            this.consoleTableAdd.fileList = [{
              id: scope.row.ATTACHMENT_ID,
              name: scope.row.ATTACHMENT_NAME || scope.row.ATT_NAME,
              url: `${window._options.baseUrl}/online/download?token=${this.$getToken()}&id=${scope.row.ATTACHMENT_ID}`
            }];
          }else{
            this.consoleTableAdd.fileList=[];
          }
          console.log(this.consoleTableAdd.fileList);
          this.consoleTableAddShow = true;
          console.log(this.consoleTableAdd);
        }else if(type === 'reOnline'){
          // 重新上线
          //this.consoleTableAdd.data = this.consoleInfoData.infos;
          //this.consoleData.changeSystemJson = this.consoleInfoData.changeSystem;
          //this.consoleInfoData.infos = [];
          //this.consoleTableAdd.fileList = [];
          //this.consoleTableAdd.data.forEach(item => this.consoleTableAdd.fileList.push({
          //  name: item.ATT_NAME,
          //  id: item.ATTACHMENT_ID,
          //  url: `${window._options.baseUrl}/online/download?token=${this.$getToken()}&id=${item.ATTACHMENT_ID}`
          //}));
          this.consoleTableAdd.data = [scope.row];
          this.setConsoleData(this.consoleInfoData.data, this.consoleInfoData.changeSystem);
          this.maxShow = true;
          console.log(this.consoleTableAdd);
          console.log(this.consoleInfoData.data);
          // this.$root.reload();
        }else if(type === 'delete'){
          // 删除
          this.consoleTableAdd.data.splice(scope.$index, 1);
          this.handlerSystemsInfo('delete', scope);
          // this.consoleTableAdd.type = 'added';
          this.consoleTableAdd.rowNum = undefined;
        }
      },
      handerClick(scope, type, info){
        // 表格操作按钮点击事件
        if(type === 'MANAGER_CONFIRM'){
          let notHaveBit = false;
          onlineTip.onlineConfirmKeys.some(key => {
            if(this.consoleOnline.inputData[key] === undefined){
              this.$message.warning(`${onlineTip.onlineConfirm[key]? onlineTip.onlineConfirm[key]: '数据'}不能为空!`);
              notHaveBit = true;
              return true;
            }
          })
          if(this.consoleOnline.inputData.onlineResult === "1" &&
              this.consoleOnline.inputData.realOnlineTime === undefined){
              this.$message.warning(`${onlineTip.onlineConfirmMust.realOnlineTime? onlineTip.onlineConfirmMust.realOnlineTime: '数据'}不能为空!`);
              notHaveBit = true;
          }
          if(notHaveBit)return;
        }
        if(!scope)scope = this.subActiveRowData;
        let params = new URLSearchParams();
        let paramsData = {
          infoId: scope.row.ID || '',
          versionId: scope.row.VERSION_ID || '',
          needId: scope.row.NEED_ID || '',
          oper: info,
          onlineId: scope.row.ONLINE_ID,
        }
        // params.append("infoId", paramsData.infoId);
        // params.append("versionId", paramsData.versionId);
        // params.append("needId", paramsData.needId);
        // params.append("oper", paramsData.oper);
        // params.append("onlineId", paramsData.onlineId);
        if(type === 'ONLINE_AUDIT'){
          if(info!==0 && this.assignList.length == 0 && this.consoleInfoData.data.STATUS=='18'){
            // console.log(info)
            return this.$warn('请分配人员');
          }
          paramsData.changeType = scope.row.STATUS || '';
          if(this.consoleInfoData.confirm_name && this.consoleInfoData.confirm_id){
            paramsData.confirm_id = this.consoleInfoData.confirm_id;
            paramsData.confirm_name = this.consoleInfoData.confirm_name;
          }else{
            paramsData.confirm_id = this.confirm_id;
            paramsData.confirm_name = this.confirm_name;
          }
          if(info!==0){
             paramsData.audit_opinion=this.audit_opinion;
          }
          // params.append("changeType", scope.row.STATUS);
          // params.append("confirm_id", this.confirm_id);
          // params.append("confirm_name", this.confirm_name);
          // params.append("changeType", paramsData.changeType);
          if(info === 0)paramsData.rejectReason = scope.row.rejectReason;
          // if(info === 0) params.append("rejectReason", scope.row.rejectReason);
          // {ONLINE_ID: paramsData.onlineId, CHANGE_TYPE: paramsData.changeType, NEED_ID: paramsData.needId} = {...this.consoleInfoData.data};
          [['ONLINE_ID', 'onlineId'], ['CHANGE_TYPE', 'changeType'], ['NEED_ID', 'needId']].forEach(item => paramsData[item[1]] = this.consoleInfoData.data[item[0]]);
          paramsData.versionId = Array.from(this.consoleInfoData.infos, item => item.VERSION_ID).join(',');
          // console.log(paramsData.onlineId)
          // params.append("onlineId", paramsData.onlineId);
          // params.append("changeType", paramsData.changeType);
          // params.append("needId", paramsData.needId);
          // params.append("versionId", paramsData.versionId);
        }else if(type == 'MANAGER_CONFIRM'){
          paramsData = Object.assign(paramsData, cloneDeep(this.consoleOnline.inputData));
          // let str='';
          // let newArr=[];
          // newArr=this.onlineSystemJsonDisabled.concat(this.onlineSystemJson);
          // newArr.forEach(item=>{
          //   str+=`${item.id}##${item.ip_ADDRESS}##${item.system_USER}##${this.userId}__`
          // })
          // paramsData.onlineSystemJson = str;
          ['releaseOperTime', 'realOnlineTime'].forEach(key => paramsData[key] = moment(paramsData[key]).format("YYYY-MM-DD HH:mm:ss"));
          [paramsData.releaseManagerId, paramsData.releaseManager] = paramsData.releaseManagerData.split('-');
          delete paramsData.releaseManagerData;
          // params.append("releaseManagerId", paramsData.releaseManagerId);
          // params.append("releaseManager", paramsData.releaseManager);
          // params.append("onlineResult", paramsData.onlineResult);
          // params.append("releaseOperTime", paramsData.releaseOperTime);
          // params.append("realOnlineTime", paramsData.realOnlineTime);
          // params.append("releaseOperRemak", paramsData.releaseOperRemak);
          this.consoleOnline.inputData = {};
        }
        console.log(paramsData);
        console.log(params);
        this.$maskin();
        this.$axios.post("/online/audit", new URLSearchParams(`?${Array.from(Object.entries(paramsData), item => `${item[0]}=${item[1]}`).join('&')}`)).then((res) => {
          if(res.data && res.data.code == 200){
            // this.tableRowClick(this.activeRowData);
            this.$success(res.data.message);
            this.consoleOnline.visible = false;
            this.$maskoff;
            this.assignList=[];
            this.closeAndRefresh();
          }
        });
        // this.$axios.post("/online/audit",params).then((res) => {
        //   if(res.data && res.data.code == 200){
        //     // this.tableRowClick(this.activeRowData);
        //     this.consoleOnline.visible = false;
        //     this.assignList=[];
        //     this.closeAndRefresh();
        //   }
        // });
      },
      uploadFileSuccess(res){
        // 上传附件
        if(res.code === 200 && res.result.code === 200){
          this.consoleTableAdd.fileList.push({
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
        this.consoleTableAdd.fileList=[];
      },
      consoleTableAddOk(){
        // 添加模态框确定按钮点击事件
        if(this.consoleTableAdd.type == 'edit'){
          // console.log(1);
        }
        // console.log(this.consoleTableAdd.data);

        let notHaveBit = false;
        let ID = this.consoleTableAdd.data;
        // console.log(onlineTip.addedInputKeys);
        onlineTip.addedInputKeys.some(key => {
          //表单数据验证
          // if(this.consoleTableAdd.inputData[key] instanceof Array || key === 'ATTACHMENT_ID'){
          //   if((key === 'ATTACHMENT_ID' && this.consoleTableAdd.fileList.length === 0) ||
          //      (key === 'SYSTEM_DATA' && this.consoleTableAdd.inputData.SYSTEM_DATA.length === 0)){
          //     notHaveBit = true;
          //   }
          // }else if(this.consoleTableAdd.inputData[key] === ''){
          //   notHaveBit = true;
          // }
          if(this.consoleTableAdd.inputData[key] instanceof Array){
            if(key === 'SYSTEM_DATA' && this.consoleTableAdd.inputData.SYSTEM_DATA.length === 0){
              notHaveBit = true;
            }
          }else if(this.consoleTableAdd.inputData[key] === ''){
            notHaveBit = true;
          }
          // if(this.consoleTableAdd.inputData[key] === ''){
          //   notHaveBit = true;
          // }
          if(notHaveBit){
            this.$message.warning(`${onlineTip.addedInput[key]? onlineTip.addedInput[key]: '数据'}不能为空!`);
            return true;
          }
        });
        if(notHaveBit)return;
        [this.consoleTableAdd.inputData.SYSTEM_ID, this.consoleTableAdd.inputData.SYSTEM_NAME] = this.consoleTableAdd.inputData.SYSTEM_DATA[0].split('-');
        [this.consoleTableAdd.inputData.SUB_SYSTEM_ID, this.consoleTableAdd.inputData.SUB_SYSTEM_NAME, this.consoleTableAdd.inputData.VERSION_ID, this.consoleTableAdd.inputData.BAN] = this.consoleTableAdd.inputData.SYSTEM_DATA[1].split('-');
        [this.consoleTableAdd.inputData.PROJECT_MANAGER_ID, this.consoleTableAdd.inputData.PROJECT_MANAGER] = this.consoleTableAdd.inputData.PROJECT_MANAGER_DATA.split('-');
        [this.consoleTableAdd.inputData.PROD_MANAGER_ID, this.consoleTableAdd.inputData.PROD_MANAGER] = this.consoleTableAdd.inputData.PROD_MANAGER_DATA.split('-');
        [this.consoleTableAdd.inputData.DEV_MANAGER_ID, this.consoleTableAdd.inputData.DEV_MANAGER] = this.consoleTableAdd.inputData.DEV_MANAGER_DATA.split('-');
        [this.consoleTableAdd.inputData.TEST_MANAGER_ID, this.consoleTableAdd.inputData.TEST_MANAGER] = this.consoleTableAdd.inputData.TEST_MANAGER_DATA.split('-');
        this.consoleTableAdd.inputData.EXPECT_ONLINE_TIME = moment(this.consoleTableAdd.inputData.EXPECT_ONLINE_TIME).format("YYYY-MM-DD HH:mm:ss");
        console.log(this.consoleTableAdd.fileList)
        this.consoleTableAdd.inputData.ATTACHMENT_ID = this.consoleTableAdd.fileList.length>0?this.consoleTableAdd.fileList[0].id:'';
        this.consoleTableAdd.inputData.ATTACHMENT_NAME = this.consoleTableAdd.fileList.length>0?this.consoleTableAdd.fileList[0].name:'';
        this.handlerSystemsInfo('added');
        console.log(this.consoleInfoData);
        console.log(this.consoleTableAdd.type);
        if(this.consoleTableAdd.type === 'edit'){
          let dataTemp = cloneDeep(this.consoleTableAdd.data);
          console.log(dataTemp);
          console.log(this.consoleTableAdd.inputData);
          dataTemp[this.consoleTableAdd.rowNum] = this.consoleTableAdd.inputData;
          this.$set(this.consoleTableAdd, 'data', dataTemp);
        }else{
          this.consoleTableAdd.data.push(this.consoleTableAdd.inputData);
        }
        this.initData({addDialog: true});
        this.consoleTableAddShow = false;
        // this.consoleTableAdd.type = 'added';
        this.consoleTableAdd.rowNum = undefined;
        this.consoleTableAdd.data.ID = this.ZhuanmenID;
        console.log(this.consoleTableAdd.type);
        console.log(this.consoleTableAdd);
        console.log(this.consoleInfoData);
      },
      handlerSystemsInfo(type, scope=undefined){
        // 系统及子系统的动态处理, 当type为added时删除对应系统, 当type为delete时对应系统还原到系统对应表中
        let sys_index = undefined, subsys_index = undefined, sys_val, subsys_val;
        if(type === 'added'){
          [sys_val, subsys_val] = this.consoleTableAdd.inputData.SYSTEM_DATA;
        }else if(type === 'delete'){
          [sys_val, subsys_val] = [`${scope.row.SYSTEM_ID}-${scope.row.SYSTEM_NAME}`, `${scope.row.SUB_SYSTEM_ID}-${scope.row.SUB_SYSTEM_NAME}-${scope.row.VERSION_ID}-${scope.row.BAN}`];
        }
        this.consoleInfoData.systemsInfo.some((item, ii) => {
          if(item.value === sys_val){
            sys_index = ii;
            item.children.some((myitem, jj) => {
              if(myitem.value === subsys_val){
                subsys_index = jj;
                return true;
              }
            })
            return true;
          }
        });
        if(type === 'added'){
          if(sys_index === undefined || subsys_index === undefined){
            console.log('系统对应表中未找到对应系统', 'sys_index, subsys_index: ', sys_index, subsys_index, '系统: ', this.consoleTableAdd.inputData.SYSTEM_DATA, '系统对应表:', this.consoleInfoData.systemsInfo);
          }
          else{
            if(this.consoleInfoData.systemsInfo[sys_index].children.length === 1){
              this.consoleInfoData.systemsInfo.splice(sys_index, 1);
            }else{
              this.consoleInfoData.systemsInfo[sys_index].children.splice(subsys_index, 1);
            }
          }
        }else if(type === 'delete'){
          console.log('这里是删除！测试一下！');
          if(sys_index === undefined){
            this.consoleInfoData.systemsInfo = [{
              label: scope.row.SYSTEM_NAME,
              value: sys_val,
              children: [{
                label: `${scope.row.SUB_SYSTEM_NAME}(${scope.row.BAN})`,
                value: subsys_val
              }]
            }];
          }else{
            this.consoleInfoData.systemsInfo[sys_index].children.push({
              label: `${scope.row.SUB_SYSTEM_NAME}(${scope.row.BAN})`,
              value: subsys_val
            })
          }
        }
      },
      //提交系统信息
      onSubmitSystem(){
        this.$maskin();
        let params = new URLSearchParams();
        let str='';
        let newArr=[];
        newArr=this.onlineSystemJsonDisabled.concat(this.onlineSystemJson);
        newArr.forEach(item=>{
          str+=`${item.id}##${item.ip_ADDRESS}##${item.system_USER}##${this.userId}__`
        })
        // paramsData.onlineSystemJson = str;
        console.log(this.activeRowData)
        params.append("onlineSystemJson", str);
        params.append("onlineId", this.activeRowData.online_ID);
        this.$axios.post("/online/UpdateChangeSystemInfo",params).then((res)=>{
          let data=res.data;
          if(data.code=='200'){
            this.onlineSystemJson=[];
            this.$success(data.message);
            this.$maskoff();
          }
        })
      },
      fetchSystemInfo(val) {
        this.$maskin();
        console.log('scope',val)
        let params = new URLSearchParams();
        params.append("onlineId", val.online_ID);
        this.$axios.post("/online/getOnlineSystemInfo", params).then((res) => {
          let data = res.data;
          // this.onlineSystemJson=data.result;
          let onlineSystemJsonDisabled=[];
          let onlineSystemJson=[];
          data.result.changeSystems.forEach(item=>{
            if(item.ip_ADDRESS=='null' && item.system_USER=='null'){
              console.log('无数据')
              item.ip_ADDRESS='';
              item.system_USER='';
              onlineSystemJsonDisabled.push(item);
            }else if(item.ip_ADDRESS!=='null' && item.system_USER!=='null'){
              console.log('有数据')
              onlineSystemJson.push(item);
            }
          })
          console.log('onlineSystemJsonDisabled',onlineSystemJsonDisabled)
          console.log('onlineSystemJson',onlineSystemJson)
          this.onlineSystemJson=onlineSystemJson;
          this.onlineSystemJsonDisabled=onlineSystemJsonDisabled;
          // let newArr=[];
          // newArr=this.onlineSystemJsonDisabled.concat(this.onlineSystemJson);
          // console.log(newArr)
          this.userId=data.result.userId;
          this.consoleOnline.inputData.releaseManagerData=`${data.result.userId}-${data.result.userName}`
          if (data.code == 200) {
            // this.loadData();
            this.$maskoff();
          }
        })
      },
      // 运维确认上线
      handleSureOnline(scope){
        this.subActiveRowData = scope;
        this.consoleOnline.visible = true;
      },
      consoleTableAddClick(){
        // 清空选择系统时附件问题
        this.$set(this.consoleTableAdd,"uploadFiles",[]);
        // 表格上方右侧添加按钮点击事件
        this.consoleTableAdd.type = 'added';
        this.ZhuanmenID = '';
        console.log(this.consoleTableAdd.type);
        this.initData({addDialog: true});
        this.consoleTableAddShow = true;
      },
      changeObjectClick(index){
        if(index === 0){
          this.consoleData.changeSystemJson.push({ SYSTEM_NAME: '', IP_ADDRESS: '', SYSTEM_USER: '' });
        }else{
          this.consoleData.changeSystemJson.splice(index, 1);
        }
      },
      handlerTab(type){
        console.log(type)
        if(type === 'close'){
          this.baseBlowHeight = this.baseBlowHeightOrigin;
        }else if(type === 'full'){
          if(this.baseBlowHeight === '100%'){
            this.baseBlowHeight = `${parseInt(this.baseBlowHeightOrigin) + 452}px`;
            this.showPagination = true;
          }else{
            this.baseBlowHeight = '100%';
            this.showPagination = false;
          }
        }
      },
      goSubmit(){
        console.log(this.consoleInfoData.data);
        console.log(this.consoleInfoData.infos);
        console.log(this.consoleInfoData.data.STATUS_NAME);
        let entityJson = {ID: this.consoleInfoData.data.ONLINE_ID, NEED_ID: this.consoleInfoData.data.NEED_ID}, json = [];
        //let notHaveBit = false;
        onlineTip.mainKeys.some(key => {
          if(this.consoleData[key] instanceof Array){
            entityJson[key] = this.consoleData[key].join(',')
          }else if(this.consoleData[key] != undefined){
            entityJson[key] = this.consoleData[key]
          }
          //if(entityJson[key] === ''){
          //  notHaveBit = true;
          //  this.$message.warning(`${onlineTip.main[key]? onlineTip.main[key]: '数据'} 必须填写!`);
          //  return true;
          //}
        });
        //if(notHaveBit)return;+
        if(this.consoleInfoData.data.STATUS != '7'){
          if(this.consoleTableAdd.data.length === 0){
            this.$message.warning(`请添加涉及系统数据!`);
            return;
          }
        }
        //if(this.consoleData.changeSystemJson === 0){
        //  this.$message.warning(`请填写变更对象系统信息!`);
        //  return;
        //}
        console.log(this.consoleTableAdd.data);
        json = Array.from(this.consoleTableAdd.data, item => {
          let dataTemp = { NEED_ID: this.consoleInfoData.data.NEED_ID,ID:this.consoleInfoData.data.ONLINE_ID };
          console.log(dataTemp);
          console.log(onlineTip.addedFetchKeys);
          onlineTip.addedFetchKeys.forEach(key => dataTemp[key] = item[key] || '');
          return dataTemp;
        });
        console.log(this.consoleTableAdd.type);
        console.log(json);
        console.log(entityJson);
        this.$emit('emitHandle', {
          type: 'onSubmit',
          data: {
            json,
            entityJson,
            oper: this.oper,
            changeSystemJson: this.consoleData.changeSystemJson,
            callBack: () => {
              this.maxShow = false;
              this.initData({addDialog: true, consoleData: true});
              // this.tableRowClick(this.activeRowData);
              setTimeout(()=>{
                this.closeAndRefresh();
              },1000)
              // this.closeAndRefresh();
              this.oper = 'add';
              this.consoleTableAdd.data = [];
            }
          },
        });
      },
      tableRowClassName({row, rowIndex}) {
        // 表格行样式自定义
        let str='';
        if (row.online_ID === this.showExpandRowId) {
          str='expend-row';
        }
        if(row.change_TYPE=='紧急' && row.online_STATUS!=='1'){
          str='color-red';
        }
        if(row.expect_ONLINE_TIME){
          row.expect_ONLINE_TIME.split(',').forEach(item=>{
            // item=item.replace(/-/g, "/");
            // console.log(this.$format(new Date()))
            let obj=this.$format(new Date());
            let now=`${obj.year}-${obj.mouth}-${obj.day}`;
            if(item===now && row.online_STATUS!=='1'){
              str='bg-yellow';
            }
            if(item===now && row.change_TYPE=='紧急' && row.online_STATUS!=='1'){
              str='bg-yellow-color-red';
            }
          })
          // return str;
        }
        return str;
      },
      expandChange(val){
        // 子列表展开事件
        if(this.showExpandRowVal && val.online_ID !== this.showExpandRowVal.online_ID){
          this.$refs.mainTable.toggleRowExpansion(this.showExpandRowVal, false);
        }
        this.showExpandRowVal = val;
        this.showExpandRowId = val.online_ID;
        this.subTableData = [];
        this.clickType=false;
        setTimeout(()=>{
          this.clickType=true;
        },500)
        this.$emit('emitHandle', {type: 'expandChange', data: {...val}});
      },
      tableRowClick(rowData,e){
        console.log(rowData);
        // view_Index = 0;
        // 表格行点击事件
        this.initData({addDialog: true, consoleData: true, consoleInfoConfig: true});
        this.maxShow = false;
        if(this.baseBlowHeight === this.baseBlowHeightOrigin && this.clickType){
          this.baseBlowHeight = `${parseInt(this.baseBlowHeightOrigin) + 452}px`;
          console.log('打开窗口')
        }
        this.fetchSystemInfo(rowData);
        this.activeRowData = rowData;
        console.log('this.activeRowData'+this.activeRowData)
        this.$emit('emitHandle', {
          type: 'tableRowClick',
          data: {
            ...rowData,
            callBack: (data) => {
              this.setConsoleData(data.data, data.changeSystem);
              if(data.infos.length > 0 && data.buttons.UPDATE){
                this.consoleTableAdd.data = cloneDeep(data.infos);
              }
              rowData.__ob__.value.show_online_STATUS = ['上线失败', '上线成功', '未上线', '部分上线'][data.data.ONLINE_STATUS];
            }
          }
        });
      },
      setConsoleData(data, changeSystem){
        // 当可以提交时设置consoleData的值
        onlineTip.mainKeys.forEach(key => {
          if(data[key] != undefined){
            if(['CHANGE_OBJECT_ID', 'OPER_TYPE_ID', 'BUSINESS_EFFECT_ID', 'CHANGE_SUPPORT_ID'].indexOf(key) > -1){
              // console.log('处理多选数据')
              this.consoleData[key] = Array.from(data[key].split(','), item => parseInt(item));
              // console.log(this.consoleData[key])
            }else if(key === 'RISK_ID'){
              // console.log('处理单选数据')
              this.consoleData[key] = parseInt(data[key]);
            }else{
              this.consoleData[key] = data[key];
            }
          }
        });
        if(changeSystem && changeSystem.length > 0)this.consoleData.changeSystemJson = changeSystem;
      },
      pageHandler(handlerType){
        // 上下页按钮点击事件
        this.$emit('emitHandle', {type: 'pageHandler', data: {handlerType}});
      },
      downloadAtt(id){
        window.open(`${window._options.baseUrl}/online/download?token=${this.$getToken()}&id=${id}`);
      },
      // 关闭控制台刷新页面，重新获取数据
      closeAndRefresh() {
        this.$emit('emitHandle', {type: 'getTableDataSearch',data: {pageNum: 1,pageSize: 15}});
        console.log('关闭控制台刷新页面，重新获取数据')
        this.baseBlowHeight = this.baseBlowHeightOrigin;
        console.log('已关闭控制台并刷新页面，重新获取数据')
      },
      showDownload(val){
        console.log(val);
        this.$maskin();
        let params=new URLSearchParams();
        params.append('type','DEV_DOC');
        params.append('neet_id',val.NEED_ID);
        params.append('online_id',val.ONLINE_ID);
        params.append('system_id',val.SUB_SYSTEM_ID);
        this.$axios.post('online/queryFileByType',params).then(res=>{
          let data=res.data;
          if(data.code=200){
            this.$set(this.download,"data",data.result);
            this.download.title = '上线附件';
            this.download.visible = true;
            this.$maskoff();
          }
        })
      },
      HandlechangeSystem(val){
        let subSystem='';
        subSystem=val[1].split('-')[0];
        this.$maskin();
        let params=new URLSearchParams();
        params.append('type','DEV_DOC');
        params.append('neet_id',this.activeRowData.neet_ID);
        params.append('online_id',this.activeRowData.online_ID);
        params.append('system_id',subSystem);
        this.$axios.post('online/queryFileByType',params).then(res=>{
          let data=res.data;
          if(data.code=200){
            this.$set(this.consoleTableAdd,"uploadFiles",data.result);
            this.$maskoff();
          }
        })
      },
      startUpload(type){
        console.log(this.consoleTableAdd.inputData)
        this.$set(this.uploadAction,"uploadFiles",[]);
        this.$set(this.uploadAction,"fileIds",[]);
        // this.$set(this.uploadAction,"fileIds",[]);
        this.uploadAction.neel_id = this.activeRowData.neet_ID;
        this.uploadAction.type=type;
        this.uploadAction.SYSTEM_ID=this.consoleTableAdd.inputData.SYSTEM_DATA[1].split('-')[0];
        this.uploadAction.uploadvisible = true;
      },
    }
  }
</script>
