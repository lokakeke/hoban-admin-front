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
      <v-col sm="6" md="3" v-for="menu of menus" :key="menu.menuId"
             class="border-bottom border-left border-top border-right">
        <h4 class="headline font-weight-bold text-center" :class="{ 'strike': menu.menuUseYn === 'N' }">
          {{menu.menuName}}
          <v-divider></v-divider>
        </h4>
        <v-list two-line>
          <template v-for="subItem of menu.children">
            <template v-if="subItem.children && subItem.children.length > 0">
              <v-list-item :key="subItem.menuId">
                <v-list-item-content>
                  <div class="title font-weight-bold" :class="{ 'strike': subItem.menuUseYn === 'N' }">{{subItem.menuName}}</div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-for="sub of subItem.children" :key="sub.menuId" class="pl-6">
                <v-list-item-avatar>
                  <v-icon>arrow_forward</v-icon>
                  <v-checkbox v-model="sub.include" @change="check(sub)" class=""></v-checkbox>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title :class="{ 'strike': sub.menuUseYn === 'N' }">{{sub.menuName}}</v-list-item-title>
                  <v-list-item-subtitle>
                    메뉴권한 :
                    <template v-if="sub.group">
                      <span class="blue--text">Y</span> / 쓰기권한 : <span :class="sub.group.writeAuthYn === 'Y'?'blue--text':'red--text'">{{sub.group.writeAuthYn}}</span>
                    </template>
                    <template v-else>
                      <span class="red--text">N</span>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-switch v-model="sub.useYn" inset dense class="mb-2" true-value="Y" false-value="N" label="사용여부" color="info" :disabled="!sub.include" @change="checkUse(sub)"></v-switch>
                  <v-switch v-model="sub.writeAuthYn" inset dense true-value="Y" false-value="N" label="쓰기권한" color="info" :disabled="!sub.include || sub.useYn === 'N'"></v-switch>
                </v-list-item-action>
              </v-list-item>
            </template>
            <template v-else>
              <v-list-item :key="subItem.menuId">
                <v-list-item-action>
                  <v-checkbox v-model="subItem.include" @change="check(subItem)"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title :class="{ 'strike': subItem.menuUseYn === 'N' }">{{subItem.menuName}}</v-list-item-title>
                  <v-list-item-subtitle>
                    메뉴권한 :
                    <template v-if="subItem.group">
                      <span class="blue--text">Y</span> / 쓰기권한 : <span :class="subItem.group.writeAuthYn === 'Y'?'blue--text':'red--text'">{{subItem.group.writeAuthYn}}</span>
                    </template>
                    <template v-else>
                      <span class="red--text">N</span>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-switch v-model="subItem.useYn" class="mb-2" inset dense true-value="Y" false-value="N" label="사용여부" color="info" :disabled="!subItem.include" @change="checkUse(subItem)"></v-switch>
                  <v-switch v-model="subItem.writeAuthYn" inset dense true-value="Y" false-value="N" label="쓰기권한" color="info" :disabled="!subItem.include || subItem.useYn === 'N'"></v-switch>
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
import service from '@/api/modules/partner/partnerMenuAuth.service'

export default {
  extends: DialogBase,
  name: 'PartnerMenuAuthUserDialog',
  data () {
    return {
      user: {},
      menuList: [],
      selectMenu: [],
      menus: [],
      userAuthList: []
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.user = this.instance.params.user
    this.menuList = this.instance.params.menuList
    this.selectMenu = this.instance.params.selectMenu
    this.selectUser()
  },
  methods: {
    selectUser () {
      // 서버에서 해당 유저의 개인 메뉴 리스트를 조회한다.
      service.selectPartnerMenuAuthUser(this.user.ptnrNo).then(res => {
        this.userAuthList = res.data
        // 메뉴 리스트를 정제한다.
        this.menus = this.setUpMenu(this.menuList)
      })
    },
    setUpMenu (menus) {
      const array = []
      for (const menu of menus) {
        const row = { menuId: menu.menuId, menuName: menu.menuName, menuUseYn: menu.useYn }
        // 메뉴그룹 권한 체크
        const group = _.find(this.selectMenu, { menuId: menu.menuId })
        if (group) {
          row.group = { writeAuthYn: group.writeAuthYn }
        }
        // 개인메뉴 권한 체크
        const personal = _.find(this.userAuthList, { menuId: menu.menuId })
        if (personal) {
          row.include = true
          row.useYn = personal.useYn
          row.writeAuthYn = personal.writeAuthYn
        } else {
          row.include = false
          row.useYn = 'N'
          row.writeAuthYn = 'N'
        }
        if (menu.children && menu.children.length > 0) {
          row.children = this.setUpMenu(menu.children)
        }
        array.push(row)
      }
      return array
    },
    check (item) {
      if (item.include) {
        item.useYn = 'Y'
        item.writeAuthYn = 'Y'
      } else {
        item.useYn = 'N'
        item.writeAuthYn = 'N'
      }
    },
    checkUse (item) {
      if (item.useYn === 'N') {
        item.writeAuthYn = 'N'
      }
    },
    selectInclude (menus) {
      let array = []
      for (const menu of menus) {
        if (menu.include) {
          array.push({ menuId: menu.menuId, useYn: menu.useYn, writeAuthYn: menu.writeAuthYn })
        } else if (menu.children && menu.children.length > 0) {
          array = array.concat(this.selectInclude(menu.children))
        }
      }
      return array
    },
    setMenu () {
      this.$dialog.confirm('파트너사(' + this.user.ptnrName + ') 의 개인 메뉴권한을<br/>적용 하시겠습니까?').then(() => {
        // 메뉴 권한 리스트를 작성
        const array = this.selectInclude(this.menus)
        service.updatePartnerMenuAuthUser(this.user.ptnrNo, array).then(res => {
          this.$dialog.alert('저장되었습니다.')
          this.close()
        })
      }).catch(() => {})
    }
  }
}
</script>
