export const posts = {

    namespaced: true,

    state: [],

    actions: {

        update({state}) {

            // TODO: Use apollo
            const fakePosts = [];
            for (let i = 0; i < 20; i++) {
                fakePosts.push({
                    postid: Math.floor(Math.random() * 100000),
                    title: 'Lorem ipsum',
                    timestamp: Math.random() * Date.now(),
                    body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'.repeat(Math.floor(Math.random() * 20) + 1),
                    author: {
                        username: 'Doles esa',
                        fullname: 'Cur agripeta'
                    }
                });
            }

            state.splice(0, state.length, ...fakePosts);
        }

    }

};
