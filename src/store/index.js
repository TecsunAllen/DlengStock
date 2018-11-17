//state
import Vue from 'vue';
import Vuex from 'vuex';

import stockList from './modules/stockList';
import getters from './getters';


Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        stockList
    },
    getters
});






