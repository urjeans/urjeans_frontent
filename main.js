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

// Store player instances by key
const players = {};
const playerReady = {};
const playerLoaded = {};

// Video configuration for each section
const videoConfig = {
  index: { 
    playerId: "player-index", 
    previewId: "preview-index", 
    videoId: "xB3SJ46MukE",
    thumbnailUrl: "https://img.youtube.com/vi/xB3SJ46MukE/maxresdefault.jpg"
  },
  about1: { 
    playerId: "player-about1", 
    previewId: "preview-about1", 
    videoId: "rsm5IFJYoZY",
    thumbnailUrl: "https://img.youtube.com/vi/rsm5IFJYoZY/maxresdefault.jpg"
  },
  about2: { 
    playerId: "player-about2", 
    previewId: "preview-about2", 
    videoId: "uEwHLFypNhw",
    thumbnailUrl: "https://img.youtube.com/vi/uEwHLFypNhw/maxresdefault.jpg"
  }
};

// Initialize YouTube API only when needed
let youtubeAPIReady = false;
let youtubeAPILoading = false;

function loadYouTubeAPI() {
  if (youtubeAPIReady || youtubeAPILoading) return;
  
  youtubeAPILoading = true;
  
  // Create script tag dynamically
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.async = true;
  
  script.onload = () => {
    window.onYouTubeIframeAPIReady = () => {
      youtubeAPIReady = true;
      youtubeAPILoading = false;
      console.log('YouTube API loaded successfully');
    };
  };
  
  document.head.appendChild(script);
}

function createPlayer(key) {
  const cfg = videoConfig[key];
  
  if (!youtubeAPIReady) {
    loadYouTubeAPI();
    // Wait for API to be ready
    const checkAPI = setInterval(() => {
      if (youtubeAPIReady) {
        clearInterval(checkAPI);
        createPlayer(key);
      }
    }, 100);
    return;
  }
  
  if (playerLoaded[key]) return;
  
  const playerElement = document.getElementById(cfg.playerId);
  if (!playerElement) return;
  
  console.log(`Creating player for ${key}: ${cfg.playerId}`);
  
  players[key] = new YT.Player(cfg.playerId, {
    videoId: cfg.videoId,
    playerVars: {
      autoplay: 1, // Autoplay when created
      controls: 1,
      rel: 0,
      modestbranding: 1,
      fs: 1,
      showinfo: 0,
      iv_load_policy: 3, // Disable annotations
      cc_load_policy: 0, // Disable captions
    },
    events: {
      onReady: () => {
        console.log(`Player ${key} ready`);
        playerReady[key] = true;
        playerLoaded[key] = true;
      },
      onError: (event) => {
        console.error(`Player ${key} error:`, event.data);
        // Fallback to direct YouTube link
        const playerElement = document.getElementById(cfg.playerId);
        if (playerElement) {
          playerElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #000;">
              <a href="https://www.youtube.com/watch?v=${cfg.videoId}" target="_blank" 
                 style="color: white; text-decoration: none; padding: 15px 30px; border: 2px solid white; border-radius: 5px;">
                YouTube'da ko'rish
              </a>
            </div>
          `;
        }
      }
    },
  });
  
  playerLoaded[key] = true;
}

function startVideo(key) {
  const cfg = videoConfig[key];
  
  // Hide preview overlay
  const previewElement = document.getElementById(cfg.previewId);
  if (previewElement) {
    previewElement.style.display = "none";
  }
  
  // Create player if not already created
  if (!playerLoaded[key]) {
    createPlayer(key);
  } else if (playerReady[key] && players[key]) {
    // Player already exists, just play
    players[key].playVideo();
  }
}

// Alternative lightweight approach - direct YouTube links
function setupLightweightVideos() {
  Object.keys(videoConfig).forEach(key => {
    const cfg = videoConfig[key];
    const previewElement = document.getElementById(cfg.previewId);
    
    if (previewElement) {
      // Replace the watch button with a direct YouTube link
      const watchButton = previewElement.querySelector('.watch-button');
      if (watchButton) {
        watchButton.onclick = null; // Remove the old onclick
        watchButton.style.cursor = 'pointer';
        
        // Create a new link wrapper
        const linkWrapper = document.createElement('a');
        linkWrapper.href = `https://www.youtube.com/watch?v=${cfg.videoId}`;
        linkWrapper.target = '_blank';
        linkWrapper.style.textDecoration = 'none';
        linkWrapper.style.color = 'inherit';
        
        // Move the button inside the link
        watchButton.parentNode.insertBefore(linkWrapper, watchButton);
        linkWrapper.appendChild(watchButton);
        
        // Update button text to indicate it opens in new tab
        watchButton.innerHTML = watchButton.innerHTML + ' <i class="fas fa-external-link-alt" style="margin-left: 8px; font-size: 14px;"></i>';
      }
    }
  });
}

// Preload YouTube API when user hovers over video sections (optional optimization)
function setupVideoHoverPreload() {
  Object.keys(videoConfig).forEach(key => {
    const cfg = videoConfig[key];
    const previewElement = document.getElementById(cfg.previewId);
    
    if (previewElement) {
      previewElement.addEventListener('mouseenter', () => {
        // Preload API on hover
        loadYouTubeAPI();
      }, { once: true }); // Only trigger once
    }
  });
}

// Initialize hover preloading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupVideoHoverPreload();
    // Uncomment the line below to use lightweight approach instead
    // setupLightweightVideos();
  });
} else {
  setupVideoHoverPreload();
  // Uncomment the line below to use lightweight approach instead
  // setupLightweightVideos();
}

const upBtn = document.getElementById("up");

// Function to handle scroll and show/hide up button
function handleScroll() {
  if (upBtn) {
    // Show button after scrolling 300px
    if (window.scrollY > 300) {
      upBtn.classList.add('show');
    } else {
      upBtn.classList.remove('show');
    }
  }
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll);

if (upBtn) {
  upBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}


// Gallery card functionality - moved inside DOM ready check
function initializeGalleryCards() {
  const cards = document.querySelectorAll(".card");

  // Add "is-active" class to all cards initially
  cards.forEach(card => card.classList.add("is-active"));

  // Use event delegation for better performance
  document.addEventListener("mouseenter", event => {
    const card = event.target.closest(".card");
    if (card) {
      cards.forEach(c => c.classList.remove("is-active"));
      card.classList.add("is-active");
    }
  }, true);

  document.addEventListener("mouseleave", event => {
    const card = event.target.closest(".card");
    if (card) {
      cards.forEach(c => c.classList.add("is-active"));
    }
  }, true);
}

// Initialize gallery cards when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGalleryCards);
} else {
  initializeGalleryCards();
}