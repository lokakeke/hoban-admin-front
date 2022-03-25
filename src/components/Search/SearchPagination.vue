<template>
    <div class="text-center mt-3">
        <v-pagination :value="searchParam.page" :total-visible="totalVisible" :length="pages" :circle="circle" @input="pageChange($event)"></v-pagination>
    </div>
</template>

<script>
export default {
  model: {
    prop: 'searchParam',
    event: 'change'
  },
  props: { searchParam: Object, totalVisible: { type: Number, default: 10 }, circle: Boolean },
  name: 'SearchPagination',
  computed: {
    pages () {
      if (this.searchParam.size == null || this.searchParam.total == null || this.searchParam.total === 0) {
        return 1
      }
      return Math.ceil(this.searchParam.total / this.searchParam.size)
    }
  },
  methods: {
    pageChange (pageNum) {
      if (this.searchParam.page !== pageNum) {
        this.$emit('change', Object.assign({}, this.searchParam, { page: pageNum }))
      }
    }
  }
}
</script>
