Page({
  data: {
    src: '',
    canvasWidth: 300,
    canvasHeight: 300,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100
    }
  },

  // 选择图片
  chooseImage() {
    console.log('测试');
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('测试7777');
        const tempFilePath = res.tempFiles[0].tempFilePath;
        
        // 获取图片信息以设置canvas尺寸
        wx.getImageInfo({
          src: tempFilePath,
          success: (info) => {
            // 计算适合屏幕的图片尺寸
            const maxWidth = wx.getSystemInfoSync().windowWidth - 40;
            const scale = maxWidth / info.width;
            
            this.setData({
              src: tempFilePath,
              canvasWidth: info.width * scale,
              canvasHeight: info.height * scale
            }, () => {
              this.drawImage();
            });
          }
        });
      }
    });
  },

  // 更新滤镜
  updateFilter(e) {
    const type = e.currentTarget.dataset.type;
    const value = e.detail.value;
    
    this.setData({
      [`filters.${type}`]: value
    }, () => {
      this.drawImage();
    });
  },

  // 绘制图片
  drawImage() {
    const ctx = wx.createCanvasContext('imageCanvas');
    const { brightness, contrast, saturation } = this.data.filters;
    
    // 应用滤镜
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    // 绘制图片
    ctx.drawImage(this.data.src, 0, 0, this.data.canvasWidth, this.data.canvasHeight);
    ctx.draw();
  },

  // 保存图片
  saveImage() {
    wx.canvasToTempFilePath({
      canvasId: 'imageCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        });
      }
    });
  }
});