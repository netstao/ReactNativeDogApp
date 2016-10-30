'use strict'

export default {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  qiniu: {
    upload: 'http://up-z2.qiniu.com/'
  },
  cloudinary :{
    cloud_name: 'dog',
    api_key: '744474146883937',
    base: 'https://api.cloudinary.com/v1_1/dog/image/upload',
    image: 'https://api.cloudinary.com/v1_1/dog/image/upload',
    video: 'https://api.cloudinary.com/v1_1/dog/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/dog/raw/upload'
  },
  api: {
    //base: 'http://rap.taobao.org/mockjs/6990',
    base: 'http://localhost:8082',
    list: '/api/list',
    up: '/api/up',
    comments:'/api/comments',
    signup:'/api/u/signup',
    verify:'/api/u/verify',
    update:'/api/u/update',
    signature:'/api/signature'
  }
}