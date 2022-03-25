<template>
  <dialog-base :title="`링크 ${modeText}`" :instance="instance">
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col cols="12">
          <v-label>URL 링크</v-label>
          <v-text-field
            v-model="form.linkUrl"
            placeholder="URL을 입력해 주세요."
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="6">
          <v-btn outlined rounded color="error" @click="remove">
            <v-icon>delete</v-icon>삭제
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn outlined rounded color="info" @click="save">
            <v-icon>check</v-icon>확인
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
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  name: 'VEditorLinkDialog',
  extends: DialogBase,
  data () {
    return {
      form: {
        linkUrl: ''
      }
    }
  },
  computed: {
    /**
     * 등록/수정 텍스트
     */
    modeText () {
      return this.instance.params.linkUrl ? '수정' : '등록'
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.form.linkUrl = this.instance.params.linkUrl || ''
    },
    /**
     * 저장
     */
    save () {
      this.close({
        linkUrl: this.form.linkUrl
      })
    },
    /**
     * 삭제
     */
    remove () {
      this.close({
        linkUrl: ''
      })
    }
  }
}
</script>
