// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  server: {
    host: '0'
  },
  css: ['./assets/css/normalize.css', 'primevue/resources/themes/lara-light-teal/theme.css', 'primeicons/primeicons.css'],
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'nuxt-primevue',

  ],
  primevue: {

    options: {

      // inputStyle: 'filled',
      ripple: true,
      // unstyled: true,
    },
    components: {
      include: ['InputText', 'Button', 'AnimateOnScroll', 'Dialog', 'ScrollPanel', 'Paginator', 'InputOtp', 'Divider', 'RadioButton', 'Carousel', 'MultiSelect', 'FloatLabel', 'Listbox', 'Toolbar', 'Avatar', 'Sidebar', 'Inplace', 'Checkbox']
    },

  },
})
