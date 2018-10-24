/* ************************************************
Author: ct
** ***********************************************/
<template>
  <div class="consoleOnline">
    <el-form :model="consoleData" label-width="80px" v-if="consoleData && consoleInfoData.infos && consoleInfoData.infos.length == 0 || maxShow">
      <el-row>
        <el-col :span="18">
          <el-form-item label="变更原因">
            <el-input size="mini" v-model="consoleData.CHANGE_REASON" placeholder="请输入变更原因"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="变更对象">
            <el-checkbox-group v-model="consoleData.CHANGE_OBJECT_ID">
              <el-checkbox
                :label="parseInt(item.id)"
                v-for="item in consoleInfoData.changeObjectSelect"
                :key="item.id">
                {{item.name}}
                <el-input size="mini" v-show="item.id === '8' && consoleData.CHANGE_OBJECT_ID.indexOf('8') > -1" v-model="consoleData.OPER_TYPE_REMARK"></el-input>
              </el-checkbox>
            </el-checkbox-group>
            <el-row class="subItem" v-for="(item, index) in consoleData.changeSystemJson" :key="index">
              <el-col
                v-for="myitem in [{name: '系统名称', mykey: 'SYSTEM_NAME'}, {name: 'IP地址', mykey: 'IP_ADDRESS'}, {name: '系统用户', mykey: 'SYSTEM_USER'}]"
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
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="操作类型">
            <el-checkbox-group v-model="consoleData.OPER_TYPE_ID">
              <el-checkbox
                :label="parseInt(item.id)"
                v-for="item in consoleInfoData.operTypeSelect"
                :key="item.id">
                {{item.name}}
                <el-input size="mini" v-if="item.name == '其他'" v-model="consoleData.OPER_TYPE_REMARK"></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
            <el-checkbox-group v-model="consoleData.BUSINESS_EFFECT_ID">
              <el-checkbox
                :label="parseInt(item.id)"
                v-for="item in consoleInfoData.businessEffectSelect"
                :key="item.id">
                {{item.name}}
                <el-input size="mini" v-if="item.name == '其他'" v-model="consoleData.BUSINESS_EFFECT_REMARK"></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="变更测试结果">
            <el-row class="subItemLong">
              <el-col
                v-for="item in [{name: '是否功能达到预期目标:', mykey: 'IS_EXPECT_TARGET'}, {name: '是否对原有功能无影响:', mykey: 'IS_INHERE_FUNC'}, {name: '是否测试与生成环境一致:', mykey: 'IS_DEV_TEST_EQ'}]"
                :key="item.mykey"
                :span="20">
                <el-form-item :label="item.name">
                  <el-radio-group v-model="consoleData[item.mykey]">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="20">
                <el-form-item label="说明:">
                  <el-input size="mini" v-model="consoleData.CHANGE_TEST_REMARK"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
      <el-button style="float: right; margin-bottom: 8px" type="primary" size="mini" @click="consoleTableAddClick">添加</el-button>
    </el-form>
    <el-table
      tooltip-effect="dark"
      style="width: 100%"
      border
      highlight-current-row
      :data="consoleInfoData && consoleInfoData.infos && consoleInfoData.infos.length === 0 || maxShow? consoleTableAdd.data : consoleInfoData.infos"
    >
      <el-table-column
        v-for="item in consoleTableConfig"
        v-if="item.prop"
        :key="item.prop"
        :prop="item.prop"
        :width="item.width"
        :label="item.label">
      </el-table-column>
      <el-table-column
        width="160"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handerClick(scope, 'ONLINE_AUDIT', 1)" type="primary" v-if="scope.row.BUTTONS && scope.row.BUTTONS.ONLINE_AUDIT">通过</el-button>
          <el-button size="mini" @click="handerClick(scope, 'ONLINE_AUDIT', 0)" type="primary" v-if="scope.row.BUTTONS && scope.row.BUTTONS.ONLINE_AUDIT">驳回</el-button>
          <el-button size="mini" @click="subActiveRowData = scope; consoleOnline.visible = true" type="primary" v-if="scope.row.BUTTONS && scope.row.BUTTONS.MANAGER_CONFIRM">确认上线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加"
      append-to-body
      class="consoleTableAdd"
      :visible.sync="consoleTableAddShow">
      <el-form :model="consoleTableAdd.inputData" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="变更类型">
              <el-radio v-model="consoleData.CHANGE_TYPE" :label="0">常规</el-radio>
              <el-radio v-model="consoleData.CHANGE_TYPE" :label="1">紧急</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系统及子系统:">
              <el-cascader
                v-model="consoleTableAdd.inputData.SYSTEM_DATA"
                :options="consoleTableAdd.info.systems"
                @active-item-change="handleItemChange"
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="预计上线时间:">
              <el-date-picker
                v-model="consoleTableAdd.inputData.EXPECT_ONLINE_TIME"
                type="datetime"
                :picker-options='filterDate'
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
                placeholder="请选择">
                <el-option
                  v-for="user in consoleTableAdd.info.allUser"
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
          <el-col :span="12">
            <el-form-item label="上传附件:">
              <el-upload
                :limit="1"
                :action="`${baseUrl}/online/upload?token=${$getToken()}`"
                :on-success="uploadFileSuccess"
                auto-upload
                :file-list="consoleTableAdd.fileList">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="consoleTableAddShow = false">取 消</el-button>
        <el-button type="primary" @click="consoleTableAddOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="上线确认"
      append-to-body
      class="consoleTableAdd"
      :visible.sync="consoleOnline.visible">
      <el-form :model="consoleOnline.inputData" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布负责人:">
              <el-select
                style="width: 100%"
                v-model="consoleOnline.inputData.releaseManagerData"
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
          <el-col :span="24">
            <el-form-item label="上线结果:" style="height: 42px">
              <el-radio v-model="consoleOnline.inputData.onlineResult" label="1">成功</el-radio>
              <el-radio v-model="consoleOnline.inputData.onlineResult" label="0">失败</el-radio>
              <el-radio v-model="consoleOnline.inputData.onlineResult" label="2">未上线</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作日期时间:">
              <el-date-picker
                :picker-options='filterDate'
                v-model="consoleOnline.inputData.releaseOperTime"
                type="datetime"
                style="width: 100%"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
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
              <el-input type="textarea" v-model="consoleOnline.inputData.releaseOperRemak"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="consoleOnline.visible = false">取 消</el-button>
        <el-button type="primary" @click="handerClick(undefined, 'MANAGER_CONFIRM', 2)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less">
