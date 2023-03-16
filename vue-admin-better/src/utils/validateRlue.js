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

export const validatorRule = {
  /**
   * 不能为空
   * @param rule
   * @param value
   * @param callback
   */
  IS_NOT_NULL: (rule, value, callback) => {
    if (!isNotNull(value)) {
      callback(new Error(getMsg("isNotNull")));
    } else {
      callback();
    }
  },
  /**
   * 只能为纯数字
   * @param rule
   * @param value
   * @param callback
   */
  IS_INTEGER: (rule, value, callback) => {
    if (value && !isInteger(value)) {
      callback(new Error(getMsg("isInteger")));
    } else {
      callback();
    }
  },
  /**
   * 小数浮点格式不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_DECIMAL: (rule, value, callback) => {
    if (value && !isDecimal(value)) {
      callback(new Error(getMsg("isDecimal")));
    } else {
      callback();
    }
  },
  /**
   * 不是质数
   * @param rule
   * @param value
   * @param callback
   */
  IS_PRIMES: (rule, value, callback) => {
    if (value && !isPrimes(value)) {
      callback(new Error(getMsg("isPrimes")));
    } else {
      callback();
    }
  },
  /**
   * 只能纯字母
   * @param rule
   * @param value
   * @param callback
   */
  IS_LETTER: (rule, value, callback) => {
    if (value && !isLetter(value)) {
      callback(new Error(getMsg("isLetter")));
    } else {
      callback();
    }
  },
  /**
   * 只能为大写字母
   * @param rule
   * @param value
   * @param callback
   */
  IS_UPPER_CASE: (rule, value, callback) => {
    if (value && !isUpperCase(value)) {
      callback(new Error(getMsg("isUpperCase")));
    } else {
      callback();
    }
  },
  /**
   * 只能为小写字母
   * @param rule
   * @param value
   * @param callback
   */
  IS_LOWER_CASE: (rule, value, callback) => {
    if (value && !isLowerCase(value)) {
      callback(new Error(getMsg("isLowerCase")));
    } else {
      callback();
    }
  },
  /**
   * IP地址不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_IP: (rule, value, callback) => {
    if (value && !isIp(value)) {
      callback(new Error(getMsg("isIp")));
    } else {
      callback();
    }
  },
  /**
   * IPV4地址不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_IPV4: (rule, value, callback) => {
    if (value && !isIpv4(value)) {
      callback(new Error(getMsg("isIpv4")));
    } else {
      callback();
    }
  },
  /**
   * IPV6地址不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_IPV6: (rule, value, callback) => {
    if (value && !isIpv6(value)) {
      callback(new Error(getMsg("isIpv6")));
    } else {
      callback();
    }
  },
  /**
   * 金额格式不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_MONEY: (rule, value, callback) => {
    if (value && !isMoney(value)) {
      callback(new Error(getMsg("isMoney")));
    } else {
      callback();
    }
  },
  /**
   * 邮箱格式不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_EMAIL: (rule, value, callback) => {
    if (value && !isEmail(value)) {
      callback(new Error(getMsg("isEmail")));
    } else {
      callback();
    }
  },
  /**
   * 手机号格式不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_MOBILE: (rule, value, callback) => {
    if (value && !isMobile(value)) {
      callback(new Error(getMsg("isMobile")));
    } else {
      callback();
    }
  },
  /**
   * 身份证格式不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_CITIZENID: (rule, value, callback) => {
    if (value && !isCitizenid(value)) {
      callback(new Error(getMsg("isCitizenid")));
    } else {
      callback();
    }
  },
  /**
   * 只能汉字
   * @param rule
   * @param value
   * @param callback
   */
  IS_CHINESE: (rule, value, callback) => {
    if (value && !isChinese(value)) {
      callback(new Error(getMsg("isChinese")));
    } else {
      callback();
    }
  },
  /**
   * 只能为字母、数字或下划线
   * @param rule
   * @param value
   * @param callback
   */
  IS_GENERAL: (rule, value, callback) => {
    if (value && !isGeneral(value)) {
      callback(new Error(getMsg("isGeneral")));
    } else {
      callback();
    }
  },
  /**
   * 只能为汉字、字母、数字和下划线
   * @param rule
   * @param value
   * @param callback
   */
  IS_GENERAL_WITH_CHINESE: (rule, value, callback) => {
    if (value && !isGeneralWithChinese(value)) {
      callback(new Error(getMsg("isGeneralWithChinese")));
    } else {
      callback();
    }
  },
  /**
   * 邮编地址不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_ZIP_CODE: (rule, value, callback) => {
    if (value && !isZipCode(value)) {
      callback(new Error(getMsg("isZipCode")));
    } else {
      callback();
    }
  },
  /**
   * URL地址不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_URL: (rule, value, callback) => {
    if (value && !isUrl(value)) {
      callback(new Error(getMsg("isUrl")));
    } else {
      callback();
    }
  },
  /**
   * MAC地址不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_MAC: (rule, value, callback) => {
    if (value && !isMac(value)) {
      callback(new Error(getMsg("isMac")));
    } else {
      callback();
    }
  },
  /**
   * 中国车牌号不正确
   * @param rule
   * @param value
   * @param callback
   */
  IS_PLATE_NUMBER: (rule, value, callback) => {
    if (value && !isPlateNumber(value)) {
      callback(new Error(getMsg("isPlateNumber")));
    } else {
      callback();
    }
  },
  /**
   * 密码至少包含大小写字母、数字、特殊字符，且不少于6位
   * @param rule
   * @param value
   * @param callback
   */
  IS_SECURITY_PASSWORD: (rule, value, callback) => {
    if (value && !isSecurityPassword(value)) {
      callback(new Error(getMsg("isSecurityPassword")));
    } else {
      callback();
    }
  },
};
