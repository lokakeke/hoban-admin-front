<template>
  <v-container fluid>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col v-if="writeAuth" cols="12" class="text-right py-0">
          <v-btn outlined rounded color="green" @click="searchIpList"><v-icon left>mdi-ip</v-icon>불러오기</v-btn>
          <v-btn outlined rounded color="info" @click="addRow()"><v-icon left>add</v-icon>IP 추가</v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table :no-data-text="'등록된 IP 정보가 없습니다.'" :headers="headers" :items="list" disable-sort disable-pagination hide-default-footer
                        class="bordered click-row" @click:row="addRow($event)">
            <template v-slot:item.useYn="{item}">
              {{item.useYn === 'Y'? '사용': '미사용'}}
            </template>
            <template v-slot:item.serverCode="{item}">
              {{item.serverCode | label(serverCodeList, 'commCode', 'commCodeName')}}
            </template>
            <template v-slot:item.action="{item}">
              <v-btn v-if="writeAuth" text color="accent" @click.stop="removeRow(item)"><v-icon left>remove</v-icon> 삭제</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-form>
    <v-row v-if="writeAuth">
      <v-col cols="12" class="text-right">
        <template v-if="isNew">
          <v-btn color="info" rounded @click="prev"><v-icon left>arrow_back</v-icon>이전 단계</v-btn>
          <v-btn color="info" rounded @click="submit"><v-icon left>check</v-icon>완료</v-btn>
        </template>
        <v-btn v-else color="info" rounded @click="submit"><v-icon left>check</v-icon>수정</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import service from '@/api/modules/api/serviceIp.service'
import serviceService from '@/api/modules/api/service.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  props: { item: Object, isNew: Boolean, insertData: Object, insert: Function },
  name: 'IPTab',
  data () {
    return {
      list: [],
      headers: [],
      isNewTab: false,
      index: 0,
      form: {},
      serverCodeList: []
    }
  },
  mounted () {
    // 서버코드 조회
    commonCodeService.selectCommonCode('SERVER_CD').then(res => {
      this.serverCodeList = res.data
    })
    // 파트너 여부 체크
    if (this.isPartner) {
      this.headers = [
        { text: 'IP', value: 'useIp', align: 'center' },
        { text: 'IP 명', value: 'ipName', align: 'center' },
        { text: '서버 구분', value: 'serverCode', align: 'center' },
        { text: '사용 여부', value: 'useYn', align: 'center' }
      ]
    } else {
      this.headers = [
        { text: 'IP', value: 'useIp', align: 'center' },
        { text: 'IP 명', value: 'ipName', align: 'center' },
        { text: '서버 구분', value: 'serverCode', align: 'center' },
        { text: '사용 여부', value: 'useYn', align: 'center' },
        { text: '삭제', value: 'action', align: 'center' }
      ]
    }
    this.init()
  },
  methods: {
    init () {
      if (!this.isNew) {
        service.selectServiceIpList(this.item.businessId).then(res => {
          this.list = res.data
        })
      } else {
        this.list = []
      }
    },
    addRow (row) {
      if (row) {
        this.form = this.cloneDeep(row)
        this.isNewTab = false
        this.index = this.list.indexOf(row)
      } else {
        this.form = { useIp: '', ipName: '', serverCode: '', useYn: 'Y' }
        this.isNewTab = true
      }
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '@/api/Service/IPAddDialog',
        params: {
          isNewTab: this.isNewTab,
          form: this.form,
          serverCodeList: this.serverCodeList,
          list: this.list,
          index: this.index
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              if (this.isNewTab) {
                this.list.push(params.data)
              } else {
                this.$set(this.list, this.index, params.data)
              }
            }
          }
        }
      })
    },
    async removeRow (row) {
      try {
        await this.$dialog.confirm(`해당 IP(${row.useIp}) 를 목록에서 제거 하시겠습니까?`)
        this.list.splice(this.list.indexOf(row), 1)
      } catch (e) {}
    },
    submit () {
      this.validForm(this.$refs.form).then(() => {
        if (this.isNew) {
          this.$dialog.confirm('API 서비스를 등록 하시겠습니까?').then(() => {
            const data = Object.assign({}, this.insertData, { serviceIpList: this.list })
            serviceService.insertService(data).then(() => {
              this.$dialog.alert('서비스가 등록 되었습니다.')
              this.insert()
            })
          })
        } else {
          this.$dialog.confirm('IP 정보를 수정 하시겠습니까?').then(() => {
            service.updateServiceIpList(this.item.businessId, this.list).then(res => {
              this.$dialog.alert('IP 정보가 수정되었습니다.')
            })
          })
        }
      })
    },
    prev () {
      this.$emit('changeTab', false)
    },
    async searchIpList () {
      try {
        await this.$dialog.confirm('파트너 번호로 등록된 서비스의 IP 정보들을 불러오시겠습니까?')
        if (this.item.partnerSeq) {
          const res = await service.selectPtnrIpList(this.item.partnerSeq)
          // IP 가 중복되지 않으면 추가한다.
          for (const row of res.data) {
            if (this.list.filter(data => data.useIp === row.useIp).length === 0) {
              this.list.push(row)
            }
          }
        } else {
          this.$dialog.alert('파트너 번호가 누락되었습니다.')
        }
      } catch (e) {}
    }
  }
}
</script>
