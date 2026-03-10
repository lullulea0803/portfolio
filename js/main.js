fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // header가 DOM에 생긴 다음 실행
    const toogleMenu = document.querySelector(".btn-menu");
    const header = document.querySelector("header");
    const menu = document.querySelector(".gnb");

    // gnb responsible
    if (toogleMenu && header && menu) {
      toogleMenu.addEventListener('click', () => {
        header.classList.toggle('active');
        menu.classList.toggle('active');
        toogleMenu.classList.toggle('active');
      });
    }
    // theme
    const btnTheme = document.querySelector(".btn-darkmode");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      body.classList.add("dark");
      btnTheme.classList.add("is-light");
    }

    if (btnTheme) {
      btnTheme.addEventListener("click", () => {
        btnTheme.classList.toggle("is-light");
        body.classList.toggle("dark");
        // 현재 상태 저장
        if (body.classList.contains("dark")) {
          localStorage.setItem("theme", "dark");
        } else {
          localStorage.setItem("theme", "light");
        }
      });
    }
    // gototop
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        document.body.classList.add('active');
      }
      else {
        document.body.classList.remove('active');

      }
    });
    // toast
    const toast = document.getElementById('copyToast');
    document.querySelectorAll('.copy').forEach(function (el) {

      el.addEventListener('click', function () {

        navigator.clipboard.writeText(this.innerText);

        toast.classList.add('show');

        setTimeout(function () {
          toast.classList.remove('show');
        }, 1500);

      });

    });

  });


