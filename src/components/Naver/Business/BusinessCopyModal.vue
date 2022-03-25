<template>
  <dialog-base :instance="instance" :title="'서비스 복사'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>복사
      </v-btn>
    </template>
    <v-card style="height: max-content">
      <v-card-text class="mt-4">
        <v-form ref="form" lazy-validation style>
          <v-row>
            <v-col cols="12" class="px-4 py-0">
              <v-label> 서비스명 </v-label>
              <v-text-field counter="30" v-model="name" placeholder="서비스명을 입력해 주세요."
                :rules="betweenLengthRules(1,30).concat(emptyRules, nameRegex)"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </dialog-base>
</template>

<script>
import service from 'Api/modules/naver/business.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'BusinessCopyModal',
  components: {
  },
  data: function () {
    return {
      name: ''
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
    this.name = this.instance.params.copyBusiness.serviceName
  },
  methods: {
    save () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('사업장 복사를 하시겠습니까?').then(() => {
          this.instance.params.copyBusiness.serviceName = this.name

          service.copyBusiness(this.instance.params.copyBusiness).then(() => {
            this.close()
            const snackbarObj = { type: 'success', text: '사업장이 복사 되었습니다.' }
            this.instance.params.search(snackbarObj)
          }).catch((error) => {
            if (!(error.response && error.response.status === 422)) {
              this.close()
              this.instance.params.search()
            }
          })
        })
      })
    }
  }
}
</script>
