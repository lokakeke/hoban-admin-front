<template>
  <dialog-base :title="`답변 ${modeText}`" :instance="instance" v-if="!isPartner">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-row>
      <v-col md="6" cols="12">
        <!-- 질문 내용 -->
        <h3 class="primary--text">질문</h3>
        <v-row>
          <v-col md="4" cols="12">
            <v-label>질문순번</v-label>
            <v-text-field :value="question.qstnSeq" readonly disabled></v-text-field>
          </v-col>
          <v-col md="4" cols="12">
            <v-label>작성자</v-label>
            <v-text-field :value="`${question.ptnrChrgNm || '?'} (${question.ptnrNm})`" readonly disabled></v-text-field>
          </v-col>
          <v-col md="4" cols="12">
            <v-label>작성일</v-label>
            <v-text-field :value="question.crtDt | dateSet" readonly disabled></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h1>
              {{ question.title }}
            </h1>
          </v-col>
        </v-row>
        <v-card>
          <div class="ql-editor" v-html="question.contents"></div>
        </v-card>
      </v-col>
      <v-col md="6" cols="12">
        <!-- 답변 내용 -->
        <h3 class="primary--text">답변</h3>
        <v-form ref="form" lazy-validation v-if="form">
          <v-row v-if="isNew === false">
            <v-col md="4" cols="12">
              <v-label>답변순번</v-label>
              <v-text-field :value="form.qstnSeq" readonly disabled></v-text-field>
            </v-col>
            <v-col md="4" cols="12">
              <v-label>답변자</v-label>
              <v-text-field :value="form.crtNm" readonly disabled></v-text-field>
            </v-col>
            <v-col md="4" cols="12">
              <v-label>답변일</v-label>
              <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-6">
            <v-col cols="12">
              <v-label>컨텐츠</v-label>
              <v-editor v-model="form.contents" required></v-editor>
            </v-col>
          </v-row>
          <v-row justify="end" class="mt-5">
            <v-btn outlined rounded color="orange" @click="resetForm()" v-if="writeAuth">
              <v-icon>refresh</v-icon>원래대로
            </v-btn>
            <v-btn outlined rounded color="info" @click="save()" v-if="writeAuth">
              <v-icon>check</v-icon>
              {{ modeText }}
            </v-btn>
            <v-btn outlined rounded color="primary" @click="close()">
              <v-icon>close</v-icon>닫기
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import boardQnaService from "Api/modules/system/boardQna.service"

const DEFAULT_FORM = {
  contents: ''
}

export default {
  name: 'BoardAnswerManagementService',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null,
      // 원본 폼
      orgForm: {}
    }
  },
  computed: {
    /**
     * 질문 객체
     */
    question () {
      return this.instance.params.question
    },
    /**
     * 신규 등록 여부
     */
    isNew () {
      let isNew = true
      try {
        isNew = Boolean(this.instance.params.qstnSeq) === false || Boolean(this.instance.params.answSeq) === false
      } catch {}
      return isNew
    },
    /**
     * 등록 or 수정 텍스트
     */
    modeText () {
      return this.isNew === true ? '등록' : '수정'
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        if (this.isNew === true) {
          this.form = _.cloneDeep(DEFAULT_FORM)
          this.form.qstnSeq = this.instance.params.qstnSeq
        } else {
          const boardAnswer = await this.selectBoardAnswer()
          this.form = _.cloneDeep(boardAnswer)
        }
        this.orgForm = _.cloneDeep(this.form)
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 게시판 > 답변 조회
     */
    async selectBoardAnswer () {
      const res = await boardQnaService.selectBoardAnswer(
        this.instance.params.qstnSeq,
        this.instance.params.answSeq
      )
      return res.data
    },
    /**
     * 게시판 > 답변 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        const form = _.cloneDeep(this.form)
        boardQnaService[
          `${this.isNew === true ? 'insert' : 'update'}BoardAnswer`
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
      this.form = _.cloneDeep(this.orgForm)
    }
  }
}
</script>
