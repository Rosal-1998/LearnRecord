const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

// 定义路由
router.get('/', async (ctx) => {
  ctx.body = 'Hello, Koa2!';
});

router.get('/about', async (ctx) => {
  ctx.body = 'About page';
});

// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 监听端口
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});
