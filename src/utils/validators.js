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
/** 数字校验 */
export const validNum = function(rule, value, callback) {
  if (!value || /^-?\d+(\.\d+)?$/.test(value)) {
    callback();
  } else {
    callback("请输入数字");
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
/** 校验密码 */
export const  validPassword = function(rule, value, callback) {
  if (!value || /^[0-9A-Za-z]{6,16}$/.test(value)) {
    callback();
  } else {
    callback("请输入6-16的字母数字");
  }
};