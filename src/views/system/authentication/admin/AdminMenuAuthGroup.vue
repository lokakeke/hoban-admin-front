<template>
  <v-row>
    <v-col md="4" sm="12" cols="12" class="pr-1">
      <app-card :heading="'메뉴권한 그룹 리스트'" auto-height>
        <template v-slot:items>
          <v-row>
            <v-col cols="6" class="pb-0">
              <v-text-field v-model="searchMenu" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
            </v-col>
            <v-col cols="6" class="pb-0" v-if="writeAuth">
              <v-btn outlined rounded color="info" @click="add()">
                <v-icon left>add</v-icon>
                메뉴권한 그룹 추가
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-list dense v-if="groupFilterList && groupFilterList.length > 0">
          <v-list-item v-for="item of groupFilterList" :key="item.menuAuthGroupId" @click="viewDetail(item, true)" class="menu-list" :class="item.active? 'active' : ''">
            <v-list-item-action>
              <v-icon>account_tree</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title :class="{ 'strike': item.useYn === 'N' }">
                {{ item.menuAuthGroupName }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-row v-else align="center" justify="center">
          등록된 메뉴 권한 그룹이 없습니다.
        </v-row>
        <template v-slot:action v-if="writeAuth">
          <v-row justify="center">
            <v-btn outlined rounded color="info" @click="add()">
              <v-icon left>add</v-icon>
              메뉴권한 그룹 추가
            </v-btn>
          </v-row>
        </template>
      </app-card>
    </v-col>
    <v-col md="4" sm="12" cols="12" class="px-1">
      <app-card :heading="'메뉴권한 그룹 상세내역'" :colClasses="'mb-2'">
        <transition name="slide-fade" mode="out-in">
          <template v-if="selectGroup">
            <v-form ref="form" lazy-validation :key="selectGroup" autocomplete="off">
              <admin-menu-auth-group-form :formData.sync="form"></admin-menu-auth-group-form>
            </v-form>
          </template>
          <v-row v-else align="center" justify="center">
            메뉴권한 그룹을 선택해 주세요.
          </v-row>
        </transition>
        <template v-slot:action v-if="selectGroup && writeAuth">
          <v-row justify="center">
            <v-btn outlined rounded color="primary" @click="resetForm()">
              <v-icon left>refresh</v-icon>
              원래대로
            </v-btn>
            <v-btn outlined rounded color="info" @click="commit(true)">
              <v-icon left>check</v-icon>
              저장
            </v-btn>
            <v-btn outlined rounded color="error" @click="deleteAuth">
              <v-icon left>remove</v-icon>
              권한 삭제
            </v-btn>
          </v-row>
        </template>
      </app-card>
      <app-card :heading="'메뉴권한 관리자 리스트'">
        <template v-if="selectGroup">
          <v-row no-gutters justify="end" class="mb-2">
            <v-col cols="6">
              <v-text-field v-model="search" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search"/>
            </v-col>
          </v-row>
          <v-data-table :no-data-text="menuAuthGroupName +' 그룹에 관리자 정보가 없습니다.'"
                        :no-results-text="'검색 결과가 없습니다.'" :headers="headers" :items="userList" :search="search">
            <template v-slot:item.action="{ item }">
              <v-btn outlined rounded small color="info" @click="openUser(item)">
                <v-icon small left>edit</v-icon>
                개인메뉴
              </v-btn>
            </template>
          </v-data-table>
        </template>
        <v-row v-else align="center" justify="center">
          메뉴권한 그룹을 선택해 주세요.
        </v-row>
      </app-card>
    </v-col>
    <v-col md="4" sm="12" cols="12" class="pl-1">
      <app-card :heading="'메뉴권한 그룹 메뉴리스트'" auto-height>
        <template v-slot:items v-if="selectGroup">
          <v-row>
            <v-col cols="6" class="pb-0">
              <v-text-field v-model="searchAuth" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
            </v-col>
            <v-col cols="6" class="pb-0">
              <v-btn outlined rounded @click="openMenu" color="info">
                <v-icon left>edit</v-icon>
                권한 메뉴
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <transition name="slide-fade" mode="out-in">
          <template v-if="selectGroup">
            <div :key="selectGroup" >
              <template v-if="groupMenuFilterList && groupMenuFilterList.length > 0">
                <v-list dense>
                  <v-list-item v-for="menu of groupMenuFilterList" :key="menu.menuId">
                    <v-list-item-action>
                      <v-icon>menu</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ menu.menuName }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
              <v-row v-else justify="center">
                {{menuAuthGroupName}} 그룹에 메뉴리스트가 없습니다.
              </v-row>
            </div>
          </template>
          <v-row v-else align="center" justify="center">
            메뉴권한 그룹을 선택해 주세요.
          </v-row>
        </transition>
        <template v-slot:action v-if="selectGroup">
          <v-row justify="center">
            <v-btn outlined rounded @click="openMenu" color="info">
              <v-icon left>edit</v-icon>
              권한 메뉴
            </v-btn>
          </v-row>
        </template>
      </app-card>
    </v-col>
    <v-navigation-drawer v-model="dialog" :width="600" right app temporary stateless fixed>
      <v-toolbar color="primary" dark>
        <v-btn icon dark @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>메뉴 권한그룹 추가</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="close">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form ref="addForm" lazy-validation autocomplete="off" onsubmit="return false;">
          <div @keypress.enter="commit(false)">
            <admin-menu-auth-group-form :formData.sync="addForm"></admin-menu-auth-group-form>
          </div>
          <v-layout justify-center>
            <div class="pa-2">
              <v-btn outlined rounded color="info" @click="commit(false)" v-if="writeAuth">
                <v-icon left>check</v-icon>
                저장
              </v-btn>
              <v-btn outlined rounded color="primary" @click="dialog = false">
                <v-icon left>close</v-icon>
                닫기
              </v-btn>
            </div>
          </v-layout>
        </v-form>
      </v-container>
    </v-navigation-drawer>
  </v-row>
