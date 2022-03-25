<template>
  <dialog-base :instance="instance" :title="''">
    <div v-if="!noticeList || noticeList.length === 0" class="title text-center font-weight-bold py-10">신규 공지사항이 없습니다.</div>
    <v-row v-else no-gutters class="pa-1" style="max-height: 580px;" >
      <v-col cols="3" class="border-bottom-bold" style="max-height: 580px; overflow: auto;">
        <v-tabs
          v-model="tabIndex"
          color="info"
          vertical
          slider-size="3"
          center-active
          active-class="tab-active">
          <v-tab v-for="notice in noticeList" :key="notice.noticeSeq" tabindex="-1" style="font-size: 13px" class="primary--text font-weight-bold">
            {{notice.title | textTruncate(19)}}
            <v-icon color="white" large style="position: absolute; right: -16px">arrow_left</v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="9" class="border-left-bold border-bottom-bold">
        <v-tabs-items v-model="tabIndex">
          <v-tab-item v-for="notice in noticeList" :key="notice.noticeSeq">
            <v-card flat>
              <v-card-subtitle class="py-3">
                <h3 class="my-0">
                  <v-chip color="info" class="mr-1" small>{{ notice.noticeTypeNm }}</v-chip>
                  <span class="red--text" v-if="notice.emrgncYn === 'Y'">[긴급]</span>
                  {{ notice.title }}
                </h3>
                <div class="mt-2" v-if="notice.pstngBgnYmd || notice.pstngEndYmd">
                  <span>게시기간: {{ notice.pstngBgnYmd | date}} ~ {{ notice.pstngEndYmd | date }}</span>
                </div>
                <attach
                  v-model="notice.attachBag"
                  ref-fld-cd="boardNotice"
                  atfl-fld-val="file"
                  extensions="gif,jpg,jpeg,png,pdf,zip"
                  accept="image/png, image/gif, image/jpeg, application/pdf, application/zip"
                  :limit="3"
                  readonly
                  hide-message
                ></attach>
              </v-card-subtitle>
              <v-card-text style="max-height: 300px; overflow: auto;" class="border-top-bold">
                <v-editor :content="notice.contents" readonly></v-editor>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <template v-slot:actions>
      <v-row justify="space-between" no-gutters>
        <v-btn text @click="close"><v-icon left>close</v-icon>닫기 (Esc)</v-btn>
        <v-checkbox @click="hidePopUp" label="오늘 하루 이 창 열지 않기 (F4)" hide-details class="mt-0 pr-3"></v-checkbox>
      </v-row>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'NoticePopUp',
  data () {
    return {
      noticeList: [],
      /**
       * 탭 선택 인덱스
       */
      tabIndex: null
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'F4',
        action: this.hidePopUp
      }]
    })
    this.noticeList = this.instance.params.noticeList
  },
  methods: {
    async hidePopUp () {
      await this.$store.dispatch('settings/setPopUpCheckDate')
      this.close()
    }
  }
}
</script>

<style scoped>
  .tab-active {
    background-color: #009688;
    color: white!important;
    font-weight: bold;
    font-size: 13px;
  }
  .border-bottom-bold {
    border-bottom: 1px #009688 solid;
  }
  .border-left-bold {
    border-left: 2px #009688 solid;
  }
  .border-top-bold {
    border-top: 1px #009688 solid;
  }
</style>
