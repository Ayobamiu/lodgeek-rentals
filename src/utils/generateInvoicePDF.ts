import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { UploadPhotoAsync } from "../firebase/storage_upload_blob";

/**
 * Convert HTML page to picture, upload to firebase and return it's url.
 * @param htmlString HTML in a string format
 * @returns {string}
 */
export const htmlStringToImage = async (htmlString: string) => {
  let iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);
  let iframedoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframedoc) return null;
  iframedoc.body.innerHTML = htmlString;
  const element = iframedoc.body;
  const docWidth = element.clientWidth;
  const docHeight = element.clientHeight;

  // Generate image from HTML using html2canvas
  const canvas = await html2canvas(element, { useCORS: true, scale: 10 });
  let imgData = canvas.toDataURL("image/png");
  const img = new Image(docWidth, docHeight);
  img.src = imgData;

  //Convert image to Blob
  const blob = await imageToBlob(img);

  // Upload Blob to Firebase Storage and Get public URL of uploaded image
  const url = await UploadPhotoAsync(
    `/receipts/${Date.now()}-img`,
    blob as Blob
  );
  return url;
};

export const htmlStringToPdf = async (htmlString: string) => {
  let iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);
  let iframedoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframedoc) return null;
  iframedoc.body.innerHTML = htmlString;

  const element = iframedoc.body;
  let canvas = await html2canvas(element, { scale: 10 });

  // Get the dimensions of the HTML document
  // Convert the iframe into a PNG image using canvas.
  let imgData = canvas.toDataURL("image/png");
  const img = new Image(210, 297);
  img.src = imgData;
  const link = document.createElement("a");
  link.download = "my-image.png";
  link.href = imgData;
  link.click();
  // Create a PDF document and add the image as a page.
  // const doc = new jsPDF();
  const doc = new jsPDF();
  doc.addImage(img, "PNG", 0, 0, 210, 297);
  // pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);

  // Get the file as blob output.
  let blob = doc.output("blob");
  // doc.save("pdf.pdf");

  // Remove the iframe from the document when the file is generated.
  document.body.removeChild(iframe);
  return blob;
};

/**
 *
 * @param image This function uses the fetch() method to fetch the image data as a Blob and then uses a FileReader to read the Blob as an array buffer. It creates a new Blob object using the array buffer data and returns it as a resolved Promise.
 * @returns {Blob}
 */
function imageToBlob(image: HTMLImageElement) {
  return fetch(image.src)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(
              new Blob([reader.result as BlobPart], { type: "image/png" })
            );
          reader.readAsArrayBuffer(blob);
        })
    );
}
