<template>
  <app-card :heading="value[index].title">
    <v-row no-gutters justify="end">
      <v-col md="6" cols="12">
        <v-text-field v-model="filter" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search"/>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-list v-if="menus && menus.length > 0" dense>
      <draggable v-model="value[index].menus">
        <template v-for="menu of menus">
          <v-list-item v-if="index < limitIndex" :class="['menu-list', menu.active? 'active': '']"
                       :key="menu.menuId" @click="addList(value[index].menus, menu.menuId, index)">
            <v-list-item-action @click.stop @click="viewItem(menu)">
              <v-btn text>
                <v-icon left>edit</v-icon>
                상세
              </v-btn>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon v-if="menu.iconFont" left small>{{ menu.iconFont }}</v-icon>
                <span :class="menu.useYn === 'N'? 'strike': ''">{{ menu.menuName }}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-else :class="['menu-list', menu.active? 'active': '']"
                       :key="menu.menuId" @click="viewActiveItem(value[index].menus, menu.menuId, index)">
            <v-list-item-action>
              <v-icon right>search</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon v-if="menu.iconFont" left small>{{ menu.iconFont }}</v-icon>
                <span :class="menu.useYn === 'N'? 'strike': ''">{{ menu.menuName }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </draggable>
    </v-list>
    <v-row v-else align="center" justify="center">
      메뉴가 없습니다.
    </v-row>
    <v-divider></v-divider>
    <v-row align="end" justify="center" v-if="writeAuth">
      <v-btn outlined rounded small color="orange" @click="sort(value[index].menus)" v-if="!filter">
        <v-icon>refresh</v-icon>
        원래대로
      </v-btn>
      <v-btn outlined rounded small color="info" @click="sortChange(value[index].menus)" v-if="!filter">
        <v-icon>swap_vert</v-icon>
        순서저장
      </v-btn>
      <v-btn outlined rounded small color="primary" @click="addItem(index)">
        <v-icon>add</v-icon>
        메뉴추가
      </v-btn>
    </v-row>
  </app-card>
</template>

<script>
import menuService from '@/api/modules/system/menu.service'

export default {
  name: 'MenuForm',
  props: {
    value: Array,
    index: Number,
    limitIndex: Number,
    addList: Function,
    roadMenu: Function,
    viewItem: Function,
    viewActiveItem: Function,
    addItem: Function
  },
  data () {
    return {
      filter: ''
    }
  },
  computed: {
    menus () {
      return this.value[this.index].menus.filter(data => data.menuName.indexOf(this.filter) !== -1)
    }
  },
  methods: {
    sortChange (menus) {
      // 순서가 변환된 목록을 추려낸다.
      const changeList = []
      for (let index = 0; index < menus.length; index++) {
        const order = index + 1
        if (order !== menus[index].sortOrder) {
          changeList.push({
            menuId: menus[index].menuId,
            sortOrder: order
          })
        }
      }
      if (changeList.length === 0) {
        this.$dialog.alert('변경된 사항이 없습니다.')
      } else {
        this.$dialog.confirm({
          body: '순서를 변경하시겠습니까?',
          title: '확인'
        }).then(() => {
          menuService.updateMenuOrder(changeList).then(res => {
            this.$dialog.alert('저장되었습니다.')
            this.roadMenu()
          })
        }).catch(() => {
        })
      }
    }
  }
}
</script>
