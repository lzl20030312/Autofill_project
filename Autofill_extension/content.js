function setValue(element, setter,value){
  
  setter.call(element,value)
  element.dispatchEvent(
    new Event("input", { bubbles: true })
  );
  element.dispatchEvent(
  new Event("change", { bubbles: true })
);
}
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "AUTOFILL") {
    const data = message.data;
    const titleInput =
      document.querySelector('input[name="title"]');

    const subtitleCheckbox =
  document.querySelector('input[name="subtitlePref"]');
 
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
    setValue(titleInput,inputSetter,"NWOB "+ data.description+" SZ "+data.size+" "+ data.sku)
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!subtitleCheckbox.checked){
      setValue(subtitleCheckbox,checkerSetter,true)
    }
    await new Promise(resolve => setTimeout(resolve, 500));
     const subtitleInput =
      document.querySelector('input[name="subtitle"]');
   
    setValue(subtitleInput,inputSetter, data.shelf+" SZ "+data.size+" "+ data.sku+" ZL");

    //await new Promise(resolve => setTimeout(resolve, 300));
    /*const applyAllButton=document.querySelector('button.fake-link');
    if (applyAllButton){
      applyAllButton.click()
    }*/
    await new Promise(resolve => setTimeout(resolve, 500));
    const sizeButton = document.querySelector(`button[aria-label="${data.size}"]`);
    sizeButton?.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    const conditionButton = document.querySelector('button#summary-condition-field-value[name="condition"]');
    conditionButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    const noBoxRadio = document.querySelector(
  'input[name="condition"][value="1500"]'
);
    noBoxRadio.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    const statusDoneButton = document.querySelector('button[_track="0.condition.2.Done"]');
    statusDoneButton.click();

    await new Promise(resolve => setTimeout(resolve, 1000));
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
  


  }
  
});