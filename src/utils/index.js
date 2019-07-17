import * as Enums from "../config/Enums";

export const enumsToList = function(type, allFlag = true) {
  if (allFlag) {
    return Object.keys(Enums[type]).map(key => {
      return {
        value: Enums[type][key],
        label: Enums[type + "Text"][key]
      };
    });
  } else {
    return Object.keys(Enums[type]).filter(key => Enums[type][key] !== Enums.ALL).map(key => {
      return {
        value: Enums[type][key],
        label: Enums[type + "Text"][key]
      };
    });
  }
};

/**
 * 数字逗号分隔
 * @param { number } num
 * @param { number } fiexdNum 保留小数位数
 * @param { boolean } onlyFiexd 小数超过时是四舍五入
 * @param { boolean } fiexdFlag 小数位数不足时是否补0
 */
export function numberSplit(
  num,
  fiexdNum = 2,
  onlyFiexd = false,
  fiexdFlag = true
) {
  if (/^-?\d+(\.\d+)?$/.test(num + "")) {
    num = +num;
    if (onlyFiexd) {
      num = num.toFixed(fiexdNum);
    }
    let flag = false;
    if (num < 0) {
      num = -num;
      flag = true;
    }
    const nums = (num + "").split(".");
    let str = nums[0]
    .split("")
    .reverse()
    .join("");
    for (let i = 3; i < str.length; i += 4) {
      str = str.substring(0, i) + "," + str.substring(i, str.length);
    }
    let fiexd = "";
    if (fiexdFlag) {
      if (nums[1] && nums[1].length >= fiexdNum) {
        fiexd = "." + nums[1];
      } else {
        fiexd =
          "." +
          (nums[1] || "") +
          "000000000000000000000000000000000".substr(
            0,
            fiexdNum - (nums[1] || "").length
          );
      }
    } else {
      fiexd = nums[1] ? "." + nums[1] : "";
    }
    return (
      (flag ? "-" : "") +
      str
      .split("")
      .reverse()
      .join("") +
      fiexd
    );
  } else {
    return num || "";
  }
}
