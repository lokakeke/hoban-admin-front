import tempJsonData from './temp/calcData'
import store from '@/store'

const roomTypeCalculateService = {
  /**
   * @returns 객실 정산 리스트
   */
  selectRoomTypeCalculateList (param, type) {
    /** 임시 코드 - fake 데이터 저장소로 localStorage 사용 */
    let jsonData = tempJsonData
    // const dataArray = _.cloneDeep(jsonData.data)
    // for (let i = 0; i < 10; i++) {
    //   jsonData.data = jsonData.data.concat(dataArray)
    // }

    if (localStorage.getItem('tempItem')) {
      jsonData = JSON.parse(localStorage.getItem('tempItem'))
    } else {
      jsonData = tempJsonData
      // const tempData = tempJsonData.data
      // for (let i = 0; i < 1000; i++) {
      //   jsonData.data = tempData.concat(tempData)
      // }
      localStorage.setItem('tempItem', JSON.stringify(jsonData))
    }

    /** 임시코드 filter */
    if (type === 'memo') {
      jsonData.data = jsonData.data.filter((data) => data.etc !== '')
    } else if (type === 'error') {
      jsonData.data = jsonData.data.filter((data) => data.errYn === 'Y')
    } else if (type === 'pre') {
      // 선정산일 경우 별도 리스트를 가짐
      // 체크인과 체크아웃 달이 다름
      jsonData.data = jsonData.data.filter((data) => {
        const ciYmd = moment(data.ciYmd)
        const coYmd = moment(data.coYmd)

        return !ciYmd.isSame(coYmd, 'month')
      })
    } else if (type === 'adj') {
      jsonData.data = jsonData.data.filter((data) => data.adjYn === 'Y')
    } else if (type === 'exclusion') {
      jsonData.data = jsonData.data.filter((data) => data.exclusionYn === 'Y')
    }

    store.dispatch('settings/setNowLoading', true)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(jsonData)
        store.dispatch('settings/setNowLoading', false)
      }, 1000)
    })
  },

  /**
   * @returns 객실 정산 분류 작업 수행
   */
  addCalculateType (itemList) {
    store.dispatch('settings/setNowLoading', true)
    return new Promise(() => {
      setTimeout(() => {
        const jsonData = JSON.parse(localStorage.getItem('tempItem'))
        jsonData.data = itemList
        localStorage.setItem('tempItem', JSON.stringify(jsonData))
        store.dispatch('settings/setNowLoading', false)
      }, 1000)
    })
  },

  /**
   * @returns 객실 정산 분류 취소
   */
  deleteCalculateType (itemList, type) {
    store.dispatch('settings/setNowLoading', true)
    return new Promise((resolve) => {
      setTimeout(() => {
        const jsonData = JSON.parse(localStorage.getItem('tempItem'))
        jsonData.data.forEach((data) => {
          itemList.forEach((item) => {
            if (data.id === item.id) {
              data.typeYn = 'N'
              if (type === 'error') {
                data.errYn = 'N'
              } else if (type === 'adj') {
                data.adjYn = 'N'
              } else if (type === 'exclusion') {
                data.exclusionYn = 'N'
              }
            }
          })
        })
        localStorage.setItem('tempItem', JSON.stringify(jsonData))

        resolve(jsonData)
        store.dispatch('settings/setNowLoading', false)
      }, 1000)
    })
  },

  /**
   * @returns 정산 메모 수정
   */
  updateCalculateMemo (item) {
    const jsonData = JSON.parse(localStorage.getItem('tempItem'))
    jsonData.data.forEach((data) => {
      data.etc = data.id === item.id ? item.etc : data.etc
    })
    localStorage.setItem('tempItem', JSON.stringify(jsonData))

    return new Promise((resolve) => {
      resolve(jsonData)
    })
  }
}

export default roomTypeCalculateService
