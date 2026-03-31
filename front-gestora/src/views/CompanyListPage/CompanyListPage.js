import { computed, onMounted, ref } from 'vue'
import {
  getCompanies,
  getCompanyDocumentDownloadUrl,
} from '@/api/serrvicios'

export default {
  name: 'CompanyListPage',
  setup() {
    const companies = ref([])
    const loading = ref(false)
    const error = ref('')
    const search = ref('')
    const statusFilter = ref('all')
    const activeActionMenu = ref(null)

    const loadCompanies = async () => {
      loading.value = true
      error.value = ''
      try {
        companies.value = await getCompanies()
      } catch (err) {
        error.value = err?.message || 'No se pudo cargar el listado.'
      } finally {
        loading.value = false
      }
    }

    onMounted(loadCompanies)

    const normalizedSearch = computed(() => search.value.trim().toLowerCase())
    const companiesWithStatus = computed(() =>
      companies.value.map((company, index) => ({
        ...company,
        status: index % 3 === 0 ? 'Pendiente' : 'Activo',
      })),
    )

    const filteredCompanies = computed(() =>
      companiesWithStatus.value.filter((company) => {
        const matchesText =
          normalizedSearch.value.length === 0 ||
          company.name.toLowerCase().includes(normalizedSearch.value) ||
          company.nit.toLowerCase().includes(normalizedSearch.value) ||
          company.email.toLowerCase().includes(normalizedSearch.value)

        const matchesStatus =
          statusFilter.value === 'all' ||
          company.status.toLowerCase() === statusFilter.value

        return matchesText && matchesStatus
      }),
    )

    const toggleActionMenu = (companyId) => {
      activeActionMenu.value = activeActionMenu.value === companyId ? null : companyId
    }

    const closeActionMenu = () => {
      activeActionMenu.value = null
    }

    const getCompanyInitials = (name = '') =>
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0]?.toUpperCase())
        .join('')

    return {
      companies,
      loading,
      error,
      search,
      statusFilter,
      activeActionMenu,
      filteredCompanies,
      buildDocumentUrl: getCompanyDocumentDownloadUrl,
      toggleActionMenu,
      closeActionMenu,
      getCompanyInitials,
    }
  },
}
