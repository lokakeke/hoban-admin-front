<template>
  <div style="display: flex">
    <div
      class="gnb-menu-item"
      v-for="parentMenu in this.menus.filter(menu => !menu.parentMenuId)" :key="parentMenu.menuId"
      @click="(e) => handleClickChip(e,parentMenu)"
      :class="checkSelectedChip(parentMenu)"
    >
      <v-icon>{{ parentMenu.iconFont }}</v-icon>
      <span class="text-lg mx-1 whitespace-nowrap hidden-xs-only">{{
          parentMenu.menuName
        }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'GnbMenu',
  computed: {
    ...mapGetters({
      sidebarSelectedFilter: 'settings/sidebarSelectedFilter',
      menus: 'sidebar/sideMenus',
      currentSidebar: 'sidebar/currentSidebar'
    })
  },
  methods: {
    ...mapMutations({ setCurrentSidebar: 'sidebar/setCurrentSidebar' }),
    handleClickChip(event, menu) {
      this.setCurrentSidebar(menu)
    },
    checkSelectedChip(menu) {
      if (!this.currentSidebar) {
        return 'text-gray'
      }
      if (this.currentSidebar.menuId === menu.menuId) {
        return 'text-primary'
      }
      return 'text-gray'
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>
