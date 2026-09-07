function setValue(element, setter,value){
  
  setter.call(element,value)
  element.dispatchEvent(
    new Event("input", { bubbles: true })
  );
  element.dispatchEvent(
  new Event("change", { bubbles: true })
);
}
function amazonSearch(urls){
   document.querySelectorAll("[data-old-hires]").forEach(element => {
    const src = element.getAttribute("data-old-hires");

    if (src) {
      urls.add(src);
    }
  });
}

  function ebaySearch(urls) {
  document.querySelectorAll(".ux-image-carousel-item img").forEach(element => {
    const src = element.dataset.zoomSrc;

    if (src) {
      urls.add(src);
    }
  });
}
function macysSearch(urls) {
  document
    .querySelectorAll(".product-image-wrapper-top-level img.picture-image")
    .forEach(img => {
      const baseSrc =
        img.getAttribute("data-src") ||
        img.src;

      if (!baseSrc) return;

      // remove existing query parameters
      const cleanSrc = baseSrc.split("?")[0];

      // request a large Macy's image
      const highRes = `${cleanSrc}?wid=1500&fit=fit,1&fmt=jpeg`;

      urls.add(highRes);
    });
}
async function generalSearch(urls) {
  document.querySelectorAll("img").forEach(img => {
    if (img.naturalWidth >= 500 && img.naturalHeight >= 500) {
      const src =
        img.getAttribute("data-zoom-src") ||
        img.getAttribute("data-old-hires") ||
        img.getAttribute("data-src") ||
        img.currentSrc ||
        img.src;

      if (src) {
        urls.add(src);
      }
    }
  });

  const links = document.querySelectorAll("a[href]");

  for (const a of links) {
    const href = a.href;

    if (!/\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(href)) {
      continue;
    }

    const img = new Image();
    img.src = href;

    await img.decode().catch(() => {});

    if (img.naturalWidth >= 500 && img.naturalHeight >= 500) {
      urls.add(href);
    }
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
   console.log("MESSAGE RECEIVED:", message);
  if (message.action === "AUTOFILL") {
    const data = message.data;
    const titleInput =
      document.querySelector('input[name="title"]');

    const subtitleCheckbox =
  document.querySelector('input[name="customLabelPref"]');
 
  const inputSetter =
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    ).set;

    const checkerSetter =
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "checked"
    ).set;
    await new Promise(resolve => setTimeout(resolve, 500));
    if (data.box){
      box="NWB";
    }
    else{
      box="NWOB";
    }
    setValue(titleInput,inputSetter,box+" "+ data.description+" SZ "+data.size+" "+ data.sku);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!subtitleCheckbox.checked){
      setValue(subtitleCheckbox,checkerSetter,true)
    }
    await new Promise(resolve => setTimeout(resolve, 500));
     const subtitleInput =
      document.querySelector('input[name="customLabel"]');
   
    setValue(subtitleInput,inputSetter, data.shelf+" SZ "+data.size+" "+ data.sku+" "+data.name);

    //await new Promise(resolve => setTimeout(resolve, 300));
    /*const applyAllButton=document.querySelector('button.fake-link');
    if (applyAllButton){
      applyAllButton.click()
    }*/
    await new Promise(resolve => setTimeout(resolve, 1500));
    const sizeButton = document.querySelector(`button[aria-label="${data.size}"]`);
    sizeButton?.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    const conditionButton = document.querySelector('button#summary-condition-field-value[name="condition"]');
    conditionButton.click();
    await new Promise(resolve => setTimeout(resolve, 1500));
    const noBoxRadio = document.querySelector(
  'input[name="condition"][value="1500"]'
);
    const boxRadio = document.querySelector(
  'input[name="condition"][value="1000"]'
);
    if (data.box){
      boxRadio.click();
    }
    else{
      noBoxRadio.click();
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    const statusDoneButton = document.querySelector('button[_track="0.condition.2.Done"]');
    statusDoneButton.click();

    await new Promise(resolve => setTimeout(resolve, 1500));
    const shippingExclusionButton = document.querySelector('button[name="shippingExclusion"]');
    shippingExclusionButton?.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const asiaCheckbox =
  document.querySelector(
    'input[name="intlExcludeShippingLocations"][value="_AS"]'
  );
  
  const europeCheckbox =
  document.querySelector(
    'input[name="intlExcludeShippingLocations"][value="_EU"]'
  );
  if (asiaCheckbox.checked){
    asiaCheckbox.click()
  }
  await new Promise(resolve => setTimeout(resolve, 500));
  if (europeCheckbox.checked){
    europeCheckbox.click()
  }
  await new Promise(resolve => setTimeout(resolve, 500));
  asiaCheckbox.click()
  await new Promise(resolve => setTimeout(resolve, 500));
  europeCheckbox.click()
  await new Promise(resolve => setTimeout(resolve, 500));
  europeCheckbox.click()
  await new Promise(resolve => setTimeout(resolve, 500));
  const exclusionDoneButton = document.querySelector('button[_track="0.shippingExclusion.2.Done"]');
  exclusionDoneButton.click();
  await new Promise(resolve => setTimeout(resolve, 500));
  const aiDescriptionButton= document.querySelector('button.se-rte__ai-description-button');
  aiDescriptionButton.click();
  await new Promise(resolve => setTimeout(resolve, 500));
  price = Number(data.price);
  const priceInput= document.querySelector('input[name="price"]');
  setValue(priceInput,inputSetter,price);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (price < 100){
    const applyEstimateButton = document.querySelector(
  'button.package-details__recommendation-apply');
    if(applyEstimateButton){
      applyEstimateButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    const shippingOptionButton = document.querySelector(
  'button[value="Flat: Same cost to all buyers"]'
);
    if (shippingOptionButton){
      shippingOptionButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      const shippingOption = [...document.querySelectorAll('[role="option"]')]
  .find(el =>
    el.textContent.includes('Calculated: Cost varies by buyer location')
  );
      shippingOption.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    const freeShippingCheckbox = document.querySelector(
  'input[name="freeShipping"]'
      );
    if (price>=80){
      if (!freeShippingCheckbox.checked){

        freeShippingCheckbox.click();
      }
    }
    else{
      if (freeShippingCheckbox.checked){
        freeShippingCheckbox.click();
      }
    }


  }

  


  }
  else if (message.action ==="GET_PHOTOS"){
    const urls = new Set();
    const domain = window.location.hostname;
    if (domain==="www.amazon.com"){
    amazonSearch(urls);}
    else if (domain==="www.ebay.com"){
      ebaySearch(urls);
    }
    else if (domain==="www.macys.com"){
      macysSearch(urls);
    }
    else{
      await generalSearch(urls);
    }
 

  const images = [...urls].map(src => ({
    src: src
    
  }));

  sendResponse({ images });
  }
 else if (message.action === "LOADING_IMGS") {
  const images = message.images;

  const fileInput =
    document.querySelector("#fehelix-uploader");

  if (!fileInput) {
    console.log("file input not found");
    return;
  }

  const dataTransfer = new DataTransfer();

  for (const imageUrl of images) {
  try {
    const result = await chrome.runtime.sendMessage({
      action: "FETCH_IMAGE",
      url: imageUrl
    });

    if (!result || !result.success) {
      console.log(
        "failed to fetch:",
        imageUrl,
        result?.error
      );
      continue;
    }

    // turn returned base64 data URL back into a Blob
    const response = await fetch(result.dataUrl);
    const blob = await response.blob();

    const file = new File(
      [blob],
      `photo-${dataTransfer.items.length + 1}.jpg`,
      {
        type: blob.type || "image/jpeg"
      }
    );

    dataTransfer.items.add(file);

  } catch (error) {
    console.log("image failed:", imageUrl, error);
  }
}

  console.log("files prepared:", dataTransfer.files.length);

  fileInput.files = dataTransfer.files;

  fileInput.dispatchEvent(
    new Event("change", {
      bubbles: true
    })
  );
  sendResponse(true);
}
else if (message.action==="RETRIEVE_INFO"){
  const domain = window.location.hostname;
  let desc;
  let number;
  if (domain === "www.amazon.com"){
  const description= document.getElementById("title");
  desc=description.textContent;
  const price=document.querySelector(".a-price-whole");
  number = price.textContent.replace(".", "").trim();}
  else if (domain === "www.ebay.com") {
    const description = document.querySelector('input[name="title"]');
    desc = description?.value.trim();

    const price = document.querySelector('input[name="price"]');
    number = price?.value.trim();
  }
  else if (domain === "www.macys.com") {
  const title = document.querySelector(".product-title");

  desc = title?.textContent.trim();

  const price = document.querySelector(
    '.product-price-wrapper [aria-label^="Current Price"]'
  );

  number = price?.textContent.replace("$", "").trim();
}
else if (domain === "www.skechers.com") {
  const description = document.querySelector(
    ".c-product-details__product-name"
  );

  desc = description?.textContent.trim();

  const prices = document.querySelectorAll(
    ".prices .sales .value[content]"
  );

  const price = [...prices].find(element =>
    element.getAttribute("content")?.trim()
  );

  number = price?.getAttribute("content").trim();
}else if (domain === "www.newbalance.com") {
  const description = document.querySelector(
    "#product-title-pricing-desktop .product-name"
  );

  desc = "New Balance "+description?.textContent.trim();

  const price = document.querySelector(
    "#product-title-pricing-desktop .sales span[content]"
  );

  number = price?.getAttribute("content")?.trim();
}

   sendResponse({
      description: desc,
      price: number
    });
}
  
});