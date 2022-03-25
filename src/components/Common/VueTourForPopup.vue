<template>
  <v-tour name="popupTour" :steps="steps" :options="options" :callbacks="callBack"></v-tour>
</template>

<script>
export default {
  props: { steps: Array, callBack: Object },
  data () {
    return {
      options: {
        labels: {
          buttonSkip: '메뉴얼 종료',
          buttonPrevious: '이전 단계',
          buttonNext: '다음 단계',
          buttonStop: '마침'
        }
      }
    }
  }
}
</script>
