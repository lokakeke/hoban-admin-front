<template>
  <dialog-base :title="`질문 조회`" :instance="instance">
    <template v-slot:buttons v-if="writeAuth && isPartner">
      <v-btn dark text @click="openUpdateBoardQuestionDialog">
        <v-icon left>edit</v-icon>수정
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form" :key="key">
      <v-row dense class="mb-3">
        <v-col cols="12">
          <v-label>질문순번</v-label>
          <v-text-field :value="form.qstnSeq" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>작성자</v-label>
          <v-text-field :value="`${form.ptnrChrgName || '?'} (${form.ptnrName})`" readonly disabled></v-text-field>
        </v-col>
        <v-col md="6" cols="12">
          <v-label>작성일</v-label>
          <v-text-field :value="form.crtDt | dateSet" readonly disabled></v-text-field>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title>
          <v-icon color="error" class="mr-2">mdi-message-alert</v-icon>
          {{ form.title }}
        </v-card-title>
        <v-editor :content="form.contents" readonly></v-editor>
      </v-card>
      <!-- 답변 영역 -->
      <template v-if="answList">
        <v-card class="mt-6" v-for="answer in answList" :key="answer.answSeq">
          <v-card-title>
            <v-icon color="info" class="mr-2">mdi-message-reply</v-icon>
            {{ answer.answName }}님이 {{ answer.crtDt | dateSet }}에 등록한 답변입니다.
          </v-card-title>
          <v-card-text>
            <v-editor :content="answer.contents" readonly></v-editor>
          </v-card-text>
          <v-card-actions v-if="writeAuth && !isPartner">
            <v-spacer></v-spacer>
            <v-btn small rounded color="info" @click="openUpdateBoardAnswerDialog(answer)">
              <v-icon small>edit</v-icon>답변 수정하기
            </v-btn>
            <v-btn small rounded color="error" @click="deleteBoardAnswer(answer)">
              <v-icon small>delete</v-icon>답변 삭제하기
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card class="mt-3 pa-5 text-center grey lighten-3" v-if="answList.length === 0">
          <v-icon color="grey" x-large>inbox</v-icon>
          <div class="subtitle-1 grey--text">등록된 답변이 없습니다.</div>
        </v-card>
      </template>
      <v-row justify="end" class="mt-5">
        <v-col cols="6">
          <v-btn outlined rounded color="error" @click="deleteBoardQuestion" v-if="writeAuth">
            <v-icon>delete</v-icon>질문 삭제하기
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn
            outlined
            rounded
            color="info"
            @click="openUpdateBoardQuestionDialog"
            v-if="writeAuth && isPartner"
          >
            <v-icon>edit</v-icon>질문 수정하기
          </v-btn>
          <v-btn
            outlined
            rounded
            color="info"
            @click="openCreateBoardAnswerDialog"
            v-if="writeAuth && !isPartner"
          >
            <v-icon>edit</v-icon>
            답변 {{ answList && answList.length > 0 ? '추가로 ' : '' }}등록하기
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import boardQnaService from '@/api/modules/system/boardQna.service'

export default {
  name: 'BoardQuestionService',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null,
      // 답변 목록
      answList: null,
      // 화면갱신용 key
      key: 0
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        this.form = _.cloneDeep(await this.selectBoardQuestion())
        this.answList = await this.selectBoardAnswerList()
        this.key++
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 게시판 > 질문 상세 조회
     */
    async selectBoardQuestion () {
      const res = await boardQnaService.selectBoardQuestion(
        this.instance.params.qstnSeq
      )
      return res.data
    },
    /**
     * 게시판 > 답변 목록 조회
     */
    async selectBoardAnswerList () {
      const res = await boardQnaService.selectBoardAnswerList(
        this.instance.params.qstnSeq
      )
      return res.data
    },
    /**
     * 게시판 > 질문 수정 팝업 열기
     */
    openUpdateBoardQuestionDialog () {
      if (this.form.answYn === 'Y') {
        this.$dialog.alert('답변이 등록된 게시물은 수정이 불가능 합니다.')
        return false
      }
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Qna/BoardQuestionDialog',
        params: {
          qstnSeq: this.form.qstnSeq
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
     * 게시판 > 질문 삭제
     */
    async deleteBoardQuestion () {
      if (this.form.answYn === 'Y') {
        this.$dialog.alert('답변이 등록된 게시물은 삭제가 불가능 합니다.')
        return false
      }
      try {
        await this.$dialog.confirm('이 질문을 삭제하시겠습니까?')
        await boardQnaService.deleteBoardQuestion(this.form.qstnSeq)
        await this.$dialog.alert('질문이 삭제되었습니다.')
        this.close()
      } catch {
        // 삭제 안함
      }
    },
    /**
     * 게시판 > 답변 등록 팝업 열기
     */
    openCreateBoardAnswerDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Qna/BoardAnswerDialog',
        params: {
          question: this.form,
          qstnSeq: this.form.qstnSeq
        },
        options: {
          width: '1800px',
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
     * 게시판 > 답변 수정 팝업 열기
     */
    openUpdateBoardAnswerDialog ({ qstnSeq, answSeq }) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Qna/BoardAnswerDialog',
        params: {
          question: this.form,
          qstnSeq,
          answSeq
        },
        options: {
          width: '1800px',
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
     * 게시판 > 답변 삭제
     */
    async deleteBoardAnswer ({ qstnSeq, answSeq }) {
      try {
        await this.$dialog.confirm('이 답변을 삭제하시겠습니까?')
        await boardQnaService.deleteBoardAnswer(qstnSeq, answSeq)
        await this.$dialog.alert('답변이 삭제되었습니다.')
        this.init()
      } catch {
        // 삭제 안함
      }
    }
  }
}
</script>
