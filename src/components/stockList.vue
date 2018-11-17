<template>
<div>
    <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期">
    </el-date-picker>
    <el-button @click="startFilter" type="primary">start</el-button>
    <div>{{stockList.totalLength - stockList.remainLength}}/{{stockList.totalLength}}</div>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="stockList.filterProgress" color="rgba(142, 113, 0, 1)"></el-progress>
    <el-table :data="stockList.tableData" style="width: 100%" :default-sort = "{prop: 'capital', order: 'descending'}">
        <el-table-column prop="companyName" label="公司名称">
        </el-table-column>
        <el-table-column prop="pirce" label="价格">
        </el-table-column>
        <el-table-column prop="increase" sortable label="涨幅">
        </el-table-column>
        <el-table-column prop="capital" sortable label="市值">
        </el-table-column>
        <el-table-column prop="pe" sortable label="市盈率">
        </el-table-column>
    </el-table>
</div>
</template>

  <script>
import { mapGetters, mapState } from "vuex";
import codes from "../stocks";

import algorithms from "../service/stockFilterAlgorithmService.js";

export default {
  data() {
    return {
      selectedDate: ""
    };
  },
  computed: {
    ...mapGetters(["stockList"])
  },
  methods: {
    startFilter() {
      const filterConfig = {
        codes,
        endTimeStamp: this.selectedDate.getTime(),
        algorithm: algorithms.wade,
        concurrencyNumber: 10
      };

      this.$store.dispatch("stockFilter", filterConfig);
    }
  },
  mounted() {
    this.selectedDate = new Date();
  }
};
</script>
