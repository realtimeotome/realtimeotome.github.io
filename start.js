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
// 이제 노래 제목은 드롭다운이므로, NAME, LV, HP, MP 등만 해킹 가능
const editables = document.querySelectorAll('.editable');

editables.forEach(el => {
    el.addEventListener('dblclick', function() {
        this.setAttribute('contenteditable', 'true');
        this.setAttribute('spellcheck', 'false');
        this.focus();
    });

    el.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur();
        }
    });

    el.addEventListener('blur', function() {
        this.setAttribute('contenteditable', 'false');
    });
});

// =====================================
// 3. 미디어 플레이어 작동 로직 (재생, 정지, 되감기, 볼륨, 곡 선택)
// =====================================
const audio = document.getElementById('bgm-player');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPrev = document.getElementById('btn-prev');
const volBlocks = document.getElementById('vol-blocks');
const songSelect = document.getElementById('song-select');

// 💡 재생 목록에서 다른 곡을 골랐을 때
songSelect.addEventListener('change', function() {
    const wasPlaying = !audio.paused; // 원래 재생 중이었는지 확인
    audio.src = this.value; // 선택한 <option>의 value 값으로 오디오 소스 변경
    audio.load();
    
    // 원래 재생 중이었다면 곡이 바뀌자마자 바로 재생!
    // (지금은 실제 파일이 없으므로 콘솔에 에러 안 뜨게 catch 처리해둠)
    if (wasPlaying) {
        audio.play().catch(e => console.log("아직 파일이 없어서 재생 대기중입니다!"));
    }
});

// 초기 볼륨 설정 (70%로 설정)
let currentVolume = 0.7;
audio.volume = currentVolume;

// 💡 텍스트 클릭식 볼륨 조절 구현
volBlocks.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const clickX = e.clientX - rect.left; 
    const width = rect.width;             
    const pct = clickX / width;           
    
    let volLevel = Math.min(Math.max(Math.round(pct * 10), 0), 10);
    
    audio.volume = volLevel / 10;
    this.innerText = '■'.repeat(volLevel) + '□'.repeat(10 - volLevel);
});

// ▶ [ PLAY ]
btnPlay.addEventListener('click', () => {
    audio.play().catch(e => console.log("아직 엠피쓰리 파일이 연결되지 않았습니다!"));
});

// ⏹ [ STOP ] 
btnStop.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0; 
});

// ⏪ [ << ]
btnPrev.addEventListener('click', () => {
    audio.currentTime = 0; 
    if (audio.paused) {
        audio.play().catch(e => console.log("파일 없음"));
    }
});
