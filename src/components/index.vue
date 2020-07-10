<template>
  <div class="Index">
    <header class="head" id="head">
        <div class="homepage">
          <a href="javascript:;" @click="returnHome">
            <i class="icon iconfont icon-fanhui"></i>
          </a>
        </div>
        <div class="title"></div>
        <div class="share">
          <i class="icon iconfont icon-renshu"></i>&nbsp;
          <span>{{number}}</span>
        </div>
      </header>
    <div class="videoPlay" id="videoPlayCont"
         ref="video"
         @mouseover="mouseOver"
         @mouseleave="mouseLeave"
         @touchstart="touchStart"
         @touchend="touchEnd">
      <div class="prism-player" :id="playerId" ref="playerVideo"></div>
      <div class="bgTime" ref="timeVideo">
        <div class="h"><p>距离直播还有 {{timeVal.d}}天 {{timeVal.h}}时 {{timeVal.m}}分 {{timeVal.s}}秒</p></div>
      </div>
      <div class="bgTime" ref="overVideo">
        <div class="h">
          <p>直播已结束。。。</p>
        </div>
      </div>
    </div>
    <Comment :idData="liveId" :content="contentData" @isEnd="is_end"></Comment>
  </div>
</template>
<script>
  //评论
  import Comment from '../page/Comment.vue'
  import '../assets/js/aliplayercomponents-1.0.5.min'
  //微信分享
  import wx from 'weixin-js-sdk'
