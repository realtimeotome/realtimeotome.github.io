document.addEventListener("DOMContentLoaded", () => {
    console.log("AI Studio Loaded");

    // ==========================================
    // 1. 공통 사이드바 조작 로직 (모바일)
    // ==========================================
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    if (menuBtn && sidebar && sidebarOverlay) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            sidebarOverlay.classList.toggle("active");
        });
        sidebarOverlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            sidebarOverlay.classList.remove("active");
        });
    }

    // ==========================================
    // 2. 메인 화면 (index.html) 전용 탭 스위칭 및 카드 로직
    // ==========================================
    const cardGrid = document.querySelector(".card-grid");
    const mainTitle = document.querySelector(".main-title");
    const sideMenuItems = document.querySelectorAll(".tree-view li");

    if (cardGrid && !document.getElementById("characterForm")) {
        
        const renderCards = () => {
            cardGrid.className = "card-grid";
            cardGrid.innerHTML = "";
            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];

            characters.forEach(char => {
                const card = document.createElement("div");
                card.className = "character-card";
                const imgStyle = char.image ? `style="background-image: url('${char.image}'); color:transparent;"` : "";

                card.innerHTML = `
                    <button class="delete-btn card-del" title="Delete Character">×</button>
                    <div class="char-img-placeholder" ${imgStyle}>IMG</div>
                    <div class="char-info"><h3>${char.name}</h3></div>
                `;
                
                card.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) return;
                    let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
                    const newRoomId = Date.now(); 
                    recentChats.unshift({ roomId: newRoomId, charId: char.id, name: char.name, image: char.image, lastMessage: "대화를 시작해보세요...", timestamp: newRoomId });
                    localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats));
                    window.location.href = `chat.html?roomId=${newRoomId}`;
                });

                const deleteBtn = card.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (confirm(`⚠️ Warning!\n\n"${char.name}" 캐릭터를 삭제하시겠습니까?`)) {
                        let currentChars = JSON.parse(localStorage.getItem("ai_characters")) || [];
                        let updatedChars = currentChars.filter(item => item.id !== char.id);
                        localStorage.setItem("ai_characters", JSON.stringify(updatedChars));
                        renderCards();
                    }
                });
                cardGrid.appendChild(card);
            });

            const addNewCard = document.createElement("div");
            addNewCard.className = "character-card add-new";
            addNewCard.innerHTML = `<div class="char-info"><h3>+ New Character</h3></div>`;
            addNewCard.addEventListener("click", () => { window.location.href = "create.html"; });
            cardGrid.appendChild(addNewCard);
        };

        const renderRecentChats = () => {
            cardGrid.className = "recent-chat-list"; 
            cardGrid.innerHTML = "";
            let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];

            recentChats.forEach(room => {
                const roomDiv = document.createElement("div");
                roomDiv.className = "chat-room-item";
                const imgStyle = room.image ? `style="background-image: url('${room.image}'); color:transparent;"` : "";
                roomDiv.innerHTML = `
                    <button class="delete-btn room-del" title="Delete Chat">×</button>
                    <div class="room-profile" ${imgStyle}>IMG</div>
                    <div class="room-info">
                        <h4>${room.name}</h4>
                        <p>${room.lastMessage}</p>
                    </div>
                `;
                roomDiv.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) {
                        e.stopPropagation();
                        if (confirm(`⚠️ 이 대화방을 삭제하시겠습니까?`)) {
                            let currentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
                            let updatedChats = currentChats.filter(item => item.roomId !== room.roomId);
                            localStorage.setItem("ai_recent_chats", JSON.stringify(updatedChats));
                            renderRecentChats(); 
                        }
                        return;
                    }
                    window.location.href = `chat.html?roomId=${room.roomId}`;
                });
                cardGrid.appendChild(roomDiv);
            });
        };

        if (sideMenuItems.length >= 2) {
            sideMenuItems[0].addEventListener("click", () => {
                sideMenuItems[0].classList.add("active");
                sideMenuItems[1].classList.remove("active");
                mainTitle.textContent = "My Characters";
                renderCards();
            });
            sideMenuItems[1].addEventListener("click", () => {
                sideMenuItems[1].classList.add("active");
                sideMenuItems[0].classList.remove("active");
                mainTitle.textContent = "Recent Chats";
                renderRecentChats();
            });
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.get('tab') === 'recent' ? renderRecentChats() : renderCards();
    }

    // ==========================================
    // 3. 캐릭터 생성 폼 (create.html)
    // ==========================================
    const charForm = document.getElementById("characterForm");
    if (charForm) {
        charForm.addEventListener("submit", () => {
            const name = document.getElementById("charName").value.trim();
            const prompt = document.getElementById("charPrompt").value.trim();
            if (!name || !prompt) return;
            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];
            characters.push({ id: Date.now(), name: name, prompt: prompt, image: document.getElementById("charImage").value.trim() });
            localStorage.setItem("ai_characters", JSON.stringify(characters));
            window.location.href = "index.html";
        });
    }

    // ==========================================
    // 4. 채팅방 (chat.html) - 픽토그램 아이콘 적용 버전!
    // ==========================================
    const chatSettingsBtn = document.getElementById("chatSettingsBtn");
    const chatSettingsPanel = document.getElementById("chatSettingsPanel");
    if (chatSettingsBtn && chatSettingsPanel) {
        chatSettingsBtn.addEventListener("click", () => chatSettingsPanel.classList.toggle("open"));
    }

    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatHistory = document.getElementById("chatHistory");
    const currentRoomId = new URLSearchParams(window.location.search).get('roomId');

    if (chatInput && sendBtn && chatHistory && currentRoomId) {
        const chatStorageKey = `ai_chat_${currentRoomId}`;
        let currentMessages = JSON.parse(localStorage.getItem(chatStorageKey)) || [];

        const renderMessages = () => {
            chatHistory.innerHTML = "";
            const wrapper = document.createElement("div");
            wrapper.className = "novel-block";
            
            currentMessages.forEach((msg, index) => {
                const msgBox = document.createElement("div");
                msgBox.className = `msg-container ${msg.role}-container`;
                
                if (msg.role === "user") {
                    // 요구사항 반영: 이모지 대신 정교한 흑백 SVG 픽토그램 라인 아이콘 삽입
                    msgBox.innerHTML = `
                        <div class="user-msg-box">
                            <div class="msg-actions">
                                <button onclick="editMessage(${index})" title="Edit">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onclick="deleteMessage(${index})" title="Delete">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                            <p class="dialogue user-dialogue">${msg.text}</p>
                        </div>
                    `;
                } else {
                    msgBox.innerHTML = `<p class="dialogue ai-dialogue">${msg.text}</p>`;
                }
                wrapper.appendChild(msgBox);
            });
            chatHistory.appendChild(wrapper);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        };

        window.deleteMessage = (index) => {
            if (confirm("이 메시지를 삭제할까요?")) {
                currentMessages.splice(index, 1);
                localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages));
                renderMessages();
            }
        };

        window.editMessage = (index) => {
            const newText = prompt("수정할 내용을 입력하세요:", currentMessages[index].text);
            if (newText !== null) {
                currentMessages[index].text = newText;
                localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages));
                renderMessages();
            }
        };

        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;
            currentMessages.push({ role: "user", text: text });
            localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages));
            chatInput.value = "";
            renderMessages();
            setTimeout(() => {
                currentMessages.push({ role: "ai", text: "테스트 응답입니다." });
                localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages));
                renderMessages();
            }, 1000);
        };

        sendBtn.addEventListener("click", sendMessage);
        chatInput.addEventListener("keydown", (e) => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }});
        renderMessages();
    }
});
