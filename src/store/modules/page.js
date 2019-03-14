const {on} = require('../../js/utils');

export const page = {

    namespaced: true,

    state: {
        lastScrollDirection: 'down'
    },

    mutations: {
        _init(state) {
            let lastScrollY = window.scrollY;

            on(window, 'scroll', () => {
                const diff = window.scrollY - lastScrollY;

                if (Math.abs(diff) > 25 || !window.scrollY) {
                    state.lastScrollDirection = diff > 0 ? 'down' : 'up';
                    lastScrollY = window.scrollY;
                }
            });
        }
    }
};
