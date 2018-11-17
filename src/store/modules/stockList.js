import { stockFilterBuilder } from '../../service/stockFilter.factory';
import { getStockBasicInfo } from '../../api';

export default {
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
};


function progressListener(result, state) {
    state.stockList.totalLength = result.totalLength;
    state.stockList.remainLength = result.remainLength;
    state.stockList.filterProgress =
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
                state.stockList.tableData.push({
                    companyName: `${result.code.name}(${result.code.code})`,
                    pirce: result.stockInfo[5],
                    increase: result.stockInfo[7] + '%',
                    capital: data.capital,
                    pe: data.pe_lyr
                });
            });
    }
}


