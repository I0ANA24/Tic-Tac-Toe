const startButton = document.getElementById("startButton");
const firstInput = document.getElementById("nickname1");
const secondInput = document.getElementById("nickname2");

startButton.addEventListener("click", () => {
    let text1 = firstInput.value;
    let text2 = secondInput.value;
    sessionStorage.setItem("firstPlayerNickname", text1);
    sessionStorage.setItem("secondPlayerNickname", text2);
    window.location.href = "./game.html";
});