document.addEventListener("DOMContentLoaded", () => {
  // 모든 custom-select 초기화
  document.querySelectorAll(".custom-select").forEach(setupCustomSelect);
  // gnb
  const depth1Buttons = document.querySelectorAll(".gnb-depth1");
  const depth2Links = document.querySelectorAll(".gnb-depth2 a");

  // 1. 초기 상태 설정: 모든 메뉴에 기본 클래스 적용
  depth1Buttons.forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.classList.add("navigation-depth-md");
  });
  depth2Links.forEach((link) => {
    link.classList.add("navigation-depth-md");
  });

  // 2. Depth1 클릭 이벤트 (기존 로직)
  depth1Buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentItem = button.parentElement;
      const currentDepth2 = currentItem.querySelector(".gnb-depth2");
      const isOpened = currentItem.classList.contains("is-active");

      const closeAllMenus = () => {
        document.querySelectorAll(".gnb-item").forEach((item) => {
          const btn = item.querySelector(".gnb-depth1");
          item.classList.remove("is-active");
          item.querySelector(".gnb-depth2").style.maxHeight = null;
          btn.setAttribute("aria-expanded", "false");
          btn.classList.replace(
            "navigation-depth-md-bold",
            "navigation-depth-md",
          );
        });
      };

      if (isOpened) {
        currentItem.classList.remove("is-active");
        currentDepth2.style.maxHeight = null;
        button.setAttribute("aria-expanded", "false");
        button.classList.replace(
          "navigation-depth-md-bold",
          "navigation-depth-md",
        );
        return;
      }

      closeAllMenus();
      currentItem.classList.add("is-active");
      button.setAttribute("aria-expanded", "true");
      button.classList.replace(
        "navigation-depth-md",
        "navigation-depth-md-bold",
      );
      currentDepth2.style.maxHeight = currentDepth2.scrollHeight + "px";
    });
  });

  // Depth2 클릭 이벤트 수정
  depth2Links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // 1. 모든 Depth2 링크에서 'current' 클래스 및 bold 클래스 제거
      depth2Links.forEach((l) => {
        l.classList.remove("current");
        l.classList.replace("navigation-depth-md-bold", "navigation-depth-md");
      });

      // 2. 현재 클릭한 링크에 'current' 및 bold 클래스 추가
      link.classList.add("current");
      link.classList.replace("navigation-depth-md", "navigation-depth-md-bold");
    });
  });

  // 특정 메뉴를 자동으로 열기 위한 로직:autoOpenIndex값수정
  const autoOpenIndex = 1; // 운행소재관리 인덱스
  const targetLinkText = "예고조회/등록"; // 활성화할 메뉴 이름

  const allItems = document.querySelectorAll(".gnb-item");

  if (allItems[autoOpenIndex]) {
    const targetItem = allItems[autoOpenIndex];
    const targetBtn = targetItem.querySelector(".gnb-depth1");
    const targetDepth2 = targetItem.querySelector(".gnb-depth2");

    // 1. 부모(Depth1) 열기
    targetItem.classList.add("is-active");
    targetBtn.setAttribute("aria-expanded", "true");
    targetBtn.classList.replace(
      "navigation-depth-md",
      "navigation-depth-md-bold",
    );
    targetDepth2.style.maxHeight = targetDepth2.scrollHeight + "px";

    // 2. 내부 링크(Depth2) 찾아서 활성화
    const links = targetDepth2.querySelectorAll("a");
    links.forEach((link) => {
      if (link.textContent.trim() === targetLinkText) {
        link.classList.add("current"); // CSS에서 정의한 스타일 적용
        link.classList.replace(
          "navigation-depth-md",
          "navigation-depth-md-bold",
        );
      }
    });
  }

  // sidebar toggle 버튼

  const gnbCloseBtn = document.querySelector(".btn-gnb-close");
  const sidebarArea = document.querySelector(".sidebar");
  gnbCloseBtn.addEventListener("click", () => {
    sidebarArea.classList.toggle("is-closed");
    gnbCloseBtn.classList.toggle("is-closed");
  });

  // dark mode 토글 버튼
  const darkModeBtn = document.querySelector(
    ".btn-utility-dark, .btn-utility-light",
  );

  const syncTheme = (isDark) => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
    darkModeBtn.classList.toggle("btn-utility-dark", !isDark);
    darkModeBtn.classList.toggle("btn-utility-light", isDark);
    darkModeBtn.setAttribute(
      "aria-label",
      isDark ? "라이트 모드 전환" : "다크 모드 전환",
    );
    darkModeBtn.setAttribute("aria-pressed", isDark);

    // localStorage 저장
    localStorage.setItem("isDarkMode", isDark);
  };

  // data-theme은 <head>의 인라인 스크립트가 이미 설정해둔 값을 그대로 따름 (깜빡임 방지)
  const initialIsDark =
    document.documentElement.getAttribute("data-theme") === "dark";
  syncTheme(initialIsDark);

  darkModeBtn.addEventListener("click", () => {
    const isNowDark = darkModeBtn.classList.contains("btn-utility-light");
    syncTheme(!isNowDark);
  });

  // myinfo layer팝업

  const myInfoBtn = document.querySelector(".btn-utility-myinfo");
  const userLayer = document.querySelector(".user-layer");

  // 1. 버튼 클릭 시 토글
  myInfoBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 이벤트가 상위로 퍼지는 것을 방지 (바로 닫히는 현상 방지)
    userLayer.classList.toggle("is-active");
  });

  // 2. 문서 전체 클릭 시 팝업 닫기
  document.addEventListener("click", (e) => {
    // 팝업 내부가 아닌 영역을 클릭했을 때만 닫기
    if (!userLayer.contains(e.target) && e.target !== myInfoBtn) {
      userLayer.classList.remove("is-active");
    }
  });

  // bookmark toggle 버튼
  const bookmarkBtn = document.querySelector(".btn-bookmark");

  bookmarkBtn.addEventListener("click", () => {
    bookmarkBtn.classList.toggle("is-active");
  });

  // detail toggle 버튼 & detail area hidden
  const detailBtn = document.querySelector(".btn-detail-toggle");
  const detailArea = document.querySelector(".detail-area");
  const toggleText = document.querySelector(".toggle-text");

  const syncState = (isActive) => {
    detailArea.classList.toggle("is-hidden", !isActive);
    detailBtn.classList.toggle("is-active", isActive);

    toggleText.textContent = isActive ? "ON" : "OFF";

    // localStorage 저장
    localStorage.setItem("isDetailHidden", !isActive);
  };

  const savedHiddenState = localStorage.getItem("isDetailHidden") === "true";
  syncState(!savedHiddenState);

  detailBtn.addEventListener("click", () => {
    const isNowActive = detailBtn.classList.contains("is-active");
    syncState(!isNowActive);
  });

  //tabmenu
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 1. 모든 탭 버튼에서 active 클래스 제거 및 aria-selected 초기화
      tabBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      // 2. 클릭한 버튼에 active 클래스 및 aria-selected 추가
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // 3. 모든 컨텐츠 숨김
      tabContents.forEach((content) => content.classList.remove("active"));
      // 4. 클릭한 타겟 ID와 일치하는 컨텐츠 표시
      const targetId = btn.getAttribute("data-target");
      document.getElementById(targetId).classList.add("active");
    });
  });
});

