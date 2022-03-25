import api from "Api"
// (woojung)



// 상품카테고리 - 상품구분 - 지역 리스트 만들기
const getStoreList = (param) => {
  const storeList = []
  for (const row of param) {
    const store = storeList.find(data => data.parentKey === row.parentKey)
    if (store) {
      // child 검사
      const child = store.children.find(data => data.childKey === row.childKey)
      if (!child) {
        store.children.push({ childNm: row.childNm, childKey: row.childKey })
      }
    } else {
      const addRow = { parentNm: row.parentNm, parentKey: row.parentKey, children: [] }
      addRow.children.push({ childNm: row.childNm, childKey: row.childKey })
      storeList.push(addRow)
    }
  }
  return storeList
}

// 상품카테고리 - 카테고리별 리스트 만들기
const getCategoryList = (param) => {
  const categoryList = []
  for (const row of param) {
    const category = categoryList.find(data => data.value === row.value)
    if (!category) {
      categoryList.push({ value: row.value, label: row.label })
    }
  }
  return categoryList
}

// 차트 기간 카테고리 생성
const getChartPeriod = (param) => {
  const searchType = param.searchType
  const searchPeriod = []
  if (searchType === 'D') {
    const searchFrom = param.searchFromDate
    const searchTo = param.searchToDate
    const diff = moment(searchTo).diff(moment(searchFrom), 'days')
    for (let index = 0; index <= diff; index++) {
      searchPeriod.push(moment(searchFrom).add(index, 'days').format('YYYY-MM-DD'))
    }
  } else if (searchType === 'M') {
    const searchFrom = param.searchFromMonth
    const searchTo = param.searchToMonth
    const diff = moment(searchTo).diff(moment(searchFrom), 'months')
    for (let index = 0; index <= diff; index++) {
      searchPeriod.push(moment(searchFrom).add(index, 'months').format('YYYY-MM'))
    }
  } else {
    const searchFrom = param.searchFromYear
    const searchTo = param.searchToYear
    const diff = moment(searchTo).diff(moment(searchFrom), 'years')
    for (let index = 0; index <= diff; index++) {
      searchPeriod.push(moment(searchFrom).add(index, 'years').format('YYYY[년]'))
    }
  }
  return searchPeriod
}

const makeCommonChartData = (param, chartData, title, includeKey = false) => {
  // 차트 기간 카테고리 만들기
  const searchPeriod = getChartPeriod(param)
  // 상품카테고리 만들기
  const categoryList = getCategoryList(chartData)
  // 판매 차트데이터 만들기
  const format = param.searchType === 'D' ? 'YYYYMMDD' : param.searchType === 'M' ? 'YYYYMM' : 'YYYY'
  const saleData = { series: [], categories: searchPeriod, list: [], title, kind: param.saleKind === 'S' ? '판매' : param.saleKind === 'U' ? '사용' : '취소' }
  for (const category of categoryList) {
    const row = { name: category.label, data: [] }
    for (const period of searchPeriod) {
      // 해당 데이터 filter
      const stndYmd = moment(period, format).format(format)
      const filterData = chartData.filter(data => data.stndYmd === stndYmd && data.value === category.value)
      row.data.push({
        name: period,
        cnt: filterData.reduce((sum, data) => sum + data.qty || 0, 0),
        amt: filterData.reduce((sum, data) => sum + data.amt || 0, 0) / 1000
      })
    }
    saleData.series.push(row)
  }
  // 표 데이터 만들기
  for (const category of categoryList) {
    const filterData = chartData.filter(data => data.value === category.value)
    const name = !includeKey ? category.label : category.label + '<br/>[ ' + category.value + ' ]'
    const amtRow = { name, label: saleData.kind + '금액 (천원)', data: [] }
    const cntRow = { label: saleData.kind + '수량 (건)', data: [] }
    for (const period of searchPeriod) {
      const stndYmd = moment(period, format).format(format)
      const findPeriod = filterData.find(data => data.stndYmd === stndYmd) || { amt: 0, qty: 0 }
      amtRow.data.push(findPeriod.amt / 1000)
      cntRow.data.push(findPeriod.qty)
    }
    saleData.list.push(amtRow)
    saleData.list.push(cntRow)
  }
  return saleData
}