export default {
  name: 'Index',
  data () {
    return {
      //直播id
      liveId: null,
      //人物信息
      infosData: {},
      //评论消息
      contentData: {},
      //直播显示
      isState: null,
      cover: null,  /*封面*/
      timeVal: {
        d:'',
        h: '',
        m: '',
        s: '',
      },
      startTime: '',
      isEnd: false,
      //视频
      playerId: 'video',
      //是否直播结束
      //房间人数
      number: 0,
      setTimeline: null
    }
  },
  components: {
     Comment
  },
  computed:{

  },
  methods: {
    mouseOver() {
      document.getElementById('head').style.opacity = '1'
    },
    mouseLeave() {
      setTimeout(function () {
        document.getElementById('head').style.opacity = '0'
      },10000)
    },
    touchStart() {
      document.getElementById('head').style.opacity = '1'
    },
    touchEnd() {
      setTimeout(function () {
        document.getElementById('head').style.opacity = '0'
      },10000)
    },
    //返回主页
    returnHome (){
      this.$router.push({name:'Home'})
    },
    //直播倒计时
    countTime() {
      let that = this
      let interval = setInterval(function(){
        let date = new Date(that.startTime) - new Date(); //计算剩余的毫秒数
        if (date < 0) {
          that.isEnd = true;
          that.timeVal = {
            d: "00",
            h: "00",
            s: "00",
            m: "00"
          };
          clearInterval(interval);
          that.setVideo('1')
          that.$refs.overVideo.style.display = 'none'
          that.$refs.playerVideo.style.display = 'block'
          that.$refs.timeVideo.style.display = 'none'
        } else {
          that.timeVal.d = parseInt(date / 1000 / 60 / 60 / 24, 10); //计算剩余的天
          if (that.timeVal.d < 10) {
            that.timeVal.d = "0" + that.timeVal.d;
          }
          that.timeVal.h = parseInt((date / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
          if (that.timeVal.h < 10) {
            that.timeVal.h = "0" + that.timeVal.h;
          }
          that.timeVal.m = parseInt((date / 1000 / 60) % 60, 10); //计算剩余的分钟
          if (that.timeVal.m < 10) {
            that.timeVal.m = "0" + that.timeVal.m;
          }
          that.timeVal.s = parseInt((date / 1000) % 60, 10); //计算剩余的秒数
          if (that.timeVal.s < 10) {
            that.timeVal.s = "0" + that.timeVal.s;
          }
          return that.timeVal.d + that.timeVal.h + that.timeVal.m + that.timeVal.s;
        }
      }, 1000);
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '/';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
      var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
      return Y+M+D+h+m+s;
    },
    //设置直播
    setVideo (val) {
      let that = this
      let url = 'http://ivi.bupt.edu.cn/hls/cctv1.m3u8'
      this.$nextTick(()=>{
        var player = new Aliplayer({
          id: this.playerId,
          width: '100%',
          videoWidth: '100%',
          height: '100%',
          autoplay: true,
          preload: true,
          cover: this.cover,
          isLive: true,
          source : 'http://zhibo.xw518.com/zhibo/'+this.$route.query.id+'.m3u8',
          useH5Prism: true,
          // x5_type: 'h5',
          x5_fullscreen: true,
          x5_orientation: 'landscape',
          playsinline: true,
          rePlay: true,
          x5LandscapeAsFullScreen: true,
          controlBarVisibility: "click",
          useHlsPluginForSafari: true,
          skinLayout: [
            {
              "name": "bigPlayButton",
              "align": "blabs",
              "x": 30,
              "y": 80
            },
            {
              "name": "errorDisplay",
              "align": "tlabs",
              "x": 0,
              "y": 0
            },
            {
              "name": "infoDisplay"
            },
            {
              "name": "controlBar",
              "align": "blabs",
              "x": 0,
              "y": 0,
              "children": [
                {
                  "name": "liveDisplay",
                  "align": "tlabs",
                  "x": 15,
                  "y": 6
                },
                {
                  "name": "fullScreenButton",
                  "align": "tr",
                  "x": 10,
                  "y": 10
                },
                {
                  "name": "volume",
                  "align": "tr",
                  "x": 5,
                  "y": 10
                }
              ]
            }
            ]
        },function (player) {
          console.log('播放器创建好了。')
        })
        if(val === '1') {
          player.on('play',function (e) {
            // player.play()
          })
          player.on('pause',function () {
            //alert('停止播放')
            var u = navigator.userAgent;
            if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
              player.play()
            }
          })
          player.on('liveStreamStop',function(){
            that.isStart = '2'
            player.dispose();
            that.$refs.playerVideo.style.backgroundImage = "url("+that.cover+")"
            that.$refs.playerVideo.style.backgroundRepeat = "no-repeat"
            that.$refs.playerVideo.style.backgroundSize = "100%,100%"
            that.$refs.playerVideo.style.backgroundPosition = "center"
            //console.log(that.$refs.playerVideo)
            console.log('直播失败或直播已结束');
          });
          player.on('liveStreamStop',function () {
            player.dispose();
          })
          player.on('onM3u8Retry',function () {
            let uel = 'http://zhibo.xw518.com/zhibo/'+ that.$route.query.id+'.m3u8'
            //let  uel = url
            player.loadByUrl(uel,3000)
          })
        }else {
          player.dispose();
         // player = null
        }
      })
    },
    is_end(data) {
      let that = this
      if(parseInt(data) === 0) {
        that.$refs.overVideo.style.display = 'block'
        that.$refs.playerVideo.style.display = 'none'
        that.$refs.timeVideo.style.display = 'none'
        that.isStart = '2'
        that.setVideo('2')
      }else {
        that.$refs.overVideo.style.display = 'none'
        that.$refs.playerVideo.style.display = 'block'
        that.$refs.timeVideo.style.display = 'none'
        that.isStart = '1'
      }
    },
    //截取地址
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
    getNum() {
      this.$axios.get('/zyapp.test.xw518.com/public/live/home/live/onlineCount',{params:{live_id: this.$route.query.id}}).then((response)=>{
        if (response.data.status === 1){
          this.number = response.data.data
        }else {
          clearInterval(this.setTimeline)
        }
      })
    }
  },
  created() {
    let that = this
    //房间人数
    this.setTimeline = setInterval(function () {
      that.getNum()
    },5000)

   //检测

   //录播视频列表
   /*this.$axios.get('/zyapp.test.xw518.com/public/live/home/live/vodList',{
     params:{
       live_id: this.$route.query.id
     }
   }).then((response)=>{
     console.log(response)
   })*/
  },
  watch:{
    isState (newVal,oldVal) {
      console.log(oldVal)
      console.log(newVal)
    }
  },
  mounted() {
    let that = this
    const loading = this.$loading();
    //分享
    var url = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/zhibo/';
    let list = [
      'updateTimelineShareData',
      'updateAppMessageShareData',
    ]
    this.$axios.get('/zyapp.test.xw518.com/public/user/general/wechat/jsapi',{params:{api_list: list.toString(), share_url: url}}).then((response)=> {
      wx.config({
        debug: false, // 开启调试模式
        appId: response.data.data.appId, // 必填，公众号的唯一标识
        timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
        signature: response.data.data.signature, // 必填，签名，见附录1
        jsApiList: [
          'updateTimelineShareData',
          'updateAppMessageShareData',
        ] // 必填
      })
    })
    wx.ready(function () {
      wx.updateAppMessageShareData({
        title: that.contentData.live.title, // 分享标题
        link: 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/zhibo', // 分享链接
        imgUrl: that.contentData.live.cover, // 分享图标
        desc: that.contentData.live.body, // 分享描述
        success() {
          // 用户成功分享后执行的回调函数
          // option.success()

        },
        cancel() {
          // 用户取消分享后执行的回调函数
          //option.error()
        }
      });
      wx.updateTimelineShareData({
         title: that.contentData.live.title, // 分享标题
         desc: that.contentData.live.body, // 分享描述
         link: 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/zhibo', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
         imgUrl: that.cover, // 分享图标(不能赋相对路径，一定要是绝对路径)
         success: () => {

         }
       })
    })
    this.$axios.get('http://xielei.test.xw518.com/zyapp.test.xw518.com/public/live/home/live/detail',{params:{id:this.$route.query.id}}).then((response)=>{
      loading.close();
      this.liveId = response.data.data.live.id
      this.cover = response.data.data.live.cover
      this.contentData = response.data.data
      this.startTime = this.timestampToTime(response.data.data.live.start_time)
      //判断直播是否结束
      if(parseInt(response.data.data.live.is_end) === 1) {
        //直播未结束
        let date = new Date(this.startTime) - new Date();
        if(date < 0){
         // this.isState = '1'
          that.$refs.overVideo.style.display = 'none'
          that.$refs.playerVideo.style.display = 'block'
          that.$refs.timeVideo.style.display = 'none'
          this.setVideo('1')
        }else {
         // this.isState = '0'
          that.$refs.overVideo.style.display = 'none'
          that.$refs.playerVideo.style.display = 'none'
          that.$refs.timeVideo.style.display = 'block'
          this.countTime()
        }
      }else {
        //直播已结束
        that.$refs.overVideo.style.display = 'block'
        that.$refs.playerVideo.style.display = 'none'
        that.$refs.timeVideo.style.display = 'none'
        //this.isState = '2'
      }

    })
  },
  destroyed() {
    clearInterval(this.setTimeline)
    this.mouseOver = false
    this.mouseLeave = false
    this.touchStart = false
    this.touchEnd = false
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @mixin Vertically{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .Index{
    position: relative;
    width: 100%;
    height: 100%;
    .head{
      opacity: 1;
      height: 5%;
      position: fixed;
      top: 0;
      -moz-transition: all 1s;
      -webkit-transition: all 1s;
      -o-transition:all 1s;
      z-index: 99999;
      width: 640px;
      background-color: rgba(0,0,0,.5);
      .homepage{
        height: 100%;
        width: 10%;
        box-sizing: border-box;
        float: left;
        @include Vertically;
        align-items: center;
        i{
          color: #f4f4f4;
          font-size: 18px;
        }
      }
      .title{
        width: 80%;
        height: 100%;
        @include Vertically;
        float: left;
        box-sizing: border-box;
      }
      .share{
        @extend .homepage;
        a{
          text-decoration: none;
          display: block;
          span{
            color: #fff;
            font-size: 14px;
        }

      }
      }

    }
    .videoPlay{
      height: 40%;
    }
    .prism-player{
      height: 100%;
    }
    .bgTime{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0,0,0,.5);
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      .h{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        p{
          color: #fff;
          font-size: 18px;
          span{
            color: #fff;
          }
        }
      }

    }
  }
  @media(max-width: 767px) {
    .Index{
      position: relative;
      width: 100%;
      height: 100%;
      .head{
        opacity: 1;
        height: 5%;
        position: fixed;
        top: 0;
        -moz-transition: all 1s;
        -webkit-transition: all 1s;
        -o-transition:all 1s;
        width: 100%;
        background-color: rgba(0,0,0,.5);
        .homepage{
          height: 100%;
          width: 10%;
          box-sizing: border-box;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          i{
            color: #f4f4f4;
            font-size: 18px;
          }
        }
        .title{
          width: 70%;
          height: 100%;
          @include Vertically;
          float: left;
          box-sizing: border-box;
        }
        .share{
          height: 100%;
          width: 20%;
          box-sizing: border-box;
          float: left;
          display: flex;
          justify-content: center;
          align-items: center;
          i{
            color: #f4f4f4;
            font-size: 18px;
          }
          span{
            color: #fff;
            font-size: 14px;
          }
        }
      }
      .videoPlay{
        height: 40%;
        .bgTime{
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0,0,0,.5);
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          .h{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            p{
              text-align: center;
              font-size: 20px;
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              span{
                color: #fff;
              }
            }
          }

        }
      }
      .prism-player{
        height: 100% !important;

        #video {
          object-fit: fill !important;
        }
      }

    }

  }
</style>
