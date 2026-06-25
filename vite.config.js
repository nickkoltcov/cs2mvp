import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // или ваш фреймворк

export default defineConfig({
  plugins: [react()],
  base: '/cs2mvp/', // Обязательно добавьте эту строку (имя вашего репозитория в слэшах)
})