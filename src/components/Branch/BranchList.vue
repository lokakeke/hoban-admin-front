<template>
  <v-btn outlined rounded :block="isBlock" :color="model ? 'green' : 'grey'">
    <v-autocomplete
      v-model="model"
      :items="list"
      :item-text="'branchName'"
      :item-value="'branchNo'"
      :placeholder="'사업장을 선택하세요.'"
      append-icon="keyboard_arrow_down"
      single-line
      hide-details
      no-data-text="데이터가 없습니다."
      color="green"
      class="pt-0 mt-0 custom-select"
      :menu-props="{'maxHeight':400}"
      @change="changeSelect()"
    ></v-autocomplete>
  </v-btn>
</template>

<script>
import branchService from '@/api/modules/tl/branch.service'

export default {
  props: ['branchList', 'branchNo', 'block', 'branchName', 'useYn', 'storeCode'],
  name: 'BranchList',
  data () {
    return {
      model: '',
      list: [],
      isBlock: false,
      use: 'Y'
    }
  },
  watch: {
    branchNo (newVal) {
      this.model = newVal
    }
  },
  mounted () {
    this.model = this.branchNo
    if (this.useYn !== undefined) {
      this.use = this.useYn
    }
    branchService.selectTLBranchList({ useYn: this.use }).then(res => {
      this.list = res.data
      this.$emit('update:branchList', this.list)
    })
    if (this.block !== undefined) {
      this.isBlock = true
    }
  },
  methods: {
    changeSelect () {
      let text = ''
      const findBranch = _.find(this.list, { branchNo: this.model })
      if (findBranch) {
        text += findBranch.branchName
      } else {
        text = ''
      }
      this.$emit('update:branchName', text)
      this.$emit('update:branchNo', this.model)
      this.$emit('update:storeCode', findBranch.storeCode || '')
      this.$emit('change')
    }
  }
}
</script>
