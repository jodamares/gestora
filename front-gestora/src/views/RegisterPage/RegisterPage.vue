<template>
  <main class="auth-page">
    <section class="auth-page__card">
      <h1>Crear usuario</h1>
      <form @submit.prevent="submit">
        <label>
          Nombre completo
          <input v-model.trim="fullName" type="text" required />
        </label>
        <label>
          Correo
          <input v-model.trim="email" type="email" required />
        </label>
        <label>
          Contrasena
          <input v-model="password" type="password" required minlength="6" />
        </label>
        <p v-if="error" class="auth-page__error">{{ error }}</p>
        <button :disabled="loading" type="submit">{{ loading ? 'Creando...' : 'Crear usuario' }}</button>
      </form>
      <p>
        Ya tienes cuenta?
        <RouterLink to="/login">Iniciar sesion</RouterLink>
      </p>
    </section>
  </main>
</template>

<script src="./RegisterPage.js"></script>
<style src="../LoginPage/AuthPage.css" scoped></style>
