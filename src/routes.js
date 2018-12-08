// Routes
import Home     from './vue/pages/home/Home';
import Login    from './vue/pages/login/Login';
import Register from './vue/pages/register/Register';
import Admin    from './vue/pages/admin/Admin';
import New      from './vue/pages/new/New';
import Post     from './vue/pages/post/Post';

export default [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/admin', component: Admin},
    {path: '/new', component: New},
    {path: '/post/*', component: Post}
];
