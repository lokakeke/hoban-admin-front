<template>
  <v-menu bottom
          offset-y
          nudge-left="100"
          v-model="expand"
          :close-on-content-click="false"
          transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn :block="block" text rounded color="accent" @click.prevent.stop="" @click="selectTargetList" v-on="on">
        <v-icon left>refresh</v-icon>비밀번호 초기화
      </v-btn>
    </template>
    <v-card width="500">
      <v-card-text>
        <v-row justify="space-between">
          <v-col cols="7">
            <v-btn small :color="type === 'S'? 'primary': 'default'" @click="changeType('S')">
              <v-icon v-if="type === 'S'" left>check</v-icon>S.M.S
            </v-btn>
            <v-btn small :color="type === 'E'? 'primary': 'default'" @click="changeType('E')">
              <v-icon v-if="type === 'E'" left>check</v-icon>E-MAIL
            </v-btn>
          </v-col>
          <v-col cols="5" class="text-right">
            <v-btn rounded small color="info" @click="passwordReset"><v-icon small left>check</v-icon>변경</v-btn>
            <v-btn rounded small color="primary" @click="expand = false"><v-icon small left>close</v-icon>닫기</v-btn>
          </v-col>
        </v-row>
        <v-data-table :headers="headers" :items="list" no-data-text="전송 정보가 없습니다."
                      v-model="selected" single-select show-select item-key="id"
                      fixed-header height="150"
                      class="bordered" dense hide-default-footer disable-pagination disable-sort>
          <template v-slot:item.value="{item}">
            <mask-tel-number v-if="type === 'S'" :text="item.value" @search="viewTelNo(item)" />
            <span v-else>{{item.value}}</span>
          </template>
        </v-data-table>
        <div class="text-right mt-2">
          <v-btn rounded small color="info" @click="passwordReset"><v-icon small left>check</v-icon>변경</v-btn>
          <v-btn rounded small color="primary" @click="expand = false"><v-icon small left>close</v-icon>닫기</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import partnerAuthService from '@/api/modules/system/authentication/partner/partnerAuth.service'
import partnerChargeService from '@/api/modules/partner/partnerCharge.service'
import MaskTelNumber from '@/components/Mask/MaskTelNumber.vue'

export default {
  components: { MaskTelNumber },
  props: {
    item: Object,
    block: Boolean
  },
  data () {
    return {
      expand: false,
      type: '',
      headers: [
        { value: 'data-table-select', width: false, align: 'center' },
        { text: '아이디', value: 'id', width: '30%', align: 'center' },
        { text: '이름', value: 'name', width: '30%', align: 'center' },
        { text: '번호', value: 'value', width: '35%', align: 'center' }
      ],
      list: [],
      selected: [],
      data: {}
    }
  },
  name: 'PartnerPasswordReset',
  methods: {
    selectTargetList () {
      this.type = ''
      this.list = []
      this.selected = []
      partnerAuthService.selectTargetList(this.item.loginId).then(res => {
        this.data = res.data
        this.changeType('E')
      })
    },
    async viewTelNo (item) {
      const res = await partnerManagerService.selectPartnerManagerDetail({ ptnrNo: this.item.ptnrNo, ptnrChrgId: item.id })
      item.value = res.data.telNo
    },
    changeType (type) {
      if (type !== this.type) {
        this.type = type
        this.list = this.type === 'S' ? this.data.smsList : this.data.emailList
        this.selected = []
      }
    },
    passwordReset () {
      if (this.selected.length === 0) {
        this.$dialog.alert('발송 정보를 선택해 주세요.')
      } else {
        partnerAuthService.createTemporaryPassword(this.item.loginId, this.selected[0].id, this.type).then(res => {
          console.log('임시 비밀번호 확인용 : ', res.data)
          this.$dialog.alert('임시 비밀번호가 발급 되었습니다.').then(() => {
            this.expand = false
          })
        })
      }
    }
  }
}
</script>
