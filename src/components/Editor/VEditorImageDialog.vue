<template>
  <dialog-base :title="`이미지 등록 (URL)`" :instance="instance">
    <v-form ref="form" lazy-validation>
      <v-alert
        dense
        border="left"
        type="info"
      >이미지 업로드는 에디터에 파일을 드래그&드랍해주세요.</v-alert>
      <v-row>
        <v-col cols="12">
          <v-label>이미지 URL</v-label>
          <v-text-field
            v-model="form.imageUrl"
            :rules="emptyRules"
            placeholder="이미지 URL을 입력해 주세요."
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="12" class="text-right">
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
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  name: 'VEditorLinkDialog',
  extends: DialogBase,
  data () {
    return {
      form: {
        imageUrl: ''
      }
    }
  },
  methods: {
    /**
     * 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        this.close({
          imageUrl: this.form.imageUrl
        })
      })
    }
  }
}
</script>
