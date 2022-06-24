<template>
  <dialog-base :instance="instance" :title="'객실 복사'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation style>
      <v-row>
        <v-col cols="12" class="px-4 py-0">
          <v-label>객실명</v-label>
          <v-text-field counter="30" v-model="name" placeholder="객실명을 입력해 주세요." :rules="maxLengthRules(30).concat(emptyRules, nameRegex)"></v-text-field>
        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <v-row>
        <v-col cols="12" class="px-4 py-0">
          <v-label>복사할 정보 선택</v-label>
          <v-select v-model="selectCopyInfo"
                    :items="selectCopyList"
                    item-value="value"
                    item-text="code"
                    label=""
          ></v-select>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import service from '@/api/modules/naver/item.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'ItemCopyModal',
  components: {},
  data: function () {
    return {
      name: '',
      selectCopyInfo: '',
      selectCopyList: [
        { code: '상세정보', value: 'info' },
        { code: '상세정보 + 일정', value: 'schedule' }
      ]
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
    if (!this.instance.params.copyItem.mid || !this.instance.params.copyItem.storeCode || !this.instance.params.copyItem.rmTypeCode) {
      this.$dialog.alert('PMS 상품 연결을 먼저 해주세요.')
      this.close()
    }
    this.name = this.instance.params.copyItem.name
    this.selectCopyInfo = this.selectCopyList[0].value
  },
  methods: {
    save () {
      this.validForm(this.$refs.form).then(() => {
        const type = this.selectCopyInfo
        this.$dialog.confirm(`객실의 ${type === 'info' ? '상세정보를' : '상세정보 + 일정을'} 복사 하시겠습니까?`).then(() => {
          this.instance.params.copyItem.name = this.name
          delete this.instance.params.copyItem.additionalInfosStr

          service.copyItem(type, this.instance.params.copyItem).then(() => {
            this.close()
            const snackbarObj = { type: 'success', text: '객실이 복사 되었습니다.' }
            this.instance.params.search(snackbarObj)
          }).catch((error) => {
            if (!(error.response && error.response.status === 422)) {
              this.close()
              this.instance.params.search()
            }
          })
        })
      })
    }
  }
}
</script>
