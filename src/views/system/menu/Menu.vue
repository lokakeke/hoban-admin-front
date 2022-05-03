<template>
  <div>
    <v-row>
      <v-col v-for="(treeMenu, index) of tree" sm="6" md="4" cols="12" :key="index">
        <menu-form v-model="tree"
                   :index="index"
                   :limit-index="limitIndex"
                   :add-list="addList"
                   :road-menu="roadMenu"
                   :view-item="viewItem"
                   :view-active-item="viewActiveItem"
                   :add-item="addItem"
        >
        </menu-form>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="dialog"
      :width="800"
      fixed
      app
      right
      temporary
      stateless>
      <v-card flat>
        <v-card-title class="pa-0">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>메뉴 {{ form.menuId ? '상세/수정' : '입력' }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialog = false">Close</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-form ref="form" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" v-if="form.parentMenuName">
                  <v-label>상위 메뉴</v-label>
                  <v-text-field v-model="form.parentMenuName" label="" class="pt-0" disabled></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-label>메뉴 이름</v-label>
                  <v-text-field v-model="form.menuName" :rules="emptyRules" label="" required
                                class="pt-0"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-label>메뉴 주소 (하위메뉴가 등록되어야 할 경우 비워주세요)</v-label>
                  <v-text-field v-model="form.menuPath" label="" class="pt-0"></v-text-field>
                  <template v-if="!form.parentMenuId">
                    <v-label>메뉴 아이콘 폰트</v-label>
                    <br/>
                    <v-label>참고 : <a href="https://material.io/resources/icons" target="_blank">https://material.io/resources/icons</a>
                    </v-label>
                    <v-text-field v-model="form.iconFont" label="" class="pt-0" hide-details></v-text-field>
                  </template>
                </v-col>
                <v-col cols="12">
                  <v-checkbox class="mt-0 pt-0" v-model="form.useYn" label="사용여부" required true-value="Y"
                              false-value="N" hide-details></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-col class="text-center">
            <v-btn outlined rounded small color="orange" @click="reset()" v-if="writeAuth">
              <v-icon>refresh</v-icon>
              원래대로
            </v-btn>
            <v-btn outlined rounded small color="info" @click="emit()" v-if="writeAuth">
              <v-icon>check</v-icon>
              입력
            </v-btn>
            <v-btn v-if="!isNew && writeAuth" outlined rounded small color="error" @click="deleteMenu">
              <v-icon>remove</v-icon>
              삭제
            </v-btn>
            <v-btn outlined rounded small color="primary" @click="dialog = false">
              <v-icon>close</v-icon>
              닫기
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import menuService from '@/api/modules/system/menu.service'
import MenuForm from '@/components/System/Menu/MenuForm.vue'

export default {
  name: 'menuManagement',
  components: { MenuForm },
  data () {
    return {
      tree: [],
      treeClone: [],
      form: {},
      formClone: {},
      dialog: false,
      isNew: false,
      /**
       * depth 허용 갯수
       */
      limit: 3,
      limitIndex: 0
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    // depth 허용 인덱스 셋팅
    this.limitIndex = this.limit > 0 ? this.limit - 1 : 0
    this.roadMenu()
  },
  methods: {
    roadMenu () {
      // 현재 저장된 active 상태를 저장 후 비교하여 열어준다.
      this.treeClone = _.cloneDeep(this.tree)
      this.tree = []
      menuService.selectMenuList().then(res => {
        const result = res.data
        this.tree.push({
          menus: result,
          title: '메뉴 카테고리'
        })
        if (this.treeClone.length > 0) {
          let index = 0
          for (const tree of this.treeClone) {
            for (const menu of tree.menus) {
              if (menu.active) {
                this.searchActiveMenu(result, menu.menuId, index)
              }
            }
            index++
          }
        }
      })
    },
    searchActiveMenu (menus, menuId, depth) {
      /**
       * menus : 서버에서 넘어온 menu 정보
       * menuId: active 상태인 메뉴 ID
       * index : 화면에 표시될 depth
       */
      for (const menu of menus) {
        if (menu.menuId === menuId) {
          menu.active = true
          this.addList(menus, menu.menuId, depth)
        } else if (menu.children && menu.children.length > 0) {
          this.searchActiveMenu(menu.children, menuId, depth)
        }
      }
    },
    addList (menus, menuId, index) {
      // 허용된 limit index 까지만 메뉴를 생성한다.
      if (index < this.limitIndex) {
        const menu = { menus: [] }
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].menuId === menuId) {
            if (menus[i].children && menus[i].children.length > 0) {
              menu.menus = menus[i].children
              for (const row of menu.menus) {
                row.active = false
              }
            }
            menu.title = menus[i].menuName
            menus[i].active = true
          } else {
            menus[i].active = false
          }
        }
        this.tree = this.tree.slice(0, index + 1).concat([menu])
      } else {
        for (let i = 0; i < menus.length; i++) {
          menus[i].active = menus[i].menuId === menuId
        }
        const menu = this.tree[index]
        menu.menus = menus
        this.tree = this.tree.slice(0, index).concat([menu])
      }
    },
    viewItem (menu) {
      this.form = _.cloneDeep(menu)
      this.formClone = _.cloneDeep(menu)
      this.isNew = false
      this.dialog = true
    },
    viewActiveItem (menus, menuId, index) {
      for (let i = 0; i < menus.length; i++) {
        menus[i].active = menus[i].menuId === menuId
      }
      const menu = this.tree[index]
      menu.menus = menus
      this.tree = this.tree.slice(0, index).concat([menu])
      // 상세 모달을 연다.
      this.viewItem(menus.find(data => data.menuId === menuId))
    },
    addItem (index) {
      // 해당 depth 에 선택된 parent 를 찾는다.
      const form = { useYn: 'Y' }
      if (index === 0) {
        form.parentMenuId = ''
      } else {
        // 선택된 parent 를 찾는다.
        for (const menu of this.tree[index - 1].menus) {
          if (menu.active) {
            form.parentMenuName = menu.menuName
            form.parentMenuId = menu.menuId
          }
        }
      }
      this.form = form
      this.$refs.form.resetValidation()
      this.isNew = true
      this.dialog = true
    },
    reset () {
      this.form = _.cloneDeep(this.formClone)
    },
    async emit () {
      try {
        await this.validForm(this.$refs.form)
        await this.$dialog.confirm(this.form.menuId ? '메뉴정보를 수정하시겠습니까?' : '메뉴정보를 입력하시겠습니까?')
        if (this.form.menuId) {
          const editFrom = _.cloneDeep(this.form)
          delete editFrom.active

          await menuService.updateMenu(this.form)
          this.$dialog.alert('수정되었습니다.')
        } else {
          await menuService.insertMenu(this.form)
          this.$dialog.alert('저장되었습니다.')
        }
        this.roadMenu()
        this.dialog = false
      } catch (e) {
      }
    },
    async deleteMenu () {
      try {
        if (!this.isNew && this.form.menuId) {
          await this.$dialog.confirm(`${this.form.menuName} 를 삭제 하시겠습니까?<br/> 삭제 시 하위 메뉴 및<br/>메뉴 권한에 포함된 메뉴정보도 모두 삭제됩니다.`)
          await menuService.deleteMenu(this.form.menuId)
          this.dialog = false
          this.$dialog.alert('삭제 되었습니다.')
          this.roadMenu()
        }
      } catch (e) {
      }
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
