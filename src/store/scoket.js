//import 'babel-polyfill'
var websock = null;
var fnss = {};
var globalCallback = null
function listen(fn, callback) {
  if (!fn) {
    fnss[fn] = [];
  }
  fnss[fn] = callback;
};
function initWebSocket() {
  let wsurl = 'ws://192.168.65.74:10002'
  try {
    if ('WebSocket' in window) {
      websock = new WebSocket(wsurl);
    } else if ('MozWebSocket' in window) {
      websock = new WebSocket(wsurl);
    } else {
      alert("您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！");
    }
    websock.onmessage = function(e) {
      websocketonmessage(e);
    }
    websock.onclose = function(e) {
      websocketclose(e);
    }
    websock.onopen = function() {
      websocketOpen();
      heartCheck.reset().start(); //发送任何消息都说明当前连接是正常的
    }
    //连接发生错误的回调方法
    websock.onerror = function() {
      // alert("WebSocket连接发生错误，请检查网络或联系开发人员！");
    }
  } catch (e) {
    reconnect();
  }
}
// 实际调用的方法
function sendSock(agentData, callback) {
  globalCallback = callback
  if (websock.readyState === websock.OPEN) {
    //若是ws开启状态
    if (callback) {
      let fn = 'fn_' + Math.random().toString(36).substr(2);
      agentData.scene = fn;
      window.fns[fn] = callback;
    }
    websocketsend(agentData)
  } else if (websock.readyState === websock.CONNECTING) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData, callback);
    }, 1000);
  } else {
    // 若未开启 ，则等待1s后重新调用
    setTimeout(function() {
      sendSock(agentData, callback);
    }, 1000);
  }
}
//数据接收
function websocketonmessage(e) {
  console.log(JSON.parse(e.data))
  globalCallback(JSON.parse(e.data))
}

//数据发送
function websocketsend(agentData) {
  websock.send(JSON.stringify(agentData));
}
//关闭
function websocketclose(e) {
  console.log(e, '关闭连接')
  reconnect(); //关闭后重连
}

function websocketOpen(e) {
  console.log("连接成功");
  /*let storage = JSON.parse(window.localStorage.getItem('authstr'))
  let autologin = {
    "event": "team.User.authLogin",
    "data": {
      "authstr": storage
    }
  }
  sendSock(autologin, getdata => {
    console.log(getdata)
    if (getdata.data.status == 1) {
      $store.commit('changeLogin', 1)
      $store.commit('currentInfo', getdata.data.team_id)
      delete fns[getdata.scene]
    }
  });*/
}
//心跳检测
let heartCheck = {
  timeout: 5000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function() {
    this.timeoutObj = setTimeout(function() {
      //这里发送一个心跳
      websock.send('')
      heartCheck.reset().start(); //发送任何消息都说明当前连接是正常的
    }, this.timeout);
  }
}
//断网重连
let tt;
let lockReconnect = false; //避免重复连接
function reconnect() {
  if (lockReconnect) {
    return;
  };
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  tt && clearTimeout(tt);
  tt = setTimeout(function() {
    initWebSocket();
    lockReconnect = false;
  }, 3000);
}
initWebSocket();
export {
  sendSock,
  listen
}
