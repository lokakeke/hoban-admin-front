<template>
  <dialog-base :instance="instance" :title="`부대시설 ${form.sortSeq ? '수정' : '등록'}`">
    <v-card flat>
      <v-card-text class="pa-0">
        <v-form ref="form" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-label>부대시설 판매명 {{ form.sortSeq }}</v-label>
                <v-text-field v-model="form.subFcltSaleNm" :rules="emptyRules" label="" required class="pt-0"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-label>판매 시작일</v-label>
                <date-picker v-model="form.saleBgnYmd" clearable required></date-picker>
              </v-col>
              <v-col cols="3">
                <v-label>판매 종료일</v-label>
                <date-picker v-model="form.saleEndYmd" clearable required></date-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-label>판매 시작 시간</v-label>
                <v-row no-gutters>
                  <v-col cols="6" class="pr-5">
                    <v-select
                      :items="setTimeRange(24)"
                      v-model="saleTime.bgnHm"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :items="setTimeRange(60)"
                      v-model="saleTime.bgnMinute"
                    />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-label>판매 종료 시간</v-label>
                <v-row no-gutters>
                  <v-col cols="6" class="pr-5">
                    <v-select
                      :items="setTimeRange(24)"
                      v-model="saleTime.endHm"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :items="setTimeRange(60)"
                      v-model="saleTime.endMinute"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6">
                <v-label>부대시설 설명</v-label>
                <v-textarea
                  class="pt-3"
                  outlined
                  color="deep-purple"
                  v-model="form.subFcltDesc"
                  label
                ></v-textarea>
              </v-col>
              <v-col cols="6">
<!--                <v-file-input
                  @change="preview_image"
                  v-model="image"
                >
                </v-file-input>
                <v-img :src="url"></v-img>-->
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-label>인원수 입력여부</v-label>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="form.persCntYn" inset dense true-value="Y" false-value="N" color="info"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-label>수량 입력여부</v-label>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="form.qtyYn" inset dense true-value="Y" false-value="N" color="info"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                <v-list>
                  <v-list-item>
                    <v-list-item-content>
                      <v-label>판매 여부</v-label>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-switch v-model="form.saleYn" inset dense true-value="Y" false-value="N" color="info"></v-switch>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-col class="text-center">
          <v-btn outlined rounded small color="info" @click="save()">
            <v-icon>check</v-icon>
            {{ form.sortSeq ? '수정' : '등록' }}
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import facilityService from '@/api/modules/userSystem/facility.service'

export default {
  name: 'FacilityForm',
  extends: DialogBase,
  data () {
    return {
      form: {
        persCntYn: 'Y',
        qtyYn: 'Y',
        saleYn: 'Y'
      },
      saleTime: {
        bgnHm: '',
        bgnMinute: '',
        endHm: '',
        endMinute: ''
      },
      image: '',
      url: ''
    }
  },
  watch: {
    // 판매시간 설정
    saleTime: {
      handler () {
        this.form.saleBgnHm = [this.saleTime.bgnHm, this.saleTime.bgnMinute].join('')
        this.form.saleEndHm = [this.saleTime.endHm, this.saleTime.endMinute].join('')
      },
      deep: true
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
    // 수정
    if (this.instance.params.form) {
      this.form = _.cloneDeep(this.instance.params.form)
      // 판매 시간 set
      this.setDetailTime()
    }
  },
  methods: {
    // 판매 시간 설정
    setTimeRange (time) {
      return _.range(time).map((i) => {
        const range = _.toString(i)
        return range.length === 1 ? ['0', range].join('') : range
      })
    },
    // 판매 시간 set
    setDetailTime () {
      const timeVar = ['bgnHm', 'bgnMinute', 'endHm', 'endMinute']
      const fullTime = [this.form.saleBgnHm, this.form.saleEndHm].join('').match(/\d{2}/g)
      fullTime.forEach((item, index) => {
        this.$set(this.saleTime, timeVar[index], item)
      })
    },
    // 저장/수정
    async save () {
      try {
        await this.validForm(this.$refs.form)
        const type = this.form.sortSeq ? '수정' : '등록'
        await this.$dialog.confirm(`부대시설 판매정보를 ${type}하시겠습니까?`)
        // TODO
        // this.form.menuCd = 'test3'
        console.log(this.form)
        if (!this.form.sortSeq) {
          await facilityService.insertFacilityMenu(this.form)
        } else {
          await facilityService.updateFacilityMenu(this.form)
        }
        this.$dialog.alert(`${type}되었습니다.`).then(() => {
          this.close({ reload: 'Y' })
        })
      } catch (e) {
      }
    },
    preview_image () {
      this.url = URL.createObjectURL(this.image)
    }
  }
}
</script>
