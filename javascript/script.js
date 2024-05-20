
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

const CODESTUD_VERSION = { MAJOR: 1, MINOR: 1, PATCH: 0 };

let files = [];
let current_file = "";

let code = document.getElementById("code");

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
function file_create(filename, content) {
    if (!filename || filename.replace(" ", "") == "")
        return false;

    filename = encodeURI(filename).replace("%20", " ").slice(0, 15);

    for (let i = 1; files.find(file => file.name.toLowerCase() == filename.toLowerCase()); i = i + 1) {
        if (!files.find(file => file.name.toLowerCase() == `${filename.toLowerCase()} (${i})`)) {
            filename = `${filename} (${i})`;
            break;
        }
    }

    files.push({
        name: filename,
        content: content
    });

    document.getElementById("files").innerHTML += `<button class="file">${filename}</button>`;
    file_select(filename);

    Array.from(document.getElementsByClassName("file")).forEach((element) => {
        element.addEventListener('click', function (event) {
            file_select(event.target.innerHTML)
        });
    });

    return true;
}

document.getElementById("files").addEventListener("dblclick", function () {
    file_create(prompt("New file"), "");
});

code.addEventListener("keydown", (event) => {
    if (event.key != "Tab")
        return;
    event.preventDefault();
    code.setRangeText('\t', code.selectionStart, code.selectionStart, "end");
    return false;
})

code.addEventListener("keyup", () => {
    file_save(current_file);
});

document.getElementById("saveas").addEventListener('click', function () {
    file_saveas(current_file);
});

document.getElementById("cmd").addEventListener('click', function () {
    document.getElementById("console").classList.toggle("hide");
});

document.getElementById("run").addEventListener('click', function () {
    document.getElementById("out").innerText += document.getElementById("input").value + "\n";
    try {
        document.getElementById("out").innerText += eval(document.getElementById("input").value) + "\n\n[JS]>";
    } catch (except) {
        document.getElementById("out").innerText += except + "\n\n[JS]>";
    }
});

window.onbeforeunload = () => { return "You have attempted to leave this page. Are you sure?"; };

window.addEventListener('load', function () {
    file_create("Hello.txt", `
***********************************************
 _____       _     _____ _         _ 
|     |___ _| |___|   __| |_ _ _ _| |
|   --| . | . | -_|__   |  _| | | . |
|_____|___|___|___|_____|_| |___|___|v${CODESTUD_VERSION.MAJOR}.${CODESTUD_VERSION.MINOR}.${CODESTUD_VERSION.PATCH}
Open-Source online text editor

* Antoine LANDRIEUX
* https://github.com/AntoineLandrieux/CodeStud/

***********************************************


-> Double click on the topbar to create a new file
-> Click the button at the bottom left to save the current file
`);
    file_load("Hello.txt");
    document.getElementById("out").innerHTML = `[JS]>`;
});
