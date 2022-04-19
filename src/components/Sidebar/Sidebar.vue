<!-- Side Structure -->
<template>
  <div class="sidebar" :class="sidebarSelectedFilter.class">
    <app-logo></app-logo>
      <div class="side-content">
        <user-block></user-block>
        <menu-search></menu-search>
        <vue-perfect-scrollbar
          class="scroll-area"
          :settings="settings"
          style="height: calc(100% - 64px - 56px - 56px);"
        >
          <div class="transparent navigation">
            <v-list dense class="menu-sidebar">
              <div v-for="(category, key) in this.menus" :key="key">
                <div
                  class="subtitle-2 font-weight-black px-4 py-2 mb-1"
                  :class="key !== 0? 'border-top': ''">
                  <v-icon v-if="category.iconFont" left color="#5c4037">{{ category.iconFont }}</v-icon>
                  <v-icon v-if="category.iconFont" left color="#5c4037">dd</v-icon>
                  {{category.menuName}}
                </div>
                <template v-for="item in category.children">
                  <v-list-group
                    v-if="item.children && item.children.length > 0"
                    class="mb-1"
                    :key="item.menuId"
                    prepend-icon="arrow_right"
                    no-action
                    :value="checkRouter(item)"
                    :ripple="false"
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title>
                          <span>{{ item.menuName }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-item
                      v-for="subItem in getExistChildren(item.children)"
                      :key="item.menuId + subItem.menuId"
                      :to="subItem.menuPath || '404'"
                      :ripple="false"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-icon small>subdirectory_arrow_right</v-icon>
                          {{ subItem.menuName }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                  <v-list-group
                    v-else
                    class="not-submenu mb-1"
                    :key="item.menuId"
                    prepend-icon="arrow_right"
                    append-icon=""
                    no-action
                    :value="checkRouter(item)"
                    :ripple="false"
                  >
                    <template v-slot:activator>
                      <v-list-item :to="item.menuPath" @click.native.stop="" :ripple="false">
                        <v-list-item-content>
                          <v-list-item-title>
                            <span>{{ item.menuName }} </span>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list-group>
                </template>
              </div>
            </v-list>
          </div>
        </vue-perfect-scrollbar>
      </div>
  </div>
</template>

<script>
import UserBlock from '@/components/Sidebar/UserBlock.vue'
import AppLogo from '@/components/App/AppLogo.vue'
import MenuSearch from '@/components/Sidebar/MenuSearch.vue'
import { textTruncate } from '@/helpers/helpers'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      settings: {
        maxScrollbarLength: 160
      }
    }
  },
  components: {
    UserBlock,
    AppLogo,
    MenuSearch
  },
  computed: {
    ...mapGetters({ sidebarSelectedFilter: 'settings/sidebarSelectedFilter', sideMenus: 'sidebar/sideMenus', currentSidebar: 'sidebar/currentSidebar' }),
    menus () {
      return this.currentSidebar ? [this.currentSidebar] : [this.sideMenus[0]]
    }
  },
  methods: {
    textTruncate (text) {
      return textTruncate(text, 18)
    },
    checkRouter (item) {
      const fullPath = this.$route.fullPath.split('?')[0]
      if (item.children && item.children.length > 0) {
        for (const sub of item.children) {
          if (sub.menuPath === fullPath) {
            return true
          }
        }
      } else if (item.menuPath === fullPath) {
        return true
      }
      return false
    },
    getExistChildren (children) {
      const childrenList = []
      if (children) {
        children.forEach(childrenItem => {
          if (childrenItem !== null) {
            childrenList.push(childrenItem)
          }
        })
      }
      return childrenList
    }
  }
}
</script>
