document.getElementById("autofill").addEventListener("click", async () => {
  const data = {
    description: document.getElementById("description").value,
    size: document.getElementById("size").value,
    shelf: document.getElementById("shelf").value,
    sku: document.getElementById("sku").value
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