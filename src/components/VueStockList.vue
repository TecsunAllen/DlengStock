<template>
<div>
    <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期">
    </el-date-picker>
    <el-button @click="startFilter" type="primary">start</el-button>
    <div>{{totalLength - remainLength}}/{{totalLength}}</div>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="filterProgress" color="rgba(142, 113, 0, 1)"></el-progress>
    <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'capital', order: 'descending'}">
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
import codes from "../stocks";

export default {
  data() {
    return {
      selectedDate: ""
    };
  },
  computed: {
    totalLength() {
      return this.$store.state.totalLength;
    },
    remainLength() {
      return this.$store.state.remainLength;
    },
    tableData() {
      return this.$store.state.tableData;
    },
    filterProgress() {
      return this.$store.state.filterProgress;
    }
  },
  methods: {
    startFilter() {
      const filterConfig = {
        codes,
        lineCount: 6,
        lineType: "week",
        endTimeStamp: new Date(this.selectedDate).getTime()
      };

      this.$store.dispatch("stockFilter", filterConfig);
    }
  },
  mounted() {}
};
</script>
