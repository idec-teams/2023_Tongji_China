if (typeof jQuery == 'undefined') {
    console.log("jQuery hasn't been loaded yet!");
}

// 加载页面
window.onload = function() {
    // 获取.loading-body元素
    var loadingScreen = document.querySelector('.loading-body');
    
    // 使用setTimeout来延迟隐藏动画
    setTimeout(function() {
        loadingScreen.style.display = 'none';
        document.body.classList.remove('no-scroll');  // 移除.no-scroll类，允许滚动
    }, 300);  // 延迟300毫秒，即0.3秒
    document.body.classList.add('no-scroll');
}

// 日/月主题切换功能
$('.theme-toggle').click(function () {
    $('.theme-toggle .moon, .theme-toggle .sun').toggleClass('d-none');
    if ($('body').hasClass('dark-theme')) {
        $('body').removeClass('dark-theme');
        localStorage.setItem('theme', 'light'); // 保存选择到LocalStorage
    } else {
        $('body').addClass('dark-theme');
        localStorage.setItem('theme', 'dark'); // 保存选择到LocalStorage
    }
});
// 语言切换功能
$('.lang-toggle').click(function () {
    var ens = document.querySelectorAll('.en');
    var cns = document.querySelectorAll('.cn');
    ens.forEach(function (en) {
        en.classList.toggle("d-none");
    });
    cns.forEach(function (cn) {
        cn.classList.toggle("d-none");
    });
    if ($('body').hasClass('lang_cn')) {
        $('body').removeClass('lang_cn');
        localStorage.setItem('lang', 'en'); // 保存选择到LocalStorage
    } else {
        $('body').addClass('lang_cn');
        localStorage.setItem('lang', 'cn'); // 保存选择到LocalStorage
    }
});
// 页面加载时从LocalStorage读取主题和语言选择并应用
$(document).ready(function () {
    // 主题存储
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-theme');
        $('.theme-toggle .moon').addClass('d-none');
        $('.theme-toggle .sun').removeClass('d-none');
    } else {
        $('body').removeClass('dark-theme');
        $('.theme-toggle .moon').removeClass('d-none');
        $('.theme-toggle .sun').addClass('d-none');
    }
    // 语言存储
    const savedlang = localStorage.getItem('lang');
    if (savedlang) {
        $('body').addClass(`lang_${savedlang}`);
        const ens = document.querySelectorAll('.en');
        const cns = document.querySelectorAll('.cn');
        if (savedlang === 'cn') {
            ens.forEach(function (en) {
                en.classList.add("d-none");
            });
            cns.forEach(function (cn) {
                cn.classList.remove("d-none");
            });
        } else {
            ens.forEach(function (en) {
                en.classList.remove("d-none");
            });
            cns.forEach(function (cn) {
                cn.classList.add("d-none");
            });
        }
    }
});



// 下拉菜单
$(document).ready(function () {
    $('.navbar-nav li.dropdown').hover(function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function () {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });
});

// 定义处理滚动事件的函数
function handleScroll() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 80) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}
function handleScroll() {
    var toptransparent = document.querySelector('.toptransparent');
    if (window.scrollY > 80) {
        toptransparent.classList.add('toptransparent-scrolled');
    } else {
        toptransparent.classList.remove('toptransparent-scrolled');
    }
}

// 在页面加载时监听滚动事件
window.addEventListener('scroll', handleScroll);

// 在页面加载完成后立即执行一次处理函数，以确保导航栏状态正确
window.addEventListener('load', handleScroll);

// 更新样式文件引用
function newversion() {
    let stylesheet = document.getElementById('themeStylesheet');
    let currentHref = stylesheet.getAttribute('href');
    let newHref = currentHref.replace(/v=\d+/, 'v=' + new Date().getTime());
    stylesheet.setAttribute('href', newHref);
}
// 侧边栏滚动 ；链接响应
window.addEventListener('scroll', function() {
    // 获取所有的.module元素，这些元素代表每个模块的内容
    const sections = document.querySelectorAll('.container .module');
    // 获取侧边栏中的所有链接
    const sideLinks = document.querySelectorAll('.sidenav a');
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150; // 考虑到可能的页面间距或标题高度，对偏移量进行了调整
        if (window.scrollY >= sectionTop) {
          currentId = section.id;
        }
      });

    sideLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentId) {
        link.classList.add('active');
      }
    });
});



