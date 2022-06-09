<template>
  <div>
    <v-container fluid pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <v-layout row wrap>
          <v-flex xs12 md5 border-right>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center pt-0">
                TL-LINCOLN 사업장
              </v-card-title>
              <v-layout justify-center class="border-bottom pb-1">
                <div>
                  <v-btn outlined rounded small @click="sort(branch)" color="orange" v-if="!search || search.length === 0">
                    <v-icon small class="mr-1">refresh</v-icon>
                    원래대로
                  </v-btn>
                  <v-btn outlined rounded small color="orange" @click="sortChange()" v-if="!search || search.length === 0">
                    <v-icon small class="mr-1">swap_vert</v-icon>
                    순서 저장
                  </v-btn>
                  <v-btn outlined rounded small color="blue" @click="addBranch()">
                    <v-icon small class="mr-1">add</v-icon>
                    사업장 추가
                  </v-btn>
                </div>
              </v-layout>
              <v-flex xs6>
                <v-text-field v-model="search" prepend-icon="search" :append-outer-icon="search && search.length > 0 ? 'close': ''"
                              @input="filter" single-line placeholder="사업장 필터" @click:append-outer="initFilter" hide-details></v-text-field>
              </v-flex>
              <v-card-text>
                <v-list dense v-if="branch && branch.length > 0" class="pr-5">
                  <draggable v-model="branch">
                    <transition-group type="transition" name="flip-list">
                      <v-list-item v-for="item of branch" :key="item.sortOrder" @click="viewDetail(item)" class="menu-list" :class="item.active? 'active' : ''">
                        <v-list-item-action>
                          <v-icon>business</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.brcName + '(' + item.brcNo + ')' }}
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon>keyboard_arrow_right</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </transition-group>
                  </draggable>
                </v-list>
                <v-layout v-else align-center justify-center fill-height>
                  등록된 사업장이 없습니다.
                </v-layout>
                <v-layout justify-center>
                  <div>
                    <v-divider></v-divider>
                    <v-btn outlined rounded small @click="sort(branch)" color="orange" v-if="!search || search.length === 0">
                      <v-icon small class="mr-1">refresh</v-icon>
                      원래대로
                    </v-btn>
                    <v-btn outlined rounded small color="orange" @click="sortChange()" v-if="!search || search.length === 0">
                      <v-icon small class="mr-1">swap_vert</v-icon>
                      순서 저장
                    </v-btn>
                    <v-btn outlined rounded small color="blue" @click="addBranch()">
                      <v-icon small class="mr-1">add</v-icon>
                      사업장 추가
                    </v-btn>
                  </div>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md7>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center pt-0">사업장 상세내역</v-card-title>
              <v-layout justify-center class="border-bottom pb-1" v-if="param.branch">
                <div>
                  <v-btn outlined rounded small @click="resetForm()" color="orange">
                    <v-icon small class="mr-1">refresh</v-icon>
                    원래대로
                  </v-btn>
                  <v-btn outlined rounded small color="blue" @click="commit(true)">
                    <v-icon small class="mr-1">check</v-icon>
                    저장
                  </v-btn>
                </div>
              </v-layout>
              <v-card-text class="pl-5 pr-5">
                <transition name="slide-fade" mode="out-in">
                  <template v-if="param.branch">
                    <v-form ref="form" lazy-validation :key="param.branch" autocomplete="off">
                      <branch-form :formData.sync="form" :businessList="businessList"></branch-form>
                      <v-layout justify-center>
                        <div class="pa-2">
                          <v-btn outlined rounded small @click="resetForm()" color="orange">
                            <v-icon small class="mr-1">refresh</v-icon>
                            원래대로
                          </v-btn>
                          <v-btn outlined rounded small color="info" @click="commit(true)">
                            <v-icon small class="mr-1">check</v-icon>
                            저장
                          </v-btn>
                        </div>
                      </v-layout>
                    </v-form>
                  </template>
                  <v-layout v-else align-center justify-center fill-height>
                    TL-LINCOLN 사업장을 선택해 주세요.
                  </v-layout>
                </transition>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </app-card>
    </v-container>
    <v-navigation-drawer
      fixed
      v-model="dialog"
      :width="600"
      right
      app
      temporary>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>사업장 추가</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-form ref="addForm" lazy-validation autocomplete="off">
          <branch-form :formData.sync="addForm" :businessList="businessList"></branch-form>
          <v-layout justify-center>
            <div class="pa-2">
              <v-btn outlined rounded small @click="resetAddForm()" color="orange">
                <v-icon small class="mr-1">refresh</v-icon>
                초기화
              </v-btn>
              <v-btn outlined rounded small color="blue" @click="commit(false)">
                <v-icon small class="mr-1">check</v-icon>
                저장
              </v-btn>
            </div>
          </v-layout>
        </v-form>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import branchService from '@/api/modules/tl/branch.service'
