import { resMap } from '../utils/klineMap';

export function wade(dataList) {
    var result = false;
    var isSmooth = (function () {
        var macds = dataList.map((item) => item[resMap.macd]);
        var minMacd = Math.min(...macds);
        var minMacdIndex = macds.findIndex((item) => item == minMacd);

        if (minMacdIndex === macds.length - 1) return false;
        for (var i = minMacdIndex; i < macds.length; i++) {
            if (macds[i] > (macds[i + 1])) return false;
        }
        return dataList[minMacdIndex];
    })();

    let lastItem = dataList.pop();
    let olderItem_1 = dataList.pop();

    var macd_0 = lastItem[resMap.macd];
    var macd_1 = olderItem_1[resMap.macd];
    var percent_0 = lastItem[resMap.percent];


    var firstDownIndex = -1;
    var matchCount = 0;
    dataList.forEach((item, index) => {
        if (
            isSmooth &&
            item[resMap.closePrice] > isSmooth[resMap.lowPrice]
            && item[resMap.closePrice] < isSmooth[resMap.highPrice]
        ) {
            matchCount++;
            firstDownIndex = index;
        }
    });


    if (
        matchCount === 1 && firstDownIndex == dataList.length - 1
    ) {
        result = true;
    }
    return Promise.resolve({
        isGood: result,
        stockInfo: lastItem
    });
}