<template>
  <main class="company-directory">
    <header class="company-directory__header">
      <h1>Directorio de archivos</h1>

      <RouterLink to="/companies">Volver al listado</RouterLink>
    </header>

    <p class="company-directory__rule">
      Los archivos solo se pueden cargar dentro de una carpeta. Crea al menos una carpeta para comenzar.
    </p>

    <p v-if="error" class="company-directory__error">{{ error }}</p>

    <section v-if="loading" class="company-directory__grid">
      <article class="company-directory__panel">
        <div class="skeleton company-directory__sk-line company-directory__sk-line--title"></div>
        <div class="skeleton company-directory__sk-line"></div>
        <div class="skeleton company-directory__sk-line"></div>
        <div class="skeleton company-directory__sk-line company-directory__sk-line--sm"></div>
      </article>
      <article class="company-directory__panel">
        <div class="skeleton company-directory__sk-line company-directory__sk-line--title"></div>
        <div class="skeleton company-directory__sk-line"></div>
        <div class="skeleton company-directory__sk-line"></div>
        <div class="skeleton company-directory__sk-line"></div>
      </article>
    </section>

    <section v-else class="company-directory__grid">
      <article class="company-directory__panel">
        <h2>Carpetas</h2>
        <form class="company-directory__inline-form" @submit.prevent="handleCreateFolder">
          <input v-model.trim="newFolderName" type="text" placeholder="Nueva carpeta" />
          <button type="submit">Crear</button>
        </form>
        <div v-if="folders.length === 0" class="company-directory__empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
          <p>Crea la primera carpeta para empezar a subir archivos.</p>
        </div>
        <ul v-else class="company-directory__list">
          <li v-for="folder in folders" :key="folder.id">
            <button
              type="button"
              :class="{ active: selectedFolderId === folder.id }"
              @click="selectFolder(folder.id)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              </svg>
              {{ folder.name }}
            </button>
          </li>
        </ul>
      </article>

      <article class="company-directory__panel">
        <h2>Archivos</h2>
        <form
          class="company-directory__inline-form"
          :class="{ 'company-directory__inline-form--disabled': !canUpload }"
          @submit.prevent="handleUpload"
        >
          <input
            ref="fileInputRef"
            type="file"
            :disabled="!canUpload"
            @change="onFileChange"
          />
          <button type="submit" :disabled="!canUpload">Subir archivo</button>
        </form>
        <p v-if="!canUpload && folders.length > 0" class="company-directory__hint">
          Elija una carpeta en la lista para habilitar la carga.
        </p>

        <table class="company-directory__table" v-if="files.length > 0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tamaño</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in files" :key="file.id">
              <td>{{ file.originalName }}</td>
              <td>{{ formatSize(file.size) }}</td>
              <td>{{ formatDate(file.createdAt) }}</td>
              <td>
                <a :href="buildDownloadUrl(file.id)" target="_blank" rel="noopener">Descargar</a>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else-if="canUpload" class="company-directory__empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>No hay archivos en esta carpeta. Sube el primero.</p>
        </div>
      </article>
    </section>
  </main>
</template>

<script src="./CompanyDirectoryPage.js"></script>
<style src="./CompanyDirectoryPage.css" scoped></style>
