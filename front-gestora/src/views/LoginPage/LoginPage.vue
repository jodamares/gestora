<template>
  <main class="auth-page">
    <section class="auth-page__card">
      <img src="/logo-large.png" alt="Gestor Empresarial" class="auth-page__logo" />
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="submit">
        <label>
          Correo
          <input v-model.trim="email" type="email" required />
        </label>
        <label>
          Contraseña
          <input v-model="password" type="password" required />
        </label>
        <p v-if="error" class="auth-page__error">{{ error }}</p>
        <button :disabled="loading" type="submit">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
      </form>
      <p>
        ¿No tienes cuenta?
        <RouterLink to="/register">Crear usuario</RouterLink>
      </p>
    </section>
  </main>
</template>

<script src="./LoginPage.js"></script>
<style src="./AuthPage.css" scoped></style>
