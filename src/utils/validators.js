/** 手机号检验 */
export const validPhone = function(rule, value, callback) {
  if (!value || /^1\d{10}$/.test(value)) {
    callback();
  } else {
    callback("手机号码格式不正确");
  }
};
/** 整数校验 */
export const validInt = function(rule, value, callback) {
  if (!value || /^-?\d+$/.test(value)) {
    callback();
  } else {
    callback("请输入整数");
  }
};
/** 校验是否大于 n
 * @param { number } n
 */
export const validGreaterThanNum = function(n) {
  return function(rule, value, callback) {
    if (!value || +value > n) {
      callback();
    } else {
      callback(`请输入大于${n}的数字`);
    }
  };
};