<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon>우대번호 결합 상품 상세
    </template>
    <v-row justify="space-between">
      <v-col cols="12" class="text-right">
        <v-btn small rounded outlined @click="addIssuQtyDetail" color="info">
          <v-icon small>add</v-icon>추가
        </v-btn>
      </v-col>
    </v-row>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-data-table
        class="bordered"
        :no-data-text="'데이터가 없습니다.'"
        :no-result-text="'데이터가 없습니다..'"
        :headers="issuQtyheaders"
        :items="issuQtyList"
        item-key="index"
        hide-default-footer
      >
        <template v-slot:item.dtlNm="{item}">
          <v-text-field v-model="item.dtlNm" label="" :rules="emptyRules"></v-text-field>
        </template>
        <template v-slot:item.dtlAmt="{item}">
          <v-currency-field v-model="item.dtlAmt" label :rules="numberRules.concat(emptyRules)" :disabled="setAmtDisable(item)"></v-currency-field>
        </template>
        <template v-slot:item.directOprtYn="{ item }">
          <v-radio-group v-model="item.directOprtYn" row class="pl-5">
            <v-radio label="예" value="Y"></v-radio>
            <v-radio label="아니요" value="N"></v-radio>
          </v-radio-group>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            small
            color="accent"
            rounded
            outlined
            @click="removeIssuQtyDetail(item)"
          >
            <v-icon small>remove</v-icon>삭제
          </v-btn>
        </template>
        <template v-slot:body.append>
          <tr class="grey lighten-3 text-center">
            <td class="font-weight-bold">요금</td>
            <td class="font-weight-bold text-right pr-12" colspan="4">{{groupAmt | price }} 원</td>
          </tr>
        </template>
      </v-data-table>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="checkIssuQtyDetail">
        <v-icon left>check</v-icon>적용
      </v-btn>
      <v-btn outlined rounded color="primary" @click="close">
        <v-icon left>close</v-icon>닫기
      </v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  extends: DialogBase,
  name: 'TicketRegGroupDetailDialog',
  data () {
    return {
      // 우대번호 결합상품 상세 Modal Header
      issuQtyheaders: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '상품 명', value: 'dtlNm', align: 'center', sortable: false },
        { text: '요금', value: 'dtlAmt', align: 'center', sortable: false },
        { text: '직영유무', value: 'directOprtYn', align: 'center', sortable: false },
        { text: '삭제', value: 'action', align: 'center', sortable: false }
      ],
      issuQtyList: [],
      issuQtyTicketNo: '',
      groupAmt: ''
    }
  },
  mounted () {
    this.issuQtyList = this.instance.params.issuQtyList
    this.issuQtyTicketNo = this.instance.params.issuQtyTicketNo
    this.groupAmt = this.instance.params.groupAmt
  },
  methods: {
    // 우대번호 결합 상품 추가
    addIssuQtyDetail () {
      this.issuQtyList.push({ ticketNo: this.issuQtyTicketNo, dtlNm: '', dtlAmt: 0, directOprtYn: 'Y' })
    },
    setAmtDisable (item) {
      let disabled = false
      if (_.startsWith(item.ticketNo, '9')) {
        disabled = true
      }
      return disabled
    },
    // 우대번호 결합 상품 삭제
    removeIssuQtyDetail (data) {
      this.$dialog.confirm('선택한 상품을 삭제하시겠습니까?').then(() => {
        this.issuQtyList.splice(this.issuQtyList.indexOf(data), 1)
      }).catch(() => {})
    },
    // 우대번호 상품 상세 유효성
    checkIssuQtyDetail () {
      if (this.issuQtyList.length === 0) {
        this.$dialog.alert('상세요금 입력은 필수입니다.').then(() => {
          this.addIssuQtyDetail()
        })
      } else {
        let status = false
        for (const item of this.issuQtyList) {
          if (!item.ticketNo.startsWith('9') && item.dtlAmt === 0) {
            this.$dialog.alert('요금을 입력해주세요.')
            status = false
            break
          } else {
            status = true
          }
        }
        if (status) {
          this.validForm(this.$refs.form).then(() => {
            this.close({ data: this.issuQtyList })
          })
        }
      }
    }
  }
}
</script>
