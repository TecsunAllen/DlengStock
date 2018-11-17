import axios from 'axios';
import { formatCode } from '../api';

axios.defaults.timeout = 6000;


export function stockFilterBuilder() {
    const listeners = [];

    const config = {
        codes: [],
        endTimeStamp: 0,
        concurrencyNumber: 20,
        algorithm: null
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
        config.algorithm = algo;
        return this;
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

            return config.algorithm(formatedCode, config.endTimeStamp).then((res) =>
                notifySuccess(res, code))
                .catch((err) => {
                    console.error(`${code.code}读取数据出错！${err}`);
                    notifyError(code);
                });
        });

        return Promise.all(pormiseArray);

        function notifySuccess(res, code) {
            listeners.forEach(listener => listener({
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


}



