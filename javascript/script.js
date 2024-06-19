
/*
***********************************************
_____       _     _____ _         _ 
|     |___ _| |___|   __| |_ _ _ _| |
|   --| . | . | -_|__   |  _| | | . |
|_____|___|___|___|_____|_| |___|___|
Open-Source online text editor

* Antoine LANDRIEUX
* https://github.com/AntoineLandrieux/CodeStud/

***********************************************
*/

const CODESTUD_VERSION = { MAJOR: 1, MINOR: 2, PATCH: 1 };
const autocomplete = { "<": ">", "(": ")", "{": "}", "[": "]", "Tab": "\t", "\"": "\"", "'": "'", "`": "`" };

let files = [];
let current_file = "";

let code = document.getElementById("code");
let output = document.getElementById("out");

/**
 * 
 * @param {string} extension 
 * @returns {string}
 */
async function program(extension) {
    const response = await fetch("syntax/syntax.json");
    const jsonsres = await response.json();
    return jsonsres[extension.toLowerCase()] || "";
}

/**
 * 
 * @param {string} filename 
 */
function file_load(filename) {
    code.value = files.find(file => file.name.toLowerCase() == filename.toLowerCase())?.content;
}

/**
 * 
 * @param {string} filename 
 */
function file_save(filename) {
    files.forEach((item) => {
        if (item.name.toLowerCase() == filename.toLowerCase())
            item.content = code.value;
    });
}

/**
 * 
 * @param {string} filename
 */
function file_saveas(filename) {

    files.forEach((item) => {

        if (item.name.toLowerCase() == filename.toLowerCase()) {
            var textBlob = new Blob([item.content], { type: "text/plain" });
            var download = document.createElement("a");

            download.download = filename;
            download.href = window.URL.createObjectURL(textBlob);
            download.click();

            delete textBlob;
            delete download;
        }

    });

}

/**
 * 
 * @param {string} filename 
 */
function file_select(filename) {
    var element = undefined;

    Array.from(document.getElementsByClassName("file")).forEach((item) => {
        if (item.innerText.toLowerCase() == filename.toLowerCase())
            element = item;
        item.classList.remove("selected");
    });

    file_load(filename);
    current_file = filename;
    element?.classList?.add("selected");
}

/**
 * 
 * @param {string} filename 
 * @param {string} content 
 */
async function file_create(filename, content) {

    if (!filename || filename.replace(" ", "") == "")
        return false;

    filename = encodeURI(filename).replace("%20", " ");
    const extension = filename.split(".")[filename.split(".").length - 1];

    for (let i = 1; files.find(file => file.name.toLowerCase() == filename.toLowerCase()); i++) {
        if (!files.find(file => file.name.toLowerCase() == `${filename.toLowerCase()} (${i})`)) {
            filename = `(${i}) ${filename}`;
            break;
        }
    }

    files.push({
        name: filename,
        content: !content ? await program(extension) : content
    });

    document.getElementById("files").innerHTML += `<button type="button" class="file">${filename}</button>`;
    file_select(filename);

    Array.from(document.getElementsByClassName("file")).forEach((element) => {
        element.addEventListener('click', function (event) {
            file_select(event.target.innerHTML)
        });
    });

    return true;
}

document.getElementById("files").addEventListener("dblclick", async function () {
    await file_create(prompt("New file"), null);
});

code.addEventListener("keydown", (event) => {
    if (!autocomplete[event.key])
        return;
    if (event.key == "Tab")
        event.preventDefault();
    code.setRangeText(autocomplete[event.key], code.selectionStart, code.selectionStart, event.key == "Tab" ? "end" : "start");
    return false;
});

code.addEventListener("keyup", () => {
    file_save(current_file);
});

document.getElementById("saveas").addEventListener('click', function () {
    file_saveas(current_file);
});

document.getElementById("cmd").addEventListener('click', function () {
    document.getElementById("console").classList.toggle("hide");
});

document.getElementById("input").addEventListener('keydown', function (event) {

    if (event.key != "Enter")
        return;

    const code = document.getElementById("input").value;

    output.innerText += code + "\n";

    try {
        output.innerText += eval(code);
    } catch (except) {
        output.innerText += except;
    }

    delete code;
    output.innerText += "\n\n👨‍💻> ";

});

window.onbeforeunload = () => { return "You have attempted to leave this page. Are you sure?"; };

window.addEventListener('load', async function () {
    await file_create("Hello.txt", `
////////////////////////////////////////////////

 _____       _     _____ _         _ 
|     |___ _| |___|   __| |_ _ _ _| |
|   --| . | . | -_|__   |  _| | | . |
|_____|___|___|___|_____|_| |___|___|v${CODESTUD_VERSION.MAJOR}.${CODESTUD_VERSION.MINOR}.${CODESTUD_VERSION.PATCH}
Open-Source online text editor

🙋 Antoine LANDRIEUX
📁 https://github.com/AntoineLandrieux/CodeStud/

////////////////////////////////////////////////


👉 Double click on the topbar to create a new file
👉 Click the button at the top left to save the current file
`);
    file_load("Hello.txt");
    output.innerHTML = `👨‍💻> `;
});
