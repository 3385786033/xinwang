<template>
    <div class="Comment">
      <div class="nav">
        <mu-tabs :value.sync="active" color="green" indicator-color="yellow" full-width class="navHead">
          <mu-tab v-for="(item,index) in navVal"
                  :key="item.id"
                  @click="goPage(index)">{{ item.title }}
          </mu-tab>
        </mu-tabs>
        <div class="follow" @click="appointment">
          <p>
            <i class="icon iconfont icon-icon-test" v-if="isIs"></i>
            <i class="icon iconfont icon-xuanze" v-else></i>
            {{ yuyue }}
          </p>
        </div>
      </div>
      <!--评论-->
      <div class="commentMsg"  v-if="active === 0">
        <div class="msgTop">
          <div class="liveMsg" :z-depth="1">
              <mu-container class="demo-loadmore-content" ref="container">
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading">
                  <mu-list>
                    <div class="user_cont" v-for="(item,index) in commentData" style="overflow: hidden;margin-top: 10px">
                      <div class="user_Head">
                        <div class="user_Head_a">
                          <img :src="item.user.avatar?item.user.avatar:require('../assets/images/touxiang.png')" alt="">
                        </div>
                      </div>
                      <div class="cont">
                        <i class="type-icon" v-if="false">房管</i>
                        <span class="user_name">
                          {{ item.user.nickname }}
                          </span>
                        <div class="msg-content">
                          {{ item.body }}
                        </div>
                      </div>
                    </div>
                  </mu-list>
                </mu-load-more>
              </mu-container>
          </div>
        </div>
      </div>
      <div class="msgBottom" v-if="isSend">
        <div class="input">
            <input type="search" class="inputmsg" v-if="isLogin" v-model="sendVal" @blur="blurClick" @focus="inputCilick()" ref="inputBtn">
            <p class="loginP" @click="Login" v-else>登陆后可以参与直播评论</p>
        </div>
        <div class="sendMsg" @click="sendMsg">
          <div class="liwu" v-if="false">
            <i class="icon iconfont icon-liwu"></i>
          </div>
          <div class="WeChatShare">
            发送
          </div>
        </div>
      </div>
      <!--评论 End-->

      <!--产品-->
      <div class="product"
           v-if="active === 2"
           data-mu-loading-color="secondary"
           data-mu-loading-overlay-color="rgba(0, 0, 0, .7)"
           v-loading="loadingVlg">
        <ul>
          <li v-for="(item,index) in table" :key="index">
            <a class="productCot" href="javascript:;" >
              <div class="productCotLeft">
                <div class="proImg">
                  <img :src="item.cover" :alt="item.title">
                </div>
              </div>
              <div class="productCotRight">
                <p class="Ptitle">{{item.title}}</p>
                <div class="play">
                  <div class="Price">
                    <div class="PriceBrief">
                      <p v-html="item.body"></p>
                    </div>
                    <p class="priceNum"><i>￥</i>{{item.price}} <!--<span>￥122</span>--></p>
                  </div>
                  <div class="NumSpee">
                    <div class="NumSpeeInfo" @click="setOrder(item)" v-if="item.state">
                      <p>去抢购</p>
                    </div>
                    <div class="NumSpeeInfo" v-else>
                      <p>已下架</p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <!--产品End-->
      <!--介绍-->
      <div class="introduce"  v-if="active === 1">
        <div v-html="content.live.body" class="introduce_vont">

        </div>
      </div>
      <!--介绍 end-->
    </div>
</template>

