// chrome-storage-largeSync
// eslint-disable-next-line
largeSync=function(){function a(a,b){"undefined"==typeof b&&(b=s);for(var d=f(a),g={},i=0;i<d.length;i++){var j=d[i];if(a.hasOwnProperty(j)){for(var k=LZString.compressToBase64(JSON.stringify(a[j])),l=e(j,b),m=0,n=0,o=k.length;o>n;n+=l,m++)g[c(j,m)]=k.substring(n,n+l);g[c(j,"meta")]={key:j,min:0,max:m,hash:h(k),largeSyncversion:t}}}return g}function b(a,b){"undefined"==typeof b&&(b=g(a));for(var d={},e=0;e<b.length;e++){var f=b[e],h="",i=a[c(f,"meta")];if("undefined"!==i){for(var j=0;j<i.max;j++){if("undefined"==typeof a[c(f,j)])throw Error("[largeSync] - partial string missing, object cannot be reconstructed.");h+=a[c(f,j)]}d[f]=JSON.parse(LZString.decompressFromBase64(h))}}return d}function c(a,b){return q+"__"+a+"."+b}function d(a){for(var b=[],d=0;d<f(a).length;d++){for(var e=a[d],g=0;r/s>g;g++)b.push(c(e,g));b.push(c(e,"meta"))}return b}function e(a,b){return b-(q.length+a.length+10)}function f(a){if("undefined"!=typeof a&&null!==a){if("Object"===a.constructor.name)return Object.keys(a);if("Array"===a.constructor.name||"string"==typeof a)return Array.from(a)}throw TypeError("[largeSync] - "+a+' must be of type "Object", "Array" or "string"')}function g(a){var b=Object.keys(a).map(function(a){var b=a.match(q+"__(.*?).meta");return null!==b?b[1]:void 0});return b.filter(Boolean)}function h(a){var b=0;if(0===a.length)return b;for(var c=0;c<a.length;c++){var d=a.charCodeAt(c);b=(b<<5)-b+d,b&=b}return b}function i(a,c){var e=null;if(null!==a){var g=f(a);e=d(g)}p.get(e,function(a){var d=b(a);c(d)})}function j(b,c){if(null===b||"string"==typeof b||"Array"===b.constructor.name)p.set(b,c);else{var e=a(b,s),g=f(e),h=d(f(b)),i=h.filter(function(a){return g.indexOf(a)<0});p.remove(i),p.set(e,c)}}function k(a,b){if(null===a)p.remove(null,b);else{var c=d(f(a));p.remove(c,b)}}function l(a,b){if(null===a)p.getBytesInUse(null,b);else{var c=d(f(a));p.getBytesInUse(c,b)}}function m(a){p.clear(a)}function n(){return q}function o(a){q=a}if("undefined"==typeof chrome.storage||"undefined"==typeof chrome.storage.sync)throw Error('[largeSync] - chrome.storage.sync is undefined, check that the "storage" permission included in your manifest.json');var p=chrome.storage.sync,q="LS",r=p.QUOTA_BYTES,s=p.QUOTA_BYTES_PER_ITEM,t="0.0.4",u={QUOTA_BYTES:r,QUOTA_BYTES_PER_ITEM:r,QUOTA_BYTES_PER_KEY:s,MAX_ITEMS:p.MAX_ITEMS,MAX_WRITE_OPERATIONS_PER_HOUR:p.MAX_WRITE_OPERATIONS_PER_HOUR,MAX_WRITE_OPERATIONS_PER_MINUTE:p.MAX_WRITE_OPERATIONS_PER_MINUTE,VERSION:t,get:i,set:j,remove:k,getBytesInUse:l,clear:m,_core:{split:a,reconstruct:b,utils:{basicHash:h,getKeys:f,extractKeys:g,getStorageKey:c,getRequestKeys:d}},_config:{getkeyPrefix:n,setkeyPrefix:o}};return window.chrome.storage.onChanged.addListenerlargeSync=function(a){},window.chrome.storage.largeSync=u,u}();var LZString=function(){function a(a,b){if(!e[a]){e[a]={};for(var c=0;c<a.length;c++)e[a][a.charAt(c)]=c}return e[a][b]}var b=String.fromCharCode,c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={},f={compressToBase64:function(a){if(null==a)return"";var b=f._compress(a,6,function(a){return c.charAt(a)});switch(b.length%4){default:case 0:return b;case 1:return b+"===";case 2:return b+"==";case 3:return b+"="}},decompressFromBase64:function(b){return null==b?"":""==b?null:f._decompress(b.length,32,function(d){return a(c,b.charAt(d))})},compressToUTF16:function(a){return null==a?"":f._compress(a,15,function(a){return b(a+32)})+" "},decompressFromUTF16:function(a){return null==a?"":""==a?null:f._decompress(a.length,16384,function(b){return a.charCodeAt(b)-32})},compressToUint8Array:function(a){for(var b=f.compress(a),c=new Uint8Array(2*b.length),d=0,e=b.length;e>d;d++){var g=b.charCodeAt(d);c[2*d]=g>>>8,c[2*d+1]=g%256}return c},decompressFromUint8Array:function(a){if(null===a||void 0===a)return f.decompress(a);for(var c=new Array(a.length/2),d=0,e=c.length;e>d;d++)c[d]=256*a[2*d]+a[2*d+1];var g=[];return c.forEach(function(a){g.push(b(a))}),f.decompress(g.join(""))},compressToEncodedURIComponent:function(a){return null==a?"":f._compress(a,6,function(a){return d.charAt(a)})},decompressFromEncodedURIComponent:function(b){return null==b?"":""==b?null:(b=b.replace(/ /g,"+"),f._decompress(b.length,32,function(c){return a(d,b.charAt(c))}))},compress:function(a){return f._compress(a,16,function(a){return b(a)})},_compress:function(a,b,c){if(null==a)return"";var d,e,f,g={},h={},i="",j="",k="",l=2,m=3,n=2,o=[],p=0,q=0;for(f=0;f<a.length;f+=1)if(i=a.charAt(f),Object.prototype.hasOwnProperty.call(g,i)||(g[i]=m++,h[i]=!0),j=k+i,Object.prototype.hasOwnProperty.call(g,j))k=j;else{if(Object.prototype.hasOwnProperty.call(h,k)){if(k.charCodeAt(0)<256){for(d=0;n>d;d++)p<<=1,q==b-1?(q=0,o.push(c(p)),p=0):q++;for(e=k.charCodeAt(0),d=0;8>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}else{for(e=1,d=0;n>d;d++)p=p<<1|e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e=0;for(e=k.charCodeAt(0),d=0;16>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}l--,0==l&&(l=Math.pow(2,n),n++),delete h[k]}else for(e=g[k],d=0;n>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1;l--,0==l&&(l=Math.pow(2,n),n++),g[j]=m++,k=String(i)}if(""!==k){if(Object.prototype.hasOwnProperty.call(h,k)){if(k.charCodeAt(0)<256){for(d=0;n>d;d++)p<<=1,q==b-1?(q=0,o.push(c(p)),p=0):q++;for(e=k.charCodeAt(0),d=0;8>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}else{for(e=1,d=0;n>d;d++)p=p<<1|e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e=0;for(e=k.charCodeAt(0),d=0;16>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}l--,0==l&&(l=Math.pow(2,n),n++),delete h[k]}else for(e=g[k],d=0;n>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1;l--,0==l&&(l=Math.pow(2,n),n++)}for(e=2,d=0;n>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1;for(;;){if(p<<=1,q==b-1){o.push(c(p));break}q++}return o.join("")},decompress:function(a){return null==a?"":""==a?null:f._decompress(a.length,32768,function(b){return a.charCodeAt(b)})},_decompress:function(a,c,d){var e,f,g,h,i,j,k,l,m=[],n=4,o=4,p=3,q="",r=[],s={val:d(0),position:c,index:1};for(f=0;3>f;f+=1)m[f]=f;for(h=0,j=Math.pow(2,2),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1;switch(e=h){case 0:for(h=0,j=Math.pow(2,8),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1;l=b(h);break;case 1:for(h=0,j=Math.pow(2,16),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1;l=b(h);break;case 2:return""}for(m[3]=l,g=l,r.push(l);;){if(s.index>a)return"";for(h=0,j=Math.pow(2,p),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1;switch(l=h){case 0:for(h=0,j=Math.pow(2,8),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1;m[o++]=b(h),l=o-1,n--;break;case 1:for(h=0,j=Math.pow(2,16),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1;m[o++]=b(h),l=o-1,n--;break;case 2:return r.join("")}if(0==n&&(n=Math.pow(2,p),p++),m[l])q=m[l];else{if(l!==o)return null;q=g+g.charAt(0)}r.push(q),m[o++]=g+q.charAt(0),n--,g=q,0==n&&(n=Math.pow(2,p),p++)}}};return f}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

let userData = {
  OPTIONS: {
    HISTORY_LENGTH: 20,
    POPUP_HISTORY_LENGTH: 3,
  },
  HISTORY: [],
  SERIES: {},
};

// userData:
// {
//   HISTORY: [
//     {
//       seriesId: 'string',
//       episodeTitle: 'string',
//       episodeUrl: 'string',
//       lastVisit: 'date string',
//     },
//   ],
//   SERIES: {
//     series-name: {
//       seriesTitle: 'string',
//       seriesUrl: 'string',
//       episodeTitle: 'string',
//       episodeUrl: 'string',
//       lastVisit: 'date string',
//       favorite: 'boolean',
//       seelater: 'boolean',
//       completed: 'boolean'
//     }
//   }
// }

function updateEpisode(requestData) {
  const {
    id,
    seriesTitle,
    seriesUrl,
    episodeTitle,
    episodeUrl,
  } = requestData;
  if (!id) {
    return;
  }
  if (!userData.SERIES[id]) {
    userData.SERIES[id] = {};
  }
  let info = {};
  const lastVisit = new Date().toString();
  if (!episodeUrl) {
    // series page
    info = {
      seriesTitle,
      seriesUrl,
      lastVisit,
    };
  } else {
    // episode page
    info = {
      seriesTitle,
      seriesUrl,
      episodeTitle,
      episodeUrl,
      lastVisit,
    };
  }
  userData.SERIES[id] = Object.assign({}, userData.SERIES[id], info);

  // add history data
  const historyData = {
    seriesId: id,
    episodeTitle,
    episodeUrl,
    lastVisit,
  };
  const latestHistoryItem = userData.HISTORY[0];
  if (!latestHistoryItem || latestHistoryItem.seriesId !== historyData.seriesId || latestHistoryItem.episodeTitle !== historyData.episodeTitle) {
    userData.HISTORY.unshift(historyData);
    if (userData.HISTORY.length > userData.OPTIONS.HISTORY_LENGTH) {
      userData.HISTORY = userData.HISTORY.slice(0, userData.OPTIONS.HISTORY_LENGTH);
    }
  }
}

function toggleSeeLater(requestData) {
  const {
    id,
  } = requestData;
  if (!id || !userData.SERIES[id]) {
    return;
  }
  userData.SERIES[id].seelater = !userData.SERIES[id].seelater;
}

function toggleFavorite(requestData) {
  const {
    id,
  } = requestData;
  if (!id || !userData.SERIES[id]) {
    return;
  }
  userData.SERIES[id].favorite = !userData.SERIES[id].favorite;
}

function toggleCompleted(requestData) {
  const {
    id,
  } = requestData;
  if (!id || !userData.SERIES[id]) {
    return;
  }
  userData.SERIES[id].completed = !userData.SERIES[id].completed;
}

function updateOptions(requestData) {
  const {
    name,
    value,
  } = requestData;
  if (!name || !userData.OPTIONS[name]) {
    return;
  }
  userData.OPTIONS[name] = value;
}

function importData(requestData) {
  if (!requestData) {
    return;
  }
  userData = requestData;
}

function onMessage(request) {
  try {
    // retrieve extension's user data
    chrome.storage.largeSync.get(['data'], (currentData) => {
      if (chrome.runtime.error) {
        alert('[ERROR] User data cannot be read.');
        return false;
      }
      // save data locally
      Object.assign(userData, currentData.data);
      // check if request exists and has an 'action' attribute
      if (!request && !request.action) {
        alert('[ERROR] Request not valid.');
        return false;
      }
      const requestData = Object.assign({}, request.data);
      // do the requested action
      switch (request.action) {
        case 'VIEW':
          updateEpisode(requestData);
          break;
        case 'TOGGLE':
          switch (requestData.attribute) {
            case 'favorite':
              toggleFavorite(requestData);
              break;
            case 'seelater':
              toggleSeeLater(requestData);
              break;
            case 'completed':
              toggleCompleted(requestData);
              break;
            default:
              alert('[ERROR] Unknown attribute.');
              break;
          }
          break;
        case 'OPTIONS':
          updateOptions(requestData);
          break;
        case 'IMPORT':
          importData(requestData);
          break;
        default:
          alert('[ERROR] Unknown request type.');
          return false;
      }
      // persist extension's data
      chrome.storage.largeSync.set({
        data: userData,
      }, () => {
        if (chrome.runtime.error) {
          return false;
        }
        chrome.runtime.sendMessage({
          action: 'REFRESH',
        });
        return true;
      });
      return true;
    });
  } catch (e) {
    alert(`[ERROR] ${e}`);
  }
  return false;
}

chrome.runtime.onMessage.addListener(onMessage);
