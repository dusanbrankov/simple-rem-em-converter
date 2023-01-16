// Variables

const pxToRemTab = document.querySelector("#px-to-rem-tab");
const pxToEmTab = document.querySelector("#px-to-em-tab");

const form = document.querySelector("#calc-form");
const basePx = document.querySelector("#base-px");
const baseRemContainer = document.querySelector("#base-rem-container");
const baseRem = document.querySelector("#base-rem");
const px = document.querySelector("#px");

const result = document.querySelector("#calc-result");

const copyButton = document.querySelector("#copy");
const copyMessage = document.querySelector(".copy-msg");

// Convert

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!px.value || px.value === "0") {
    return;
  }

  if (baseRemContainer.classList.contains("show")) {
    result.textContent = `${+parseFloat(px.value / (baseRem.value * basePx.value)).toFixed(4)}em`;
  } else {
    result.textContent = `${+parseFloat(px.value / basePx.value).toFixed(4)}rem`;
  }

  copyButton.classList.add("show");
});

// Tabs

pxToEmTab.addEventListener("click", () => {
  if (!pxToEmTab.classList.contains("active")) {
    clear();
  }
  pxToRemTab.classList.remove("active");
  pxToEmTab.classList.add("active");
  baseRemContainer.classList.add("show");
});

pxToRemTab.addEventListener("click", () => {
  if (!pxToRemTab.classList.contains("active")) {
    clear();
  }
  pxToEmTab.classList.remove("active");
  pxToRemTab.classList.add("active");
  baseRemContainer.classList.remove("show");
});

// Copy to clipboard

const copy = require('clipboard-copy');

copyButton.addEventListener('click', event => {
  event.preventDefault();
  copy(result.textContent);
  copyMessage.classList.add("show");
  setTimeout(() => {
    copyMessage.classList.remove("show");
  }, 3000);
});

// Function: Clear all fields

const clear = () => {
  basePx.value = 16;
  baseRem.value = 1;
  px.value = "";
  result.textContent = "";
  copyButton.classList.remove("show");
}

// Current year

document.querySelector("#year").textContent = new Date().getFullYear();