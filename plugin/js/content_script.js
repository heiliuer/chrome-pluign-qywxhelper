+function () {

    // 判断域名
    var isDomain = (function () {
        var cDomain = document.domain;
        return function (domain) {
            return cDomain.indexOf(domain) != -1;
        }
    })();

    // 移除dom
    var adHandler = (function () {
        var $doc = $(document);
        return {
            remove: function (selector) {
                try {
                    //console.log("remove ad: ", selector, " ",
                    //		$doc.find(selector).length);
                    $doc.find(selector).remove();
                } catch (e) {
                    console.error("error remove:", selector);
                    return;
                }
            },
            removes: function (selectors) {
                var self = this;
                selectors.forEach(function (selector) {
                    self.remove(selector);
                });
            }
        }
    })();
    var blockConfig = {
        commom: ["[ad-data]", "[class^='ad_']", "[class^='ads-']",
            "[class^='ads_']", "[class^='ad-']", "[id$='AD']",
            "[class$='-ad']", "[class$='_ad']", "[adsid]", ".ad-box",
            "[id^='fn']"/* 百度全屏流氓广告 */],// 通用
        urls: [{
            url: "qq.com",// 腾讯新闻
            selectors: ["[id^='QQcom_']", "[id^='PD_PL_F']",
                "[id^='F_Rectangle_N']", "[id^='gaoqing_F_bottom']",
                "[class^='SogouKeywords']", "[id^='gdt_']",
                "[id^='coo_qqBrowser']"]
        }, {
            url: "csdn.net",// csdn
            selectors: [".header.clearfix", "[id^='ads_']", ".sidebar .hot"]
        }, {
            url: "6vhao.com",// 6v
            selectors: ["[id^='gg']", "#header .log,#header .topad",
                "[id^='ft_couplet_']"]
        }],
        iframes: {
            srcs: ["img.88rpg", "cpc.88", "ktunions.com", "gtimg.com",
                "cb.baidu.com/ecom", "sax.sina.com.cn", "x.jd.com",
                "801.tianya"],
            attrs: ["adconfig_lview", "adconfig_charset",
                "adconfig_lview_template", "srcdoc"]
        },
        hrefs: ["ccc.x.jd.com", "tk.859377"/* 全屏流氓广告 */, "sax.sina.com.cn"],
        srcs: ["to3.ysjwj.com", "sax.sina.com.cn", "tk.859377"]
    };

    var clearAds = function () {
        // 通用过滤
        adHandler.removes(blockConfig.commom);

        // 过滤具有src*,attrs特征的iframe
        blockConfig.iframes.srcs.forEach(function (src) {
            adHandler.remove("iframe[src*='" + src + "']");
        });
        blockConfig.iframes.attrs.forEach(function (attr) {
            adHandler.remove("iframe[" + attr + "]");
        });

        // 针对 hrefs过滤
        blockConfig.hrefs.forEach(function (href) {
            adHandler.remove("[href*='" + href + "']");
        });
        // 针对 srcs过滤
        blockConfig.srcs.forEach(function (src) {
            adHandler.remove("[src*='" + src + "']");
        });

        // 针对域名过滤
        blockConfig.urls.forEach(function (us) {
            if (isDomain(us.url)) {
                adHandler.removes(us.selectors);
            }
        });
    }
//$(window).load(clearAds);
//setInterval(clearAds, 1000);
//$(document).ready(clearAds);
//<td colspan="3"><a class="btn btn-primary newIPS btn-l" href="#"><span style="width: 200px;">重置运营商信息</span></a></td>
    $(function () {
        clearAds();

        //进入路由器
        if (isDomain("192.168.1.1")) {
            $("#rtloginform #password").val("1234");
            $("#rtloginform #btnRtSubmit").click();

            // 增加 所有重新连接 关闭所有正在连接 操作按钮
            var $modNat = $(".mod-set.mod-nat");
            if ($modNat.length) {
                function get$a(name) {
                    return $("<a class='btn btn-primary btn-l' style='margin: 14px 13px 0 0;'>").append($("<span style='width: 200px;'>").text(name));
                }

                var $a = get$a("所有重新连接");
                $a.attr("onclick", '$(".reConWan").click().each(function () { $(".d-ft [data-id=ok]").click() });');
                var $bd = $modNat.find(".bd");
                $bd.append($a);

                $a = get$a("关闭所有正在连接");
                $a.attr("onclick", '$(".mod-set.mod-nat").find("tr td:nth-of-type(3)").each(function () { var $this = $(this); if ($this.text().indexOf("正在连接")!=-1){ $this.parent().find(".closeWan").click().each(function () { $(".d-ft [data-id=ok]").click() }); } });');
                $bd.append($a);
            }
        }

        function getStorage(callback) {
            chrome.storage.sync.get('data', function (data) {
                console.log("get data:", data.data);
                callback(data.data)
            });
        }

        getStorage(function (data) {
            loadData(data || {});
        })

        function loadData(data) {
            var password = data.passwd;
            var enable = (password || "").length > 0 && data.checked
            //设置企业号密码
            if (isDomain("qq.com") && enable) {
                var delay = 400;
                var timer;

                function autoInputPwd() {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        try {
                            var $docFrame = $(window.frames[0].document);
                            $docFrame.ready(function () {
                                var $input = $docFrame.find("[type='password']");
                                $input.val(password).trigger("change input");
                                $docFrame.find(".mod-set-pwd__submit,.js_confirm").removeClass("button-primary_disabled disabled").removeAttr("disabled");
                                if (!$input.length) {
                                    autoInputPwd();
                                }
                            });
                        } catch (e) {
                            autoInputPwd();
                        }

                        var $input = $("[type='password']").val(password).trigger("change input");
                        $(".mod-set-pwd__submit,.js_confirm").removeClass("button-primary_disabled disabled").removeAttr("disabled");
                        if (!$input.length) {
                            autoInputPwd();
                        }
                    }, delay);
                    //解决顶部提示宽度撑满，遮住连接的问题
                    $(".page_tips").css({width: "200px", margin: "0 auto"});
                }

                autoInputPwd();
            }

        }

        //消除百度搜索结果广告条目


        var enable_baidu_adblock = false;

        if (isDomain("baidu.com") && enable_baidu_adblock) {
            //垃圾推广广告
            //带v1 v2 v3
            var num = 0;
            var pageNum = 0;

            function inAtTime(func, inT, timeO, clearFunc) {
                var tin = setInterval(func, inT);
                var ttime = setTimeout(function () {
                    clearInterval(tin);
                    tin = null;
                    ttime = null;
                    clearFunc && clearFunc();
                }, timeO);
                return {
                    clear: function () {
                        tin && clearInterval(tin);
                        ttime && clearTimeout(ttime);
                        //clearFunc && clearFunc();
                    }
                }
            }

            function clearBaiduAd() {
                $("#content_left>div").map(function () {
                    if ($(this).find("[class*=c-icon-v]").length) {
                        ++num
                        pageNum++
                        $(this).remove();
                    }
                });
            }

            function onClearAPage() {
                console.log("%c删除百度推广广告 总数[%d] 本页[%d]", "font-size:25px;color:#19652a;", num, pageNum);
                pageNum = 0
            }

            var tpageInA = inAtTime(clearBaiduAd, 120, 120 * 10, onClearAPage);

            // function lClick() {
            //     $("#container #page").off("click.i").on("click.i", function () {
            //         // console.log("page click")
            //         tInAtTime && tInAtTime.clear()
            //         tInAtTime = inAtTime(lClick, 100, 100 * 30)
            //         tpageInA && tpageInA.clear()
            //         tpageInA = inAtTime(clearBaiduAd, 120, 120 * 10, onClearAPage);
            //     });
            // }
            //
            // var tInAtTime = inAtTime(lClick, 100, 100 * 30)

            $('#wrapper_wrapper').bind("DOMSubtreeModified", function () {
                // tInAtTime && tInAtTime.clear()
                // tInAtTime = inAtTime(lClick, 100, 100 * 30)
                tpageInA && tpageInA.clear()
                tpageInA = inAtTime(clearBaiduAd, 120, 120 * 10, onClearAPage);
            });

        }


        //影藏滑动条 宽度为0
        // var style="::-webkit-scrollbar {width: 1px;height: 17px;background-color: tranparent;border: none  }"
        // $("body").append($("style").html(style));

    })

}()