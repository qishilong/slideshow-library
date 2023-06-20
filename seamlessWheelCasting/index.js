export class SeamlessWheelCasting {
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

    /**
     * 初始化 body 中所需的页面元素
     * @memberof Slideshow
     */
    initBodyDiv = () => {
        this.handleElementClassAndStyle(this.doms[0], this.domsClassName[0], this.domsStyle[0])
        this.handleElementClassAndStyle(this.doms[1], this.domsClassName[1], this.domsStyle[1])
        this.doms[0].appendChild(this.doms[1]);
        this.handleElementClassAndStyle(this.doms[2], this.domsClassName[2], this.domsStyle[2])
        this.doms[0].appendChild(this.doms[2]);
        this.handleElementClassAndStyle(this.doms[3][0], this.domsClassName[3][0], this.domsStyle[3][0])
        this.handleElementClassAndStyle(this.doms[3][1][0], this.domsClassName[3][1][0], this.domsStyle[3][1][0])
        this.doms[3][1][0].innerHTML = this.doms[3][1][1];
        this.handleElementClassAndStyle(this.doms[3][2][0], this.domsClassName[3][1][1], this.domsStyle[3][1][1])
        this.doms[3][2][0].innerHTML = this.doms[3][2][1];
        this.doms[3][0].appendChild(this.doms[3][1][0]);
        this.doms[3][0].appendChild(this.doms[3][2][0]);
        this.doms[0].appendChild(this.doms[3][0]);
        const newElementName = this.formatElementName(Array.from(this.body.children));
        const index = newElementName.indexOf('SCRIPT')
        this.body.insertBefore(this.doms[0], this.body.children[index])
    }

    /**
     * 处理元素的 class 类名和 style 样式
     * @param {*} element 元素
     * @param {*} className 类名
     * @param {*} domsStyle 元素 style 样式
     * @memberof Slideshow
     */
    handleElementClassAndStyle = (element, className, domsStyle) => {
        if (!!domsStyle.trim()) {
            element.style = domsStyle.trim();
        }
        const newClassNameArr = className.trim().split(' ');
        const length = newClassNameArr.length;
        if (length > 1 && !!newClassNameArr[0].trim()) {
            for (let i = 0; i < length; i++) {
                const oneClassName = newClassNameArr[i]
                if (!!oneClassName.trim()) {
                    element.classList.add(oneClassName);
                }
            }
        } else {
            element.classList.add(newClassNameArr[0]);
        }
    }

    /**
     * 格式化 body 子元素的标签名
     * @param {*} elementArr
     * @memberof Slideshow
     */
    formatElementName = (elementArr) => {
        const resultArr = [];
        for (const element of elementArr) {
            resultArr.push(element.tagName)
        }
        return resultArr;
    }

    // 初始化 banner
    initBanner = () => {
        this.doms[0].style.width = this.imgWidth + 'px';
        this.doms[0].style.height = this.imgHeight + 'px';
    }

    // 初始化 images
    initImages = () => {
        this.doms[1].style.width = this.imgWidth * (this.imgNumber + 2) + 'px';
        this.doms[1].style.height = this.imgHeight + 'px';

        // 设置图片的初始位置
        const left = (-this.currentIndex - 1) * this.imgWidth;
        this.doms[1].style.marginLeft = left + 'px';
    }

    // 初始化 img
    initImg = () => {
        const frag = document.createDocumentFragment();
        this.imgArr = [this.imgArr[this.imgNumber - 1], ...this.imgArr, this.imgArr[0]];
        for (const src of this.imgArr) {
            const a = document.createElement('a')
            const img = document.createElement('img');
            img.src = src;
            img.style.height = this.imgHeight;
            img.style.width = this.imgWidth;
            a.appendChild(img)
            frag.appendChild(a);
        }
        this.doms[1].appendChild(frag);
        // const children = this.doms[1].children;
        // const firstImg = children[0], lastImg = children[children.length - 1];
        // const newLastImg = firstImg.clone(true);   // 深度克隆
        // this.doms[1].appendChild(newLastImg);
        // const newFirstImg = lastImg.clone(true);
        // this.doms[1].insertBefore(newFirstImg, firstImg);
    }

    // 判断小原点是否是活跃状态
    judgeDotIsActive = () => {
        const dotsChildren = this.doms[2].children;
        for (let i = 0; i < this.imgNumber; i++) {
            if (i === this.currentIndex) {
                dotsChildren[i].className = 'active';
            } else {
                dotsChildren[i].className = '';
            }
        }
    }

    // 初始化 dots
    initDots = () => {
        this.doms[2].style.width = (this.dotWidth + 6) * this.imgNumber + 'px';
        const frag = document.createDocumentFragment()
        for (let i = 0; i < this.imgNumber; i++) {
            const span = document.createElement('span');
            span.style.width = this.dotWidth;
            span.style.height = this.dotHeight;
            frag.appendChild(span)
        }
        this.doms[2].appendChild(frag);
        this.judgeDotIsActive();
    }

    init = () => {
        this.initBanner();
        this.initImages();
        this.initImg();
        this.initDots();
    }

    /**
     * 切换到某个图片的索引
     * @param {*} index 要切换的目标索引
     * @param {*} direction 方向 'left' 'right' [轮播图箭头的方向]
     * @memberof Slideshow
     */
    switchTo = (index, direction) => {
        if (index === this.currentIndex) {
            return;
        }
        if (!direction) {
            direction = 'right';
        }

        // 停止计时器
        const stopAnimate = () => {
            clearInterval(this.timer.id);
            this.timer.id = null;
        }

        // 新的 currentIndex
        this.currentIndex = index;
        // 重新设置小圆点状态
        this.judgeDotIsActive();

        // 最终的 marginLeft
        const newMarginLeft = (-index - 1) * this.imgWidth;

        // 逐步改变 marginLeft
        const animationSwitch = () => {
            // 如果之前有动画，先停止之前的动画
            if (this.timer.id) {
                stopAnimate()
            }

            /** 
             * 任务步骤：
             * 1. 计算运动的次数
             * 2. 计算总距离
             * 3. 计算每次运动的改变的距离
             * 4. 改变 marginLeft
            */
            // 1. 计算运动的次数
            const totalNumber = Math.ceil(this.timer.total / this.timer.duration);
            // 当前运动的次数
            let currentNumber = 0;
            // 2. 计算总距离
            let marginLeft = parseFloat(getComputedStyle(this.doms[1]).marginLeft),
                distance = null;

            // 判断改变的距离
            if (direction === 'right') {
                if (newMarginLeft < marginLeft) {
                    distance = newMarginLeft - marginLeft;
                } else {
                    distance = -(this.totalWidth - Math.abs(newMarginLeft - marginLeft));
                }
            } else {
                if (newMarginLeft > marginLeft) {
                    distance = newMarginLeft - marginLeft;
                } else {
                    distance = this.totalWidth - Math.abs(newMarginLeft - marginLeft);
                }
            }

            // 3. 计算每次改变的距离
            const everyDistance = distance / totalNumber;

            this.timer.id = setInterval(() => {
                // 改变 divImages 的 marginLeft
                marginLeft += everyDistance;
                if (direction === 'right' && Math.abs(marginLeft) > this.totalWidth) {
                    marginLeft += this.totalWidth;
                } else if (direction === 'left' && Math.abs(marginLeft) < this.imgWidth) {
                    marginLeft -= this.totalWidth;
                }
                this.doms[1].style.marginLeft = marginLeft + 'px';
                currentNumber++;
                if (currentNumber === totalNumber) {
                    stopAnimate();
                }
            }, this.timer.duration)
        }

        animationSwitch();
    }

    // 注册点击事件、鼠标移入移出事件
    registerEventFn = () => {

        const toLeft = () => {
            let index = this.currentIndex - 1;
            if (index < 0) {
                index = this.imgNumber - 1;
            }
            this.switchTo(index, 'left');
        }

        const toRight = () => {
            const index = (this.currentIndex + 1) % this.imgNumber;
            this.switchTo(index, 'right');
        }
        this.doms[3][0].onclick = (e) => {
            if (e.target.classList.contains('left')) {
                toLeft()
            } else if (e.target.classList.contains('right')) {
                toRight()
            }
        }
        this.doms[2].onclick = (e) => {
            if (e.target.tagName === 'SPAN') {
                const index = Array.from(this.doms[2].children).indexOf(e.target);
                this.switchTo(index, index > this.currentIndex ? 'right' : 'left');
            }
        }

        this.autoTimer.id = setInterval(toRight, this.autoTimer.duration);

        this.doms[0].onmouseenter = () => {
            clearInterval(this.autoTimer.id);
            this.autoTimer.id = null;
        }

        this.doms[0].onmouseleave = () => {
            if (this.autoTimer.id) {
                return;
            }
            this.autoTimer.id = setInterval(toRight, this.autoTimer.duration);
        }
    }
}

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

// 还可以使用 DOMContentLoaded 进行优化，达到完全由 js 控制

const SeamlessWheelCasting = new SeamlessWheelCasting(
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