<script>
  //评论
  import { Toast  } from 'mint-ui';
  //心跳重连
  export default {
    name: "Comment",
    data () {
      return {
        isLogin: true,
        loadingVlg: false,
        table: [],
        isProduct: false,
        isComment: true,
        isIntroduce: false,
        navVal: [
          {
            id:0,
            title:'现场互动'
          },
          {
            id:1,
            title:'组织介绍'
          },
          {
            id:2,
            title:'产品列表'
          }
        ],
        active: 0,
        checkIndex: 0,
        //评论
        commentData: [],
        //评论内容
        sendVal: '',
        isIs: true,
        yuyue: '',
        //是否显示发送按钮
        isSend: true,
        isShou: false,
        //列表
        num: 20,
        refreshing: false,
        loading: false,
        //websocket
        ws: null,
        lockReconnect: false,  //是否建立真正连接
        timeoutnum: null,
        heartChecks: {},
      }
    },
    props: {
      liveId: Number,
      content: Object
    },
    methods: {
      //导航切换
      goPage(index) {
        this.checkIndex = index;
        let that = this
        switch (parseInt(index)) {
              case 0:
                this.isSend = true
                    break;
              case 1:
                this.isSend = false
                    break;
              case 2:
                this.isSend = false
                this.loadingVlg = true
                this.$axios.get('/zyapp.test.xw518.com/public/live/home/goods/lists',{
                  params:{
                    live_id: this.$route.query.id
                  }
                }).then((response)=>{
                  that.table = response.data.data
                  that.loadingVlg = false;
                })
                break;
              default:
                return false
            }
      },
      //发送评论
      sendMsg() {
        var that = this
        if(this.sendVal === ''){
          Toast('请输入内容！');
        }else {
          this.$axios.post('/zyapp.test.xw518.com/public/live/user/chat/send',{
            live_id:this.$route.query.id,
            type:1,
            body: this.sendVal
          }).then((response)=>{
            if(response.data.status === 1){
              that.sendVal = ''
            }else {
              Toast('发送失败！');
            }
          })
        }
      },
      inputCilick() {
        setTimeout(()=>{
          let pannel=this.$refs.inputBtn;
          //让当前的元素滚动到浏览器窗口的可视区域内
          pannel.scrollIntoView(true);
          //此方法是标准的scrollIntoView()方法的专有变体
        },300)
      },
      blurClick() {
        this.isShou = false
      },
      //预约
      appointment() {
        //登录
        if(localStorage.getItem('authstrLogin') === null){
          Toast('请登录！');
          setTimeout(function () {
            window.location.href = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/login'
          },1000)
        }else {
          var test =encodeURIComponent(window.location.href);
          let ua = window.navigator.userAgent.toLowerCase();
          if(ua.indexOf( 'micromessenger' ) > -1) {
            window.location.href = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public//live/home/wechat/subscribe?live_id='+this.$route.query.id+'&redirect_url='+test
          }else {
            this.$axios.post('/zyapp.test.xw518.com/public/live/user/live/subscribe',{
              live_id: this.$route.query.id}).then((response)=>{
              if(response.data.status === 1){
                this.isIs = false
                this.yuyue = '已关注'
                Toast(response.data.message);
              }else {
                this.isIs = true
                this.yuyue = '关注'
              }
            })}
        }
      },
      GetUrlParam(paraName) {
        var url = document.location.toString();
        var arrObj = url.split("?");
        if (arrObj.length > 1) {
          var arrPara = arrObj[1].split("&");
          var arr;

          for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
              return arr[1];
            }
          }
          return "";
        }
        else {
          return "";
        }
      },
      GetQueryString(name) {
        var reg=eval("/"+name+"/g");
        var r = window.location.search.substr(1);
        var flag=reg.test(r);
        if(flag){
          return true;
        }else{
          return false;
        }
      },
      //删除url参数
      funcUrlDel(names) {
        if(typeof(names)=='string'){
          names = [names];
        }
        var loca = window.location;
        var obj = {}
        var arr = loca.search.substr(1).split("&");
        //获取参数转换为object
        for(var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].split("=");
          obj[arr[i][0]] = arr[i][1];
        };
        //删除指定参数
        for(var i = 0; i < names.length; i++) {
          delete obj[names[i]];
        }
        //重新拼接url
        var url = loca.origin + loca.pathname + "?" + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        return url;
      },
      //滚动到底部
      scrollToBottom() {
        this.$nextTick(() => {
          var container = this.$refs.container;
          container.scrollTop = container.scrollHeight;
        })},
      //登录
      Login(){
        var test = encodeURIComponent(window.location.href);
        window.location.href = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/login?redirect_url='+ test
      },
      /**
       * 上拉。下拉
       */
      refresh () {
        this.refreshing = true;
        let that = this
        this.$refs.container.scrollTop = 0;
        this.$axios.get('/zyapp.test.xw518.com/public/live/home/chat/lists',{
          params:{
            live_id: this.$route.query.id,
            num: '20',
            pre_id: this.commentData[0].id
          }
        }).then((response)=>{
          for (let i = 0; i<response.data.data.items.length;i++){
            that.commentData.unshift(response.data.data.items[i])
          }
          setTimeout(() => {
            this.refreshing = false;
          }, 2000)
        })
      },
      /**
       * websocket
       */
      initWebSocket() {
        let wsurl = 'ws://192.168.65.74:10002'
        this.ws =new WebSocket(wsurl)
        this.ws.onmessage = this.websocketonmessage;
        this.ws.onclose = this.websocketclose;
        this.ws.onopen  = this.websocketOpen;
        //连接发生错误的回调方法
        this.ws.onerror = this.websocketOnerror
      },
      websocketonmessage(e) {
        let that = this
        let dataCont = JSON.parse(e.data)
        console.log(dataCont)
        this.heartChecks.reset().start()
        if(dataCont.event === "subscribe" && dataCont.scene === null){

        }else {
          if(dataCont.content.event === 'live.stop' && dataCont.content.event !== undefined){
            that.$emit('isEnd','0')
          }else if(dataCont.content.event === 'chat.removeitem' && dataCont.content.event !== undefined){
            let id = dataCont.content['data'].id
            that.commentData.splice(that.commentData.findIndex(item => item.id === id), 1);
          }else {
            that.commentData.push(dataCont.content['data'])
          }
        }
      },
      websocketOpen() {
        console.log('链接成功！')
        let data  = JSON.stringify({event: "subscribe",data: "xwapp.zy.live."+ this.$route.query.id})
        this.ws.send(data)
        this.heartChecks.start()
      },
      //关闭连接
      websocketclose(e) {
        //console.log(e)
        console.log('连接自动关闭');
        if(e.code !== 4500){
          this.reconnect();
        }
      },
      //重连
      reconnect() {
        let that = this
        if (that.lockReconnect) {
          return;
        };
        that.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        that.timeoutnum && clearTimeout(that.timeoutnum);
        that.timeoutnum = setTimeout(function() {
          that.initWebSocket()
          that.lockReconnect = false;
        }, 3000);
      },
      websocketOnerror (e){
        this.reconnect()
      },
      //下订单
      setOrder(val) {
        if(localStorage.getItem('authstrLogin') === null){
          Toast('请登录！');
          setTimeout(function () {
            var test =encodeURIComponent(window.location.href);
            window.location.href = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/login?redirect_url='+test
          },1000)
        }else {
          this.$router.push({name:'Order',query:{id:val.id}})
        }
      },
    },
    created() {
      this.$axios.get('/zyapp.test.xw518.com/public/live/home/chat/lists',{
        params:{
          live_id: this.$route.query.id,
          num: '20',
          pre_id: '99999999999'
        }
      }).then((response)=>{
        this.commentData = (response.data.data.items).reverse()
      })
      let that = this
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
            that.ws.send('')
            heartCheck.reset().start(); //发送任何消息都说明当前连接是正常的
          }, this.timeout);
        }
      }
      that.heartChecks = heartCheck
      this.initWebSocket();
    },
    mounted() {
      //登录
      if(this.GetQueryString('authstr')){
        localStorage.setItem("authstrLogin", JSON.stringify(this.GetUrlParam('authstr')));
        let url = window.location.protocol+'//'+window.location.host+window.location.pathname + window.location.hash
        window.location.href = url
      }else {

      }
      if(localStorage.getItem('authstrLogin') === null){
        this.isLogin = false
      }else {
        this.isLogin = true
      }
      //判断是否预约
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == "micromessenger") {
        let urlStr = window.location.search.split('?')
        if(urlStr[1] === '__action=confirm') {
          localStorage.setItem("__action", JSON.stringify(this.GetUrlParam('__action')));
          this.isIs = false
          this.yuyue = '已关注'
        }else {
          this.yuyue = '关注'
          this.isIs = true
        }
      }else {
        this.$axios.get('/zyapp.test.xw518.com/public/live/user/live/isSubscribe',{params:{id:this.$route.query.id}}).then((response)=>{
          if(response.data.data.subscribe == true){
            this.isIs = false
            this.yuyue = '已关注'
          }else {
            this.yuyue = '关注'
            this.isIs = true
          }
        })
      }
    },
    watch: {
      'commentData':{
        deep: true,
        handler: function (val, oldVal) {
          this.$nextTick(() => {
           // this.commentData = oldVal
            var container = this.$refs.container;
            container.scrollTop = container.scrollHeight;
          })}
      }
    },
    destroyed() {
      console.log('离开了页面')
      this.ws.onclose = false;
    }
  }
