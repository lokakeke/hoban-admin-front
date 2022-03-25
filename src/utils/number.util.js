/**
 * 숫자 유틸
 */
const util = {
  /**
   * 천단위로 콤마찍기
   * @param {Number} num 대상 숫자
   */
  numberWithCommas (num) {
    if (!num) {
      return 0
    }
    num = num.toString()
    const pattern = /(-?\d+)(\d{3})/
    while (pattern.test(num)) num = num.replace(pattern, '$1,$2')
    return num
  },
  /**
   * 숫자 한글로 표현
   * @param {Number} num 대상 숫자
   */
  toKoreanNumber (num) {
    num = parseInt((num + '').replace(/[^0-9]/g, ''), 10) + ''
    if (Number(num) === 0) { return '영' }
    const number = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
    const unit = ['', '만', '억', '조']
    const smallUnit = ['천', '백', '십', '']
    const result = []
    num = num.padStart(Math.ceil(num.length / 4) * 4, '0')
    const regexp = /[\w\W]{4}/g
    const array = num.match(regexp)
    for (let i = array.length - 1, unitCnt = 0; i >= 0; i--, unitCnt++) {
      var hanValue = _makeHan(array[i])
      if (hanValue === '') continue
      result.unshift(hanValue + unit[unitCnt])
    }
    function _makeHan (text) {
      let str = ''
      for (let i = 0; i < text.length; i++) {
        const num = text[i]
        if (num === '0') continue
        str += number[num] + smallUnit[i]
      }
      return str
    }
    return result.join('')
  }
}

export default util
