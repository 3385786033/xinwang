<template>
  <div class="order">
    <div class="header">
      <div class="head_img">
        <img :src="goodsInfo.cover">
      </div>
      <mu-card-title :title="goodsInfo.title" sub-title="产品描述"></mu-card-title>
      <mu-card-text v-html="goodsInfo.body">

      </mu-card-text>
    </div>
    <mu-container class="content">
      <mu-card-title title="立即下单" sub-title=""></mu-card-title>
      <mu-form ref="form" :model="form" class="mu-demo-form" :label-position="labelPosition" label-width="100">
        <mu-form-item prop="goods_num" label="数量" :rules="odernum">
          <mu-text-field v-model="form.goods_num" type="number" prop="goods_num"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="tel" label="手机号" :rules="odertel">
          <mu-text-field v-model="form.tel" type="number" prop="tel"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="address" label="地址" :rules="oderadder">
          <mu-text-field v-model="form.address" prop="address"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="username" label="收货人" :rules="oderusername">
          <mu-text-field v-model="form.username" prop="username"></mu-text-field>
        </mu-form-item>
        <mu-form-item  label="备注">
          <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form.user_tips"></mu-text-field>
        </mu-form-item>
        <mu-form-item>
          <mu-button color="primary" @click="submit">提交</mu-button>
          <mu-button @click="clear">返回</mu-button>
        </mu-form-item>
      </mu-form>
    </mu-container>
  </div>
</template>

<script>
  import { Toast  } from 'mint-ui';
  export default {
    name: "order",
    data () {
      return {
        odernum: [
          { validate: (val) => !!val, message: '请填写数量！'},
        ],
        odertel: [
          { validate: (val) => !!val, message: '必须电话号码！'},
          { validate: (val) => val.length >= 11, message: '填写正确号码'}
        ],
        oderadder: [
          { validate: (val) => !!val, message: '请填写地址！'},
        ],
        oderusername: [
          { validate: (val) => !!val, message: '请填收货人！'},
        ],
        labelPosition: 'top',
        form: {
          goods_num: '',
          tel: '',
          address: '',
          username: '',
          user_tips: ''
        },
        //商品信息
        goodsInfo: {}
      }
    },
    methods:{
      submit () {
        this.$refs.form.validate().then((result) => {
          if(result === true){
            let data = {
              goods_id: this.$route.query.id,
              goods_num: this.form.goods_num,
              tel: this.form.tel,
              address: this.form.address,
              username: this.form.username,
              user_tips: this.form.user_tips
            }
            this.$axios.post('/zyapp.test.xw518.com/public/live/user/order/add',data).then((response) => {
              if(response.data.status === 1){
                Toast(response.data.message);
              }else {
                Toast('下单失败！');
              }
            })
          }else {
            return false
          }
        });
      },
      clear() {
        this.$router.go(-1)
      }
    },
    created() {
      this.$axios.get('/zyapp.test.xw518.com/public/live/home/goods/detail',{params:{id: this.$route.query.id},}
      ).then((response)=>{
        this.goodsInfo = response.data.data.goods
      })
    }
  }
</script>

<style scoped lang="scss">
  .order{
    width: 100%;
    height: 100%;
    background: #fff;
    overflow-y: scroll;
    .header{
      width: 100%;
      height: auto;
      overflow: hidden;
      .head_img{
        width: 100%;
        img{
          display: block;
          height: 50%;
          width: 100%;
        }
      }
    }
    .content{
      .bofys{
        img{
          display: block;
          width: 100%;
        }
      }
    }
  }
</style>