</script>

<style scoped lang="scss">
  *{
    -webkit-overflow-scrolling: touch;
  }
  .Comment{
    height:60%;
    width: 100%;
    .nav{
      width: 100%;
      overflow: hidden;
      background-color: #002b3f;
      .navHead{
        width: 80%;
      }
      .follow{
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        p{
          margin: 0;
        }
      }
    }
    .commentMsg{
      height: 88%;
      width: 100%;
      overflow: hidden;
      padding-bottom: 50px;
      position: relative;
      .msgTop{
        height: 100%;
        width: 100%;
        .liveMsg{
          width: 100%;
          height:100%;
          background-color: #f2f2f2;
          display: flex;
          flex-direction: column;
          .user_cont{
            word-break: break-all;
            word-wrap: break-word;
            width: auto;
            margin: .3rem .5rem;
            overflow: hidden;
            -webkit-overflow-scrolling: touch;
            .user_Head{
              width: 7%;
              float: left;
              .user_Head_a{
                height: 40px;
                width: 40px;
                border-radius: 50%;
                img{
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .cont{
                      width: 93%;
                      overflow: hidden;
                      float: left;
                      .type-icon{
                        display: inline-block;
                        margin: .1rem .1rem 0 0;
                        height: 1rem;
                        line-height: 1rem;
                        padding: 0 .5rem;
                        font-style: normal;
                        font-size: 12px;
                        color: #fff;
                        background-color: #fca851;
                      }
                      .msg-content{
                        font-size: 12px;
                        margin-left: 10px;

                        word-break: break-all;
                        word-wrap: break-word;
                      }
                      .user_name{
                        color: #a1a1a1;
                        font-size: 14px;
                        display: block;
                        max-width: 200px;
                        text-overflow: ellipsis;
                        margin-left: 10px;
                        word-break: normal;
                      }
                    }
          }
          .demo-loadmore-content {
            flex: 1;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      }
    }
    .msgBottom{
      position: fixed;
      bottom: 0;
      height: 50px;
      width: 640px;
      box-sizing: border-box;
      padding: 7px 14px;
      background-color: #fff;
      .input{
          width: 70%;
          height: 36px;
          float: left;
          box-sizing: border-box;
          overflow: hidden;
          line-height: 50px;
          border: none;
          border-radius: 20px;
          padding-left: 10px;
          background-color: #f4f4f4;
          input{
            outline: none;
            border: none;
            height: 36px;
            width: 100%;
            box-sizing: border-box;
            float: left;
            line-height: 36px;
            background-color: #f4f4f4;
            font-size: 14px;
            color: #999;
          }
          .loginP{
            line-height: 36px;
            font-size: 14px;
            color: #999999;
            text-align: center;
          }
        }
      .sendMsg{
          width: 30%;
          height: 100%;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover{
            cursor: pointer;
          }
          .liwu{
            margin:0 5px;
            i{
              font-size: 26px;
              color: #f1b0b7;
            }
          }
          .WeChatShare{
            font-size: 14px;
            color: #3dc060;
          }
        }
    }
       /* 产品*/
    .product{
      height: 90%;
      width: 100%;
      overflow-y: scroll;
      position: relative;
      background-color: #f9f7f7;
      ul{
                padding: 0;
              overflow: hidden;
                width: 100%;
                height: auto;
                li{
                    margin: 1rem 0;
                    padding: 0 1rem;
                    height: 8rem;
                    width: 100%;
                    list-style: none;
                    border-radius: 5px;
                    background-color: #fff;
                    .productCot{
                        display: block;
                        width: 100%;
                        height: 100%;
                        .productCotLeft{
                            float: left;
                            width: 30%;
                            height: 100%;
                            border-radius: 5px;
                            .proImg{
                                width: 100%;
                                height: 100%;
                                overflow: hidden;
                                border-radius: 5px;
                                img{
                                    display: block;
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 5px;
                                }
                            }
                        }
                        .productCotRight{
                            padding-left: 1rem;
                            float: left;
                            width: 70%;
                            height: 100%;
                            .Ptitle{
                                text-align: left;
                                margin: .5rem 0;
                                color: black;
                                font-size: 18px;
                                font-weight: 400;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space:nowrap;
                            }
                            .play{
                                width: 100%;
                                height: 60%;
                                position: relative;
                                .Price{
                                    width: 50%;
                                    height: 100%;
                                    float: left;
                                    .PriceBrief{
                                        width: 100%;
                                        font-size: 12px;
                                        height: 2rem;
                                        color: #666;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        word-break: break-all;
                                        white-space: normal;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient:vertical ;
                                        p{
                                            height: 100%;
                                            width: 100%;
                                        }
                                    }
                                    .priceNum{
                                        color: red;
                                        margin: 0;
                                        position: absolute;
                                        bottom: 0;
                                        padding-left: 1rem;
                                        font-size: 20px;
                                        i{
                                            font-size: 12px;
                                            color: red;
                                            font-style: normal;
                                        }
                                        span{
                                            text-decoration: line-through;
                                            color: #666;
                                            font-size: 12px;
                                        }
                                    }
                                }
                                .NumSpee{
                                    width: 50%;
                                    height: 100%;
                                    float: left;
                                    .NumSpeeInfo{
                                        width: 80%;
                                        height: 50%;
                                        background-color: red;
                                        border-radius: 5px;
                                        color: #fff;
                                      text-align: center;
                                        margin: 0 auto;
                                        margin-top: 1rem;
                                        p{
                                            font-size: 14px;
                                            font-weight: 400;
                                            padding-top: .5rem;
                                            font-family: 'Avenir', Helvetica, Arial, sans-serif;
                                            letter-spacing: 1px;
                                            &:hover{
                                                cursor: pointer;
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
    }
      /*介绍*/
    .introduce{
      width: 100%;
      height: 24rem;
      overflow-y: scroll;
    }
  }
  @media(max-width: 767px) {
      .Comment{
        height: 60%;
        width: 100%;
        .nav{
          width: 100%;
          overflow: hidden;
          background-color: #002b3f;
          .navHead{
            width: 80%;
          }
          .follow{
            width: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            p{
              margin: 0;
            }
          }
        }
        .commentMsg{
          height: 87%;
          width: 100%;
          padding-bottom: 50px;
          .msgTop{
            height: 100%;
            width: 100%;
            .liveMsg{
              width: 100%;
              height:100%;
              background-color: #f2f2f2;
              display: flex;
              flex-direction: column;
              .user_cont{
                word-break: break-all;
                word-wrap: break-word;
                width: auto;
                overflow: hidden;
                margin: .3rem .5rem;
                .user_Head{
                  float: left;
                  width: 10%;
                  .user_Head_a{
                    height: 40px;
                    width: 40px;
                    overflow: hidden;
                    img{
                      display: block;
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
                .cont{
                  width: 88%;
                  overflow: hidden;
                  float: left;
                  .type-icon{
                    display: inline-block;
                    margin: .1rem .1rem 0 0;
                    height: 1rem;
                    line-height: 1rem;
                    padding: 0 .5rem;
                    font-style: normal;
                    font-size: 12px;
                    color: #fff;
                    background-color: #fca851;
                  }
                  .msg-content{
                    font-size: 12px;
                    margin-left: 10px;
                    word-break: break-all;
                    word-wrap: break-word;
                    color: #000000;
                    position: relative;
                    &::before{
                      ontent: "";
                      position: absolute;
                      top: .5rem;
                      left: -.4rem;
                      width: 5px;
                      height: 7px;
                      // background: url(../images/common-sprite.png) -349px -108px no-repeat;
                      background-size: 427px;
                    }
                  }
                  .user_name{
                    display: block;
                    max-width: 200px;
                    text-overflow: ellipsis;
                    margin-left: 10px;
                    word-break: normal;
                    color: #a1a1a1;
                    font-size: 14px;
                  }
                }

              }
              .demo-loadmore-content {
                flex: 1;
                overflow: scroll;
                -webkit-overflow-scrolling: touch;
              }
            }
          }
        }
        .msgBottom{
          position: fixed;
          bottom: 0;
          height: 50px;
          width: 100%;
          box-sizing: border-box;
          padding: 7px 14px;
          background-color: #fff;
          .input{
            width: 80%;
            height: 36px;
            box-sizing: border-box;
            float: left;
            overflow: hidden;
            line-height: 36px;
            border: none;
            border-radius: 20px;
            background-color: #f4f4f4;
            input{
              outline: none;
              border: none;
              height: 36px;
              width: 100%;
              line-height: 36px;
              background-color: #f4f4f4;
              font-size: 14px;
              color: #999;
            }
            .loginP{
              line-height: 36px;
              font-size: 14px;
              color: #999999;
              text-align: center;
            }
          }
          .sendMsg{
            width: 20%;
            height: 100%;
            float: left;
            display: flex;
            justify-content: center;
            align-items: center;
            .liwu{
              margin:0 5px;
              i{
                font-size: 26px;
                color: #f1b0b7;
              }
            }
            .WeChatShare{
              font-size: 14px;
              color: #3dc060;
            }
          }
        }
        /* 产品*/
        .product{
          height: 90%;
          width: 100%;
          overflow-y: scroll;
          position: relative;
          background-color: #f9f7f7;
          ul{
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: auto;
            li{
              margin: 1rem 0;
              padding: 0 1rem;
              height: 8rem;
              width: 100%;
              list-style: none;
              border-radius: 5px;
              background-color: #fff;
              .productCot{
                display: block;
                width: 100%;
                height: 100%;
                .productCotLeft{
                  float: left;
                  width: 30%;
                  height: 100%;
                  border-radius: 5px;
                  .proImg{
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 5px;
                    img{
                      display: block;
                      width: 100%;
                      height: 100%;
                      border-radius: 5px;
                    }
                  }
                }
                .productCotRight{
                  padding-left: 1rem;
                  float: left;
                  width: 70%;
                  height: 100%;
                  .Ptitle{
                    text-align: left;
                    margin: .5rem 0;
                    color: black;
                    font-size: 18px;
                    font-weight: 400;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space:nowrap;
                  }
                  .play{
                    width: 100%;
                    height: 60%;
                    position: relative;
                    .Price{
                      width: 50%;
                      height: 100%;
                      float: left;
                      .PriceBrief{
                        width: 100%;
                        font-size: 12px;
                        height: 2rem;
                        color: #666;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        word-break: break-all;
                        white-space: normal;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient:vertical ;
                        p{
                          height: 100%;
                          width: 100%;
                        }
                      }
                      .priceNum{

                        color: red;
                        margin: 0;
                        position: absolute;
                        bottom: 0;
                        padding-left: 1rem;
                        font-size: 20px;
                        i{
                          font-size: 12px;
                          color: red;
                          font-style: normal;
                        }
                        span{
                          text-decoration: line-through;
                          color: #666;
                          font-size: 12px;
                        }
                      }
                    }
                    .NumSpee{
                      width: 50%;
                      height: 100%;
                      float: left;
                      .NumSpeeInfo{
                        text-align: center;
                        width: 80%;
                        height: 50%;
                        background-color: red;
                        border-radius: 5px;
                        color: #fff;
                        margin: 0 auto;
                        margin-top: 1rem;
                        p{
                          font-size: 14px;
                          font-weight: 400;
                          padding-top: .5rem;
                          font-family: 'Avenir', Helvetica, Arial, sans-serif;
                          letter-spacing: 1px;
                          &:hover{
                            cursor: pointer;
                          }
                        }

                      }
                    }
                  }
                }
              }
            }
          }
        }
        /*介绍*/
        .introduce{
          width: 100%;
          height: 100%;
          overflow: scroll;
          -webkit-overflow-scrolling: touch;
          .introduce_vont{
            padding: 10px 20px;
            p{

            }
          }

        }
      }

    }
</style>
