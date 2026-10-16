let currentLanguage = localStorage.getItem("preferred_lang") || "en";
let languageWasChosen = false;

const form = document.getElementById("feedbackForm");
const message = document.getElementById("feedbackMessage");


form.addEventListener("submit", async function (event) {
    event.preventDefault();
    //console.log("test");
    const feedbackData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        userId: document.getElementById("userId").value.trim(),
        comment: document.getElementById("comment").value.trim()
    };

    try {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent = result.message || "Submission failed.";
            return;
        }

        if (result.success) {
            if (currentLanguage === "en") {
                message.textContent = "Thank you for your feedback!";
            } else if (currentLanguage === "fr") {
                message.textContent = "Merci pour vos commentaires !";
            } else if (currentLanguage === "zh") {
                message.textContent = "感谢您的反馈！";
            }
            form.reset();
        }

    } catch (error) {
        console.error("Feedback error:", error);
        message.textContent = "Unable to submit feedback.";
    }


});
function changeLanguage(lang, isAuto = false) {

    currentLanguage = lang;

    if (!isAuto) {
        languageWasChosen = true;
    }

    localStorage.setItem("preferred_lang", lang);


    const navHome = document.getElementById("navHome");

    if (lang === "en") {
        if (navHome) navHome.textContent = "Home";
    } else if (lang === "fr") {
        if (navHome) navHome.textContent = "Accueil";
    } else if (lang === "zh") {
        if (navHome) navHome.textContent = "首页";
    }

    // Highlight the active language button
    document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) activeBtn.classList.add("active");

    // Translate Backhome 
    const backHomeLinkText = document.getElementById("backHomeLink");

    if (lang === "en") {
        backHomeLinkText.textContent = "← Back to Home";
    } else if (lang === "fr") {
        backHomeLinkText.textContent = "← Retour à l'accueil";
    } else if (lang === "zh") {
        backHomeLinkText.textContent = "← 返回首页";
    }



    // Translate Feedback heading
    const feedbackHeading = document.getElementById("feedbackHeading");

    if (lang === "en") {
        feedbackHeading.textContent = "Feedback";
    } else if (lang === "fr") {
        feedbackHeading.textContent = "Commentaires";
    } else if (lang === "zh") {
        feedbackHeading.textContent = "反馈";
    }


    // Get the feedback form labels and button
    const firstNameLabel = document.getElementById("firstNameLabel");
    const lastNameLabel = document.getElementById("lastNameLabel");
    const userIdLabel = document.getElementById("userIdLabel");
    //const passwordLabel = document.getElementById("passwordLabel");
    const commentLabel = document.getElementById("commentLabel");
    const submitButton = document.getElementById("submitButton");
    const feedbackText = document.getElementById("feedbackIntro");

    // English
    if (lang === "en") {
        firstNameLabel.textContent = "First Name:";
        lastNameLabel.textContent = "Last Name:";
        userIdLabel.textContent = "User ID / Email:";
        //passwordLabel.textContent = "Password:";
        commentLabel.textContent = "Comment:";
        submitButton.textContent = "Submit";
        feedbackText.textContent = "We would love to hear your thoughts about My World Recipe Archive."
    }

    // French
    else if (lang === "fr") {
        firstNameLabel.textContent = "Prénom :";
        lastNameLabel.textContent = "Nom de famille :";
        userIdLabel.textContent = "Identifiant / Courriel :";
        //passwordLabel.textContent = "Mot de passe :";
        commentLabel.textContent = "Commentaire :";
        submitButton.textContent = "Envoyer";
        feedbackText.textContent = "Nous aimerions connaître votre avis sur My World Recipe Archive."
    }

    // Chinese
    else if (lang === "zh") {
        firstNameLabel.textContent = "名字：";
        lastNameLabel.textContent = "姓氏：";
        userIdLabel.textContent = "用户 ID / 邮箱：";
        //passwordLabel.textContent = "密码：";
        commentLabel.textContent = "评论：";
        submitButton.textContent = "提交";
        feedbackText.textContent = "我们很想听听你对“我的世界食谱档案”的想法"

    }
}

// 1. Get the language the user chose before (or default to 'en')
const initialLanguage = localStorage.getItem("preferred_lang") || "en";
// 2. Start the page in THAT language
changeLanguage(initialLanguage, true);