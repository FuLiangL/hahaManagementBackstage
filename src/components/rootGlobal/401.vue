<template>
    <div class="errPage-container">
        <el-row>
            <el-col :span="1">
                <span>&nbsp;</span>
            </el-col>
            <el-col :span="11">
                <h2>你没有权限进入该页面！</h2>
                <h2>如需权限更改，请联系管理员！</h2>
                <el-button @click="back" type="primary" class="pan-back-btn">返回</el-button>
                <el-button @click.prevent="dialogVisible=true" type="primary" href="#">美图欣赏</el-button>
            </el-col>
            <el-col :span="12">
                <img src="../../assets/401.gif" width="313" height="428" alt="Girl has dropped her ice cream." >
            </el-col>
        </el-row>
        <el-dialog title="随便看" :visible.sync="dialogVisible" size="large">
            <img class="pan-img" :src="ewizardClap">
        </el-dialog>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                errGif: '../../assets/401.gif',
                ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
                dialogVisible: false
            }
        },
        methods: {
            back() {
                if (this.$route.query.noGoBack) {
                    this.$router.push({ path: '/dashboard' });
                } else {
                    this.$router.go(-1);
                }
            }
        }
      };
</script>

<style lang="css">
.girl {
    background-image: url(../../assets/401.gif);
    background-size: cover;
}
</style>
