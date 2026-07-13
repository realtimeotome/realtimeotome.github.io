document.addEventListener("DOMContentLoaded", () => {
    console.log("AI Studio Loaded");

    // 초기 더미 세계관 데이터 세팅
    if(!localStorage.getItem("ai_world_settings")) {
        const dummyWorlds = [
            { id: 1, name: "센티넬 아카데미 (기본)", content: "이곳은 이능력자들이 모인 센티넬 아카데미다. 주기적으로 폭주 위험이 있는 센티넬과, 그들을 진정시키는 가이드가 존재한다." },
            { id: 2, name: "사이버펑크 네오서울", content: "2077년 네오서울. 네온사인이 번쩍이는 마천루와 비가 내리는 슬럼가가 공존한다. 거대 기업이 도시를 지배한다." }
        ];
        localStorage.setItem("ai_world_settings", JSON.stringify(dummyWorlds));
    }

    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    if (menuBtn && sidebar && sidebarOverlay) {
        menuBtn.addEventListener("click", () => { sidebar.classList.toggle("active"); sidebarOverlay.classList.toggle("active"); });
        sidebarOverlay.addEventListener("click", () => { sidebar.classList.remove("active"); sidebarOverlay.classList.remove("active"); });
    }

    // 메인 화면 로직 (index.html)
    const cardGrid = document.querySelector(".card-grid");
    const mainTitle = document.querySelector(".main-title");
    const sideMenuItems = document.querySelectorAll(".tree-view li");

    if (cardGrid && !document.getElementById("characterForm")) {
        
        // 1. 캐릭터 목록 렌더링
        const renderCards = () => {
            cardGrid.className = "card-grid"; cardGrid.innerHTML = "";
            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];
            characters.forEach(char => {
                const card = document.createElement("div"); card.className = "character-card";
                const imgStyle = char.image ? `style="background-image: url('${char.image}'); color:transparent;"` : "";
                card.innerHTML = `<button class="delete-btn card-del" title="Delete">×</button><div class="char-img-placeholder" ${imgStyle}>IMG</div><div class="char-info"><h3>${char.name}</h3></div>`;
                card.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) return;
                    let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
                    const newRoomId = Date.now(); 
                    recentChats.unshift({ roomId: newRoomId, charId: char.id, name: char.name, image: char.image, lastMessage: "대화를 시작해보세요...", timestamp: newRoomId });
                    localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats));
                    window.location.href = `chat.html?roomId=${newRoomId}`;
                });
                card.querySelector(".delete-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (confirm(`⚠️ "${char.name}" 캐릭터를 삭제하시겠습니까?`)) {
                        localStorage.setItem("ai_characters", JSON.stringify(characters.filter(item => item.id !== char.id))); renderCards();
                    }
                });
                cardGrid.appendChild(card);
            });
            const addNewCard = document.createElement("div"); addNewCard.className = "character-card add-new";
            addNewCard.innerHTML = `<div class="char-info"><h3>+ New Character</h3></div>`;
            addNewCard.addEventListener("click", () => { window.location.href = "create.html"; });
            cardGrid.appendChild(addNewCard);
        };

        // 2. 최근 대화 렌더링
        const renderRecentChats = () => {
            cardGrid.className = "recent-chat-list"; cardGrid.innerHTML = "";
            let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
            recentChats.forEach(room => {
                const roomDiv = document.createElement("div"); roomDiv.className = "chat-room-item";
                const imgStyle = room.image ? `style="background-image: url('${room.image}'); color:transparent;"` : "";
                
                const chatHistoryKey = `ai_chat_${room.roomId}`;
                const roomMessages = JSON.parse(localStorage.getItem(chatHistoryKey)) || [];
                const aiMessages = roomMessages.filter(msg => msg.role === "ai");
                
                let previewMessage = "대화를 시작해보세요...";
                if (aiMessages.length > 0) {
                    const lastAiText = aiMessages[aiMessages.length - 1].text;
                    previewMessage = lastAiText.split('\n')[0]; 
                }

                roomDiv.innerHTML = `
                    <button class="delete-btn room-del" title="Delete">×</button>
                    <div class="room-profile" ${imgStyle}>IMG</div>
                    <div class="room-info">
                        <h4 class="editable-name" style="cursor: pointer;" title="이름 수정하기">
                            ${room.name} 
                            <span style="opacity: 0.4; margin-left: 4px; display: inline-block; vertical-align: middle;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </span>
                        </h4>
                        <p>${previewMessage}</p>
                    </div>
                `;

                roomDiv.querySelector(".editable-name").addEventListener("click", (e) => {
                    e.stopPropagation(); 
                    const newName = prompt("이 대화방의 이름을 수정하세요:", room.name);
                    if (newName && newName.trim() !== "") {
                        room.name = newName.trim();
                        localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats)); renderRecentChats(); 
                    }
                });

                roomDiv.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) {
                        e.stopPropagation();
                        if (confirm(`⚠️ 이 대화방을 삭제하시겠습니까?`)) {
                            localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats.filter(item => item.roomId !== room.roomId)));
                            localStorage.removeItem(chatHistoryKey); localStorage.removeItem(`ai_theme_${room.roomId}`);
                            localStorage.removeItem(`ai_room_settings_${room.roomId}`);
                            renderRecentChats(); 
                        }
                        return;
                    }
                    window.location.href = `chat.html?roomId=${room.roomId}`;
                });
                cardGrid.appendChild(roomDiv);
            });
        };

        // ✨ 3. [새로 추가됨] 세계관(World Settings) 렌더링
        const renderWorlds = () => {
            cardGrid.className = "card-grid"; // 캐릭터 그리드 뷰랑 같은 모양 사용
            cardGrid.innerHTML = "";
            let worlds = JSON.parse(localStorage.getItem("ai_world_settings")) || [];

            worlds.forEach(world => {
                const card = document.createElement("div"); card.className = "world-card";
                card.innerHTML = `
                    <button class="delete-btn card-del" title="Delete World">×</button>
                    <h3>${world.name}</h3>
                    <p>${world.content}</p>
                `;
                
                card.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) return;
                    openWorldModal(world.id); // 카드 누르면 편집 팝업창 띄우기
                });

                card.querySelector(".delete-btn").addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (confirm(`⚠️ "${world.name}" 세계관을 삭제하시겠습니까?`)) {
                        localStorage.setItem("ai_world_settings", JSON.stringify(worlds.filter(item => item.id !== world.id)));
                        renderWorlds();
                    }
                });
                cardGrid.appendChild(card);
            });

            // 세계관 추가 버튼
            const addNewCard = document.createElement("div"); addNewCard.className = "world-card world-add-new";
            addNewCard.innerHTML = `<h3>+ New World</h3>`;
            addNewCard.addEventListener("click", () => { openWorldModal(null); }); // null을 주면 새 세계관 생성
            cardGrid.appendChild(addNewCard);
        };

        // 탭 메뉴 클릭 이벤트 세팅
        if (sideMenuItems.length >= 3) {
            sideMenuItems[0].addEventListener("click", () => { sideMenuItems.forEach(li => li.classList.remove("active")); sideMenuItems[0].classList.add("active"); mainTitle.textContent = "My Characters"; renderCards(); });
            sideMenuItems[1].addEventListener("click", () => { sideMenuItems.forEach(li => li.classList.remove("active")); sideMenuItems[1].classList.add("active"); mainTitle.textContent = "Recent Chats"; renderRecentChats(); });
            sideMenuItems[2].addEventListener("click", () => { sideMenuItems.forEach(li => li.classList.remove("active")); sideMenuItems[2].classList.add("active"); mainTitle.textContent = "World Settings"; renderWorlds(); });
        }
        
        // 페이지 로드 시 탭 확인
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get('tab') === 'recent') {
            sideMenuItems[1].click();
        } else {
            renderCards();
        }

        // -----------------------------------------------------
        // ✨ [새로 추가됨] 메인 화면 전용 세계관 팝업창(Modal) 로직
        // -----------------------------------------------------
        const worldModalOverlay = document.getElementById("worldModalOverlay");
        const worldNameInput = document.getElementById("worldNameInput");
        const worldContentInput = document.getElementById("worldContentInput");
        const closeWorldModalBtn = document.getElementById("closeWorldModalBtn");
        const cancelWorldModalBtn = document.getElementById("cancelWorldModalBtn");
        const saveWorldModalBtn = document.getElementById("saveWorldModalBtn");
        let editingWorldId = null; // 수정 중인 세계관 ID 기억하기

        if(worldModalOverlay) {
            window.openWorldModal = (worldId) => {
                editingWorldId = worldId;
                if (worldId === null) {
                    // 새 세계관 만들기
                    worldNameInput.value = "";
                    worldContentInput.value = "";
                } else {
                    // 기존 세계관 수정하기
                    let worlds = JSON.parse(localStorage.getItem("ai_world_settings")) || [];
                    let targetWorld = worlds.find(w => w.id === worldId);
                    if (targetWorld) {
                        worldNameInput.value = targetWorld.name;
                        worldContentInput.value = targetWorld.content;
                    }
                }
                worldModalOverlay.classList.add("active");
            };

            const closeWorldModal = () => { worldModalOverlay.classList.remove("active"); };

            const saveWorldModal = () => {
                const newName = worldNameInput.value.trim();
                const newContent = worldContentInput.value.trim();
                if (!newName || !newContent) return alert("이름과 설정을 모두 입력해주세요!");

                let worlds = JSON.parse(localStorage.getItem("ai_world_settings")) || [];
                
                if (editingWorldId === null) {
                    // 새로 추가
                    worlds.push({ id: Date.now(), name: newName, content: newContent });
                } else {
                    // 기존 것 덮어쓰기
                    let index = worlds.findIndex(w => w.id === editingWorldId);
                    if (index !== -1) {
                        worlds[index].name = newName;
                        worlds[index].content = newContent;
                    }
                }
                
                localStorage.setItem("ai_world_settings", JSON.stringify(worlds));
                closeWorldModal();
                renderWorlds(); // 저장 후 목록 새로고침
            };

            closeWorldModalBtn.addEventListener("click", closeWorldModal);
            cancelWorldModalBtn.addEventListener("click", closeWorldModal);
            saveWorldModalBtn.addEventListener("click", saveWorldModal);
        }
    }

    // ==========================================
    // 3. 캐릭터 생성 폼 (create.html)
    // ==========================================
    const charForm = document.getElementById("characterForm");
    if (charForm) {
        charForm.addEventListener("submit", () => {
            const name = document.getElementById("charName").value.trim(); const prompt = document.getElementById("charPrompt").value.trim();
            if (!name || !prompt) return;
            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];
            characters.push({ id: Date.now(), name: name, prompt: prompt, image: document.getElementById("charImage").value.trim() });
            localStorage.setItem("ai_characters", JSON.stringify(characters));
            window.location.href = "index.html";
        });
    }

    // ==========================================
    // 4. 채팅방 (chat.html)
    // ==========================================
    const chatSettingsBtn = document.getElementById("chatSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn"); 
    const chatSettingsPanel = document.getElementById("chatSettingsPanel");
    const chatMainArea = document.querySelector(".chat-main");

    if (chatSettingsBtn) chatSettingsBtn.addEventListener("click", () => chatSettingsPanel.classList.toggle("open"));
    if (closeSettingsBtn) closeSettingsBtn.addEventListener("click", () => chatSettingsPanel.classList.remove("open"));
    if (chatMainArea && chatSettingsPanel) {
        chatMainArea.addEventListener("click", () => { if (chatSettingsPanel.classList.contains("open")) chatSettingsPanel.classList.remove("open"); });
    }

    const modelSelect = document.getElementById("modelSelect");
    const modelDisplay = document.getElementById("modelDisplay");
    if (modelSelect && modelDisplay) {
        modelDisplay.textContent = modelSelect.value; 
        modelSelect.addEventListener("change", (e) => { modelDisplay.textContent = e.target.value; });
    }

    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeSubmenu = document.getElementById("themeSubmenu");
    if (themeToggleBtn && themeSubmenu) {
        themeToggleBtn.addEventListener("click", () => {
            themeSubmenu.classList.toggle("open");
            const arrow = themeToggleBtn.querySelector(".arrow"); if(arrow) arrow.classList.toggle("open");
        });
    }

    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatHistory = document.getElementById("chatHistory");
    const currentRoomId = new URLSearchParams(window.location.search).get('roomId');

    if (chatInput && sendBtn && chatHistory && currentRoomId) {
        const chatStorageKey = `ai_chat_${currentRoomId}`;
        const themeStorageKey = `ai_theme_${currentRoomId}`;
        
        // 채팅방 내부 설정 서랍 (Lorebook 등)
        const roomSettingsKey = `ai_room_settings_${currentRoomId}`;
        const menuPersona = document.getElementById("menuPersona");
        const menuUserNotes = document.getElementById("menuUserNotes");
        const menuLorebook = document.getElementById("menuLorebook");
        
        const modalOverlay = document.getElementById("settingModalOverlay");
        const modalTitle = document.getElementById("modalTitle");
        const modalTextarea = document.getElementById("modalTextarea");
        const closeModalBtn = document.getElementById("closeModalBtn");
        const cancelModalBtn = document.getElementById("cancelModalBtn");
        const saveModalBtn = document.getElementById("saveModalBtn");
        
        const lorebookSelector = document.getElementById("lorebookSelector");
        const worldSelect = document.getElementById("worldSelect");
        let currentModalType = "";

        const openModal = (type) => {
            currentModalType = type;
            const settings = JSON.parse(localStorage.getItem(roomSettingsKey)) || { persona: "", userNotes: "", lorebook: "" };
            
            if (type === "persona") {
                modalTitle.textContent = "📝 Edit Persona"; modalTextarea.value = settings.persona || ""; modalTextarea.placeholder = "내 이름, 성격, 외형, 봇과의 관계 등을 자유롭게 적어주세요.";
                if(lorebookSelector) lorebookSelector.style.display = "none";
            } else if (type === "userNotes") {
                modalTitle.textContent = "👤 User Notes"; modalTextarea.value = settings.userNotes || ""; modalTextarea.placeholder = "봇의 행동 지침, 단기 목표, 롤플레잉 형식 등을 시스템에 지시하세요.";
                if(lorebookSelector) lorebookSelector.style.display = "none";
            } else if (type === "lorebook") {
                modalTitle.textContent = "📚 Lorebook"; modalTextarea.value = settings.lorebook || ""; modalTextarea.placeholder = "이 방에서 쓰일 세계관 설정, 고유명사, 규칙 등을 입력하세요.";
                if(lorebookSelector) {
                    lorebookSelector.style.display = "block";
                    const worlds = JSON.parse(localStorage.getItem("ai_world_settings")) || [];
                    worldSelect.innerHTML = '<option value="">-- 자유 입력 (Custom) --</option>';
                    worlds.forEach(w => {
                        const opt = document.createElement("option"); opt.value = w.content; opt.textContent = w.name; worldSelect.appendChild(opt);
                    });
                }
            }
            if(modalOverlay) modalOverlay.classList.add("active");
        };

        if (worldSelect) { worldSelect.addEventListener("change", (e) => { if (e.target.value !== "") modalTextarea.value = e.target.value; }); }
        const closeModal = () => { if(modalOverlay) modalOverlay.classList.remove("active"); };

        const saveModal = () => {
            let settings = JSON.parse(localStorage.getItem(roomSettingsKey)) || { persona: "", userNotes: "", lorebook: "" };
            settings[currentModalType] = modalTextarea.value.trim();
            localStorage.setItem(roomSettingsKey, JSON.stringify(settings));
            closeModal();
            const originalTitle = modalTitle.textContent; modalTitle.textContent = "✅ 저장 완료!"; setTimeout(() => { modalTitle.textContent = originalTitle; }, 1000);
        };

        if (menuPersona) menuPersona.addEventListener("click", () => openModal("persona"));
        if (menuUserNotes) menuUserNotes.addEventListener("click", () => openModal("userNotes"));
        if (menuLorebook) menuLorebook.addEventListener("click", () => openModal("lorebook"));
        if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
        if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeModal);
        if (saveModalBtn) saveModalBtn.addEventListener("click", saveModal);

        const defaultTheme = { bg: "transparent", font: "'Inter', sans-serif", size: "1.05", userColor: "#111111", aiColor: "#2c5282", narrationColor: "#777777" };
        let currentTheme = JSON.parse(localStorage.getItem(themeStorageKey)) || defaultTheme;
        const themeBg = document.getElementById("themeBg"); const themeFont = document.getElementById("themeFont"); const themeSize = document.getElementById("themeSize");
        const themeUserColor = document.getElementById("themeUserColor"); const themeAiColor = document.getElementById("themeAiColor"); const themeNarrationColor = document.getElementById("themeNarrationColor");

        const applyTheme = (theme) => {
            document.documentElement.style.setProperty('--chat-bg', theme.bg); document.documentElement.style.setProperty('--chat-font-family', theme.font); document.documentElement.style.setProperty('--chat-font-size', theme.size + 'rem'); document.documentElement.style.setProperty('--user-color', theme.userColor); document.documentElement.style.setProperty('--ai-color', theme.aiColor); document.documentElement.style.setProperty('--narrative-color', theme.narrationColor);
            if(themeBg) themeBg.value = theme.bg === "transparent" ? "#ffffff" : theme.bg; if(themeFont) themeFont.value = theme.font; if(themeSize) themeSize.value = theme.size;
            if(themeUserColor) themeUserColor.value = theme.userColor; if(themeAiColor) themeAiColor.value = theme.aiColor; if(themeNarrationColor) themeNarrationColor.value = theme.narrationColor;
        };

        const saveAndApplyTheme = () => {
            currentTheme = { bg: themeBg.value, font: themeFont.value, size: themeSize.value, userColor: themeUserColor.value, aiColor: themeAiColor.value, narrationColor: themeNarrationColor.value };
            localStorage.setItem(themeStorageKey, JSON.stringify(currentTheme)); applyTheme(currentTheme);
        };

        if (themeBg) themeBg.addEventListener("input", saveAndApplyTheme); if (themeFont) themeFont.addEventListener("change", saveAndApplyTheme); if (themeSize) themeSize.addEventListener("input", saveAndApplyTheme);
        if (themeUserColor) themeUserColor.addEventListener("input", saveAndApplyTheme); if (themeAiColor) themeAiColor.addEventListener("input", saveAndApplyTheme); if (themeNarrationColor) themeNarrationColor.addEventListener("input", saveAndApplyTheme);
        applyTheme(currentTheme);

        let currentMessages = JSON.parse(localStorage.getItem(chatStorageKey)) || [];

        const parseText = (text) => {
            let parsed = text.replace(/\n/g, "<br>"); 
            parsed = parsed.replace(/\*(.*?)\*/g, '<span class="narrative-text">$1</span>');
            return parsed;
        };

        const renderMessages = () => {
            chatHistory.innerHTML = "";
            const wrapper = document.createElement("div"); wrapper.className = "novel-block";
            currentMessages.forEach((msg, index) => {
                const msgBox = document.createElement("div"); msgBox.className = `msg-container ${msg.role}-container`;
                const safeHtml = parseText(msg.text);
                if (msg.role === "user") {
                    msgBox.innerHTML = `<div class="user-msg-box"><div class="msg-actions"><button onclick="editMessage(${index})" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button><button onclick="deleteMessage(${index})" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></div><p class="dialogue user-dialogue">${safeHtml}</p></div>`;
                } else {
                    msgBox.innerHTML = `<p class="dialogue ai-dialogue">${safeHtml}</p>`;
                }
                wrapper.appendChild(msgBox);
            });
            chatHistory.appendChild(wrapper); chatHistory.scrollTop = chatHistory.scrollHeight;
        };

        window.deleteMessage = (index) => {
            if (confirm("이 대화를 삭제하시겠습니까? (이어진 봇의 답장도 함께 지워집니다)")) {
                if (index + 1 < currentMessages.length && currentMessages[index + 1].role === "ai") currentMessages.splice(index, 2); 
                else currentMessages.splice(index, 1); 
                localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages)); renderMessages();
            }
        };

        window.editMessage = (index) => {
            const newText = prompt("수정할 내용을 입력하세요:", currentMessages[index].text);
            if (newText !== null) { currentMessages[index].text = newText; localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages)); renderMessages(); }
        };

        const sendMessage = () => {
            const text = chatInput.value.trim(); if (!text) return;
            currentMessages.push({ role: "user", text: text }); localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages)); chatInput.value = ""; renderMessages();
            setTimeout(() => {
                currentMessages.push({ role: "ai", text: "*고개를 갸웃거리며* 첫 줄입니다.\n그리고 이건 두 번째 줄이죠." });
                localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages)); renderMessages();
            }, 1000);
        };

        sendBtn.addEventListener("click", sendMessage);
        chatInput.addEventListener("keydown", (e) => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }});
        renderMessages();
    }
});