@import './ConsoleOnline.less';
</style>
<script>
  import moment from 'moment';
  import cloneDeep from 'lodash/cloneDeep';
  import { onlineTip } from './tipMap';
  export default {
    name: 'TableConsole',
    props: ['tableData', 'subTableData', 'consoleInfoData', 'config'],
    data() {
      return {
        filterDate: {
          disabledDate(time){
            return time.getTime() > Date.now()
          }
        },
        maxShow: false,
        baseUrl: window._options.baseUrl,
        activeRowData: {},
        subActiveRowData: {},
        tableConfig: [
          { label: '上线编号', prop: 'online_ID', width: '220' },
          { label: '需求编号', prop: 'neet_ID' },
          { label: '需求名称', prop: 'neel_NAME' },
          { label: '产品负责人', prop: 'prod_MANAGER' },
          { label: '需求状态', prop: 'show_online_STATUS' },
        ],
        subTableConfig: [
          { label: '版本ID', prop: 'VERSION_ID' },
          { label: '需求名称', prop: 'SYSTEMSON_NAME' },
          { label: '系统名称', prop: 'SYSTEM_NAME' },
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
          { label: '需求名称', prop: 'NEEL_NAME' },
          { label: '需求编号', prop: 'NEED_ID' },
          { label: '需求状态', prop: 'ONLINE_STATUS_NAME' },
          { label: '上线编号', prop: 'ONLINE_ID' },
          { label: '产品负责人', prop: 'PROD_MANAGER' },
          { label: '风险等级', prop: 'RISK' },
          { label: '风险内容', prop: 'RISK_CONTENT' },
          { label: '变更支持内容', prop: 'CHANGE_SUPPORT_CONTENT' },
        ],
        consoleOnline: {
          visible: false,
          inputData: {}
        },
        consoleTableAdd: {
          inputData: {
            EFFECT_TIME: 1,
            IS_TRADE: 1,
            MODULE: '上线模块test', // 上线模块
            CONTENT: '上线内容test', // 上线内容
            SYSTEM_DATA: [],
            PROJECT_MANAGER_DATA: '27-戴国良',
            PROD_MANAGER_DATA: '27-戴国良',
            DEV_MANAGER_DATA: '27-戴国良',
            TEST_MANAGER_DATA: '27-戴国良',
            CHANGE_TYPE: 0, // 变更类型
          },
          inputDataOrigin: {
            EFFECT_TIME: 1,
            IS_TRADE: 1,
            MODULE: '上线模块test', // 上线模块
            CONTENT: '上线内容test', // 上线内容
            SYSTEM_DATA: [],
          },
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
        consoleData: {
          CHANGE_REASON: '变更原因test', // 变更原因
          CHANGE_OBJECT_ID: [1, 2], // 变更对象
          OPER_TYPE_ID: [9, 10, 11], // 操作类型
          CHANGE_DESC: '变更概述test', // 变更概述
          BUSINESS_EFFECT_ID: [27, 29], // 业务影响ID
          RISK_ID: 35, // 风险控制ID
          IS_EXPECT_TARGET: 0, // 是否达到预期目标(0:否,1:是)
          IS_INHERE_FUNC: 0, // 是否对原有功能无影响(0:否,1:是)
          IS_DEV_TEST_EQ: 0, // 是否测试环境与生产环境一致(0:否,1:是)
          CHANGE_TEST_REMARK: '变更测试结果说明test', // 变更测试结果说明
          CHANGE_SUPPORT_ID: [38, 39], // 变更支持ID
          CHANGE_SUPPORT_CONTENT: '变更支持内容test', // 变更支持内容
          RISK_REMARK: '风险说明test', // 风险说明
          RISK_CONTENT: '风险内容test', // 风险内容
          RISK_SOLUTION: '控制措施test', // 控制措施
          changeSystemJson: [{
            SYSTEM_NAME: '系统名称test',
            IP_ADDRESS: '192.168.0.1',
            SYSTEM_USER: '姓名test'
          }],
        }
      }
    },
    created() {
      // this.baseBlowHeight = `${parseInt(this.baseBlowHeight) + 452}px`;
      // this.activeTab = 'console';
      // this.$emit('emitHandle', {type: 'tableRowClick', data: {
      //   online_ID: 'ONLINE2018042639262741',
      //   neet_ID: 'PROD2018042332771916'
      // }});
    },
    updated() {
    },
    methods: {
      handerClick(scope, type, info){
        // 表格操作按钮点击事件
        if(!scope)scope = this.subActiveRowData;
        let paramsData = {
          infoId: scope.row.ID,
          versionId: scope.row.VERSION_ID,
          needId: scope.row.NEED_ID,
          oper: info
        }
        if(type === 'ONLINE_AUDIT'){
          paramsData.changeType = scope.row.STATUS;
        }else if(type == 'MANAGER_CONFIRM'){
          paramsData = Object.assign(paramsData, cloneDeep(this.consoleOnline.inputData));
          ['releaseOperTime', 'realOnlineTime'].forEach(key => paramsData[key] = moment(paramsData[key]).format("YYYY-MM-DD HH:mm:ss"));
          [paramsData.releaseManagerId, paramsData.releaseManager] = [...paramsData.releaseManagerData.split('-')];
          delete paramsData.releaseManagerData;
        }
        this.$axios.post("/online/audit", new URLSearchParams(`?${Array.from(Object.entries(paramsData), item => `${item[0]}=${item[1]}`).join('&')}`)).then((res) => {
          if(res.data && res.data.code == 200){
            this.tableRowClick(this.activeRowData);
          }
        });
      },
      uploadFileSuccess(res){
        // 上传附件
        if(res.code === 200 && res.result.code === 200){
          this.consoleTableAdd.fileList.push({
            name: res.result.name,
            id: res.result.id
          });
        }else{
          this.$message.error(res.message);
        }
      },
      consoleTableAddOk(){
        // 添加模态框确定按钮点击事件
        //let notHaveBit = false;
        //onlineTip.addedInputKeys.some(key => {
        //  if(!this.consoleTableAdd.inputData[key]){
        //    notHaveBit = true;
        //    this.$message.warning(`${onlineTip.addedInput[key]? onlineTip.addedInput[key]: '数据'}不能为空!`);
        //    return true;
        //  }
        //});
        //if(notHaveBit)return;
        [this.consoleTableAdd.inputData.SYSTEM_ID, this.consoleTableAdd.inputData.SYSTEM_NAME] = [...this.consoleTableAdd.inputData.SYSTEM_DATA[0].split('-')];
        [this.consoleTableAdd.inputData.SUB_SYSTEM_ID, this.consoleTableAdd.inputData.SUB_SYSTEM_NAME, this.consoleTableAdd.inputData.VERSION_ID] = [...this.consoleTableAdd.inputData.SYSTEM_DATA[1].split('-')];
        [this.consoleTableAdd.inputData.PROJECT_MANAGER_ID, this.consoleTableAdd.inputData.PROJECT_MANAGER] = [...this.consoleTableAdd.inputData.PROJECT_MANAGER_DATA.split('-')];
        [this.consoleTableAdd.inputData.PROD_MANAGER_ID, this.consoleTableAdd.inputData.PROD_MANAGER] = [...this.consoleTableAdd.inputData.PROD_MANAGER_DATA.split('-')];
        [this.consoleTableAdd.inputData.DEV_MANAGER_ID, this.consoleTableAdd.inputData.DEV_MANAGER] = [...this.consoleTableAdd.inputData.DEV_MANAGER_DATA.split('-')];
        [this.consoleTableAdd.inputData.TEST_MANAGER_ID, this.consoleTableAdd.inputData.TEST_MANAGER] = [...this.consoleTableAdd.inputData.TEST_MANAGER_DATA.split('-')];
        this.consoleTableAdd.inputData.EXPECT_ONLINE_TIME = moment(this.consoleTableAdd.inputData.EXPECT_ONLINE_TIME).format("YYYY-MM-DD HH:mm:ss");
        this.consoleTableAdd.inputData.ATTACHMENT_ID = this.consoleTableAdd.fileList[0].id;
        this.consoleTableAdd.data.push(this.consoleTableAdd.inputData);
        this.consoleTableAdd.inputData = this.consoleTableAdd.inputDataOrigin;
        this.consoleTableAddShow = false;
      },
      handleItemChange(val){
        // 联动选择器
        let index = this.consoleTableAdd.info.systems.findIndex(item => item.value === val[0]);
        this.$axios.post("/online/getSubSystem", new URLSearchParams(`systemId=${val[0].split('-')[0]}`)).then((res) => {
          if(res.data && res.data.code == 200){
            if(!res.data.result)return;
            this.consoleTableAdd.info.systems[index].children = Array.from(res.data.result.subSystem, item => ({
              label: item.system,
              value: `${item.system_ID}-${item.system}-${item.version_ID}`
            }));
          }
        });
      },
      consoleTableAddClick(){
        // 表格上方右侧添加按钮点击事件
        this.consoleTableAddShow = true;
        this.$axios.post("/online/getAddInfoVar", new URLSearchParams()).then((res) => {
          if(res.data && res.data.code == 200){
            if(!res.data.result)return;
            let result = res.data.result;
            result.systems = Array.from(result.systems, item => ({ label: item.system_NAME, value: `${item.system_ID}-${item.system_NAME}`, children: []}))
            this.consoleTableAdd.info = result;
          }
        });
      },
      changeObjectClick(index){
        if(index === 0){
          this.consoleData.changeSystemJson.push({ SYSTEM_NAME: '', IP_ADDRESS: '', SYSTEM_USER: '' });
        }else{
          this.consoleData.changeSystemJson.splice(index, 1);
        }
      },
      handlerTab(type){
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
        let entityJson = {ID: this.consoleInfoData.data.ONLINE_ID, NEED_ID: this.consoleInfoData.data.NEED_ID}, json = [];
        let notHaveBit = false;
        onlineTip.mainKeys.some(key => {
          if(this.consoleData[key] instanceof Array){
            entityJson[key] = this.consoleData[key].join(',')
          }else{
            entityJson[key] = this.consoleData[key]
          }
          if(!entityJson[key]){
            //notHaveBit = true;
            notHaveBit = false;
            //this.$message.warning(`${onlineTip.main[key]? onlineTip.main[key]: '数据'}不能为空!`);
            return true;
          }
        });
        if(notHaveBit)return;
        json = Array.from(this.consoleTableAdd.data, item => {
          let dataTemp = { NEED_ID: this.consoleInfoData.data.NEED_ID };
          onlineTip.addedFetchKeys.forEach(key => dataTemp[key] = item[key]);
          return dataTemp;
        });
        this.$emit('emitHandle', {
          type: 'onSubmit',
          data: { json, entityJson, changeSystemJson: this.consoleData.changeSystemJson },
          callBack: () => this.tableRowClick(this.activeRowData)
        });
      },
      tableRowClassName({row, rowIndex}) {
        // 表格行样式自定义
        if (row.online_ID === this.showExpandRowId) {
          return 'expend-row';
        }
        return '';
      },
      expandChange(val){
        // 子列表展开事件
        if(this.showExpandRowVal && val.online_ID !== this.showExpandRowVal.online_ID){
          this.$refs.mainTable.toggleRowExpansion(this.showExpandRowVal, false);
        }
        this.showExpandRowVal = val;
        this.showExpandRowId = val.online_ID;
        this.subTableData = [];
        this.$emit('emitHandle', {type: 'expandChange', data: {...val}});
      },
      tableRowClick(rowData){
        // 表格行点击事件
        if(this.baseBlowHeight === this.baseBlowHeightOrigin){
          this.baseBlowHeight = `${parseInt(this.baseBlowHeightOrigin) + 452}px`;
        }
        this.activeRowData = rowData;
        this.$emit('emitHandle', {type: 'tableRowClick', data: {...rowData}});
      },
      pageHandler(handlerType){
        // 上下页按钮点击事件
        this.$emit('emitHandle', {type: 'pageHandler', data: {handlerType}});
      },
      tabClick(){
      }
    }
  }
</script>
