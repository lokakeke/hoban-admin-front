<template>
  <div>
    <v-container fluid pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <v-layout>
          <v-flex xs12 md6 lg6 border-right>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">AGENT 선택</v-card-title>
              <v-card-text class="mt-8 pl-5 pr-5">
                <v-list dense v-if="agtCodeList && agtCodeList.length > 0" class="pr-5">
                  <transition-group type="transition" name="flip-list">
                    <v-list-item v-for="item of agtCodeList" :key="item.commonCode" @click="viewDetail(item)" class="menu-list" :class="item.active? 'active' : ''">
                      <v-list-item-action>
                        <v-icon>business</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.commonCodeName }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon>keyboard_arrow_right</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </transition-group>
                </v-list>
                <v-layout v-else align-center justify-center fill-height>
                  AGENT를 선택해 주세요.
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6 lg6>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">회원번호 정보 내용</v-card-title>
              <v-card-text class="mt-8 pl-5 pr-5">
                <transition name="slide-fade" mode="out-in">
                  <template v-if="param.agtCode">
                    <v-form ref="form" lazy-validation :key="param.agtCode" autocomplete="off">
                      <v-flex xs12 class="mb-3">
                        <v-label>회원번호 정보</v-label>
                        <v-btn small rounded outlined color="blue" @click="add()">
                          <v-icon small>add</v-icon>
                          추가
                        </v-btn>
                      </v-flex>
                      <v-data-table
                        :no-data-text="'데이터가 없습니다.'"
                        :headers="headers"
                        :items="form.list"
                        class="condensed"
                        disable-pagination
                        disable-sort
                        hide-default-footer>
                        <template v-slot:item="props">
                          <tr>
                            <td>
                              <v-text-field v-model="props.item.memberNo" label="" class="pt-0" :rules="emptyRules"></v-text-field>
                            </td>
                            <td>
                              <v-select v-model="props.item.memberType" :items="memberTypeList" :rules="emptyRules"
                                        class="pt-0" label=""
                                        placeholder="회원번호 구분 타입을 선택해 주세요."
                                        :item-value="'commonCode'"
                                        :item-text="'commonCodeName'"
                                        required>
                              </v-select>
                            </td>
                            <td>
                              <v-btn small color="amber darken-4" rounded outlined @click="remove(props.index)">
                                <v-icon small>delete</v-icon>
                                삭제
                              </v-btn>
                            </td>
                          </tr>
                        </template>
                      </v-data-table>
                      <v-layout justify-center>
                        <div class="pa-2">
                          <v-btn outlined rounded small color="blue" @click="commit()">
                            <v-icon small class="mr-1">check</v-icon>
                            저장
                          </v-btn>
                        </div>
                      </v-layout>
                    </v-form>
                  </template>
                  <v-layout v-else align-center justify-center fill-height>
                    AGENT를 선택해 주세요.
                  </v-layout>
                </transition>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </app-card>
    </v-container>
  </div>
</template>

<script>
import commonCodeService from '@/api/modules/system/commonCode.service'
import memberNoService from '@/api/modules/tl/memberNo.service'

export default {
  components: {},
  name: 'memberNo',
  mounted() {
    commonCodeService.selectCommonCode('agt').then(res => {
      this.agtCodeList = res.data
    })

    commonCodeService.selectCommonCode('member_type').then(res => {
      this.memberTypeList = res.data
    })
  },
  data() {
    return {
      // ota 코드리스트
      agtCodeList: [],
      memberTypeList: [],
      param: { agtCode: '', memberNo: '' },
      headers: [
        { text: '회원번호', value: 'memberNo', align: 'center', sortable: false },
        { text: '회원번호구분', value: 'memberType', align: 'center', sortable: false },
        { text: '삭제', value: 'delYn', align: 'center', sortable: false }
      ],
      dialog: false,
      form: { list: [] }
    }
  },
  methods: {
    selectMemberNoList() {
      memberNoService.selectMemberNoList(this.param).then(res => {
        if (res.data) {
          this.form.list = res.data
        } else {
          this.form.list = [] // 초기화
        }
      })
    },
    add() {
      this.form.list.push({ agtCode: this.param.agtCode, memberNo: '', memberType: '' })
    },
    viewDetail(item) {
      for (let data of this.agtCodeList) {
        data.active = false
      }
      item.active = true
      this.param.agtCode = item.commonCode
      // 기존에 저장된 정보를 가져와야됨.
      this.selectMemberNoList()
    },
    async commit() {
      this.form.agtCode = this.param.agtCode
      this.form.memberNo = this.param.memberNo

      await this.validForm(this.$refs.form)

      await this.$dialog.confirm('회원 정보를 저장 하시겠습니까?').then(() => {
        memberNoService.updateMemberNo(this.form).then(res => {
          this.dialog = false
          this.$dialog.alert('저장되었습니다.')
        })
      }, () => {
      })
    },
    remove(index) {
      this.$dialog.confirm('선택한 항목을 삭제하시겠습니까?').then(() => {
        this.form.list.splice(index, 1)
      }, () => {
      })
    }
  }
}
</script>
