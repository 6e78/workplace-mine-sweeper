Page({
  data: {
    src: '',
    brightness: 100,
    contrast: 100,
    saturate: 100,
  },

  chooseImage: function () {
    console.log(555)
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ src: res.tempFiles[0].tempFilePath });
      },
    });
  },

  sliderChange: function (e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ [filter]: e.detail.value });
  },

  saveImage: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.src,
      success: () => {
        wx.showToast({ title: 'Image saved' });
      },
      fail: (err) => {
        console.error(err);
        wx.showToast({ title: 'Failed to save', icon: 'error' });
      },
    });
  },
});
