<style scoped>

</style>

<template>
    <div>
        <el-dialog :title="download.title" :visible="download.visible" width="60%"
                   append-to-body modal-append-to-body
                   :before-close="closeDialog">
            <div class="table-list">
                <el-table :data="download.data" border style="width: 100%">
                    <el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="size" label="大小" width="120" :formatter="sizeFormat"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="downloadModel(scope.row)">下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:["download"],
        data(){
            return {

            }
        },
        methods:{
            closeDialog(){
                this.download.visible  = false;
            },
            //-----------------------------------下载用例模板和手册
            downloadModel(val){
                this.$axios.get(`/${this.download.url?this.download.url:'base'}/download/?${this.download.id?'id':'ID'}=${val.id}&token=${this.$getToken()}`);
            },
            //大小过滤器
            sizeFormat(row){
                let size = row.size;
                if(size<1024){
                    return size+"B"
                }else
                if(size>=1024 && size <=1024*1024){
                    return parseFloat(size/1024).toFixed(2)+"KB"
                }else{
                    return parseFloat(size/1024/1024).toFixed(2)+"MB"
                }
            }
        },
        computed: {

        }
    }
</script>
