/*
 * Cookie 설정 함수
 */
const util = {
  /**
   * 쿠키 설정
   * @param name 쿠키 키 값
   * @param value 쿠키 설정 value 값
   * @param days 만료기간
   */
  setCookie (name, value, days) {
    if (!days) {
      days = 14
    }
    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() + days)
    // 설정 일수만큼 현재시간에 만료값으로 지정 (Path 는 / 로 고정)
    const cookieValue = escape(value) + '; PATH=/; expires=' + expireDate.toUTCString()
    document.cookie = name + '=' + cookieValue
  },

  /**
   * 쿠키 추출
   * @param name 쿠키 키 값
   * @return 쿠키 설정 value 값
   */
  getCookie (name) {
    let x, y
    const value = document.cookie.split(';')

    for (let i = 0; i < value.length; i++) {
      x = value[i].substr(0, value[i].indexOf('='))
      y = value[i].substr(value[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '') // 앞과 뒤의 공백 제거하기
      if (x === name) {
        return unescape(y) // unescape로 디코딩 후 값 리턴
      }
    }
  },

  /**
   * 쿠키 삭제 (만료시간을 이용한다.)
   * @param name
   */
  delCookie (name) {
    this.setCookie(name, '', -1)
  }
}

export default util
