export default {

  /**
     * 종류구분코드 조회 임시
     */
  selectTypeDivCode (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { typeDivCode: '01', typeDivCodeName: '코드 01' },
          { typeDivCode: '02', typeDivCodeName: '코드 02' },
          { typeDivCode: '03', typeDivCodeName: '코드 03' },
          { typeDivCode: '04', typeDivCodeName: '코드 04' },
          { typeDivCode: '05', typeDivCodeName: '코드 05' },
          { typeDivCode: '06', typeDivCodeName: '코드 06' }
        ]
      })
    })
  },

  /**
     * DGNS 우대번호 번호 조회 임시
     */
  selectDgnsTicketList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { a: '1', pvlTicketNo: '40002020', c: '00001', d: '우대번호 테스트', e: '2020-01-01', f: '2020-12-31', g: 'Y', h: '사용불가', i: '비고 테스트 비고', j: '' },
          { a: '2', pvlTicketNo: '40002020', c: '00002', d: '우대번호 테스트', e: '2020-01-01', f: '2020-12-31', g: 'Y', h: '사용불가', i: '비고 테스트 비고', j: '' },
          { a: '3', pvlTicketNo: '40002020', c: '00003', d: '우대번호 테스트', e: '2020-01-01', f: '2020-12-31', g: 'Y', h: '사용불가', i: '비고 테스트 비고', j: '' },
          { a: '4', pvlTicketNo: '40002020', c: '00004', d: '우대번호 테스트', e: '2020-01-01', f: '2020-12-31', g: 'Y', h: '사용불가', i: '비고 테스트 비고', j: '' },
          { a: '5', pvlTicketNo: '40002020', c: '00005', d: '우대번호 테스트', e: '2020-01-01', f: '2020-12-31', g: 'Y', h: '사용불가', i: '비고 테스트 비고', j: '' }
        ]
      })
    })
  }
}
