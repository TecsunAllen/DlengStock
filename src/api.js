import axios from 'axios';
import { klineConf } from './utils/klineMap';

axios.defaults.timeout = 6000;

export function getStockBasicInfo(code) {
    code = formatCode(code);
    let url = `https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=${code}&extend=detail`;
    return axios.get(`/GetUrlResultProxy?url=${encodeURIComponent(url)}`).then((res) =>
        res.data.data.items.shift());
}

export function getKline(code, endTimeStamp, lineCount, type) {
    var apiUrl = klineConf.getApiUrl(code, type, -lineCount, endTimeStamp);
    return axios.get(`/GetUrlResultProxy?url=${encodeURIComponent(apiUrl)}`);
}

export function formatCode(code) {
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

