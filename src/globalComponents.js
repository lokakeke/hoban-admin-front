/**
 * Vuely Global Components
 */
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import AppSectionLoader from 'Components/App/AppSectionLoader.vue'

// app card
import AppCard from 'Components/App/AppCard.vue'

// search pagination
import SearchPagination from 'Components/Search/SearchPagination.vue'

// search form
import SearchForm from 'Components/Search/SearchForm.vue'

// draggable
import draggable from 'vuedraggable'

// editor
import VEditor from 'Components/Editor/VEditor.vue'

// dialog base
import DialogBase from 'Components/Dialog/DialogBase.vue'

// date(Range)Picker
import DatePicker from 'Components/Date/DatePicker.vue'
import DateRangePicker from 'Components/Date/DateRangePicker.vue'

import MaskPhoneNumber from 'Components/Mask/MaskPhoneNumber.vue'

// attach
import Attach from 'Components/Attach/Attach.vue'

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
