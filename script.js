//navbar
const navbar = document.querySelector(".navbar_left");
const navbarIcons = document.querySelector(".navbar_menu");
//to open and close
navbarIcons.addEventListener("click", () => {
    navbar.classList.toggle("navbar_show");
});

const searchBar = document.querySelector(".searchbar");
const error = document.querySelector(".input_box p");
const inputBox = document.querySelector(".input_box input");
const button = document.querySelector(".searchbar button");
const urlDiv = document.querySelector(".url_links");
const data = localStorage.getItem("_html");
if (!data) {
    localStorage.setItem("_html", "[]");
}

const searhApi = async (value) => {
    if (!value || value == "") {
        return searchBar.classList.add("error");
    }
    button.innerText = "Loading...";
    button.disabled = true;
    let apiUrl = "https://api.shrtco.de/v2/shorten";
    let ApiReq = await fetch(apiUrl + `?url=${value}`);
    let ApiRes = await ApiReq.json();
    button.innerText = "Shorten it!";
    button.disabled = false;
    if (ApiRes.ok) {
        searchBar.classList.remove("error");
        const localData = JSON.parse(data);
        let obj = {
            userInput: value,
            shortenUrl: ApiRes.result.full_short_link,
        };
        localData.push(obj);
        localStorage.setItem("_html", JSON.stringify(localData));
        showHtml();
    } else {
        searchBar.classList.add("error");
        if (ApiRes.error_code == 2) {
            error.innerText = "invalid Url";
        } else {
            error.innerText = ApiRes.error;
        }
    }
};

const showHtml = () => {
    if (!localStorage.getItem("_html")) {
        return;
    }
    let updatedData = JSON.parse(localStorage.getItem("_html"));
    let html = updatedData
        .reverse()
        .map((data) => {
            return `<div class="url_link flex items-center justify-between">
    <h2><a href=${data.userInput}>${data.userInput}</a></h2>
    <div class="flex items-center gap-2">
    <p><a href=${data.shortenUrl}>${data.shortenUrl}</a></p>
    <button data-link=${data.shortenUrl} class="copy btn-primary btn-rounded" type="button">
   copy
  </button>
  </div>
  </div>`;
        })
        .join("");
    urlDiv.innerHTML = html;
    let buttons = document.querySelectorAll(".copy");
    buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const copyText = e.target.dataset.link;
            navigator.clipboard.writeText(copyText);
            e.target.innerText = "Copied!";
            e.target.classList.add("copied");
            setTimeout(() => {
                e.target.innerText = "Copy";
                e.target.classList.remove("copied");
            }, 1500);
        });
    });
};

button.addEventListener("click", () => {
    searhApi(inputBox.value);
    inputBox.value = null;
});
inputBox.addEventListener("focus", (e) => {
    window.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            searhApi(inputBox.value);
            inputBox.value = null;
        }
    });
});

showHtml();