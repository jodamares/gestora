<template>
  <main class="company-list">
    <section class="company-list__card surface-card">
      <header class="company-list__header">
        <div>
          <p class="company-list__eyebrow">Gestión de empresas</p>
          <h1>Empresas registradas</h1>
        </div>
        <div class="company-list__links">
          <RouterLink to="/companies/create">Crear</RouterLink>
          <RouterLink to="/">Menu</RouterLink>
        </div>
      </header>

      <section class="company-list__toolbar">
        <input v-model.trim="search" type="search" placeholder="Buscar por nombre, NIT o correo..." />
        <select v-model="statusFilter">
          <option value="all">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </section>

      <div v-if="loading" class="company-list__skeleton">
        <div class="skeleton company-list__sk-line company-list__sk-line--header"></div>
        <div class="skeleton company-list__sk-line"></div>
        <div class="skeleton company-list__sk-line"></div>
        <div class="skeleton company-list__sk-line"></div>
      </div>
      <p v-else-if="error" class="company-list__error">{{ error }}</p>
      <div v-else-if="filteredCompanies.length === 0" class="company-list__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
        </svg>
        <p class="company-list__empty-title">No hay empresas registradas</p>
        <p class="company-list__empty-sub">Crea la primera empresa para comenzar.</p>
        <RouterLink to="/companies/create" class="company-list__empty-action">Crear empresa</RouterLink>
      </div>

      <div v-else class="company-list__table-wrapper">
        <table class="company-list__table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Nombre</th>
              <th>NIT</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in filteredCompanies" :key="company.id">
              <td>
                <div class="company-list__avatar">{{ getCompanyInitials(company.name) }}</div>
              </td>
              <td>{{ company.name }}</td>
              <td>{{ company.nit }}</td>
              <td>{{ company.city }}</td>
              <td>
                <span class="company-list__badge" :class="{ 'company-list__badge--pending': company.status === 'Pendiente' }">
                  {{ company.status }}
                </span>
              </td>
              <td>{{ company.email }}</td>
              <td>
                <div class="company-list__actions">
                  <button type="button" class="company-list__menu-btn" @click="toggleActionMenu(company.id)">
                    Acciones
                  </button>
                  <div v-if="activeActionMenu === company.id" class="company-list__menu">
                    <a :href="buildDocumentUrl(company.id)" target="_blank" rel="noopener" @click="closeActionMenu">
                      Plantilla
                    </a>
                    <RouterLink :to="`/companies/${company.id}/directory`" @click="closeActionMenu">
                      Directorio
                    </RouterLink>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script src="./CompanyListPage.js"></script>
<style src="./CompanyListPage.css" scoped></style>
