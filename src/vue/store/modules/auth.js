export const auth = {

    namespaced: true,

    state: {
        user: null,
        apikey: null
    },

    actions: {

        login({state}, {username, password}) {
            // TODO: Apollo login
        },

        register({state}, {email, username, password}) {
            // TODO: Apollo register
        }

    }

};
