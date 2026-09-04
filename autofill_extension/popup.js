const shelfInput = document.getElementById("shelf");
const nameInput= document.getElementById("name");
async function loadSavedData() {
  const shelfData = await chrome.storage.local.get("shelf");
const nameData = await chrome.storage.local.get("name");
  shelfInput.value = shelfData.shelf || "";
  nameInput.value = nameData.name || "";
}

loadSavedData();
const selectedImages=new Set();
async function reloadTabs(){
  const tabs = await chrome.tabs.query({});

  tabSelect.innerHTML = '<option value="">Choose a tab</option>';

  tabs.forEach(tab => {
    const option = document.createElement("option");

    option.value = tab.id;
    option.textContent = tab.title;

    tabSelect.appendChild(option);
  });
}
const tabSelect = document.getElementById("tabSelect");
const loadingImages=document.getElementById("loading");
reloadTabs();

document.getElementById("autofill").addEventListener("click", async () => {
  const data = {
    description: document.getElementById("description").value,
    size: document.getElementById("size").value,
    shelf: document.getElementById("shelf").value,
    sku: document.getElementById("sku").value,
    price: document.getElementById("price").value,
    box: document.getElementById("box").checked,
    name: document.getElementById("name").value
  };

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.tabs.sendMessage(tab.id, {
    action: "AUTOFILL",
    data: data
  });
});
document.getElementById("imageScrape").addEventListener("click", async () => {
  const tabId=Number(tabSelect.value);

  const res = await chrome.tabs.sendMessage(tabId, {
    action: "GET_PHOTOS",
  });
  const imgs= res.images;
  console.log(res);
  imgs.forEach(img=>{
    const image=document.createElement("img");
    image.src=img.src;
     image.height = 50;
     image.className = "scraped-image";
  image.style.width = "auto";
   selectedImages.add(img.src);
      image.classList.add("selected");
  
    
    document.body.appendChild(image);
     image.addEventListener("click", () => {
    if (selectedImages.has(img.src)) {
      // deselect
      selectedImages.delete(img.src);
      image.classList.remove("selected");
    } else {
      // select
      selectedImages.add(img.src);
      image.classList.add("selected");
    }

    console.log([...selectedImages]);
  });

  });
});

loadingImages.addEventListener("click", async () => {
  console.log("loading clicked");
  if (selectedImages.size==0){
    return;
  }
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
   console.log("sending to:", tab.id, tab.url);
  try {
    const res = await chrome.tabs.sendMessage(tab.id, {
      action: "LOADING_IMGS",
      images: [...selectedImages]
    });

    console.log("message sent", res);
    if (res){
    const info= document.createElement("h1");
    info.textContent="imgs submitted!";
    document.body.appendChild(info);
  }
  } catch (err) {
    console.error("sendMessage failed:", err);
  };
  
});
// SAVE
document.getElementById("shelf").addEventListener("input", async (e) => {
  await chrome.storage.local.set({
    shelf: e.target.value
  });
});

document.getElementById("name").addEventListener("input", async (e) => {
  await chrome.storage.local.set({
    name: e.target.value
  });
});

document.getElementById("retrieveInfo").addEventListener("click", async () => {
   const tabId=Number(tabSelect.value);
   console.log("ready to retrieve");
  const res = await chrome.tabs.sendMessage(tabId, {
    action: "RETRIEVE_INFO",
  });
  document.getElementById("description").value=res.description.trim();
  document.getElementById("price").value=res.price;
});