/*!
 * Chrono Watch Store - Fixes + RTL/Persian helpers
 * Developer: Erfan Sadeghi (https://erfansadeghi.ir)
 */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var isRTL = (docEl && docEl.getAttribute("dir") === "rtl");

  // -----------------------------
  // Preloader (fix stuck loading)
  // -----------------------------
  function hidePreloader() {
    var pre = document.getElementById("preloader");
    if (!pre) return;
    pre.style.opacity = "0";
    pre.style.visibility = "hidden";
    window.setTimeout(function () {
      if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
    }, 500);
  }
  window.addEventListener("load", function () {
    window.setTimeout(hidePreloader, 50);
  });
  // Fallback (in case some scripts fail)
  window.setTimeout(hidePreloader, 2500);

  // -----------------------------
  // Back to top
  // -----------------------------
  var backToTop = document.getElementById("backto-top");
  if (backToTop) {
    var onScroll = function () {
      if (window.scrollY > 300) backToTop.classList.add("show");
      else backToTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -----------------------------
  // Mobile menu (chrono-wrapper)
  // -----------------------------
  var menuWrapper = document.querySelector(".chrono-wrapper");
  var menuToggles = document.querySelectorAll(".chrono-toggle");

  function openMenu() {
    if (!menuWrapper) return;
    menuWrapper.classList.add("vs-body-visible");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!menuWrapper) return;
    menuWrapper.classList.remove("vs-body-visible");
    document.body.style.overflow = "";
  }
  function toggleMenu(e) {
    if (e) e.preventDefault();
    if (!menuWrapper) return;
    if (menuWrapper.classList.contains("vs-body-visible")) closeMenu();
    else openMenu();
  }

  if (menuToggles && menuToggles.length) {
    menuToggles.forEach(function (btn) {
      btn.addEventListener("click", toggleMenu);
    });
  }

  if (menuWrapper) {
    // Click outside panel closes
    menuWrapper.addEventListener("click", function (e) {
      if (e.target === menuWrapper) closeMenu();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // -----------------------------
  // jQuery plugins (Slick, IonRangeSlider)
  // -----------------------------
  function initJqueryPlugins() {
    if (!window.jQuery) return;
    var $ = window.jQuery;

    // Mobile submenu toggles (template mismatch fix)
    $(".vs-mobile-menu").each(function () {
      var $menu = $(this);

      $menu.find("li").has("ul").each(function () {
        var $li = $(this);
        if (!$li.hasClass("vs-item-has-children")) $li.addClass("vs-item-has-children");

        var $a = $li.children("a").first();
        if ($a.length && $a.find(".vs-mean-expand").length === 0) {
          $a.append('<span class="vs-mean-expand" aria-hidden="true"></span>');
        }

        // Hide submenus by default
        var $sub = $li.children("ul");
        if ($sub.length) $sub.hide();
      });

      $menu.on("click", ".vs-mean-expand", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var $li = $(this).closest("li");
        $li.toggleClass("vs-active");
        $li.children("ul").first().stop(true, true).slideToggle(200);
      });
    });

    // Helper: safe slick init
    function safeSlick($el, options) {
      if (!$el || !$el.length) return;
      if (typeof $el.slick !== "function") return;
      if ($el.hasClass("slick-initialized")) return;
      $el.slick(options);
    }

    // Product carousels
    safeSlick($(".products-slider-1"), {
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      rtl: isRTL,
      responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 576, settings: { slidesToShow: 1 } }
      ]
    });

    safeSlick($(".products-slider-2"), {
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      rtl: isRTL,
      responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 576, settings: { slidesToShow: 1 } }
      ]
    });

    // Blogs / Testimonials
    safeSlick($(".blogs-slider, .blogs-slider-2"), {
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      rtl: isRTL,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });

    safeSlick($(".testimonials-slider"), {
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      rtl: isRTL,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });

    // Sync sliders inside product cards (grid cards)
    $(".product-card").each(function (idx) {
      var $card = $(this);
      var $slider = $card.find(".product-card-slider").first();
      var $nav = $card.find(".product-card-slider-nav").first();
      if (!$slider.length || !$nav.length) return;

      var sliderId = "pc-slider-" + idx;
      var navId = "pc-nav-" + idx;
      $slider.attr("id", sliderId);
      $nav.attr("id", navId);

      safeSlick($slider, {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        rtl: isRTL,
        asNavFor: "#" + navId
      });

      safeSlick($nav, {
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: "#" + sliderId,
        focusOnSelect: true,
        arrows: false,
        rtl: isRTL
      });
    });

    // Sync sliders inside product list cards
    $(".product-card-list").each(function (idx) {
      var $card = $(this);
      var $slider = $card.find(".product-card-slider-2").first();
      var $nav = $card.find(".product-card-slider-nav-2").first();
      if (!$slider.length || !$nav.length) return;

      var sliderId = "pc2-slider-" + idx;
      var navId = "pc2-nav-" + idx;
      $slider.attr("id", sliderId);
      $nav.attr("id", navId);

      safeSlick($slider, {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        rtl: isRTL,
        asNavFor: "#" + navId
      });

      safeSlick($nav, {
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: "#" + sliderId,
        focusOnSelect: true,
        arrows: false,
        rtl: isRTL
      });
    });


    // Quantity increment/decrement (Cart)
    $(document).on("click", ".quantity-wrap .increment, .quantity-wrap .decrement", function (e) {
      e.preventDefault();
      var $wrap = $(this).closest(".quantity-wrap");
      var $input = $wrap.find("input.number").first();
      if (!$input.length) return;

      var val = parseInt($input.val(), 10);
      if (isNaN(val)) val = 1;

      if ($(this).hasClass("increment")) val += 1;
      else val -= 1;

      if (val < 1) val = 1;
      $input.val(val);
    });

    // Toggle password visibility
    $(document).on("click", ".toggle-password", function (e) {
      e.preventDefault();
      var selector = $(this).attr("toggle");
      if (!selector) return;
      var $input = $(selector);
      if (!$input.length) return;

      var type = $input.attr("type");
      $input.attr("type", type === "password" ? "text" : "password");

      var $icon = $(this).find("i");
      if ($icon.length) {
        $icon.toggleClass("fa-eye fa-eye-slash");
      }
    });

    // Price range slider (Ion.RangeSlider)
    if (typeof $.fn.ionRangeSlider === "function") {
      $(".js-slider").each(function () {
        var $input = $(this);
        if ($input.data("ionRangeSlider")) return;
        $input.ionRangeSlider({
          type: "double",
          min: 0,
          max: 1000,
          from: 100,
          to: 700,
          grid: false
        });
      });
    }
  }

  // Wait for DOM ready (and for jQuery CDN to load)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJqueryPlugins);
  } else {
    initJqueryPlugins();
  }
})();
