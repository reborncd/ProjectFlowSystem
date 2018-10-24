/* ************************************************
Author: ct
** ***********************************************/
<template>
  <div class="MyCheckboxComp">
    <el-checkbox-group v-model="selectModel">
      <el-checkbox
        :label="parseInt(item.id)"
        v-for="item in itemList"
        @change="selectChange(item)"
        placeholder="请输入其它选项值"
        :key="item.id">
        {{item.name}}
        <el-input size="mini" v-if="item.name === '其他' && showInput" v-model="inputModel"></el-input>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<style lang="less">
</style>
<script>
  import moment from 'moment';
  import cloneDeep from 'lodash/cloneDeep';
  export default {
    name: 'MyCheckboxComp',
    props: {
      selectData: {
        type: Array,
        default: []
      },
      inputData: {
        type: String,
        default: ''
      },
      itemList: {
        type: Array,
        default: []
      },
      config: {
        type: Array
      },
      flag:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        flag:false,
        showInput: false,
        selectModel: cloneDeep(this.selectData),
        inputModel: cloneDeep(this.inputData),
      }
    },
    created() {
      this.selectModel.forEach(item => {
        if(item===7){
          this.showInput=true;
        }
      });
    },
    watch: {
      flag:function(data,old){
        // console.log(data)
        if(data){
          this.selectModel=[];
          this.showInput=false;
        }else{
          // console.log(this.selectModel)
          this.selectModel=this.selectData;
          this.showInput=true;
        }
      },
      selectModel: function(data, old){
        this.$emit('updateData', [this.config[0], data]);
      },
      inputModel: function(data, old){
        this.$emit('updateData', [this.config[1], data]);
      },
    },
    methods: {
      selectChange(val){
        console.log(val)
        if(val.name !== '其他')return;
        this.showInput = !this.showInput;
        if(this.showInput === false){
          this.$emit('updateData', [this.config[1], '']);
        }
      },
    }
  }
</script>
