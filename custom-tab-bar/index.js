Component({
  data: {
    selected: 0,
    list: [
      { pagePath: "pages/home/home", text: "首页" },
      { pagePath: "pages/region/region", text: "家乡" },
      { pagePath: "pages/publish/publish", text: "发布" },
      { pagePath: "pages/messages/messages", text: "消息" },
      { pagePath: "pages/mine/mine", text: "我的" }
    ]
  },
  lifetimes: {
    attached() {
      this.updateSelected();
    }
  },
  methods: {
    updateSelected() {
      const page = getCurrentPages().pop();
      if (!page) return;
      const path = page.route;
      const idx = this.data.list.findIndex(item => item.pagePath === path);
      this.setData({ selected: idx >= 0 ? idx : 0 });
    },
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const url = "/" + this.data.list[index].pagePath;
      wx.switchTab({ url });
    }
  }
});