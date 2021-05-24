import {
  getMsg,
  isGeneralWithChinese,
  isNotNull,
  isInteger,
  isSecurityPassword,
  isDecimal,
  isPrimes,
  isLetter,
  isUpperCase,
  isLowerCase,
  isIp,
  isIpv4,
  isIpv6,
  isMoney,
  isEmail,
  isMobile,
  isCitizenid,
  isGeneral,
  isZipCode,
  isUrl,
  isMac,
  isPlateNumber,
  isChinese,
} from "@/utils/valiargs";

/**
 * 不能为空
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsNotNull = (rule, value, callback) => {
  if (!isNotNull(value)) {
    callback(new Error(getMsg("isNotNull")));
  } else {
    callback();
  }
};

/**
 * 只能为纯数字
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsInteger = (rule, value, callback) => {
  if (!isInteger(value)) {
    callback(new Error(getMsg("isInteger")));
  } else {
    callback();
  }
};

/**
 * 小数浮点格式不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsDecimal = (rule, value, callback) => {
  if (!isDecimal(value)) {
    callback(new Error(getMsg("isDecimal")));
  } else {
    callback();
  }
};

/**
 * 不是质数
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsPrimes = (rule, value, callback) => {
  if (!isPrimes(value)) {
    callback(new Error(getMsg("isPrimes")));
  } else {
    callback();
  }
};

/**
 * 只能纯字母
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsLetter = (rule, value, callback) => {
  if (!isLetter(value)) {
    callback(new Error(getMsg("isLetter")));
  } else {
    callback();
  }
};

/**
 * 只能为大写字母
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsUpperCase = (rule, value, callback) => {
  if (!isUpperCase(value)) {
    callback(new Error(getMsg("isUpperCase")));
  } else {
    callback();
  }
};

/**
 * 只能为小写字母
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsLowerCase = (rule, value, callback) => {
  if (!isLowerCase(value)) {
    callback(new Error(getMsg("isLowerCase")));
  } else {
    callback();
  }
};

/**
 * IP地址不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsIp = (rule, value, callback) => {
  if (!isIp(value)) {
    callback(new Error(getMsg("isIp")));
  } else {
    callback();
  }
};

/**
 * IPV4地址不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsIpv4 = (rule, value, callback) => {
  if (!isIpv4(value)) {
    callback(new Error(getMsg("isIpv4")));
  } else {
    callback();
  }
};

/**
 * IPV6地址不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsIpv6 = (rule, value, callback) => {
  if (!isIpv6(value)) {
    callback(new Error(getMsg("isIpv6")));
  } else {
    callback();
  }
};

/**
 * 金额格式不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsMoney = (rule, value, callback) => {
  if (!isMoney(value)) {
    callback(new Error(getMsg("isMoney")));
  } else {
    callback();
  }
};

/**
 * 邮箱格式不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsEmail = (rule, value, callback) => {
  if (!isEmail(value)) {
    callback(new Error(getMsg("isEmail")));
  } else {
    callback();
  }
};

/**
 * 手机号格式不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsMobile = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error(getMsg("isMobile")));
  } else {
    callback();
  }
};

/**
 * 身份证格式不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsCitizenid = (rule, value, callback) => {
  if (!isCitizenid(value)) {
    callback(new Error(getMsg("isCitizenid")));
  } else {
    callback();
  }
};

/**
 * 只能汉字
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsChinese = (rule, value, callback) => {
  if (!isChinese(value)) {
    callback(new Error(getMsg("isChinese")));
  } else {
    callback();
  }
};

/**
 * 只能为字母、数字或下划线
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsGeneral = (rule, value, callback) => {
  if (!isGeneral(value)) {
    callback(new Error(getMsg("isGeneral")));
  } else {
    callback();
  }
};

/**
 * 只能为汉字、字母、数字和下划线
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsGeneralWithChinese = (rule, value, callback) => {
  if (!isGeneralWithChinese(value)) {
    callback(new Error(getMsg("isGeneralWithChinese")));
  } else {
    callback();
  }
};

/**
 * 邮编地址不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsZipCode = (rule, value, callback) => {
  if (!isZipCode(value)) {
    callback(new Error(getMsg("isZipCode")));
  } else {
    callback();
  }
};

/**
 * URL地址不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsUrl = (rule, value, callback) => {
  if (!isUrl(value)) {
    callback(new Error(getMsg("isUrl")));
  } else {
    callback();
  }
};

/**
 * MAC地址不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsMac = (rule, value, callback) => {
  if (!isMac(value)) {
    callback(new Error(getMsg("isMac")));
  } else {
    callback();
  }
};

/**
 * 中国车牌号不正确
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsPlateNumber = (rule, value, callback) => {
  if (!isPlateNumber(value)) {
    callback(new Error(getMsg("isPlateNumber")));
  } else {
    callback();
  }
};

/**
 * 密码至少包含大小写字母、数字、特殊字符，且不少于6位
 * @param rule
 * @param value
 * @param callback
 */
export const validateIsSecurityPassword = (rule, value, callback) => {
  if (!isSecurityPassword(value)) {
    callback(new Error(getMsg("isSecurityPassword")));
  } else {
    callback();
  }
};
