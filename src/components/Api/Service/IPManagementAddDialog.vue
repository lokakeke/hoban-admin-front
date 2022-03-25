<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>add</v-icon> IP {{isNewTab? '추가': '상세/변경'}}
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col sm="6" md="4">
          <v-label>IP</v-label>
          <v-text-field v-model="form.useIp" label="" :rules="emptyRules" required></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>IP 명</v-label>
          <v-text-field v-model="form.ipNm" label="" :rules="emptyRules" required></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>서버구분</v-label>
          <v-autocomplete v-model="form.serverCd" clearable autocomplete="off"
                          :items="serverCdList" :item-value="'commCd'" :item-text="'commCdNm'" :rules="emptyRules" required></v-autocomplete>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>사용여부</v-label>
          <v-radio-group v-model="form.useYn" row>
            <v-radio label="사용" value="Y"></v-radio>
            <v-radio label="미사용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions v-if="writeAuth">
      <v-btn outlined rounded color="info" @click="addIp"><v-icon left>check</v-icon>{{isNewTab? '추가': '수정'}}</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'IPManagementAddDialog',
  data () {
    return {
      form: Object,
      isNewTab: Boolean,
      serverCdList: Array,
      list: Array,
      index: Number
    }
  },
  mounted () {
    this.form = this.instance.params.form
    this.isNewTab = this.instance.params.isNewTab
    this.serverCdList = this.instance.params.serverCdList
    this.list = this.instance.params.list
    this.index = this.instance.params.index
  },
  methods: {
    addIp () {
      this.validForm(this.$refs.form).then(() => {
        if (this.isNewTab) {
          // 사용중인 아이피인지 확인
          if (this.list.filter(data => data.useIp === this.form.useIp).length > 0) {
            this.$dialog.alert('이미 등록된 IP 입니다.')
            return
          }
        } else {
          // 사용중인 아이피인지 확인
          if (this.list.filter((data, idx) => idx !== this.index && data.useIp === this.form.useIp).length > 0) {
            this.$dialog.alert('이미 등록된 IP 입니다.')
            return
          }
        }
        this.close({ data: this.form })
      })
    }
  }
}
</script>
