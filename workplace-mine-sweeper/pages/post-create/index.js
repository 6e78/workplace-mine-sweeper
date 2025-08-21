// pages/post-create/index.js
const app = getApp();

Page({
  data: {
    topics: ['#面试吐槽#', '#薪资爆料#', '#offer选择求助#', '#996讨论区#'],
    topicIndex: 0,
    title: '',
    content: '',
    isAnonymous: true
  },

  onShow() {
    this.setData({
      topicIndex: 0,
      title: '',
      content: ''
      // We don't reset isAnonymous, let the user's last choice persist for convenience
    });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },

  onTopicChange(e) {
    this.setData({
      topicIndex: e.detail.value
    });
  },

  onAnonymousChange(e) {
    this.setData({
      isAnonymous: e.detail.value
    });
  },

  onSubmit() {
    if (!this.data.title || !this.data.content) {
      wx.showToast({
        title: '标题和内容不能为空',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '发布中...' });

    const postData = {
      topic: this.data.topics[this.data.topicIndex],
      title: this.data.title,
      content: this.data.content,
      isAnonymous: this.data.isAnonymous
    };

    wx.request({
      url: app.globalData.backendUrl + '/api/posts',
      method: 'POST',
      data: postData,
      success: res => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1500,
            complete: () => {
              setTimeout(() => {
                wx.switchTab({ url: '/pages/discover/index' });
              }, 1500);
            }
          });
        } else {
          wx.showToast({ title: '发布失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('Submit failed', err);
        wx.showToast({ title: '发布失败', icon: 'none' });
      },
      complete: wx.hideLoading
    });
  }
});
