document.addEventListener("DOMContentLoaded", () => {
    console.log("AI Studio Loaded");

    // 모바일 사이드바 조작용 태그 가져오기
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    // ☰ 메뉴 버튼 클릭했을 때 사이드바 열고 닫기
    if (menuBtn && sidebar && sidebarOverlay) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            sidebarOverlay.classList.toggle("active");
        });

        // 사이드바가 열려있을 때 바깥 어두운 영역을 터치하면 자동으로 닫히게 설정
        sidebarOverlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            sidebarOverlay.classList.remove("active");
        });
    }

    // 나중에 2단계 캐릭터 생성 페이지, 3단계 채팅 페이지로 이동할 로직이 이 아래에 쌓일 거야!
});
