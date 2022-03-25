<template>
  <v-form ref="form" lazy-validation v-if="form" :key="key">
    <v-row dense class="mb-3">
      <v-col cols="12">
        <v-label>
          공지순번
          <v-btn
            x-small
            outlined
            rounded
            color="info"
            class="ml-1"
            @click="copyUrl"
          >
            <v-icon x-small class="mr-1">mdi-share-variant</v-icon>SHARE
          </v-btn>
        </v-label>
        <v-text-field :value="form.noticeSeq" readonly disabled></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>작성자</v-label>
        <v-text-field :value="form.crtNm" readonly disabled></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>작성일</v-label>
        <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
      </v-col>
      <v-col md="6" cols="12" v-if="form.updNm">
        <v-label>수정자</v-label>
        <v-text-field :value="form.updNm" readonly disabled></v-text-field>
      </v-col>
      <v-col md="6" cols="12" v-if="form.updDt">
        <v-label>수정일</v-label>
        <v-text-field :value="form.updDt | dateSet" readonly disabled></v-text-field>
      </v-col>
    </v-row>
    <v-card>
      <v-card-subtitle>
        <v-chip color="info">{{ form.noticeTypeNm }}</v-chip>
        <br />
        <h1 class="mt-2">
          <span class="red--text" v-if="form.emrgncYn === 'Y'">[긴급]</span>
          {{ form.title }}
        </h1>
        <div class="mt-2" v-if="form.pstngBgnYmd || form.pstngEndYmd">
          <span>게시기간: {{ form.pstngBgnYmd | date}} ~ {{ form.pstngEndYmd | date }}</span>
        </div>
      </v-card-subtitle>
      <v-editor :content="form.contents" readonly></v-editor>
    </v-card>
    <div class="mb-6">
      <attach
        v-model="form.attachBag"
        ref-fld-cd="boardNotice"
        atfl-fld-val="file"
        extensions="gif,jpg,jpeg,png,pdf,zip"
        accept="image/png, image/gif, image/jpeg, application/pdf, application/zip"
        :limit="3"
        required
        readonly
      ></attach>
    </div>
    <v-row>
      <v-col cols="12" v-if="form.cnfirmList && form.cnfirmList.length > 0">
        <v-label>공지를 확인한 파트너 담당자</v-label>
        <div class="mt-2">
          <v-chip
            class="ma-1"
            v-for="confirm in form.cnfirmList"
            :key="confirm.ptnrNo + confirm.ptnrChrgId"
          >
            {{ confirm.ptnrChrgNm || '?' }}
            <small class="grey--text ml-1">({{ confirm.ptnrNm }})</small>
            <small class="grey--text ml-1">{{ confirm.crtDt | dateSet }}</small>
          </v-chip>
        </div>
        <hr class="mt-1 mb-3" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-if="form.storeList && form.storeList.length > 0">
        <v-label>대상 영업장</v-label>
        <div class="mt-2" v-if="form.allStoreYn !== 'Y'">
          <v-chip
            class="ma-1"
            v-for="store in form.storeList"
            :key="store.storeCd"
          >{{ store.storeNm }}</v-chip>
        </div>
        <div class="mt-2" v-else>
          <!-- 전체 영업장 -->
          <v-chip color="primary">전체 영업장</v-chip>
        </div>
        <hr class="mt-1 mb-3" />
      </v-col>
      <v-col cols="12" v-if="form.ptnrList && form.ptnrList.length > 0">
        <v-label>
          대상 파트너
          <v-btn
            x-small
            outlined
            rounded
            color="info"
            class="ml-1"
            @click="openSendBoardNoticeTalkDialog"
            v-if="writeAuth"
          >
            <v-icon x-small class="mr-1">mdi-android-messages</v-icon>TALK
          </v-btn>
        </v-label>
        <div class="mt-2" v-if="form.allPtnrYn !== 'Y'">
          <v-chip
            class="ma-1"
            v-for="partner in form.ptnrList"
            :key="partner.ptnrNo"
          >{{ partner.ptnrNm }}</v-chip>
        </div>
        <div class="mt-2" v-else>
          <!-- 전체 파트너 -->
          <v-chip color="primary">전체 파트너</v-chip>
        </div>
        <hr class="mt-1 mb-3" />
      </v-col>
    </v-row>
    <v-row justify="end" class="mt-5">
      <v-col cols="6">
        <v-btn outlined rounded color="error" @click="deleteBoardNotice" v-if="writeAuth">
          <v-icon>delete</v-icon>공지사항 삭제하기
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn outlined rounded color="info" @click="openUpdateBoardNoticeDialog" v-if="writeAuth">
          <v-icon>edit</v-icon>공지사항 수정하기
        </v-btn>
        <v-btn outlined rounded color="primary" @click="close" v-if="dialog">
          <v-icon>close</v-icon>닫기
        </v-btn>
        <v-btn outlined rounded color="primary" @click="close" v-else>
          <v-icon>list</v-icon>목록
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import boardNoticeService from "Api/modules/system/boardNotice.service"
import storeService from "Api/modules/system/store.service"
import partnerService from "Api/modules/partner/partner.service"