</template>

<script>
import AdminMenuAuthGroupForm from '@/components/System/Authentication/Admin/AdminMenuAuthGroupForm.vue'
import adminMenuAuthGroupService from '@/api/modules/system/authentication/admin/adminMenuAuthGroup.service'
import menuService from '@/api/modules/system/menu.service'

export default {
  components: { AdminMenuAuthGroupForm },
  name: 'adminMenuAuthGroup',
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    menuService.selectMenuList().then(res => {
      this.menuFullList = res.data
    })
    this.load()
  },
  computed: {
    menuAuthGroupName () {
      let text = ''
      if (this.selectGroup) {
        const select = _.find(this.groupList, { menuAuthGroupId: this.selectGroup })
        text = select ? select.menuAuthGroupName : ''
      }
      return text
    },
    groupFilterList () {
      return this.groupList.filter(data => this.searchMenu ? data.menuAuthGroupName.indexOf(this.searchMenu) > -1 : true)
    },
    groupMenuFilterList () {
      return this.menuList.filter(data => this.searchAuth ? data.menuName.indexOf(this.searchAuth) > -1 : true)
    }
  },
  data () {
    return {
      // 전체 메뉴 리스트
      menuFullList: [],
      // 메뉴권한 그룹 리스트
      groupList: [],
      // 메뉴권한 그룹 메뉴리스트
      menuList: [],
      // 메뉴권한 사용자리스트
      userList: [],
      // 사용자 필터링 키워드
      headers: [
        { text: '사번', value: 'adminBusinessNo', align: 'center' },
        { text: '아이디', value: 'loginId', align: 'center' },
        { text: '이름', value: 'adminName', align: 'center' },
        { text: '상세보기', value: 'action', align: 'center' }
      ],
      search: '',
      /**
       * 메뉴 권한 필터 키워드
       */
      searchMenu: '',
      /**
       * 메뉴 권한 메뉴 필터 키워드
       */
      searchAuth: '',
      // 선택 파라미터
      selectGroup: '',
      // 상세/수정 폼
      form: {},
      formClone: {},
      // 신규 등록 폼
      addForm: {},
      // 신규 등록 dialog 컨트롤
      dialog: false
    }
  },
  methods: {
    openMenu () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/System/Authentication/Admin/AdminMenuAuthGroupMenu',
        params: {
          title: `메뉴권한 그룹(${this.menuAuthGroupName}) 메뉴 설정`,
          menuList: this.menuFullList,
          selectMenu: this.menuList,
          menuAuthGroupId: this.selectGroup,
          menuAuthGroupName: this.menuAuthGroupName,
          change: this.load
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true
        }
      })
    },
    openUser (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/System/Authentication/Admin/AdminMenuAuthGroupUser',
        params: {
          title: `개인 메뉴 설정(${item.adminName}) - ${this.menuAuthGroupName} 권한`,
          user: item,
          menuList: this.menuFullList,
          selectMenu: this.menuList
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true
        }
      })
    },
    load () {
      this.dialog = false
      adminMenuAuthGroupService.selectMenuAuthGroupList().then(res => {
        this.groupList = res.data
        if (this.selectGroup) {
          for (const group of this.groupList) {
            if (group.menuAuthGroupId === this.selectGroup) {
              this.viewDetail(group, false)
              return
            }
          }
        }
      })
    },
    add () {
      this.$refs.addForm.resetValidation()
      this.addForm = { useYn: 'Y' }
      this.dialog = true
    },
    viewDetail (group, keywordChange) {
      for (const row of this.groupList) {
        row.active = row.menuAuthGroupId === group.menuAuthGroupId
      }
      this.selectGroup = group.menuAuthGroupId
      this.menuList = group.adminMenuAuthList
      this.userList = group.adminAccountList
      this.form = _.cloneDeep(group)
      this.formClone = _.cloneDeep(group)
      if (keywordChange) {
        this.search = ''
      }
    },
    resetForm () {
      this.form = _.cloneDeep(this.formClone)
    },
    commit (isUpdate) {
      let formElement = this.$refs.addForm
      if (isUpdate) {
        formElement = this.$refs.form
      }
      this.validForm(formElement).then(() => {
        this.$dialog.confirm('메뉴 권한 그룹을' + (isUpdate ? '수정' : '입력') + ' 하시겠습니까?').then(() => {
          if (isUpdate) {
            adminMenuAuthGroupService.updateMenuAuthGroup(this.form).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.load()
            })
          } else {
            adminMenuAuthGroupService.insertMenuAuthGroup(this.addForm).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.load()
            })
          }
        }, () => {})
      })
    },
    close () {
      this.dialog = false
    },
    async deleteAuth () {
      try {
        // 사용자 있는지 체크
        if (this.userList && this.userList.length > 0) {
          this.$dialog.alert({
            body: '메뉴권한 그룹을 사용중인 관리자가 존재하여, 삭제 할 수 없습니다.<br/>사용중인 관리자의 메뉴권한그룹을 모두 변경 후 삭제가 가능합니다.',
            title: '삭제불가'
          })
        } else {
          await this.$dialog.confirm('메뉴권한 그룹을 삭제 하시겠습니까?')
          await adminMenuAuthGroupService.deleteMenuAuthGroup(this.selectGroup)
          this.$dialog.alert('메뉴권한 그룹을 삭제 하였습니다.')
          this.selectGroup = ''
          this.load()
        }
      } catch (e) {}
    }
  }
}
</script>
