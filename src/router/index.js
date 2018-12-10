import VueRouter from 'vue-router';
import Vue       from 'vue';
import routes    from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes
});

VueRouter.prototype.visited = [];
router.afterEach(to => router.visited.push(to));

export default router;
