<template>
  <div class="userInfo">
    <header>

    </header>
    <div class="space-detail">
      <ul>
        <li>
          <div class="detail_li">
            <div class="left">
              头像
            </div>
            <div class="right">
              <div class="touxiang">
                <img :src="userInfo.avatar?userInfo.avatar:require('../assets/images/touxiang.png')" :alt="userInfo.nickname" class="rightImg">
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="detail_1">
            <div class="left">
              昵称
            </div>
            <div class="right">
             {{ userInfo.nickname }}
            </div>
          </div>
        </li>
        <li>
          <div class="detail_1">
            <div class="left">
              积分
            </div>
            <div class="right">
              {{ userInfo.jifen }}
            </div>
          </div>
        </li>
        <li>
          <div class="detail_1">
            <div class="left">
              昵称
            </div>
            <div class="right">
              {{ userInfo.nickname }}
            </div>
          </div>
        </li>
        <li>
          <div class="detail_1">
            <div class="left">
              创建时间
            </div>
            <div class="right">
              {{ userInfo.create_time }}
            </div>
          </div>
        </li>
        <li>
          <div class="detail_1">
            <div class="left">
              手机号
            </div>
            <div class="right">
              {{ userInfo.phone }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="op-card">
      <a href="javascript:;" class="item" @click="outLogin">退出登录</a>
      <a href="javascript:;" class="item" @click="backHome">返回主页</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "userInfo",
    data () {
      return {
        userInfo:{

        }
      }
    },
    methods: {
      outLogin() {
        let ua = window.navigator.userAgent.toLowerCase();
        if(ua.indexOf( 'micromessenger' ) > -1) {
          localStorage.removeItem('authstrLogin');
          this.$router.replace('/')
        }else {
          localStorage.clear();
          this.$router.push({name:'Home'})
        }
      },
      backHome() {
        this.$router.push({name:'Home'})
      }
    },
    created() {
    },
    mounted() {
      this.$axios.get('/zyapp.test.xw518.com/public/user/user/my/info',{
          params:{
            fields: ''
          },
        }
      ).then((response)=>{
        this.userInfo = response.data.data
      })
    }
  }
</script>

<style scoped lang="scss">
  ul{
    padding: 0;
    margin: 0;
  }
  *{
    padding: 0;
    margin: 0;
  }
  @mixin Vertically{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .userInfo{
    height: 100%;
    width: 100%;
    overflow: hidden;
    .space-detail{
      width: 100%;
      overflow: hidden;
      background-color: #fff;
      ul{
        height: 100%;
        width: 100%;
        overflow: hidden;
        li{
          list-style: none;
          width: 100%;
          border-bottom: 1px solid #eee;
          .detail_li{
            height: 3rem;
            .left{
              width: 30%;
              float: left;
              color: #505050;
              font-size: 16px;
              height: 100%;

              @include Vertically;
            }
            .right{
              float: right;
              height: 100%;
              width: 70%;
              line-height: 3rem;
              text-align: right;
              .touxiang{
                width: 20%;
                float: right;
                padding: .1rem .5rem .1rem .1rem;
                vertical-align:middle;
                height: 100%;
                overflow: hidden;
                .rightImg{
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }

            }
          }
          .detail_1{
            height: 3rem;
            .left{
              width: 30%;
              float: left;
              color: #505050;
              font-size: 16px;
              height: 100%;

              @include Vertically;
              /*line-height: 3rem;*/
            }
            .right{
              float: right;
              height: 100%;
              color: #999;
              width: 70%;
              line-height: 3rem;
              padding: .1rem .5rem .1rem .1rem;
              text-align: right;
            }
          }
        }
      }
    }
    .op-card{
      width: 100%;
      height: auto;
      margin-top: 1rem;
      background-color: #fff;
      .item{
        display: block;
        padding: .7rem;
        text-align: center;
        color: #505050;
        text-decoration: none;
        background: #fff;
        font-size: 14px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &:nth-child(1){
          border-bottom: 1px solid #eee;
        }
      }
    }
  }
</style>
