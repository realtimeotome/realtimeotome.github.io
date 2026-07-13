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

            if (characters.length === 0) {
                characters = [
                    { id: 1, name: "Character 1", intro: "A mysterious esper", prompt: "Test", image: "" }
                ];
                localStorage.setItem("ai_characters", JSON.stringify(characters));
            }

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
                    
                    recentChats.unshift({
                        roomId: newRoomId,
                        charId: char.id,
                        name: char.name,
                        image: char.image,
                        lastMessage: "대화를 시작해보세요...",
                        timestamp: newRoomId
                    });
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

            if (recentChats.length === 0) {
                cardGrid.innerHTML = `<p style="color:#777; padding: 20px;">No recent chats available.</p>`;
                return;
            }

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
        const activeTab = urlParams.get('tab');

        if (activeTab === 'recent' && sideMenuItems.length >= 2) {
            sideMenuItems[1].classList.add("active");
            sideMenuItems[0].classList.remove("active");
            mainTitle.textContent = "Recent Chats";
            renderRecentChats();
        } else {
            renderCards();
        }
    }

    // ==========================================
    // 3. 캐릭터 생성 폼 (create.html)
    // ==========================================
    const charForm = document.getElementById("characterForm");
    if (charForm) {
        const charImageInput = document.getElementById("charImage");
        const imgPreview = document.getElementById("imgPreview");
        if (charImageInput && imgPreview) {
            charImageInput.addEventListener("input", (e) => {
                const url = e.target.value.trim();
                if (url) {
                    imgPreview.style.backgroundImage = `url('${url}')`;
                    imgPreview.style.color = "transparent";
                    imgPreview.style.borderStyle = "solid";
                } else {
                    imgPreview.style.backgroundImage = "none";
                    imgPreview.style.color = "#777";
                    imgPreview.style.borderStyle = "dashed";
                }
            });
        }
        charForm.addEventListener("submit", () => {
            const name = document.getElementById("charName").value.trim();
            const intro = document.getElementById("charIntro").value.trim();
            const prompt = document.getElementById("charPrompt").value.trim();
            const image = charImageInput.value.trim();
            if (!name || !prompt) return;

            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];
            const newChar = { id: Date.now(), name: name, intro: intro, prompt: prompt, image: image };
            characters.push(newChar);
            localStorage.setItem("ai_characters", JSON.stringify(characters));
            alert("캐릭터가 저장되었습니다.");
            window.location.href = "index.html";
        });
    }

    // ==========================================
    // 4. 채팅방 (chat.html) 전용 스크립트 (가상 채팅 기능 탑재!)
    // ==========================================
    const chatSettingsBtn = document.getElementById("chatSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const chatSettingsPanel = document.getElementById("chatSettingsPanel");

    if (chatSettingsBtn && chatSettingsPanel) {
        chatSettingsBtn.addEventListener("click", () => {
            chatSettingsPanel.classList.toggle("open");
        });
        closeSettingsBtn.addEventListener("click", () => {
            chatSettingsPanel.classList.remove("open");
        });
    }

    const modelSelect = document.getElementById("modelSelect");
    const modelDisplay = document.getElementById("modelDisplay");
    if (modelSelect && modelDisplay) {
        modelSelect.addEventListener("change", (e) => {
            modelDisplay.textContent = e.target.value;
        });
    }

    // 🚀 진짜 대화 기능 로직
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const chatHistory = document.getElementById("chatHistory");
    const chatTitle = document.getElementById("chatTitle");

    // 현재 주소창에서 방 번호(roomId) 빼오기
    const chatUrlParams = new URLSearchParams(window.location.search);
    const currentRoomId = chatUrlParams.get('roomId');

    if (chatInput && sendBtn && chatHistory && currentRoomId) {
        
        // 방 제목(캐릭터 이름) 상단에 띄우기
        let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
        const roomInfo = recentChats.find(r => r.roomId == currentRoomId);
        if (roomInfo && chatTitle) {
            chatTitle.textContent = roomInfo.name;
        }

        // 브라우저 금고에서 현재 방의 대화 내역 가져오기
        const chatStorageKey = `ai_chat_${currentRoomId}`;
        let currentMessages = JSON.parse(localStorage.getItem(chatStorageKey)) || [];

        // 화면에 대화 그려주는 마법사 함수
        const renderMessages = () => {
            chatHistory.innerHTML = ""; // 일단 싹 지우고
            const block = document.createElement("div");
            block.className = "novel-block";

            // 만약 처음 판 방이라 대화가 하나도 없으면 기본 예시 출력
            if (currentMessages.length === 0) {
                block.innerHTML = `
                    <p class="narrative">The cold wind blew through the empty server room, chilling everything it touched.</p>
                    <p class="dialogue ai-dialogue">"Are you the one they sent?"</p>
                `;
            } else {
                // 대화 내역이 있으면 차곡차곡 쌓아줌
                currentMessages.forEach(msg => {
                    // 유저면 까만 텍스트, AI면 푸른 텍스트
                    if (msg.role === "user") {
                        block.innerHTML += `<p class="dialogue user-dialogue">"${msg.text}"</p>`;
                    } else {
                        block.innerHTML += `<p class="dialogue ai-dialogue">"${msg.text}"</p>`;
                    }
                });
            }
            chatHistory.appendChild(block);
            
            // 새 대화가 생길 때마다 화면 맨 아래로 스크롤 내려줌!
            chatHistory.scrollTop = chatHistory.scrollHeight;
        };

        // 방에 들어오자마자 저장된 대화 띄워주기
        renderMessages();

        // 메세지 전송 함수
        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return; // 내용 없으면 무시

            // 1. 유저 메세지 장부에 적고 화면 업데이트
            currentMessages.push({ role: "user", text: text });
            localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages));
            
            // 2. 리센트 챗 '마지막 대화' 텍스트 갱신
            if (roomInfo) {
                roomInfo.lastMessage = text;
                localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats));
            }

            chatInput.value = ""; // 입력창 비우기
            chatInput.style.height = "auto"; // 입력창 높이 되돌리기
            renderMessages();

            // 3. 1초 뒤에 AI가 가짜로 대답하게 만들기 (타이머)
            setTimeout(() => {
                const aiReply = "응? 방금 뭐라고 한 거야? (가상 테스트 응답입니다)";
                
                currentMessages.push({ role: "ai", text: aiReply });
                localStorage.setItem(chatStorageKey, JSON.stringify(currentMessages));
                
                // AI 응답으로 리센트 챗 또 갱신!
                if (roomInfo) {
                    roomInfo.lastMessage = aiReply;
                    localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats));
                }
                
                renderMessages();
            }, 1000); // 1000ms = 1초
        };

        // 보내기 버튼 누르면 작동
        sendBtn.addEventListener("click", sendMessage);

        // 입력창 자동 높이 조절
        chatInput.addEventListener("input", function() {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
            if (this.scrollHeight > 150) this.style.overflowY = "auto";
            else this.style.overflowY = "hidden";
        });
        
        // 엔터키 누르면 전송 (Shift+Enter는 줄바꿈)
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // 기본 줄바꿈 멈춰!
                sendMessage(); // 전송 함수 실행
            }
        });
    }
});
