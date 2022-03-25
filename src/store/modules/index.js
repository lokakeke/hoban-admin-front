/**
 * @/store/modules
 */

import auth from '@/store/modules/auth/'
import commonCode from '@/store/modules/commonCode/'
import dialog from '@/store/modules/dialog/'
import keypress from '@/store/modules/keypress/'
import naver from '@/store/modules/naver/'
import notification from '@/store/modules/notification/'
import partner from '@/store/modules/partner/inventory'
import settings from '@/store/modules/settings/'
import sidebar from '@/store/modules/sidebar/'
import social from '@/store/modules/social/statistics'

const modules = {
  auth,
  commonCode,
  dialog,
  keypress,
  naver,
  notification,
  partner,
  settings,
  sidebar,
  social
}

// const requireModule = require.context('.', true, /\/[\w\W]+\/index.js$/)
// requireModule.keys().forEach(fileName => {
//   const moduleName = fileName.replace(/(\.\/|\/index.js)/g, '')
//   modules[moduleName] = requireModule(fileName).default
//   console.log('moduleName: ' + moduleName)
//   console.log('value: ' + modules.moduleName)
// })
//
// console.log(modules)

export default modules
