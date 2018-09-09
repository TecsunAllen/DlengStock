import axios from 'axios';
import {klineConf,stockInfoConf} from './utils/klineMap';
axios.defaults.timeout = 6000;
const resMap = klineConf.resMap;

function getStockBasicInfo(codes){
  axios.get(`/GetUrlResultProxy?url=${encodeURIComponent('https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${codes}')}`).then((data)=>{

  });
}

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
    let formatCode = code.code;
    if (/^600/.test(code.code)) formatCode = 'SH' + code.code;
    if (/^601/.test(code.code)) formatCode = 'SH' + code.code;
    if (/^603/.test(code.code)) formatCode = 'SH' + code.code;
    //if (/^60/.test(code.code)) formatCode = 'SZ' + code.code;
    if (/^300/.test(code.code)) formatCode = 'SZ' + code.code;
    if (/^002/.test(code.code)) formatCode = 'SZ' + code.code;
    if (/^000/.test(code.code)) formatCode = 'SZ' + code.code;
    checkCode(formatCode, dateOffset).then((res) => {
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

  function getKline(code, beginTime) {
    var count = -5;
    if (beginTime + 3600000 * 15 >= (new Date()).getTime()) count = -4;
    var apiUrl = klineConf.getApiUrl(code,'week',count,beginTime);
    var p1 = axios.get(`/GetUrlResultProxy?url=${encodeURIComponent(apiUrl)}`);
    return p1;
  }
  
  function checkCode(code, dateOffset) {
    return getKline(code, dateOffset).then((res) => {
      let data = res.data.data;
      if (!data.item) {
        return Promise.reject(`${code}返回数据有误，请检查！`);
      }
      let lastItem = {};
      if (data.item.length == 5) lastItem = data.item.pop();
      let olderItem_1 = data.item.pop();
      let olderItem_2 = data.item.pop();
      let olderItem_3 = data.item.pop();
      let olderItem_4 = data.item.pop();
      var result = false;
      //var mainHeight = olderItem_1[resMap.closePrice] - olderItem_1[resMap.openPrice];
      var mainHeightAbs = Math.abs(olderItem_1[resMap.closePrice] - olderItem_1[resMap.openPrice]);
      //var olderMainHeight = olderItem_2[resMap.closePrice] - olderItem_2[resMap.openPrice];
      var upHeight = olderItem_1[resMap.highPrice] - Math.max(olderItem_1[resMap.openPrice], olderItem_1[resMap.closePrice]);
      var downHeight = Math.min(olderItem_1[resMap.openPrice], olderItem_1[resMap.closePrice]) - olderItem_1[resMap.lowPrice];
  
      var axios_1 = (olderItem_1[resMap.highPrice] - olderItem_1[resMap.lowPrice]) / 2 + olderItem_1[resMap.lowPrice];
      var axios_2 = (olderItem_2[resMap.highPrice] - olderItem_2[resMap.lowPrice]) / 2 + olderItem_2[resMap.lowPrice];
      var axios_3 = (olderItem_3[resMap.highPrice] - olderItem_3[resMap.lowPrice]) / 2 + olderItem_3[resMap.lowPrice];
      var axios_4 = (olderItem_4[resMap.highPrice] - olderItem_4[resMap.lowPrice]) / 2 + olderItem_4[resMap.lowPrice];
  
  
      var weekMat20_1 = olderItem_1[resMap.ma20];
      var weekMat20_2 = olderItem_2[resMap.ma20];
      var weekMat20_3 = olderItem_3[resMap.ma20];
      var weekMat20_4 = olderItem_4[resMap.ma20];
  
      var upDownRate = upHeight / downHeight;
      if (
        weekMat20_1 >= weekMat20_2
        && weekMat20_2 <= weekMat20_3
        //upDownRate > 2 
        //upHeight + downHeight < mainHeightAbs
        //axios_1 < axios_2
        //&& axios_2 > axios_3
        //&& axios_3 < axios_4
        /*olderItem_1[9] <= olderItem_2[9]
        && olderItem_2[9] >= olderItem_3[9]
        && olderItem_3[9] <= olderItem_4[9]
        && olderItem_2[9] < olderItem_4[9]
        && olderItem_1[9] > olderItem_3[9]*/
      //&& 2 * mainHeightAbs < upHeight
      //&& olderItem_2[7] < 0
      //&& olderItem_1[7] < 0
      ) {
        result = true;
      }
      return Promise.resolve({
        isGood: result,
        stockInfo: lastItem,
        upDownRate
      });
    });
  }
}

export default {
  startFilter
};