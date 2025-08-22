// pages/settings/index.js
const defaultAvatarUrl = '/assets/images/me.png' // 使用一个本地的默认头像

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: ''
  },

  onLoad(options) {
    // 尝试从本地存储加载用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        avatarUrl: userInfo.avatarUrl || defaultAvatarUrl,
        nickname: userInfo.nickname || ''
      });
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl,
    });
  },

  onNicknameInput(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  saveProfile() {
    const { avatarUrl, nickname } = this.data;

    if (!nickname.trim()) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none'
      });
      return;
    }

    // 在实际应用中，这里应该将 avatarUrl 上传到您的服务器，
    // 然后将返回的 URL 和 nickname 一起保存到后端。
    // 为简化示例，我们仅将信息保存到本地存储。

    const userInfo = { avatarUrl, nickname };
    wx.setStorageSync('userInfo', userInfo);

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    // 1.5秒后自动返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
})
