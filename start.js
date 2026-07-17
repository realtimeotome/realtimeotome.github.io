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

// 💡 2000년대 감성 찐한 카오모지 대량 추가 완료!
const kaomojis = [
    // 😴 기본/수면/일상
    "( - _ - ) zzz", "(/_ _ )/", "(´-ω-`)", "(*¯︶¯*)", "(￣▽￣)", 
    // 😊 기쁨/애교/인사
    "＼(ﾟｰﾟ＼)", "(*^▽^*)", "( ˘ ³˘)♥", "٩(◕‿◕｡)۶", "(✯◡✯)", 
    "(✧ω✧)", "(≧◡≦)", "(´｡• ω •｡`)", "(o^▽^o)", "╰(*´︶`*)╯", 
    "(*・ω・)ﾉ", "(^人^)", "(〃＾▽＾〃)", "♡( ◡‿◡ )",
    // 😢 슬픔/당황/머쓱
    "¯\\_(ツ)_/¯", "( ╥ω╥ )", "(´･ω･`)", "(Ｔ▽Ｔ)", "(ಥ﹏ಥ)", 
    "( ；∀；)", "(⊙_⊙)", "(°ロ°)", "Σ(°ロ°)", "(⇀‸↼‶)",
    // 😡 분노/전투/광기
    "(ﾒ` ﾛ ´)", "(╬ Ò﹏Ó)", "(ノ°益°)ノ", "(ꐦ ಠ皿ಠ)", "(ง'̀-'́)ง", 
    "(╯°□°）╯︵ ┻━┻", "┬─┬ノ( º _ ºノ)", "( ಠ 益 ಠ )",
    // 🐱 동물/기타
    "(=^･ω･^=)", "ʕ •ᴥ• ʔ", "(´• ω •`)ﾉ", "／(･ × ･)＼", "(・`ω´・)"
];

const kaomojiDisplay = document.getElementById('kaomoji-display');
const btnKaomoji = document.getElementById('btn-kaomoji');

if (btnKaomoji && kaomojiDisplay) {
    btnKaomoji.addEventListener('click', () => {
        const randomIcon = kaomojis[Math.floor(Math.random() * kaomojis.length)];
        kaomojiDisplay.innerText = randomIcon;
    });
}

const audio = document.getElementById('bgm-player');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPrev = document.getElementById('btn-prev');
const volBlocks = document.getElementById('vol-blocks');
const songSelect = document.getElementById('song-select');
const marqueeText = document.getElementById('marquee-text');

songSelect.addEventListener('change', function() {
    const wasPlaying = !audio.paused; 
    audio.src = this.value; 
    audio.load();
    const selectedTitle = this.options[this.selectedIndex].text;
    marqueeText.innerText = "PLAYING: " + selectedTitle;
    if (wasPlaying) { audio.play().catch(e => console.log("파일 대기중")); }
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

const btnGuestbook = document.getElementById('btn-guestbook');
const ircModal = document.getElementById('irc-modal');
const closeIrcBtn = document.getElementById('close-irc');

btnGuestbook.addEventListener('click', () => { ircModal.style.display = 'flex'; });
closeIrcBtn.addEventListener('click', () => { ircModal.style.display = 'none'; });
ircModal.addEventListener('click', (e) => { if (e.target === ircModal) { ircModal.style.display = 'none'; } });

const resetBtn = document.getElementById('resetBtn');
const resetPopupOverlay = document.getElementById('resetPopupOverlay');
const resetPopup = document.getElementById('resetPopup');
const closePopupBtn = document.getElementById('closePopupBtn');
const popupMessage = document.getElementById('popupMessage');
const popupOkBtn = document.getElementById('popupOkBtn');
const screenWrapper = document.getElementById('screen-wrapper'); 

let isCursed = false;

const cursedMessages = [
    { text: "당신의 세계는 당신을 기다리고 있습니다. 당신의 기억의 모든 흔적들은 오버라이트(덮어쓰기) 됩니다. 당신은 정말로 돌아가는 것에 대해 확신합니까?", btn: "실행" },
    { text: "あなたの世界はあなたを待っています。あなたの記憶のすべての痕跡は上書きされます。あなたは本当に戻ることを確信していますか？", btn: "実行" },
    { text: "Deine Welt wartet auf dich. Alle Spuren deiner Erinnerung werden überschrieben. Bist du sicher, dass du zurückkehren willst?", btn: "Ausführen" },
    { text: "Ton monde t'attend. Toutes les traces de ta mémoire seront écrasées. Es-tu sûr de vouloir y retourner ?", btn: "Exécuter" },
    { text: "Твой мир ждет тебя. Все следы твоей памяти будут перезаписаны. Ты уверен, что хочешь вернуться?", btn: "Выполнить" }
];

if (resetBtn && resetPopupOverlay) {
    resetBtn.addEventListener('click', () => {
        resetPopupOverlay.style.display = 'flex';
        isCursed = false;
        popupMessage.classList.remove('cursed');
        popupMessage.innerText = "Your world is waiting for you. All traces of your memory will be overwritten. Are you sure you want to go back?";
        popupOkBtn.innerText = "OK";
    });

    closePopupBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        resetPopupOverlay.style.display = 'none';
    });

    resetPopup.addEventListener('dblclick', () => {
        isCursed = true;
        popupMessage.classList.add('cursed');
        
        const randomIndex = Math.floor(Math.random() * cursedMessages.length);
        const selected = cursedMessages[randomIndex];

        popupMessage.innerText = selected.text;
        popupOkBtn.innerText = selected.btn;
    });

    popupOkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        screenWrapper.classList.add('tv-off-active'); 
    });
}
