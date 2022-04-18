<template>
  <div>
    <v-row>
      <app-card :heading="'내부 IP 관리'" col-classes="col-sm-12 col-md-6">
        <v-row>
          <v-col class="pt-0"></v-col>
          <v-col class="pt-0"></v-col>
          <v-col class="pt-0">
            <v-text-field v-model="filterText" class="mb-1" hide-details outlined small dense append-icon="mdi-magnify" label="Search"/>
          </v-col>
        </v-row>
        <template v-if="ipFilterList && ipFilterList.length > 0">
          <v-list dense>
            <v-list-item
              v-for="ip of ipFilterList"
              :key="ip.useIp"
              @click="viewIpInfo(ip)"
              class="menu-list"
              :class="ip.active? 'active' : ''"
            >
              <v-list-item-action>
                <v-icon>edit</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title :class="ip.useYn === 'N'? 'strike' : ''">{{ ip.ipName }} ({{ ip.useIp }} / {{ ip.adminSeq }})</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>keyboard_arrow_right</v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </template>
        <v-row v-else align="center" justify="center">IP 정보가 없습니다.</v-row>
        <v-divider class="my-4"></v-divider>
        <v-row align="end" justify="center">
          <v-btn outlined rounded small color="info" @click="addIp()">
            <v-icon small>add</v-icon>IP 추가
          </v-btn>
        </v-row>
      </app-card>
      <app-card :heading="'상세 정보'" col-classes="col-sm-12 col-md-6">
        <v-row v-if="!ipInfo.useIp" align="center" justify="center">관리 할 IP를 선택해 주세요.</v-row>
        <template v-else>
          <v-form ref="ipInfo" lazy-validation>
            <v-label>IP</v-label>
            <v-text-field
              v-model="ipInfo.useIp"
              :rules="emptyRules"
              label
              required
              class="pt-0"
              disabled
            ></v-text-field>
            <v-label>IP 이름</v-label>
            <v-text-field v-model="ipInfo.ipName" :rules="emptyRules" label required class="pt-0"></v-text-field>
            <v-label>사번</v-label>
            <v-text-field v-model="ipInfo.adminSeq" label required class="pt-0"></v-text-field>
            <v-label>서버 구분</v-label>
            <v-autocomplete v-model="ipInfo.serverCode" :rules="emptyRules" :items="serverCodeList" :item-text="'commonCodeName'" :item-value="'commonCode'" required class="pt-0"></v-autocomplete>
            <v-checkbox
              class="mt-0"
              v-model="ipInfo.useYn"
              label="사용여부"
              required
              true-value="Y"
              false-value="N"
            ></v-checkbox>
          </v-form>
        </template>
        <v-divider v-if="ipInfo.useIp" class="my-4"></v-divider>
        <v-row align="end" justify="center" v-if="ipInfo.useIp">
          <v-btn outlined rounded small color="info" @click="modify()">
            <v-icon small>edit</v-icon>수정
          </v-btn>
        </v-row>
      </app-card>
    </v-row>

    <v-navigation-drawer fixed v-model="dialog" :width="600" right app stateless temporary>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>메뉴 {{form.menuId ? '상세/수정' : '입력'}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form ref="form" lazy-validation>
          <v-label>IP</v-label>
          <v-text-field v-model="form.useIp" :rules="emptyRules" label required class="pt-0"></v-text-field>
          <v-label>IP 이름</v-label>
          <v-text-field v-model="form.ipName" :rules="emptyRules" label required class="pt-0"></v-text-field>
          <v-label>사번</v-label>
          <v-text-field v-model="form.adminSeq" label required class="pt-0"></v-text-field>
          <v-label>서버 구분</v-label>
          <v-autocomplete v-model="form.serverCode" :rules="emptyRules" :items="serverCodeList" :item-text="'commonCodeName'" :item-value="'commonCode'" required class="pt-0"></v-autocomplete>
          <v-checkbox
            class="mt-0"
            v-model="form.useYn"
            label="사용여부"
            required
            true-value="Y"
            false-value="N"
          ></v-checkbox>

          <v-row justify="center">
            <v-btn outlined rounded small color="orange" @click="reset()">
              <v-icon small>refresh</v-icon>원래대로
            </v-btn>
            <v-btn outlined rounded small color="info" @click="insert()">
              <v-icon small>check</v-icon>입력
            </v-btn>
            <v-btn outlined rounded small color="primary" @click="dialog = false">
              <v-icon small>close</v-icon>닫기
            </v-btn>
          </v-row>
        </v-form>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ipManageService from '@/api/modules/system/ip.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  name: 'ip',
  data () {
    return {
      ipList: [],
      ipInfo: {},
      copiedInfo: {},
      form: {},
      dialog: false,
      filterText: '',
      serverCodeList: []
    }
  },
  mounted () {
    this.getIpList()
    this.getServerCode()
  },
  computed: {
    ipFilterList () {
      if (this.ipList && this.ipList.length > 0) {
        if (this.filterText) {
          return this.ipList.filter(data => data.ipName.indexOf(this.filterText) !== -1 || data.useIp.indexOf(this.filterText) !== -1 || (data.adminSeq || '').indexOf(this.filterText) !== -1)
        } else {
          return this.ipList
        }
      } else {
        return []
      }
    }
  },
  methods: {
    getServerCode () {
      commonCodeService.selectCommonCode('SERVER_CD').then(res => {
        this.serverCodeList = res.data
      })
    },
    getIpList () {
      ipManageService.selectList().then(res => {
        this.ipList = res.data
      })
    },
    viewIpInfo (oneIp) {
      for (const row of this.ipList) {
        row.active = row.useIp === oneIp.useIp
      }
      this.ipInfo = Object.create(oneIp)
      this.copiedInfo = Object.create(oneIp)
    },
    reload () {
      this.ipList = Object.create(this.copiedInfo)
    },
    addIp () {
      this.form = { useYn: 'Y' }
      this.dialog = !this.dialog
    },
    duplicateCheck (newIp) {
      console.log('newIP')
      console.log(newIp)
      for (const row of this.ipList) {
        if (row.useIp === newIp) {
          this.$dialog.alert('이미 등록된 IP입니다. 다른 IP로 시도해주세요.')
          return false
        }
      }
      return true
    },
    modify () {
      this.validForm(this.$refs.ipInfo).then(() => {
        this.$dialog
          .confirm('IP를 수정하시겠습니까?')
          .then(() => {
            const newInfo = {}
            newInfo.useIp = this.ipInfo.useIp
            newInfo.ipName = this.ipInfo.ipName
            newInfo.useYn = this.ipInfo.useYn
            newInfo.adminSeq = this.ipInfo.adminSeq
            newInfo.serverCode = this.ipInfo.serverCode
            ipManageService.update(newInfo).then(res => {
              this.$dialog.alert('정보를 입력하였습니다.')
              this.getIpList()
            })
          })
          .catch(() => {})
      })
    },
    insert () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog
          .confirm('IP를 입력하시겠습니까?')
          .then(() => {
            const flag = this.duplicateCheck(this.form.useIp)
            console.log('flag')
            console.log(flag)
            if (flag) {
              ipManageService.insert(this.form).then(res => {
                this.$dialog.alert('정보를 입력하였습니다.')
                this.getIpList()
                this.dialog = false
              })
            }
          })
          .catch(() => {})
      })
    },
    reset () {
      this.form = { useYn: 'Y' }
      this.$refs.form.resetValidation()
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
