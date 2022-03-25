<template>
    <v-card-text>
        <v-form ref="form" lazy-validation>
            <v-container fluid>
                <v-row>
                  <v-col sm="6" md="4">
                    <v-label>상품속성</v-label>
                    <v-select
                      v-model="form.itemAttrb"
                      :items="itemAttrbList"
                      item-text="commCdNm"
                      item-value="commCd"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="6" md="4">
                    <v-label>상품유형</v-label>
                    <v-select
                      v-model="form.itemType"
                      :items="itemTypeList"
                      item-text="commCdNm"
                      item-value="commCd"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="6" md="4">
                    <v-label>영업장</v-label>
                    <v-combobox
                      v-model="form.lcalCd"
                      counter="100"
                      placeholder="영업장을 입력해 주세요."
                      :items="lcalCdList"
                      :rules="maxLengthRules(100).concat(emptyRules)"
                    ></v-combobox>
                  </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" class="text-right">
                        <v-btn color="info" @click="submit()" rounded v-if="writeAuth">{{data.status === 'regist' ? '등록' : '수정'}}</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card-text>
</template>

<script>
import commonCodeService from "Api/modules/system/commonCode.service"
import ticketService from "Api/modules/social/ticket.service"

export default {
  props: { data: Object, close: Function, step: Function },
  name: 'TicketRegform3',
  data () {
    return {
      itemAttrbList: [], // 상시전략 구분
      itemTypeList: [], // 상품유형 목록
      lcalCdList: [], // 판매 영업장 목록
      form: {},
      initForm: {
        itemAttrb: 'STRATEGY',
        itemType: 'OCEAN'
      }
    }
  },
  computed: {
  },
  mounted () {
    console.log('step 3 mounted')
    // 우대번호
    this.form.ticketNo = this.data.ticketNo
    // 공통코드 조회
    this.getCommonCode()
    // 판매영업장 조회
    this.selectLcalCdList()
    // 통계정보 조회
    this.search()
  },
  methods: {
    // 상시전략, 상품유형 공통코드 조회
    getCommonCode () {
      const codes = ['SOCIAL0004', 'SOCIAL0005']
      commonCodeService.selectCommonCodeArray(codes).then(res => {
        if (res.data) {
          this.itemAttrbList = res.data.SOCIAL0004 // 상시,전략 구분
          this.itemTypeList = res.data.SOCIAL0005 // 상품유형
        }
      })
    },
    // 통계정보 조회
    search () {
      ticketService.selectStatisList(this.form).then(res => {
        if (res.data) {
          this.form = Object.assign({}, this.initForm, res.data)
        }
      })
    },
    // 판매영업장 조회
    selectLcalCdList () {
      const list = []
      ticketService.selectLcalCdList().then(res => {
        if (res.data) {
          res.data.forEach(item => {
            list.push(item.lcalCd)
          })
          this.lcalCdList = list
        }
      })
    },
    // 저장
    submit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('통계 정보를 등록하시겠습니까?').then(() => {
          console.log(this.form)
          ticketService.saveTicketStatis(this.form).then(res => {
            this.$dialog.alert('저장되었습니다.')
          })
        }).catch(() => {})
      })
    }
  }
}
</script>
