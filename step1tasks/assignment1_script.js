//読み込み完了時に実行する関数を指定
$(loaded);

function loaded() {
    //SAVEをクリックしたときの動作を指定
    var saveButtonName = document.getElementsByName("saveButton");
    var removeButtonName = document.getElementsByClassName("trash");
    $(saveButtonName).click(
        function () {
            saveTask();
            loadTask();
        }
    );
}

function saveTask() {
    // 時刻をキーにして入力されたテキストを保存する
    var text = $("#inputTask");
    var time = new Date();
    // 入力チェックをしてからローカルストレージに保存する
    if (checkText(text.val())) {
        localStorage.setItem(time, text.val());
        console.log(text.val());
        // テキストボックスを空にする
        text.val("");
    }
}

// 文字をエスケープする
function escapeText(text) {
    var TABLE_FOR_ESCAPE_HTML = {
        "&": "&amp;",
        "\"": "&quot;",
        "<": "&lt;",
        ">": "&gt;"
    };
    return text.replace(/[&"<>]/g, function (match) {
        return TABLE_FOR_ESCAPE_HTML[match];
    });
}

// 入力チェックを行う
function checkText(text) {
    // 文字数が0または20以上は不可
    if (0 === text.length || 140 < text.length) {
        alert("文字数は1〜140字にしてください");
        return false;
    }

    // すでに入力された値があれば不可
    var length = localStorage.length;
    for (var i = 0; i < length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        // 内容が一致するものがあるか比較
        if (text === value) {
            alert("同じ内容は避けてください");
            return false;
        }
    }

    // すべてのチェックを通過できれば可
    return true;
}

function loadTask() {
    // すでにある要素を削除する
    var list = $("#list");
    list.children().remove();
    // ローカルストレージに保存された値すべてを要素に追加する
    var key, value, date, html = [];
    for (var i = 0, len = localStorage.length; i < len; i++) {
        key = localStorage.key(i);
        value = localStorage.getItem(key);
        date = new Date(key);
        console.log(i, key, value);
        list.prepend("<ul class=\"taskList\" id=\"task"+ i + "\">");
        $("#task" + i).append("<li class = \"listBox taskBox\">" + value + "</li>");
        $("#task" + i).append("<li class = \"listBox listButton trash\" onClick = \"removeTask\(" + i + "\)\">" + "<i class=\"fa fa-trash-o\"></i>" + "</li>");
        $("#task" + i).append("<li class = \"listBox listButton edit\">" + "<i class=\"fa fa-pencil\"></i>" + "</li>");
        $("#task" + i).append("<li class = \"listBox listBoxDate taskDate\">" + formatDate(date) + "</li>");
    }
}

function formatDate(now) {
    var monthNum = Number(now.getMonth()) + 1;
    return now.getFullYear() + "-" + zeroPadding(monthNum) + "-" + zeroPadding(now.getDate()) + "-" + zeroPadding(now.getHours()) + ":" + zeroPadding(now.getMinutes()) + ":" + zeroPadding(now.getSeconds());
}

function zeroPadding(text) {
    return ('00' + text).slice(-2);
}

function removeTask(taskNum) {
    var key = localStorage.key(taskNum);
    localStorage.removeItem(key);
    loadTask();
}