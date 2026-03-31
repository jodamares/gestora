import { createRouter, createWebHistory } from 'vue-router'
import CompanyMenuPage from '@/views/CompanyMenuPage/CompanyMenuPage.vue'
import CompanyCreatePage from '@/views/CompanyCreatePage/CompanyCreatePage.vue'
import CompanyListPage from '@/views/CompanyListPage/CompanyListPage.vue'
import CompanyDirectoryPage from '@/views/CompanyDirectoryPage/CompanyDirectoryPage.vue'
import LoginPage from '@/views/LoginPage/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage/RegisterPage.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginPage, meta: { public: true } },
  { path: '/register', name: 'Register', component: RegisterPage, meta: { public: true } },
  { path: '/', name: 'CompanyMenu', component: CompanyMenuPage },
  { path: '/companies/create', name: 'CompanyCreate', component: CompanyCreatePage },
  { path: '/companies', name: 'CompanyList', component: CompanyListPage },
  { path: '/companies/:id/directory', name: 'CompanyDirectory', component: CompanyDirectoryPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  const isPublic = Boolean(to.meta.public)
  if (!token && !isPublic) return '/login'
  if (token && (to.path === '/login' || to.path === '/register')) return '/'
  return true
})

export default router
