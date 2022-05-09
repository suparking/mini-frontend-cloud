// pages/park/index.ts
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
const constant = require('../../utils/constant')
// 地图选点接口初始化
const chooseLocation = requirePlugin('chooseLocation')
// import { behavior } from 'miniprogram-computed'
import { userBehavior } from '../../behaviors/user-behavior'
Page({
    // behaviors: [behavior],
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        online: true,
        markers: [ 
            {id: 0, title: "数停车 (城发天地)", latitude: 30.304157, longitude: 120.130155 , iconPath:"../../assets/images/park-location-online.png", width: '64rpx', height: '64rpx', 
            callout: { 
                content: "数停车 (城发天地)", 
                color: "#777777", 
                fontSize: '20rpx', 
                display: "BYCLICK", 
                padding: "10rpx 30rpx",
                borderRadius: '10rpx',
                textAlign: "center"
            }},
            {id: 1, title: "数停车 (大悦城)", latitude: 30.301193, longitude: 120.129962 , iconPath:"../../assets/images/park-location-offline.png", width: '64rpx', height: '64rpx', 
            callout: { 
                content: "数停车 (大悦城)", 
                color: "#777777", 
                fontSize: '20rpx', 
                display: "BYCLICK", 
                padding: "10rpx 30rpx",
                borderRadius: '10rpx',
                textAlign: "center"
            }}
         ],
        markersDetail: [],
        parkList: [
            {id: 0, name: "数停车 (城发天地)", address: "古运路196号", location: {latitude: 30.304157, longitude: 120.130155}, phone: "18367590702", openTime: "09:00 ~ 22:00", status: 'OPENING', distance: '1.3km'},
            {id: 1, name: "数停车 (大悦城)", address: "古运路190号", location: {latitude: 30.301193, longitude: 120.129962}, phone: "18668232809", openTime: "09:00 ~ 22:00", status: 'CLOSED', distance: '1.0km'}
        ],
        mapContext: null,
        isExpand: true,
        dict: {
            'OPENING': '开放中',
            'CLOSED': '已关闭'
        },
        mapSdk: null,
        // 选点
        userLocation: {
            address:'',
            city:'',
            district:'',
            latitude:'',
            longitude: '',
            name:'',
            province:'',
          },
          showDetailShow: false,
          currentPark: null
    },
    /*
    暂不需要联动
    computed: {
        markers(data) {
            return data.parkList.map((item, index) => {
                return {
                    id: index+1,
                    key: item.id,
                    title: item.name,
                    latitude: item.location.latitude,
                    longitude: item.location.longitude,
                    iconPath: item.status === 'OPENING' ? '../../assets/images/park-location-online.png' : '../../assets/images/park-location-offline.png',
                    width: '64rpx',
                    heigth: '64rpx'
                }
            })
            
        }
    },
    */
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.initMapSdk();
        this.initMapContext();
        this.fetchParkList();
    },

    /**
     * 场库 页面
     * @param {场库ID} data 
     */
    goToPark: (e) => {
        console.log(e)
        const parkId = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/lock-park/index?parkId=${parkId}`,
        })
    },
    /**
     * 点击marker事件.
     * @param {*} e 
     */
    onMarkerTab(e) {
        const { markerId } = e.detail;
        const currentPark = this.data.parkList[markerId]
        if (currentPark.status === 'OPENING') {
            this.setData({
                showDetailShow: true
            })
        } else {
            this.setData({
                showDetailShow: false
            })
            wx.showModal({
                content: "请选择其他场库",
                duration: 5
            })
        }

    },
    /**
     * 
     * @param {点击card传参数} e 
     */
    popupParkDetail(e) {
        const park = e.currentTarget.dataset.park;
        if (park.status === 'OPENING') {
            let currentMarkers = [];
            let currentMarkerDetail = {
                id: park.id, 
                title: park.name, 
                latitude: park.location.latitude, 
                longitude: park.location.longitude , iconPath:"../../assets/images/park-location-online.png", width: '64rpx', height: '64rpx', 
                callout: { 
                    content: park.name, 
                    color: "#777777", 
                    fontSize: '20rpx', 
                    display: "ALWAYS", 
                    padding: "10rpx 30rpx",
                    borderRadius: '10rpx',
                    textAlign: "center"
                }}
                currentMarkers.push(currentMarkerDetail)
            this.setData({
                markersDetail: currentMarkers,
                currentPark: park,
                showDetailShow: true
            })
        } else {
            this.setData({
                currentPark: null,
                showDetailShow: false
            })
            wx.showModal({
                content: "请选择其他场库",
                duration: 5
            })
        }
    },
    /**
     * 搜索场库.
     */
    onSearch() {
        const key = constant.tencentAK;
        const referer = '数泊停车支付';
        const location = JSON.stringify({
            latitude: this.data.user.location.latitude,
            longitude: this.data.user.location.longitude
        });
        wx.navigateTo({
            url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&scale=' + '16'
        });
    },
    /**
     * 打开导航地图.
     */
    navigateLocation(e) {
        const {latitude, longitude} = e.currentTarget.dataset.location;
        wx.openLocation({
            latitude,
            longitude
        });
    },

    /**
     * 拨打电话. 
     * @param {phone} e 
     */
    call(e) {
        const { phone } = e.currentTarget.dataset;
        wx.makePhoneCall({
          phoneNumber: phone,
        })
    },
    /**
     * 初始化Map Sdk.
     */
    initMapSdk() {
        if (!this.mapSdk) {
            this.mapSdk = new QQMapWX({
                key: constant.tencentAK
            });
        }
    },

    /**
     * 获取场库list
     */
    fetchParkList() {
        // 原数据 经过计算位置之后赋值
        this.makeParkList(this.data.parkList);
    },

    /**
     * 重新构造场库列表数据. 
     * @param {原始场库列表数据} data 
     */
    makeParkList(data) {
        // 过滤 经纬度
        const locationList = data.map(item => {
            return {
                latitude: item.location.latitude,
                longitude: item.location.longitude,
            }
        })
        const parkList = this.data.parkList;
        // 计算距离
        this.mapSdk.calculateDistance({
            to: locationList,
            success: (res) => {
                parkList.forEach((item, key) => {
                    parkList[key]['distance'] = (res.result.elements[key].distance / 1000).toFixed(2)
                })
                this.setData({
                    parkList
                })
            }
        })
    },

    /**
     * init mapcontext.
     */
    initMapContext() {
        if (!this.mapContext) {
            wx.createSelectorQuery().select('#park-map').context((res) => {
                this.mapContext = res.context;
            }).exec();
        }
    },

    /**
     * 调回当前位置.
     */
    goToCurrentLocation() {
        this.mapContext.moveToLocation()
    },

    /**
     * 展开和收缩地图.
     */
    onExpandMap(e) {
        this.setData({
            isExpand: !this.data.isExpand
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        const location = chooseLocation.getLocation();
        if ((location !== null && location !== undefined && this.data.userLocation.name ===  '') || (this.data.userLocation.name !== '')) {
            this.setData({
              userLocation: location
            });
        const { longitude, latitude } = location;
        this.mapContext.moveToLocation({
            longitude,
            latitude,
        });
        // 后面拿着搜索的经纬度 向后端计算距离在5km 之内的场库,没有则忽略,有则显示
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        chooseLocation.setLocation(null);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})