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

        // [핵심 로직] URL 파라미터를 읽어서 탭을 결정함
        const urlParams = new URLSearchParams(window.location.search);
        const activeTab = urlParams.get('tab');

        if (activeTab === 'recent' && sideMenuItems.length >= 2) {
            // 주소창에 ?tab=recent 가 있으면 최근 대화 목록을 바로 켬
            sideMenuItems[1].classList.add("active");
            sideMenuItems[0].classList.remove("active");
            mainTitle.textContent = "Recent Chats";
            renderRecentChats();
        } else {
            // 그 외의 경우는 기본 My Characters 화면
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

    const modelSelect = document.getElementById("modelSelect");
    const modelDisplay = document.getElementById("modelDisplay");
    if (modelSelect && modelDisplay) {
        modelSelect.addEventListener("change", (e) => {
            modelDisplay.textContent = e.target.value;
        });
    }
});
