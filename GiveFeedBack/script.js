const TextArea = document.querySelector('textarea');
const CounterChar = document.querySelector('.counter');
const Submitbtn = document.querySelector('.submit-btn');
const form = document.querySelector('.form');
const Feedbacks = document.querySelector('.feedbacks');
const maxChar = 150;
const spinner = document.querySelector(".spinner");

const HashtagListEl = document.querySelector(".hashtags");

//--- first stap : control the Text Area :

// const feed = {
//     company : company,
//     text : TextArea.value,
//     badgeLetter :badgeLetter,
//     upvoteCount : 0,
//     daysAgo : 0
// }

class FeedConstractor {
    constructor(company, text, badgeLetter, upvote, feedbackDate) {
        this.company = company;
        this.text = text.replaceAll('#', "");
        this.badgeLetter = badgeLetter;
        this.upvoteCount = upvote;
        this.daysAgo = feedbackDate;
    }
}

//---- the functions :

//function that calculate the character in text.
const NumofChar = (char) => {
    let inputChar = char;
    var NumChar = maxChar - (inputChar);
    return NumChar;
}
//this is definde var becuse maybe we nead it.
var NumChar = NumofChar(TextArea.value.length);

//to conter the number char input.
const inputHandler = function () {
    //inputchar defind var beacuse we need this in outblock functions.
    let NumChar = NumofChar(TextArea.value.length);
    CounterChar.textContent = NumChar;
}

// creat the changing function to clean the code
const ChangeClass = (addclass, removeclass) => {
    if (addclass == "") {
        form.classList.remove(removeclass);
    } else if (removeclass == "") {
        form.classList.add(addclass);
    } else {
        form.classList.add(addclass);
        form.classList.remove(removeclass);
    }
}

//پیدا کردن هشتک در متن ورودی
// برای استخراج هشتک از متن در حال ورود:
const findHashtag = function (text) {
    // در بین زیررشته هایی که از تابع split  بدست آمده اند دنبال چیزی هستیم که :
    //حاوی هشتگ باشد
    return text.split(" ").find(word => word.includes('#'));
}

//for creat the company name String
const CompanyName = function (ComName) {
    const Alph1 = ComName.substring(1, 2).toUpperCase();
    const Alph2 = ComName.substring(2);
    return Alph1 + Alph2;
}

// function feedbackDate for time :
// const feedbackDate = function (time) {
//     if (time === 0) {
//         return "NEW";
//     } else if (time > 24) {
//         // محاسبه میخواد
//     }
// };

//creat the feedback object :


//feedback box generator :
const feedItemBox = function (feed) {
    const feedItemhtml = `
    <li class = "feedback">
        <button class = "upvote">
            <i class = "fa-solid fa-caret-up upvote__icon"></i>
            <span class = "upvote__count">${feed.upvoteCount}</span>
        </button>
        <section class ="feedback__badge">
            <p class = "feedback__letter">${feed.badgeLetter}</p>
        </section>
        <div class = "feedback__content">
            <p class="feedback__company">${feed.company}</p>
            <p class = " feedback__text">${feed.text}</p>
        </div>
        <p class = "feedback__date">${feed.daysAgo}</p>
    </li>`;

    Feedbacks.insertAdjacentHTML('beforeend', feedItemhtml);

}


const visual = function (Text) {
    if (NumChar < 0 || !(Text.includes('#'))) {

        // دکمه تائید غیرفعال
        Submitbtn.disabled = true;

        // می تواند به تایپ ادامه دهد
        TextArea.focus();

        // حاشیه باکس قرمز رنگ شود
        ChangeClass('form--invalid', 'form--valid');
        // حاشیه باکس فقط چند لحظه قرمز شود، سپس عادی شود
        setTimeout(() => {
            //این تابعی است که در بالا تعریف شده در ورودی اول تابعی که باید ست شود را میگیرد و در ورودی دوم تابعی که باید حذف شود.
            ChangeClass("", "form--invalid");
        }, 2000);

        // در حالتی که متن وارد شده شرایط را دارا باشد این بخش اجرا میشود    

    } else if (Text.includes('#') && Text.length >= 5) {

        // دکمه تائید اکتیو می شود

        Submitbtn.disabled = false;
        // حاشیه دور باکس سبط میشود
        ChangeClass('form--valid', 'form--invalid')
        // استایل حاشیه بعد 2000 میلی ثانیه به استایل قبلی خود برمیگردد
        setTimeout(() => {
            ChangeClass("", 'form--valid')
        }, 2000);

    }

}

