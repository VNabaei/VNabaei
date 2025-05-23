const rockBtn = document.getElementById("rock");
const paperBtn = document.getElementById("paper");
const scissorBtn = document.getElementById("scissor");
const yourChoice = document.querySelector(".Yourchoice");
const comChoice = document.querySelector(".Computerchoice");
const winnerText = document.getElementById("winner");
const finalWinnerH2 = document.querySelector(".resultbox h2:last-of-type");
const resultbox = document.querySelector(".resultbox");
const indexResult = document.getElementById("indexResult");
const doneBtn = document.querySelector(".submit");
const originalHTML = document.querySelector("body").innerHTML;
let userScore = 0;
let computerScore = 0;
let rounds = [];// برای حفظ نتایج هر دست
const options = ["سنگ", "کاغذ", "قیچی"];

//functions :
//ریست کردن بازی
const reset = function () {
    userScore = 0;
    computerScore = 0;
    rounds = [];
    yourChoice.textContent = ".....";
    comChoice.textContent = "....";
    winnerText.textContent = "برنده این دست :";
    finalWinnerH2.textContent = "";
    resultbox.style.backgroundColor = "white";
    indexResult.innerHTML = "";

    // حذف دکمه "شروع مجدد" و پیام پایان بازی
    const extraElems = document.querySelectorAll(".resultbox h2, .playAgain");
    document.querySelector(".finalW").remove();
    document.querySelector(".playAgain").remove();
    const brs = document.querySelectorAll(".resultbox br");
    brs.forEach(br => br.remove());



    // فعال‌سازی دوباره دکمه‌ها
    rockBtn.disabled = false;
    paperBtn.disabled = false;
    scissorBtn.disabled = false;


    console.log("im hear");

}

//برای انتخاب کامپیوتر
const getComputerChoice = function () {
    const randomIndex = Math.floor(Math.random() * 3);
    return options[randomIndex];
}

const determineWinner = function (userChoice, computerChoice) {
    if (userChoice === computerChoice) return "مساوی";
    if (
        (userChoice === "سنگ" && computerChoice === "قیچی") || (userChoice === "کاغذ" && computerChoice === "سنگ") || (userChoice === "قیچی" && computerChoice === "کاغذ")
    ) {
        return "شما";
    }
    else {
        return "کامپیوتر";
    }
}

// برای نمایش سوابق بازی در بالای صفحه :
const updateSelect = function () {
    indexResult.innerHTML = "";
    rounds.forEach((round, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `دست ${index + 1} برنده  - ام :${round.winner}`;
        indexResult.appendChild(option);
    });
    indexResult.value = rounds.length - 1;

}

const colorOfWinner = function (finalWinner) {
    resultbox.style.backgroundColor = (finalWinner == "شما") ? 'green' : 'red';
}

// اجرا کننده بازی
const playfunction = function (userChoice) {

    const computerChoice = getComputerChoice();
    // تابع محاسبه برنده
    const winner = determineWinner(userChoice, computerChoice);
    //  اعلان نتایح در باکس
    yourChoice.textContent = `انتخاب شما: ${userChoice}`;
    comChoice.textContent = `انتخاب کامپیوتر: ${computerChoice}`;
    winnerText.textContent = `برنده این دست: ${winner}`;

    rounds.push({ userChoice, computerChoice, winner }); //ریختن درآرایه
    updateSelect(); // ثبت در سوابق 

    if (winner === "شما") { userScore++; }
    else if (winner === "کامپیوتر") computerScore++;

    if (userScore >= 5 || computerScore >= 5) {
        // مقدار دهی برای اعلان برنده
        const finalWinner = userScore > computerScore ? "شما" : "کامپیوتر";
        finalWinnerH2.textContent = ` برنده نهایی: ${finalWinner}`;
        disableButtons(); // برای متوقف مردن بازی
        colorOfWinner(finalWinner);
        resultbox.insertAdjacentHTML('afterbegin',
            `<h2 class = "finalW">
            بازی  به اتمام رسید
            </h2>
            <br>
            <button class = "playAgain"> شروع مجدد
            </button>
            <br>`
        );
        document.querySelector(".playAgain").addEventListener("click", reset);
    }



}



// دکمه "انجام شد" برای انتخاب نتایج قبلی
doneBtn.addEventListener("click", () => {
    const selectedIndex = indexResult.value;
    if (selectedIndex) {
        const round = rounds[selectedIndex];
        yourChoice.textContent = `انتخاب شما: ${round.userChoice}`;
        comChoice.textContent = `انتخاب کامپیوتر: ${round.computerChoice}`;
        winnerText.textContent = `برنده این دست: ${round.winner}`;
    }
});

// برای پایان بازی غیر فعال کردن دکمه‌ها 
function disableButtons() {
    rockBtn.disabled = true;
    paperBtn.disabled = true;
    scissorBtn.disabled = true;
}




// اتصال دکمه‌ها به تابع بازی
rockBtn.addEventListener("click", () => playfunction("سنگ"));
paperBtn.addEventListener("click", () => playfunction("کاغذ"));
scissorBtn.addEventListener("click", () => playfunction("قیچی"));

