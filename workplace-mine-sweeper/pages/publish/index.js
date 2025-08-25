// pages/publish/index.js
// This page is a placeholder for the central tab bar button.
// It will not be displayed. The tab bar tap event is handled in app.js or the current page.
Page({
  onLoad(options) {
    // Immediately navigate back or to the desired action page
    wx.switchTab({ url: '/pages/home/index' });
  }
})
