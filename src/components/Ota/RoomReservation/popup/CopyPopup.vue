<template>
  <dialog-base :instance="instance" :title="'예약 복사'">
    <v-form ref="form" lazy-validation autocomplate="off">
      <v-row>
        <v-col cols="3" v-if="newItem.memNo">
          <v-text-field
            v-model="newItem.memNo"
            label="회원번호"
            outlined
            hide-details
            dense
            @keypress.enter="openPartnerInfo"
          >
            <template v-slot:append>
              <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="3" v-if="newItem.memNo">
          <v-text-field
            v-model="newItem.memName"
            label="회원명"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3" v-if="newItem.pkgNo">
          <v-text-field
            v-model="newItem.pkgNo"
            label="패키지번호"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3" v-if="newItem.pkgNo">
          <v-text-field
            v-model="newItem.pkgName"
            label="패키지명"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.cntrctYmd"
            label="계약일자"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.cancelYmd"
            label="해약일자"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.guestName"
            label="이용자명"
            required
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.smsPhone"
            label="이용자연락처"
            required
            outlined
            hide-details
            dense
            v-mask="['###-####-####', '###-###-####']"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.chainRsvNo"
            label="업체주문번호"
            required
            outlined
            hide-details
            dense
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" v-if="newItem.pkgNo">
          <v-text-field
            v-model="newItem.agentCd"
            label="Agent코드"
            outlined
            hide-details
            dense
            @keypress.enter="openAgentPopup"
          >
            <template v-slot:append>
              <v-btn icon small color="primary" tabindex="-1" @click="openAgentPopup">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="3" v-if="newItem.pkgNo">
          <v-text-field
            v-model="newItem.agentName"
            label="Agent명"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="blue" @click="create">생성(F10)</v-btn>
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'CopyPopup',
  data () {
    return {
      newItem: {}
    }
  },
  mounted () {
    this.newItem = _.cloneDeep(this.instance.params.item)
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F10',
          action: this.create
        }
      ]
    })
  },
  methods: {
    /**
     * 회원번호/명 조회
     */
    openPartnerInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: this.newItem.pkgNo ? 'OTA_PKG_API' : 'OTA_ROOM_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              this.newItem.memNo = params.data.memNo
              this.newItem.memName = params.data.memName
              this.newItem.rsvGuestlnm = params.data.companyName
              this.newItem.rsvGuestTelNo = params.data.capTelNo
              this.newItem.agentCd = params.data.agentCd
              this.newItem.agentName = params.data.agentCdName
            }
          }
        }
      })
    },
    /**
     * Agent코드 검색창 오픈
     */
    openAgentPopup () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: this.newItem.pkgNo ? 'OTA_PKG_API' : 'OTA_ROOM_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.newItem.agentCd = params.data.agentCd
              this.newItem.agentName = params.data.agentCdName
            }
          }
        }
      })
    },
    /**
     * 신규 예약 생성
     */
    create () {
      this.close({ data: this.newItem })
    }
  }
}
</script>
