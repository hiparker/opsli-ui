import { isNull } from "@/utils/validate";
const { tokenName, baseURL } = require("@/config/settings");
import { getAccessToken } from "@/utils/accessToken";


/**
 * 给URL追加参数
 * url
 * parameter 参数名
 * value  参数值
 */
function urlAddArgs(urls,parameter,value){
  let buf = '';
  if(!isNull(urls)){
    buf = urls;
    if(urls.indexOf("?") > -1){  //已经有参数
      buf+="&";
    }else{
      buf+="?";
    }
    buf+=parameter;
    buf+='=';
    buf+=value;
  }
  return buf.toString();
}

/**
 * 给URL追加参数
 * url
 * parameter 参数名
 * value  参数值
 */
function urlAddArgsByData(urls, data){
  let buf = '';
  if(!isNull(urls)){
    buf = urls;
    if(urls.indexOf("?") > -1){  //已经有参数
      buf+="&";
    }else{
      buf+="?";
    }
    buf+=data;
  }
  return buf.toString();
}


/**
 * 下载文件
 * @param url
 */
export function downloadFile(url){
  try {
    let elemIF = document.querySelector(".downloadFileIframe");
    if(elemIF !== null && elemIF !== undefined){
      elemIF.src = url;
    }else{
      elemIF = document.createElement("iframe");
      elemIF.className='downloadFileIframe';
      elemIF.src = url;
      elemIF.style.display = "none";
      document.body.appendChild(elemIF);
    }
  } catch (e) {
    alert("下载异常！");
  }
}

/**
 * 下载文件
 * @param url
 * @param data
 */
export function downloadFileByData(url, data){
  if(!isNull(url)) {
    if(!isNull(data)){
      // 设置Token认证
      data[tokenName] = getAccessToken();

      // 转换参数
      let params = Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      }).join("&");
      url = baseURL + urlAddArgsByData(url, params);
    }

    // 下载文件
    downloadFile(url);
  }else{
    alert("文件地址为空！");
  }
}
