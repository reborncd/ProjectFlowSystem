<template>
  <el-col :span="24" class="mainr-index">
    <div :style="topHeight">
      <el-col :span="18">
        <!--滚动字幕-->
        <div class="grid-content bg-purple box-wrap scroll-wrap mr por">
          <i class="iconfont icon-laba"></i>
          <ul class="scrollContent">
            <!-- <li v-if="will_delay.length"><strong>临限项目时间节点</strong></li>
            <li @mouseover="scrollMouseover" @mouseleave="setInterval" v-for="(item, index) in will_delay" :key="index">
              <p>{{item.failtask}}</p>
            </li>
            <li v-if="has_delay.length"><strong>超过项目时间节点</strong></li>
            <li @mouseover="scrollMouseover" @mouseleave="setInterval" v-for="(item, index) in has_delay" :key="index">
              <p>{{item.failtask}}</p>
            </li> -->
            <li><strong>系统优化公告：</strong></li>
            <li @mouseover="scrollMouseover" @mouseleave="setInterval" v-for="(item, index) in notice" :key="index">
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
        <!--<el-col :span="24">-->
        <!--待办事项-->
        <el-col :span="15">
          <div class="box-wrap mr mt">
            <el-card class="box-card top_card">
              <div slot="header" class="clearfix">
                <span class="card-title">待办事项</span>
              </div>
              <ul class="text item">
                <li v-for="(item, index) in todo" @click="goPage(item)" :key="index">
                  <div class="icon-box"><i class="anticon icon-right"></i></div>
                  <h4 class="content-title">{{srcRoute[item.neel_TYPE]}}
                    <!-- <marquee  scrollAmount=4><span>测试需求名称滚动</span></marquee> -->
                    <span class="date fr">{{item.work_TIME | date}}</span>
                  </h4>
                  <p class="content">{{item.main_DESC}}</p>
                </li>
              </ul>
            </el-card>
          </div>
        </el-col>
        <!--经办事项-->
        <el-col :span="9">
          <div class="box-wrap mr mt">
            <el-card class="box-card top_card">
              <div slot="header" class="clearfix">
                <span class="card-title">经办事项</span>
              </div>
              <ul class="text item">
                <li v-for="(item, index) in hasdo" @click="goPage(item)" :key="index">
                  <div class="icon-box"><i class="anticon icon-right"></i></div>
                  <h4 class="content-title">{{srcRoute[item.neel_TYPE]}}
                    <span class="date fr">{{item.work_TIME | date}}</span>
                  </h4>
                  <p class="content">{{item.main_DESC}}</p>
                </li>
              </ul>
            </el-card>
          </div>
        </el-col>
        <!--</el-col>-->
      </el-col>
      <!-- <el-col :span="6">
          <div class="box-wrap mr mt">
            <el-card class="box-card top_card">
              <div slot="header" class="clearfix">
                <span class="card-title">经办事项</span>
              </div>
              <ul class="text item">
                <li v-for="(item, index) in hasdo" @click="goPage(item)" :key="index">
                  <div class="icon-box"><i class="anticon icon-right"></i></div>
                  <h4 class="content-title">{{srcRoute[item.neel_TYPE]}}
                    <span class="date fr">{{item.work_TIME | date}}</span>
                  </h4>
                  <p class="content">{{item.main_DESC}}</p>
                </li>
              </ul>
            </el-card>
          </div>
        </el-col> -->
      <!--日期插件-->
      <el-col :span="6">
        <div class="grid-content bg-purple box-wrap  mr" style="box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
          <date-plug
            :todoTaskDateList="todoTaskDateList"
          ></date-plug>
        </div>
        <div class="box-wrap mr mt">
          <el-card class="box-card top_card">
            <div slot="header" class="clearfix">
              <span class="card-title">系统操作规范</span>
              <span @click="downloadFile(item.id)" class="card-title" title="点击可下载" style="cursor:pointer;font-size:14px;color:#000;text-align:center;" v-for="(item,index) in fileList" :key="index">{{item.name}}</span>
            </div>
            <ul>
              <li v-for="(item, index) in standard" :key="index">
                <p class="content">{{item.title}}</p>
              </li>
            </ul>
          </el-card>
        </div>
      </el-col>
    </div>
    <div :style="bottomHeight">
      <el-col :span="24" style="height: 100%">
        <!-- <el-col :span="8" v-show="zhou" style="height: 100%">
          <div class="box-wrap mr mt">
            <el-card class="box-card bottom_card">
              <div slot="header" class="clearfix">
                <span class="card-title">一周工作动态</span>
              </div>
              <div id="dynamic" class="echarts-warp"></div>
            </el-card>
          </div>
        </el-col> -->
        <!-- <el-col :span="8" v-show="zi" style="height: 100%">
          <div class="box-wrap mr mt">
            <el-card class="box-card bottom_card">
              <div class="chartTitle">
                <div
                  v-for="(item, index) in this.show.dept_NAME"
                  :key="item">
                  {{index + 1}}. {{show.dept_NAME[show.dept_NAME.length - index - 1]}}
                </div>
              </div>
              <div slot="header" class="clearfix">
                <span class="card-title">资源动态</span>
              </div>
              <div id="asset" class="echarts-warp"></div>
            </el-card>
          </div>
        </el-col> -->
        <!--操作日志-->
        <!-- <el-col :span="8" v-if="false" style="height: 100%">
          <div class="box-wrap mr mt">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="card-title">操作日志</span>
              </div>

              <ul class="text item">
                <li v-for="(item, index) in operLog"  :key="index">
                  <div class="icon-box"><i class="anticon icon-right"></i></div>
                  <h4 class="content-title">{{item.record_SUBJECT}}
                    <span class="date fr">{{item.record_START | date}}</span>
                  </h4>
                  <p class="content">{{item.record_DESC}}</p>
                </li>
              </ul>
            </el-card>
          </div>
        </el-col> -->
      </el-col>
    </div>
  </el-col>
