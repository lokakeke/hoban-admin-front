/**
 * 휴대폰 유틸
 */
const util = {
  /**
   * 휴대폰 앞자리 배열 가져오기
   */
  getPhoneFrontArr () {
    return ['010', '011', '016', '017', '018', '019']
  },
  /**
   * 휴대폰 번호가 유효한지 확인
   * @param phone 휴대폰 번호
   */
  isValidPhone (phone) {
    const phoneRegex = /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g
    return phoneRegex.test(phone)
  },
  /**
   * 휴대폰번호(XXXXXXXXXX)를 하이픈(-) 붙여서 표현
   * @param {String} phone 휴대폰 번호
   */
  toPhoneStr (phone) {
    if (phone) {
      if (phone.length === 10) {
        return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6, 10)}`
      } else if (phone.length === 11) {
        return `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7, 11)}`
      }
    }
    return phone
  }
}

export default util
