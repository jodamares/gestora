<template>
  <main class="company-directory">
    <header class="company-directory__header">
      <h1>Directorio de archivos</h1>
      <RouterLink to="/companies">Volver al listado</RouterLink>
    </header>

    <p class="company-directory__rule">
      Los archivos solo se pueden cargar dentro de una carpeta. Cree al menos una carpeta para comenzar.
    </p>

    <p v-if="error" class="company-directory__error">{{ error }}</p>

    <section class="company-directory__grid">
      <article class="company-directory__panel">
        <h2>Carpetas</h2>
        <form class="company-directory__inline-form" @submit.prevent="handleCreateFolder">
          <input v-model.trim="newFolderName" type="text" placeholder="Nueva carpeta" />
          <button type="submit">Crear</button>
        </form>
        <p v-if="folders.length === 0" class="company-directory__hint">
          No hay carpetas. Cree la primera para poder subir archivos.
        </p>
        <ul v-else class="company-directory__list">
          <li v-for="folder in folders" :key="folder.id">
            <button
              type="button"
              :class="{ active: selectedFolderId === folder.id }"
              @click="selectFolder(folder.id)"
            >
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
              <th>Tamano</th>
              <th>Fecha</th>
              <th>Accion</th>
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

        <p v-else-if="canUpload">No hay archivos en esta carpeta.</p>
      </article>
    </section>
  </main>
</template>

<script src="./CompanyDirectoryPage.js"></script>
<style src="./CompanyDirectoryPage.css" scoped></style>
