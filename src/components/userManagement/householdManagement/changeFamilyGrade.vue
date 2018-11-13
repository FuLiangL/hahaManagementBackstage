<template>
    <!-- 家族等级修改 -->
    <!-- dom结构内容 -->
    <section>

        <!-- Form -->
        <div class="container">
            <div class="setForm">
                <el-form :model="form">
                    <p class="bindingTitle" style="color: red;">用户须知：<br>1、请参考右侧表格(+或-荣耀值)进行调整家族等级！<br> 2、增加荣耀值可升级家族等级；负值为扣除荣耀值，降低家族等级！
                    </p>
                    <el-form-item class="input_uid" label="家族ID：" >
                        <el-input style="width:400px;" v-model="form.uid" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item class="input_uid" label="家族等级" >
                        <el-input style="width:400px;" v-model="form.level" placeholder="输入要升级的家族等级" auto-complete="off"></el-input>
                        <p class="title">比如：3 表示升级到3级家族。</p>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelFamily()">取 消</el-button>
                    <el-button type="primary" @click="gradeFamily()">确 定</el-button>
                </div>
            </div>
            <div class="familyRule">
                <template>
                    <el-table border :data="tableData" style="width: 100%">
                        <el-table-column prop="date" label="家族等级">
                        </el-table-column>
                        <el-table-column prop="name" label="荣耀值" width="180">
                        </el-table-column>
                        <el-table-column prop="address" label="人数上限">
                        </el-table-column>
                    </el-table>
                </template>
            </div>
        </div>

    </section>
</template>

<script>
import { allget } from "../../../api/api.js";
export default {
    data() {
        return {
            tableHeight: null, // table展示的页面的高度多少，第二页中对应高度
            form: {
                uid: null,
                level: null,
            },
            tableData: [
                {
                    date: "1",
                    name: "荣耀值＜2000",
                    address: "30人"
                },
                {
                    date: "2",
                    name: "2000≤荣耀值＜10000",
                    address: "40人"
                },
                {
                    date: "3",
                    name: "10000≤荣耀值＜50000",
                    address: "50人"
                },
                {
                    date: "4",
                    name: "50000≤荣耀值＜200000",
                    address: "100人"
                },
                {
                    date: "5",
                    name: "200000≤荣耀值＜1000000",
                    address: "150人"
                },
                {
                    date: "6",
                    name: "1000000≤荣耀值",
                    address: "200人"
                },
            ]
        };
    },
    methods: {
        //升级家族
        gradeFamily() {
            var _this = this;
            let url = "/NewFamily/upFamilyLevel";
            let param = {
                family_id: this.form.uid,
                level: this.form.level,
            };
            allget(param, url)
                .then(res => {
                    console.log(res.data)
                    if (res.data.ret) {
                        baseConfig.successTipMsg(_this,res.data.msg);
                    }else{
                        baseConfig.warningTipMsg(_this,res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        cancelFamily() {
            // alert(1)
            this.param.uid = "";
            this.param.level = "";
        }
    },
    mounted() {
        this.tableHeight = leftNavHeight;
    }
};
</script>

<style lang="css" scoped>
.container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    margin-top: 20px;
    /* text-align: center; */
    /* border: 1px solid orangered; */
    overflow: hidden;
}
.setForm {
    float: left;
    width: 500px;
    height: 400px;
    padding-left: 20px;
    margin-left: 100px;
    border: 1px solid #999;
}
.familyRule {
    float: left;
    width: 400px;
    height: 400px;
    margin-left: 100px;
    border: 1px solid #aaa;
}
.input_uid {
    text-align: center;
    margin-top: 30px;
}
.dialog-footer {
    text-align: center;
    margin-top: 40px;
}
.title{
    color: #999;
    text-align: left;
    margin-left: 90px;
}
</style>
