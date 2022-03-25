<template>
  <div>
    <v-text-field
      v-model="search"
      prepend-inner-icon="search"
      placeholder="메뉴 검색"
      clearable
      hide-details
      solo
      flat
      class="font-weight-bold"
      @input="checkMenu" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: 'MenuSearch',
  data () {
    return {
      search: ''
    }
  },
  computed: {
    ...mapGetters({ menus: 'sidebar/menus' })
  },
  mounted () {
    this.$store.dispatch('sidebar/setSideMenus', null)
  },
  methods: {
    async checkMenu () {
      if (this.search && Array.isArray(this.menus) && this.menus.length > 0) {
        const menus = _.cloneDeep(this.menus)
        await this.$store.dispatch('sidebar/setSideMenus', this.filterMenu(menus))
      } else {
        await this.$store.dispatch('sidebar/setSideMenus', null)
      }
    },
    filterMenu (menus = []) {
      const filterMenus = []
      for (const menu of menus) {
        const menuNm = (menu.menuNm || '').toLowerCase()
        const search = (this.search || '').toLowerCase()
        if (menuNm.indexOf(search) > -1) {
          filterMenus.push(menu)
        } else if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
          const filterChild = this.filterMenu(menu.children)
          if (filterChild.length > 0) {
            const filterMenu = menu
            menu.children = filterChild
            filterMenus.push(filterMenu)
          }
        }
      }
      return filterMenus
    }
  }
}
</script>
