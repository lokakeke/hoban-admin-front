/**
 * @/store/modules
 */

const modulesFiles = import.meta.globEager('./**/index.js')
const modules = {}
for (const path in modulesFiles) {
  const moduleName = path.replace(/(\.\/|\/index.js|\/[\w\W]+\/index.js)/g, '')
  modules[moduleName] = modulesFiles[path].default
}

export default modules
