import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

export default function ImageCropper({ image, aspect = 16 / 9, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    const createImage = (url) => {
      return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
      });
    };
    const imageEl = await createImage(image);
    const canvas = document.createElement('canvas');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      imageEl,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg();
    onCropComplete(croppedBlob);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropCompleteHandler}
      />
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <button onClick={onCancel} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 4 }}>Cancel</button>
        <button onClick={handleDone} style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>Crop & Save</button>
      </div>
    </div>
  );
}
