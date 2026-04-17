import { routes } from './app.routes';
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './auth.guard';

const router = createRouter({
  history: createWebHistory('/'),
  routes: [...routes],
});

router.beforeEach(authGuard);

export default router;
