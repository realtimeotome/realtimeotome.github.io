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

const audio = document.getElementById('bgm-player');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPrev = document.getElementById('btn-prev');
const volBlocks = document.getElementById('vol-blocks');
const songSelect = document.getElementById('song-select');

songSelect.addEventListener('change', function() {
    const wasPlaying = !audio.paused; 
    audio.src = this.value; 
    audio.load();
    if (wasPlaying) {
        audio.play().catch(e => console.log("파일 대기중"));
    }
});

let currentVolume = 0.7;
audio.volume = currentVolume;

volBlocks.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const clickX = e.clientX - rect.left; 
    const width = rect.width;             
    const pct = clickX / width;           
    
    let volLevel = Math.min(Math.max(Math.round(pct * 10), 0), 10);
    
    audio.volume = volLevel / 10;
    this.innerText = '■'.repeat(volLevel) + '□'.repeat(10 - volLevel);
});

btnPlay.addEventListener('click', () => { audio.play().catch(e => console.log("파일 없음")); });
btnStop.addEventListener('click', () => { audio.pause(); audio.currentTime = 0; });
btnPrev.addEventListener('click', () => {
    audio.currentTime = 0; 
    if (audio.paused) { audio.play().catch(e => console.log("파일 없음")); }
});

// =====================================
// 💡 신규: GUESTBOOK IRC 팝업 로직
// =====================================
const btnGuestbook = document.getElementById('btn-guestbook');
const ircModal = document.getElementById('irc-modal');
const closeIrcBtn = document.getElementById('close-irc');

btnGuestbook.addEventListener('click', () => {
    ircModal.style.display = 'flex'; // 팝업 열기
});

closeIrcBtn.addEventListener('click', () => {
    ircModal.style.display = 'none'; // 팝업 닫기
});

// 검은 배경 클릭 시 닫기 (선택 사항)
ircModal.addEventListener('click', (e) => {
    if (e.target === ircModal) {
        ircModal.style.display = 'none';
    }
});
