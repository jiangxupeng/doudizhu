const STANDUP = 1;
const SITDOWN = 2;
cc.Class({
    extends: cc.Component,
    properties: {
        _touchBegan: null,
        _touchMoved: null,
    },
_getCardForTouch: function (touch, cardArr) {
    for ( let k=cardArr.length-1;k>=0;k--) {
        let box = cardArr[k].getBoundingBoxToWorld();
        if (box.contains(touch)) {
            cardArr[k].isChiose = true;
            cardArr[k].opacity = 155;
            return cardArr[k];
        }
    }

},
touchBegan: function (event) {
    // var self = this;
            let x = event.getLocationX();
            let touches = event.getTouches();
            let touchLoc = touches[0].getLocation();
            this._touchBegan = this.node.convertToNodeSpace(touchLoc);
            this._getCardForTouch(touchLoc, cc.gameingUI.cardList);
    },

touchMoved: function (event) {
    let self = this;
    let touches = event.getTouches();
    let touchLoc = touches[0].getLocation();
    this._touchMoved = this.node.convertToNodeSpace(touchLoc);
   self._getCardForTouch(touchLoc,cc.gameingUI.cardList);
    // this._checkSelectCardReserve(this._touchBegan, this._touchMoved);
},

touchCancel: function () {

},


touchEnd: function (event) {
    let touches = event.getTouches();
    let touchLoc = touches[0].getLocation();
        for (let k in cc.gameingUI.cardList) {
            cc.gameingUI.cardList[k].opacity = 255;
            if (cc.gameingUI.cardList[k].isChiose === true) {
                cc.gameingUI.cardList[k].isChiose = false;
                if (cc.gameingUI.cardList[k].status === SITDOWN) {
                    cc.gameingUI.cardList[k].status = STANDUP;
                    cc.gameingUI.cardList[k].flag = true;
                    cc.gameingUI.cardList[k].y += 20;
                    this.cardARR =cc.gameingUI.cardList[k].serverData;
                    cc.systemEvent.emit('choose-card',this.cardARR);
                } else {
                    cc.gameingUI.cardList[k].flag = false;
                    cc.gameingUI.cardList[k].status = SITDOWN;
                    cc.gameingUI.cardList[k].serverData.flag = false;
                    cc.gameingUI.cardList[k].y -= 20;

                    this.cardARR =cc.gameingUI.cardList[k].serverData;
                    console.log('取消选牌' +  cc.gameingUI.cardList[k].serverData);
                    cc.systemEvent.emit('un-choose-card', this.cardARR);
                }
            }
    }

   // console.log('bbb = ' +  cc.gameingUI.cardList);
},


onTouchEvent: function () {
         this.node.on(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
         this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
         this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
         this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
},

offTouchEvent: function () {
    this.node.off(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
},
    onLoad(){
        cc.cardARR = [];
        cc.moveEven = this;
        this.onTouchEvent();
        // this.onTouchEvent();
    },
    onDestroy(){
        this.offTouchEvent();
         },
    })