// custom select
function setupCustomSelect(el) {
  const select = el.querySelector("select");
  const selectedDiv = document.createElement("div");
  selectedDiv.className = "select-selected";
  selectedDiv.innerHTML = select.options[select.selectedIndex].innerHTML;
  el.appendChild(selectedDiv);

  const itemsDiv = document.createElement("div");
  itemsDiv.className = "select-items select-hide";

  Array.from(select.options).forEach((option, index) => {
    if (index === 0) return; // 첫 번째 옵션은 이미 selectedDiv에 있음
    const item = document.createElement("div");
    item.innerHTML = option.innerHTML;
    item.addEventListener("click", function () {
      select.selectedIndex = index;
      selectedDiv.innerHTML = this.innerHTML;
      itemsDiv
        .querySelectorAll(".same-as-selected")
        .forEach((s) => s.classList.remove("same-as-selected"));
      this.classList.add("same-as-selected");
      selectedDiv.click(); // 닫기
    });
    itemsDiv.appendChild(item);
  });

  el.appendChild(itemsDiv);

  selectedDiv.addEventListener("click", function (e) {
    e.stopPropagation();

    // 닫을 때는 원래 자리로 복귀, 열 때는 body로 이동
    if (itemsDiv.classList.contains("select-hide")) {
      closeAllSelect();

      // 위치 계산: fixed를 위해 브라우저 화면 기준 좌표 사용
      const rect = selectedDiv.getBoundingClientRect();
      itemsDiv.style.position = "fixed";
      itemsDiv.style.top = rect.bottom + window.scrollY + "px";
      itemsDiv.style.left = rect.left + "px";
      itemsDiv.style.width = rect.width + "px";
      itemsDiv.style.zIndex = "9999";

      document.body.appendChild(itemsDiv); // body로 이동 (overflow 탈출)
      itemsDiv.classList.remove("select-hide");
      selectedDiv.classList.add("select-arrow-active");
    } else {
      el.appendChild(itemsDiv); // 원래 자리로 복귀
      itemsDiv.classList.add("select-hide");
      selectedDiv.classList.remove("select-arrow-active");
    }
  });
}

function closeAllSelect() {
  document
    .querySelectorAll(".select-items")
    .forEach((el) => el.classList.add("select-hide"));
  document
    .querySelectorAll(".select-selected")
    .forEach((el) => el.classList.remove("select-arrow-active"));
}

document.addEventListener("click", closeAllSelect);
