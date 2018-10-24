<style scoped>

</style>

<template>
    <div>
        <quill-editor :content="needsname" v-model="needsname_model" @change="ssss" ref="needsname" ></quill-editor>
    </div>
</template>

<script>
    export default {
        props:["needsname"],
        data(){
            return {
                needsname_model:""
            }
        },
        methods: {
            ssss: function () {
                this.$emit("setValue",this.needsname_model);
            }
        }
    }
</script>