</template>
<script>
  import datePlug from "./datePlug.vue";
  import moment from "moment";
  export default {
    data() {
      return {
        fileList:[],
        notice:[],
        standard:[],
        scrollStyle_y: 0,
        interval: "",//滚动字幕定时器
        scrollHeight: "",
        scrollWrap: "",//滚动字幕warp
        topHeight: "",//上部分的高度
        bottomHeight: "",//底部的高度
        has_delay: [],//已经延期
        will_delay: [],//将要延期
        todo: [],//待办事项
        todoTaskDateList: [],
        operLog: [],//操作日志
        srcRoute: {
          "1": "业务需求",
          "2": "技术需求",
          "3": "基础建设",
          "4": "日常任务",
          "5": "故障列表",
          "6": "BUG列表",
          "7": "上线管理",
          "8": "事件处理",
          "9": "权限申请",
          "10": "BUG列表"
        },//待办事项的标题数组
        hasdo: [],//经办事项
        show: {
          time: [],//时间
          comcount: [],//当日完成
          dcount: [],//当日执行
          scount: [],//当日固有
          newscount: [],//当日新增

          dept_NAME: [],//部门名称
          kocount: [],//空闲
          mcount: [],//忙碌
          sumcount: [],//人数
        },
        zhou: false,//一周工作动态判断
        zi: false,//资源动态判断
        logSize: 24,//操作日志的宽度
      }
    },
    components: {
      "date-plug": datePlug
    },
    //此处如果不写会一直触发定时器的错误，要在组建销毁前清除定时器并且在进入页面的时候清除定时器，
    // 在数据加载完成后再启动定时器
    destroyed() {
      this.clearInt();
      this.notice=[];
    },
    mounted() {
      this.loadData();
      this.getFile();
      this.getNotice();
      this.getStandard();
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
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
      },
    },
    methods: {
      getNotice(){
        let params=new URLSearchParams();
        params.append('type','1');
        this.$axios.post("/user/getNotices",params).then((res)=>{
          if(res.data.code){
            this.notice=res.data.result;
          }
        })
      },
      getStandard(){
        let params=new URLSearchParams();
        params.append('type','2');
        this.$axios.post("/user/getNotices",params).then((res)=>{
          if(res.data.code){
            this.standard=res.data.result;
          }
        })
      },
      getFile(){
        let params=new URLSearchParams();
        params.append('fileType','DOC');
        this.$axios.post("/daily/getAttachmentsByType",params).then((res)=>{
          if(res.data.code=200){
            this.fileList=res.data.result;
          }
        })
      },
      downloadFile(id){
        window.open(`${window._options.baseUrl}/daily/download?token=${this.$getToken()}&ID=${id}`);
      },
      calculate() {
        let height = document.getElementsByClassName("mainr")[0].offsetHeight;
        let scrollBanner = document.querySelector(".scroll-wrap");
        let card_header_height = document.querySelector(".el-card__header").offsetHeight;
        let top_card_body = document.querySelectorAll(".top_card .el-card__body");
        let bottom_card_body = document.querySelectorAll(".bottom_card .el-card__body");
        let dateWrap = document.getElementById("schedule-box");
        //设置上半部分高度
        this.topHeight = {
          //  总高度-上下padding-10的下外边距
          height: (height - 34 - 10) * 0.6 + "px",
          "margin-bottom": "10px"
        };
        //设置下半部分高度
        this.bottomHeight = {
          //  总高度-上下padding
          height: (height - 34 - 10) * 0.4 + "px"
        };
        //设置滚动字幕高度                 截取上半部分0.35的高度
        scrollBanner.style.height = (height - 34 - 10) * 0.6 * 0.35 + "px";
        //设置日期的高度
        dateWrap.style.height = (height - 34 - 10) * 0.45 + "px";
        //设置中间三个卡片高度
        for (let i of top_card_body) {
          //                    截取上半部分0.65的高度   -   卡片头部的高度-卡片border-滚动字幕的下外边距10px
          i.style.height = ((height - 34 - 10) * 0.60 * 1.4) - card_header_height - 1 - 10 + "px";
        }
        //设置下面三个卡片高度
        for (let i of bottom_card_body) {
          //                    截取下半部分100%的高度      -   卡片头部的高度
          i.style.height = ((height - 34 - 10) * 0.4) - card_header_height - 1 + "px";
        }
        let echarts_wrap = document.querySelectorAll(".echarts-warp");
        for (let i of echarts_wrap) {
          //                    截取下半部分100%的高度      -   卡片头部的高度
          i.style.height = ((height - 34 - 10) * 0.4) - card_header_height - 1 + "px";
        }

      },
      //加载数据
      loadData() {
        setTimeout(() => {
          this.calculate();
        }, 200)
        this.$maskin();
        let params = new URLSearchParams();
        //加载待办事项
        this.$axios.post("/main/queryMatter", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            //main待办事项
            this.$set(this, "todo", data.result.main.sort((a,b) => a.work_TIME < b.work_TIME?1:-1));
            //main待办事项日期列表
            this.$set(this, "todoTaskDateList", [...new Set(Array.from(data.result.main, item => moment(item.work_TIME).format('YYYY-MM-DD')))]);
            //havaMain经办事项
            this.$set(this, "hasdo", data.result.havaMain.sort((a,b) => a.work_TIME < b.work_TIME?1:-1));
            //操作日志
            this.$set(this, "operLog", data.result.operLog.sort((a,b) => a.record_START < b.record_START? 1 : -1));
          }
        });
        //加载轮播图
        this.$axios.post("/main/queryTask", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            //判断权限
            data.result.MAIN_ZHOU ? this.zhou = true : this.zhou = false;
            data.result.MAIN_ZI ? this.zi = true : this.zi = false;
            if (this.zi && this.zhou) {
              this.logSize = 8;
            } else if (this.zi || this.zhou) {
              this.logSize = 16;
            } else if (!this.zi && !this.zhou) {
              this.logSize = 24;
            }
            //将要延期
            this.$set(this, "will_delay", data.result.willTask);
            //已经延期
            this.$set(this, "has_delay", data.result.failTask);
            this.setInterval();
            this.$maskoff();
          }
        });
        //一周动态
        this.$axios.post("/main/datecount", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let dataArr = []
            let comcount = []
            let dcount = []
            let scount = []
            let newscount = []
            for (let i of data.result) {
              dataArr.push(i.dates);
              comcount.push(i.comcount);
              dcount.push(i.dcount);
              scount.push(i.scount);
              newscount.push(i.newscount);
            }
            this.$set(this.show, "time", dataArr);
            this.$set(this.show, "comcount", comcount);
            this.$set(this.show, "dcount", dcount);
            this.$set(this.show, "scount", scount);
            this.$set(this.show, "newscount", newscount);
            this.showDong()
            this.$maskoff();
          }
        })
        //资源动态
        this.$axios.post("/main/usercount", params).then((res) => {
          let data = res.data;
          if (data.code == 200) {
            let dept_NAME = []
            let kocount = []
            let mcount = []
            let sumcount = []
            for (let i of data.result) {
              dept_NAME.push(i.dept_NAME);
              kocount.push(i.kocount);
              mcount.push(i.mcount);
              sumcount.push(i.sumcount);
            }
            this.$set(this.show, "dept_NAME", dept_NAME);
            this.$set(this.show, "kocount", kocount);
            this.$set(this.show, "mcount", mcount);
            this.$set(this.show, "sumcount", sumcount);
            this.showZi()
            this.$maskoff();
          }
        })
      },
      //动态
      showDong(){
        setTimeout(()=>{
        let dynamic_wrap = document.getElementById("dynamic");
        let dynamic_chart = this.$echarts.init(dynamic_wrap);
        // 指定图表的配置项和数据
        let optionweek = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['当前新增需求', '当日完成需求', '当日执行任务', '当日留存需求']
          },
          xAxis: [
            {
              type: 'category',
//                      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
              data: this.show.time,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              min: 0,
              max: 20,
              interval: 3,
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '当前新增需求',
              type: 'bar',
              data: this.show.newscount
            },
            {
              name: '当日完成需求',
              type: 'bar',
              data: this.show.comcount
            },
            {
              name: '当日执行任务',
              type: 'bar',
              data: this.show.dcount
            },
            {
              name: '当日留存需求',
              type: 'line',
              yAxisIndex: 1,
              data: this.show.scount
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
          dynamic_chart.setOption(optionweek);
        },1000)
      },
      showZi(){
        setTimeout(()=>{
        let asset_wrap = document.getElementById("asset");
        let asset_chart = this.$echarts.init(asset_wrap);
        let optionresources = {
          angleAxis: {},
          radiusAxis: {
            type: 'category',
            // data: new Array(this.show.dept_NAME.length).fill(''),//组的数量
            data: Array.from(new Array(this.show.dept_NAME.length), (x, i) => this.show.dept_NAME.length - i),
            z: 10
          },
          polar: {},
          series: [{
            type: 'bar',
            data: this.show.kocount,
            coordinateSystem: 'polar',
            name: '空闲',
            stack: ''
          }, {
            type: 'bar',
            data: this.show.mcount,
            coordinateSystem: 'polar',
            name: '忙碌',
            stack: ''
          }],
          legend: {
            show: true,
            data: ['空闲', '忙碌'],
            left: 'right',
            orient: 'vertical'
          }
        };
          asset_chart.setOption(optionresources);
        },1000)
      },
      //------------------------设置轮播图的效果
      //移动到轮播图上移除定时器
      setInterval() {
        this.interval = setInterval(() => {
          let scrollWrap = document.getElementsByClassName("scrollContent")[0];
          let scrollHeight = scrollWrap.offsetHeight;
          this.scrollStyle_y--;
          if (-this.scrollStyle_y >= scrollHeight + 20) {
            //122是容器scrollWrap的高
            this.scrollStyle_y = 122
          } else {
            scrollWrap.style.transform = `translate(0,${this.scrollStyle_y}px)`
          }
        }, 50)
      },
      scrollMouseover() {
        this.clearInt()
      },
      clearInt() {
        clearInterval(this.interval)
      },
      //-----------------------点击待办事项跳转页面
      goPage(val) {
        console.log(val);
        let url = "";
        let query = ""
        switch (val.neel_TYPE) {
          case 1://业务需求
            url = "业务需求";
            break;
          case 2://技术需求
            url = "技术需求";
            break;
          case 3://基础建设
            url = "基础建设";
            break;
          case 4://日常任务
            url = "日常任务";
            break;
          case 5://故障列表
            url = "故障列表";
            break;
          case 6://BUG列表
            url = "BUG列表";
            break;
          case 7://BUG列表
            url = "上线管理";
            break;
          case 8://日常事件
            url = "事件处理";
            break;
          case 9://权限申请
            url = "权限申请";
            break;
          case 10://bug
            url = "BUG列表";
            break;
        }
//        let params = new URLSearchParams();
//        params.append("ID",val.nell_ID);
//        this.$axios.post(query,params).then((res)=>{
//        	let data =res.data;
//        	if(data.code == 200){
            //跳转页面
            console.log(val)
            this.$go("", "", {
            	"neelId":val.nell_ID,
//              "neelPage":data.result.page
            }, url);
//          }
//        <!--});-->
      },
      focus() {

      }
    }
  }
