import type { App, Plugin } from 'vue'
import * as components from './components'
import './styles/index.css'

export * from './components'

export interface DSaaSFROptions {
  /** Register every Dsfs* component globally (default: true). */
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
