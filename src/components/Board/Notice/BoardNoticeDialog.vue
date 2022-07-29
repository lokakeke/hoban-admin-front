<template>
    <dialog-base :title="`공지사항 ${modeText}`" :instance="instance">
        <template v-slot:buttons>
            <v-btn dark text @click="save()">
                <v-icon left>check</v-icon>
                저장
            </v-btn>
        </template>
        <v-form ref="form" lazy-validation v-if="form">
            <v-row v-if="isNew === false">
                <v-col cols="12">
                    <v-label>공지순번</v-label>
                    <v-text-field :value="form.noticeSeq" readonly disabled></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                    <v-label>작성자</v-label>
                    <v-text-field :value="form.createName" readonly disabled></v-text-field>
                </v-col>
                <v-col md="6" cols="12">
                    <v-label>작성일</v-label>
                    <v-text-field :value="form.createDatetime | dateSet" readonly disabled></v-text-field>
                </v-col>
                <v-col md="6" cols="12" v-if="form.modifyName">
                    <v-label>수정자</v-label>
                    <v-text-field :value="form.modifyName" readonly disabled></v-text-field>
                </v-col>
                <v-col md="6" cols="12" v-if="form.modifyDatetime">
                    <v-label>수정일</v-label>
                    <v-text-field :value="form.modifyDatetime | dateSet" readonly disabled></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="3" cols="12">
                    <v-label>공지유형</v-label>
                    <v-combobox
                        v-model="form.noticeTypeName"
                        counter="100"
                        placeholder="공지유형을 입력해 주세요."
                        :items="noticeTypeList"
                        :rules="maxLengthRules(100).concat(emptyRules)"
                    ></v-combobox>
                </v-col>
                <v-col md="9" cols="12">
                    <v-label>제목</v-label>
                    <v-text-field
                        v-model="form.title"
                        counter="500"
                        placeholder="제목을 입력해 주세요."
                        :rules="maxLengthRules(500).concat(emptyRules)"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mb-6">
                <v-col cols="12">
                    <v-label>컨텐츠</v-label>
                    <v-editor v-model="form.contents" required></v-editor>
                </v-col>
            </v-row>
            <v-row class="mb-6">
                <v-col cols="12">
<!--                    FIXME 현재 작업중 (0728)-->
                    <attach
                        v-model="form.attachBag"
                        ref-field-code="boardNotice"
                        attachfile-field-value="file"
                        extensions="gif,jpg,jpeg,png,pdf,xls,xlsx,zip"
                        accept="image/png, image/gif, image/jpeg, application/pdf, application/vnd.ms-excel, application/msexcel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/zip"
                        :limit="3"
                        label="첨부파일"
                        required
                    ></attach>
                    <span class="grey--text">※ gif, jpg, jpeg, png, pdf, xls, xlsx, zip 확장자를 가진 파일만 첨부 가능합니다.</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="6" cols="12">
                    <v-label>
                        긴급여부
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>긴급으로 설정하게되면 긴급 공지사항으로 표시됩니다.</div>
                        </v-tooltip>
                    </v-label>
                    <v-checkbox
                        v-model="form.emergencyYn"
                        label="긴급"
                        hide-details
                        true-value="Y"
                        false-value="N"
                    ></v-checkbox>
                </v-col>
                <v-col md="6" cols="12">
                    <v-label>
                        고정여부
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>고정으로 설정하게되면 목록 상단에 항상 표시됩니다.</div>
                        </v-tooltip>
                    </v-label>
                    <v-checkbox v-model="form.fixYn" label="고정" hide-details true-value="Y"
                                false-value="N"></v-checkbox>
                </v-col>
                <v-col md="6" cols="12">
                    <v-label>
                        사용여부
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>미사용으로 설정하게되면 관리자에게만 공지사항이 노출됩니다.</div>
                        </v-tooltip>
                    </v-label>
                    <v-radio-group v-model="form.useYn" row required>
                        <v-radio label="사용" value="Y"></v-radio>
                        <v-radio label="미사용" value="N"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col md="6" cols="12">
                    <v-label>
                        팝업공지 여부
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>팝업공지로 설정하게되면 접속 시 노출되는 팝업 공지사항으로 노출됩니다.</div>
                        </v-tooltip>
                    </v-label>
                    <v-checkbox v-model="form.popupYn" label="팝업공지" hide-details true-value="Y"
                                false-value="N"></v-checkbox>
                </v-col>
                <v-col md="6" cols="12">
                    <v-label>
                        게시기간
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>게시기간을 설정하게되면 해당 기간에만 노출이 됩니다.</div>
                        </v-tooltip>
                    </v-label>
                    <date-range-picker v-model="postingRangeDate"></date-range-picker>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-label>
                        대상 영업장
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>이 공지사항의 대상이 되는 영업장을 설정합니다.</div>
                        </v-tooltip>
                    </v-label>
                    <select-all-list
                        v-model="form.storeList"
                        :items="storeList"
                        item-value="storeCode"
                        item-text="storeName"
                        label="영업장을 선택해 주세요."
                        multiple
                        clearable
                        deletable-chips
                        chips
                        small-chips
                        single-line
                        return-object
                    />
                </v-col>
                <v-col cols="12">
                    <v-label>
                        대상 파트너
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                            </template>
                            <div>
                                이 공지사항의 노출 대상이 되는 파트너를 설정합니다.
                                <br />대상 파트너로 설정되지 않은 파트너는 이 공지사항을 조회할 수 없습니다.
                            </div>
                        </v-tooltip>
                    </v-label>
                    <select-all-list
                        v-model="form.partnerList"
                        :items="partnerList"
                        item-value="partnerSeq"
                        item-text="partnerName"
                        label="파트너를 선택해 주세요."
                        multiple
                        clearable
                        deletable-chips
                        chips
                        small-chips
                        single-line
                        return-object
                    />
                </v-col>
            </v-row>
            <v-row justify="end" class="mt-5">
                <v-btn outlined rounded color="orange" @click="resetForm()" v-if="writeAuth">
                    <v-icon>refresh</v-icon>
                    원래대로
                </v-btn>
                <v-btn outlined rounded color="info" @click="save()" v-if="writeAuth">
                    <v-icon>check</v-icon>
                    {{ modeText }}
                </v-btn>
                <v-btn outlined rounded color="primary" @click="close()">
                    <v-icon>close</v-icon>
                    닫기
                </v-btn>
            </v-row>
        </v-form>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import SelectAllList from '@/components/Select/SelectAllList.vue'
