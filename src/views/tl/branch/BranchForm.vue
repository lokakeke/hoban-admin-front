<template>
    <div>
        <v-label>사업장 이름</v-label>
        <v-text-field v-model="formData.branchName" :counter="100" label="" :rules="emptyRules" required
                      class="pt-0 ime-active"></v-text-field>
        <v-label>영업장</v-label>
        <v-autocomplete v-model="formData.storeCode" :items="businessList" :rules="emptyRules"
                        class="pt-0" label=""
                        placeholder="영업장을 선택해 주세요."
                        :item-value="'storeCode'"
                        :item-text="'storeName'"
                        required
                        chips
                        deletable-chips>
        </v-autocomplete>
        <v-label>TL-LINCOLN SYSTEM ID</v-label>
        <v-text-field v-model="formData.tlSystemID" label="" :rules="emptyRules" class="pt-0"></v-text-field>
        <v-label>TL-LINCOLN LOGIN ID</v-label>
        <v-text-field v-model="formData.tlLoginID" label="" :rules="emptyRules" class="pt-0"></v-text-field>
        <v-label>TL-LINCOLN LOGIN PASSWORD</v-label>
        <v-text-field v-model="formData.tlLoginPw" type="password" autocomplete="new-password" label=""
                      :rules="emptyRules" class="pt-0"></v-text-field>

        <v-checkbox class="mt-0" v-model="formData.useYn" label="사용여부" required true-value="Y"
                    false-value="N"></v-checkbox>
        <v-checkbox class="mt-0" v-model="formData.autoRsvYn"
                    label="자동예약 일시정지(일시정지 해제 시 일시정지 기간에 쌓인 예약은 다시 자동으로 들어갑니다.)" required true-value="N"
                    false-value="Y"></v-checkbox>

        <v-label>예약 연동 시작 시간(신규 사업장 오픈시 해당 시간 이후 부터 자동으로 예약이 진행됩니다.)<br/>
            TL-LINCOLN 에서 전송된 예약건들 중 과거의 예약건들이 존재하기에 <span class="red--text">1시간이상</span> 여유있게 잡아 주시기 바랍니다.<br/><br/>
            <span class="red--text">자동예약에 관련되어 룸타입 및 재고 관리가 등록이 되어있어야 됩니다.</span>
        </v-label>

        <v-row>
            <v-col cols="6">
                <date-picker :shortcuts="false" :value-type="'format'" :not-before="new Date()"
                             append-to-body v-model="formData.startDate" :lang="lang" date>
                </date-picker>
            </v-col>
            <v-col cols="6">
                <v-select v-model="formData.startTime" :items="getTime"
                          class="pt-0" label=""
                          placeholder="시작 시간을 선택해주세요."
                          required>
                </v-select>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  props: ['formData', 'businessList'],
  name: 'branchForm',
  computed: {
    getTime () {
      const timeList = []

      for (let i = 0; i < 24; i++) {
        if (i < 10) {
          timeList[i] = '0' + (i)
        } else {
          timeList[i] = '' + i
        }
      }
      return timeList
    }
  },
  data () {
    return {
      // custom lang
      lang: {
        days: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        placeholder: {
          date: '자동예약 시작 날짜를 선택하세요.',
          dateRange: '자동예약 시작 기간을 선택하세요.'
        }
      }
    }
  }
}
</script>
