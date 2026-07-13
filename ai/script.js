document.addEventListener("DOMContentLoaded", () => {
    console.log("AI Studio Loaded");

    // 1. 모바일 사이드바 조작 로직
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

    // 2. 메인 화면 카드 리스트 동적 로드 + 삭제 로직
    const cardGrid = document.querySelector(".card-grid");
    
    if (cardGrid && !document.getElementById("characterForm")) {
        // 화면을 싹 비우고 로드하는 함수 정의
        const renderCards = () => {
            cardGrid.innerHTML = "";

            // 브라우저 보관함에서 캐릭터 가져오기
            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];

            // 최초 데이터가 아예 없을 때만 기본 캐릭터 세팅
            if (characters.length === 0) {
                characters = [
                    { id: 1, name: "Character 1", intro: "S급 전투계 에스퍼", prompt: "기본 설정 1", image: "" },
                    { id: 2, name: "Character 2", intro: "매칭률 99% 가이드", prompt: "기본 설정 2", image: "" }
                ];
                localStorage.setItem("ai_characters", JSON.stringify(characters));
            }

            // 캐릭터 카드 렌더링
            characters.forEach(char => {
                const card = document.createElement("div");
                card.className = "character-card";
                card.dataset.id = char.id;
                
                const imgStyle = char.image ? `style="background-image: url('${char.image}'); color:transparent;"` : "";

                // 카드 내부에 삭제 버튼(delete-btn) 추가!
                card.innerHTML = `
                    <button class="delete-btn" title="Delete Character">×</button>
                    <div class="char-img-placeholder" ${imgStyle}>IMG</div>
                    <div class="char-info">
                        <h3>${char.name}</h3>
                    </div>
                `;
                
                // [이벤트 A] 카드 자체를 누르면 채팅창으로 이동 (나중에 구현)
                card.addEventListener("click", (e) => {
                    // 중요: 만약 삭제 버튼을 누른 거라면 채팅방으로 이동하는 걸 막음!
                    if (e.target.classList.contains("delete-btn")) return;
                    
                    alert(`${char.name}과 대화를 시작합니다. (다음 단계에서 구현!)`);
                });

                // [이벤트 B] 삭제 버튼(X)을 눌렀을 때 작동할 팝업 경고창 로직!
                const deleteBtn = card.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트가 중복으로 터지는 걸 방지

                    // 네가 원했던 삭제 전 경고창 띄우기!
                    const confirmDelete = confirm(`⚠️ Warning!\n\n"${char.name}" 캐릭터를 정말 삭제하시겠습니까?\n삭제된 데이터와 대화 기록은 절대 복구할 수 없습니다.`);
                    
                    if (confirmDelete) {
                        // 확인을 누르면 보관함 리스트에서 해당 ID만 걸러서 제외시킴
                        let currentChars = JSON.parse(localStorage.getItem("ai_characters")) || [];
                        let updatedChars = currentChars.filter(item => item.id !== char.id);
                        
                        // 바뀐 리스트를 다시 보관함에 덮어쓰기
                        localStorage.setItem("ai_characters", JSON.stringify(updatedChars));
                        
                        // 화면 리로드해서 카드를 지워줌!
                        renderCards();
                    }
                });

                cardGrid.appendChild(card);
            });

            // 맨 마지막에 "+ 새 캐릭터" 카드 달아주기
            const addNewCard = document.createElement("div");
            addNewCard.className = "character-card add-new";
            addNewCard.innerHTML = `
                <div class="char-info">
                    <h3>+ New Character</h3>
                </div>
            `;
            
            addNewCard.addEventListener("click", () => {
                window.location.href = "create.html";
            });
            cardGrid.appendChild(addNewCard);
        };

        // 최초 실행
        renderCards();
    }

    // 3. 캐릭터 생성 페이지(create.html) 저장 로직
    const charForm = document.getElementById("characterForm");
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

    if (charForm) {
        charForm.addEventListener("submit", () => {
            const name = document.getElementById("charName").value.trim();
            const intro = document.getElementById("charIntro").value.trim();
            const prompt = document.getElementById("charPrompt").value.trim();
            const image = charImageInput.value.trim();

            if (!name || !prompt) return;

            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];

            const newChar = {
                id: Date.now(), // 타임스탬프를 고유 ID로 사용
                name: name,
                intro: intro,
                prompt: prompt,
                image: image
            };

            characters.push(newChar);
            localStorage.setItem("ai_characters", JSON.stringify(characters));

            alert("캐릭터 설정이 안전하게 브라우저에 저장되었습니다!");
            window.location.href = "index.html";
        });
    }
});

// ==========================================
// 📖 3단계: 채팅방(chat.html) 전용 스크립트
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 우측 슬라이드 설정창 여닫기 로직
    const chatSettingsBtn = document.getElementById("chatSettingsBtn");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const chatSettingsPanel = document.getElementById("chatSettingsPanel");

    if (chatSettingsBtn && chatSettingsPanel) {
        // 톱니바퀴 누르면 열림
        chatSettingsBtn.addEventListener("click", () => {
            chatSettingsPanel.classList.add("open");
        });
        // X 누르면 닫힘
        closeSettingsBtn.addEventListener("click", () => {
            chatSettingsPanel.classList.remove("open");
        });
    }

    // 2. 채팅 입력창(textarea) 자동 높이 조절 로직 (카톡처럼)
    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
        chatInput.addEventListener("input", function() {
            this.style.height = "auto"; // 높이 초기화
            this.style.height = (this.scrollHeight) + "px"; // 글자 길이에 맞춰 늘림
            
            // 최대 높이 제한 (CSS의 max-height와 연동)
            if (this.scrollHeight > 150) {
                this.style.overflowY = "auto";
            } else {
                this.style.overflowY = "hidden";
            }
        });
    }
});

