<template>
  <dialog-base :title="instance.params.title" :instance="instance">
    <template v-slot:buttons v-if="writeAuth">
      <v-btn text color="info" @click="setMenu()"><v-icon left>check</v-icon>적용</v-btn>
    </template>
    <v-row>
      <v-col cols="12" class="subtitle-1 font-weight-black pt-0">
        * <span class="strike">가로줄 처리된 메뉴</span> 는 사용중지된 메뉴이며, 권한이 포함되어도 노출 되지 않습니다.
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6" md="3" v-for="menu of menuList" :key="menu.menuId" class="border-bottom border-left border-top border-right">
        <v-row align="center">
          <v-col cols="12" class="headline font-weight-bold text-center px-7">
            <v-icon class="float-left" @click="clickIcon(menu.menuId)">{{checkIcon(menu.menuId)}}</v-icon>
            <span :class="{ 'strike': menu.useYn === 'N' }">{{menu.menuName}}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-list dense>
          <template v-for="subItem of menu.children">
            <template v-if="subItem.children && subItem.children.length > 0">
              <v-list-item :key="subItem.menuId">
                <v-list-item-content>
                  <div class="title font-weight-bold" :class="{ 'strike': subItem.useYn === 'N' }">{{subItem.menuName}}</div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-for="sub of subItem.children" class="pl-6" :key="sub.menuId" @click="checkChild(subItem, sub.menuId)">
                <v-list-item-icon>
                  <v-icon>subdirectory_arrow_right</v-icon>
                    <v-icon :color="myMenu.includes(sub.menuId) ? '#ee7500' : 'gray'">{{ myMenu.includes(sub.menuId) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title :class="{ 'strike': sub.useYn === 'N' }">{{sub.menuName}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action @click.stop="">
                  <v-switch v-model="menuWrite" inset dense :value="sub.menuId" label="쓰기 권한" color="info" @change="checkWrite(sub.menuId, subItem)"></v-switch>
                </v-list-item-action>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item :key="subItem.menuId" @click="checkParents(subItem.menuId)">
                <v-list-item-icon>
                  <v-icon>subdirectory_arrow_right</v-icon>
                  <v-icon :color="myMenu.includes(subItem.menuId) ? '#ee7500' : 'gray'">{{ myMenu.includes(subItem.menuId) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content :class="{ 'strike': subItem.useYn === 'N' }">
                  {{subItem.menuName}}
                </v-list-item-content>
                <v-list-item-action @click.stop="">
                  <v-switch v-model="menuWrite" inset dense :value="subItem.menuId" label="쓰기 권한" color="info" @change="checkWrite(subItem.menuId)"></v-switch>
                </v-list-item-action>
              </v-list-item>
            </template>
          </template>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn v-if="writeAuth" outlined rounded color="info" @click="setMenu()"><v-icon left>check</v-icon>적용</v-btn>
        <v-btn outlined rounded color="primary" @click="close()"><v-icon left>close</v-icon>닫기</v-btn>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import adminMenuAuthGroupService from '@/api/modules/system/authentication/admin/adminMenuAuthGroup.service'

export default {
  extends: DialogBase,
  name: 'adminMenuAuthGroupMenu',
  data () {
    return {
      menuList: [],
      selectMenu: [],
      menuAuthGroupName: '',
      menuAuthGroupId: Number,
      myMenu: [],
      menuWrite: [],
      change: Function
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.menuList = this.instance.params.menuList
    this.selectMenu = this.instance.params.selectMenu
    this.menuAuthGroupName = this.instance.params.menuAuthGroupName
    this.menuAuthGroupId = this.instance.params.menuAuthGroupId
    this.change = this.instance.params.change
    this.open()
  },
  methods: {
    checkIcon (menuId) {
      const mainMenu = this.menuList.find(data => data.menuId === menuId)
      if (!!mainMenu && !!mainMenu.children && mainMenu.children.length > 0) {
        const menuList = this.getMenuList(mainMenu.children)
        if (menuList.length > 0) {
          const checkList = []
          for (const mId of menuList) {
            if (this.myMenu.includes(mId)) {
              checkList.push(mId)
            }
          }
          if (checkList.length === 0) {
            return 'check_box_outline_blank'
          } else if (checkList.length === menuList.length) {
            return 'check_box'
          } else {
            return 'indeterminate_check_box'
          }
        } else {
          return 'check_box_outline_blank'
        }
      } else {
        return 'check_box_outline_blank'
      }
    },
    clickIcon (menuId) {
      const mainMenu = this.menuList.find(data => data.menuId === menuId)
      if (!!mainMenu && !!mainMenu.children && mainMenu.children.length > 0) {
        const menuList = this.getMenuList(mainMenu.children)
        if (menuList.length > 0) {
          const checkList = []
          for (const mId of menuList) {
            if (this.myMenu.includes(mId)) {
              checkList.push(mId)
            }
          }
          if (checkList.length === menuList.length) {
            // 전체 해제 - 쓰기권한도 삭제 한다.
            for (const mId of menuList) {
              this.myMenu.splice(this.myMenu.indexOf(mId), 1).sort((a, b) => a - b)
              if (this.menuWrite.indexOf(mId) > -1) {
                this.menuWrite.splice(this.menuWrite.indexOf(mId), 1).sort((a, b) => a - b)
              }
            }
          } else {
            // 전체 선택
            for (const mId of menuList) {
              if (this.myMenu.indexOf(mId) < 0) {
                this.myMenu.push(mId)
                this.myMenu.sort((a, b) => a - b)
                if (this.menuWrite.indexOf(mId) < 0) {
                  this.menuWrite.push(mId)
                  this.menuWrite.sort((a, b) => a - b)
                }
              }
            }
          }
        }
      }
    },
    getMenuList (menus) {
      let menuList = []
      for (const menu of menus) {
        if (menu.children && menu.children.length > 0) {
          menuList = menuList.concat(menu.menuId, this.getMenuList(menu.children))
        } else {
          menuList.push(menu.menuId)
        }
      }
      return menuList
    },
    getSelectMenuList (menus, isMenuAuth) {
      let selectMenuList = []
      for (const menu of menus) {
        if (this.selectMenu.findIndex(data => data.menuId === menu.menuId) > -1) {
          if (isMenuAuth) {
            selectMenuList.push(menu.menuId)
          } else if (this.selectMenu.find(data => data.menuId === menu.menuId).writeYn === 'Y') {
            selectMenuList.push(menu.menuId)
          }
        }
        if (menu.children && menu.children.length > 0) {
          selectMenuList = selectMenuList.concat(this.getSelectMenuList(menu.children, isMenuAuth))
        }
      }
      return _.sortBy(selectMenuList)
    },
    open () {
      if (this.selectMenu && this.selectMenu.length > 0) {
        this.myMenu = this.getSelectMenuList(this.menuList, true) // _.map(this.selectMenu.slice(), 'menuId')
        this.menuWrite = this.getSelectMenuList(this.menuList, false) // _.map(_.filter(this.selectMenu.slice(), { writeYn: 'Y' }), 'menuId')
      } else {
        this.myMenu = []
        this.menuWrite = []
      }
    },
    checkChild (parentMenu, menuId) {
      // 클릭한 child menu id check 태움
      this.checkParents(menuId)
      if (parentMenu.menuId && parentMenu.children && parentMenu.children.length > 0) {
        // child menu 중 myMenu 에 포함되어 있으면 this.myMenu 에 부모 메뉴 추가 아니면 삭제
        const childrenMenuIdArray = parentMenu.children.map(row => row.menuId)
        const existChild = this.myMenu.filter(id => childrenMenuIdArray.includes(id)).length > 0
        const parentMenuId = parentMenu.menuId
        if (existChild) {
          if (!_.includes(this.myMenu, parentMenuId)) {
            this.myMenu.push(parentMenuId)
            this.myMenu.sort((a, b) => a - b)
            if (this.menuWrite.indexOf(parentMenuId) < 0) {
              this.menuWrite.push(parentMenuId)
              this.menuWrite.sort((a, b) => a - b)
            }
          }
        } else {
          if (_.includes(this.myMenu, parentMenuId)) {
            this.myMenu.splice(this.myMenu.indexOf(parentMenuId), 1).sort((a, b) => a - b)
            if (this.menuWrite.indexOf(parentMenuId) > -1) {
              this.menuWrite.splice(this.menuWrite.indexOf(parentMenuId), 1).sort((a, b) => a - b)
            }
          }
        }
      }
    },
    checkParents (menuId) {
      if (_.includes(this.myMenu, menuId)) {
        this.myMenu.splice(this.myMenu.indexOf(menuId), 1).sort((a, b) => a - b)
        if (this.menuWrite.indexOf(menuId) > -1) {
          this.menuWrite.splice(this.menuWrite.indexOf(menuId), 1).sort((a, b) => a - b)
        }
      } else {
        this.myMenu.push(menuId)
        this.myMenu.sort((a, b) => a - b)
        if (this.menuWrite.indexOf(menuId) < 0) {
          this.menuWrite.push(menuId)
          this.menuWrite.sort((a, b) => a - b)
        }
      }
    },
    checkWrite (menuId, parentMenu) {
      // 메뉴 권한 체크가 되어있는지 확인한다.
      if (!_.includes(this.myMenu, menuId)) {
        if (parentMenu && menuId) {
          this.checkChild(parentMenu, menuId)
        } else {
          this.checkParents(menuId)
        }
      }
    },
    setMenu () {
      this.$dialog.confirm('메뉴권한그룹(' + this.menuAuthGroupName + ')의<br/>메뉴를 적용 하시겠습니까?').then(() => {
        this.myMenu.sort((a, b) => a - b)
        this.menuWrite.sort((a, b) => a - b)
        // 메뉴 권한 리스트를 작성
        const array = []
        for (const menuId of this.myMenu) {
          const writeYn = _.find(this.menuWrite, function (n) {
            return n === menuId
          })
          array.push({ menuId: menuId, writeYn: writeYn ? 'Y' : 'N' })
        }
        adminMenuAuthGroupService.updateMenuAuth(this.menuAuthGroupId, array).then(res => {
          this.$dialog.alert('저장되었습니다.')
          this.change()
        })
      }).catch(() => {})
    }
  }
}
</script>
