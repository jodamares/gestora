import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { loginUser } from '@/api/serrvicios'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const store = useStore()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const submit = async () => {
      loading.value = true
      error.value = ''
      try {
        const session = await loginUser({
          email: email.value,
          password: password.value,
        })
        store.commit('SET_AUTH', session)
        router.replace('/')
      } catch (err) {
        error.value = err?.message || 'No se pudo iniciar sesion.'
      } finally {
        loading.value = false
      }
    }

    return { email, password, loading, error, submit }
  },
}
