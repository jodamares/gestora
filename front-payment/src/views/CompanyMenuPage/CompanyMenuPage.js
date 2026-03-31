export default {
  name: 'CompanyMenuPage',
  data() {
    return {
      loading: true,
      stats: [
        { label: 'Empresas activas', value: '128', trend: '+12%' },
        { label: 'Archivos procesados', value: '3,420', trend: '+8%' },
        { label: 'Carpetas creadas', value: '860', trend: '+15%' },
      ],
      recentActivity: [
        { title: 'Documento subido', detail: 'Acme SAS - Camara de comercio', time: 'Hace 4 min' },
        { title: 'Nueva empresa creada', detail: 'Nova Group', time: 'Hace 18 min' },
        { title: 'Carpeta actualizada', detail: 'Fenix Logistics - Contratos', time: 'Hace 36 min' },
      ],
    }
  },
  mounted() {
    globalThis.setTimeout(() => {
      this.loading = false
    }, 700)
  },
}
