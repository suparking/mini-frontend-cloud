// pages/park/index.ts
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
const CONSTANT = require('../../utils/constant')
// 地图选点接口初始化
const chooseLocation = requirePlugin('chooseLocation')
// import { behavior } from 'miniprogram-computed'
import { userBehavior } from '../../behaviors/user-behavior'
import parkApi from "../../api/park";
Page({
    // behaviors: [behavior],
    behaviors: [ userBehavior ],
    /**
     * 页面的初始数据
     */
    data: {
        online: true,
        markers: [],
        markersDetail: [],
        parkList: [],
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
          currentPark: null,
          showModal: false,
          single: true,
          currentParkPage: 'near'
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
   onRegular: function(e) {
       console.log(e)
       const { detail } = e
       // 常去场库
       if (detail.name === 'regular') {
           this.pullRegularPark(this.data.user.userId);
       } else if (detail.name === 'near') {
           this.onShow();
       }
       this.setData({
           currentParkPage: detail.name 
       })
   },
   /**
    * 未开放停车场库弹出modal 确定按钮回调 
    * @param {*} e 
    */
   modalConfirm: (e) => {
   },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.initMapSdk();
        this.initMapContext();
        this.fetchParkList();
        // 获取所有marks
        this.pullMarks();
    },
    // 获取常去场库
    pullRegularPark(userId) {
        let params = {
            userId: userId
        }
        parkApi.regularStore(params).then(res => {
            const { data } = res;
            if (data.code === CONSTANT.REQUEST_SUCCESS) {
                const parks = data.data;
                if (parks && parks.length > 0) {
                    let parkList = [];
                    let markers = [];
                    parks.forEach((park, index) => {
                        let tPark = {
                            id: index,
                            name: '数停车' + ' (' + park.projectName + ')',
                            address:park.addressSelect.split('-')[park.addressSelect.split('-').length - 1],
                            location: park.location,
                            phone: park.helpLine,
                            openTime: park.openTime.join(' ~ '),
                            status: park.status === 'true' ? 'OPENING' : 'CLOSED',
                            distance: '',
                            perCharge: park.perCharge ? park.perCharge : '暂无',
                            free: park.freePark ? park.freePark : 0
                        }
                        parkList.push(tPark);

                        let icon = '../../assets/images/park-location-offline.png'
                            if (park.status === 'true') {
                                icon = '../../assets/images/park-location-online.png'
                            }
                            let tMarkPark = {
                                id: index,
                                title: '数停车' + ' (' + park.projectName + ')',
                                latitude: park.location.latitude,
                                longitude: park.location.longitude,
                                iconPath: icon,
                                width: '64rpx',
                                height: '64rpx',
                                status: park.status === 'true' ? 'OPENING' : 'CLOSED' ,
                                callout: {
                                    content: '数停车' + ' (' + park.projectName + ')', 
                                    color: "#777777", 
                                    fontSize: '20rpx', 
                                    display: "ALWAYS", 
                                    padding: "10rpx 30rpx",
                                    borderRadius: '10rpx',
                                    textAlign: "center" 
                                }
                            }
                            markers.push(tMarkPark);
                    })
                    this.setData({
                        parkList,
                        markers
                    })
                    resolve(true);
                } else {
                    parkList = [];
                    markers = [];
                    reject(false)
                }
            }
        })
    },
    // 获取地图marks.
    pullMarks() {
        parkApi.allMarks().then(res => {
            const { data } = res;
            if (data.code === CONSTANT.REQUEST_SUCCESS) {
                const parks = data.data;
                if (parks.length > 0) {
                    let markers = [];
                    parks.forEach((park, index) => {
                        let icon = '../../assets/images/park-location-offline.png'
                        if (park.status === 'true') {
                            icon = '../../assets/images/park-location-online.png'
                        }
                        let tPark = {
                            id: index,
                            title: '数停车' + ' (' + park.projectName + ')',
                            latitude: park.location.latitude,
                            longitude: park.location.longitude,
                            iconPath: icon,
                            width: '64rpx',
                            height: '64rpx',
                            status: park.status === 'true' ? 'OPENING' : 'CLOSED' ,
                            callout: {
                                content: '数停车' + ' (' + park.projectName + ')', 
                                color: "#777777", 
                                fontSize: '20rpx', 
                                display: "ALWAYS", 
                                padding: "10rpx 30rpx",
                                borderRadius: '10rpx',
                                textAlign: "center" 
                            }
                        }
                        markers.push(tPark);
                    })
                    this.setData({
                        markers
                    })
                }
            } 
        })
    },
    /**
     * 获取前十个场库
     */
    pullParkList() {
        return new Promise((resolve, reject) => {
            let { location } = this.data.user
            var currentLocation = null;
            if (location) {
                currentLocation = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    number: 10,
                    radius: CONSTANT.DEFAULT_RADIUS
                }
            } else {
                app.loadCurrentLocation().then(res => {
                    if (res) { 
                        this.updateLocation();
                        currentLocation = {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            number: 10,
                            radius: CONSTANT.DEFAULT_RADIUS 
                        }
                    }
                })
            }
            parkApi.nearbyStore(currentLocation).then(res => {
                const { data } = res;
                if (data.code === CONSTANT.REQUEST_SUCCESS) {
                    const parks = data.data;
                    if (parks && parks.length > 0) {
                        let parkList = [];
                        parks.forEach((park, index) => {
                            let tPark = {
                                id: index,
                                name: '数停车' + ' (' + park.projectName + ')',
                                address:park.addressSelect.split('-')[park.addressSelect.split('-').length - 1],
                                location: park.location,
                                phone: park.helpLine,
                                openTime: park.openTime.join(' ~ '),
                                status: park.status === 'true' ? 'OPENING' : 'CLOSED',
                                distance: '',
                                perCharge: park.perCharge ? park.perCharge : '暂无',
                                free: park.freePark ? park.freePark : 0
                            }
                            parkList.push(tPark);
                        })
                        this.setData({
                            parkList
                        })
                        resolve(true);
                    }
                } else {
                    reject(false)
                }
            })
        })
    },
    onShow: function() {
        //通过获取用户信息,如果存在则赋值
        this.pullParkList().then(res => {
            wx.showToast({
              title: '获取场库成功',
              icon: 'success',
              duration: 3000
            })
        }).catch(err => {
            wx.showToast({
              title: '获取场库失败',
              icon: 'error',
              duration: 3000
            })
        })
    },
    /**
     * 场库 页面
     * @param {场库ID} data 
     */
    goToPark: (e) => {
        // wx.showToast({
        //   title: '尽情期待',
        //   duration: 3000
        // })
        // return;
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
        console.log(e)
        const { markerId } = e.detail;
        const currentPark = this.data.markers[markerId]
        const park = this.data.parkList.find(item => item.name === currentPark.title);
        if (currentPark.status === 'OPENING') {
            let currentMarkers = [];
            currentMarkers.push(currentPark);
            this.setData({
                markersDetail: currentMarkers,
                currentPark: park,
                showDetailShow: true
            })
        } else {
            this.setData({
                currentPark: null,
                showDetailShow: false,
                showModal: true
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
                showDetailShow: false,
                showModal: true
            })
        }
    },
    /**
     * 搜索场库.
     */
    onSearch() {
        const key = CONSTANT.tencentAK;
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
                key: CONSTANT.tencentAK
            });
        }
    },

    /**
     * 获取场库list
     */
    fetchParkList() {
        this.pullParkList().then(res => {
            // 原数据 经过计算位置之后赋值
            this.makeParkList(this.data.parkList);
        })
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
                this.goToCurrentLocation();
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