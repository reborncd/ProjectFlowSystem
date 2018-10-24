<style scoped>

</style>

<template>
    <div>
        <quill-editor :content="reform" v-model="reform_model" @change="ssss"></quill-editor>
    </div>
</template>

<script>
    export default {
        props:["reform"],
        data(){
            return {
                reform_model:""
            }
        },
        methods: {
            ssss: function () {
                this.$emit("setValue",this.reform_model);
            }
        }
    }
</script>