import boardNoticeService from '@/api/modules/system/boardNotice.service'
import storeService from '@/api/modules/system/store.service'
import partnerAccountService from '@/api/modules/system/authentication/partner/partnerAccount.service'

const DEFAULT_FORM = {
  title: '',
  contents: '',
  noticeTypeName: '',
  emergencyYn: 'N',
  fixYn: 'N',
  useYn: 'Y',
  popupYn: 'N',
  allStoreYn: 'N',
  storeList: [],
  allPartnerYn: 'N',
  partnerList: [],
  attachBag: {
    file: []
  }
}

export default {
  name: 'BoardNoticeDialog',
  extends: DialogBase,
  components: {
    SelectAllList
  },
  data () {
    return {
      // 폼
      form: null,
      // 원본 폼
      originForm: {},
      // 공지사항 유형 목록
      noticeTypeList: [],
      // 영업장 목록
      storeList: [],
      // 파트너 목록
      partnerList: []
    }
  },
  computed: {
    /**
         * 신규 등록 여부
         */
    isNew () {
      let isNew = true
      try {
        isNew = Boolean(this.instance.params.noticeSeq) === false
      } catch {
      }
      return isNew
    },
    /**
         * 등록 or 수정 텍스트
         */
    modeText () {
      return this.isNew === true ? '등록' : '수정'
    },
    /**
         * 게시기간 배열
         */
    postingRangeDate: {
      get () {
        return [this.form.postingStartDate, this.form.postingEndDate]
      },
      set (postingRangeDate) {
        this.form.postingStartDate = postingRangeDate[0]
        this.form.postingEndDate = postingRangeDate[1]
      }
    }
  },
  methods: {
    /**
         * 초기화
         */
    async init () {
      try {
        await Promise.all([
          this.selectBoardNoticeTypeList(),
          this.selectStoreList(),
          this.selectPartnerList()
        ])
        if (this.isNew === true) {
          this.form = _.cloneDeep(DEFAULT_FORM)
        } else {
          const boardNotice = await this.selectBoardNotice()
          if (boardNotice.allStoreYn === 'Y') {
            boardNotice.storeList = _.cloneDeep(this.storeList)
          }
          if (boardNotice.allPartnerYn === 'Y') {
            boardNotice.partnerList = _.cloneDeep(this.partnerList)
          }
          this.form = _.cloneDeep(boardNotice)
        }
        this.originForm = _.cloneDeep(this.form)
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
         * 게시판 > 공지사항 조회
         */
    async selectBoardNotice () {
      const res = await boardNoticeService.selectBoardNotice(
        this.instance.params.noticeSeq
      )
      return res.data
    },
    /**
         * 게시판 > 공지사항 유형 목록 조회
         */
    async selectBoardNoticeTypeList () {
      const noticeTypeList = []
      const res = await boardNoticeService.selectBoardNoticeTypeList()
      res.data.forEach(item => {
        noticeTypeList.push(item.noticeTypeName)
      })
      this.noticeTypeList = noticeTypeList
      return Promise.resolve()
    },
    /**
         * 영업장 조회
         */
    async selectStoreList () {
      const res = await storeService.selectStoreList()
      this.storeList = res.data
      return Promise.resolve()
    },
    /**
         * 파트너 조회
         */
    async selectPartnerList () {
      const res = await partnerAccountService.selectPartnerFullList()
      this.partnerList = res.data
      return Promise.resolve()
    },
    /**
         * 게시판 > 공지사항 저장
         */
    save () {
      this.validForm(this.$refs.form).then(() => {
        const form = _.cloneDeep(this.form)
        // 영업장 편집
        form.allStoreYn = 'N'
        if (form.storeList.length === 0) {
          // 영업장 없음
        } else if (this.storeList.length === form.storeList.length) {
          // 전체 영업장
          form.allStoreYn = 'Y'
          form.storeList = []
        }
        // 파트너 편집
        form.allPartnerYn = 'N'
        if (form.partnerList.length === 0) {
          // 영업장 없음
        } else if (this.partnerList.length === form.partnerList.length) {
          // 전체 영업장
          form.allPartnerYn = 'Y'
          form.partnerList = []
        }
        boardNoticeService[
                    `${this.isNew === true ? 'insert' : 'update'}BoardNotice`
        ](form).then(res => {
          this.$dialog.alert(`${this.modeText}이 완료되었습니다.`)
          this.close()
        })
      })
    },
    /**
         * 입력폼 초기화
         */
    resetForm () {
      this.form = _.cloneDeep(this.originForm)
    }
  }
}
</script>
