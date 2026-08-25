(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger menu ---------- */
  var hamburger = document.getElementById("hamburgerBtn");
  var mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    hamburger.classList.remove("is-active");
    mobileNav.classList.remove("is-open");
    header.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("is-open");
    hamburger.classList.toggle("is-active", isOpen);
    header.classList.toggle("menu-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- Smooth-scroll offset safety for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", id);
        }
      }
      closeMenu();
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Score bars animate once visible ---------- */
  var scoreBlock = document.getElementById("scoreBreakdown");
  if (scoreBlock && "IntersectionObserver" in window) {
    var scoreIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".score-row").forEach(function (row) {
              var val = parseFloat(row.getAttribute("data-value"));
              var max = parseFloat(row.getAttribute("data-max")) || 30;
              var pct = Math.min(100, (val / max) * 100);
              var fill = row.querySelector(".score-fill");
              requestAnimationFrame(function () { fill.style.width = pct + "%"; });
            });
            scoreIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    scoreIO.observe(scoreBlock);
  }

  /* ---------- Map filter chips (visual demo only) ---------- */
  var mapFilters = document.getElementById("mapFilters");
  if (mapFilters) {
    mapFilters.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        mapFilters.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
      });
    });
  }

  /* ---------- Map pin <-> store card sync (visual demo only) ---------- */
  var mapCanvas = document.getElementById("mapCanvas");
  var storeCards = document.getElementById("storeCards");
  if (mapCanvas && storeCards) {
    var pins = mapCanvas.querySelectorAll(".map-pin");
    var cards = storeCards.querySelectorAll(".store-card");

    function activateStore(id) {
      pins.forEach(function (p) { p.classList.toggle("is-active", p.dataset.store === id); });
      cards.forEach(function (c) { c.classList.toggle("is-active", c.dataset.store === id); });
    }

    pins.forEach(function (pin) {
      pin.addEventListener("click", function () { activateStore(pin.dataset.store); });
      pin.addEventListener("mouseenter", function () { activateStore(pin.dataset.store); });
    });
    cards.forEach(function (card) {
      card.addEventListener("mouseenter", function () { activateStore(card.dataset.store); });
    });
  }

  /* ---------- Mobile bottom-nav active state ---------- */
  var bottomLinks = document.querySelectorAll(".bottom-nav a");
  var sectionMap = [
    { id: "top", link: 0 },
    { id: "daily", link: 1 },
    { id: "map", link: 2 },
    { id: "products", link: 3 },
    { id: "roles", link: 4 }
  ];
  if (bottomLinks.length && "IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var match = sectionMap.find(function (s) { return s.id === entry.target.id; });
            if (match) {
              bottomLinks.forEach(function (l, i) {
                if (!l.classList.contains("is-primary")) l.classList.toggle("is-active", i === match.link);
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionMap.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el) navIO.observe(el);
    });
  }
})();
