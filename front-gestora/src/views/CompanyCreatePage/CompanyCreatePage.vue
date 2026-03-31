<template>
  <main class="company-create">
    <section v-if="loadingView" class="company-create__card surface-card">
      <div class="skeleton company-create__sk-line company-create__sk-line--title"></div>
      <div class="skeleton company-create__sk-line"></div>
      <div class="skeleton company-create__sk-line"></div>
      <div class="skeleton company-create__sk-line company-create__sk-line--short"></div>
    </section>

    <section v-else class="company-create__card surface-card">
      <header class="company-create__header">
        <div>
          <p class="company-create__eyebrow">Creacion de empresa</p>
          <h1>Formulario de registro</h1>
        </div>
        <RouterLink to="/companies">Ver listado</RouterLink>
      </header>

      <div class="company-create__steps" aria-label="Progreso">
        <span :class="{ active: currentStep >= 1 }">1. Basico</span>
        <span :class="{ active: currentStep >= 2 }">2. Contacto</span>
        <span :class="{ active: currentStep >= 3 }">3. Plantilla</span>
      </div>

      <form class="company-create__form" @submit.prevent="submitForm">
        <template v-if="currentStep === 1">
          <label>
            Nombre
            <input v-model.trim="form.name" type="text" required />
          </label>
          <label>
            NIT
            <input v-model.trim="form.nit" type="text" required />
          </label>
          <label class="company-create__full">
            Ciudad
            <input v-model.trim="form.city" type="text" required />
          </label>
        </template>

        <template v-if="currentStep === 2">
          <label>
            Departamento
            <input v-model.trim="form.department" type="text" required />
          </label>
          <label>
            Numero de telefono
            <input v-model.trim="form.phoneNumber" type="text" required />
          </label>
          <label class="company-create__full">
            Correo
            <input v-model.trim="form.email" type="email" required />
          </label>
        </template>

        <template v-if="currentStep === 3">
          <label class="company-create__full">
            Descripcion
            <textarea v-model.trim="form.description" rows="4" required />
          </label>
          <label class="company-create__full">
            Documento Word de la empresa (.doc/.docx)
            <input
              ref="fileInputRef"
              type="file"
              accept=".doc,.docx"
              @change="onFileChange"
              :class="{ 'company-create__field-error': isFileInvalid }"
              required
            />
          </label>
        </template>

        <p v-if="error" class="company-create__error">{{ error }}</p>
        <p v-if="success" class="company-create__success">{{ success }}</p>

        <div class="company-create__actions company-create__full">
          <RouterLink class="company-create__link" to="/">Menu</RouterLink>
          <div class="company-create__action-buttons">
            <button v-if="currentStep > 1" type="button" class="company-create__btn-secondary" @click="previousStep">
              Anterior
            </button>
            <button v-if="currentStep < 3" type="button" @click="nextStep">Siguiente</button>
            <button v-else :disabled="loading" type="submit">
              {{ loading ? 'Guardando...' : 'Guardar empresa' }}
            </button>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script src="./CompanyCreatePage.js"></script>
<style src="./CompanyCreatePage.css" scoped></style>
