<template>
  <span v-if="position === 'top'">&nbsp;
    <v-tooltip top nudge-bottom="5" :max-width="maxWidth" :color="color">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" :size="size">{{ type }}</v-icon>
      </template>
      <span v-html="text"></span>
    </v-tooltip>
  </span>
  <span v-else-if="position === 'bottom'">&nbsp;
    <v-tooltip bottom nudge-top="5" :max-width="maxWidth">
      <template v-slot:activator="{ on }">
      <v-icon v-on="on" :size="size">{{ type }}</v-icon>
    </template>
      <span v-html="text"></span>
    </v-tooltip>
  </span>
  <span v-else-if="position === 'right'">&nbsp;
    <v-tooltip right nudge-right="5" :max-width="maxWidth">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" :size="size">{{ type }}</v-icon>
      </template>
      <span v-html="text"></span>
    </v-tooltip>
  </span>
  <span v-else-if="position === 'left'">&nbsp;
    <v-tooltip left nudge-left="5" :max-width="maxWidth">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on" :size="size">{{ type }}</v-icon>
    </template>
    <span v-html="text"></span>
  </v-tooltip>
  </span>
</template>

<script>
export default {
  name: 'CommonTooltip',
  props: {
    type: {
      type: String,
      default: 'info'
    },
    position: {
      type: String,
      default: 'top'
    },
    text: {
      type: String,
      default: 'tooltip'
    },
    size: {
      type: Number,
      default: 17
    },
    maxWidth: {
      type: String,
      default: 'auto'
    },
    color: {
      type: String,
      default: 'rgba(0, 0, 0, 0.5)'
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