// when click on submit :
const SubmitOperation = function () {
    TextArea.value = " ";
    Submitbtn.blur();
    CounterChar.textContent = maxChar;
}

// --- submit component
const submitHandeler = (event) => {
    event.preventDefault();

    //definde the text to definde the function.
    const Text = TextArea.value;

    // پیام خالی فرستاده نشه
    if (Text === "") {
        alert("Cannot send an empty message.");
        Submitbtn.disabled = true;
    }
    // کنترل ورودی :
    visual(Text);

    // بخش استخراج معنی از متن
    //1. استخراج هشتک
    // const hashtag = findHashtag(Text);
    //2. استخراج نام کمپانی
    const CompanyN = CompanyName(findHashtag(Text)); //remove the #
    //3.استخراج حرف اول
    const badgeLetter = CompanyN.substring(0, 1);

    const UpVote = 0;
    const feedbackDate = "NEW";

    //داده از سرور :
    const feedBackobj = new FeedConstractor(CompanyN, Text, badgeLetter, UpVote, feedbackDate);

    feedItemBox(feedBackobj);

    //-- send feed back to server :
    console.log("🧾 Sending to server:", JSON.stringify(feedBackobj));

    fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks', {
        method: "POST",
        body: JSON.stringify({
            company: CompanyN,
            text: TextArea.value,
            badgeLetter: badgeLetter,
            upvoteCount: 0,
            daysAgo: 0
        }),

        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log('Server response status:', response.status);
        return response.json();
    })
        .then(data => {
            console.log("Server response data:", data);
        })
        .catch(error => {
            console.log("Fetch error:", error);
        });

    SubmitOperation();

}

// عملیات روی دکمه تائید اجرا میشود
form.addEventListener('submit', submitHandeler);

//end submit component;

// عمل روی متن ورودی اجرا میشود
TextArea.addEventListener('input', inputHandler);

// سمت سرور :
fetch('https://bytegrad.com/course-assets/js/1/api/feedbacks').
    then(response => {
        return response.json();
    }).
    then(data => {
        spinner.remove();
        data.feedbacks.forEach(element => {
            let feedFromServer = new FeedConstractor(element.company, element.text, element.badgeLetter, element.upvoteCount, element.daysAgo);
            feedItemBox(feedFromServer);
        });
    }).catch(error => {
        alert(`failed to get data from server : ${error}`);
    });

// ---- step 2 : control the feedback boxs :
//up vote:
//functions:
const click_on_feeaback = function (event) {
    const upvote = event.target.className.includes('upvote');
    if (upvote) {
        let upvotBtn = event.target.closest('.upvote');
        upvotBtn.disabled = true;

        const upvoteElement = upvotBtn.querySelector('.upvote__count');
        let upvoteCount = +upvotBtn.textContent;
        upvoteElement.textContent = ++upvoteCount;

    } else {

        event.target.closest('.feedback').classList.toggle('feedback--expand');
    }
};

Feedbacks.addEventListener('click', click_on_feeaback);

// ---- step 3 : control the hashtag bar :
//hashtag search :
//function :

const clickOnHashtag = function (event) {
    const clickon = event.target;
    if (clickon.className === 'hashtags') {
        return;
    }
    const hashtagvalue = clickon.textContent.substring(1).trim();
    Feedbacks.childNodes.forEach(childNode => {
        if (childNode.nodeType === 3) return;

        const compNameFromFeedback = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();
        if (hashtagvalue.toLowerCase().trim() !== compNameFromFeedback) {
            childNode.remove();
        };

    });

};

HashtagListEl.addEventListener('click', clickOnHashtag);
