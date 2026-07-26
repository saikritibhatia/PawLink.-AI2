/**
 * Shrinks a phone photo before it leaves the device. 448px on the long edge is
 * plenty to judge coat color, markings, and build, and it keeps the upload
 * small enough that filing a report from a parking lot on a bad signal works.
 *
 * Returns the base64 body (no data URL prefix) for upload, plus a preview URL.
 */
export function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("That file is not an image."));
    if (file.size > 20 * 1024 * 1024) return reject(new Error("That photo is over 20 MB. Try a smaller one."));

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("That file could not be read."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That image could not be opened."));
      img.onload = () => {
        const max = 448;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve({ base64: dataUrl.split(",")[1], previewUrl: dataUrl });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
