import { resMap } from '../utils/klineMap';
import { getKline } from '../api';
import { isCrossStar } from './stockAlgoUtils';

function wade(formatedCode, endTimeStamp) {
    return getKline(formatedCode, endTimeStamp, 6, 'week').then((res) => {
        let dataList = res.data.data.item;
        let result = false;
        if (!dataList) return Promise.reject('数据无效');
        let minMacdItem = (function () {
            var macds = dataList.map((item) => item[resMap.macd]);
            var minMacd = Math.min(...macds);
            var minMacdIndex = macds.findIndex((item) => item == minMacd);

            if (minMacdIndex === macds.length - 1) return false;
            for (var i = minMacdIndex; i < macds.length; i++) {
                if (macds[i] > (macds[i + 1])) return false;
            }
            return {
                minMacdIndex,
                minMacdItem: dataList[minMacdIndex]
            };
        })();

        /*         if (minMacdItem && minMacdItem.minMacdIndex == 4) {
                    var lastItem = dataList[dataList.length - 1];
                } */

        if (!minMacdItem || minMacdItem.minMacdIndex === -1) return Promise.reject('数据无效');

        let filterDataList = dataList.filter((item, index) => {
            return minMacdItem && minMacdItem.minMacdIndex < index
                //&& item[resMap.closePrice] > minMacdItem.minMacdItem[resMap.lowPrice]
                //&& item[resMap.closePrice] < minMacdItem.minMacdItem[resMap.highPrice]
                && item[resMap.closePrice] < Math.max(minMacdItem.minMacdItem[resMap.openPrice], minMacdItem.minMacdItem[resMap.closePrice]);
        });

        if (isCrossStar(minMacdItem.minMacdItem)
            && filterDataList.length === 1
            && dataList.indexOf(filterDataList[0]) == dataList.length - 1) {
            result = true;
        }
        return Promise.resolve({
            formatedCode,
            isGood: result,
            stockInfo: dataList.pop()
        });
    })
        .catch(error => {
            return Promise.reject(error);
        });


}

export default {
    wade
};
