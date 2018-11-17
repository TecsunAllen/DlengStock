//state
import Vue from 'vue';
import Vuex from 'vuex';

import { stockFilterBuilder } from './service/stockFilter.service';

import { getStockBasicInfo } from './api';

import algorithms from './service/stockFilterAlgorithmService';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        totalLength: 0,
        remainLength: 0,
        tableData: [],
        filterProgress: 0
    },
    mutations: {
        stockFilter(state, config) {
            stockFilterBuilder()
                .setConfig(config)
                .setAlgorithm(algorithms.wade)
                .watchProgcess((result) => {
                    progressListener(result, this.state);
                })
                .build()
                .execute();
        }
    },
    actions: {
        stockFilter(context, config) {
            context.commit('stockFilter', config);
        }
    }
});
export default store;


function progressListener(result, state) {
    state.totalLength = result.totalLength;
    state.remainLength = result.remainLength;
    state.filterProgress =
        100 - parseInt((result.remainLength * 100) / result.totalLength);
    if (result.isGood) {
        getStockBasicInfo(result.code.code)
            .then(data =>
                Promise.resolve({
                    capital: data.quote.market_capital / 100000000,
                    pe_lyr: data.quote.pe_lyr
                })
            )
            .then(data => {
                state.tableData.push({
                    companyName: result.code.name,
                    pirce: result.stockInfo[5],
                    increase: result.stockInfo[7] + '%',
                    capital: data.capital,
                    pe: data.pe_lyr
                });
            });
    }
}

