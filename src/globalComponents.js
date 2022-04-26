/**
 * Vuely Global Components
 */
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VuePerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import AppSectionLoader from '@/components/App/AppSectionLoader.vue'

// app card
import AppCard from '@/components/App/AppCard.vue'

// search pagination
import SearchPagination from '@/components/Search/SearchPagination.vue'

// search form
import SearchForm from '@/components/Search/SearchForm.vue'

// draggable
import draggable from 'vuedraggable'

// editor
import VEditor from '@/components/Editor/VEditor.vue'

// dialog base
import DialogBase from '@/components/Dialog/DialogBase.vue'

// date(Range)Picker
import DatePicker from '@/components/Date/DatePicker.vue'
import DateRangePicker from '@/components/Date/DateRangePicker.vue'

import MaskPhoneNumber from '@/components/Mask/MaskPhoneNumber.vue'

// attach
import Attach from '@/components/Attach/Attach.vue'

const GlobalComponents = {
  install (Vue) {
    Vue.component('appCard', AppCard)
    Vue.component('appSectionLoader', AppSectionLoader)
    Vue.component('vuePerfectScrollbar', VuePerfectScrollbar)
    Vue.component('searchPagination', SearchPagination)
    Vue.component('searchForm', SearchForm)
    Vue.component('draggable', draggable)
    Vue.component('vEditor', VEditor)
    Vue.component('dialogBase', DialogBase)
    Vue.component('datePicker', DatePicker)
    Vue.component('dateRangePicker', DateRangePicker)
    Vue.component('maskPhoneNumber', MaskPhoneNumber)
    Vue.component('attach', Attach)
  }
}

export default GlobalComponents
