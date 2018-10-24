<template>
  <div>
    <div class="common-card-wrap" style="height: 100%;">
      <el-card class="box-card">
        <div class="text item">
          <!--全局看板-->
          <div class="setting-wrap">
            <el-button type="primary" size="mini" @click="showOption">看板设置</el-button>
            <el-button @click="fullScreen()" style="margin-left: 10px;" type="primary" size="mini">
              {{fullStatus?'退出全屏':'全屏查看'}}
            </el-button>
          </div>
          <div class="content" v-show="visible.global">
            <div class="chart-wrap">
              <h2>任务状态</h2>
              <div class="four-pie clear">
                <div id="task1"></div>
                <div id="task2"></div>
                <div id="task3"></div>
                <div id="task4"></div>
              </div>
            </div>
            <div class="clear col-wrap">
              <div class="chart-wrap fl" style="width: 40%;margin-right: 5%;">
                <h2>人员状态</h2>
                <div id="people" style="width:100%;height: 500px"></div>
              </div>
              <div class="chart-wrap fl" style="width: 55%">
                <h2>完成状态</h2>
                <div style="text-align: right">
                  <el-select v-model="complete.select" placeholder="请选择组别" @change="changeComplete" filterable>
                    <el-option
                        v-for="item in complete.selectArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div id="complete" style="display: block;margin: 0 auto;height: 500px"></div>
              </div>
            </div>
          </div>
          <!--周期工时-->
          <div class="content" v-show="visible.needs" style="margin-top: 50px">
            <!--信息块-->
            <el-form label-width="120px" label-position="left">
              <el-row :gutter="20" >
                <el-col :span="24" :sm="24">
                  <el-form-item label="需求名称">
                    {{realtimeInfo.neel_NAME}}
                  </el-form-item>
                </el-col>
                <el-col :span="24" :sm="24">
                  <el-form-item label="需求编号">
                    {{realtimeInfo.neel_ID}}
                  </el-form-item>
                </el-col>
                <el-col :span="12" :sm="12">
                  <el-form-item label="参与者">
                    {{realtimeInfo.check_NAME}}
                  </el-form-item>
                </el-col>
                <el-col :span="12" :sm="12">
                  <el-form-item label="期望上线时间">
                    {{realtimeInfo.golive_DATE}}
                  </el-form-item>
                </el-col>
                <el-col :span="24" :sm="24">
                  <el-form-item label="需求描述">
                    <div class="neel_DESCRIPTION"></div>
                    <!--{{realtimeInfo.neel_DESCRIPTION}}-->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <h2 style="margin-top: 20px;">当前状态：<span style="margin-left:10px;color: red">{{realtimeInfo.state_NAME}}</span></h2>
            <div class="track">
              <ul>
                <li v-for="(item, index) in info" :key="item.record_ID">
                  <span style="margin-right: 20px;">{{index+1}}.</span>
                  <span style="margin-right: 5px;"></span>
                  {{item.date_START}}&nbsp;&nbsp;{{item.record_DESC}}
                </li>
              </ul>
            </div>
            <!--信息块-->
            <h1 v-show="!sstj.hidezqvisible" class="hasview">周期信息</h1>
            <h1 v-show="sstj.hidezqvisible" class="noview">暂无周期信息</h1>
            <div v-show="!sstj.hidezqvisible" id="system" style="width:1000px;height: 200px;margin: 20px 0;"></div>
            <h1 v-show="!sstj.hidegsvisible" class="hasview">工时统计</h1>
            <h1 v-show="sstj.hidegsvisible" class="noview">暂无工时信息</h1>
            <div v-show="!sstj.hidegsvisible" style="width: 1000px;" class="clear" id="hours-div"></div>
            <div v-show="!sstj.hidegsvisible" style="width: 1000px;"  id="user-div" class="clear"></div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="看板设置" :visible="option.visible" width="60%"
           append-to-body modal-append-to-body :before-close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="看板类型" style="margin-bottom:10px;">
          <el-checkbox v-model="option.global">全局看板</el-checkbox>
          <el-checkbox v-model="option.needs">需求看板</el-checkbox>
        </el-form-item>
        <el-form-item label="需求类型" v-if="option.needs" style="margin-bottom:10px;">
          <el-select
            v-model="option.needschoosen"
            placeholder="请选择需求类型"
            clearable
            filterable
            multiple
            style="width: 49%"
            @change="needsChange($event)"
          >
            <el-option
              v-for="item in option.needsArr"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="option.coded"
            clearable
            placeholder="请选择需求"
            filterable
            style="width: 50%"
            multiple
          >
            <el-option-group
              v-for="(group, index) in option.codeArr"
              :key="group.neelName"
              :label="`${index + 1}. ${group.neelName}`" >
              <el-option
                v-for="item in group.options"
                :key="item.state_ID"
                :label="`${item.state_NAME}`"
                :value="`${index}-${item.state_ID}`" >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="切换频率" v-if="option.needs">
          <el-select v-model="option.time" placeholder="请选择切换频率" filterable>
            <el-option v-for="item in option.timeArr" :key="item.value" :label="item.key"
                   :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOption" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        hehe: '',
        fullStatus:false,
        visible:{
          global:true,
          needs:false
        },
        option: {
          visible: false,
          global: true,//全局看板
          needs: false,//需求看板
          needsArr: [],//需求类型数组
          needschoosen: [],//需求类型选择的值
          codeArr: [],//需求编号数组
          coded: [],//需求选中值
          activeCode: "",//确定后需要请求的需求ID
          time: "",//切换频率选中的值
          timeArr: [{
            "key": "30秒",
            "value": 30
          }, {
            "key": "60秒",
            "value": 60
          }, {
            "key": "180秒",
            "value": 180
          }, {
            "key": "300秒",
            "value": 300
          }, {
            "key": "600秒",
            "value": 600
          }]
        },
        complete: {
          selectArr: [],//完成状况数组
          select: "全部",//选中值
          originData : [],//源数据
        },
        realtimeInfo:{
          neel_NAME:'', //需求名称
          neel_ID:'',//需求编号
          check_NAME:'',//参与者
          golive_DATE:'',//上线时间
          neel_DESCRIPTION:'',//需求描述
          state_Name:'',//当前状态
          stage:'',//所处阶段
          titleVisible:false,//标题的显示
        },
        info:[],//信息列表
        sstj:{
          hidezqvisible:false,//周期统计
          hidegsvisible:false,//工时统计
        },
        interval:"",
        allNeedsinfo:[],//所有需求的信息
        needsIndex:0,
      }
    },
    mounted(){
      this.loadData();
    },
    destroyed() {
      clearInterval(this.interval);
    },
    methods: {
      //开启看板设置
      showOption(){
        this.option.visible = true;
      },
      //保存设置
      saveOption(){
        clearInterval(this.interval);
        if(this.option.global && !this.option.needs){
          //选择了全局未选择需求看板
          this.visible.global = true;
          this.visible.needs = false;
        }else if(!this.option.global && this.option.needs){
          if(!this.option.needschoosen){
            this.$warn("请选择需求类型");
            return
          }
          if(!this.option.coded){
            this.$warn("请选择需求编码");
            return
          }
          if(!this.option.time){
            this.$warn("请选择切换频率");
            return;
          }
          //选择了需求看板未选择全局
          this.visible.global = false;
          this.visible.needs = true;
          this.loadNeedsInfo();
          this.interval = setInterval(()=>{
          if(this.needsIndex != this.allNeedsinfo.length){
            this.visible.needs = true;
            this.loadNeedsByIndex();
            this.needsIndex++
          }else{
            this.visible.needs = true;
            this.needsIndex = 0;
            this.loadNeedsInfo();
          }
          },this.option.time*1000);
        }else if (this.option.global && this.option.needs){
          if(!this.option.time){
            this.$warn("请选择切换频率");
            return;
          }
          //选择了全局未选择需求看板
          this.visible.global = true;
          this.visible.needs = false;
          this.loadNeedsInfo();
          this.interval = setInterval(()=>{
            if(this.needsIndex != this.allNeedsinfo.length){
              this.visible.needs = true;
              this.visible.global = false;
              this.loadNeedsByIndex();
              this.needsIndex++
            }else{
              this.needsIndex = 0;
              this.loadGlobal();
              this.visible.needs = false;
              this.visible.global = true;
            }
          },this.option.time*1000);
        }else if (!this.option.global && !this.option.needs){
          //不能存在全部不选的情况
          this.$warn("请至少选择一项看板");
          return;
        }
        this.option.visible = false;
      },
      closeDialog(){
        this.option.visible = false;//看板的弹窗
      },
      _calculate(){
        let height = document.querySelector(".mainr").offsetHeight;
        let card_body = document.querySelector(".box-card .el-card__body");
        card_body.style.height = height - 36 + "px";
      },
      loadData(){
        this.$maskin();
        this._calculate();
        this.loadGlobal();//加载全局看板
      },
      //加载全局看板设置
      loadGlobal(){
        let params = new URLSearchParams();
        this.$axios.post("/statistical/getstatistics", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            //设置需求类型下拉数据
            this.$set(this.option, "needsArr", data.result.Neellist);
            if(this.visible.global){
              //任务状态
              let Sarr = [];
              let Aarr = [];
              let Barr = [];
              let Carr = [];
              for (let i of data.result.stalist) {
                if (i.rriority_NAME == "紧急+重要") {
                  Sarr.push(i);
                }
                if (i.rriority_NAME == "不紧急+重要") {
                  Aarr.push(i);
                }
                if (i.rriority_NAME == "紧急+不重要") {
                  Barr.push(i);
                }
                if (i.rriority_NAME == "不紧急+不重要") {
                  Carr.push(i);
                }
              }
              //设置任务状态
              let empty = [{"count":0,"state_NAME":"暂无"}];
              !Sarr.length?Sarr = empty:Sarr;
              !Aarr.length?Aarr = empty:Aarr;
              !Barr.length?Barr = empty:Barr;
              !Carr.length?Carr = empty:Carr;
              this.setTaskStatus(Sarr, Aarr, Barr, Carr);
              //人员状态
              let personData = {
                "dept_NAME": [],//所有的数组
                "kocount": [],//空闲的数组
                "mcount": [],//忙碌的数组
                "sumcount": [],//总的时间
              };
              for (let j of data.result.sumcountuser) {
                personData.dept_NAME.push(j.dept_NAME);
                personData.kocount.push(j.kocount);
                personData.mcount.push(j.mcount);
                personData.sumcount.push(j.sumcount);
              }
              //设置人员状态
              this.setPerson("人员状态", personData);
              //设置完成状态数组
              let allpeople = [];
              let alldeptlist = [];
              for (let i of data.result.deptlist) {
                let obj = {
                  "label": i.dept_NAME,
                  "value": i.dept_ID,
                  "deptuserlist": i.deptuserlist
                };
                alldeptlist.push(obj);
                //放置到全部的人员数组中去
                for (let j of i.deptuserlist) {
                  allpeople.push(j)
                }
              }
              alldeptlist.unshift({
                "label": "全部",
                "value": "全部",
                "deptuserlist": allpeople
              });
              this.$set(this.complete, "selectArr", alldeptlist);
              this.$set(this.complete, "originData", alldeptlist);
              this.setComplete(alldeptlist);
            }
            this.$maskoff();
          }
        });
      },
      //加载需求信息
      loadNeedsInfo(){
        this.$maskin();
        let params = new URLSearchParams();
        let reqData = [];
        this.option.needschoosen.forEach(item => reqData.push({neelType: item, status: []}));
        this.option.coded.forEach(item => reqData[parseInt(item.split('-')[0])].status.push(parseInt(item.split('-')[1])));
        params.append("json", JSON.stringify(reqData));//需求类型ID
        this.$axios.post("/statistical/getneelmainba", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
          	if(!data.result.neellist.length){
          		this.$warn("暂无需求信息！");
          		this.$maskoff();
          		return
            }
            this.allNeedsinfo = data.result.neellist.length > 0 && data.result.neellist;
          	setTimeout(()=>{
            this.loadNeedsByIndex();
            this.$maskoff();
            },0)
          }
        })
      },
      loadNeedsByIndex(){
        let info = this.allNeedsinfo;
        let info_index = info[this.needsIndex];
        this.realtimeInfo = info_index;
        document.querySelector(".neel_DESCRIPTION").innerHTML = info_index.neel_DESCRIPTION;
        this.info = info_index.map.queryRecordByTaskId;
        //加载实时统计数据
        if(info_index.map.systenDept){
          if(info_index.map.systenDept.length){
            //默认显示信息
            this.sstj.hidezqvisible = false;
            this.sstj.hidegsvisible = false;
            this.setRealTime(
              info_index.map.systenDept,
              info_index.map.currentTime,
              info_index.map.taskTime)
          }else{
            //当前没有分配给技术经理，全部不显示信息
            this.sstj.hidezqvisible = true;
            this.sstj.hidegsvisible = true;
          }
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
          ]
//          yaxis.push(i.DEPT_NAME+arr[0]+'-'+arr[1]);
          yaxis.push(i.DEPT_NAME);
          if(i.EXPECT_START){
            startTime.push(new Date(i.EXPECT_START));
          }
          if(i.EXPECT_END){
            endTime.push(new Date(i.EXPECT_END));
          }
          if(i.realy_date){
          //任务正在进行中
          actualTime.push((new Date(i.realy_date)).getTime());//完成日期
          }else{
          actualTime.push(new Date());//完成日期
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
            userName.push(j.USER_NAME)
            userallTime.push(j.ALL_TIME)
            userequiredTime.push(j.REAL_TIME)
            userleaveTime.push(j.REAL_TIME-j.ALL_TIME)
          }
        }
        this.userworkTime(userName,userallTime,userequiredTime,userleaveTime);
