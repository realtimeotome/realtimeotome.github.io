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

    // 2. 메인 화면 카드 리스트 동적 로드 로직 (Local Storage 연동)
    const cardGrid = document.querySelector(".card-grid");
    
    // 메인 화면(index.html)일 때만 작동하도록 체크
    if (cardGrid && !document.getElementById("characterForm")) {
        // 기존 하드코딩된 예시 카드들 싹 지우고 시작
        cardGrid.innerHTML = "";

        // 브라우저 비밀금고(localStorage)에서 저장된 캐릭터 목록 꺼내오기
        let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];

        // 만약 처음 접속해서 아무것도 없다면 기본 캐릭터 2개 임시 생성
        if (characters.length === 0) {
            characters = [
                { id: 1, name: "Character 1", intro: "S급 전투계 에스퍼", prompt: "", image: "" },
                { id: 2, name: "Character 2", intro: "매칭률 99% 가이드", prompt: "", image: "" }
            ];
            localStorage.setItem("ai_characters", JSON.stringify(characters));
        }

        // 저장고에 있는 캐릭터들을 화면에 카드로 하나씩 그려주기
        characters.forEach(char => {
            const card = document.createElement("div");
            card.className = "character-card";
            card.dataset.id = char.id;
            
            // 이미지 주소가 있으면 입히고 없으면 무채색 텍스트 노출
            const imgStyle = char.image ? `style="background-image: url('${char.image}'); color:transparent;"` : "";

            card.innerHTML = `
                <div class="char-img-placeholder" ${imgStyle}>IMG</div>
                <div class="char-info">
                    <h3>${char.name}</h3>
                </div>
            `;
            
            // 카드를 누르면 나중에 3단계인 채팅방(chat.html)으로 이동하게 세팅할 자리
            card.addEventListener("click", () => {
                alert(`${char.name}과 대화를 시작합니다. (다음 단계에서 구현!)`);
            });

            cardGrid.appendChild(card);
        });

        // 맨 마지막에 "+ 새 캐릭터" 추가 버튼 달아주기
        const addNewCard = document.createElement("div");
        addNewCard.className = "character-card add-new";
        addNewCard.innerHTML = `
            <div class="char-info">
                <h3>+ New Character</h3>
            </div>
        `;
        
        // 누르면 생성 화면인 create.html 로 이동!
        addNewCard.addEventListener("click", () => {
            window.location.href = "create.html";
        });
        cardGrid.appendChild(addNewCard);
    }

    // 3. 캐릭터 생성 페이지(create.html) 저장 로직
    const charForm = document.getElementById("characterForm");
    const charImageInput = document.getElementById("charImage");
    const imgPreview = document.getElementById("imgPreview");

    // 이미지 URL 입력할 때 실시간으로 미리보기 박스에 보여주는 기능
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

    // [Save Character] 버튼 눌렀을 때 작동하는 진짜 중요한 저장 로직!
    if (charForm) {
        charForm.addEventListener("submit", () => {
            const name = document.getElementById("charName").value.trim();
            const intro = document.getElementById("charIntro").value.trim();
            const prompt = document.getElementById("charPrompt").value.trim();
            const image = charImageInput.value.trim();

            if (!name || !prompt) return;

            // 기존 금고 데이터 꺼내기
            let characters = JSON.parse(localStorage.getItem("ai_characters")) || [];

            // 새 캐릭터 오브젝트 생성
            const newChar = {
                id: Date.now(), // 고유 숫자 ID값 생성
                name: name,
                intro: intro,
                prompt: prompt,
                image: image
            };

            // 금고에 집어넣고 문 닫기
            characters.push(newChar);
            localStorage.setItem("ai_characters", JSON.stringify(characters));

            // 완료 안내 띄우고 다시 메인 목록 화면으로 자동 탈출!
            alert("캐릭터 설정이 안전하게 브라우저에 저장되었습니다!");
            window.location.href = "index.html";
        });
    }
});
