// components/numberkeyboard/index.js
const app = getApp()
Component({
     /**
     * 组件的属性列表
     */
    properties: {
        plate: Array, // 车位号
        showPlateKeyboard: Boolean, // 是否展示车牌,
        current: Number,  // 当前输入车位第几位
        number: Number // 支持输入最多几位数
    },

    /**
     * 组件的初始数据
     */
    data: {
        bottomSafeArea: app.globalData.bottomSafeArea,
		keyNumber1: '123',
		keyNumber2: '456',
		keyNumber3: '789',
        keyNumber4: '0',
        keyNumber5: 'SP'
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
            if (this.data.current >= this.data.number) {
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
