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
  .i-b{
    position: absolute;
    top: 90px;
  }
	.search {
		float: right;
	}
</style>

<template>
	<div class="workreport common-card-wrap" style="height: 100%;">
		<el-card class="box-card" >
			<div slot="header" class="clearfix">
				<span class="card-title">系统配置</span>
			</div>
			<div class="action clear" style="margin-top: 30px;">
				<el-button size="mini" v-if="powerObj.add" @click="addConfig" type="primary">新增</el-button>
        <el-button size="mini" v-if="powerObj.update" @click="updateConfig" type="primary">修改</el-button>
        <el-button size="mini" v-if="powerObj.delete" @click="deleteConfig" type="primary">移除</el-button>
			</div>
      <div class="fr" style="margin-left: 10px;">
        <div class="i-b" style="right:400px;">
          <el-input clearable @keyup.13="searchHandle" v-model="searchKey" placeholder="输入键值查询"></el-input>
        </div>
        <div class="i-b" style="right:200px;">
          <el-input clearable @keyup.13="searchHandle" v-model="searchName" placeholder="输入名称查询"></el-input>
        </div>
        <div class="search i-b" style="right:40px;top:100px;">
          <el-button size="mini" type="primary" @click="searchHandle">查询
          </el-button>
          <el-button size="mini" type="primary" @click="resetHandle">重置
          </el-button>
        </div>
      </div>
			<div class="text item workreport-wrapper">
				<div class="report-statistics clear">
					<div class="report-list" style="margin-top: 10px;">
						<div class="table-list">
							<el-table :data="showData" style="width: 100%">
                <el-table-column label="" width="65">
                    <template scope="scope">
                        <el-radio :label="scope.row.id" v-model="templateRadio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
                    </template>
                </el-table-column>
								<el-table-column prop="key" label="键值"></el-table-column>
								<el-table-column prop="name" label="名称"></el-table-column>
								<el-table-column prop="value" label="数值"></el-table-column>
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
					</div>
				</div>
			</div>
		</el-card>
    <el-dialog :close-on-click-modal="false" title="系统配置" :visible="config.visiable" width="40%"
           append-to-body modal-append-to-body
           :before-close="closeDialog">
      <el-form>
        <el-form-item label="键值">
          <el-input v-model="config.key" placeholder="请输入键值"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="config.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="数值">
          <el-input v-model="config.value" placeholder="请输入数值"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="config.visiable=false;" type="danger" size="mini" >取消</el-button>
        <el-button @click="confirmHandle" type="primary" size="mini">确定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
        searchKey:'',
        searchName:'',
        config:{
          visiable:false,
          key:'',
          name:'',
          value:''
        },
        powerObj:{
          add:'',
          delete:'',
          select:'',
          update:''
        },
        updateFlag:false,
        showData:[],
        templateRadio:'',
        homeDisabled:false,
        prevDisabled:false,
        nextDisabled:false,
        endDisabled:false,
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 15,
        total:'',
        maxPageNumber: null,
			}
    },
    computed:{
      computedValue:function(){
        let type=true;
        if(this.searchKey == "" && !this.searchName){
          type=false;
        }else{
          type=true;
        }
        return type
      }
    },
    watch:{
      computedValue:function(value,old){
        !value && this.loadData();
      }
    },
		mounted() {
      this.loadData();
		},
		methods: {
      loadData(){
        let params = new URLSearchParams();
        params.append('page',this.currentPageNumber);
        params.append('pageSize',this.defaultPageSize);
        this.$maskin();
        this.$axios.post('config/query',params).then(res=>{
          let data=res.data;
          if(data.code=200){
            this.$maskoff();
            this.resetDisabled(false,false,false,false);
            this.total=data.result.total;
            this.showData=data.result.result;
            this.powerObj.add=data.result.add;
            this.powerObj.delete=data.result.delete;
            this.powerObj.select=data.result.select;
            this.powerObj.update=data.result.update;
          }
        })
      },
      // 搜索
      searchHandle(){
        if(!this.searchKey && !this.searchName){
          return this.$warn('请至少输入一项查询条件');
        }
        let params = new URLSearchParams();
        params.append('page',this.currentPageNumber);
        params.append('pageSize',this.total);
        params.append('key',this.searchKey);
        params.append('name',this.searchName);
        this.$maskin();
        this.$axios.post('config/query',params).then(res=>{
          let data=res.data;
          if(data.code=200){
            this.$maskoff();
            this.resetDisabled(true,true,true,true);
            this.showData=data.result.result;
            this.powerObj.add=data.result.add;
            this.powerObj.delete=data.result.delete;
            this.powerObj.select=data.result.select;
            this.powerObj.update=data.result.update;
          }
        })
      },
      // 重置
      resetHandle(){
        this.templateRadio='';
        this.clearAddData();
      },
      // 关闭弹窗
      closeDialog(){
        this.config.visiable=false;
      },
      // 新增弹窗
      addConfig(){
        this.clearAddData();
        this.updateFlag=false;
        this.config.visiable=true;
      },
      clearAddData(){
        this.config.key='';
        this.config.name='';
        this.config.value='';
        this.searchKey='';
        this.searchName='';
      },
      // 新增确认
      confirmHandle(){
        let params = new URLSearchParams();
        params.append('key',this.config.key);
        params.append('name',this.config.name);
        params.append('value',this.config.value);
        this.$maskin();
        if(this.updateFlag){
          params.append('id',this.templateRadio);
          this.$axios.post('/config/update',params).then(res=>{
            let data = res.data;
            if(data.code=200){
              this.config.visiable=false;
              this.$maskoff();
              this.$success(data.message);
              this.loadData();
            }
          })
        }else{
          this.$axios.post('/config/add',params).then(res=>{
            let data = res.data;
            if(data.code=200){
              this.config.visiable=false;
              this.$maskoff();
              this.$success(data.message);
              this.loadData();
            }
          })
        }
      },
      // 获取配置
      getConfig(){
        let params = new URLSearchParams();
        params.append('id',this.templateRadio);
        this.$maskin();
        this.$axios.post('/config/getConfig',params).then(res=>{
          let data = res.data;
          if(data.code=200){
            this.$maskoff();
            this.config.key=data.result.key;
            this.config.name=data.result.name;
            this.config.value=data.result.value;
          }
        })
      },
      // 修改
      updateConfig(){
        if(!this.templateRadio){
          return this.$warn('请选择要修改的配置');
        }
        this.updateFlag=true;
        this.getConfig();
        this.config.visiable=true;
      },
      // 删除
      deleteConfig(){
        if(!this.templateRadio){
          return this.$warn('请选择要移除的配置');
        }
        this.confirm("确定进行移除操作吗？", () => {
          this.$maskin();
          let params = new URLSearchParams();
          params.append('id',this.templateRadio);
          this.$axios.post("/config/delete", params).then((res) => {
            let data = res.data;
            if (data.code == 200) {
              this.$success(data.message);
              this.$maskoff();
              this.loadData();
            }
          })
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
    }
	}
</script>
