// components/platekeyboard/index.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        plate: Array, // 车牌
        showPlateKeyboard: Boolean, // 是否展示车牌,
        current: Number  // 当前输入车位第几位
    },

    /**
     * 组件的初始数据
     */
    data: {
        bottomSafeArea: app.globalData.bottomSafeArea,
        keyValue1: '京沪粤津冀晋蒙辽吉黑',
		keyValue2: '苏浙皖闽赣鲁豫鄂湘',
		keyValue3: '云贵川桂琼渝藏台',
		keyValue4: '陕甘青宁新',
		keyNumber: '1234567890',
		keyLetterValue1: 'ABCDEFGHJK',
		keyLetterValue2: 'LMNPQRSTUV',
		keyLetterValue3: 'WXYZ港澳学警',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClickFinish() {
            this.setData({
                showPlateKeyboard: false
            })
        },
        /**
         * 删除按键
         */
        onClickDelete() {
            if (!this.data.plate.length) {
                return;
            }
            this.data.plate.pop();
            this.setData({
                plate: this.data.plate
            })
            // 向调用者发送事件
            this.triggerEvent('plateKeyboardDeleteChange', this.data.plate);
        },
        /**
         * 增加字母输入 
         * @param {*} e 
         */
        onClickKey(e) {
            let key = e.currentTarget.dataset.key;
            if (this.data.current >= 8) {
                return
            }
            // this.data.plate.push(key);
            this.data.plate[this.data.current] = key;
            this.setData({
                plate: this.data.plate
            })
            this.triggerEvent('plateKeyboardAddChange', this.data.plate);
        }
    }
})
