'use strict'

export default {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},
	api: {
		base: 'http://rap.taobao.org/mockjs/6990',
		list: '/api/list',
		up: '/api/up',
		comments:'/api/comments',
		signup:'/api/u/signup',
		verify:'/api/u/verify',
		signature:'/api/signature'
	}
}