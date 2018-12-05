export const auth = {

    namespaced: true,

    state: {
        user: {
            userid: 12,
            username: 'regrarm',
            fullname: 'Nicholas Semmens',
            email: 'NicholasJSemmes@dayrep.com',
            privilege: 'admin'
        },
        apikey: '66B1132A0173910B01EE3A15EF4E69583BBF2F7F1E4462C99EFBE1B9AB5BF808' || localStorage.getItem('apikey')
    },

    actions: {

        logout({state}) {
            state.user = null;
            state.apikey = null;
        },

        login({state}, {username, password}) {
            // TODO: Apollo login
        },

        register({state}, {email, username, password}) {
            // TODO: Apollo register
        }

    }

};
