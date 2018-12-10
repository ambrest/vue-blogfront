import store from '../vue/store/index';

// Route components
import Home       from '../vue/pages/home/Home';
import Login      from '../vue/pages/login/Login';
import Register   from '../vue/pages/register/Register';
import Admin      from '../vue/pages/admin/Admin';
import CreatePost from '../vue/pages/createpost/CreatePost';
import ViewPost   from '../vue/pages/viewpost/ViewPost';

/**
 * Responsible for trying to authenticate the user via a existing api-key.
 * @returns {Promise<*>}
 */
const authenticate = (async () => {

    // User is already logged in so resolve it
    if (store.state.auth.user) {
        return Promise.resolve(store.state.auth.user);
    }

    // Get key from localStorage, acts as session-key store
    const apikey = localStorage.getItem('apikey');

    // If null reject promise, otherwise try to login
    return apikey ? store.dispatch('auth/key', {apikey}) : Promise.reject();
})();

export default [
    {
        path: '/',
        component: Home
    },
    {
        path: '/login',
        component: Login,
        beforeEnter(to, from, next) {

            // Check if user is authenticated and redirect to home if not
            authenticate.then(next).catch(() => next('/'));
        }
    },
    {
        path: '/register',
        component: Register,
        beforeEnter(to, from, next) {

            // Check if user is authenticated and redirect to home if not
            authenticate.then(next).catch(() => next('/'));
        }
    },
    {
        path: '/admin',
        component: Admin,
        beforeEnter(to, from, next) {

            // Check if user is authenticated and redirect to home if not
            authenticate.then(user => {

                // Check if user is logged in and has sufficent permissions
                if (!user.permissions.includes('administrate')) {
                    return next('/');
                }

                next();
            }).catch(() => next('/'));
        }
    },
    {
        path: '/new',
        component: CreatePost,
        beforeEnter(to, from, next) {

            /**
             * Check if user is logged in and has sufficent permissions, redirect to
             * homepage if not so.
             */
            authenticate.then(user => {

                // Check if user is logged in and has sufficent permissions
                if (!user.permissions.includes('post')) {
                    return next('/');
                }

                next();
            }).catch(() => next('/'));
        }
    },
    {
        path: '/post/:id',
        component: ViewPost
    },

    // 404 catcher
    {path: '*', redirect: '/'}
];
