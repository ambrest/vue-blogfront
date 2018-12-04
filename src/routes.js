// Routes
import Home     from './vue/pages/home/Home';
import Login    from './vue/pages/login/Login';
import Register from './vue/pages/register/Register';

export default [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register}
];
