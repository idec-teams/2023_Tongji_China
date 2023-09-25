// 日/月主题切换功能
$('.theme-toggle').click(function() {
    $('.theme-toggle .moon, .theme-toggle .sun').toggleClass('d-none');
    if ($('body').hasClass('dark-theme')) {
        $('body').removeClass('dark-theme');
        localStorage.setItem('theme', 'light'); // 保存选择到LocalStorage
    } else {
        $('body').addClass('dark-theme');
        localStorage.setItem('theme', 'dark'); // 保存选择到LocalStorage
    }
});


// 页面加载时从LocalStorage读取主题选择并应用
$(document).ready(function() {
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
// 侧边栏滚动时间
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const sideLinks = document.querySelectorAll('sidebar a');
    let currentId = '';
  
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
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

//   翻译
  $(document).ready(function () {
    var selectedLang = getCookie('selectedLang');
    var defaultLang = selectedLang || 'en';
    $("[i18n]").i18n({
        defaultLang: defaultLang,
        filePath: "./static/en-cn/i18n/",//路径配置
        filePrefix: "i18n_",
        fileSuffix: "",
        forever: true,
        callback: function () {
            console.log("i18n is ready.");
        },
    });
    /*中英文切换按钮*/
    $("#translate").click(function (e) {
        var a = $(e.target).val() == "cn" ? "en" : "cn";
        var b = a=="cn"?"中/En":"En/中";
        $(e.target).val(a);
        $("#translate").text(b);
        console.log($(e.target).val());
        setCookie('selectedLang', a);

        $("[i18n]").i18n({
            defaultLang: a,
            filePath: "./i18n/",
        });
    });
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // 设置Cookie的值
    function setCookie(name, value) {
        document.cookie = name + "=" + value + ";path=/";
    }
    var selectedLang = getCookie('selectedLang');
    var defaultLang = selectedLang || 'en';
});

(function ($) {
    $.fn.extend({
        i18n: function (options) {
            var defaults = {
                lang: "",
                defaultLang: "",
                filePath: "{{ url_for('static', filename = 'en-cn/i18n.js') }}",
                filePrefix: "i18n_",
                fileSuffix: "",
                forever: true,
                callback: function () {
                }
            };

            function getCookie(name) {
                var arr = document.cookie.split('; ');
                for (var i = 0; i < arr.length; i++) {
                    var arr1 = arr[i].split('=');
                    if (arr1[0] == name) {
                        return arr1[1]
                    }
                }
                return ''
            };

            function setCookie(name, value, myDay) {
                var oDate = new Date();
                oDate.setDate(oDate.getDate() + myDay);
                document.cookie = name + '=' + value + '; expires=' + oDate
            };var options = $.extend(defaults, options);
            if (getCookie('i18n_lang') != "" && getCookie('i18n_lang') != "undefined" && getCookie('i18n_lang') != null) {
                defaults.defaultLang = getCookie('i18n_lang')
            } else if (options.lang == "" && defaults.defaultLang == "") {
                throw "defaultLang must not be null !"
            }
            ;
            if (options.lang != null && options.lang != "") {
                if (options.forever) {
                    setCookie('i18n_lang', options.lang)
                } else {
                    $.removeCookie("i18n_lang")
                }
            } else {
                options.lang = defaults.defaultLang
            }
            ;var i = this;
            $.getJSON(options.filePath + options.filePrefix + options.lang + options.fileSuffix + ".json", function (data) {
                var i18nLang = {};
                if (data != null) {
                    i18nLang = data
                }
                $(i).each(function (i) {
                    var i18nOnly = $(this).attr("i18n-only");
                    if ($(this).val() != null && $(this).val() != "") {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "value") {
                            $(this).val(i18nLang[$(this).attr("i18n")])
                        }
                    }
                    if ($(this).html() != null && $(this).html() != "") {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "html") {
                            $(this).html(i18nLang[$(this).attr("i18n")])
                        }
                    }
                    if ($(this).attr('placeholder') != null && $(this).attr('placeholder') != "") {
                        if (i18nOnly == null || i18nOnly == undefined || i18nOnly == "" || i18nOnly == "placeholder") {
                            $(this).attr('placeholder', i18nLang[$(this).attr("i18n")])
                        }
                    }
                });
                options.callback()
            })
        }
    })
})(jQuery);
