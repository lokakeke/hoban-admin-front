<template>
    <dialog-base :instance="instance" :title="'비밀번호 정책안내'">
        <v-row dense>
<!--            <v-col cols="12">
                <v-card outlined pa-2>
                    <v-card-subtitle>
                        개인정보의 기술적,관리적보호조치기준 제4조 제7항 내지 제8항 및 전자금융감독규정 제32조 내지 제33조에 의거하여 Password 관리 수중에 맞게 변경되었습니다.
                        이와 관령하여 Password 관리 정책이 아래과 같이 변경되오니 업무에 참고하시기 바랍니다.
                    </v-card-subtitle>
                </v-card>
            </v-col>-->
            <v-col cols="12">
                <v-card outlined>
                    <v-card-text>
                        <div class="subtitle-1 purple--text text--lighten-1">
                            1. Password 체계 안내사항
                        </div>
                        <div class="body-2 pl-2">
                            <ol>
                                <li>
                                    Password 는 <span class="font-weight-bold">영문, 숫자, 특수문자를 혼합하여 8자리 이상 16자리 이하</span>로
                                    만들어 주세요.
<!--                                    <div class="red&#45;&#45;text">* 사용 가능 특수문자: ~,!, @, #, $, %, ^, &, *, (, )</div>-->
                                </li>
                                <li>
                                    Password 유효기간은 90일입니다. (권장사항)
                                </li>
                                <li>
                                    <div>임시 Password 최대 사용기간은 24시간입니다.</div>
                                    <span class="red--text">* 임시 Password: </span> 최초 발급 시 부여 받은 패스워드 또는 비밀번호 잠김 시 인증 후
                                    재부여 받은 패스워드
                                </li>
<!--                                <li>
                                    사업자번호, 사원번호, ID, 전화번호, E-MAIL 등 개인신상정보와 관련된 정보는 3자리 초과하여 중복 사용 하실 수 없습니다.
                                </li>-->
<!--                                <li>
                                    <div>연속된 숫자, 연속된 문자 또는 동일한 숫자는 3자리 초과 중복하여 사용 하실 수 없습니다.</div>
                                    <div>* 예시</div>
                                    <ul>
                                        <li>연속된 숫자: 123 등 연속된 숫자 사용불가</li>
                                        <li>연속된 문자: ㄱㄴㄷ/ABC 등 연속된 문자 사용불가</li>
                                        <li>동일한 숫자: 111/333등 동일한 숫자 사용불가</li>
                                    </ul>
                                </li>-->
                            </ol>
                        </div>
                        <div class="subtitle-1 purple--text text--lighten-1">
                            2. Password 변경 시 주의사항
                        </div>
                        <div class="body-2 pl-2">
                            <ol>
<!--                                <li>
                                    이전에 사용한 비밀번호는 사용 하실 수 없습니다. (과거 4회분)
                                </li>-->
                                <li>
                                    비밀번호 5회 입력 오류 시 잠김 상태로 설정됩니다.
                                </li>
<!--                                <li>
                                    사전에 있는 단어는 사용을 자제하여 주시기 바랍니다. (ex_ love, password 등)
                                </li>-->
                            </ol>
                        </div>
<!--                        <div class="subtitle-1 purple&#45;&#45;text text&#45;&#45;lighten-1">
                            3. 비고
                        </div>
                        <div class="body-2 pl-2">
                            <ol>
                                <li>
                                    정책 제정일자: 2012. 06. 28
                                </li>
                                <li>
                                    정책 개정일자: 2016. 03. 24
                                </li>
                            </ol>
                        </div>-->
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <template v-slot:actions>
            <v-btn outlined color="warning" @click="close">
                <v-icon left>close</v-icon>
                닫기
            </v-btn>
        </template>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'PasswordPolicy'
}
</script>
