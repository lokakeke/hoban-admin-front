<template>
  <v-tooltip :top="top" :bottom="bottom">
    <template v-slot:activator="{ on }">
      <v-btn small :color="color" @click="onClick" v-on="on">
        <v-icon :color="iconColor">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script>
export default {
  name: 'VEditorBtn',
  props: {
    /**
     * icon
     */
    icon: {
      type: String,
      require: true
    },
    /**
     * 활성화 여부
     */
    active: {
      type: Boolean
    },
    /**
     * v-tooltip top
     */
    top: {
      type: Boolean,
      default () {
        return true
      }
    },
    /**
     * v-tooltip bottom
     */
    bottom: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    /**
     * 색상
     */
    color () {
      return this.active === true ? 'primary' : null
    },
    /**
     * 아이콘 색상
     */
    iconColor () {
      return this.active === true ? 'white' : null
    }
  },
  methods: {
    /**
     * 클릭 이벤트
     */
    onClick () {
      this.$emit('click')
    }
  }
}
</script>
