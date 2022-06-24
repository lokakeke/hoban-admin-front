<template>
  <div>
    <v-row>
      <app-card :heading="'예약 제한 관리'" col-classes="col-sm-12 col-md-6" auto-height>
        <template>
          <v-row align="center" justify="center">
            <v-col class="pt-0"></v-col>
            <v-col class="pt-0">
              <v-text-field v-model="filterText" hide-details outlined small dense append-icon="mdi-magnify" label="Search"/>
            </v-col>
          </v-row>
        </template>
        <template v-if="exceptList && exceptList.length > 0">
          <v-list dense>
              <transition-group type="transition" name="flip-list">
                <v-list-item
                  v-for="except of exceptList"
                  :key="except.exceptSeq"
                  @click="viewChildren(except)"
                  class="menu-list"
                  :class="except.active? 'active' : ''"
                >
                  <v-list-item-action>
                    <v-icon>edit</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title :class="except.useYn === 'N'? 'strike' : ''">{{ except.exceptName }} ({{ except.startDatetime | dateSet }} ~ {{ except.endDatetime | dateSet }})</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </transition-group>
          </v-list>
        </template>
        <v-row v-else align="center" justify="center">예약 제한 정보가 없습니다.</v-row>
        <v-divider class="my-4"></v-divider>
        <template v-slot:action>
            <v-row align="end" justify="center">
                <v-btn outlined rounded small color="orange" @click="sort(exceptList)" v-if="!filterText">
                    <v-icon small class="mr-1">refresh</v-icon>원래대로
                </v-btn>
                <v-btn outlined rounded small color="primary" @click="addExcept()">
                    <v-icon small>add</v-icon>예약 제한 메뉴 추가
                </v-btn>
            </v-row>
        </template>
      </app-card>

      <app-card :heading="'상세 정보'" col-classes="col-sm-12 col-md-6">
        <v-row v-if="!detail.exceptSeq" align="center" justify="center">관리할 예약 제한을 선택해 주세요.</v-row>
        <template v-else>
          <v-form ref="detail" lazy-validation>
            <v-label>예약 제한 이름</v-label>
            <v-text-field v-model="detail.exceptName" :rules="emptyRules" label required class="pt-0"/>
              <v-label>예약 제한 서비스</v-label>
              <v-text-field v-model="detail.exceptService" :rules="emptyRules" label required class="pt-0"/>
            <v-row>
              <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-label>시작일</v-label>
                <date-picker v-model="detail.tempStartYmd" :min="'1970-01-01'" clearable required></date-picker>
              </v-col>

              <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-label>시간</v-label>
                <v-select
                  :items="reservationHour"
                  v-model="detail.startHour"
                />
              </v-col>
              <v-col class="pl-md-3 pl-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-label>분</v-label>
                <v-select
                  :items="reservationMinute"
                  v-model="detail.startMin"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-label>종료일</v-label>
                <date-picker v-model="detail.tempEndYmd" :min="dataRangeEnd" clearable required></date-picker>
              </v-col>

              <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-label>시간</v-label>
                <v-select
                  :items="reservationHour"
                  v-model="detail.endHour"
                />
              </v-col>
              <v-col class="pl-md-3 pl-lg-3" cols="12" lg="4" md="4" sm="12">
                <v-label>분</v-label>
                <v-select
                  :items="reservationMinute"
                  v-model="detail.endMin"
                />
              </v-col>
            </v-row>

            <v-label>메모
              <common-tooltip :type="'info'" :position="'right'" :text="'파트너사에서 예약 시 예약 제한과 함께 노출될 메시지 입니다.'" />
            </v-label>
            <v-textarea
              outlined
              color="deep-purple"
              v-model="detail.memo"
              label
              class="pt-0"
            ></v-textarea>
            <v-checkbox
              class="mt-0"
              v-model="detail.useYn"
              label="사용여부(미사용 시 알림은 발송되지 않습니다.)"
              required
              true-value="Y"
              false-value="N"
            ></v-checkbox>
          </v-form>
        </template>
        <v-divider v-if="detail.exceptSeq" class="my-4"></v-divider>
        <v-row align="end" justify="center" v-if="detail.exceptSeq">
          <v-btn outlined rounded small color="orange" @click="reload()">
            <v-icon small>refresh</v-icon>원래대로
          </v-btn>
          <v-btn outlined rounded small color="info" @click="modify()">
            <v-icon small>edit</v-icon>수정
          </v-btn>
        </v-row>
      </app-card>
    </v-row>

    <v-navigation-drawer fixed v-model="dialog" :width="600" right app stateless temporary>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>예약 제한 입력</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-form ref="form" lazy-validation>
          <v-label>예약 제한 이름</v-label>
          <v-text-field v-model="form.exceptName" :rules="emptyRules" label required class="pt-0"></v-text-field>
            <v-label>예약 제한 서비스</v-label>
            <v-select v-model="form.exceptService" :items="this.serviceList" :item-value="'commonCode'"
                            :item-text="'commonCodeName'" :rules="emptyRules" label required class="pt-0">
            </v-select>
          <v-row>
            <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
              <v-label>시작일</v-label>
              <date-picker v-model="form.tempStartYmd" :min="toDay" clearable required></date-picker>
            </v-col>

            <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
              <v-label>시간</v-label>
              <v-select
                :items="reservationHour"
                v-model="form.startHour"
              />
            </v-col>
            <v-col class="pl-md-3 pl-lg-3" cols="12" lg="4" md="4" sm="12">
              <v-label>분</v-label>
              <v-select
                :items="reservationMinute"
                v-model="form.startMin"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
              <v-label>종료일</v-label>
              <date-picker v-model="form.tempEndYmd" :min="minBgnYmd" clearable required></date-picker>
            </v-col>

            <v-col class="pr-md-3 pr-lg-3" cols="12" lg="4" md="4" sm="12">
              <v-label>시간</v-label>
              <v-select
                :items="reservationHour"
                v-model="form.endHour"
              />
            </v-col>
            <v-col class="pl-md-3 pl-lg-3" cols="12" lg="4" md="4" sm="12">
              <v-label>분</v-label>
              <v-select
                :items="reservationMinute"
                v-model="form.endMin"
              />
            </v-col>
          </v-row>

          <v-label>메모
            <common-tooltip :type="'info'" :position="'right'" :text="'파트너사에서 예약 시 예약 제한과 함께 노출될 메시지 입니다.'" />
          </v-label>
          <v-textarea
            outlined
            color="deep-purple"
            v-model="form.memo"
            label
          ></v-textarea>
          <v-checkbox
            class="mt-0"
            v-model="form.useYn"
            label="사용여부"
            required
            true-value="Y"
            false-value="N"
          ></v-checkbox>

          <v-row justify="center">
            <v-btn outlined rounded small color="orange" @click="reset()">
              <v-icon small>refresh</v-icon>원래대로
            </v-btn>
            <v-btn outlined rounded small color="info" @click="insert()">
              <v-icon small>check</v-icon>입력
            </v-btn>
            <v-btn outlined rounded small color="primary" @click="dialog = false">
              <v-icon small>close</v-icon>닫기
            </v-btn>
          </v-row>
        </v-form>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import reservationExceptService from '@/api/modules/system/reservationExcept.service'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  name: 'reservationExcept',
  components: {
    CommonTooltip
  },
  data () {
    return {
      exceptList: [],
      detail: {},
      detailClone: {},
      dialog: false,
      form: {},
      filterText: '',
      serviceList: [],
      reservationHour: [],
      reservationMinute: [],
      serviceTypeList: [],
      dataRangeStart: '1970-01-01',
      dataRangeEnd: '1970-01-01'
    }
  },
  computed: {
    filteredList () {
      if (this.exceptList && this.exceptList.length > 0) {
        if (this.filterText) {
          return this.exceptList.filter(data => data.exceptName.indexOf(this.filterText) !== -1)
        } else {
          return this.exceptList
        }
      } else {
        return []
      }
    },
    toDay () {
      return moment().format('YYYY-MM-DD')
    },
    minBgnYmd () {
      console.log('MINMIN')
      return moment(this.form.tempStartYmd).format('YYYY-MM-DD')
      // return '1950-01-01'
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.search()
    this.getReservationTime()
    this.getServiceTypeList()
  },
  methods: {
    getServiceTypeList () {
      commonCodeService.selectCommonCode('EXCEPT_SERVICE').then(res => {
        this.serviceList = res.data
      })
    },
    search (exceptSeq) {
      reservationExceptService.selectList({}).then(res => {
        this.exceptList = res.data
        if (exceptSeq) {
          for (const row of this.exceptList) {
            if (row.exceptSeq === exceptSeq) {
              this.viewChildren(row)
            }
          }
        }
      })
    },
    addExcept () {
      this.form = { useYn: 'Y' }
      this.dialog = !this.dialog
    },
    viewChildren (except) {
      for (const row of this.exceptList) {
        row.active = row.exceptSeq === except.exceptSeq
      }
      this.detail = _.cloneDeep(except)
      this.detailClone = _.cloneDeep(except)
      // this.form = this.detail
    },
    reload () {
      this.detail = _.cloneDeep(this.detailClone)
    },
    modify () {
      this.validForm(this.$refs.detail).then(() => {
        this.dataRangeEnd = this.detail.tempStartYmd
        this.$dialog
          .confirm('예약 제외 내용을 수정하시겠습니까?')
          .then(() => {
            this.detail.startDatetime = moment(moment(this.detail.tempStartYmd).format('YYYY-MM-DD') + ` ${this.detail.startHour}:${this.detail.startMin}:00`).format('YYYY-MM-DD HH:mm:ss')
            this.detail.endDatetime = moment(moment(this.detail.tempEndYmd).format('YYYY-MM-DD') + ` ${this.detail.endHour}:${this.detail.endMin}:00`).format('YYYY-MM-DD HH:mm:ss')

            console.log('this.detail.startDatetime', this.detail.startDatetime)
            console.log('this.detail.endDatetime', this.detail.endDatetime)

            reservationExceptService.update(this.detail).then(res => {
              this.$dialog.alert('수정되었습니다.')
              this.search(this.detail.exceptSeq)
            })
          })
          .catch(() => {})
      })
    },
    insert () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog
          .confirm('예약 제외 내용을 입력하시겠습니까?')
          .then(() => {
            this.form.startDatetime = moment(moment(this.form.tempStartYmd).format('YYYY-MM-DD') + ` ${this.form.startHour}:${this.form.startMin}:00`).format('YYYY-MM-DD HH:mm:ss')
            this.form.endDatetime = moment(moment(this.form.tempEndYmd).format('YYYY-MM-DD') + ` ${this.form.endHour}:${this.form.endMin}:00`).format('YYYY-MM-DD HH:mm:ss')
            reservationExceptService.insert(this.form).then(res => {
              this.$dialog.alert('예약 제한이 추가되었습니다.')
              this.search(this.detail.exceptSeq)
              this.dialog = false
            })
          })
          .catch(() => {})
      })
    },
    getReservationTime () {
      for (let i = 0; i < 24; i++) {
        this.reservationHour.push(i)
      }

      for (let i = 0; i < 60; i++) {
        this.reservationMinute.push(i)
      }
    },
    reset () {
      this.form = {}
      this.$refs.form.resetValidation()
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
