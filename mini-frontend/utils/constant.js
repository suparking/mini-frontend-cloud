const tencentAK = '4L2BZ-YZ43I-KPIGI-5GRQQ-CNCM7-LNFIY';
const distanceUrl = 'https://apis.map.qq.com/ws/distance/v1/matrix/';
const REQUEST_TIMEOUT = 30000;
const MINI_BASERUL =  "http://192.168.1.9:20001/mini-module";
const REQUEST_SUCCESS = 200;
const BS_REQUEST_SUCCESS = "00000";
const DEFAULT_RADIUS = 5000;
const SECRET = "9fdfff5ec6ac41c1a83269241e09f4ce";
const BS_BASEURL = "https://bs.suparking.cn/spms"

module.exports = {
    tencentAK: tencentAK,
    distanceUrl: distanceUrl,
    REQUEST_TIMEOUT: REQUEST_TIMEOUT,
    MINI_BASEURL: MINI_BASERUL,
    REQUEST_SUCCESS: REQUEST_SUCCESS,
    DEFAULT_RADIUS: DEFAULT_RADIUS,
    SECRET: SECRET,
    BS_BASEURL: BS_BASEURL,
    BS_REQUEST_SUCCESS: BS_REQUEST_SUCCESS
}