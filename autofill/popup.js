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
const manualReload=document.getElementById("manualReload");
reloadTabs();

document.getElementById("autofill").addEventListener("click", async () => {
  const data = {
    description: document.getElementById("description").value,
    size: document.getElementById("size").value,
    shelf: document.getElementById("shelf").value,
    sku: document.getElementById("sku").value,
    price: document.getElementById("price").value,
    box: document.getElementById("box").checked
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
     image.width = 150;
  image.style.height = "auto";
    
    document.body.appendChild(image);
  });
});

tabSelect.addEventListener("click", async () => {
 
  
});