<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">업체 상품 URL {{isNew ? '추가' : '상세/수정'}}</span>
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col md="12" sm="4">
          <v-label>상품명</v-label>
          <v-text-field :rules="emptyRules" label="" required v-model="form.itemNm"></v-text-field>
        </v-col>
        <v-col md="12" sm="12">
          <v-label>주소
            <span class="font-weight-bold gray--text">( https://sonoadmin.traveland.co.kr 형태로 입력해주세요. )</span>
          </v-label>
          <v-text-field :rules="emptyRules" label="" required v-model="form.itemUrl"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12" sm="12">
          <v-label>비고</v-label>
          <v-text-field :rules="emptyRules" label="" required v-model="form.memo"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn @click="addGoods" color="info" outlined rounded>
        <v-icon left>check</v-icon>
        적용
      </v-btn>
      <v-btn @click="close" color="primary" outlined rounded>
        <v-icon left>close</v-icon>
        닫기
      </v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  extends: DialogBase,
  name: 'GoodsUrlDialog',
  data () {
    return {
      isNew: Boolean,
      form: Object
    }
  },
  mounted () {
    this.isNew = this.instance.params.isNew
    this.form = this.instance.params.form
  },
  methods: {
    // 상품 추가/수정
    addGoods () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(this.isNew ? '업체 상품 URL 목록에 추가 하시겠습니까?' : '업체 상품 URL을 수정 하시겠습니까?').then(() => {
          this.close({ data: this.form })
        })
      })
    }
  }
}
</script>
