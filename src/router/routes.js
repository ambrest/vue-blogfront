import store  from '../store/index';
import config from '../../config/config';

// Route components
import Home          from '../vue/pages/home/Home';
import Login         from '../vue/pages/login/Login';
import Register      from '../vue/pages/register/Register';
import Admin         from '../vue/pages/admin/Admin';
import NewPost       from '../vue/pages/newpost/NewPost';
import Settings      from '../vue/pages/settings/Settings';
import PasswordReset from '../vue/pages/forgotpassword/ForgotPassword';
import ViewPost      from '../vue/pages/viewpost/ViewPost';
import ViewUser      from '../vue/pages/viewuser/ViewUser';
import Search        from '../vue/pages/search/Search';
import Me            from '../vue/pages/me/Me';

/**
 * Responsible for trying to authenticate the user via a existing api-key.
 * @returns {Promise<*>}
 */
const authenticate = async () => {

    // User is already logged in so resolve it
    if (store.state.auth.user) {
        return Promise.resolve(store.state.auth.user);
    }

    // Get key from localStorage, acts as session-key store
    const apikey = localStorage.getItem('apikey');

    // If null reject promise, otherwise try to login
    return apikey ? store.dispatch('auth/key', {apikey}) : Promise.reject();
};

// Initiate login
authenticate().catch(() => localStorage.removeItem('apikey'));

// Shortcut to update the page title
const setTitle = str => document.title = `${config.pageTitle}${str ? ' - ' + str : ''}`;

export default [
    {
        path: '/',
        component: Home,
        beforeEnter(to, from, next) {
            setTitle();
            next();
        }
    },
    {
        path: '/login',
        component: Login,
        beforeEnter(to, from, next) {
            setTitle('Login');

            // Check if user is authenticated and redirect to home if not
            authenticate().then(() => next('/')).catch(() => next());
        }
    },
    {
        path: '/register',
        component: Register,
        beforeEnter(to, from, next) {
            setTitle('Register');

            // Check if user is authenticated and redirect to home if not
            authenticate().then(() => next('/')).catch(() => next());
        }
    },
    {
        path: '/admin',
        component: Admin,
        beforeEnter(to, from, next) {
            setTitle('Admin');

            // Check if user is authenticated and redirect to home if not
            authenticate().then(user => {

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
        component: NewPost,
        beforeEnter(to, from, next) {
            setTitle('New post');

            /**
             * Check if user is logged in and has sufficent permissions, redirect to
             * homepage if not so.
             */
            authenticate().then(user => {

                // Check if user is logged in and has sufficent permissions
                if (!user.permissions.includes('post')) {
                    return next('/');
                }

                next();
            }).catch(() => next('/login'));
        }
    },
    {
        path: '/settings',
        component: Settings,
        beforeEnter(to, from, next) {
            setTitle('Settings');

            /**
             * Check if user is logged in.
             */
            authenticate().then(() => next()).catch(() => next('/login'));
        }
    },
    {
        path: '/post/:id',
        component: ViewPost
    },
    {
        path: '/user/:id',
        component: ViewUser
    },
    {
        path: '/edit/:id',
        component: NewPost
    },
    {
        path: '/forgotpassword',
        component: PasswordReset
    },
    {
        path: '/recover/:apikey',
        beforeEnter(to, from, next) {
            const {apikey} = to.params;

            // Check if apikey is present
            if (apikey) {
                return store.dispatch('auth/key', {apikey}).then(() => {
                    next('/settings');
                }).catch(() => {
                    next('/');
                });
            }

            next('/');
        }
    },
    {
        path: '/search',
        component: Search
    },
    {
        path: '/me',
        component: Me,
        beforeEnter(to, from, next) {
            setTitle('Me');

            /**
             * Check if user is logged in.
             */
            authenticate().then(() => next()).catch(() => next('/login'));
        }
    },

    // 404 catcher
    {path: '*', redirect: '/'}
];
