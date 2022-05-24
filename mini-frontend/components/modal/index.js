// components/modal/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        single: {
            type: Boolean,
            value: true
        },
        cancelName: {
            type: String,
            value: '取消'
        },
        confirmName: {
            type: String,
            value: '确认'
        },
        tipsContent: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        clickMask() {
            this.setData({ show: false })
        },
        cancel() {
            this.setData({ show: false });
            this.triggerEvent('cancel'); // triggerEvent 触发事件
        },
        confirm() {
            this.setData({ show: false });
            this.triggerEvent('confirm');
        }
    }
})
