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
    
    // 사이드바 메뉴 버튼들 (0번째: My Characters, 1번째: Recent Chats)
    const sideMenuItems = document.querySelectorAll(".tree-view li");

    if (cardGrid && !document.getElementById("characterForm")) {
        
        // --- 👥 My Characters (기존 캐릭터 카드 렌더링) ---
        const renderCards = () => {
            cardGrid.className = "card-grid"; // 그리드 복구
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
                card.dataset.id = char.id;
                const imgStyle = char.image ? `style="background-image: url('${char.image}'); color:transparent;"` : "";

                card.innerHTML = `
                    <button class="delete-btn" title="Delete Character">×</button>
                    <div class="char-img-placeholder" ${imgStyle}>IMG</div>
                    <div class="char-info"><h3>${char.name}</h3></div>
                `;
                
                // 캐릭터 카드 클릭하면 채팅방(chat.html)으로 들어가면서 최근 대화 목록에 방 생성!
                card.addEventListener("click", (e) => {
                    if (e.target.classList.contains("delete-btn")) return;
                    
                    // 최근 대화방 기록하기 (카톡 방 만들기)
                    let recentChats = JSON.parse(localStorage.getItem("ai_recent_chats")) || [];
                    // 이미 있는 방인지 확인
                    const existingRoom = recentChats.find(room => room.id === char.id);
                    
                    if (!existingRoom) {
                        recentChats.unshift({ // 맨 앞에 추가
                            id: char.id,
                            name: char.name,
                            image: char.image,
                            lastMessage: "대화를 시작해보세요...", // 임시 마지막 대화
                            timestamp: Date.now()
                        });
                        localStorage.setItem("ai_recent_chats", JSON.stringify(recentChats));
                    }
                    
                    window.location.href = `chat.html?id=${char.id}`;
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

        // --- 💬 Recent Chats (카톡방 목록 렌더링) ---
        const renderRecentChats = () => {
            cardGrid.className = "recent-chat-list"; // 그리드 대신 세로 리스트 클래스로 변경
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
                    <div class="room-profile" ${imgStyle}>IMG</div>
                    <div class="room-info">
                        <h4>${room.name}</h4>
                        <p>${room.lastMessage}</p>
                    </div>
                `;

                // 방 누르면 다시 채팅방으로 입장
                roomDiv.addEventListener("click", () => {
                    window.location.href = `chat.html?id=${room.id}`;
                });

                cardGrid.appendChild(roomDiv);
            });
        };

        // 사이드바 메뉴 클릭 이벤트 연동
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

        // 초기 화면 로드
        renderCards();
    }

    // ==========================================
    // 3. 캐릭터 생성 폼 저장 로직 (create.html)
    // ==========================================
    const charForm = document.getElementById("characterForm");
    if (charForm) {
        // (기존 코드와 동일하게 유지)
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
        // 요구사항 반영: 토글 기능 (누르면 열리고 한 번 더 누르면 닫힘)
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
});
