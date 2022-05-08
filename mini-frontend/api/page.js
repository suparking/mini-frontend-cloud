// 自定义配置页面

const detail = code => {
    let res = {}
    return new Promise((resolve, reject) => {
        if (code === 'privacy') {
            res = {
                code: code,
                content: `<h1> 隐私政策页面 </h1>`,
                createTime: "2022-05-08 10:00:00",
                title: '隐私政策',
                updateTime: '',
                _id: '32312232323232323'
            }
        } else if(code === 'protocol') {
            res = {
                code: code,
                content: `<h1> 用户协议页面 </h1>`,
                createTime: "2022-05-08 10:00:00",
                title: '用户协议',
                updateTime: '',
                _id: '32312232323232323'
            }
        }
        if (res) {
            return resolve(res);
        } else {
            return reject("create obj failed");
        }
    })
}

export default {
    detail
}