export default {
  name: 'BoardNoticeViewForm',
  props: {
    /**
     * 공지사항 순번
     */
    noticeSeq: {
      type: [Number, String],
      required: true
    },
    /**
     * Dialog 여부
     */
    dialog: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      // 폼
      form: null,
      // 화면갱신용 key
      key: 0
    }
  },
  computed: {
    /**
     * 마스킹된 작성자명
     */
    maskedCrtNm () {
      if (!this.form || !this.form.crtNm) {
        return ''
      }
      // 가나다 형태의 이름의 가운데를 변환한다.
      const crtNm = this.form.crtNm
      const length = crtNm.length
      const textArr = crtNm.split('')
      let hiddenName = textArr[0]
      for (let i = 0; i < length - 2; i++) {
        hiddenName += '*'
      }
      hiddenName += textArr[length - 1]
      return hiddenName
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        this.form = _.cloneDeep(await this.selectBoardNotice())
        this.key++
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 게시판 > 공지사항 상세 조회
     */
    async selectBoardNotice () {
      const res = await boardNoticeService.selectBoardNotice(
        this.noticeSeq,
        'Y' // readYn
      )
      const boardNotice = res.data
      if (Number(boardNotice.noticeSeq) !== Number(this.noticeSeq)) {
        this.$dialog.alert('존재하지 않는 공지사항입니다.')
        this.close()
      }
      if (boardNotice.allStoreYn === 'Y') {
        boardNotice.storeList = await this.selectStoreList()
      }
      if (boardNotice.allPtnrYn === 'Y') {
        boardNotice.ptnrList = await this.selectPartnerList()
      }
      return boardNotice
    },
    /**
     * 영업장 조회
     */
    async selectStoreList () {
      const res = await storeService.selectStoreSimpleList()
      return Promise.resolve(res.data)
    },
    /**
     * 파트너 조회
     */
    async selectPartnerList () {
      const res = await partnerService.selectPartnerFullList()
      return Promise.resolve(res.data)
    },
    /**
     * 게시판 > 공지사항 알림톡 발송 팝업 열기
     */
    openSendBoardNoticeTalkDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Notice/BoardNoticeTalkSendDialog',
        params: {
          notice: this.form
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true
        }
      })
    },
    /**
     * 게시판 > 공지사항 수정 팝업 열기
     */
    openUpdateBoardNoticeDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Notice/BoardNoticeManagementDialog',
        params: {
          noticeSeq: this.form.noticeSeq
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.init()
          }
        }
      })
    },
    /**
     * 게시판 > 공지사항 삭제
     */
    async deleteBoardNotice () {
      try {
        await this.$dialog.confirm('이 공지사항을 삭제하시겠습니까?')
        await boardNoticeService.deleteBoardNotice(this.form.noticeSeq)
        await this.$dialog.alert('공지사항이 삭제되었습니다.')
        this.close()
      } catch {
        // 삭제 안함
      }
    },
    /**
     * 닫기
     */
    close (params) {
      this.$emit('close', params)
    },
    /**
     * URL 복사
     */
    copyUrl () {
      const url = `${location.origin}/board/boardNotice/${this.form.noticeSeq}`
      this.$copyText(url)
      this.$dialog.alert('URL이 클립보드로 복사되었습니다. 공유하실 곳에 붙여넣으세요.')
    }
  }
}
</script>
