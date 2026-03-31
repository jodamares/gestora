import { computed, onMounted, reactive, ref } from 'vue'
import { createCompany } from '@/api/serrvicios'

const initialForm = () => ({
  name: '',
  nit: '',
  city: '',
  department: '',
  phoneNumber: '',
  email: '',
  description: '',
})

export default {
  name: 'CompanyCreatePage',
  setup() {
    const form = reactive(initialForm())
    const documentFile = ref(null)
    const loading = ref(false)
    const loadingView = ref(true)
    const error = ref('')
    const success = ref('')
    const currentStep = ref(1)
    const fileTouched = ref(false)

    onMounted(() => {
      globalThis.setTimeout(() => {
        loadingView.value = false
      }, 550)
    })

    const onFileChange = (event) => {
      const [file] = event.target.files || []
      documentFile.value = file || null
      fileTouched.value = true
    }

    const fileInputRef = ref(null)

    const resetForm = () => {
      Object.assign(form, initialForm())
      documentFile.value = null
      fileTouched.value = false
      if (fileInputRef.value) fileInputRef.value.value = ''
    }

    const submitForm = async () => {
      error.value = ''
      success.value = ''
      if (!documentFile.value) {
        error.value = 'Debes adjuntar un archivo Word.'
        return
      }

      loading.value = true
      try {
        await createCompany({
          ...form,
          document: documentFile.value,
        })
        success.value = 'Empresa creada correctamente.'
        resetForm()
      } catch (err) {
        error.value = err?.message || 'No se pudo crear la empresa.'
      } finally {
        loading.value = false
      }
    }

    const validateStep = () => {
      if (currentStep.value === 1) {
        if (!form.name || !form.nit || !form.city) {
          error.value = 'Completa Nombre, NIT y Ciudad para continuar.'
          return false
        }
      }
      if (currentStep.value === 2) {
        if (!form.department || !form.phoneNumber || !form.email) {
          error.value = 'Completa Departamento, Telefono y Correo para continuar.'
          return false
        }
      }
      error.value = ''
      return true
    }

    const nextStep = () => {
      if (!validateStep()) return
      if (currentStep.value < 3) currentStep.value += 1
    }

    const previousStep = () => {
      if (currentStep.value > 1) currentStep.value -= 1
      error.value = ''
    }

    const isFileInvalid = computed(() => fileTouched.value && !documentFile.value)

    return {
      form,
      currentStep,
      loadingView,
      loading,
      error,
      success,
      isFileInvalid,
      fileInputRef,
      onFileChange,
      submitForm,
      nextStep,
      previousStep,
    }
  },
}
