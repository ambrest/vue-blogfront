// Routes
import Home       from './vue/pages/home/Home';
import Login      from './vue/pages/login/Login';
import Register   from './vue/pages/register/Register';
import Admin      from './vue/pages/admin/Admin';
import CreatePost from './vue/pages/createpost/CreatePost';
import ViewPost   from './vue/pages/viewpost/ViewPost';

export default [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/admin', component: Admin},
    {path: '/new', component: CreatePost},
    {path: '/post/*', component: ViewPost}
];
