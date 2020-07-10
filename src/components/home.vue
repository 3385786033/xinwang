<template>
    <div class="home">
      <header class="head">
        <div class="head_left"></div>
        <div class="head_right">
          <div class="login" v-if="isLogin" @click.stop="userClick">
            <img src="../assets/images/toux.png" alt="未登录">
          </div>
          <div class="login" v-else  @click.stop="userClick">
            <img :src="userInfo.avatar?userInfo.avatar:require('../assets/images/toux.png')" :alt="userInfo.nickname">
          </div>
        </div>
      </header>
      <div class="head_nav">
        <mu-tabs :value.sync="selected" inverse color="secondary" text-color="rgba(0, 0, 0, .54)" full-width>
          <mu-tab @click.native="AllSelect" id="0">全部</mu-tab>
          <mu-tab :id="val.id" v-for="(val, index, i) in navList" @click.native="select(val.id)" :key="i">{{ val.title }}</mu-tab>
        </mu-tabs>
      </div>
      <div class="content"
           data-mu-loading-color="secondary"
           data-mu-loading-overlay-color="rgba(0, 0, 0, .7)"
           v-loading="loadingVlg">
        <ul v-if="isData">
          <li v-for="(val, index, i) in table" @click="cloClick(val.id)">
            <a href="javascript:;">
              <div class="card">
                <div class="cardimg">
                  <img :src="val.cover" alt="">
                </div>
                <div class="cont">
                  <span>
                    <i class="icon iconfont icon-shipin"></i>
                    &nbsp;
                    {{ val.click }}次
                  </span>
                  <span>
                    <i class="icon iconfont icon-xiaoxi"></i>
                     &nbsp;55条
                  </span>
                </div>
              </div>
              <div class="title">
                <h3>{{val.title}}</h3>
                <div class="titleCont" v-html="val.body"></div>
                <div class="time_jiangshi">
                  <span><i class="icon iconfont icon-shijian"></i> {{timestampToTime(val.start_time)}}</span>
                  <span><i class="icon iconfont icon-character"></i> {{val.speaker}}</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
        <div class="cont_null" v-else>
          页面空空如也！
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "home",
    data () {
      return {
        msg: '',
        navList: [],
        selected: 0,
        table: [],
        isData:true,
        tokens: null,
        //是否登录
        isLogin: true,
        //用户信息
        userInfo: {},
        loadingVlg: false
      }
    },
    methods:{
      select(val) {
        this.loadingVlg = true
        this.$axios.get('/zyapp.test.xw518.com/public/live/home/live/lists',{params:{category_id: val}}).then((response)=>{
          if(response.data.data.length === 0){
            this.isData = false
            this.loadingVlg = false
          }else {
            this.isData = true
            this.loadingVlg = false
            this.table = response.data.data
          }
        })
      },
      AllSelect (){
        this.loadingVlg = true
        this.$axios.get('/zyapp.test.xw518.com/public/live/home/live/lists',{params:{}}).then((response)=>{
          if(response.data.data.length === 0){
            this.isData = false
            this.loadingVlg = false
          }else {
            this.isData = true
            this.loadingVlg = false
            this.table = response.data.data
          }
        })
      },
      cloClick(val) {
        //console.log(val)
        this.$router.push({name:'Index',query:{id:val}})
      },
      userClick() {
        //登录
        if(localStorage.getItem('authstrLogin') === null){
          //Toast('请登录！');
          setTimeout(function () {
            var test =encodeURIComponent(window.location.href);
            window.location.href = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/login?redirect_url='+test
          },1000)
        }else {
          this.$router.push({name: 'UserInfo'})
        }
      },
      GetUrlParam(paraName) {
        var url = decodeURIComponent(document.location.toString());
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
      //时间转换
      timestampToTime(timestamp) {
        var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
      },
    },
    mounted() {
      this.$axios.get('/zyapp.test.xw518.com/public/live/home/category/lists').then((response)=>{
        this.navList = response.data.data
      })
      this.$axios.get('/zyapp.test.xw518.com/public/live/home/live/lists',{params:{}}).then((response)=>{
        if(response.data.data === null || response.data.data === []){
          this.isData = false
        }else {
          this.table = response.data.data
        }
      })
      if(this.GetQueryString('authstr')){
        localStorage.setItem("authstrLogin", JSON.stringify(this.GetUrlParam('authstr')));
        let url = window.location.protocol+'//'+window.location.host+window.location.pathname + window.location.hash
        window.location.href = url

      }else {

      }
      if(localStorage.getItem('authstrLogin') === null){
        this.isLogin = true
      }else {
        this.isLogin = false
        this.$axios.get('/zyapp.test.xw518.com/public/user/user/my/info',{
            params:{
              fields: ''
            },
          }
        ).then((response)=>{
          this.userInfo = response.data.data
        })
      }
    },
    created() {
      //设置  cook 登录
    },
    watch: {

    }
  }
