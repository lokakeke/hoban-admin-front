<template>
  <dialog-base :instance="instance" :title="'주소 불러오기'">
    <template v-slot:buttons>
      <v-btn dark text @click="addrModalOpen()">
        <v-icon left>add</v-icon>신규등록
      </v-btn>
    </template>
    <v-card-text class="pt-2" style="height: 700px;" v-if="form">
      <v-row>
        <v-col cols="11" draggable="true" max-height="400" class="pa-5 pt-3 mb-5 mx-auto">
          <v-expansion-panels accordion>
            <v-expansion-panel v-for="info in form" :key="info.commCdNo">
              <v-expansion-panel-header class="ma-0 pa-0 pl-5 pr-5">
                <v-row>
                  <v-col cols="5" class="mt-2 text-center">
                    <v-icon>place</v-icon>
                    {{ info.commCdNm }}
                  </v-col>
                  <v-col cols="7" class="text-center">
                    <v-btn outlined rounded color="info" class="ma-1" small @click="chooseAddr(info)">
                      <v-icon>check</v-icon>선택
                    </v-btn>
                    <v-btn outlined rounded color="info" class="ma-1" small @click="addrModalOpen(info)">
                      <v-icon>edit</v-icon>수정
                    </v-btn>
                    <v-btn outlined rounded color="primary" class="ma-1" small @click="deleteAddr(info)">
                      <v-icon>delete</v-icon>삭제
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="text-center">
                <v-col cols="10" class="mx-auto text-left">
                  <li class="ma-2">
                    <v-icon small>check_box</v-icon>
                    <span class="font-weight-bold">지번주소: </span>{{ info.item01 }}
                  </li>
                  <li class="ma-2">
                    <v-icon small>check_box</v-icon>
                    <span class="font-weight-bold">도로명주소: </span>{{ info.item02 }}
                  </li>
                  <li class="ma-2">
                    <v-icon small>check_box</v-icon>
                    <span class="font-weight-bold">상세주소: </span>{{ info.commCdDesc ? info.commCdDesc : '(없음)' }}
                  </li>
                  <li class="ma-2 pb-5">
                    <v-chip class="ml-1 mr-2 float-left" small>위도 : {{ info.item03 }}</v-chip>
                    <v-chip class="mr-2 float-left" small>경도 : {{ info.item04 }}</v-chip>
                    <v-chip class="mr-2 float-left" small>줌레벨 : {{ info.item05 }}</v-chip>
                  </li>
                </v-col>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-text>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import commonCodeService from 'Api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'BusinessAddressForm',
  data () {
    return {
      form: null
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.inits()
  },
  methods: {
    inits () {
      /**
       * 주소 불러오기 (사용여부 y로 필터링)
       */
      commonCodeService.selectCommonCode('STORE_ADDR', true).then(res => {
        const result = res.data.filter(item => {
          return item.useYn === 'Y'
        })
        this.form = result
      })
    },
    /**
     * 주소 수정, 등록 팝업 열기
     */
    addrModalOpen (info) {
      if (!info) {
        info = {
          parentCommCd: 'STORE_ADDR',
          useYn: 'Y',
          commCd: '',
          commCdNm: '',
          item01: '',
          item02: '',
          item03: '',
          item04: '',
          item05: '',
          commCdDesc: ''
        }
      }
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Business/BusinessAddressModal',
          params: {
            addrModal: info
          },
          options: {
            fullscreen: false,
            persistent: true,
            width: 600,
            scrollable: true,
            /**
             * 새로 추가된 주소 추가하기
             */
            closeCallback: (params) => {
              if (params && params.data) {
                // 수정 사항이 있을 시만 reload
                this.inits()
              }
            }
          }
        })
      })
    },
    /**
     * 주소 선택
     */
    chooseAddr (info) {
      if (info && (!info.item01 || !info.item02 || !info.item03 || !info.item04 || !info.item05)) {
        this.$dialog.alert('필수 정보가 없습니다. 수정 후 선택해주세요.')
      } else {
        this.close({ data: info })
      }
    },
    /**
     * 주소 삭제
     */
    deleteAddr (info) {
      this.$dialog.confirm('주소를 삭제하시겠습니까?').then(() => {
        commonCodeService.deleteCommonCode(info.commCdNo).then(res => {
          this.$dialog.alert('삭제되었습니다.')
          this.inits()
        })
      }).catch(() => {})
    }
  }
}
</script>
