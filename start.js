// =====================================
// 1. 시스템 하단 시계 업데이트
// =====================================
function updateClock() {
    const now = new Date();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let year = now.getFullYear();

    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    const dateStr = month + '/' + date + '/' + year;

    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = hours + ':' + minutes + ' ' + ampm;

    document.getElementById('clock').innerHTML = dateStr + ' ' + timeStr;
}
setInterval(updateClock, 1000);
updateClock();


// =====================================
// 2. 더블클릭 시스템 변조 (해킹) 기믹
// =====================================
const editables = document.querySelectorAll('.editable');

editables.forEach(el => {
    // 텍스트를 더블클릭했을 때 수정 모드로 전환
    el.addEventListener('dblclick', function() {
        this.setAttribute('contenteditable', 'true'); // 수정 가능하게 만듦
        this.setAttribute('spellcheck', 'false'); // 빨간줄 안 뜨게 방지
        this.focus(); // 커서 올리기
    });

    // 엔터키 누르면 수정 완료하고 빠져나오기
    el.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // 줄바꿈 방지
            this.blur(); // 포커스 해제
        }
    });

    // 마우스로 다른 곳을 클릭해서 포커스를 잃었을 때 수정 모드 끄기
    el.addEventListener('blur', function() {
        this.setAttribute('contenteditable', 'false');
    });
});


// =====================================
// 3. 미디어 플레이어 작동 로직
// =====================================
const audio = document.getElementById('bgm-player');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPrev = document.getElementById('btn-prev'); // ⏪ 되감기용

// 재생 버튼
btnPlay.addEventListener('click', () => {
    audio.play();
});

// 정지 버튼
btnStop.addEventListener('click', () => {
    audio.pause();
});

// 되감기 버튼 (처음부터 다시 재생)
btnPrev.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0; // 재생 시간을 0초로 돌림
    audio.play();
});
