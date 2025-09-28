export const uploadFileToS3 = (file, mediaRecord, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', mediaRecord.presigned_url, true);
    xhr.setRequestHeader('Content-Type', mediaRecord.media.mime_type);

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    // Success
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(true);
      } else {
        console.error(`S3 Upload failed: Status ${xhr.status}`);
        reject(false);
      }
    };

    // Error
    xhr.onerror = () => {
      console.error('S3 Upload error');
      reject(false);
    };

    // Upload
    xhr.send(file);
  });
};
