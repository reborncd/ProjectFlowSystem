<style scoped>

</style>

<template>
    <div>
        <input type="file" multiple ref="upload" @change="shanghcuan($event)">
        <button @click="tijiao">提交</button>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                fileliist:[]
            }
        },
        methods: {
            shanghcuan(e){
                this.fileliist = e.target.files
            },
            tijiao(){
                let  ref = this.fileliist;
                this.postAjax({
                    url:"http://172.16.2.25:8989/JiFu_Project/base/upload",
                    data:{
                        file:ref[0]
                    },
                    success(data){
                    }
                })
            },
            postAjax(url,_data,fun){
               let data = new FormData()
                data.append("file",_data.file)
                data.append("token","f93fefb4b6564e32946757b93a4de077")
                var xhr;
                xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {  //状态等于4的时候返回值
                        if(xhr.status == 200){//正常状态
                            var get_data = JSON.parse(xhr.responseText);
                            fun(get_data)
                        } else {//错误
                            var get_data = JSON.parse(xhr.responseText);
                            fun(get_data)
                        }
                    }
                };
                xhr.open('post',url, true);
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhr.send(data);
            }
        }
    }
</script>