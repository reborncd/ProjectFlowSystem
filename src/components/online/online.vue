<template>
  <div class="onlineBox">
    <div class="onlineHandle">
      <span class="onlineNeedStatus">需求状态:</span>
      <el-select v-model="selectValueData" clearable size="mini" filterable>
        <el-option v-for="(item, index) in optionsUs" :label="item.key" :value="item.value" :key="index">
        </el-option>
      </el-select>
      <span class="onlineNeedStatus">上线节点:</span>
      <el-select v-model="onLineNode" clearable size="mini" filterable>
        <el-option v-for="(item, index) in optionsNode" :label="item.key" :value="item.value" :key="index">
        </el-option>
      </el-select>
      <div class="fr">
        <div style="margin-right: 10px;" class="i-b">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @keyup.enter.native="searchHandle"
            size="mini"
            align="right">
          </el-date-picker>
        </div>
        <div class="search i-b">
          <el-input
            placeholder="检索编号,名称或相关人"
            suffix-icon="icon-sousuo iconfont"
            v-model="keyword"
            @keyup.enter.native="searchHandle"
            size="mini"
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
    <TableConsole
      ref="TableConsole"
      :tableData='tableData'
      :subTableData='subTableData'
      :currentPageNumber='currentPageNumber'
      :consoleInfoData="consoleInfoData"
      :config="tableConsoleConfig"
      :tracking="tracking"
      :homeDisabled="homeDisabled"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      :endDisabled="endDisabled"
      :showOpen="showOpen"
      @emitHandle='emitHandle'
      class="onlineTableConsole"
    >
    </TableConsole>
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import TableConsole from '../common/TableConsole.vue';
import { onlineTip } from '../common/tipMap.js';
export default {
  components:{
    TableConsole
  },
  props: [ 'userInfo' ],
  data() {
    return {
      showOpen:false,
      homeDisabled:false,
      prevDisabled:false,
      nextDisabled:false,
      endDisabled:false,
      tracking: {
        trackingvisiible: false,
        data: [], // 数据
        hoverIndex: "", // 移动上去的索引
        hoverData: [], // 鼠标悬浮的信息
      },
      keyword: '',
      defaultPageSize: 15,
      total:'',//数据总数
      maxPageNumber: null,
      dateRange: [],
      selectValueData: '',
      optionsUs: [
        { key: "请选择需求状态", value: "" },
        { key: "上线失败", value: "0" },
        { key: "上线成功", value: "1" },
        { key: "未上线", value: "2" },
        // { key: "部分上线", value: "3" },
      ],
      onLineNode:'',//上线节点字段
      optionsNode: [//上线节点选择值
        { key: "请选择上线节点", value: "" },
        { key: "部门领导审核", value: "部门领导审核" },
        { key: "应用运维部审核", value: "应用运维部审核" },
        { key: "待质量管理部审核", value: "待质量管理部审核" },
        { key: "待事业部审核", value: "待事业部审核" },
        { key: "待数据中心负责人审核", value: "待数据中心负责人审核" },
        { key: "测试验收通过", value: "测试验收通过" },
        { key: "生产验收通过", value: "生产验收通过" },
        { key: "待上线", value: "待上线" }
      ],
      tableData: [],
      subTableData: [],
      consoleInfoData: {},
      dataMap: {
        // 上线状态与下标对应关系
        onlineStatus: ['上线失败', '上线成功', '未上线', '部分上线'],
      },
      currentPageNumber: 1,
      tableConsoleConfig: {
        userInfo: {}
      }
    }
  },
  mounted() {
    this.emitHandle({
      type: 'getTableData',
      data: {
        pageNum: this.currentPageNumber,
        pageSize: this.defaultPageSize,
        key:this.$route.params.neelId?this.$route.params.neelId:''
      }
    });
    // if(this.$route.params.neelId){
    //   // this.emitHandle({
    //   //   type: 'tableRowClick',
    //   //   data: {
    //   //     pageNum: this.currentPageNumber,
    //   //     pageSize: this.defaultPageSize,
    //   //     key:this.$route.params.neelId?this.$route.params.neelId:''
    //   //   }
    //   // });
    //   this.tableRowClick();
    // }
  },
  computed:{
    computedValue:function(){
      let type=false;
      if((this.dateRange && this.dateRange.length) || this.keyword || this.selectValueData || this.onLineNode){
        // console.log('没有置空')
        type=false;
      }else{
        // console.log('置空了')
        type=true;
      }
      return type
    }
  },
  watch:{
    computedValue:function(value,old){
      console.log(value)
      value && this.emitHandle({type: 'getTableData',data: {pageNum: 1,pageSize: 15}});
      // value && this.getTableData({pageNum: 1,pageSize: 15});
    }
  },
  updated() {
    if(this.userInfo){
      this.$set(this.tableConsoleConfig, 'userInfo', this.userInfo);
    }
  },
  methods: {
    searchHandle(){
      let data = {
        pageNum: 1,
        pageSize: this.total,
        selectValueData: this.selectValueData
      }
      if(this.dateRange && this.dateRange.length > 0){
        [data.START_TIME, data.END_TIME] = [...this.dateRange];
      }
      data.key = this.keyword.trim();
      data.state_GOLIVE_NAME = this.onLineNode;
      if(this.selectValueData || this.dateRange.length>0 || this.onLineNode || this.keyword){
        this.emitHandle({ type: 'getTableDataSearch', data })
        this.resetDisabled(true,true,true,true)
      }else{
        this.$warn('请至少选择一项检索条件')
      }
    },
    // 防止选择其他状态无法获取最开始的总数
    getTableDataSearch(poyload){
      console.log('关闭刷新方法')
      if(poyload.pageNum <= 0 || (this.maxPageNumber && this.maxPageNumber < this.currentPageNumber)){
        if(poyload.pageNum <= 0)this.currentPageNumber == 1;
        if(poyload.endFun)poyload.endFun();
        return;
      }
      let paramsTemp = Array.from([['key', 'key'], ['page', 'pageNum'], ['pageSize', 'pageSize'], ['ONLINE_STATUS', 'selectValueData'], ['START_TIME', 'START_TIME'], ['END_TIME', 'END_TIME'],['state_GOLIVE_NAME', 'state_GOLIVE_NAME']],
          item => `${item[0]}=${poyload[item[1]] || ''}`);
      this.$axios.post("/online/query", new URLSearchParams(paramsTemp.join('&'))).then((res) => {
        if(poyload.endFun)poyload.endFun();
        if(res.data && res.data.code == 200){
          // this.total=res.data.result.total;
          if(!res.data.result)return;
          let data = res.data.result.data;
          if(data.length === 0 && poyload.type){
            if(poyload.type === 'next'){
              this.currentPageNumber--;
              this.maxPageNumber = this.currentPageNumber;
            }
            return;
          }
          data.map(item => {
            item.show_online_STATUS = this.dataMap.onlineStatus[parseInt(item.online_STATUS)];
            item.change_TYPE = item.change_TYPE==1?'紧急':'常规';
            item.createTime = moment(item.create_TIME).format("YYYY-MM-DD HH:mm:ss");
            // item.createTime = moment(item.createTime,"YYYY-MM-DD HH:mm:ss");
          });
          this.$refs.TableConsole.handlerTab('close');
          // this.showOpen = false;
          console.log('执行关闭')
          this.tableData = data;
        }
      });
    },
    getTableData(poyload){
      if(poyload.pageNum <= 0 || (this.maxPageNumber && this.maxPageNumber < this.currentPageNumber)){
        if(poyload.pageNum <= 0)this.currentPageNumber == 1;
        if(poyload.endFun)poyload.endFun();
        return;
      }
      let paramsTemp = Array.from([['key', 'key'], ['page', 'pageNum'], ['pageSize', 'pageSize'], ['ONLINE_STATUS', 'selectValueData'], ['START_TIME', 'START_TIME'], ['END_TIME', 'END_TIME'],['state_GOLIVE_NAME', 'state_GOLIVE_NAME']],
          item => `${item[0]}=${poyload[item[1]] || ''}`);
      this.$axios.post("/online/query", new URLSearchParams(paramsTemp.join('&'))).then((res) => {
        if(poyload.endFun)poyload.endFun();
        if(res.data && res.data.code == 200){
          this.resetDisabled(false,false,false,false)
          this.total=res.data.result.total;
          if(!res.data.result)return;
          let data = res.data.result.data;
          if(data.length === 0 && poyload.type){
            if(poyload.type === 'next'){
              this.currentPageNumber--;
              this.maxPageNumber = this.currentPageNumber;
            }
            return;
          }
          data.map(item => {
            item.show_online_STATUS = this.dataMap.onlineStatus[parseInt(item.online_STATUS)];
            item.change_TYPE = item.change_TYPE==1?'紧急':'常规';
            item.createTime = moment(item.create_TIME).format("YYYY-MM-DD HH:mm:ss");
            // item.createTime = moment(item.createTime,"YYYY-MM-DD HH:mm:ss");
          });
          console.log('neelId',this.$route.params.neelId)
          // if(this.$route.params.neelId){
          //   console.log('待办跳转过来');
          //   this.tableRowClick(data[0]);
          //   // this.showOpen = true;
          //   this.$refs.TableConsole.activeTab='console';
          // }
          this.$refs.TableConsole.handlerTab('close');
          this.tableData = data;
        }
      });
    },
    emitHandle(poyload){
      this.$maskin();
      let fetchPro = new Promise(resolve => {
        poyload.data.endFun = () => resolve("success!");
        this[poyload.type](poyload.data);
      });
      console.log(fetchPro);
      fetchPro.then(() => this.$maskoff()).catch(()=>this.$maskoff());
    },
    onSubmit(poyload){
      let params = new URLSearchParams();
      params.append("changeSystemJson", JSON.stringify(poyload.changeSystemJson));
      params.append("json", JSON.stringify(poyload.json));
      params.append("entityJson", JSON.stringify(poyload.entityJson));
      params.append("oper", poyload.oper);
      this.$axios.post("/online/add", params).then((res) => {
        if(poyload.endFun)poyload.endFun();
        if(poyload.callBack)poyload.callBack();
        if(res.data && res.data.code == 200){
          if(!res.data.result)return;
          this.subTableData = res.data.result.data;
        }
      });
    },
    expandChange(data){
      let params = new URLSearchParams(`NEED_ID=${data.neet_ID}`);
      this.$axios.post("/online/contactSystem", params).then((res) => {
        if(data.endFun)data.endFun();
        if(res.data && res.data.code == 200){
          if(!res.data.result)return;
          this.subTableData = res.data.result.data;
        }
      });
    },
    tableRowClick(data){
      console.log(data);
      let params = new URLSearchParams(`id=${data.online_ID}&needId=${data.neet_ID}`);
      this.$axios.post("/online/get", params).then((res) => {
        if(data.endFun)data.endFun();
        if(res.data && res.data.code == 200){
          if(!res.data.result)return;
          let result = res.data.result;
          if(result.infos){
            result.infos = Array.from(result.infos, item => {
              let dataTemp = {};
              Object.keys(item).forEach(key => dataTemp[key.toUpperCase()] = item[key]);
              return dataTemp;
            })
          }
          if(result.changeSystem){
            result.changeSystem = Array.from(result.changeSystem, item => {
              let dataTemp = {};
              Object.keys(item).forEach(key => dataTemp[key.toUpperCase()] = item[key]);
              return dataTemp;
            })
          }
          let info = {};
          result.systems.forEach(item => {
            if(!info[item.SYSTEM_ID])info[item.SYSTEM_ID] = {label: item.SYSTEM_NAME, value: `${item.SYSTEM_ID}-${item.SYSTEM_NAME}`, children: []};
            info[item.SYSTEM_ID].children.push({label: `${item.SYSTEMSON_NAME}(${item.BAN})`, value: `${item.SUB_SYSTEM_ID}-${item.SYSTEMSON_NAME}-${item.VERSION_ID}-${item.BAN}`})
          })
          result.systemsInfo = Array.from(Object.keys(info), key => info[key]);
          // result.data.ONLINE_STATUS_NAME = this.dataMap.onlineStatus[result.data.ONLINE_STATUS];
          result.data.SHOW_ONLINE_STATUS = this.dataMap.onlineStatus[result.data.ONLINE_STATUS];
          result.data.SHOW_CHANGE_TYPE = ['常规', '紧急'][result.data.CHANGE_TYPE];
          // result.changeObjectSelect.filter(item => result.data.CHANGE_OBJECT_ID.split(',').indexOf(String(item.id)) > -1);
          let parseItem = (key, resultKey, remarkKey) => {
            if(result.data[key]){
              result.data[`SHOW_${key}`] = Array.from(result[resultKey], item => result.data[key].split(',').indexOf(String(item.id)) > -1? item.name: undefined)
                .filter(item => item).join('、') + (remarkKey && result.data[remarkKey]? `(${result.data[remarkKey]})`: '');
            }
          }
          parseItem('CHANGE_OBJECT_ID', 'changeObjectSelect', 'CHANGE_OBJECT_REMARK');
          parseItem('OPER_TYPE_ID', 'operTypeSelect', 'OPER_TYPE_REMARK');
          parseItem('BUSINESS_EFFECT_ID', 'businessEffectSelect', 'BUSINESS_EFFECT_REMARK');
          parseItem('CHANGE_SUPPORT_ID', 'changeSupport');
          result.data.SHOW_CHANGE_SUPPORT_ID = `${onlineTip.main.CHANGE_SUPPORT_ID}: ${result.data.SHOW_CHANGE_SUPPORT_ID}`

          result.data.SHOW_CHANGE_SUPPORT_CONTENT = `${onlineTip.main.CHANGE_SUPPORT_CONTENT}: ${result.data.CHANGE_SUPPORT_CONTENT}`;
          result.data.SHOW_RISK = `${onlineTip.main.RISK_ID}: ${result.data.RISK}`;
          result.data.SHOW_RISK_REMARK = `${onlineTip.main.RISK_REMARK}: ${result.data.RISK_REMARK}`;
          result.data.SHOW_RISK_CONTENT = `${onlineTip.main.RISK_CONTENT}: ${result.data.RISK_CONTENT}`;
          result.data.SHOW_RISK_SOLUTION = `${onlineTip.main.RISK_SOLUTION}: ${result.data.RISK_SOLUTION}`;
          result.data.SHOW_IS_EXPECT_TARGET = `${onlineTip.main.IS_EXPECT_TARGET}: ${['否', '是'][result.data.IS_EXPECT_TARGET]}`;
          result.data.SHOW_IS_INHERE_FUNC = `${onlineTip.main.IS_INHERE_FUNC}: ${['否', '是'][result.data.IS_INHERE_FUNC]}`;
          result.data.SHOW_IS_DEV_TEST_EQ = `${onlineTip.main.IS_DEV_TEST_EQ}: ${['否', '是'][result.data.IS_DEV_TEST_EQ]}`;
          result.data.SHOW_CHANGE_TEST_REMARK = `${onlineTip.main.CHANGE_TEST_REMARK}: ${result.data.CHANGE_TEST_REMARK}`;
          result.data.SHOW_CHANGE_TYPE = ['常规', '紧急'][result.data.CHANGE_TYPE];
          //if(result.data.CHANGE_OBJECT_ID){
          //  result.data.SHOW_CHANGE_OBJECT_ID = Array.from(result.changeObjectSelect, item => result.data.CHANGE_OBJECT_ID.split(',').indexOf(String(item.id)) > -1? item.name: undefined)
          //    .filter(item => item).join('、') + (result.data.CHANGE_OBJECT_REMARK? `(${result.data.CHANGE_OBJECT_REMARK})`: '');
          //}
          //if(result.data.OPER_TYPE_ID){
          //  result.data.SHOW_OPER_TYPE_ID = Array.from(result.operTypeSelect, item => result.data.OPER_TYPE_ID.split(',').indexOf(String(item.id)) > -1? item.name: undefined)
          //    .filter(item => item).join('、') + (result.data.OPER_TYPE_REMARK? `(${result.data.OPER_TYPE_REMARK})`: '');
          //}
          //if(result.data.BUSINESS_EFFECT_ID){
          //  result.data.SHOW_BUSINESS_EFFECT_ID = Array.from(result.businessEffectSelect, item => result.data.BUSINESS_EFFECT_ID.split(',').indexOf(String(item.id)) > -1? item.name: undefined)
          //    .filter(item => item).join('、') + (result.data.BUSINESS_EFFECT_REMARK? `(${result.data.BUSINESS_EFFECT_REMARK})`: '');
          //}
          // result.data.SHOW_CHANGE_SYSTEM = Array.from(result.changeSystem, (item, index) => `${index + 1}. ${item.SYSTEM_NAME}-${item.IP_ADDRESS}-${item.SYSTEM_USER}.`).join('  ');
          let str='';
          result.changeSystem.forEach((item,index)=>{
            if(item.SYSTEM_NAME===null){
              item.SYSTEM_NAME=''
            }
            if(item.IP_ADDRESS===null){
              item.IP_ADDRESS=''
            }
            if(item.SYSTEM_USER===null){
              item.SYSTEM_USER=''
            }
            str+=`${index + 1}. ${item.SYSTEM_NAME} - ${item.IP_ADDRESS} - ${item.SYSTEM_USER}      |`
          })
          console.log('str'+str)
          result.data.SHOW_CHANGE_SYSTEM=str;
          // result.data.SHOW_CHANGE_SYSTEM=result.changeSystem;
          result.infos.map(item => item.EXPECT_ONLINE_TIME = moment(item.EXPECT_ONLINE_TIME).format("YYYY-MM-DD HH:mm:ss"));
          this.consoleInfoData = result;
          console.log(this.consoleInfoData);
          if(data.callBack)data.callBack(result);
        }
      })
      this.$axios.post("/online/queryView", new URLSearchParams(`BASE_ID=${data.online_ID}`)).then((res)=>{
        if(res.data && res.data.code == 200){
          if(!res.data.result)return;
          let result = res.data.result;
          res.data.result.map(item => {
            if(typeof(item.view_DESC) === 'string'){
              item.view_DESC = [item.view_DESC];
            }
          })
          this.tracking.data = res.data.result;
          console.log(res.data.result);
          console.log(this.tracking.data);
        }
      })
    },
    pageHandler(data){
      if(data.handlerType === 'prev'){
        if(this.currentPageNumber>1){
          this.currentPageNumber--
        }else{
          this.$warn('已经是第一页了呢');
        }
      }else if(data.handlerType === 'next'){
        if(this.currentPageNumber<Math.ceil(this.total/this.defaultPageSize)){
          this.currentPageNumber++;
        }else{
          this.$warn('已经是最后一页了呢');
        }
      }else if(data.handlerType === 'home'){
        this.currentPageNumber=1;
      }else if(data.handlerType === 'end'){
        this.currentPageNumber=Math.ceil(this.total/this.defaultPageSize);
      }
      console.log('发起事件')
      this.emitHandle({
        type: 'getTableData',
        data: {
          pageNum: this.currentPageNumber,
          pageSize: this.defaultPageSize,
          type: data.handlerType
        }
      })
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
@import './online.less';
</style>
