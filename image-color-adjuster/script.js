const upload = document.getElementById('upload');
const image = document.getElementById('image');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturate = document.getElementById('saturate');
const grayscale = document.getElementById('grayscale');
const download = document.getElementById('download');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function applyFilters() {
  const filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    saturate(${saturate.value}%)
    grayscale(${grayscale.value}%)
  `;
  image.style.filter = filter;
}

brightness.addEventListener('input', applyFilters);
contrast.addEventListener('input', applyFilters);
saturate.addEventListener('input', applyFilters);
grayscale.addEventListener('input', applyFilters);

download.addEventListener('click', () => {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.filter = image.style.filter;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'edited-image.png';
  link.click();
});
