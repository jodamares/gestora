<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
const authUser = computed(() => store.state.authUser)
const sidebarCollapsed = ref(false)
const mobileNavOpen = ref(false)

const userInitials = computed(() => {
  const u = authUser.value
  if (!u) return 'U'
  const name = u.fullName || u.name || u.email || ''
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'
})

const userDisplayName = computed(() => {
  const u = authUser.value
  if (!u) return ''
  return u.fullName || u.name || u.email || ''
})

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
        <span v-else class="app-shell__logo-initial">DGT</span>
        <button type="button" class="app-shell__ghost-btn" @click="toggleSidebar">
          {{ sidebarCollapsed ? '›' : '‹' }}
        </button>
      </div>
      <nav class="app-shell__nav">
        <RouterLink to="/" @click="closeMobileNav" class="app-shell__nav-link">
          <svg class="app-shell__nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="app-shell__nav-label">Inicio</span>
        </RouterLink>
        <RouterLink to="/companies" @click="closeMobileNav" class="app-shell__nav-link">
          <svg class="app-shell__nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="app-shell__nav-label">Gestión de empresas</span>
        </RouterLink>
        <RouterLink to="/companies/create" @click="closeMobileNav" class="app-shell__nav-link">
          <svg class="app-shell__nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span v-if="!sidebarCollapsed" class="app-shell__nav-label">Crear empresa</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="app-shell__content">
      <header v-if="isAuthenticated" class="app-shell__topbar">
        <button type="button" class="app-shell__menu-toggle" @click="toggleMobileNav">
          <img src="/logo-large.png" alt="Gestor" class="app-shell__topbar-logo" />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="app-shell__topbar-right">
          <div v-if="userDisplayName" class="app-shell__user-info">
            <span class="app-shell__user-avatar">{{ userInitials }}</span>
            <span class="app-shell__user-name">{{ userDisplayName }}</span>
          </div>
          <button type="button" class="app-shell__logout-top" @click="logout">Cerrar sesión</button>
        </div>
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
  padding: 0.7rem 1.5rem;
  margin-right: 0.5rem;
}

.app-shell__nav {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.app-shell__nav-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--text);
  text-decoration: none;
  border-radius: 10px;
  padding: 0.6rem 0.72rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.app-shell__nav-icon {
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.app-shell__nav-label {
  font-size: 0.95rem;
}

.app-shell__nav-link:hover {
  background: #fdf3d6;
  color: var(--primary-dark);
}

.app-shell__nav-link:hover .app-shell__nav-icon {
  opacity: 1;
}

.app-shell__nav-link.router-link-active {
  background: linear-gradient(145deg, var(--primary), var(--primary-dark));
  color: #fff;
  box-shadow: 0 2px 10px rgba(201, 168, 76, 0.3);
}

.app-shell__nav-link.router-link-active .app-shell__nav-icon {
  opacity: 1;
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

.app-shell__topbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-shell__user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-shell__user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-shell__user-name {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-muted);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-shell__topbar-logo {
  height: 28px;
  width: auto;
  object-fit: contain;
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
  align-items: center;
  gap: 0.5rem;
  border: 1.5px solid var(--border);
  background: #fff;
  border-radius: 10px;
  padding: 0.35rem 0.6rem;
  color: var(--text-muted);
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

  .app-shell__user-name {
    display: none;
  }
}

@media (min-width: 1024px) {
  .app-shell__sidebar--collapsed .app-shell__nav-link {
    justify-content: center;
    padding-left: 0.35rem;
    padding-right: 0.35rem;
  }
}
</style>
