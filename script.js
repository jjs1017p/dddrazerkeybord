// 타이머 시작일 설정
const startDate = new Date('2024-08-12T00:00:00');
// 98주 후를 종료일로 설정
let endDate = new Date(startDate.getTime() + (98 * 7 * 24 * 60 * 60 * 1000));

// 초기 소유 금액
let balance = parseFloat(localStorage.getItem('balance')) || 0;

// 저장된 금액과 코드 저장을 위한 객체
let savedData = JSON.parse(localStorage.getItem('savedData')) || {};

// 1주일의 밀리초
const oneWeekInMs = 1000 * 60 * 60 * 24 * 7;

// 1원당 타이머에서 차감되는 밀리초
const reductionPerYen = oneWeekInMs / 195000;

// 타이머를 업데이트하는 함수
function updateTimer() {
    const now = new Date();
    const adjustedEndDate = new Date(endDate.getTime() - (balance * reductionPerYen));

    // 남은 시간 계산
    const totalSeconds = Math.floor((adjustedEndDate - now) / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('timer').innerHTML = `
        남은 시간: ${days}일 ${hours}시간 ${minutes}분 ${seconds}초<br>
        목표 날짜: ${adjustedEndDate.toLocaleDateString()}
    `;
}

// 금액 추가 함수
function addAmount() {
    const input = document.getElementById('amountInput').value;
    const addedAmount = parseInt(input, 10);

    if (!isNaN(addedAmount) && addedAmount > 0) {
        balance += addedAmount;
        document.getElementById('balance').innerText = `소유 금액: ${balance.toLocaleString()}원`;
        localStorage.setItem('balance', balance); // balance 저장

        // 입력 필드 비우기
        document.getElementById('amountInput').value = ''; 

        // 타이머 업데이트
        updateTimer();
    }
}

// 소유 금액 저장 함수
function saveAmount() {
    const randomCode = Math.floor(10 + Math.random() * 90); // 2자리 랜덤 숫자 생성
    savedData[randomCode] = balance; // 2자리 랜덤 숫자를 키로, 소유 금액을 값으로 저장
    localStorage.setItem('savedData', JSON.stringify(savedData)); // localStorage에 저장
    document.getElementById('saveMessage').innerText = `저장됨! 코드: ${randomCode}`;
}

// 저장된 소유 금액 불러오기 함수
function retrieveAmount() {
    const inputCode = document.getElementById('retrieveInput').value;
    const retrievedAmount = savedData[inputCode];

    if (retrievedAmount !== undefined) {
        document.getElementById('retrievedAmount').innerText = `저장된 금액: ${retrievedAmount.toLocaleString()}원`;
    } else {
        document.getElementById('retrievedAmount').innerText = "저장된 금액을 찾을 수 없습니다.";
    }
}

// 소유 금액 초기화 함수
function resetAmount() {
    balance = 0;
    localStorage.setItem('balance', balance);
    document.getElementById('balance').innerText = `소유 금액: 0원`;
    updateTimer();
}

// 키보드 소리 재생 함수
function playSound(key) {
    const sound = new Audio(`./sounds/${key}.mp3`);
    sound.play();
}

// 이벤트 리스너 추가
document.querySelectorAll('.key').forEach(keyElement => {
    keyElement.addEventListener('click', () => {
        const key = keyElement.innerText.toLowerCase();
        playSound(key);
    });
});

// 키보드 입력 시 소리 재생
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const validKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    
    if (validKeys.includes(key)) {
        playSound(key);
    }
});

// 타이머 업데이트를 1초마다 실행
setInterval(updateTimer, 1000);

// 페이지 로드 시 초기 상태 업데이트
document.getElementById('balance').innerText = `소유 금액: ${balance.toLocaleString()}원`;
updateTimer();
