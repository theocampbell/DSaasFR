import { createApp } from 'vue'
import VueDsfr from '@gouvminint/vue-dsfr'
import DSaaSFR from 'dsaasfr'
import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import 'dsaasfr/styles'
import App from './App.vue'

// This is the exact install sequence a consuming app follows (see README).
createApp(App).use(VueDsfr).use(DSaaSFR).mount('#app')