import BranchForm from '@/views/tl/branch/BranchForm.vue'

export default {
  components: { BranchForm, draggable },
  name: 'branch',
  data () {
    return {
      // 사업장 리스트
      branchOrigin: [],
      // PMS 영업장 리스트
      businessList: [],
      param: { branch: '' },
      dialog: false,
      form: {},
      addForm: {},
      cloneForm: {},
      branch: [],
      search: ''
    }
  },
  methods: {
    initFilter () {
      this.search = ''
      this.filter()
    },
    filter () {
      this.branch = this.branchOrigin.filter(value => {
        return value.brcName.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    selectBranch (brcNo) {
      branchService.selectTLBranchList().then(res => {
        this.branchOrigin = res.data
        this.filter()
        for (const row of this.branch) {
          if (brcNo && row.brcNo === brcNo) {
            this.viewDetail(row)
          }
        }
      })
    },
    viewDetail (item) {
      for (const data of this.branch) {
        data.active = false
      }
      item.active = true
      this.form = _.cloneDeep(item)
      this.cloneForm = _.cloneDeep(this.form)
      this.param.branch = item.brcNo
    },
    sort (menus) {
      menus = menus.sort((a, b) => a.sortOrder - b.sortOrder)
    },
    sortChange () {
      // 순서가 변환된 목록을 추려낸다.
      const changeList = []
      for (let index = 0; index < this.branch.length; index++) {
        const order = index + 1
        if (order !== this.branch[index].sortOrder) {
          changeList.push({ brcNo: this.branch[index].brcNo, sortOrder: order })
        }
      }
      if (changeList.length === 0) {
        this.$dialog.alert('변경된 사항이 없습니다.')
      } else {
        this.$dialog.confirm('사업장 순서를 변경하시겠습니까?').then(() => {
          branchService.updateBranchOrder(changeList).then(res => {
            this.selectBranch(this.form.brcNo)
            this.$dialog.alert('저장되었습니다.')
          })
        }, () => {
        })
      }
    },
    addBranch () {
      this.resetAddForm()
      this.dialog = true
    },
    resetForm () {
      this.form = _.cloneDeep(this.cloneForm)
    },
    resetAddForm () {
      this.$refs.addForm.resetValidation()
      this.addForm = {}
    },
    async commit (isModify) {
      try {
        let formElement, confirmTxt
        if (isModify) {
          formElement = this.$refs.form
          confirmTxt = '사업장을 수정 하시겠습니까?'

          if (this.form.startDate) {
            this.form.startDate = this.form.startDate.replace(/-/gi, '')
          }
        } else {
          formElement = this.$refs.addForm
          confirmTxt = '사업장을 등록 하시겠습니까?'

          if (this.addForm.startDate) {
            this.addForm.startDate = this.addForm.startDate.replace(/-/gi, '')
          }
        }

        await this.validForm(formElement)
        await this.$dialog.confirm(confirmTxt)
        if (isModify) {
          const editFrom = _.cloneDeep(this.form)
          delete editFrom.active
          await branchService.updateBranch(editFrom).then(res => {
            this.cloneForm = _.cloneDeep(this.form)
            this.selectBranch(this.form.brcNo)
          })
        } else {
          await branchService.insertBranch(this.addForm).then(res => {
            this.selectBranch(res.data)
            this.dialog = false
          })
        }
        this.$dialog.alert('저장되었습니다.')
      } catch (e) {
      }
    }
  },
  mounted () {
    this.selectBranch()
    // PMS 영업장 리스트 조회
    branchService.selectPmsHotelInfoList().then(res => {
      this.businessList = res.data
    })
  }
}
</script>
