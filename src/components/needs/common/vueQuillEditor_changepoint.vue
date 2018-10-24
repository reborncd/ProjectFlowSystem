<style scoped>

</style>

<template>
    <div>
        <quill-editor :content="changepoint" v-model="changepoint_model" @change="ssss" :options="editorOption"></quill-editor>
    </div>
</template>

<script>
    export default {
        props:["changepoint"],
        data(){
            return {
                changepoint_model:"",
                editorOption:{}
            }
        },
        methods: {
            ssss: function () {
                this.$emit("setValue",this.changepoint_model);
            }
        }
    }
</script>