//読み込み完了時に実行する関数を指定
$(loaded);

function loaded() {
  //ボタンタグをクリックしたときの動作を指定
  //$("button").click(change_text);
  var now = new Date();
  var jsonNow = new Date(JSON.parse(JSON.stringify(now)));
  console.log(jsonNow);
}

function change_text() {
  //IDがmessageの要素のテキストを書き換え
  $("body").append($("<p>").text("おはよう"));
  $("body").append($("<p>").text("こんにちは"));
  $("body").append($("<p>").text("おやすみ"));

  $("#message").remove();
  $("button").remove();
  $("body").append($("<button>").text("おす"));
  loaded();
}