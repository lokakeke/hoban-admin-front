<template>
  <v-snackbar
    :value="value"
    :color="type"
    :timeout="timeout"
    :top="true"
    @input="$emit('input', false)"
  >
    {{ text }}
    <v-btn dark text @click="$emit('input', false)">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'CommonSnackbars',
  props: {
    value: Boolean,
    type: {
      type: String,
      default: 'success' // success, info, error
    },
    text: {
      type: String,
      default: '',
      required: true
    },
    timeout: {
      type: Number,
      default: 3000
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style scoped>
  i {
    padding-bottom: 3px !important;
  }
</style>
