<template>
  <v-card-text>
    <v-form ref="form" lazy-validation>
      <v-container fluid>
        <v-row>
          <v-col sm="4" md="2">
            <v-label>운영담당자 사번</v-label>
            <v-text-field v-model="form.empNo" label :rules="emptyRules" required></v-text-field>
          </v-col>
          <v-col sm="4" md="2">
            <v-label>운영담당자 이름</v-label>
            <v-text-field v-model="form.empNm" label :rules="emptyRules" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="1">
            <v-label>알림 수신거부 여부</v-label>
          </v-col>
          <v-col md="1">
            <v-switch
              v-model="form.noticeYn"
              true-value="Y"
              false-value="N"
              class="justify-end mt-0"
              :label="form.noticeYn === 'Y'? '적용': '미적용'"
              hide-details
              dense
              inset
              color="info"
            ></v-switch>
          </v-col>
          <v-col md="1">
            <v-autocomplete
              v-model="form.startHour"
              :items="hourList"
              item-text="hourCd"
              item-value="hourCd"
              :disabled="form.noticeYn == 'Y' ? false : true"
            ></v-autocomplete>
          </v-col>
          <v-col cols="auto" class="pt-5">
            <span class="font-weight-bold">:</span>
          </v-col>
          <v-col md="1">
            <v-autocomplete
              v-model="form.startMin"
              :items="minList"
              item-text="minCd"
              item-value="minCd"
              :disabled="form.noticeYn == 'Y' ? false : true"
            ></v-autocomplete>
          </v-col>

          <v-col cols="auto" class="pt-7 pl-10 pr-10">
            <span class="font-weight-bold">~</span>
          </v-col>

          <v-col md="1">
            <v-autocomplete
              v-model="form.endHour"
              :items="hourList"
              item-text="hourCd"
              item-value="hourCd"
              :disabled="form.noticeYn == 'Y' ? false : true"
            ></v-autocomplete>
          </v-col>
          <v-col cols="auto" class="pt-5">
            <span class="font-weight-bold">:</span>
          </v-col>
          <v-col md="1">
            <v-autocomplete
              v-model="form.endMin"
              :items="minList"
              item-text="minCd"
              item-value="minCd"
              :disabled="form.noticeYn == 'Y' ? false : true"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <pre>{{memoList}}</pre>
          </v-col>
        </v-row>
        <v-row>
          <template>
            <v-container fluid>
              <v-textarea v-model="newMemo" clearable clear-icon="cancel" label="메모" value></v-textarea>
            </v-container>
          </template>
        </v-row>

        <!-- <v-row>
          <v-col md="2">
            <v-label>알림 수신거부 여부</v-label>
          </v-col>
          <v-col md="2">
            <v-switch
              v-model="form.noticeYn"
              true-value="Y"
              false-value="N"
              class="justify-end mt-0"
              :label="form.noticeYn === 'Y'? '적용': '미적용'"
              hide-details
              dense
              inset
              color="info"
            ></v-switch>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="4" md="4">
            <v-label>알림 수신거부 시간</v-label>
            <v-row justify="end">
              <v-col class="pa-0 mx-4 mt-4 mt-sm-0">
                <v-time-picker
                  class="mt-5"
                  v-model="form.noticeTime"
                  :disabled="form.noticeYn == 'Y' ? false : true"
                  :landscape="true"
                  full-width
                  type="month"
                ></v-time-picker>
              </v-col>
            </v-row>
          </v-col>
        </v-row> -->

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
import ticketSearchService from 'Api/modules/social/ticketSearch.service'
import 'moment/locale/ko'
// moment.locale('ko');

export default {
  props: { data: Object, close: Function },
  name: 'TicketRegform5',
  data () {
    return {
      form: {},
      hourList: [],
      minList: [],
      memoList: '',
      newMemo: ''
    }
  },
  // watch: {
  //     step(newVal) {
  //         if(newVal == '5'){
  //             this.form = this.data;
  //             this.memoList = this.data.memo;
  //         }
  //     }
  // },
  mounted () {
    console.log('step 5 mounted')
    this.setTimeList()
  },
  methods: {
    // 임시
    setTimeList () {
      for (let i = 1; i <= 24; i++) {
        if (i < 10) {
          i = '0' + i
        } else {
          i = String(i)
        }
        this.hourList.push(i)
      }
      for (let i = 0; i <= 59; i++) {
        if (i < 10) {
          i = '0' + i
        } else {
          i = String(i)
        }
        this.minList.push(i)
      }
    },
    submit () {
      // let nowTime = moment().format('YYYY-MM-DD(ddd) HH:mm')+'\r\n';
      // this.form.memo = this.form.memo + '\r\n' + nowTime+this.newMemo + '\r\n';

      const status = this.data.status === 'regist' ? '등록' : '수정'
      // this.validForm(this.$refs.form).then(() => {
      this.$dialog
        .confirm('정보를 ' + status + ' 하시겠습니까?')
        .then(() => {
          ticketSearchService.insertTicketInfo(this.form).then(() => {
            this.$dialog
              .confirm(
                status + '되었습니다.<br><br>다음 페이지로 이동 하시겠습니까?',
                { html: true }
              )
              .then(() => {
                /* this.$emit('update:step', 6);
                            this.$emit('update:data', this.form); */
              })
              .catch(() => {
                this.close()
              })
          })
        })
        .catch(() => {})
      // });
    }
  }
}
</script>

<style scoped>
</style>
