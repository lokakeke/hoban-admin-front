<template>
  <dialog-base :title="`질문 ${modeText}`" :instance="instance">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form">
      <v-row v-if="isNew === false">
        <v-col md="4" cols="12">
          <v-label>질문순번</v-label>
          <v-text-field :value="form.qstnSeq" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-label>작성자</v-label>
          <v-text-field :value="`${form.ptnrChrgNm || '?'} (${form.ptnrNm})`" readonly disabled></v-text-field>
        </v-col>
        <v-col md="4" cols="12">
          <v-label>작성일</v-label>
          <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
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
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import boardQnaService from 'Api/modules/system/boardQna.service'

const DEFAULT_FORM = {
  title: '',
  contents: ''
}

export default {
  name: 'BoardQuestionManagementService',
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
     * 신규 등록 여부
     */
    isNew () {
      let isNew = true
      try {
        isNew = Boolean(this.instance.params.qstnSeq) === false
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
        } else {
          const boardQuestion = await this.selectBoardQuestion()
          this.form = _.cloneDeep(boardQuestion)
        }
        this.orgForm = _.cloneDeep(this.form)
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 게시판 > 질문 조회
     */
    async selectBoardQuestion () {
      const res = await boardQnaService.selectBoardQuestion(
        this.instance.params.qstnSeq
      )
      return res.data
    },
    /**
     * 게시판 > 질문 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        const form = _.cloneDeep(this.form)
        boardQnaService[
          `${this.isNew === true ? 'insert' : 'update'}BoardQuestion`
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
