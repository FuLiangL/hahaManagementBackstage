import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import permission from './modules/permission';
import user from './modules/user';
Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        user,
        permission
    },
    getters,
});
export default store;
