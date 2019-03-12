import Vue from 'vue';

Vue.filter('ReadableNumber', value => {

    if (!value) {
        return '';
    }

    return value > 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;
});
