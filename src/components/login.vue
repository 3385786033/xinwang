<template>
  <div class="Login">
    <header>
      <div class="title_left"><i class="icon iconfont icon-back back" @click="back"></i></div>
      <h1> 登 录 </h1>
      <div class="title_right" @click="wechatLogin" v-if="isWechat">
        <span>微信登录</span>
      </div>
    </header>
    <div class="formData">
      <ul>
        <li>
          <div class="input_item">
            <span>+86</span>
            <input type="tel" placeholder="请输入手机号码" maxlength="11" v-model="phone" oninput="value=value.replace(/[^\d]/g,'')">
            <button class="input_but" @click.stop="getCode($event)">获取验证码</button>
          </div>
        </li>
        <li>
          <div class="input_item">
            <span>验证码</span>
            <input type="tel" maxlength="4" placeholder="请输入验证码" v-model="code" oninput="if( this.value.length > 4 )  this.value = this.value.slice(0,4); value=value.replace(/[^\d]/g,'')">
            <div class="input_but"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn_box">
      <div class="btn_default" @click.stop="loginEnd">
        验证登录
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import { Toast } from 'mint-ui';
  export default {
    name: "login",
    data () {
      return {
        phone: null,
        autoVal: null,
        code: null,
        isWechat: true
      }
    },
    methods: {
      getCode(e) {
        var validCode = true;
        let time = 60;
        const Mobile = /^1[34578]\d{9}$/;
        if(Mobile.test(this.phone) === false || this.phone === '') {
          Toast('请输入正确手机号');
        }else {
          $(e.target).attr('disabled',true)
          if(validCode) {
            this.$axios.get('http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/getCode',{
              params:{
                phone: this.phone
              }
            }).then((response)=>{
              validCode = false
              var t = setInterval(function () {
                time--;
                $(e.target).html(time+'秒');
                if(time == 0){
                  clearInterval(t);
                  $(e.target).html('重新获取');
                  validCode = true
                  $(e.target).removeAttr('disabled')
                }
              },1000)
            })
          }
        }

      },
      loginEnd() {
        if(this.code === null || this.code === ''){
          Toast('请输入验证码');
        }else {
          this.$axios.get('http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/getAuthstr',{
            params:{
              code: this.code,
              phone: this.phone
            }
          }).then((response)=>{
            if(response.data.status === 0){
              Toast(response.data.message);
            }else {
              localStorage.setItem("authstrS", JSON.stringify(response.data.data.authstr));
              Toast('登录成功！');
              this.$router.push({name:'Home'})
            }
          })
        }
      },
      back () {
        this.$router.push({name:'Home'})
      },
      //微信登录
      wechatLogin(){
        window.location.href = 'http://xielei.test.xw518.com/zyapp.test.xw518.com/public/user/base/auth/login'
      }
    },
    created() {
      //判断是否登录
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.indexOf( 'micromessenger' ) > -1) {
        this.isWechat = true
      }else {
        this.isWechat = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .Login{
    width: 100%;
    height: 100%;
    overflow: hidden;
    header{
      background-color: #fff;
      height: 45px;
      width: 100%;
      .title_left{
        width: 10%;
        height: 100%;
        overflow: hidden;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        .back{
          text-align: left;
          float: left;
          font-size: 18px;
        }
      }
      h1{
        text-align: center;
        line-height: 45px;
        width: 70%;
        display: block;
        float: left;
        font-size: 16px;
      }
      .title_right{
        width: 20%;
        height: 100%;
        overflow: hidden;
        float: right;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          font-size: 12px;
        }
      }
    }
    .formData{
      width: 100%;
      height: 12%;
      margin-top: 5%;
      background-color: #fff;

      ul{
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        li{
          list-style: none;
          width: 100%;
          height: 50%;
          &:nth-child(1){
            border-bottom: 2px solid #e7e7e7;
          }
          .input_item{
            padding: 0 2%;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            span{
              width: 20%;
              color: #212121;
              display: inline-block;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-family: PingFangSC-Regular;
              font-size: 12px;
            }
            input{
              outline: none;
              padding: .2rem 0;
              border: none;
              width: 50%;
              background: none;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              box-sizing: border-box;
              font-family: PingFangSC-Regular;
              font-size: 14px;

            }
            .input_but{
              color: #fb7299;
              background-color: #fff;
              outline: none;
              border: none;
              width: 34%;
              padding-left: .32rem;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              box-sizing: border-box;
              margin-top: .24rem;
              text-align: center;
              padding-left: 1rem;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              position: relative;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              border-left: 1px solid #e7e7e7;
            }
          }
        }
      }
    }
    .btn_box{
      padding: 0 1rem;
      margin-top: 1rem;
      width: 100%;
      .btn_default{
        border: 1px solid #ff9db5;
        background: #ff9db5;
        color: #fff;
        width: 100%;
        height: 2.173333rem;
        min-width: 2.346667rem;
        text-align: center;
        font-size: 14px;
        line-height: 2.173333rem;
        cursor: pointer;
        border-radius: .106667rem;
        display: inline-block;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 .266667rem
      }
    }
  }
</style>
