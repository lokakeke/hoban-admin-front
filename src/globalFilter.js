// AutoImport 못해서 일단 직접 임포트 (woojung)
// $moment

/**
 * 바이트 값을 읽기 편하게 변환
 * @param value
 * @returns {string}
 */
export function byte (value) {
  const s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
  const e = Math.floor(Math.log(value) / Math.log(1024))
  return `${(value / Math.pow(1024, e)).toFixed(2)} ${s[e]}`
}

/**
 * 줄바꿈 문자 치환
 * @param value
 * @returns {string}
 */
export function castHtml (value) {
  if (!value) {
    return ''
  }
  return value.replace(/(?:\r\n|\r|\n)/g, '<br />')
}

/**
 * date -> datePicker 선택값 -> 날짜 str 형태로 변환
 * @param value
 * @param format
 * @returns {string}
 */
export function date (value, format = 'YYYY-MM-DD') {
  if (!value) { return '' } else if (!moment(value).isValid()) { return '날짜 형식이 맞지 않습니다.' }
  return moment(value).format(format)
}

/**
 * 날짜(시간 포함) str 형태로 변환
 * @param value
 * @param format
 * @returns {string}
 */
export function dateSet (value, format = 'YYYY.MM.DD HH:mm:ss') {
  if (!value) { return '-' } else if (!moment(value).isValid()) { return '날짜 형식이 맞지 않습니다.' }
  return moment(value).format(format)
}

/**
 * 시작일(요일) ~ 종료일(요일) 형식으로 return
 * @param start 입력 값: 시작일
 * @param end 입력 값: 종료일
 * @returns {string}
 */
export function dateSetForMonth (start, end) {
  const day = ['일', '월', '화', '수', '목', '금', '토']
  return end ? start + '(' + day[new Date(start).getDay()] + ') ~ ' +
    end + '(' + day[new Date(end).getDay()] + ')'
    : moment(start).format('YYYY-MM-DD HH:mm:DD') + ' (' + day[new Date(start).getDay()] + ')'
}

/**
 * 일수 차이 return(박 수를 셀 때 사용)
 * @param start 입력 값: 시작일
 * @param end 입력 값: 종료일
 * @returns {number}
 */
export function dateSetPerDay (start, end, plus) {
  return moment(end).add(plus, 'days').diff(moment(start), 'days') // 일수 차이
}

/**
 * 입력한 날짜와 오늘 간의 일 수 차이가 count보다 작거나 같은지 계산
 * @param day 입력값: 계산을 원하는 날짜
 * @param count 입력값: 계산을 원하는 일 수 차이(숫자)
 * @returns {boolean}
 */
export function isDayDifferentCount (day, count) {
  const diffDays = moment().diff(moment(day), 'days')
  return diffDays <= count
}

/**
 * textTruncate -> 글짜 자르기
 * @param str
 * @param length
 * @param ending
 * @returns {string}
 */
export function textTruncate (str, length, ending) {
  if (str == null) {
    return ''
  }
  if (length == null) {
    length = 30
  }
  if (ending == null) {
    ending = '...'
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending
  } else {
    return str
  }
}

/**
 * price -> 금액 천단위 , 콤마 추가
 * @param value
 * @returns {string}
 */
export function price (value) {
  if (value === '') {
    return ''
  } else if (isNaN(value)) {
    return value
  }
  return Number(value).toLocaleString()
}

/**
 * sum -> 리스트에서 해당 key 값을 더하여 return
 * @param list
 * @param key
 * @returns {number}
 */
export function sum (list = [], key = '') {
  let count = 0
  if (!list) { return 0 }
  if (key) {
    count = list.reduce((sum, row) => {
      if (Object.prototype.hasOwnProperty.call(row, key) && !isNaN(row[key])) {
        return sum + parseInt(row[key])
      } else {
        return sum
      }
    }, 0)
  } else {
    count = list.reduce((sum, number) => sum + number, 0)
  }
  return count
}

/**
 * label -> 리스트에서 해당 key 에 해당하는 label return
 * @param value 입력 값
 * @param list 리스트
 * @param code 리스트 value 필드
 * @param label 리스트 label 필드
 * @returns {string}
 */
export function label (value, list = [], code = '', label = '') {
  const text = ''
  if (!list || list.length === 0) {
    return ''
  }
  if (code && label) {
    for (const row of list) {
      if (Object.prototype.hasOwnProperty.call(row, code) && Object.prototype.hasOwnProperty.call(row, label) && row[code] === value) {
        return row[label]
      }
    }
  }
  return text
}
