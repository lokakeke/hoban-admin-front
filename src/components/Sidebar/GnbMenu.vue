<template>
    <div>
        <v-chip
            class="mr-2"
            default
            v-for="parentMenu in this.menus.filter(menu => !menu.parentMenuId)" :key="parentMenu.menuId"
            @click="(e) => handleClickChip(e,parentMenu)"
            :color="checkSelectedChip(parentMenu)"
        >{{ parentMenu.menuName }}
        </v-chip>
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
    handleClickChip (event, menu) {
      this.setCurrentSidebar(menu)
    },
    checkSelectedChip (menu) {
      if (!this.currentSidebar) {
        return 'gray'
      }
      if (this.currentSidebar.menuId === menu.menuId) {
        return 'primary'
      }
      return 'gray'
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
