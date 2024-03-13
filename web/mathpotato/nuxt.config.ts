// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'nuxt-primevue'
  ],
  primevue: {
    
    options: {
      
      inputStyle: 'filled',
      ripple: true,
      unstyled: true,
    },
    components:{ 
      include:['InputText', 'Button', 'AnimateOnScroll', 'Dialog']
    },
    
  },
})
