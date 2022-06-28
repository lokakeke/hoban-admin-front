<template>
  <dialog-base :instance="instance" :title="'예약 복사'">
    <v-form ref="form" lazy-validation autocomplate="off">
      <v-row>
        <v-col cols="3" v-if="newItem.memberNo">
          <v-text-field
            v-model="newItem.memberNo"
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
        <v-col cols="3" v-if="newItem.memberNo">
          <v-text-field
            v-model="newItem.memberName"
            label="회원명"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3" v-if="newItem.packageNo">
          <v-text-field
            v-model="newItem.packageNo"
            label="패키지번호"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3" v-if="newItem.packageNo">
          <v-text-field
            v-model="newItem.packageName"
            label="패키지명"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.contractDate"
            label="계약일자"
            disabled
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="newItem.cancelDate"
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
            v-model="newItem.guestTelNo"
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
            v-model="newItem.partnerRsvNo"
            label="업체주문번호"
            required
            outlined
            hide-details
            dense
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" v-if="newItem.packageNo">
          <v-text-field
            v-model="newItem.agentCode"
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
        <v-col cols="3" v-if="newItem.packageNo">
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
          taskType: this.newItem.packageNo ? 'OTA_PKG_API' : 'OTA_ROOM_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              this.newItem.memberNo = params.data.memberNo
              this.newItem.memberName = params.data.memberName
              this.newItem.partnerName = params.data.partnerName
              this.newItem.partnerTelNo = params.data.partnerTelNo
              this.newItem.agentCode = params.data.agentCode
              this.newItem.agentName = params.data.agentCodeName
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
          taskType: this.newItem.packageNo ? 'OTA_PKG_API' : 'OTA_ROOM_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.newItem.agentCode = params.data.agentCode
              this.newItem.agentName = params.data.agentCodeName
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
