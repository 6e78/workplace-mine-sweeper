// pages/bookmarks/index.js
const app = getApp();

Page({
  data: {
    bookmarkedPosts: []
  },

  onShow() {
    this.fetchBookmarks();
  },

  fetchBookmarks() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: `${app.globalData.backendUrl}/api/bookmarks`,
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          this.setData({ bookmarkedPosts: res.data });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  navigateToPost(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/index?id=${postId}`
    });
  }
});