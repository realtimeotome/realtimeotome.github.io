<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>realtimeotom3 - START</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/neodgm/neodgm-webfont@1.530/neodgm/style.css">
    <link href="https://cdn.jsdelivr.net/npm/galmuri@latest/dist/galmuri.css" rel="stylesheet">
    <link rel="stylesheet" href="start.css">
</head>
<body>

    <div class="win-wrapper">
        
        <header class="top-bar">
            <div class="top-menu">
                <button class="menu-btn pixel-font" onclick="location.href='index.html'">main</button>
                <button class="menu-btn pixel-font">file</button>
                <button class="menu-btn pixel-font">favorites</button>
                <button class="menu-btn pixel-font">help!</button>
                <button class="menu-btn pixel-font">lucky?</button>
                <button class="menu-btn pixel-font" id="btn-chat">chat♡</button>
            </div>
        </header>
        
        <div class="menu-bar">
            <div class="address-label pixel-font">Address</div>
            <input type="text" class="address-field pixel-font" placeholder="file:///C:/realtimeotome/start.html" readonly>
            <div class="address-dropdown-btn pixel-font">▼</div>
        </div>
        <main class="main-layout">
            
            <div class="left-col panel-raised">
                <div class="img-box panel-sunken galmuri-font">img</div>
                
                <div class="profile-section">
                    <div class="y2k-title-bar pixel-font">// ABOUT_ME</div>
                    <div class="status-box panel-sunken galmuri-font">
                        <div class="stat-line">◆ NAME: <span class="editable">Anonymous</span></div>
                        <div class="stat-line">✦ LV: <span class="editable">99</span></div>
                        
                        <div class="stat-line" style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <span>♥ HP</span>
                                <span id="hp-blocks" style="color: #3cd6ff; letter-spacing: -1px; cursor: pointer; user-select: none;">■■■■■</span>
                                <span id="hp-val" style="display: none;">100</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <span>★ MP</span>
                                <span id="mp-blocks" style="color: #87b4e6; letter-spacing: -1px; cursor: pointer; user-select: none;">■■■□□</span>
                                <span id="mp-val" style="display: none;">060</span>
                            </div>
                        </div>
                        
                        <div class="stat-line" style="display: flex; align-items: center; gap: 5px; margin-top: 2px;">
                            ● MOOD: 
                            <select class="retro-select galmuri-font">
                                <option>[ Sleep Mode ]</option>
                                <option>[ System Normal ]</option>
                                <option>[ Archiving... ]</option>
                                <option>[ Error 404 ]</option>
                            </select>
                        </div>
                        
                        <div class="stat-line" style="margin-top: 2px;">■ SYNC: <span class="editable">2026.07.15</span></div>
                    </div>
                </div>

                <div class="etched-line"></div>

                <div class="profile-section">
                    <div class="y2k-title-bar pixel-font">// NOW_PLAYING</div>
                    <div class="media-box panel-sunken galmuri-font">
                        
                        <div class="lcd-screen panel-sunken">
                            <marquee id="marquee-text" scrollamount="4" class="galmuri-font" style="width: 100%;">PLAYING: 少女の幻想.mid</marquee>
                        </div>

                        <div class="stat-line" style="display: flex; align-items: center; gap: 5px;">
                            ♪ 
                            <select id="song-select" class="retro-select galmuri-font" style="flex: 1;">
                                <option value="music1.mp3">少女の幻想.mid</option>
                                <option value="music2.mp3">Cyber_Angel.mp3</option>
                                <option value="music3.mp3">System_Error.wav</option>
                            </select>
                        </div>
                        <div class="stat-line">VOL: <span id="vol-blocks" style="cursor: pointer; user-select: none;">■■■■■■■□□□</span></div>
                    </div>
                    <div class="media-controls">
                        <button class="control-btn panel-raised galmuri-font" id="btn-prev">[ &lt;&lt; ]</button>
                        <button class="control-btn panel-raised galmuri-font" id="btn-stop">[ STOP ]</button>
                        <button class="control-btn panel-raised galmuri-font" id="btn-play">[ PLAY ]</button>
                    </div>
                    <audio id="bgm-player" src="music1.mp3" loop></audio>
                </div>

                <div class="etched-line"></div>

                <div class="profile-section command-group">
                    <button id="btn-guestbook" class="action-btn panel-raised galmuri-font">* GUESTBOOK</button>
                    <button class="action-btn panel-raised galmuri-font">* SEND MAIL</button>
                    <button class="action-btn panel-raised galmuri-font" style="color: #cc0000;">! SHUT DOWN</button>
                </div>
            </div>

            <div class="right-col">
                <div class="right-top-box panel-raised"></div>
                
                <div class="right-bottom-split">
                    <fieldset class="retro-groupbox panel-raised">
                        <legend class="galmuri-font box-title">- backup -</legend>
                        <div class="backup-item panel-sunken"></div>
                        <div class="etched-line" style="width: 80%; margin-left: 10%;"></div>
                        <div class="backup-item panel-sunken"></div>
                        <div class="etched-line" style="width: 80%; margin-left: 10%;"></div>
                        <div class="backup-item panel-sunken"></div>
                        <div class="etched-line" style="width: 80%; margin-left: 10%;"></div>
                    </fieldset>

                    <fieldset class="retro-groupbox panel-raised">
                        <legend class="galmuri-font box-title">- archive -</legend>
                        <div class="archive-item">
                            <div class="archive-circle panel-sunken"></div>
                            <div class="archive-line etched-line"></div>
                        </div>
                        <div class="archive-item">
                            <div class="archive-circle panel-sunken"></div>
                            <div class="archive-line etched-line"></div>
                        </div>
                        <div class="archive-item">
                            <div class="archive-circle panel-sunken"></div>
                            <div class="archive-line etched-line"></div>
                        </div>
                    </fieldset>
                </div>
            </div>

        </main>

        <footer class="bottom-bar">
            <div class="start-btn pixel-font" id="resetBtn" style="display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:16px;">reset</div>
            <div id="clock" class="pixel-font">00/00/0000 00:00 PM</div>
        </footer>
        <div id="irc-modal" class="popup-overlay">
            <div class="irc-window panel-raised">
                <div class="irc-header galmuri-font">
                    <span>#GUESTBOOK_IRC</span>
                    <button id="close-irc" class="galmuri-font">X</button>
                </div>
                <div class="irc-chat-box panel-sunken galmuri-font">
                    <div style="color: #888;">*** 서버에 연결되었습니다...</div>
                    <div style="color: #888;">*** Anonymous_1 님이 입장하셨습니다.</div>
                    <div style="margin-top: 5px;"><span style="color: #7289da; font-weight: bold;">&lt;User_0435&gt;</span> 여기 사이트 분위기 미쳤네요 ㄷㄷ</div>
                    <div><span style="color: #9cb4d4; font-weight: bold;">&lt;SYS.OP&gt;</span> 방문을 환영합니다.</div>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 10px;">
                    <input type="text" class="panel-sunken galmuri-font" style="flex: 1; padding: 3px; outline: none;" placeholder="메시지 입력...">
                    <button class="panel-raised galmuri-font" style="padding: 0 10px;">SEND</button>
                </div>
            </div>
        </div>

        <div id="auth-modal" class="popup-overlay">
            <div class="irc-window panel-raised" style="width: 280px;">
                <div class="irc-header galmuri-font">
                    <span># SECURITY_CHECK</span>
                    <button id="close-auth" class="galmuri-font">X</button>
                </div>
                <div class="status-box panel-sunken galmuri-font" style="text-align: center; padding: 20px;">
                    <p style="margin-bottom: 12px; font-weight: bold; color: #cc0000;">[ SYS.OP LOGIN ]</p>
                    <input type="password" id="sys-password" class="panel-sunken galmuri-font" style="width: 100%; padding: 4px; margin-bottom: 15px; outline: none; text-align: center; letter-spacing: 2px;" placeholder="PASSWORD">
                    <button id="auth-submit" class="action-btn panel-raised galmuri-font" style="height: 28px;">[ ENTER ]</button>
                </div>
            </div>
        </div>

    </div>

    <script src="start.js"></script>
</body>
</html>
