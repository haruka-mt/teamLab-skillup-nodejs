//読み込み完了時に実行する関数を指定
$(loaded);
var taskNumMax;

function loaded() {
    // for (var i = 0; i < localStorage.length; ++i)
    // {
    //     var key = localStorage.key(i);
    //     localStorage.removeItem(key);
    // }    
    //SAVEをクリックしたときの動作を指定
    var saveButtonName = document.getElementsByName("saveButton");
    var removeButtonName = document.getElementsByClassName("trash");
    $(saveButtonName).click(
        function () {
            taskNumMax = localStorage.length;
            taskNumMax = saveTask(taskNumMax);
            loadTask();
        }
    );
    $('input[name="filter"]:radio').change(function () {
        loadTask();
    }); 
    loadTask();
}

function saveTask(taskNum) {
    // 時刻をキーにして入力されたテキストを保存する
    var text = $("#inputTask");
    var time = new Date();
    var taskState = false;
    var saveItem = new Item(text.val(), time, taskState);
    // 入力チェックをしてからローカルストレージに保存する
    if (checkText(text.val())) {
        localStorage.setItem(taskNum, JSON.stringify(saveItem));
        //console.log(text.val());
        // テキストボックスを空にする
        text.val("");
    }
    return taskNum += 1;
}

function Item(text, time, checked) {
    this.text = text;
    this.time = time;
    this.checked = checked;
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
        if (text === value.text) {
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
    taskNumMax = localStorage.length;
    var filter = $('input[name="filter"]:checked').val();
    console.log(filter);

    // ローカルストレージに保存された値すべてを要素に追加する
    var key, value, taskItem, date, html = [];
    for (var i = 0, len = localStorage.length; i < len; i++) {
        key = localStorage.key(i);
        value = localStorage.getItem(key);
        taskItem = JSON.parse(value);
        date = new Date(taskItem.time);
        //console.log(i, key, taskItem);
        var checkFlag;
        if (taskItem.checked) {
            checkFlag = "checked";
        }
        else {
            checkFlag = "";
        }
        if (filter == "Finished" && checkFlag == "") {
            continue;
        }
        else if (filter == "Notyet" && checkFlag == "checked") {
            continue;
        }    
        list.prepend("<ul class=\"taskList\" id=\"task" + i + "\">");
        $("#task" + i).append("<li class = \"listBox listButton\" style=\"float: left;\" ><label><input type = \"checkbox\" class = \"taskCheckBox\" onClick = \"changeTaskState\(" + i + "\)\"" + checkFlag + "> <span class =\"taskCheckBox-deco\"></span></label></li>");
        $("#task" + i).append("<li class = \"listBox taskBox\">" + taskItem.text + "</li>");
        $("#task" + i).append("<li class = \"listBox listButton trush\" onClick = \"removeTask\(" + i + "\)\"><i class=\"fa fa-trash-o\"></i></li>");
        $("#task" + i).append("<li class = \"listBox listButton edit\"><i class=\"fa fa-pencil\"></i></li>");
        $("#task" + i).append("<li class = \"listBox taskDateBox\">" + formatDate(date) + "</li>");
        changeTaskState(i);
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
    var value, updateTask, i;
    for (i = key; i < taskNumMax - 1; ++i)
    {
        value = JSON.parse(localStorage.getItem(parseInt(i) + 1));
        //console.log(i, value);
        localStorage.setItem(i, JSON.stringify(value));
    }    
    taskNumMax -= 1;
    localStorage.removeItem(taskNumMax);

    loadTask();
}

function checkTask(taskNum) {
    var key = "task" + taskNum;
    var state = localStorage.getItem(key);
    // console.log(key, state);
    if (state == "true")
    {
        return "checked"; 
    }
    else 
    {
        return "";
    }    
}

function changeTaskState(taskNum) {
    var value = JSON.parse(localStorage.getItem(taskNum));
    var taskItem = $("#task" + taskNum).children();
    var taskChild = $(taskItem[0]).children().children();
    //console.log(taskChild[0]);

    if (taskChild[0].checked == true)
    {
        taskItem[1].style.color = "#c5c5c5";
        taskItem[1].style.textDecoration = "line-through";
    }
    else
    {
        taskItem[1].style.color = "black";
        taskItem[1].style.textDecoration = "none";
    }    
    value.checked = taskChild[0].checked;
    localStorage.setItem(taskNum, JSON.stringify(value));
}