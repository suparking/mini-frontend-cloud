// components/tabs/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        current: 0,
        linePositionWidth: 0,
        linePositionX: 0
    },

    /**
     * 组件首次被加载时候触发.
     */
    lifetimes: {
        attached() {
            this.calculateLinePositionX();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onTab(e) {
            const { index } = e.currentTarget.dataset;
            this.setData({
                current: index
            })
            this.calculateLinePositionX(index)
            let regularDetail = {
                index: this.data.current,
                name: '' 
            };
            let regularOption = {

            }
            if (this.data.current === 1) {
                regularDetail.name = 'regular';
            } else {
                regularDetail.name = 'near';
            }
            this.triggerEvent('regular', regularDetail, regularOption);
        },
        calculateLinePositionX(index = 0) {
            this.createSelectorQuery().selectAll('.tab').boundingClientRect(results => {
                const rect = results[index];
                const currentCenterX = rect.left + rect.width / 2;
                const linePositionWidth = rect.width * 0.8;
                const linePositionX = (currentCenterX - linePositionWidth / 2) - results[0].left;
                this.setData({
                    linePositionWidth,
                    linePositionX
                })
            }).exec();
        }
    }
})
