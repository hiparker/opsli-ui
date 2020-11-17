import {storage, tokenName, baseURL} from "@/config/settings";
import { isNull } from "@/utils/validate"
import cookie from "js-cookie";
import { getDictListByCode, getDictListByCodeParams } from "@/api/dictManagement"
import store from "@/store";

// 缓存前缀 方便统一删除处理
const cachePrefix = "opsli:dict";


/**
 * 获得前端本地缓存
 * @returns {null|any}
 */
function getCache() {
  let cache = null;
  if (storage) {
    if ("localStorage" === storage) {
      cache = localStorage.getItem(cachePrefix);
    } else if ("sessionStorage" === storage) {
      cache = sessionStorage.getItem(cachePrefix);
    } else if ("cookie" === storage) {
      cache = cookie.get(cachePrefix);
    } else {
      cache = localStorage.getItem(cachePrefix);
    }
  } else {
    cache = localStorage.getItem(cachePrefix);
  }
  return isNull(cache)?null:JSON.parse(cache);
}

/**
 * 移除缓存
 * @returns {null|any}
 */
function removeCache() {
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.removeItem(cachePrefix);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.clear();
    } else if ("cookie" === storage) {
      return cookie.remove(cachePrefix);
    } else {
      return localStorage.removeItem(cachePrefix);
    }
  } else {
    return localStorage.removeItem(cachePrefix);
  }
}

/**
 * @copyright parker
 * @description 存储字典
 * @param typeCode
 * @param dictList
 * @returns {void|*}
 */
function setDictList(typeCode, dictList) {

  // 先去获得本地缓存
  let cache = getCache();
  if(isNull(cache)){
    cache = {};
  }

  // 存放缓存
  cache[typeCode] = dictList;
  let json  = JSON.stringify(cache);
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.setItem(cachePrefix, json);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.setItem(cachePrefix, json);
    } else if ("cookie" === storage) {
      return cookie.set(typeCode, cachePrefix);
    } else {
      return localStorage.setItem(cachePrefix, json);
    }
  } else {
    return localStorage.setItem(cachePrefix, json);
  }
}



/**
 * 验证是否有按钮权限
 * @param perms
 * @returns {boolean}
 */
export default {
  install (Vue, options) {

    /**
     * @copyright parker
     * @description 获取字典
     * @param typeCode
     * @returns [字典数组]
     */
    Vue.prototype.$getDictList = function (typeCode) {

      let cache = getCache();
      if (cache == null) {
        cache = {};
      }


      let dictList = cache[typeCode];

      // 如果本地缓存没有 则去远端缓存中获取
      if (isNull(dictList) || dictList.length === 0) {

        // TODO 可能还不是很好， 毕竟针对字典表需要 同步型数据， 目前只能这么搞了
        const params = getDictListByCodeParams({typeCode: typeCode});
        let ret = null;
        ajax({
          url: baseURL + params.url,
          method: params.method,
          async: false,
          data: params.params,
          success: function (res) {
            ret = JSON.parse(res);
          }
        })
        // ret.then((v) => {
          const {success, data} = ret;
          if (success) {
            setDictList(typeCode, data);
            return isNull(data) ? [] : data;
          }
        // });
      }
      return isNull(dictList) ? [] : dictList;
    }

    /**
     * @copyright parker
     * @description 获取字典 By Name
     * @param typeCode
     * @param dictName
     * @returns 字典值
     */
    Vue.prototype.$getDictValueByName = function (typeCode, dictName) {
      let dictList = Vue.prototype.$getDictList(typeCode);
      let dictValue = null;
      if(!isNull(dictList)){
        for (let i = 0; i < dictList.length; i++) {
          if(dictList[i].dictName === dictName){
            dictValue = dictList[i].dictValue;
            break;
          }
        }
      }
      return dictValue;
    }

    /**
     * @copyright parker
     * @description 获取字典 By Value
     * @param typeCode
     * @param dictValue
     * @returns 字典名称
     */
    Vue.prototype.$getDictNameByValue = function (typeCode, dictValue) {
      let dictList = Vue.prototype.$getDictList(typeCode);
      let dictName = null;
      if(!isNull(dictList)){
        for (let i = 0; i < dictList.length; i++) {
          if(dictList[i].dictValue === dictValue){
            dictName = dictList[i].dictName;
            break;
          }
        }
      }
      return dictName;
    }

    /**
     * @copyright parker
     * @description 清空缓存
     * @returns void
     */
    Vue.prototype.$clearDictList = function () {
      // 浏览器缓存空间有限，能节省一点是一点
      removeCache()
    }
  }
}

// ==================================

function ajax(obj){
  //指定提交方式的默认值
  obj.type = obj.type || "get";
  //设置是否异步，默认为true(异步)
  if(obj.async === null || obj.async === undefined){
    obj.async = true;
  }
  //设置数据的默认值
  obj.data = obj.data || null;
  let params=_params(obj.data);
  //在路径后面添加时间戳加随机数防止浏览器缓存。
  obj.url+=(obj.url.indexOf("?")>-1?"&":"?")+"t="+((new Date()).getTime()+Math.random());
  if(obj.type.toLowerCase() === "get" && params.length>0){//将转换后的data.与url进行拼接。
    obj.url+="&"+params;
  }
  let xhr=new XMLHttpRequest();

  xhr.open(obj.type,obj.url,obj.async);

  xhr.setRequestHeader( tokenName, store.getters["user/accessToken"]);

  if(obj.type.toLowerCase() === "post"){
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send(params)
  }else
    xhr.send(null);
  if(obj.async){//异步调用
    //监听响应状态。
    xhr.onreadystatechange=function(){
      if(xhr.readyState === 4)//响应状态为4，数据加载完毕。
        callback();
    }
  }else//同步
    callback();
  function callback(){
    if(xhr.status === 200){
      obj.success(xhr.responseText);
    }else{
      obj.error(xhr.status);
    }
  }
  //将对象序列化，将对象拼接成url字符串
  function _params(data){
    if(obj==null)
      return obj;
    let arr = [];
    for(let i in data){
      arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
    }
    return arr.join("&");
  }
}




