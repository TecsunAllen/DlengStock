const host = 'https://stock.xueqiu.com';
module.exports = {
    getApiUrl: (code, klineType, count, beginTime) => `${host}/v5/stock/chart/kline.json?symbol=${code}&begin=${beginTime}&period=${klineType}&type=before&count=${count}&indicator=kline,ma,macd,kdj,boll,rsi,wr,bias,cci,psy`,
    resMap: {
        timestamp: 0,
        volume: 1,
        openPrice: 2,
        highPrice: 3,
        lowPrice: 4,
        closePrice: 5,
        chg: 6,
        percent: 7,
        turnoverrate: 8,
        ma5: 9,
        ma10: 10,
        ma20: 11,
        ma30: 12,
        macd: 15
    }

};