</script>
<style scoped>
  .chartTitle {
    position: absolute;
    font-size: 12px;
    color: #381414;
  }

  .icon-box {
    position: absolute;
    width: 20px;
    height: calc(100% - 12px);
  }
  .icon-box .icon-right {
    font-size: 13px;
  }

  .card-title {
    font-weight: bold;
  }

  .mr {
    margin-right: 15px;
  }

  .ml {
    margin-left: 15px;
  }

  .mb {
    margin-bottom: 15px;
  }

  .mt {
    /*margin-top: 15px;*/
  }

  .box-wrap {
    border-top: 1px solid #dc554f;
  }

  .mainr-index {
    width: 100%;
    height: 100%;
  }

  /*滚动字幕*/
  .scroll-wrap {
    background: url("../../static/image/index_bg.png") no-repeat center;
    background-size: cover;
    padding-left: 60px;
    padding-top: 20px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .scroll-wrap .iconfont {
    position: absolute;
    left: 0;
    top: 12px;
    width: 60px;
    font-size: 18px;
    color: white;
    text-align: center;
  }

  .scrollContent {
    color: white;
    line-height: 20px;
  }

  .scrollContent li {
    margin-bottom: 8px;
    padding-right: 20px;
  }

  .scrollContent li p {
    cursor: pointer;
  }

  .scrollContent li p:hover {
    text-decoration: underline;
  }

  .scrollContent li strong {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  /*日期插件*/
  .date-wrap {
    background: #777;
  }

  /*待办事项登卡片*/

  .box-card ul li {
    position: relative;
    line-height: 20px;
    font-size: 14px;
    cursor: pointer;
    /* min-height: 56px; */
    max-height: 76px;
    /* padding-top: 6px;
    padding-bottom: 6px; */
    box-sizing: border-box;
    border-top: 1px dashed #ddd;
  }

  .box-card ul li:first-child {
    border-top: 0px dashed #ddd;
  }

  .box-card ul .dian {
    position: absolute;
    left: 5px;
    top: 8px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ccc;
  }

  .box-card ul .content-title {
    margin-left: 20px;
    color: #222;
  }

  .box-card ul .content-title span.date {
    color: #999999;
    font-size: 12px;
  }

  /*内容部分*/

  .box-card ul .content {
    letter-spacing: 0.4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 20px;
    max-height: 40px;
    overflow: hidden;
    color: #666;
    margin-top: 4px;
    margin-left: 20px;

  }
</style>