</script>

<style scoped lang="scss">
  ul{
    padding: 0;
    margin: 0;
  }
  @mixin Vertically{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .home{
    height: 100%;
    width: 100%;
    overflow: hidden;
    .head{
      width: 100%;
      height: 50px;
      flex-direction:column ;
      background-color: #fff;
      margin-bottom: 10px;
      .head_left{
        margin-left: 1%;
        height: 100%;
        width: 30%;
        float: left;
        background-image: url("../assets/images/LOGO.jpg");
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
      }
      .head_right{
        height: 100%;
        width: 69%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .login{
          max-height: 50px;
          max-width: 50px;
          text-align: right;
          margin-right: 10px;
          overflow: hidden;
          border-radius: 50%;
          img{
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .head_nav{

    }
    .content{
      background-color: #fff;
      position: relative;
      width: 100%;
      height: 92%;
      margin-top: 1%;
      overflow: auto;
      padding-bottom: 55px;
      overflow-scrolling: touch;
      -webkit-overflow-scrolling: touch;
      ul{
        width: 100%;
        height: auto;
        overflow: hidden;
        padding: 0 1%;
        li{
          width: 100%;
          float: left;
          height: 40%;
          box-sizing: border-box;
          padding-bottom: .5rem;
          a{
            display: block;
            height: 100%;
            width: 100%;
            overflow: hidden;
            .card{
              position: relative;
              height: 120px;
              border-radius:5px;
              overflow:hidden;
              width: 50%;
              float: left;
              background-position:50%;
              background-size: 100%;
              background-repeat: no-repeat;
              background-color:floralwhite;
              .cardimg{
                height: 100%;
                position: relative;
                width: 100%;
                img{
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }
              .cont{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                font-size: 12px;
                padding: .1rem .5rem;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                justify-content: space-between;
                color: #fff;
                background: -webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.85)),to(transparent));
                background: linear-gradient(0deg,rgba(0,0,0,.85),transparent);
                span{
                  display: -webkit-box;
                  display: -ms-flexbox;
                  display: flex;
                  -webkit-box-align: center;
                  -ms-flex-align: center;
                  align-items: center;
                }
              }
            }
            .title{
              width: 50%;
              height: 120px;
              float: right;
              margin: 0;
              font-size: 14px;
              color: #212121;
              padding-left: .2rem;
              overflow: hidden;
              box-sizing: border-box;
              h3{
                text-align: left;
                font-size: 18px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin: 0;
              }
              .titleCont{
                height: 38px;
                margin: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                text-align: left;
                font-size: 12px;
                -webkit-box-orient: vertical;
              }
              .time_jiangshi{
                margin-top: .2rem;
                width: 100%;
                height: 40px;
                white-space: nowrap;
                span{
                  width: 100%;
                  height: 20px;
                  font-size: 12px;
                  display: block;
                }
              }
            }
          }

        }
      }
      .cont_null{
        height: 92%;
        width: 100%;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
