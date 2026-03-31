import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  createCompanyFolder,
  getCompanyFileDownloadUrl,
  getCompanyFiles,
  getCompanyFolders,
  uploadCompanyFile,
} from '@/api/serrvicios'

export default {
  name: 'CompanyDirectoryPage',
  setup() {
    const route = useRoute()
    const companyId = computed(() => Number(route.params.id))
    const folders = ref([])
    const files = ref([])
    const selectedFolderId = ref(null)
    const newFolderName = ref('')
    const selectedFile = ref(null)
    const fileInputRef = ref(null)
    const error = ref('')

    const loadFolders = async () => {
      folders.value = await getCompanyFolders(companyId.value)
    }

    const loadFiles = async () => {
      if (selectedFolderId.value == null) {
        files.value = []
        return
      }
      files.value = await getCompanyFiles(companyId.value, selectedFolderId.value)
    }

    const pickDefaultFolder = () => {
      if (selectedFolderId.value != null) return
      if (folders.value.length === 0) return
      selectedFolderId.value = folders.value[0].id
    }

    const loadAll = async () => {
      error.value = ''
      try {
        await loadFolders()
        pickDefaultFolder()
        await loadFiles()
      } catch (err) {
        error.value = err?.message || 'No se pudo cargar el directorio.'
      }
    }

    const handleCreateFolder = async () => {
      if (!newFolderName.value.trim()) return
      error.value = ''
      try {
        await createCompanyFolder(companyId.value, {
          name: newFolderName.value,
          parentFolderId: null,
        })
        newFolderName.value = ''
        await loadFolders()
        pickDefaultFolder()
        await loadFiles()
      } catch (err) {
        error.value = err?.message || 'No se pudo crear la carpeta.'
      }
    }

    const onFileChange = (event) => {
      const [file] = event.target.files || []
      selectedFile.value = file || null
    }

    const handleUpload = async () => {
      if (selectedFolderId.value == null) {
        error.value = 'Seleccione o cree una carpeta antes de subir archivos.'
        return
      }
      if (!selectedFile.value) return
      error.value = ''
      try {
        await uploadCompanyFile(companyId.value, {
          folderId: selectedFolderId.value,
          file: selectedFile.value,
        })
        selectedFile.value = null
        if (fileInputRef.value) fileInputRef.value.value = ''
        await loadFiles()
      } catch (err) {
        error.value = err?.message || 'No se pudo subir el archivo.'
      }
    }

    const selectFolder = async (folderId) => {
      selectedFolderId.value = folderId
      await loadFiles()
    }

    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const formatDate = (isoDate) => {
      return new Date(isoDate).toLocaleString('es-CO')
    }

    const buildDownloadUrl = (fileId) => getCompanyFileDownloadUrl(companyId.value, fileId)

    const canUpload = computed(
      () => folders.value.length > 0 && selectedFolderId.value != null,
    )

    onMounted(loadAll)

    return {
      folders,
      files,
      selectedFolderId,
      newFolderName,
      fileInputRef,
      error,
      canUpload,
      handleCreateFolder,
      handleUpload,
      onFileChange,
      selectFolder,
      formatSize,
      formatDate,
      buildDownloadUrl,
    }
  },
}
