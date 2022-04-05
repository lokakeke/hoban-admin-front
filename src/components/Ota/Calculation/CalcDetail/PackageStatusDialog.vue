<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      입금일자별 패키지 현황 조회
    </template>
    <v-container fluid>
      <v-row>
        <v-col cols="4">
          <v-text-field
              placeholder="패키지 번호"
              :rules="emptyRules"
              v-model="pkgNo"
              maxlength="8"
              @keypress.enter="getPackageStatus"
          />
        </v-col>
        <v-col cols="2" class="align-self-center">
          <v-btn color="info"
                 outlined
                 rounded
                 @click="getPackageStatus"
          >
            <v-icon>search</v-icon> 조회(Enter)
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="isSearch">
        <v-col cols="4" offset-sm="8">
          <v-text-field
              v-model="keywordSearch"
              append-icon="mdi-magnify"
              placeholder="예약자명/예약번호/사용자명/POS_NO/KEY 예약번호로 검색"
              hide-details
              clearable
          />
        </v-col>
        <v-col cols="12">
          <v-row dense no-gutters>
            <v-col>
              <v-data-table
                  :headers="statusHeader"
                  :items="statusItems"
                  :search="keywordSearch"
                  :no-data-text="emptyText"
                  :no-results-text="emptyText"
                  disable-sort
                  :footer-props="{'items-per-page-text': '페이지 당 보여줄 개수:'}"
              >
                <template v-slot:item.checked="{ item }">
                  <template v-if="item.saleNo">
                    <v-checkbox v-model="item.checked"
                                dense
                                hide-details
                                class="ma-0"
                                true-value="Y"
                                false-value="N"
                                v-if="item.existYn === 'N'"
                    />
                    <span v-else class="blue--text">포함됨</span>
                  </template>
                </template>
                <template v-slot:item.pkgName="{ item }">
                  <span :title="item.pkgName">{{ item.pkgName | textTruncate(18) }}</span>
                </template>
                <template v-slot:item.rsvYmd="{ item }">
                  {{ item.rsvYmd | date }}
                </template>
                <template v-slot:item.coYmd="{ item }">
                  {{ item.coYmd | date }}
                </template>
                <template v-slot:item.rsvGuestName="{ item }">
                  <span :title="item.rsvGuestName">{{ item.rsvGuestName | textTruncate(18) }}</span>
                </template>
                <template v-slot:item.userName="{ item }">
                  <span :title="item.userName">{{ item.userName | textTruncate(18) }}</span>
                </template>
                <template v-slot:item.saleAmt="{ item }">
                  {{ item.saleAmt | price }}
                </template>
                <template v-slot:item.rcpmnyYmd="{ item }">
                  {{ item.rcpmnyYmd | date }}
                </template>
                <template v-slot:item.rcpmnyAmt="{ item }">
                  {{ item.rcpmnyAmt | price }}
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row dense no-gutters>
            <v-col>
              <v-col class="text-end">
                <v-btn outlined
                       rounded
                       color="success"
                       @click="add()"
                >
                  선택한 예약번호 추가정산 등록
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import calculationService from '@/api/modules/ota/calculation.service'

export default {
  extends: DialogBase,
  name: 'PackageStatusDialog',
  data: function () {
    return {
      calcSeq: '',
      pkgNo: '',
      isSearch: false,
      form: {},
      statusHeader: [
        { text: '선택', value: 'checked', align: 'center', filterable: false },
        { text: '패키지번호', value: 'pkgNo', align: 'center', filterable: false },
        { text: '패키지명', value: 'pkgName', align: 'center', filterable: false },
        { text: '판매번호', value: 'saleNo', align: 'center', filterable: false },
        { text: '예약일자', value: 'rsvYmd', align: 'center', filterable: false },
        { text: '퇴실일자', value: 'coYmd', align: 'center', filterable: false },
        { text: '예약자명', value: 'rsvGuestName', align: 'center' },
        { text: '예약번호', value: 'rsvNo', align: 'center' },
        { text: '사용자명', value: 'userName', align: 'center' },
        { text: '판매금액', value: 'saleAmt', align: 'center', filterable: false },
        { text: '입금순번', value: 'rcpmnySeq', align: 'center', filterable: false },
        { text: '입금일자', value: 'rcpmnyYmd', align: 'center', filterable: false },
        { text: '입금수단', value: 'rcpmnyMn', align: 'center', filterable: false },
        { text: '입금금액', value: 'rcpmnyAmt', align: 'center', filterable: false },
        { text: 'POS_NO', value: 'posNo', align: 'center' },
        { text: '정보 1', value: 'info', align: 'center', filterable: false },
        { text: 'KEY 예약번호', value: 'keyRsvNo', align: 'center' }
      ],
      statusItems: [],
      keywordSearch: ''
    }
  },
  mounted () {
    this.calcSeq = this.instance.params.calcSeq
  },
  computed: {
    checkedKeyRsvNoList () {
      return this.statusItems.filter(item => item.checked === 'Y').map(item => item.keyRsvNo)
    }
  },
  methods: {
    async getPackageStatus () {
      if (this.pkgNo.length <= 0) {
        return this.$dialog.alert('패키지번호를 입력해주세요')
      }

      const response = await calculationService.retrieveDgnsPackageStatusByDepositDate(this.calcSeq, this.pkgNo)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      if (data.resultList.length === 0) {
        return this.$dialog.alert('조회결과가 없습니다.')
      }

      data.resultList.forEach(item => { item.checked = 'N' })
      this.statusItems = data.resultList
      this.isSearch = true
    },

    async add () {
      if (this.checkedKeyRsvNoList.length === 0) {
        return this.$dialog.alert('선택된 항목이 없습니다.')
      }

      try {
        await this.$dialog.confirm('선택한 항목들을 추가정산에 등록하시겠습니까?')

        const response = await calculationService.addMonthAddCalcDetails(this.calcSeq, this.checkedKeyRsvNoList)
        const data = response.data

        if (data.resultCode !== '0000') {
          return this.$dialog.alert(data.resultMsg)
        }

        await this.$dialog.alert('등록되었습니다.')
        this.close(true)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
