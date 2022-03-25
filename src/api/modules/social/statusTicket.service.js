export default {

  /**
     * 상황별 우대번호 조회 임시
     */
  selectStatusTicketList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          {
            a: '[리조트] 여행창조 대명 오션월드 로우시즌 특가 (11/21) (11/19) ',
            b: '1',
            c: 25000,
            d: '2019-11-21 00:00:00 ~ 2019-12-01 23:59:59',
            e: '2020-01-01 ~ 2020-12-31',
            f: '2019-11-21 ~ 2020-01-03',
            g: 1
          },
          {
            a: '[리조트] 여행창조 강원 대명 비발디파크 스노위랜드 (11/21) (11/19) ',
            b: '',
            c: '',
            d: '2019-11-21 00:00:00 ~ 2019-12-01 23:59:59',
            e: '2020-01-01 ~ 2020-12-31',
            f: '2019-11-21 ~ 2020-01-03',
            g: 3
          },
          {
            a: '[리조트] 여행창조 대명 오션월드 로우시즌 특가 (11/21) (11/19) ',
            b: '3',
            c: 80000,
            d: '2019-11-21 00:00:00 ~ 2019-12-01 23:59:59',
            e: '2020-01-01 ~ 2020-12-31',
            f: '2019-11-21 ~ 2020-01-03',
            g: 2
          }
        ]
      })
    })
  }
}