const statisticsService = {

  /**
   * 통계 담당자 리스트 조회
   */
  async selectChrgList () {
    const res = await api.get('/api/social/statistics/chrgList')
    return res.data || []
  },

  /**
   * 통계 채널 리스트 조회
   */
  async selectChnnlList () {
    const res = await api.get('/api/social/statistics/chnnlList')
    return res.data || []
  },

  /**
   * 통계 우대번호 리스트 조회
   */
  selectTicketList (param) {
    return api.get('/api/social/statistics/ticketList', {
      params: param
    })
  },

  /**
   * 통계 파트너 리스트 조회
   */
  async selectPtnrList () {
    const res = await api.get('/api/social/statistics/ptnrList')
    return res.data || []
  },

  /**
   * 지역별 조회
   */
  async selectSocialRegionStatistics (param) {
    const res = await api.post('/api/social/statistics/regionChart', param)
    const chartData = res.data || []
    // 차트 기간 카테고리 만들기
    const searchPeriod = getChartPeriod(param)
    // 상품카테고리 - 지역리스트 만들기
    const storeList = getStoreList(chartData)
    // 판매 차트데이터 만들기
    const format = param.searchType === 'D' ? 'YYYYMMDD' : param.searchType === 'M' ? 'YYYYMM' : 'YYYY'
    const title = '지역별'
    const saleData = { series: [], drilldown: [], categories: searchPeriod, list: [], title, kind: param.saleKind === 'S' ? '판매' : param.saleKind === 'U' ? '사용' : '취소' }
    for (const store of storeList) {
      const row = { name: store.parentNm, data: [] }
      for (const period of searchPeriod) {
        const drillId = store.parentKey + '_' + period
        // 해당 데이터 filter
        const stndYmd = moment(period, format).format(format)
        const filterStore = chartData.filter(data => data.stndYmd === stndYmd && data.parentNm === store.parentNm)
        row.data.push({
          name: period,
          drilldown: drillId,
          cnt: filterStore.reduce((sum, data) => sum + data.qty || 0, 0),
          amt: filterStore.reduce((sum, data) => sum + data.amt || 0, 0) / 1000
        })
        // drill down 셋팅
        const drillData = { name: store.parentNm, id: drillId, data: [] }
        for (const child of store.children) {
          const filterChild = filterStore.find(data => data.childKey === child.childKey) || { qty: 0, amt: 0 }
          drillData.data.push({ name: child.childNm + ' ( ' + period + ' )', cnt: filterChild.qty, amt: filterChild.amt / 1000, period: period })
        }
        saleData.drilldown.push(drillData)
      }
      saleData.series.push(row)
    }
    // 표 데이터 만들기
    for (const store of storeList) {
      let includeStore = false
      const filterParents = chartData.filter(data => data.parentKey === store.parentKey)
      for (const child of store.children) {
        const filterChildren = filterParents.filter(data => data.childKey === child.childKey)
        const amtRow = { name: child.childNm, label: saleData.kind + '금액 (천원)', data: [] }
        const cntRow = { label: saleData.kind + '수량 (건)', data: [] }
        if (!includeStore) {
          amtRow.parent = store.parentNm
          amtRow.rowSpan = store.children.length * 2
          includeStore = true
        }
        for (const period of searchPeriod) {
          const findPeriod = filterChildren.find(data => data.stndYmd === moment(period, format).format(format)) || { amt: 0, qty: 0 }
          amtRow.data.push(findPeriod.amt / 1000)
          cntRow.data.push(findPeriod.qty)
        }
        saleData.list.push(amtRow)
        saleData.list.push(cntRow)
      }
    }
    return saleData
  },

  /**
   * 채널별 조회
   */
  async selectSocialChannelStatistics (param) {
    const res = await api.post('/api/social/statistics/channelChart', param)
    return makeCommonChartData(param, res.data || [], '채널별', false)
  },

  /**
   * 파트너별 조회
   */
  async selectSocialPartnerStatistics (param) {
    const res = await api.post('/api/social/statistics/partnerChart', param)
    return makeCommonChartData(param, res.data || [], '파트너별', false)
  },

  /**
   * 티켓별 조회
   */
  async selectSocialTicketStatistics (param) {
    const res = await api.post('/api/social/statistics/ticketChart', param)
    return makeCommonChartData(param, res.data || [], '우대번호별', true)
  },

  /**
   * 전체 통계
   */
  async selectSocialTotalStatistics (param) {
    const res = await api.post('/api/social/statistics/totalChart', param)
    return res.data
  },

  /**
   * 통계 데이터 입력
   */
  async insertStatistics (param) {
    const res = await api.post('/api/social/statistics/insert', param)
    return res.data
  }
}

export default statisticsService
