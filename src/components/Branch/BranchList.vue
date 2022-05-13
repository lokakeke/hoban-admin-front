<template>
  <v-btn outlined rounded :block="isBlock" :color="model ? 'green' : 'grey'">
    <v-autocomplete
      v-model="model"
      :items="list"
      :item-text="'brcName'"
      :item-value="'brcNo'"
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
  props: ['branchList', 'brcNo', 'block', 'branchName', 'useYn', 'hotelCode'],
  name: 'BranchList',
  data() {
    return {
      model: '',
      list: [],
      isBlock: false,
      use: 'Y'
    }
  },
  watch: {
    brcNo(newVal) {
      this.model = newVal
    }
  },
  mounted() {
    this.model = this.brcNo
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
    changeSelect() {
      let text = ''
      const findBranch = _.find(this.list, { brcNo: this.model })
      if (findBranch) {
        text += findBranch.brcName
      } else {
        text = ''
      }
      this.$emit('update:branchName', text)
      this.$emit('update:brcNo', this.model)
      this.$emit('update:hotelCode', findBranch.hotelCode || '')
      this.$emit('change')
    }
  }
}
</script>
