import Vue from 'vue';
import Router from 'vue-router';
import stockList from '@/components/stockList';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            name: 'HelloWorld',
            component: stockList
        }
    ]
});
