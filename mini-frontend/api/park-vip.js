const CONSTANT = require('../utils/constant');
const CONTEXTPATH = "/vip-car-api";
import signUtil from "../utils/signUtils";
/**
 * 获取所有可以线上办理场库的列表. 
 */
const getProjectVipList = params => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/projectVipCarList?projectNo=" + params.projectNo,
          method: 'GET',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.projectNo)+''
          },
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })  
}

/**
 * 根据项目编号,获取会员合约列表. 
 */
const getProtocolVipCarList = params => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/protocolVipCarList?projectNo=" + params.projectNo,
          method: 'GET',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.projectNo)+''
          },
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })  
}
// 下单操作 
const vipOrderToPay = params  => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/carGroupToPay",
          method: 'POST',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.stockId)+''
          },
          data: params,
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })
}

// 订单查询操作 
const queryOrder = params  => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/queryOrder",
          method: 'POST',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.orderNo)+''
          },
          data: params,
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })
}

// 清除Redis中库存
const clearStockInfoCache = params  => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/clearStockInfoCache",
          method: 'POST',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.stockKey)+''
          },
          data: params,
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })
}

// 订单关闭操作 
const closeOrder = params  => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/closeOrder",
          method: 'POST',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.orderNo)+''
          },
          data: params,
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })
}

/**
 * 获取我的合约信息. 
 */
const getUserProtocol = params => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: CONSTANT.MINI_BASEURL + CONTEXTPATH + "/list?userId=" + params.userId,
          method: 'GET',
          header: {
              'content-type': 'application/json',
              'sign': signUtil.sign(params.userId)+''
          },
          timeout: CONSTANT.REQUEST_TIMEOUT,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      })
  })  
}
export default {
  getProjectVipList,
  getProtocolVipCarList,
  vipOrderToPay,
  queryOrder,
  closeOrder,
  clearStockInfoCache,
  getUserProtocol
}