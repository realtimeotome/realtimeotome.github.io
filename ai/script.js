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
        
        // --- 👥 My Characters (기존 캐릭터 카드) ---
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
                
                // [핵심 변경] 캐릭터 누를 때마다 무조건 '새로운 방 번호(roomId)' 생성!
                card.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) return;
                    
                    let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
                    const newRoomId = Date.now(); // 지금 클릭한 시간으로 고유 방 번호 생성
                    
                    recentChats.unshift({
                        roomId: newRoomId,
                        charId: char.id,
                        name: char.name,
                        image: char.image,
                        lastMessage: "대화를 시작해보세요...",
                        timestamp: newRoomId
                    });
                    localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats));
                    
                    // 해당 방 번호를 달고 채팅방으로 입장
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

        // --- 💬 Recent Chats (카톡방 목록 및 삭제) ---
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

                // 방 목록에도 X(삭제) 버튼 추가
                roomDiv.innerHTML = `
                    <button class="delete-btn room-del" title="Delete Chat">×</button>
                    <div class="room-profile" ${imgStyle}>IMG</div>
                    <div class="room-info">
                        <h4>${room.name}</h4>
                        <p>${room.lastMessage}</p>
                    </div>
                `;

                roomDiv.addEventListener("click", (e) => {
                    // 삭제 버튼을 눌렀을 때의 로직
                    if (e.target.classList.contains("delete-btn")) {
                        e.stopPropagation();
                        if (confirm(`⚠️ 이 대화방을 삭제하시겠습니까?`)) {
                            let currentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
                            // 현재 누른 방 번호(roomId)만 필터링해서 날려버림
                            let updatedChats = currentChats.filter(item => item.roomId !== room.roomId);
                            localStorage.setItem("ai_recent_chats", JSON.stringify(updatedChats));
                            renderRecentChats(); // 리스트 새로고침
                        }
                        return;
                    }
                    // 방 누르면 해당 방 번호로 입장
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

        renderCards();
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
    // 4. 채팅방 (chat.html) 전용 스크립트
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

    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
        chatInput.addEventListener("input", function() {
            this.style.height = "auto";
            this.style.height = (this.scrollHeight) + "px";
            if (this.scrollHeight > 150) this.style.overflowY = "auto";
            else this.style.overflowY = "hidden";
        });
    }

    // [핵심 변경] 모델 선택 시 위쪽 디스플레이 자동 변경 기능
    const modelSelect = document.getElementById("modelSelect");
    const modelDisplay = document.getElementById("modelDisplay");

    if (modelSelect && modelDisplay) {
        // 셀렉트 박스에서 선택을 바꿀 때마다 글씨가 똑같이 바뀜
        modelSelect.addEventListener("change", (e) => {
            modelDisplay.textContent = e.target.value;
        });
    }
});
