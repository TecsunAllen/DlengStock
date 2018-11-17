import axios from 'axios';
import { resMap } from '../utils/klineMap';
import { getKline, formatCode } from '../api';

axios.defaults.timeout = 6000;


export function stockFilterBuilder() {
    const listeners = [];

    let algorithm = null;

    const config = {
        codes: [],
        lineCount: 0,
        lineType: '',
        endTimeStamp: 0,
        concurrencyNumber: 20
    };

    let totalCodeLength = 0;
    let remainCodeLength = 0;

    return {
        setAlgorithm,
        setConfig,
        build,
        execute,
        watchProgcess
    };

    function setConfig(conf) {
        Object.assign(config, conf);
        return this;
    }

    function setAlgorithm(algo) {
        algorithm = algo;
    }

    function watchProgcess(listener) {
        listeners.push(listener);
        return this;
    }

    function build() {
        totalCodeLength = config.codes.length;
        remainCodeLength = config.codes.length;
        return this;
    }

    function execute() {
        const cloneCodes = Object.assign([], config.codes);
        let promiseInstance = Promise.resolve();

        while (cloneCodes.length > 0) {
            let currentCodes = cloneCodes.splice(0, config.concurrencyNumber);
            promiseInstance = promiseInstance.then(() =>
                partExecute(currentCodes));
        }
    }

    function partExecute(partCodes) {
        const pormiseArray = partCodes.map((code) => {
            let formatedCode = formatCode(code.code);
            return checkCode(formatedCode, config.endTimeStamp, config.lineCount).then((res) =>
                notifySuccess(res, code))
                .catch((err) => {
                    console.error(`${code.code}读取数据出错！${err}`);
                    notifyError(code);
                });
        });

        console.log(pormiseArray);
        return Promise.all(pormiseArray);

        function notifySuccess(res, code) {
            listeners.forEach(listener => listener({
                upDownRate: res.upDownRate,
                isGood: res.isGood,
                code: code,
                stockInfo: res.stockInfo,
                isError: false,
                totalLength: totalCodeLength,
                remainLength: --remainCodeLength
            }));


        }

        function notifyError(code) {
            listeners.forEach(listener => listener({
                isGood: false,
                isError: true,
                code: code,
                totalLength: totalCodeLength,
                remainLength: --remainCodeLength
            }));
        }
    }

    function checkCode(code, endTimeStamp, lineCount) {
        return getKline(code, endTimeStamp, lineCount, 'week').then((res) => {
            let data = res.data.data;
            if (!data.item) {
                return Promise.reject(`${code}返回数据有误，请检查！`);
            }
            var result = false;
            var isSmooth = (function () {
                var macds = data.item.map((item) => item[resMap.macd]);
                var minMacd = Math.min(...macds);
                var minMacdIndex = macds.findIndex((item) => item == minMacd);

                if (minMacdIndex === macds.length - 1) return false;
                for (var i = minMacdIndex; i < macds.length; i++) {
                    if (macds[i] > (macds[i + 1])) return false;
                }
                return data.item[minMacdIndex];
            })();

            let lastItem = data.item.pop();
            let olderItem_1 = data.item.pop();

            var macd_0 = lastItem[resMap.macd];
            var macd_1 = olderItem_1[resMap.macd];
            var percent_0 = lastItem[resMap.percent];


            var firstDownIndex = -1;
            var matchCount = 0;
            data.item.forEach((item, index) => {
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
                matchCount === 1 && firstDownIndex == data.item.length - 1
            ) {
                result = true;
            }
            return Promise.resolve({
                isGood: result,
                stockInfo: lastItem
            });
        });
    }


}



