import debounce from "lodash/debounce";
import { addListener, removeListener } from "resize-detector";
import BackgroundImage from "./bg.png";

const version = "0.0.1";
let idBase = new Date() - 0;

/**
 * 转换
 * @param {string} value
 * @example
 * pxToNumber(50px)
 * // => 50
 */
function pxToNumber(value) {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

/**
 * 获取元素
 * @param {element} el
 */
function _getDom(el) {
  if (typeof el === "string" || el instanceof String) {
    return document.querySelector(el);
  }
  return el;
}

/**
 * @param {Object} opts
 */
export class Dap {
  constructor(opts) {
    let options,
      el = _getDom(opts.el),
      wrapEl = _getDom(opts.wrapEl);

    if (el === null || wrapEl === null) {
      throw new Error("Initialize failed: invalid dom.");
    }

    options = {
      el: el || document.body,
      wrapEl: wrapEl || document.documentElement,
      width: opts.width || 1920,
      height: opts.height || 1080,
      zoomType: opts.zoomType || "x", // 缩放类型 x等比缩放宽度铺满、y等比缩放高度铺满、z全屏铺满
      backgroundImage: opts.backgroundImage || BackgroundImage
    };

    // ----------------

    this.id = "dap_" + idBase++;
    this.v = version;
    this.opts = options;
    // this.$el = options.el;
    // this.$wrapEl = options.wrapEl;
    this.__resizeHandler = debounce(this.resize.bind(this), 50, {
      leading: true
    });
    this.__resizeHandler();

    addListener(options.wrapEl, this.__resizeHandler);
  }

  resize() {
    let { opts } = this;
    let { el, wrapEl, width, height, zoomType, backgroundImage } = opts;
    let wrapRect = window.getComputedStyle(wrapEl),
      resetH = 1080, // 基准高度
      resetW = (width * resetH) / height,
      scaleX = pxToNumber(wrapRect.width) / resetW, // 缩放比例
      scaleY = pxToNumber(wrapRect.height) / resetH, // 缩放比例
      marginX = (pxToNumber(wrapRect.width) - resetW * scaleY) / 2; // 水平居中

    el.style.width = resetW + "px";
    el.style.height = resetH + "px";
    el.style.transformOrigin = "left top 0px";

    if (zoomType === "x") {
      el.style.transform = "scale(" + scaleX + ")";
      el.style.background = 'url("' + backgroundImage + '") 0% 0% / 100%';
    } else if (zoomType === "y") {
      el.style.transform = "scale(" + scaleY + ")";
      el.style.marginLeft = marginX + "px";
      el.style.background =
        'url("' +
        backgroundImage +
        '") ' +
        marginX +
        "px top / " +
        (scaleY * 100) / scaleX +
        "% 100%";
    } else {
      el.style.transform = "scale(" + scaleX + ", " + scaleY + ")";
      el.style.background = 'url("' + backgroundImage + '") 0% 0% / 100% 100%';
    }
  }

  destroy() {
    let { wrapEl } = this.opts;
    removeListener(wrapEl, this.__resizeHandler);
  }
}
