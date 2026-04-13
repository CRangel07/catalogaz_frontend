import { routes } from './app.routes';
import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from './auth.guard';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes],
});

router.beforeEach(authGuard);

export default router;
