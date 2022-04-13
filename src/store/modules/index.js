/**
 * @/store/modules
 */

import auth from '@/store/modules/auth/'
import commonCode from '@/store/modules/commonCode/'
import dialog from '@/store/modules/dialog/'
import keypress from '@/store/modules/keypress/'
import naver from '@/store/modules/naver/'
import message from '@/store/modules/message/'
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
  message,
  partner,
  settings,
  sidebar,
  social
}

/* const modulesFiles = import.meta.globEager('./!**!/index.js')
const modules = {}
for (const path in modulesFiles) {
  const moduleName = path.replace(/(\.\/|\/index.js|\/[\w\W]+\/index.js)/g, '')
  modules[moduleName] = modulesFiles[path].default
} */

// FIXME vite require 지원 불가..
/* 기존 API 소스
const requireModule = require.context('.', true, /\/[\w\W]+\/index.js$/)
const modules = {}
requireModule.keys().forEach(fileName => {
  const moduleName = fileName.replace(/(\.\/|\/index.js)/g, '')
  modules[moduleName] = requireModule(fileName).default
})
*/

export default modules
