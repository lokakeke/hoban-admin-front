<template>
    <dialog-base :instance="instance" :title="'매출조정 관리 ' + `${ instance.params.form.saleAdjustNo ? '수정' : '추가' }`">
        <template v-slot:buttons>
            <v-btn v-if="!form.calcStndMonth" dark text @click="addSaleAdjust">
                <v-icon left>check</v-icon>
                {{ instance.params.form.saleAdjustNo ? "수정" : "추가" }}
            </v-btn>
            <v-btn dark text @click="deleteSaleAdjust(form)"
                   v-if="instance.params.form.saleAdjustNo && !form.calcStndMonth">
                <v-icon left>remove</v-icon>
                삭제
            </v-btn>
        </template>
        <v-card-text class="pa-0 pl-2 pr-2">
            <v-form ref="form" v-if="form" lazy-validation>
                <v-row no-gutters v-if="form.calcStndMonth">
                    <v-col lg="4" md="4" sm="6">
                        <v-col class="font-weight-black subtitle-1">
                            매핑정보 : {{ form.calcStndMonth.substring(0, 4) + "-" + form.calcStndMonth.substring(4, 6) }}
                        </v-col>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col lg="4" md="4" sm="6">
                        <div class="mt-1 pb-2">
                            <v-icon color="grey lighten-1">check</v-icon>
                            네이버예약ID
                            <common-tooltip :type="'info'" :position="'top'"
                                            :text="'네이버예약ID를 입력한 후 오른쪽 아이콘을 클릭하면 예약 정보가 입력됩니다.'" />
                        </div>
                        <v-text-field background-color="green" dark solo dense v-model="form.bookingId"
                                      :rules="numberRules" v-mask="'##########'" placeholder="네이버예약ID를 입력해 주세요.">
                            <v-icon v-if="form.bookingId" slot="append" dark @click="selectBookingSaleAdjust">search
                            </v-icon>
                        </v-text-field>
                    </v-col>
                    <v-col lg="4" md="4" sm="6">
                        <div class="pb-3">
                            <v-icon color="green darken-2">check</v-icon>
                            회원/패키지번호
                            <common-tooltip :type="'info'" :position="'top'"
                                            :text="'패키지번호를 입력한 후 오른쪽 아이콘을 클릭하면 DGNS상품명이 입력됩니다.'" />
                            <v-chip label small class="ml-1">
                                <v-checkbox label="패키지여부" color="green" true-value="Y" false-value="N"
                                            v-model="form.pkgYn" class="float-right font-sm"></v-checkbox>
                            </v-chip>
                        </div>
                        <v-text-field background-color="green" dark solo dense v-model="form.mid"
                                      placeholder="회원/패키지번호를 입력해 주세요."
                                      :rules="numberRules.concat(emptyRules)" v-mask="'##########'">
                            <v-icon v-if="form.mid && form.pkgYn === 'Y'" slot="append" dark
                                    @click="selectPkgNmSaleAdjust">search
                            </v-icon>
                        </v-text-field>
                    </v-col>
                    <v-col lg="4" md="4" sm="6">
                        <div class="pb-1">
                            <v-icon color="green darken-2">check</v-icon>
                            DGNS회원/예약자명
                        </div>
                        <v-text-field v-model="form.name" placeholder="DGNS회원/예약자명을 입력해 주세요."
                                      counter="30" :rules="betweenLengthRules(1,30).concat(emptyRules)"></v-text-field>
                    </v-col>
                    <v-col lg="6" md="6" sm="6">
                        <div class="pb-1">
                            <v-icon color="green darken-2">check</v-icon>
                            사업장명
                        </div>
                        <v-autocomplete
                            v-model="form.storeCd"
                            :items="storeList"
                            item-value="storeCd"
                            item-text="storeNm"
                            :rules="emptyRules"
                            autocomplete="off"
                            placeholder="사업장을 선택해 주세요."
                            return-object
                            hide-details
                        ></v-autocomplete>
                    </v-col>
                    <v-col lg="6" md="6" sm="6">
                        <div class="pb-1">
                            <v-icon color="green darken-2">check</v-icon>
                            DGNS상품명
                        </div>
                        <v-text-field v-model="form.dgnsItemName" placeholder="DGNS상품명을 입력해 주세요."
                                      :rules="emptyRules"></v-text-field>
                    </v-col>
                    <v-col lg="4" md="4" sm="6">
                        <div class="pb-1">
                            <v-icon color="grey lighten-1">check</v-icon>
                            DGNS예약번호
                        </div>
                        <v-text-field v-model="form.rsvNo" placeholder="DGNS예약번호를 입력해 주세요."
                                      :rules="numberRules" v-mask="'##########'"></v-text-field>
                    </v-col>
                    <v-col lg="4" md="4" sm="6">
                        <div class="pb-1">
                            <v-icon color="grey lighten-1">check</v-icon>
                            DGNS KEY예약번호
                        </div>
                        <v-text-field v-model="form.keyRsvNo" placeholder="DGNS KEY예약번호를 입력해 주세요."
                                      :rules="numberRules" v-mask="'##########'"></v-text-field>
                    </v-col>
                    <v-col lg="4" md="4" sm="6">
                        <div class="pb-1">
                            <v-icon color="green darken-2">check</v-icon>
                            매출조정금액
                        </div>
                        <v-currency-field v-model="form.aftpayAmt" placeholder="매출조정금액을 입력해 주세요."
                                          :rules="numberMinusRules.concat(emptyRules)" maxLength="13"
                                          suffix="원"></v-currency-field>
                    </v-col>
                    <v-col lg="12" md="12" sm="12">
                        <div class="pb-2">
                            <v-icon color="green darken-2">check</v-icon>
                            메모
                        </div>
                        <v-textarea outlined dense v-model="form.memo" placeholder="메모를 입력해 주세요."
                                    counter="300" :rules="maxLengthRules(300).concat(emptyRules)"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="text-right mt-3">
                        <v-btn v-if="!form.calcStndMonth" outlined rounded color="info" @click="addSaleAdjust">
                            <v-icon left>check</v-icon>
                            {{ instance.params.form.saleAdjustNo ? "수정" : "추가" }}
                        </v-btn>
                        <v-btn outlined rounded color="error" @click="deleteSaleAdjust(form)"
                               v-if="instance.params.form.saleAdjustNo && !form.calcStndMonth">
                            <v-icon left>remove</v-icon>
                            삭제
                        </v-btn>
                        <v-btn outlined rounded color="primary" @click="close()">
                            <v-icon left>close</v-icon>
                            닫기
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase'
import CommonTooltip from 'Components/Common/CommonTooltip.vue'
import itemService from 'Api/modules/naver/item.service'
import service from 'Api/modules/naver/calculateSaleAdjust.service'