//        let len=requiredTime.length;
//        this.$set(this.sstj,"yaxis",yaxis);
//        this.$set(this.sstj,"startTime",startTime);
//        this.$set(this.sstj,"endTime",endTime);
//        this.$set(this.sstj,"actualTime",actualTime);
//        this.$set(this.sstj,"timeInfo",timeInfo);
//        this.$set(this.sstj,"deptName",deptName);
//        this.$set(this.sstj,"requiredTime",requiredTime);
//        this.$set(this.sstj,"leaveTime",leaveTime);
//        this.$set(this.sstj,"allTime",allTime);
//        this.sstj.len = len;
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
      let proBar = this.$echarts.init(document.getElementById("system")); //实时统计
      proBar.clear();
      let end_time = [];//放置结束如期
      let actual_time = [];//放置实际用时
      let now = new Date();
      for(let i=0;i<yaxis.length;i++){
        end_time.push(endTime[i])
        if(endTime[i]>=actualTime[i]){
          actual_time.push(null)
        }else{
          actual_time.push(actualTime[i])
        }
      }
      let option = {
//        title: {
//        text: '周期统计',
//        x: 'center'
//        },
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
          formatter: (params) => {
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
        series: [
        {
          name: '预计开始时间',
          type: 'bar',
          stack: '开始时间',
          itemStyle: {
            normal: {
              color: '#778899',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            }
          },
          data: startTime
        }, {
          name: '实际结束时间',
          type: 'bar',
          stack: '开始时间',
          itemStyle: {
            normal: {
              color: '#F4201B',
              shadowColor: 'rgba(255, 255, 255, 0.3)',
            }
          },
          data: actual_time
        },
          {
            name: '预计结束时间',
            type: 'bar',
            stack: '开始时间',
            itemStyle: {
              normal: {
                color: '#2E91BD',
                barBorderRadius: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
              }
            },
            data: end_time
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
      //选择需求类型change事件
      needsChange(e){
        this.$maskin();
        this.interval = "";//清除定时器
        this.option.coded = [];//清除上次选中的值
        let params = new URLSearchParams();
        params.append("NEEL_TYPE", this.option.needschoosen);
        this.$axios.post("/statistical/getneelnamelist", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.$set(this.option, "codeArr", data.result.neellist);
            this.$maskoff();
          }
        })
      },
      //设置任务状态的四个圆
      setTaskStatus(Sarr, Aarr, Barr, Carr){
        let task1 = this.$echarts.init(document.getElementById("task1"));
        task1.clear();
        task1.setOption(this.statusOption("紧急+重要", Sarr));
        let task2 = this.$echarts.init(document.getElementById("task2"));
        task2.clear();
        task2.setOption(this.statusOption("不紧急+重要", Aarr));
        let task3 = this.$echarts.init(document.getElementById("task3"));
        task3.clear();
        task3.setOption(this.statusOption("紧急+不重要", Barr));
        let task4 = this.$echarts.init(document.getElementById("task4"));
        task4.clear();
        task4.setOption(this.statusOption("不紧急+不重要", Carr));
      },
      //圆的设置
      statusOption(title, allData){
        let arr_data = [];
        for (let i of allData) {
          let obj = {
            "name": i.state_NAME,
            "value": i.count
          };
          arr_data.push(obj);
        }
        let arr_title = [
          "待技术管理部审核",
          "待技术经理审核",
          "开发中",
          "测试中",
          "已验收",
          "待技术负责人审核",
          "待系统管理部部长审核",
          "待产品经理验收"
        ];
        return {
          title: {
            text: title,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            type: 'scroll',
            right: 0,
            top: 20,
            data: arr_title
          },
          series: [{
            name: '需求状态',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: arr_data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }
      },
      //设置人员的饼图
      setPerson(title, data){
        let person = this.$echarts.init(document.getElementById("people"));
        person.clear();
        person.setOption(this.personOption(title, data));
      },
      //人员状态设置
      personOption(title, data){
        return {
          angleAxis: {},
          radiusAxis: {
            type: 'category',
            data: data.dept_NAME,//组的数量
            z:5
          },
          polar: {},
          series: [{
            type: 'bar',
            data: data.kocount,
            coordinateSystem: 'polar',
            name: '空闲人数',
            stack: 'a'
          }, {
            type: 'bar',
            data: data.mcount,
            coordinateSystem: 'polar',
            name: '忙碌人数',
            stack: 'a'
          }],
          legend: {
            show: true,
            data: ['空闲人数', '忙碌人数']
          }
        }
      },
      changeComplete(){
        this.$maskin();
        this.setComplete(this.complete.originData);
        this.$maskoff();
      },
      //完成状态的设置
      completeOption(data){
        let person = [];//放置所有人员
        let ywxq = [];//业务需求的数组
        let jcjs = [];//基础建设的数组
        let rcrw = [];//日常任务的数组
        let jsxq = [];//技术需求的数组
        for (let i of data) {
          if (i.value == this.complete.select) {
            for (let j of i.deptuserlist) {
              person.push(j.user_NAME);
              for (let n of j.userwtbdlist) {
                ywxq.push(n.prodcount);
                jcjs.push(n.basecount);
                rcrw.push(n.edalcount);
                jsxq.push(n.techcount);
              }
            }
            break;
          }
        }
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {      // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'    // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['基础建设', '日常任务', '技术需求', '业务需求']
          },
          dataZoom:[
            {
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 30,
              height: '80%',
              start:70,
              end:100,
              showDataShadow: false,
              left: '93%'
            }

          ],
          grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: person
          },
          series: [{
            name: '基础建设',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
//                show: true,
                position: 'insideRight'
              }
            },
            data: jcjs
          }, {
            name: '日常任务',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
//                show: true,
                position: 'insideRight'
              }
            },
            data: rcrw
          }, {
            name: '技术需求',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
//                show: true,
                position: 'insideRight'
              }
            },
            data: jsxq
          }, {
            name: '业务需求',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
//                show: true,
                position: 'insideRight'
              }
            },
            data: ywxq
          }]
        }
      },
      //应用完成状态的配置
      setComplete(data){
        let complete = this.$echarts.init(document.getElementById("complete"));
        complete.clear();
        complete.setOption(this.completeOption(data));
      },
      //全屏查看功能
      fullScreen(){
        if(!this.fullStatus){
          let element = document.documentElement;
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {//火狐
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {//谷歌
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {//ie
            element.msRequestFullscreen();
          }
          element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);//全屏状态允许键盘输入
        }else{
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozExitFullScreen) {
            document.mozExitFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
        setTimeout(()=>{
          this.calculateFullScreen()
        },500)
      },
      calculateFullScreen(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        let mainr = document.querySelector(".mainr");
        let card =document.querySelector(".common-card-wrap");
        let card_body = document.querySelector(".box-card .el-card__body");
        if(!this.fullStatus){
          mainr.style.width = width+"px";
          mainr.style.height = height+"px";
        }else{
          mainr.style.height = height-50+"px";
          mainr.style.width = width-224+"px";
        }
        if(!this.fullStatus){
          mainr.style.left = 0;
          mainr.style.top = 0;
          mainr.style.padding = 0;
          card.style.paddingRight = 0;
          card_body.style.height = height+"px";
        }else{
          mainr.style.left = 224+"px";
          mainr.style.top = 50+"px";
          mainr.style.padding = "17px 0 17px 17px";
          card.style.paddingRight = 17+"px";
          card_body.style.height = height-36-50+"px";
        }
        this.fullStatus = !this.fullStatus;
      }
    }
  }
</script>
<style scoped>
  .chart-wrap h2 {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    line-height: 30px;
  }
  .four-pie {
    margin-top: 30px;
  }
  .four-pie div {
    width: 25%;
    height: 400px;
    float: left;
  }
  .setting-wrap {
    position: absolute;
    padding-top: 10px;
    left: 30px;
    top: 18px;
    z-index: 10;
  }
  .el-form-item{
    margin-bottom:0;
  }
  .track{
    height: 200px;
    margin-top:20px;
    overflow-y: auto;
  }
  .track li{
    line-height: 25px;
  }
  .hasview{
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  margin-top:10px;
  }
  .noview{
  text-align: center;
  color: #cacaca;
  font-weight: 900;
  font-size: 18px;
  margin-top:10px;
  }
</style>
