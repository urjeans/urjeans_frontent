document.addEventListener("DOMContentLoaded", function () {
  function setupAutoScroll(selector, breakpoint = 560, intervalMs = 5000) {
    const parent = document.querySelector(selector);
    if (!parent) return;
    const items = parent.children;
    let index = 0;
    let interval = null;

    function scrollToItem(i) {
      if (items[i]) {
        parent.scrollTo({
          left: items[i].offsetLeft,
          behavior: "smooth",
        });
      }
    }

    function startAutoScroll() {
      clearInterval(interval);
      interval = setInterval(() => {
        index = (index + 1) % items.length;
        scrollToItem(index);
      }, intervalMs);
    }

    function handleResize() {
      if (window.innerWidth <= breakpoint) {
        startAutoScroll();
      } else {
        clearInterval(interval);
        index = 0;
        parent.scrollLeft = 0;
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();
  }

  setupAutoScroll(".parent", 560, 4000);
  setupAutoScroll(".partners-logo", 560, 3500);
  setupAutoScroll(".parent1", 560, 3500);

  function fadeUpOnScroll() {
    const fadeEls = document.querySelectorAll(".fade-up");
    function checkFade() {
      fadeEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add("visible");
        }
      });
    }
    window.addEventListener("scroll", checkFade);
    window.addEventListener("resize", checkFade);
    checkFade();
  }

  fadeUpOnScroll();

  const hamburger = document.getElementById("hamburger-menu");
  const mobileNav = document.getElementById("mobile-nav");
  const body = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("active");
      if (mobileNav.classList.contains("active")) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "";
      }
    });

    // Handle mobile navigation links specifically
    const mobileNavLinks = mobileNav.querySelectorAll(".mobile-ul a");
    
    // Simple approach: just close menu on navigation link click
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        
        // Close the mobile menu
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
        body.style.overflow = "";
      });
    });
  }

  document.querySelectorAll(".brand-slider").forEach(function (slider) {
    const images = slider.querySelectorAll("img");
    let idx = 0;
    let interval = setInterval(next, 3000);

    function show(i) {
      images[idx].classList.remove("active");
      idx = (i + images.length) % images.length;
      images[idx].classList.add("active");
    }
    function next() {
      show(idx + 1);
    }
    function prev() {
      show(idx - 1);
    }

    let startX = null;
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
    slider.addEventListener("touchend", (e) => {
      if (startX === null) return;
      let endX = e.changedTouches[0].clientX;
      if (endX - startX > 40) {
        prev();
      } else if (startX - endX > 40) {
        next();
      }
      startX = null;
    });

    let mouseDown = false;
    let mouseStartX = null;
    slider.addEventListener("mousedown", (e) => {
      mouseDown = true;
      mouseStartX = e.clientX;
      slider.style.userSelect = "none";
    });
    document.addEventListener("mouseup", (e) => {
      if (!mouseDown) return;
      let mouseEndX = e.clientX;
      if (mouseEndX - mouseStartX > 40) {
        prev();
      } else if (mouseStartX - mouseEndX > 40) {
        next();
      }
      mouseDown = false;
      mouseStartX = null;
      slider.style.userSelect = "";
    });

    slider.addEventListener("mouseenter", () => clearInterval(interval));
    slider.addEventListener("mouseleave", () => (interval = setInterval(next, 2500)));
  });

  const parent1Wrapper = document.querySelector(".parent1-slider-wrapper");
  if (parent1Wrapper) {
    const parent1 = parent1Wrapper.querySelector(".parent1");
    const items = Array.from(parent1.children);
    const prevBtn = parent1Wrapper.querySelector(".parent1-prev");
    const nextBtn = parent1Wrapper.querySelector(".parent1-next");
    const pagination = parent1Wrapper.querySelector(".parent1-pagination");
    const visibleCount = 10;
    const total = items.length;
    const pageCount = Math.ceil(total / visibleCount);
    let page = 0;

    function render() {
      items.forEach((item, i) => {
        item.style.display = i >= page * visibleCount && i < (page + 1) * visibleCount ? "flex" : "none";
      });
      prevBtn.disabled = page === 0;
      nextBtn.disabled = page === pageCount - 1;

      pagination.innerHTML = "";
      function addBtn(i, text = null) {
        const btn = document.createElement("button");
        btn.textContent = text || i + 1;
        if (i === page) btn.className = "active";
        btn.addEventListener("click", () => {
          page = i;
          render();
        });
        pagination.appendChild(btn);
      }
      function addEllipsis() {
        const span = document.createElement("span");
        span.textContent = "...";
        span.className = "ellipsis";
        pagination.appendChild(span);
      }

      if (pageCount <= 7) {
        for (let i = 0; i < pageCount; i++) addBtn(i);
      } else {
        addBtn(0);
        if (page > 3) addEllipsis();
        for (let i = Math.max(1, page - 1); i <= Math.min(pageCount - 2, page + 1); i++) addBtn(i);
        if (page < pageCount - 4) addEllipsis();
        addBtn(pageCount - 1);
      }
    }

    prevBtn.addEventListener("click", () => {
      if (page > 0) {
        page--;
        render();
      }
    });
    nextBtn.addEventListener("click", () => {
      if (page < pageCount - 1) {
        page++;
        render();
      }
    });

    render();
  }
});

let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const indicators = document.querySelectorAll(".indicator");
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i === index);
  });
  
  // Reset and trigger animations for the active slide
  const activeSlide = slides[index];
  if (activeSlide) {
    const textLines = activeSlide.querySelectorAll('.text-line');
    const animatedBtn = activeSlide.querySelector('.animated-btn');
    
    // Reset animations
    textLines.forEach(line => {
      line.style.animation = 'none';
      line.offsetHeight; // Trigger reflow
      line.style.animation = null;
    });
    
    if (animatedBtn) {
      animatedBtn.style.animation = 'none';
      animatedBtn.offsetHeight; // Trigger reflow
      animatedBtn.style.animation = null;
    }
    
    // Trigger animations with slight delay
    setTimeout(() => {
      textLines.forEach((line, i) => {
        line.style.animation = `textSlideUp 0.8s ease-out ${0.3 + (i * 0.3)}s forwards`;
      });
      
      if (animatedBtn) {
        animatedBtn.style.animation = `btnFadeIn 0.8s ease-out 0.9s forwards`;
      }
    }, 100);
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

setInterval(nextSlide, 5000);

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

let playerReady = false;
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    videoId: "fa8k8IQ1_X0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      fs: 0,
      showinfo: 0,
    },
    events: {
      onReady: () => {
        playerReady = true;
      },
    },
  });
}

function startVideo() {
  if (playerReady) {
    document.getElementById("preview").style.display = "none";
    player.playVideo();
  } else {
    alert("Video hali yuklanmadi. Iltimos, kuting.");
  }
}

const upBtn = document.getElementById("up");

if (upBtn) {
  upBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
