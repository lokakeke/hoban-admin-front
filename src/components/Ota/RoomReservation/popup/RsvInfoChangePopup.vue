<template>
  <dialog-base :instance="instance" :title="'예약 정보 변경'">
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="4" v-if="origin.memNo">
          <v-text-field
            v-model="origin.memName"
            label="회원명"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4" v-if="origin.pkgName">
          <v-text-field
            v-model="origin.pkgName"
            label="패키지명"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="origin.storeName"
            label="영업장명"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="origin.rmTypeName"
            label="객실유형명"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="origin.chainRsvNo"
            label="업체예약번호"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="origin.guestName"
            label="이용자명"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="origin.smsPhone"
            label="이용자연락처"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
           <v-text-field
            v-model="newInfo.rmTypeCode"
            label="객실유형"
            outlined
            hide-details
            dense
            clearable
            readonly
            :rules="emptyRules"
            @click="openPopup()"
          >
            <template v-slot:append>
                <v-btn icon small color="primary" @click="openPopup()">
                  <v-icon>search</v-icon>
                </v-btn>
            </template>
           </v-text-field>
        </v-col>
        <v-col cols="4">
           <v-text-field
            v-model="newInfo.rmTypeName"
            label="객실유형명"
            outlined
            hide-details
            dense
            clearable
            disabled
            readonly/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="newInfo.chainRsvNo"
            label="업체예약번호"
            outlined
            hide-details
            dense
            clearable
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="newInfo.guestName"
            label="이용자명"
            outlined
            hide-details
            dense
            clearable
            :rules="emptyRules"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="newInfo.smsPhone"
            label="이용자연락처"
            outlined
            hide-details
            dense
            clearable
            :rules="emptyRules"
            v-mask="['###-####-####', '###-###-####']"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="blue" @click="copy">고객정보 복사</v-btn>
          <v-btn outlined rounded color="blue" @click="init">초기화</v-btn>
          <v-btn outlined rounded color="blue" @click="save">저장(F10)</v-btn>
          <v-btn outlined rounded color="primary" @click="close()">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'RsvInfoChangePopup',
  data () {
    return {
      origin: {}, // 기존 정보
      newInfo: [] // 새로운 정보
    }
  },
  mounted () {
    this.origin = _.cloneDeep(this.instance.params.origin)
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F10',
          action: this.save
        }
      ]
    })
  },
  methods: {
    save () {
      if (this.newInfo.rmTypeCode === this.origin.rmTypeCode) {
        this.$dialog.alert('같은 객실유형으로 변경할 수 없습니다.')
        return
      }

      this.validForm(this.$refs.form).then(() => {
        this.close({ data: this.newInfo })
      })
    },
    /**
     * 고객정보 복사
     */
    copy () {
      const res = {}
      res.chainRsvNo = this.origin.chainRsvNo
      res.guestName = this.origin.guestName
      res.smsPhone = this.origin.smsPhone
      res.rmTypeName = this.newInfo.rmTypeName
      res.rmTypeCode = this.newInfo.rmTypeCode
      this.newInfo = res
    },
    /**
     * 오픈 팝업 ( 객실 or 패키지 )
     */
    openPopup () {
      if (this.origin.roomType === 'OTA_ROOM_API') {
        const rmTypeItems = {}
        rmTypeItems.storeCode = this.origin.storeCode
        this.openRmTypePopup(rmTypeItems)
      } else if (this.origin.roomType === 'OTA_PKG_API') {
        const rmTypeItems = {}
        rmTypeItems.storeCode = this.origin.storeCode
        rmTypeItems.pkgNo = this.origin.pkgNo
        this.openRmTypePopup(rmTypeItems)
      } else {
        this.$dialog.alert('객실/패키지 선택 값은 필수값입니다.')
      }
    },
    /**
     * 객실유형 조회 팝업 오픈
     */
    openRmTypePopup (items) {
      if (this.origin.storeCode && this.origin.rmTypeCode) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/RmTypePopup',
          params: {
            item: items
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800,
            closeCallback: (params) => {
              if (params && params.data) {
                this.mapRmTypeInfoResult(params.data) // 결과값을 화면에 매핑
              }
            }
          }
        })
      } else {
        this.$dialog.alert('영업장코드와 객실유형코드가 없습니다.')
      }
    },
    /**
     * 객실 유형 정보 조회 결과값 매핑
     */
    mapRmTypeInfoResult (result) {
      this.$set(this.newInfo, 'rmTypeCode', result.rmTypeCode)
      this.$set(this.newInfo, 'rmTypeName', result.rmTypeName)
    },
    /**
     * 초기화
     */
    init () {
      this.newInfo = []
    }
  }
}
</script>
