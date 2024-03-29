const tabList = document.querySelectorAll('[role="tablist"]');
const tabs = document.querySelectorAll('[role="tab"]');
const tabPanel = document.querySelector('[role="tabpanel"]');

const basePx = document.querySelector("#base-px-input");
const baseRemContainer = document.querySelector("#base-rem");
const baseRem = document.querySelector("#base-rem-input");
const removePrefix = document.querySelector("#rm-prefix");
const px = document.querySelector("#px-input");

const result = document.querySelector("#output");

const copyButton = document.querySelector("#cp-button");
const copyMessage = document.querySelector("#cp-message");

// Tabs
tabs.forEach(tab => {
    tab.addEventListener("click", event => {
        const activeTab = document.querySelector('[aria-selected="true"]');
        if (activeTab !== event.currentTarget) {
            clear();
            activeTab.setAttribute("aria-selected", "false");
            event.currentTarget.setAttribute("aria-selected", "true");
            baseRemContainer.classList.toggle("show");
        }
    });
});

// Convert
tabPanel.addEventListener("submit", event => {
    event.preventDefault();

    if (!px.value || px.value === "0") {
        return;
    }

    if (baseRemContainer.classList.contains("show")) {
        const resultEm = `${+parseFloat(px.value / (baseRem.value * basePx.value)).toFixed(4)}em`;
        calcResult(resultEm);
    } else {
        const resultRem = `${+parseFloat(px.value / basePx.value).toFixed(4)}rem`;
        calcResult(resultRem);
    }

    copyButton.classList.add("show");
});

// Copy to clipboard
copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(result.textContent);
        copyMessage.textContent = "Copied to clipboard";
        copyMessage.classList.add("show");
        setTimeout(() => {
            copyMessage.classList.remove("show");
        }, 3000);
    } catch (err) {
        console.error(err.name, err.message);
        copyMessage.textContent = "Something went wrong, please try again.";
        copyMessage.classList.add("show");
        setTimeout(() => {
            copyMessage.classList.remove("show");
        }, 3000);
    }
});

// Check if "remove prefix" is checked
const calcResult = (option) => {
    const regex = /^0/;

    if (removePrefix.checked) {
        if (regex.test(option)) {
            result.textContent = option.substring(1);
        } else {
            result.textContent = option;
        }
    } else {
        result.textContent = option;
    }
};

// Clear all fields
const clear = () => {
    basePx.value = 16;
    baseRem.value = 1;
    removePrefix.checked = false;
    px.value = "";
    result.textContent = "";
    copyButton.classList.remove("show");
};

// Show current year in site footer
document.querySelector("#year").textContent = new Date().getFullYear();
