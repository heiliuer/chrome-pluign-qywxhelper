+function () {
    let DATA = {}
    window.setStorage = function (data) {
        chrome.storage.sync.set({"data": data}, function () {
            // console.log("save data:", data);
        })
    }

    window.getStorage = function (callback) {
        chrome.storage.sync.get('data', function (data) {
            // console.log("get data:", data.data);
            callback(data.data);
        })
    }

    let wx_form = document.querySelector("#wx_form");
    let wx_input = wx_form.querySelector("input#passwd_wx");
    let wx_enable = wx_form.querySelector("input#wx_enable");

    function save() {
        setStorage(DATA);
    }

    wx_input.oninput = function () {
        DATA.passwd = wx_input.value
        save();
    }

    wx_input.ondblclick = function () {
        let type = wx_input.getAttribute("type");
        wx_input.setAttribute("type", type == "text" ? "password" : "text");
    }

    wx_enable.onchange = function () {
        DATA.checked = wx_enable.checked
        save();
    }

    getStorage(function (data) {
        // console.log("saved:", data);
        DATA = data || {};
        wx_input.value = DATA.passwd || "";
        // console.log("wx_enable.checked", wx_enable.checked)
        wx_enable.checked = DATA.checked === true;
    })

}();