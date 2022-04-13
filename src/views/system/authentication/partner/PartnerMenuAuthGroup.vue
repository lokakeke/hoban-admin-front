<template>
  <v-row>
    <v-col md="4" sm="12" cols="12" class="pr-1">
      <app-card :heading="'파트너사 메뉴권한 그룹 리스트'" auto-height>
        <template v-slot:items>
          <v-row>
            <v-col cols="6" class="pb-0">
              <v-text-field v-model="searchMenu" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
            </v-col>
            <v-col cols="6" class="pb-0" v-if="writeAuth">
              <v-btn outlined rounded color="info" @click="add()">
                <v-icon left>add</v-icon>
                파트너 메뉴권한 그룹 추가
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
          등록된 파트너 메뉴 권한 그룹이 없습니다.
        </v-row>
        <template v-slot:action v-if="writeAuth">
          <v-row justify="center">
            <v-btn outlined rounded color="info" @click="add()">
              <v-icon left>add</v-icon>
              파트너 메뉴권한 그룹 추가
            </v-btn>
          </v-row>
        </template>
      </app-card>
    </v-col>
    <v-col md="4" sm="12" cols="12" class="px-1">
      <app-card :heading="'파트너사 메뉴권한 그룹 상세내역'" :colClasses="'mb-2'">
        <transition name="slide-fade" mode="out-in">
          <template v-if="selectGroup">
            <v-form ref="form" lazy-validation :key="selectGroup" autocomplete="off" onsubmit="return false;">
              <v-row @keypress.enter="commit">
                <v-col cols="6">
                  <v-label>메뉴권한 그룹 ID</v-label>
                  <v-text-field v-model="form.menuAuthGroupId" label="" disabled class="pt-0"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-label>메뉴권한 그룹 이름</v-label>
                  <v-text-field v-model="form.menuAuthGroupName" :rules="emptyRules" label="" class="pt-0"></v-text-field>
                </v-col>
                <v-col>
                  <v-checkbox class="mt-0" v-model="form.useYn" label="사용여부" hide-details true-value="Y" false-value="N"></v-checkbox>
                </v-col>
              </v-row>
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
            <v-btn outlined rounded color="info" @click="commit">
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
      <app-card :heading="'메뉴권한 파트너사 리스트'">
        <template v-if="selectGroup">
          <v-row no-gutters justify="end" class="mb-2">
            <v-col cols="6">
              <v-text-field v-model="search" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
            </v-col>
          </v-row>
          <v-data-table :no-data-text="menuAuthGroupName +' 그룹에 파트너사 리스트가 없습니다.'"
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
    <partner-menu-auth-group-form ref="groupDialog" :load="load"></partner-menu-auth-group-form>
  </v-row>
</template>

<script>
import partnerMenuAuthGroupService from '@/api/modules/system/authentication/partner/partnerMenuAuthGroup.service'
import menuService from '@/api/modules/system/menu.service'
import partnerMenuAuthGroupForm from '@/components/System/Authentication/Partner/PartnerMenuAuthGroupForm.vue'

export default {
  components: { partnerMenuAuthGroupForm },
  name: 'PartnerMenuAuthGroup',
  data () {
    return {
      // 전체 메뉴 리스트
      menuFullList: [],
      // 파트너 메뉴권한 그룹 리스트
      groupList: [],
      // 파트너 메뉴권한 그룹 메뉴리스트
      menuList: [],
      // 파트너 메뉴권한 사용자리스트
      userList: [],
      // 사용자 필터링 키워드
      headers: [
        { text: '파트너번호', value: 'partnerSeq', align: 'center' },
        { text: '아이디', value: 'loginId', align: 'center' },
        { text: '파트너명', value: 'companyName', align: 'center' },
        { text: '상세보기', value: 'action', align: 'center' }
      ],
      search: '',
      /**
       * 파트너 메뉴권한 필터 키워드
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
      groupDialog: false
    }
  },
  mounted () {
    menuService.selectMenuList().then(res => {
      this.menuFullList = res.data
    })
    this.load()
  },
  computed: {
    menuAuthGroupName () {
      let text = ''
      if (this.selectGroup) {
        const select = this.groupList.find(data => data.menuAuthGroupId === this.selectGroup)
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
  methods: {
    openMenu () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/System/Authentication/Partner/PartnerMenuAuthGroupMenu',
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
        componentPath: '/System/Authentication/Partner/PartnerMenuAuthGroupUser',
        params: {
          title: `파트너사 (${item.companyName}) 개인 메뉴 설정 - ${this.menuAuthGroupName} 권한`,
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
      partnerMenuAuthGroupService.selectPartnerAuthDetailedGroupList().then(res => {
        for (const group of res.data) {
          group.active = false
        }
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
      this.$refs.groupDialog.open({ menuAuthGroupId: '', menuAuthGroupName: '', useYn: 'Y' })
    },
    viewDetail (group, keywordChange) {
      for (const row of this.groupList) {
        row.active = row.menuAuthGroupId === group.menuAuthGroupId
      }
      this.selectGroup = group.menuAuthGroupId
      this.menuList = group.partnerMenuAuthList
      this.userList = group.partnerAccountList
      this.form = this.cloneDeep(group)
      this.formClone = this.cloneDeep(group)
      if (keywordChange) {
        this.search = ''
      }
    },
    resetForm () {
      this.form = this.cloneDeep(this.formClone)
    },
    commit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('메뉴 권한 그룹을 수정 하시겠습니까?').then(() => {
          partnerMenuAuthGroupService.updatePartnerMenuAuthGroup(this.form).then(res => {
            this.$dialog.alert('저장되었습니다.')
            this.load()
          })
        }, () => {})
      })
    },
    async deleteAuth () {
      try {
        // 사용자 있는지 체크
        if (this.userList && this.userList.length > 0) {
          this.$dialog.alert({
            body: '메뉴권한 그룹을 사용중인 파트너가 존재하여, 삭제 할 수 없습니다.<br/>사용중인 파트너의 메뉴권한그룹을 모두 변경 후 삭제가 가능합니다.',
            title: '삭제불가'
          })
        } else {
          await this.$dialog.confirm('메뉴권한 그룹을 삭제 하시겠습니까?')
          await partnerMenuAuthGroupService.deleteMenuAuthGroup(this.selectGroup)
          this.$dialog.alert('메뉴권한 그룹을 삭제 하였습니다.')
          this.selectGroup = ''
          this.load()
        }
      } catch (e) {}
    }
  }
}
</script>
