# SeamlessWheelCasting

>   无缝轮播图

## 说明

这是一个使用 js 类创建的无缝轮播图功能组件，只要在创建类时，填入相应的配置，即可生成一个无缝轮播图，支持完全（div, dots, arrow等）自定义，样式支持完全自己控制，如果不想自定义样式，可以使用**用法示例**中提供的样式代码。非常好用

## 配置介绍

参数说明

```js
/**
     * Creates an instance of Slideshow.
     * @param {*} imgArr 图片数组
     * @param {*} imgNumber 图片数量
     * @param {*} imgWidth 每张图片的宽度
     * @param {*} imgHeight 每张图片的高度
     * @param {*} dotWidth 小圆点的宽度
     * @param {*} dotHeight 小圆点的高度
     * @param {*} doms  涉及的 DOM 对象
     * @param {*} domsStyle  涉及的 DOM 对象的自定义样式
     * @param {*} timer 运动的计时器配置
     * @param {*} currentIndex  //实际的图片索引，0 ~ imgNumber-1
     * @param {*} autoTimer  //自动轮播的计时器配置
     * @memberof Slideshow
     */
```

类构造器

```js
constructor(
        imgArr,
        imgNumber,
        imgWidth,
        imgHeight,
        dotWidth,
        dotHeight,
        doms,
        domsClassName,
        domsStyle,
        timer,
        currentIndex,
        autoTimer
    ) {
        this.imgArr = imgArr;
        this.imgNumber = imgNumber;
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.dotWidth = dotWidth;
        this.dotHeight = dotHeight;
        this.doms = doms;
        this.domsClassName = domsClassName;
        this.domsStyle = domsStyle;
        this.timer = timer;
        this.currentIndex = currentIndex;
        this.autoTimer = autoTimer; // 自动移动的计时器 id
        // 总距离
        this.totalWidth = this.imgNumber * this.imgWidth;
        this.body = document.body;
        this.initBodyDiv();
        this.init();
        this.registerEventFn();
    }
```

创建类示例

```js
const slideshow = new Slideshow(
    config.imgArr,
    config.imgNumber,
    config.imgWidth,
    config.imgHeight,
    config.dotWidth,
    config.dotHeight,
    config.doms,
    config.domsClassName,
    config.domsStyle,
    config.timer,
    config.currentIndex,
    config.autoTimer
)
```

用法示例中提供的 **config** 模版

```js
const divBanner = document.createElement('div'),
    divImages = document.createElement('div'),
    divDots = document.createElement('div'),
    divArrow = document.createElement('div');
const arrowRight = document.createElement('span'),
    arrowLeft = document.createElement('span');
const arrowRightInnerHTML = '&gt;', arrowLeftInnerHTML = '&lt;';

const divBannerStyle = '',
    divImagesStyle = '',
    divDotsStyle = '',
    divArrowStyle = '',
    divArrowRightStyle = '',
    divArrowLeftStyle = '';


const config = {
    imgArr: ['./images/1.png', './images/2.png', './images/3.png', './images/4.png', './images/5.png'],
    imgNumber: 5,
    imgWidth: 564,
    imgHeight: 315,
    dotWidth: 8,
    dotHeight: 8,
    doms: [
        divBanner,
        divImages,
        divDots,
        [
            divArrow,
            [arrowRight, arrowRightInnerHTML],
            [arrowLeft, arrowLeftInnerHTML]
        ]
    ],
    domsClassName: [
        'banner',
        'images',
        'dots',
        [
            'arrow',
            [
                'item right',
                'item left'
            ]
        ]
    ],
    domsStyle: [
        divBannerStyle,
        divImagesStyle,
        divDotsStyle,
        [
            divArrowStyle,
            [
                divArrowRightStyle,
                divArrowLeftStyle
            ]
        ]
    ],
    timer: {
        duration: 16, //运动间隔的时间，单位毫秒
        total: 300, //运动的总时间，单位毫秒
        id: null //计时器id
    },
    currentIndex: 0,
    autoTimer: {
        id: null,   // 自动轮播计时器 id 
        duration: 2000  // 自动轮播时间间隔
    }
}
```

相信到这里你已经理解了这个类的使用，那就开始愉快的使用吧！