export default {
  extends: DialogBase,
  name: 'SaleAdjustForm',
  components: {
    CommonTooltip
  },
  data: function () {
    return {
      form: {
        calcStndMonth: '',
        saleAdjustNo: '',
        storeCd: '',
        pkgYn: 'N',
        mid: '',
        rsvNo: '',
        keyRsvNo: '',
        dgnsItemName: '',
        dgnsMemName: '',
        bookingId: '',
        name: '',
        aftpayAmt: '',
        memo: ''
      },
      storeList: []
    }
  },
  mounted () {
    this.init()
    this.getOnlyRoomList()
  },
  methods: {
    init () {
      if (this.instance.params.form.saleAdjustNo) {
        this.form = _.cloneDeep(this.instance.params.form)
      }
    },
    async getOnlyRoomList () {
      await itemService.selectOnlyRoomList().then((response) => {
        const data = _.orderBy(response.data, 'storeCd')
        this.storeList = []
        data.map(obj => {
          this.storeList.push({
            storeNm: `${obj.storeNm} (${obj.storeCd})`,
            storeCd: obj.storeCd,
            rmTypeList: obj.rmTypeList
          })
        })
      })
    },
    selectBookingSaleAdjust () {
      if (!this.form.bookingId) {
        this.$dialog.alert('예약ID를 입력해주세요.')
        return
      }
      service.selectBookingSaleAdjust(this.form).then(res => {
        this.form.storeCd = res.data.storeCd
        this.form.pkgYn = res.data.pkgYn
        this.form.mid = res.data.mid
        this.form.rsvNo = res.data.rsvNo
        this.form.keyRsvNo = res.data.keyRsvNo
        this.form.dgnsItemName = res.data.pkgNm ? res.data.pkgNm : '네이버'
        this.form.name = res.data.name
      })
    },
    selectPkgNmSaleAdjust () {
      if (this.form.pkgYn !== 'Y' || !this.form.mid) {
        this.$dialog.alert('패키지번호를 입력해주세요.')
        return
      }
      service.selectPkgNmSaleAdjust(this.form).then(res => {
        this.form.dgnsItemName = res.data ? res.data : '네이버'
      })
    },
    addSaleAdjust () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(`매출조정을 ${this.form.saleAdjustNo ? '수정' : '추가'} 하시겠습니까?`).then(() => {
          let param = null
          if (this.form.storeCd.storeCd) {
            this.form.storeCd = this.form.storeCd.storeCd
          }
          if (this.form.saleAdjustNo) { // 수정
            service.updateSaleAdjust(this.form).then(res => {
              this.$dialog.alert('수정되었습니다.')
              param = this.form
              this.close({ data: param })
            })
          } else { // 저장
            service.insertSaleAdjust(this.form).then(res => {
              this.$dialog.alert('저장되었습니다.')
              param = this.form
              this.close({ data: param })
            })
          }
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    /**
         * 매출조정 삭제
         */
    deleteSaleAdjust (item) {
      this.$dialog.confirm('삭제하시겠습니까?').then(() => {
        service.deleteSaleAdjust(item).then(res => {
          this.$dialog.alert('삭제되었습니다.').then(() => {
            this.close()
          })
        })
      })
    }
  }
}
</script>
