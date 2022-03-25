<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      사전 정산분류
    </template>
    <v-container fluid>
      <v-row dense>
        <v-col cols="6">
          <v-row dense no-gutters>
            <v-col>
              <v-card flat>
                <v-card-title>사전 정산분류 리스트</v-card-title>
                <v-card-text>
                  <v-data-table
                      :headers="tableHeaders"
                      :items="tableItems"
                      :no-results-text="emptyText"
                      :no-data-text="emptyText"
                      hide-default-footer
                      disable-sort
                      disable-pagination
                      disable-filtering
                      fixed-header
                      height="300"
                  >
                    <template v-slot:item.calcClass="{ item }">
                      {{ item.calcClass === 'EXPT' ? '예외' : item.calcClass === 'ADJUST' ? '매출조정' : '제외' }}
                    </template>
                    <template v-slot:item.memo="{ item }">
                      <span :title="item.memo">{{ item.memo | textTruncate(10) }}</span>
                    </template>
                    <template v-slot:item.delete="{ item }">
                      <v-btn icon color="red" @click="removeCalcClass(item)">
                        <v-icon>clear</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row dense no-gutters>
            <v-col>
              <v-form ref="form">
                <v-card flat>
                  <v-card-title>예약번호 등록</v-card-title>
                  <v-card-text class="px-0">
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>예약번호</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-row dense no-gutters>
                            <v-col cols="8">
                              <v-text-field
                                  placeholder="KEY 예약 번호"
                                  v-model="keyRsvNo"
                                  :rules="emptyRules"
                              />
                            </v-col>
                            <v-col cols="4" class="text-end align-self-center">
                              <v-btn rounded
                                     outlined
                                     color="success"
                                     @click="validKeyRsvNo"
                              >
                                확인
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>분류</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-select
                              v-model="form.calcClass"
                              :items="classItems"
                              item-text="name"
                              item-value="value"
                              label="분류"
                              :rules="emptyRules"
                          ></v-select>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>메모</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-text-field
                              placeholder="메모를 입력해주세요"
                              v-model="form.memo"
                          />
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-col>
          </v-row>
          <v-divider />
          <v-row dense no-gutters>
            <v-col cols="12">
              <span class="pr-1"><v-icon>error_outline</v-icon></span>
              <span style="vertical-align: middle">등록된 KEY 예약번호는 정산 시 자동으로 분류됩니다.</span>
            </v-col>
            <v-col cols="12" class="text-end mt-2">
              <v-btn color="error"
                     outlined
                     rounded
                     @click="cancel"
              >
                취소
              </v-btn>
              <v-btn color="success"
                     outlined
                     rounded
                     @click="addCalcClass"
              >
                등록
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import calculationService from 'Api/modules/ota/calculation.service'

export default {
  extends: DialogBase,
  name: 'CalcClassAddDialog',
  data: function () {
    return {
      targetMonth: '',
      tableHeaders: [
        { text: 'KEY 예약번호', value: 'keyRsvNo' },
        { text: '분류', value: 'calcClass' },
        { text: '메모', value: 'memo' },
        { text: '삭제', value: 'delete', align: 'center' }
      ],
      tableItems: [],

      keyRsvNo: '',

      form: {
        keyRsvNo: '',
        isKeyRsvNo: false,
        calcClass: '',
        memo: ''
      },
      classItems: [
        { name: '예외', value: 'EXPT' },
        { name: '매출조정', value: 'ADJUST' },
        { name: '제외', value: 'EXCL' }
      ]
    }
  },
  mounted () {
    this.targetMonth = moment(this.instance.params.targetDate).format('YYYYMM')
    this.getAddClassList()
  },
  methods: {
    async getAddClassList () {
      const response = await calculationService.retrieveMonthCalcAddClassList(this.targetMonth)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      this.tableItems = data.resultList
    },

    async validKeyRsvNo () {
      const response = await calculationService.retrieveReservationInformation(this.keyRsvNo)
      const data = response.data

      if (data.resultCode !== '0000') {
        this.form.isKeyRsvNo = false
        this.$dialog.alert(data.resultMsg)
      } else {
        this.$dialog.alert('확인되었습니다.')
        this.form.keyRsvNo = this.keyRsvNo
        this.form.isKeyRsvNo = true
      }
    },

    cancel () {
      this.close()
    },

    async checkRegisteredCalcClass () {
      const response = await calculationService.retrieveMonthCalcAddClass(this.targetMonth, this.form.keyRsvNo)
      const data = response.data

      return data.resultCode !== '0000'
    },

    async addCalcClass () {
      try {
        await this.validForm(this.$refs.form)

        if (!this.form.isKeyRsvNo || this.keyRsvNo !== this.form.keyRsvNo) {
          this.form.keyRsvNo = ''
          return this.$dialog.alert('KEY 예약번호를 확인해주세요')
        }

        const hasCalcClass = await this.checkRegisteredCalcClass()
        if (!hasCalcClass) {
          return this.$dialog.alert('이미 등록된 KEY 예약번호 입니다.')
        }

        this.form.calcYm = this.targetMonth
        const response = await calculationService.addMonthCalcAddClass(this.form)
        const data = response.data

        if (data.resultCode !== '0000') {
          return this.$dialog.alert(data.resultMsg)
        }

        this.$dialog.alert('등록되었습니다.')
        this.getAddClassList()
      } catch (e) {
        console.log(e)
      }
    },

    async removeCalcClass (item) {
      try {
        await this.$dialog.confirm('선택한 항목을 제거하시겠습니까?')

        const submitData = {
          calcYm: this.targetMonth,
          keyRsvNo: item.keyRsvNo
        }

        const response = await calculationService.removeMonthCalcAddClass(submitData)
        const data = response.data

        if (data.resultCode !== '0000') {
          return this.$dialog.alert(data.resultMsg)
        }

        this.$dialog.alert('삭제되었습니다.')
        this.getAddClassList()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
