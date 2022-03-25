<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>add</v-icon>소셜 통계 데이터 입력
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col md="4">
          <v-label>시작일</v-label>
          <date-picker
            v-model='stndDt'
            format="YYYY-MM-DD"
            @change="setEndDt"
          >
          </date-picker>
        </v-col>
        <v-col sm="1" align-self="center" align="center">~</v-col>
        <v-col md="4">
          <v-label>종료일</v-label>
          <date-picker
            v-model='stndEndDt'
            :min="stndDt"
            :max="maxDate"
            format="YYYY-MM-DD"
            :disabled="setStndDt"
          >
          </date-picker>
        </v-col>
        <v-col md="3" align-self="center" align="right">
          <v-btn outlined rounded color="info" @click="addStatistics"><v-icon left>add</v-icon>데이터 추가</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import statisticsService from 'Api/modules/social/statistics.service'

export default {
  extends: DialogBase,
  name: 'AddStatistics',
  data () {
    return {
      stndDt: null,
      stndEndDt: null,
      form: {
        stndDt: null,
        stndEndDt: null
      },
      maxDate: null
    }
  },
  computed: {
    setStndDt () {
      return this.stndDt === null
    }
  },
  mounted () {
  },
  methods: {
    // 종료일 set
    setEndDt () {
      if (this.stndDt && moment(this.stndDt).isValid()) {
        this.maxDate = moment(this.stndDt).add(1, 'months').format('YYYY-MM-DD')
        console.log(this.maxDate)
      }
    },
    setStndYmd () {
      // 판매 시작일자, 종료일자
      const ymdArr = ['stndDt', 'stndEndDt']
      ymdArr.forEach(item => {
        this.form[item] = this[item].replaceAll('-', '')
      })
    },
    // 통계 데이터 입력
    addStatistics () {
      this.setStndYmd()
      statisticsService.insertStatistics(this.form).then(() => {
        this.$dialog.alert('데이터 추가중입니다.<br/>잠시 후 검색을 통해 다시 조회해 주세요.').then(() => {
          this.close()
        })
      })
    }
  }
}
</script>
