// const Config = require('../config');
class Common {
    /**
     * 初始化
     */
    constructor() {
        this.qs = require('querystring');
        this.requestHandle = require('request');
        this.cheerio = require('cheerio');
        // this.cookie = Config.cookie;
    }


    /**
     * preg
     * @param str
     * @param reg
     * @param array
     * @returns {[]|string}
     */
    preg(str, reg, array = false) {
        let list = [];
        try {
            let res = str.matchAll(reg);
            res = [...res];
            for (let i = 0; i < res.length; i++) {
                let item = res[i];
                list.push(item[1]);
            }
        } catch (e) {}
        if (!list.length) return '';
        if (array) return list;
        return list.length === 1 ? list[0] : list;
    }


    /**
     * 动态获取代理
     */
    getProxy(uri) {
        return new Promise((resolve, reject) => {
            this.requestHandle(uri, (err, response, body) => {
                if (err) reject(err);
                try {
                    body = JSON.parse(body);
                } catch (e) {}
                resolve(body);
            })
        })
    }

    /**
     * request
     * @param uri
     * @param opts
     * @param toJson
     * @returns {Promise<unknown>}
     */
    request(uri, opts, toJson = false) {
        return new Promise((resolve, reject) => {
            let that = this
            this.getProxy("http://demo.spiderpy.cn/get/").then(function(req) {
                var UserAgent = "Mozilla/5.0(WindowsNT10.0;Win64;x64)AppleWebKit/537.36(KHTML,likeGecko)Chrome/" + 59 + Math.round(Math.random() * 10) + ".0.3497." + Math.round(Math.random() * 100) + "Safari/537.36"
                opts.headers['user-agent'] = UserAgent;
                // opts.headers['cookie'] = that.cookie;

                //设置代理
                opts.host = req.proxy.split(":")[0]
                opts.port = req.proxy.split(":")[1]

                // console.log(opts)

                that.requestHandle(uri, opts, (err, response, body) => {
                    if (err) return reject(err);
                    if (toJson) {
                        try {
                            body = JSON.parse(body);
                        } catch (e) {}
                    }
                    return resolve(body);
                })
            })


        })
    }
}

module.exports = Common;