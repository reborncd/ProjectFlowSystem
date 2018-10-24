<template>
	<div class="workreport common-card-wrap" style="height: 100%;">
		<el-card class="box-card" >
			<div slot="header" class="clearfix">
				<span class="card-title">本周上线</span>
			</div>
			<div class="action clear" style="margin-bottom: 30px;">
				<div class="fr" style="margin-left: 20px;">
					<div class="search i-b">
            <el-button size="mini" type="primary" @click="getExcel">导出
						</el-button>
					</div>
				</div>
				<div class="i-b" style="float: right;">
					<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="loadData" v-model="dateRange" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" align="right">
					</el-date-picker>
				</div>
			</div>
      <div class="text item workreport-wrapper">
				<div class="report-statistics clear">
					<div class="report-list" style="margin-top: 10px;">
						<div class="table-list">
							<el-table :data="showData" style="width: 100%">
								<el-table-column prop="NEET_ID" show-overflow-tooltip label="需求编号"></el-table-column>
								<el-table-column prop="NEEL_NAME" show-overflow-tooltip label="需求名称"></el-table-column>
								<el-table-column prop="ONLINE_ID" show-overflow-tooltip label="上线编号"></el-table-column>
                <el-table-column prop="create_time" show-overflow-tooltip label="创建日期"></el-table-column>
                <el-table-column prop="change_type" show-overflow-tooltip label="变更类型"></el-table-column>
                <el-table-column prop="state_golive_name" show-overflow-tooltip label="上线节点"></el-table-column>
                <el-table-column prop="system" show-overflow-tooltip label="涉及系统"></el-table-column>
                <el-table-column prop="change_desc" show-overflow-tooltip label="变更内容"></el-table-column>
                <el-table-column prop="module" show-overflow-tooltip label="上线模块"></el-table-column>
                <el-table-column prop="is_trade" show-overflow-tooltip label="是否停止交易"></el-table-column>
                <el-table-column prop="expect_online_time" show-overflow-tooltip label="预计上线日期"></el-table-column>
                <el-table-column prop="Effect_Time" show-overflow-tooltip label="影响时间/分"></el-table-column>
                <el-table-column prop="project_manager" show-overflow-tooltip label="项目负责人"></el-table-column>
                <el-table-column prop="prod_manager" show-overflow-tooltip label="产品负责人"></el-table-column>
                <el-table-column prop="dev_manager" show-overflow-tooltip label="开发负责人"></el-table-column>
                <el-table-column prop="test_manager" show-overflow-tooltip label="测试负责人"></el-table-column>
                <el-table-column prop="real_online_time" show-overflow-tooltip label="实际上线时间"></el-table-column>
                <el-table-column prop="STATUS_NAME" show-overflow-tooltip label="上线结果"></el-table-column>
							</el-table>
               <!-- 分页添加 -->
            <!-- <div class="table-pagination">
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
            </div> -->
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
  import moment from 'moment';
	export default {
		data() {
			return {
				showData: "",
				dateRange: [], //时间区间
				pickerOptions2: {
					shortcuts: [{
						text: '日报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '周报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * start.getDay());
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '月报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setDate(1);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '年报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setDate(1);
							start.setMonth(0);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 10,
        maxPageNumber: null,
        total:'',
			}
		},
		mounted() {
      if(this.dateRange===null || this.dateRange.length == 0) {
        let end = new Date();
        let start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * start.getDay());
        this.dateRange=[moment(start).format('YYYY-MM-DD'),moment(end).format('YYYY-MM-DD')];
      };
      this.loadData();
    },
		methods: {
      loadData(){
        this.$maskin();
        let params=new URLSearchParams();
        params.append('startDate',this.dateRange[0]);
        params.append('endDate',this.dateRange[1]);
        this.$axios.post('statistical/getOnlineInfoWeek',params).then(res=>{
          let data=res.data;
          if(data.code==200){
            // data.result.forEach(item => {
            //   item.change_type=item.change_type=='1'?'紧急':'常规';
            //   item.is_trade=item.is_trade=='1'?'是':'否';
            // });
            this.showData=data.result;
            this.$maskoff();
          }
        })
      },
      getExcel(){
        let params=new URLSearchParams();
        params.append('startDate',this.dateRange[0]);
        params.append('endDate',this.dateRange[1]);
        window.open(`${window._options.baseUrl}/statistical/exportWFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
      }
		}
	}
</script>
<style scoped>
	@import "../../static/css/table.css";
	@import "../../static/css/console.css";
	/*头部*/

	.report-header .name {
		font-weight: bold;
		font-size: 20px;
	}

	.report-header .el-select {
		float: right;
	}

	.report-header .group {
		color: #9f9f9f;
		margin: 5px 0;
		font-size: 15px;
	}
	/*统计部分*/

	.report-left {
		width: 300px;
		margin-top: 10px;
	}

	.report-statistics h5 {
		font-size: 16px;
		font-weight: 400;
		margin: 5px 0;
	}

	.report-statistics .iconfont {
		color: #5fccac;
		font-size: 20px;
		margin-right: 5px;
	}

	.statistics-content {
		padding-left: 24px;
	}

	.statistics-content p {
		float: left;
		width: 50%;
		line-height: 24px;
	}

	.statistics-content p .key {
		color: #626262;
	}

	.statistics-content p .value {
		color: #dd544e;
	}

	.el-textarea textarea {
		min-height: 80px!important;
	}

	.el-form-item__label {
		width: 120px !important;
	}

	.el-form-item {
		margin-bottom: 0;
	}

	h5 {
		padding-top: 20px;
	}

	.search {
		float: right;
	}
</style>
