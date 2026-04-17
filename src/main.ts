import '@/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import persistedState from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

// z.config({
//   customError: (issue) => {
//     switch (issue.code) {
//       case 'too_small':
//         return `Mínimo ${issue.minimum} caracteres`;
//       case 'too_big':
//         return `Máximo ${issue.maximum} caracteres`;
//       case 'invalid_type':
//         if (issue.received === 'undefined') return 'Este campo es obligatorio';
//         return 'Tipo de valor incorrecto';
//       default:
//         return 'Valor inválido';
//     }
//   },
// });

const app = createApp(App);
const pinia = createPinia();

pinia.use(persistedState);
app.use(pinia);
app.use(router);

app.mount('#app');