// read more
$(document).ready(function () {
    $("#readMoreBtn").click(function () {
        $("#moreContent").toggleClass("hidden");
    });
});

// 进度条
var triangle = document.getElementById("triangle");
var length = triangle.getTotalLength();

triangle.style.strokeDasharray = length;

triangle.style.strokeDashoffset = length;

window.addEventListener("scroll", myFunction8);

function myFunction8() {
    var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);

    var draw = length * scrollpercent;

    // Reverse the drawing (when scrolling upwards)
    triangle.style.strokeDashoffset = length - draw;
}

// read more 折叠卡片
"use strict";
// 定义一个变量来保存滚动条位置
var savedScrollTop;

$('.book').on('click', function () {
    // 如果当前卡片已经展开，那么折叠它并显示所有其他的卡片
    if ($(this).hasClass('book--expanded')) {
        $(this).removeClass('book--expanded');
        $('.book').removeClass('transparent');
        $(this).scrollTop(0);

        // 立即将滚动条位置设置回保存的位置
        $(window).scrollTop(savedScrollTop);
    } else {
        // 保存当前的滚动条位置
        savedScrollTop = $(window).scrollTop();

        // 否则，展开当前卡片并隐藏所有其他的卡片
        $('.book').removeClass('book--expanded').addClass('transparent');
        $(this).addClass('book--expanded').removeClass('transparent');
    }
});

// 折叠菜单

$(document).ready(function() {
    $(".accordion").on("click touchstart", function(e) {
        e.preventDefault();
        $(this).toggleClass("active");
        var panel = $(this).next(".panel");
        panel.slideToggle();
    });
});

// team page img hover3D from jquery
!function (e) { e.fn.hover3d = function (t) { var r = e.extend({ selector: null, perspective: 1e3, sensitivity: 20, invert: !1, shine: !1, hoverInClass: "hover-in", hoverOutClass: "hover-out", hoverClass: "hover-3d" }, t); return this.each(function () { function t(e) { i.addClass(r.hoverInClass + " " + r.hoverClass), currentX = currentY = 0, setTimeout(function () { i.removeClass(r.hoverInClass) }, 1e3) } function s(e) { var t = i.innerWidth(), s = i.innerHeight(), n = Math.round(e.pageX - i.offset().left), o = Math.round(e.pageY - i.offset().top), v = r.invert ? (t / 2 - n) / r.sensitivity : -(t / 2 - n) / r.sensitivity, c = r.invert ? -(s / 2 - o) / r.sensitivity : (s / 2 - o) / r.sensitivity, u = n - t / 2, p = o - s / 2, f = Math.atan2(p, u), h = 180 * f / Math.PI - 90; 0 > h && (h += 360), i.css({ perspective: r.perspective + "px", transformStyle: "preserve-3d", transform: "rotateY(" + v + "deg) rotateX(" + c + "deg)" }), a.css("background", "linear-gradient(" + h + "deg, rgba(255,255,255," + e.offsetY / s * .5 + ") 0%,rgba(255,255,255,0) 80%)") } function n() { i.addClass(r.hoverOutClass + " " + r.hoverClass), i.css({ perspective: r.perspective + "px", transformStyle: "preserve-3d", transform: "rotateX(0) rotateY(0)" }), setTimeout(function () { i.removeClass(r.hoverOutClass + " " + r.hoverClass), currentX = currentY = 0 }, 1e3) } var o = e(this), i = o.find(r.selector); currentX = 0, currentY = 0, r.shine && i.append('<div class="shine"></div>'); var a = e(this).find(".shine"); o.css({ perspective: r.perspective + "px", transformStyle: "preserve-3d" }), i.css({ perspective: r.perspective + "px", transformStyle: "preserve-3d" }), a.css({ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, transform: "translateZ(1px)", "z-index": 9 }), o.on("mouseenter", function () { return t() }), o.on("mousemove", function (e) { return s(e) }), o.on("mouseleave", function () { return n() }) }) } }(jQuery);
$(".hover3d").hover3d({
    selector: ".hover3d-child",
    invert: true
});