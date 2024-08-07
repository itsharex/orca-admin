// 复制文本到剪贴板
export const copyTextToClipboard = async text => {
  // 使用Clipboard API复制文本
  // await navigator.clipboard.writeText(text);
  handleCopyValue(text);
  ElMessage({
    type: "success",
    message: "复制成功"
  });
};

// 处理复制操作
const handleCopyValue = text => {
  // 浏览器禁用了非安全域的 navigator.clipboard 对象
  // 在线上环境会报错 TypeError: Cannot read properties of undefined (reading 'writeText')
  if (!navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // 判断是否支持拷贝
    if (!document.execCommand("copy")) return Promise.reject();
    // 创建标签，并隐藏
    const textArea = document.createElement("textarea");
    textArea.style.position = "fixed";
    textArea.style.top = textArea.style.left = "-100vh";
    textArea.style.opacity = "0";
    textArea.value = text;
    document.body.appendChild(textArea);
    // 聚焦、复制
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      // 不知为何，必须写这个三目，不然copy不上
      document.execCommand("copy") ? resolve() : reject();
      textArea.remove();
    });
  }
};
