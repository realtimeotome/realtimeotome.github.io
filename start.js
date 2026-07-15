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
    el.addEventListener('dblclick', function() {
        this.setAttribute('contenteditable', 'true');
        this.setAttribute('spellcheck', 'false');
        this.focus();
    });
    el.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); this.blur(); }
    });
    el.addEventListener('blur', function() {
        this.setAttribute('contenteditable', 'false');
    });
});

// =====================================
// 3. 미디어 플레이어 및 전광판 동기화 로직
// =====================================
const audio = document.getElementById('bgm-player');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPrev = document.getElementById('btn-prev');
const volBlocks = document.getElementById('vol-blocks');
const songSelect = document.getElementById('song-select');
const marqueeText = document.getElementById('marquee-text'); // 💡 신규 추가됨

// 💡 재생 목록에서 곡 변경 시 전광판 텍스트와 실제 플레이어 동시 업데이트
songSelect.addEventListener('change', function() {
    const wasPlaying = !audio.paused; 
    audio.src = this.value; 
    audio.load();
    
    // 💡 전광판 글씨 실시간 변경 기믹
    const selectedTitle = this.options[this.selectedIndex].text;
    marqueeText.innerText = "PLAYING: " + selectedTitle;
    
    if (wasPlaying) {
        audio.play().catch(e => console.log("파일 대기중"));
    }
});

// 초기 볼륨 설정 (70%로 설정)
let currentVolume = 0.7;
audio.volume = currentVolume;

// 텍스트 클릭식 볼륨 조절 구현
volBlocks.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const clickX = e.clientX - rect.left; 
    const width = rect.width;             
    const pct = clickX / width;           
    
    let volLevel = Math.min(Math.max(Math.round(pct * 10), 0), 10);
    
    audio.volume = volLevel / 10;
    this.innerText = '■'.repeat(volLevel) + '□'.repeat(10 - volLevel);
});

// PLAY, STOP, << 버튼 제어
btnPlay.addEventListener('click', () => { audio.play().catch(e => console.log("파일 없음")); });
btnStop.addEventListener('click', () => { audio.pause(); audio.currentTime = 0; });
btnPrev.addEventListener('click', () => {
    audio.currentTime = 0; 
    if (audio.paused) { audio.play().catch(e => console.log("파일 없음")); }
});

// =====================================
// 4. GUESTBOOK IRC 팝업 로직
// =====================================
const btnGuestbook = document.getElementById('btn-guestbook');
const ircModal = document.getElementById('irc-modal');
const closeIrcBtn = document.getElementById('close-irc');

btnGuestbook.addEventListener('click', () => { ircModal.style.display = 'flex'; });
closeIrcBtn.addEventListener('click', () => { ircModal.style.display = 'none'; });
ircModal.addEventListener('click', (e) => { if (e.target === ircModal) { ircModal.style.display = 'none'; } });

// =====================================
// 5. 관리자 전용 CHAT 탭 암호 로직
// =====================================
const btnChat = document.getElementById('btn-chat');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');
const authSubmit = document.getElementById('auth-submit');
const sysPassword = document.getElementById('sys-password');

const SECRET_PW = "0000"; 

btnChat.addEventListener('click', () => {
    authModal.style.display = 'flex';
    sysPassword.value = '';
    sysPassword.focus();
});

closeAuth.addEventListener('click', () => { authModal.style.display = 'none'; });

authSubmit.addEventListener('click', () => {
    if (sysPassword.value === SECRET_PW) {
        location.href = 'ai/';
    } else {
        alert("ACCESS DENIED: 인가되지 않은 사용자입니다.");
        sysPassword.value = '';
        sysPassword.focus();
    }
});

sysPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { authSubmit.click(); }
});
