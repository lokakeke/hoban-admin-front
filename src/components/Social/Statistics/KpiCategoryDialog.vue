<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">KPI 카테고리 {{isNew ? '추가' : '수정'}}</span>
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="6">
          <div class="v-label font-weight-bold info--text">KPI 구분 명</div>
          <v-text-field v-model="form.kpiIndNm" hide-details :rules="emptyRules"></v-text-field>
        </v-col>
        <v-col cols="6">
          <div class="v-label font-weight-bold info--text">사용 여부</div>
          <v-radio-group v-model="form.useYn" row :rules="emptyRules">
            <v-radio label="사용" value="Y"></v-radio>
            <v-radio label="미사용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" v-if="isNew" @click="insertKpiCategory"><v-icon left>add</v-icon>입력</v-btn>
      <v-btn outlined rounded color="info" v-else @click="updateKpiCategory"><v-icon left>edit</v-icon>수정</v-btn>
      <v-btn outlined rounded color="default" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import kpiService from 'Api/modules/social/kpi.service'

export default {
  extends: DialogBase,
  name: 'KpiCategoryDialog',
  data () {
    return {
      isNew: true,
      form: {
        kpiSeq: '',
        kpiIndNm: '',
        useYn: 'Y'
      }
    }
  },
  async mounted () {
    if (this.instance.params.kpiSeq) {
      this.form = await kpiService.selectKpiCategory(this.instance.params.kpiSeq)
      this.isNew = this.form.kpiSeq === null || this.form.kpiSeq === undefined || this.form.kpiSeq === ''
    }
  },
  methods: {
    async insertKpiCategory () {
      try {
        await this.validForm(this.$refs.form)
        await this.$dialog.confirm('KPI 카테고리 정보를 입력 하시겠습니까?')
        await kpiService.insertKpi(this.form)
        this.$dialog.alert('KPI 카테고리 정보를 입력 하였습니다.')
        this.close({ change: true })
      } catch (e) {}
    },
    async updateKpiCategory () {
      try {
        await this.validForm(this.$refs.form)
        await this.$dialog.confirm('KPI 카테고리 정보를 수정 하시겠습니까?')
        await kpiService.updateKpi(this.form)
        this.$dialog.alert('KPI 카테고리 정보를 수정 하였습니다.')
        this.close({ change: true })
      } catch (e) {}
    }
  }
}
</script>
