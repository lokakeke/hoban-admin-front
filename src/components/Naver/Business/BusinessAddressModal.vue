<template>
  <dialog-base :instance="instance" right :title="`주소 ${ instance.params.addrModal.commonCodeSeq ? '수정': '등록' }`">
    <template v-slot:buttons>
      <v-btn dark text @click="emit()">
        <v-icon left>check</v-icon>{{ instance.params.addrModal.commonCodeSeq ? '수정': '등록' }}
      </v-btn>
    </template>
    <v-card-text class="pt-2" style="height: 560px;">
      <v-form ref="form" v-if="form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-icon color="green darken-2">check</v-icon>주소이름
            <v-text-field placeholder="주소이름을 입력해주세요." counter="30"
              v-model="form.commonCodeName" :rules="betweenLengthRules(1,30).concat(emptyRules)"></v-text-field>
          </v-col>
          <v-col cols="10">
            <v-icon color="green darken-2">check</v-icon>지번주소
            <v-text-field placeholder="지번주소를 입력해주세요." counter="100"
              v-model="form.item01" :rules="betweenLengthRules(1,100).concat(emptyRules)" readonly></v-text-field>
          </v-col>
          <v-col cols="2" class="pa-0 pt-9">
            <v-btn outlined rounded color="primary" @click="searchAddress()">검색</v-btn>
          </v-col>
          <v-col cols="12">
            <v-icon color="green darken-2">check</v-icon>도로명주소
            <v-text-field placeholder="도로명주소를 입력해주세요." counter="100"
              v-model="form.item02" :rules="betweenLengthRules(1,100).concat(emptyRules)" readonly></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-icon color="green darken-2">check</v-icon>위도
            <v-text-field placeholder="위도"
              v-model="form.item03" :rules="emptyRules" readonly></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-icon color="green darken-2">check</v-icon>경도
            <v-text-field placeholder="경도"
              v-model="form.item04" :rules="emptyRules" readonly></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-icon color="green darken-2">check</v-icon>줌 레벨
            <v-text-field
              v-model="form.item05"
              placeholder="줌 레벨을 입력해주세요."
              max="99"
              min="1"
              step="1"
              type="number"
              :rules="numberRules.concat(emptyRules)"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-icon color="green darken-2">check</v-icon>상세주소
            <v-textarea outlined dense class="mt-2"
              v-model="form.commonCodeDesc" :value="form.commonCodeDesc"
              placeholder="방문객이 쉽게 찾도록 위치에 대한 상세한 설명 및 교통편을 입력해주세요."
              counter="300" :rules="maxLengthRules(300)"></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'BusinessAddressModal',
  data () {
    return {
      form: null
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
    this.inits()
  },
  computed: {
  },
  methods: {
    inits () {
      this.form = this.instance.params.addrModal
      this.form.item05 = 8
    },
    searchAddress () {
      // 네이버 주소 검색 API 화면
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Business/BusinessSearchAddressModal',
        params: {
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 1000,
          scrollable: true,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.item01 = params.data.address
              this.form.item02 = params.data.roadAddress
              this.form.item03 = params.data.latitude
              this.form.item04 = params.data.longitude
            }
          }
        }
      })
    },
    emit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(this.form.commonCodeSeq ? '주소를 수정하시겠습니까?' : '주소를 입력하시겠습니까?').then(() => {
          if (this.form.commonCodeSeq) {
            commonCodeService.updateCommonCode(this.form).then(res => {
              this.$dialog.alert('수정되었습니다.')
              this.close({ data: this.form })
            })
          } else {
            this.form = {
              parentCommCode: 'STORE_ADDR',
              useYn: 'Y',
              commonCode: this.form.commonCodeName,
              commonCodeName: this.form.commonCodeName,
              item01: this.form.item01,
              item02: this.form.item02,
              item03: this.form.item03,
              item04: this.form.item04,
              item05: this.form.item05,
              commonCodeDesc: this.form.commonCodeDesc
            }
            commonCodeService.insertCommonCode(this.form).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.close({ data: this.form })
            })
          }
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
