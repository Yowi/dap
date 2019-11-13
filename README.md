# dap

大屏展示插件

## 特征

- **按比例缩放** 不必关心演示屏幕的大小，所有的元素都按比例进行缩放。
- **迷你插件** 目前打包后的大小保持在 10KB 左右。
- **无依赖** 无需引入其它依赖文件。

## 使用方法

```js
var dap = new Dap({
  width: 1920, // 宽度比例
  height: 1080, // 高度比例
  zoomType: "x", // 缩放类型 x等比缩放宽度铺满、y等比缩放高度铺满、z全屏铺满
  backgroundColor: "#0e2a43",
  backgroundImage:
    "https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/51182f91cfa0fd0b3c8754d7ca23e877.png"
});
```
