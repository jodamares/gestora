<template>
  <main class="company-menu">
    <section v-if="loading" class="company-menu__skeleton-grid">
      <div class="surface-card company-menu__skeleton-hero">
        <div class="skeleton company-menu__sk-line company-menu__sk-line--xl"></div>
        <div class="skeleton company-menu__sk-line company-menu__sk-line--md"></div>
        <div class="skeleton company-menu__sk-line company-menu__sk-line--sm"></div>
      </div>
      <div class="surface-card company-menu__skeleton-card" v-for="n in 3" :key="n">
        <div class="skeleton company-menu__sk-line company-menu__sk-line--md"></div>
        <div class="skeleton company-menu__sk-line company-menu__sk-line--sm"></div>
      </div>
    </section>

    <section v-else class="company-menu__layout">
      <header class="company-menu__hero surface-card">
        <div>
          <p class="company-menu__eyebrow">Dashboard</p>
          <h1 class="company-menu__title">Centro de gestion documental empresarial</h1>
          <p class="company-menu__lead">
            Administra tus empresas, documentos y carpetas en una interfaz moderna, clara y enfocada en productividad.
          </p>
        </div>
        <RouterLink to="/companies" class="company-menu__quick-action">Subir archivo</RouterLink>
      </header>

      <section class="company-menu__stats" aria-label="Estadisticas de archivos">
        <article class="surface-card company-menu__stat" v-for="item in stats" :key="item.label">
          <p class="company-menu__stat-label">{{ item.label }}</p>
          <p class="company-menu__stat-value">{{ item.value }}</p>
          <p class="company-menu__stat-trend">{{ item.trend }} vs mes anterior</p>
        </article>
      </section>

      <section class="company-menu__bento">
        <article class="surface-card company-menu__panel">
          <h2>Actividad reciente</h2>
          <ul class="company-menu__activity-list">
            <li v-for="activity in recentActivity" :key="`${activity.title}-${activity.time}`">
              <div>
                <strong>{{ activity.title }}</strong>
                <p>{{ activity.detail }}</p>
              </div>
              <span>{{ activity.time }}</span>
            </li>
          </ul>
        </article>
        <article class="surface-card company-menu__panel">
          <h2>Estadisticas de archivos</h2>
          <div class="company-menu__chart">
            <div class="company-menu__bar" style="--value: 82%">
              <span>Enero</span>
            </div>
            <div class="company-menu__bar" style="--value: 66%">
              <span>Febrero</span>
            </div>
            <div class="company-menu__bar" style="--value: 91%">
              <span>Marzo</span>
            </div>
            <div class="company-menu__bar" style="--value: 74%">
              <span>Abril</span>
            </div>
          </div>
        </article>
      </section>
    </section>
  </main>
</template>

<script src="./CompanyMenuPage.js"></script>
<style src="./CompanyMenuPage.css" scoped></style>
