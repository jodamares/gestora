<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
const sidebarCollapsed = ref(false)
const mobileNavOpen = ref(false)

const logout = () => {
  store.dispatch('logout')
  router.replace('/login')
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}
</script>

<template>
  <div id="app" class="app-shell">
    <aside
      v-if="isAuthenticated"
      class="app-shell__sidebar"
      :class="{
        'app-shell__sidebar--collapsed': sidebarCollapsed,
        'app-shell__sidebar--open': mobileNavOpen,
      }"
    >
      <div class="app-shell__brand-row">
        <img
          v-if="!sidebarCollapsed"
          src="/logo-large.png"
          alt="Gestor Empresarial"
          class="app-shell__logo"
        />
        <span v-else class="app-shell__logo-initial">G</span>
        <button type="button" class="app-shell__ghost-btn" @click="toggleSidebar">
          {{ sidebarCollapsed ? '›' : '‹' }}
        </button>
      </div>
      <nav class="app-shell__nav">
        <RouterLink to="/" @click="closeMobileNav">
          <span v-if="!sidebarCollapsed">Inicio</span>
          <span v-else>I</span>
        </RouterLink>
        <RouterLink to="/companies" @click="closeMobileNav">
          <span v-if="!sidebarCollapsed">Gestion de empresas</span>
          <span v-else>G</span>
        </RouterLink>
        <RouterLink to="/companies/create" @click="closeMobileNav">
          <span v-if="!sidebarCollapsed">Crear empresa</span>
          <span v-else>C</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="app-shell__content">
      <header v-if="isAuthenticated" class="app-shell__topbar">
        <button type="button" class="app-shell__ghost-btn app-shell__menu-toggle" @click="toggleMobileNav">Menu</button>
        <button type="button" class="app-shell__logout-top" @click="logout">Cerrar sesion</button>
      </header>
      <RouterView />
    </main>
  </div>
</template>

<style>
@import './assets/global.css';

.app-shell {
  min-height: 100vh;
  display: flex;
  background: var(--bg);
  position: relative;
}

.app-shell__sidebar {
  width: 280px;
  min-height: 100vh;
  padding: 1rem;
  background: #fffdf8;
  border-right: 2px solid var(--border);
  transition: width 0.24s ease, transform 0.24s ease;
  box-shadow: var(--shadow);
  z-index: 20;
}

.app-shell__sidebar--collapsed {
  width: 88px;
}

.app-shell__brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1.5px solid var(--border);
}

.app-shell__logo {
  height: 44px;
  width: auto;
  object-fit: contain;
}

.app-shell__logo-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.35);
}

.app-shell__nav {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.app-shell__nav a {
  color: var(--text-muted);
  color: var(--text);
  text-decoration: none;
  border-radius: 10px;
  padding: 0.6rem 0.72rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.app-shell__nav a:hover {
  background: #fdf3d6;
  color: var(--primary-dark);
}

.app-shell__nav a.router-link-active {
  background: linear-gradient(145deg, var(--primary), var(--primary-dark));
  color: #fff;
  box-shadow: 0 2px 10px rgba(201, 168, 76, 0.3);
}

.app-shell__logout {
  text-align: left;
  border: 1px solid #fecaca;
  background: #fff1f2;
  color: #be123c;
  border-radius: 10px;
  padding: 0.6rem 0.72rem;
}

.app-shell__ghost-btn {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 10px;
  padding: 0.35rem 0.6rem;
  color: var(--text-muted);
}

.app-shell__content {
  min-width: 0;
  flex: 1;
  padding: 0;
}

.app-shell__topbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 1rem 0;
}

.app-shell__logout-top {
  border: 2px solid var(--primary);
  background: transparent;
  color: var(--primary-dark);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.app-shell__logout-top:hover {
  background: #fef9ec;
  color: var(--primary-dark);
}

.app-shell__menu-toggle {
  display: none;
}

@media (max-width: 1023px) {
  .app-shell {
    display: block;
  }

  .app-shell__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    width: 280px;
  }

  .app-shell__sidebar--open {
    transform: translateX(0);
  }

  .app-shell__topbar {
    justify-content: space-between;
    padding: 0.75rem 1rem 0;
  }

  .app-shell__menu-toggle {
    display: inline-flex;
  }
}

@media (min-width: 1024px) {
  .app-shell__sidebar--collapsed .app-shell__nav a {
    text-align: center;
    justify-content: center;
    display: flex;
    align-items: center;
    padding-left: 0.35rem;
    padding-right: 0.35rem;
    font-weight: 700;
  }
}
</style>
