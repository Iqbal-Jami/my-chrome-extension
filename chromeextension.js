//chrome: //extensions/
let myAddresses = [];
let inputEl = document.getElementById("input-el");
let inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

const addressesFromLocalStorage = JSON.parse(localStorage.getItem("myAddresses"));

if (addressesFromLocalStorage) {
  // Migrate old data if it's array of strings
  if (Array.isArray(addressesFromLocalStorage) && addressesFromLocalStorage.length > 0 && typeof addressesFromLocalStorage[0] === 'string') {
    myAddresses = addressesFromLocalStorage.map(url => ({ url, name: url }));
  } else {
    myAddresses = addressesFromLocalStorage;
  }
  render(myAddresses);
}

tabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    myAddresses.push({ url: tabs[0].url, name: tabs[0].title });
    localStorage.setItem("myAddresses", JSON.stringify(myAddresses));
    render(myAddresses);
  });
});

function render(addresses) {
  let listItems = "";
  for (let i = 0; i < addresses.length; i++) {
    listItems += `
       <li>
          ${i+1}. <a target='_blank' href='${addresses[i].url}' title='${addresses[i].url}'> 
              ${addresses[i].name}
          </a>
          <div class="buttons">
            <button class="rename-btn" data-index="${i}">✏️</button>
            <button class="delete-single-btn" data-index="${i}">❌</button>
          </div>
       </li>
       `;
  }
  ulEl.innerHTML = listItems;

  // Attach event listeners to individual rename buttons
  document.querySelectorAll(".rename-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      let index = event.target.getAttribute("data-index");
      let newName = prompt("Enter a new name for this address:", myAddresses[index].name);
      if (newName && newName.trim() !== "") {
        myAddresses[index].name = newName.trim();
        localStorage.setItem("myAddresses", JSON.stringify(myAddresses));
        render(myAddresses);
      }
    });
  });

  // Attach event listeners to individual delete buttons
  document.querySelectorAll(".delete-single-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      let index = event.target.getAttribute("data-index");
      myAddresses.splice(index, 1);
      localStorage.setItem("myAddresses", JSON.stringify(myAddresses));
      render(myAddresses);
    });
  });
}

deleteBtn.addEventListener("click", () => {
  localStorage.clear();
  myAddresses = [];
  render(myAddresses);
});

inputBtn.addEventListener("click", () => {
  if (inputEl.value.trim() !== "") {
    myAddresses.push({ url: inputEl.value, name: inputEl.value });
    inputEl.value = "";
    localStorage.setItem("myAddresses", JSON.stringify(myAddresses));
    render(myAddresses);
  }
});


