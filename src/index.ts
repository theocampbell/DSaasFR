import type { App, Plugin } from 'vue'
import * as components from './components'
import './styles/index.css'

export * from './components'
export { useRouteBreadcrumb } from './composables/useRouteBreadcrumb'
export { usePreviewQuery } from './composables/usePreviewQuery'
export type { DsaasfrRouteBreadcrumb } from './composables/useRouteBreadcrumb'

// Editor support for the globally registered components (`app.use(DSaaSFR)`): templates
// get autocomplete and prop checking without importing each component.
type DsaasfrComponents = typeof components
declare module 'vue' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GlobalComponents extends DsaasfrComponents {}
}

export interface DSaaSFROptions {
  /** Register every Dsaasfr* component globally (default: true). */
  registerComponents?: boolean
}

const DSaaSFR: Plugin<[DSaaSFROptions?]> = {
  install(app: App, options: DSaaSFROptions = {}) {
    const { registerComponents = true } = options
    if (!registerComponents) {
      return
    }
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default DSaaSFR
