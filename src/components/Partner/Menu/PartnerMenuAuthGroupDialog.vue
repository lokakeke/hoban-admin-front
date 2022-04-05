<template>
    <v-navigation-drawer v-model="dialog" :width="600" right app temporary stateless fixed>
        <v-toolbar color="primary" dark>
            <v-btn icon dark @click="close">
                <v-icon>close</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>메뉴 권한그룹 추가</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark text @click="close">Close</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
            <v-form ref="form" lazy-validation autocomplete="off" onsubmit="return false;">
                <v-row @keypress.enter="commit">
                    <v-col cols="6">
                        <v-label>메뉴권한 그룹 ID</v-label>
                        <v-text-field v-model="form.grupId" label="" disabled class="pt-0"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-label>메뉴권한 그룹 이름</v-label>
                        <v-text-field v-model="form.grupName" :rules="emptyRules" label="" class="pt-0"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-checkbox class="mt-0" v-model="form.useYn" label="사용여부" hide-details true-value="Y" false-value="N"></v-checkbox>
                    </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-row justify="center">
                    <v-btn outlined rounded color="info" @click="commit" v-if="writeAuth">
                        <v-icon left>check</v-icon>
                        저장
                    </v-btn>
                    <v-btn outlined rounded color="primary" @click="close">
                        <v-icon left>close</v-icon>
                        닫기
                    </v-btn>
                </v-row>
            </v-form>
        </v-container>
    </v-navigation-drawer>
</template>

<script>
import service from '@/api/modules/partner/partnerMenuAuth.service'

export default {
  props: { load: Function },
  name: 'PartnerMenuAuthGroupDialog',
  data () {
    return {
      dialog: false,
      form: {}
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
  },
  methods: {
    open (form) {
      this.form = this.cloneDeep(form)
      this.dialog = true
      this.$refs.form.resetValidation()
    },
    close () {
      this.dialog = false
    },
    commit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('파트너 메뉴 권한 그룹을 추가 하시겠습니까?').then(() => {
          service.insertPartnerMenuAuthGroup(this.form).then(res => {
            this.$dialog.alert('저장되었습니다.')
            this.load()
            this.close()
          })
        }, () => {})
      })
    }
  }
}
</script>
