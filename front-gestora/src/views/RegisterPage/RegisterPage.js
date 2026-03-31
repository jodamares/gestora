import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { registerUser } from '@/api/serrvicios'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const store = useStore()
    const fullName = ref('')
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')

    const submit = async () => {
      loading.value = true
      error.value = ''
      try {
        const session = await registerUser({
          fullName: fullName.value,
          email: email.value,
          password: password.value,
        })
        store.commit('SET_AUTH', session)
        router.replace('/')
      } catch (err) {
        error.value = err?.message || 'No se pudo crear el usuario.'
      } finally {
        loading.value = false
      }
    }

    return { fullName, email, password, loading, error, submit }
  },
}
