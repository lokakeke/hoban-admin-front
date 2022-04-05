export default {

  /**
     * 객실 PKG 판매대상 업체목록 조회 - 임시
     */
  selectPackageSellerList (param) {
    return new Promise((resolve) => {
      resolve({
        data: [
          { partnerName: '여행창조', sellYn: 'Y' },
          { partnerName: '콘도24', sellYn: 'N' },
          { partnerName: '호텔패키지', sellYn: 'N' }
        ]
      })
    })
  }

}
