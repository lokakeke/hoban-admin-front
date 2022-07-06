<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>add</v-icon>우대번호 상품 정보
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-data-table
        class="bordered"
        :no-data-text="'데이터가 없습니다.'"
        :no-result-text="'데이터가 없습니다..'"
        :headers="ticketGroupHeaders"
        :items="groupList"
        hide-default-footer
      >
        <template v-slot:item.itemName="{item}">
          <v-text-field v-model="item.itemName" label :rules="emptyRules"></v-text-field>
        </template>
        <template v-slot:item.itemInd="{item}">
          <v-select v-model="item.itemInd" :items="itemIndList" item-text="commonCodeName" item-value="commonCode"></v-select>
        </template>
        <template v-slot:item.amt="{item}">
          {{item.amt | price}}
        </template>
        <template v-slot:item.qty="{item}">
          <v-text-field v-model="item.qty" label type="number" :rules="numberRules.concat(emptyRules)"></v-text-field>
        </template>
        <template v-slot:item.detail="{ item }">
          <v-btn text block rounded color="green" @click="detailInfo(item)">
            상세요금 입력
          </v-btn>
        </template>
        <template v-slot:item.useYn="{ item }">
          <v-radio-group v-model="item.useYn" row class="pl-5">
            <v-radio label="예" value="Y"></v-radio>
            <v-radio label="아니요" value="N"></v-radio>
          </v-radio-group>
        </template>
        <template v-slot:item.cancelPsblYn="{ item }">
          <v-radio-group v-model="item.cancelPsblYn" row class="pl-5" :disabled="setCancelDisable(item)">
            <v-radio label="예" value="Y"></v-radio>
            <v-radio label="아니요" value="N"></v-radio>
          </v-radio-group>
        </template>
      </v-data-table>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="checkGroupList">
        <v-icon left>check</v-icon>적용
      </v-btn>
      <v-btn outlined rounded color="primary" @click="close">
        <v-icon left>close</v-icon>닫기
      </v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'TicketRegGroupDialog',
  data () {
    return {
      // 우대번호 결합 Modal Header
      ticketGroupHeaders: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false, width: '5%' },
        { text: '우대번호 명', value: 'ticketName', align: 'center', sortable: false, width: '20%' },
        { text: '상품명', value: 'itemName', align: 'center', sortable: false, width: '20%' },
        { text: '상품구분', value: 'itemInd', align: 'center', sortable: false, width: '10%' },
        { text: '요금', value: 'amt', align: 'center', sortable: false, width: '5%' },
        { text: '수량', value: 'qty', align: 'center', sortable: false, width: '5%' },
        { text: '상세요금', value: 'detail', align: 'center', sortable: false, width: '10%' },
        { text: '정산 유무', value: 'useYn', align: 'center', sortable: false, width: '13%' },
        { text: '사용시 취소 가능 유무', value: 'cancelPsblYn', align: 'center', sortable: false, width: '12%' }
      ],
      groupList: [],
      itemIndList: [] // 상품구분 공통코드
    }
  },
  mounted () {
    this.setItemInd()
    this.setGroupList(this.instance.params.groupList)
  },
  methods: {
    // 상품구분 공통코드
    setItemInd () {
      commonCodeService.selectCommonCode('ITEM_IND').then(res => {
        if (res.data) {
          this.itemIndList = res.data
        }
      })
    },
    // 기본 코드 setting
    setGroupList (groupList) {
      // 상품구분 값이 없을경우 기본값 setting
      groupList.forEach(item => {
        if (!item.itemInd) {
          if (_.startsWith(item.ticketNo, '4')) {
            item.itemInd = 'B' // 상품구분 (4) 입장권
          } else if (_.startsWith(item.ticketNo, '9')) {
            item.itemInd = 'D' // 상품구분 (9) 할인권
          } else if (_.startsWith(item.ticketNo, '5')) {
            item.itemInd = 'A' // 상품구분 (5) 객실
          }
        }
        // 정산유무 값이 없을경우 할인권(9)만 아니요 default
        if (!item.useYn) {
          item.useYn = 'Y' // 사용유무(예)
          if (_.startsWith(item.ticketNo, '9')) {
            item.useYn = 'N' // 사용유무(아니요)
          }
        }
        // 사용시 취소 가능 유무 (98번대 우대번호만 Y,N 선택 가능)
        if (_.startsWith(item.ticketNo, '9')) {
          if (!item.cancelPsblYn) item.cancelPsblYn = 'Y'
        } else {
          item.cancelPsblYn = 'N'
        }
      })
      this.groupList = groupList
    },
    // 사용시 취소 가능 유무 setting
    setCancelDisable (item) {
      let disabled = true
      if (_.startsWith(item.ticketNo, '9')) {
        disabled = false
      }
      return disabled
    },
    // 우대번호 상품정보 상세
    detailInfo (item) {
      // 결합 상품 상세 목록 초기화
      if (item.issuQtyList === null || item.issuQtyList === undefined) {
        item.issuQtyList = []
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketRegGroupDetailDialog',
        params: {
          issuQtyList: _.cloneDeep(item.issuQtyList),
          issuQtyTicketNo: item.ticketNo,
          groupAmt: item.amt || 0
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            // 변경되면 적용한다.
            if (params && params.data) {
              item.issuQtyList = params.data
              item.amt = item.issuQtyList.reduce((sum, data) => sum + data.dtlAmt, 0)
            }
          }
        }
      })
    },
    // 결합우대번호 상품 정보 적용
    checkGroupList () {
      this.validForm(this.$refs.form).then(() => {
        this.groupList.forEach(item => {
          if (item.issuQtyList.length === 0) {
            this.$dialog.alert('상세요금 입력은 필수입니다.').then(() => {
              this.detailInfo(item)
            })
          } else {
            this.close({ data: this.groupList })
          }
        })
      })
    }
  }
}
</script>
