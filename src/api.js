import axios from 'axios';
import { klineConf, stockInfoConf } from './utils/klineMap';
axios.defaults.timeout = 6000;
const resMap = klineConf.resMap;

function getStockBasicInfo(code) {
  code = formatCode(code);
  let url = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${code}&extend=detail`;
  return axios.get(`/GetUrlResultProxy?url=${encodeURIComponent(url)}`).then((res) =>
    res.data.data.items.shift());
}

function formatCode(code) {
  let formatedCode;
  if (/^600/.test(code)) formatedCode = 'SH' + code;
  if (/^601/.test(code)) formatedCode = 'SH' + code;
  if (/^603/.test(code)) formatedCode = 'SH' + code;
  //if (/^60/.test(code.code)) formatCode = 'SZ' + code.code;
  if (/^300/.test(code)) formatedCode = 'SZ' + code;
  if (/^002/.test(code)) formatedCode = 'SZ' + code;
  if (/^000/.test(code)) formatedCode = 'SZ' + code;
  return formatedCode;
}


function stockFiterBuilder(codes) {
  return {
    startFilter,
    watchProgcess
  };

  function startFilter(codes, dateOffset, progressListener) {
    var cloneCodes = [];
    var totalLength = codes.length;
    Object.assign(cloneCodes, codes);
    for (var i = 0; i < 20; i++) {
      _s();
    }
    function _s() {
      if (cloneCodes.length <= 0) return;
      let code = cloneCodes.pop();
      let formatedCode = formatCode(code.code);
      checkCode(formatedCode, dateOffset).then((res) => {
        progressListener({
          upDownRate: res.upDownRate,
          isGood: res.isGood,
          code: code,
          stockInfo: res.stockInfo,
          isError: false,
          totalLength: totalLength,
          remainLength: cloneCodes.length
        });
        _s();
      }).catch((err) => {
        console.error(`${code.code}读取数据出错！${err}`);
        progressListener({
          isGood: false,
          isError: true,
          code: code,
          totalLength: totalLength,
          remainLength: cloneCodes.length
        });
        _s();
      });
    }

    function getKline(code, beginTime, type) {
      var count = -2;
      var apiUrl = klineConf.getApiUrl(code, type, count, beginTime);
      return axios.get(`/GetUrlResultProxy?url=${encodeURIComponent(apiUrl)}`);
    }

    function checkCode(code, dateOffset) {
      return getKline(code, dateOffset, 'week').then((res) => {
        let data = res.data.data;
        if (!data.item) {
          return Promise.reject(`${code}返回数据有误，请检查！`);
        }
        let lastItem = data.item.pop();
        let olderItem_1 = data.item.pop();
        var result = false;
        var macd_0 = lastItem[resMap.macd];
        var macd_1 = olderItem_1[resMap.macd];

        var percent_0 = lastItem[resMap.percent];

        if (
          macd_0 > macd_1
          && macd_0 < 0
          && percent_0 < 0.5
        ) {
          result = true;
        }
        return Promise.resolve({
          isGood: result,
          stockInfo: lastItem
        });
      }).then(res => {
        return new Promise((resolve, reject) => {
          getKline(code, dateOffset, 'day').then(res => {

          });
        });
      });
    }
  }

  function watchProgcess() {

  }
}



export default {
  stockFiterBuilder,
  formatCode,
  getStockBasicInfo
};