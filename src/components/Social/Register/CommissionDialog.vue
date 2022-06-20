<template>
  <dialog-base :instance="instance" :title="'수수료율'">
  <template v-slot:title>
    <v-icon left>add</v-icon>수수료율 {{isNew ? '추가' : '상세/수정'}}
  </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col sm="4" md="6">
          <v-label>법인구분</v-label>
          <v-select v-model="form.corpInd" :items="corpIndList" item-text="commCodeName" item-value="commCode">
            <template v-slot:item="{ item }">{{ item.commCodeName }} <span v-if="item.commCode === 'D'">({{partnerName}})</span></template>
            <template v-slot:selection="{ item }">{{ item.commCodeName }} <span v-if="item.commCode === 'D'">({{partnerName}})</span></template>
          </v-select>
        </v-col>
        <v-col sm="12" md="6">
          <v-label>수수료율</v-label>
          <v-text-field v-model="form.cmsnRate" label suffix="%" :rules="floatRule.concat(emptyRules, mountRules)" required type="Number"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  <template v-slot:actions>
    <v-btn outlined rounded color="info" @click="add">
      <v-icon left>{{isNew ? 'check' : 'create'}}</v-icon>
      {{isNew? '추가': '수정'}}
    </v-btn>
    <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
  </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'CommissionDialog',
  data () {
    return {
      isNew: Boolean,
      form: Object,
      corpIndList: [],
      floatRule: [
        v => (!v || /^[0-9\\.]+$/.test(v)) || '숫자만 입력 가능합니다.'
      ],
      mountRules: [
        v => v <= 100 || '100 이하로 입력해 주세요.'
      ]
    }
  },
  mounted () {
    if (this.instance.params) {
      this.isNew = this.instance.params.isNew
      this.form = this.instance.params.commForm
      this.partnerName = this.instance.params.partnerName
    }
    // 법인구분 공통코드 조회
    this.getCommonCode()
  },
  methods: {
    // 법인구분 공통코드 조회
    getCommonCode () {
      this.corpIndList = []
      commonCodeService.selectCommonCode('SOCIAL0001').then(res => {
        if (res.data) {
          // 판매업체명
          // res.data.forEach(item => {
          //   if (item.commCode === 'D') {
          //     console.log(item.commCodeName)
          //     item.commCodeName = (item.commCodeName + ' (' + this.partnerName + ')')
          //   }
          // })
          this.corpIndList = res.data
          if (!this.form.corpInd) {
            this.form.corpInd = 'A'
          }
        }
      })
    },
    // 수수료율 List 추가
    add () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(this.isNew ? '추가하시겠습니까?' : '수정하시겠습니까?').then(() => {
          this.close({ data: this.form })
        })
      })
    }
  }
}
</script>
