function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);

    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}


chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (message.action === "FETCH_IMAGE") {

      (async () => {
        try {
          console.log("background fetching:", message.url);

          const response = await fetch(message.url);

          if (!response.ok) {
            throw new Error(
              `HTTP error: ${response.status}`
            );
          }

          const contentType =
            response.headers.get("content-type") ||
            "image/jpeg";

          const buffer = await response.arrayBuffer();

          const base64 = arrayBufferToBase64(buffer);

          const dataUrl =
            `data:${contentType};base64,${base64}`;

          sendResponse({
            success: true,
            dataUrl: dataUrl
          });

        } catch (error) {

          console.error(
            "background image fetch failed:",
            message.url,
            error
          );

          sendResponse({
            success: false,
            error: error.message
          });
        }
      })();

      // VERY IMPORTANT:
      // keeps sendResponse alive for async work
      return true;
    }
  }
);