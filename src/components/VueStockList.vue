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
      selectedDate: "",
      tableData: [],
      filterProgress: 0,
      totalLength: 0,
      remainLength: 0
    };
  },
  methods: {
    startFilter() {
      var selectedDate = new Date(this.selectedDate).getTime();
      var dateOffset = selectedDate;

      api.stockFiterBuilder().startFilter(codes, dateOffset, result => {
        this.totalLength = result.totalLength;
        this.remainLength = result.remainLength;
        this.filterProgress =
          100 - parseInt((result.remainLength * 100) / result.totalLength);
        if (
          result.isGood &&
          selectedDate - result.stockInfo[0] < 3600000 * 14 * 24
        ) {
          api
            .getStockBasicInfo(result.code.code)
            .then(data =>
              Promise.resolve({
                capital: data.quote.market_capital / 100000000,
                pe_lyr: data.quote.pe_lyr
              })
            )
            .then(data => {
              this.tableData.push({
                companyName: result.code.name,
                pirce: result.stockInfo[5],
                increase: result.stockInfo[7] + "%",
                capital: data.capital,
                pe: data.pe_lyr
              });
            });
        }
      });
    }
  },
  mounted() {}
};
</script>
