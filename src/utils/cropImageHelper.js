
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.src = url;
  });

const getRadianAngle = (deg) => (deg * Math.PI) / 180;

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const rotRad = getRadianAngle(rotation);

  const maxSide = Math.max(image.width, image.height);
  const safeArea = maxSide * 2;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.rotate(-rotRad);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  const offsetX = (safeArea - image.width) / 2;
  const offsetY = (safeArea - image.height) / 2;

  const sx = Math.round(offsetX + pixelCrop.x);
  const sy = Math.round(offsetY + pixelCrop.y);
  const sWidth = Math.round(pixelCrop.width);
  const sHeight = Math.round(pixelCrop.height);

  const data = ctx.getImageData(sx, sy, sWidth, sHeight);

  const outCanvas = document.createElement('canvas');
  outCanvas.width = sWidth;
  outCanvas.height = sHeight;
  const outCtx = outCanvas.getContext('2d');
  outCtx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    outCanvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas export failed'));
        const url = URL.createObjectURL(blob);
        resolve({ blob, url });
      },
      'image/jpeg',
      0.92
    );
  });
}

