import global from './../global'
var audioPlayer = require('audioPlayer');
const STANDUP = 1;
const SITDOWN = 2;
cc.Class({
    extends: cc.Component,
    properties: {
        gameingUI: cc.Node,
        cardPrefab: cc.Prefab,
        playerCardPos: cc.Node,
        robUI: cc.Node,
        playUI: cc.Node,
        tipsLabel: cc.Label,
        pushCardNode: cc.Node,
        noPushCardButton: cc.Node,
        victory:cc.Prefab,
        failure: cc.Prefab,
        faPaiAudio: { //发牌
            default: null,
            type: cc.AudioClip
        },
        GrabLandlord: {//抢地主
            default: null,
            type: cc.AudioClip
        },
        noGrabLandlord: {//不抢地主
            default: null,
            type: cc.AudioClip
        },
        noPush: {//不出
            default: null,
            type: cc.AudioClip
        },
        selected: { //选中
            default: null,
            type: cc.AudioClip
        },
        noSelected: { //取消选中
            default: null,
            type: cc.AudioClip
        },
        win: { //赢
            default: null,
            type: cc.AudioClip
        },
        fail: { //失败
            default: null,
            type: cc.AudioClip
        },
    },




    onLoad() {
        cc.gameingUI = this;
        cc.winID = undefined;
        cc.gameingUI.bottomCards = [];
        let bottomCardData = [];
        cc.gameingUI.cardList = [];
        this.chooseCardDataList = [];
        this.tipsCardsList = [];
        this.tipsCardsIndex = 0;
        this.playerList = [];

        global.socket.onPushCard((data) => {
            console.log('从服务端返回的牌组push card' + JSON.stringify(data));
            this.pushCard(data);
            cc.audioEngine.play(this.faPaiAudio, false, 1);

        });
        // this.pushCard();
        global.socket.onCanRobMater((data) => {
            console.log('can rob master data = ' + data);
            if (data === global.playerData.accountID) {
                cc.gameingUI.robUI.active = true;

                // let _time = 9;
                // this.schedule(function(){
                //
                //     cc.gameingUI.robUI.getChildByName('clock').getChildByName('time').getComponent(cc.Label).string = _time--;
                //
                //     cc.log("计时器："+_time)
                //     if(_time == -1){
                //         global.socket.notifyRobState('no-ok');
                //         console.log('不抢');
                //         cc.gameingUI.robUI.active = false;
                //     }
                //
                //     //0代表执行1次，
                //     //cc.macro.REPEAT_FOREVER
                //
                //
                //
                // },1,9,0);
            }

        });
        //展示底牌
        global.socket.onShowBottomCard((data) => {
            console.log('show bottom card  = ' + JSON.stringify(data));
            bottomCardData = data;
            // for (let i = 0; i < data.length; i++) {
            //     let card =cc.gameingUI.bottomCards[i];
            //     card.getComponent('card').showCard(data[i]);
            // };
            // cc.gameingUI.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            //     let index = 0;
            //     const runActionCb = () => {
            //         index++;
            //         if (index === 3) {
            //             cc.gameingUI.node.emit('add-card-to-player');
            //         }
            //     };
            //     for (let i = 0; i <cc.gameingUI.bottomCards.length; i++) {
            //         let card = cc.gameingUI.bottomCards[i];
            //         let width = card.width;
            //         cc.gameingUI.runCardAction(card, cc.p((cc.gameingUI.bottomCards.length - 1) * -0.5 * width * 0.7 + width * 0.7 * i, 900), runActionCb);
            //     }
            //     // this.bottomCards = [];
            // })));
            this.threeButtonCard(data);
        });
        global.socket.onCanPushCard((data) => {
            console.log('on can push card = ' + JSON.stringify(data));
            let uid = data.uid;
            let count = data.count;
            if (uid === global.playerData.accountID) {
                cc.gameingUI.noPushCardButton.active = true;
                if (count === 2){
                    cc.gameingUI.noPushCardButton.active = false;
                }
                cc.gameingUI.playUI.active = true;
                for (let i = 0; i < cc.gameingUI.pushCardNode.children.length; i++) {
                    cc.gameingUI.pushCardNode.children[i].destroy();
                }
                this.tipsCardsList = [];
                this.tipsCardsIndex = 0;
            }
        });
        global.socket.onPlayerPushCard((data) => {
            console.log('player push card = ' + JSON.stringify(data));
            if (data.accountID === global.playerData.accountID) {
                let cardsData = data.cards;
                for (let i = 0; i < cardsData.length; i++) {
                    let card = cc.instantiate(cc.gameingUI.cardPrefab);
                    card.parent =cc.gameingUI.pushCardNode;
                    card.scale = 0.4;
                    let width = card.width;
                    card.x = (cardsData.length - 1) * -0.5 * width * 0.3 + width * 0.3 * i;
                    card.getComponent('card').showCard(cardsData[i]);
                }
            }
        });
        this.node.on('master-pos', (event) => {
            let detail = event;
            this.masterPos = detail;
        });



        //结算settle-accounts  ={"data":{"playerList":[{"nickName":"憨憨","accountID":"20190919022526","avatarUrl":"http://192.168.1.251:80/avatar/o/158/10000158.jpg","gold":879,"seatIndex":0,"isReady":false,"cards":[]},{"nickName":"风吹裙子蛋蛋凉","accountID":"20190920101547","avatarUrl":"http://192.168.1.251:80/avatar/o/151/10000151.jpg","gold":260,"seatIndex":1,"isReady":false,"cards":[]},{"nickName":"凉凉","accountID":"20190920101827","avatarUrl":"http://192.168.1.251:80/avatar/o/160/10000160.jpg","gold":1481,"seatIndex":2,"isReady":false,"cards":[]}],"houseManager":"20190919022526"}}
        global.socket.onSettlement((data)=>{
            cc.winID = data.winId;
            console.log('data.data  =' + data);
            console.log('结算settle-accounts  =' + data.roomPlayerList);

            cc.loader.loadRes("music/bgMain", cc.AudioClip, function (err, AudioClip) {
                audioPlayer.stopBgMusic(AudioClip);
            });
            for(let i =0;i<data.roomPlayerList.length;i++){
                cc.gameingUI.playerList = data.roomPlayerList[i];
                console.log('返回的玩家结算信息 = ' + JSON.stringify( cc.gameingUI.playerList));
                console.log('当前玩家ID = ' + global.playerData.accountID);
                console.log('赢的人的ID = ' + data.winId);
            }
            if (global.playerData.accountID === data.winId){
                console.log('进入赢界面');
                console.log('剩余的牌数量 = ' +  cc.gameingUI.cardList);
                console.log('底牌为 = ' +  cc.gameingUI.bottomCards);
                console.log('this.cardsNode 的值 = ' +  cc.gameingUI.cardsNode);

                cc.loader.loadRes("music/sound_win", cc.AudioClip, function (err, AudioClip) {  //赢的音效
                    audioPlayer.playYinXiao(AudioClip);
                });

                for ( let i = 0 ;i< cc.gameingUI.bottomCards.length;i++){
                    cc.gameingUI.bottomCards[i].destroy();
                }
                for (let i = 0 ; i < cc.gameingUI.cardList.length; i ++){
                    cc.gameingUI.cardList[i].destroy();
                }
                cc.gameingUI.Victory(data);
                cc.gameingUI.cardList = [];
                cc.gameingUI.bottomCards = [];
                cc.gameingUI.chooseCardDataList = [];

            }else {
                console.log('剩余的牌数量 = ' +  cc.gameingUI.cardList);
                console.log('进入输界面');
                console.log('底牌为 = ' +  cc.gameingUI.bottomCards);

                cc.loader.loadRes("music/lose", cc.AudioClip, function (err, AudioClip) {  //输的音效
                    audioPlayer.playYinXiao(AudioClip);
                });
                for ( let i = 0 ;i<cc.gameingUI.bottomCards.length;i++){
                    cc.gameingUI.bottomCards[i].destroy();
                }
                for (let i = 0 ; i < cc.gameingUI.cardList.length ; i ++){
                    cc.gameingUI.cardList[i].destroy();

                }
                cc.gameingUI.Failure(data);
                cc.gameingUI.cardList = [];
                cc.gameingUI.bottomCards = [];
                cc.gameingUI.chooseCardDataList = [];
                cc.winID = [];
            }

        });



        this.node.off('add-card-to-player',()=>{
            if (global.playerData.accountID === global.playerData.masterID) {
                for (let i = 0; i <bottomCardData.length; i++) {
                    let card = cc.instantiate(cc.gameingUI.cardPrefab);
                    card.status = SITDOWN;
                    card.isChiose = false;
                    card.parent = cc.gameingUI.gameingUI.getChildByName('cardHuaDong');
                    card.scale = 0.7;
                    card.x = card.width * 0.5 * (17 - 1) * -0.3 + card.width * 0.3 * cc.gameingUI.cardList.length;
                   // card.y = -520;
                    card.getComponent('card').showCard(bottomCardData[i], global.playerData.accountID);
                    cc.gameingUI.cardList.push(card);
                }
                cc.gameingUI.sortCards();
            }
        });

        //给地主添加3张底牌
        this.node.on('add-card-to-player', () => {
            if (global.playerData.accountID === global.playerData.masterID) {
                for (let i = 0; i <bottomCardData.length; i++) {
                    let card = cc.instantiate(cc.gameingUI.cardPrefab);
                    card.status = SITDOWN;
                    card.isChiose = false;
                    card.flag = false;
                    console.log('底牌 = ' + card.flag);
                    card.serverData = bottomCardData[i];
                    card.parent = cc.gameingUI.gameingUI.getChildByName('cardHuaDong');
                    card.scale = 0.7;
                    card.x = card.width * 0.5 * (17 - 1) * -0.3 + card.width * 0.3 * cc.gameingUI.cardList.length;
                   // card.y = -380;
                    card.getComponent('card').showCard(bottomCardData[i], global.playerData.accountID);
                    cc.gameingUI.cardList.push(card);
                }
                cc.gameingUI.sortCards();
            }
        });
        cc.systemEvent.off('choose-card', this.ddd);
        cc.systemEvent.on('choose-card', this.ddd);

        cc.systemEvent.off('un-choose-card', this.eee);
        cc.systemEvent.on('un-choose-card',this.eee);

    },

    ddd:function(event){
            //debugger
            let detail = event;
            cc.gameingUI.chooseCardDataList.push(detail);
        cc.audioEngine.play(cc.gameingUI.selected, false, 1);
    },
    eee:function(event){
            let detail = event;
            for (let i = 0; i < cc.gameingUI.chooseCardDataList.length; i++) {
                console.log('取消选择牌' + detail.id);
                console.log('取消选择牌' +cc.gameingUI.chooseCardDataList[i].id );
                if (cc.gameingUI.chooseCardDataList[i].id === detail.id) {
                    cc.gameingUI.chooseCardDataList.splice(i, 1);
                }
            }
        cc.audioEngine.play(cc.gameingUI.noSelected, false, 1);
    },
    //将底牌移动到上方的动作
    runCardAction(card, pos, cb) {
        let moveAction = cc.moveTo(0.5, pos);
        //let scaleAction = cc.scaleTo(0.5, 0.6);
       // card.runAction(scaleAction);
        card.runAction(cc.sequence(moveAction, cc.callFunc(() => {
             //card.destroy();
            if (cb) {
                cb();
            }
        })));
    },

    //抢完地主重新排序
    sortCards() {
        cc.gameingUI.cardList.sort(function (x, y) {
            let a = x.getComponent('card').cardData;
            let b = y.getComponent('card').cardData;
            if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
                return b.value - a.value;
            }
            if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
                return -1;
            }
            if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                return 1;
            }
            if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                return b.king - a.king;
            }
        });

        let x =  cc.gameingUI.cardList[0].x;

        for (let i = 0; i <  cc.gameingUI.cardList.length; i++) {
            if(i <=12 ){
                console.log('重新排序后牌的长度 = ' + cc.gameingUI.cardList.length);
                let card =  cc.gameingUI.cardList[i];
                //card.zIndex = i;
                card.x = x + card.width * 0.2 * i;
            }else{
                let card =  cc.gameingUI.cardList[i];
                //card.zIndex = i;
                card.x = cc.gameingUI.cardList[9].x + card.width * 0.2 * i;
            }
            console.log('重新排序后牌的长度 = ' + cc.gameingUI.cardList.length);
                let card =  cc.gameingUI.cardList[i];
                card.zIndex = i;
                card.x = x + card.width * 0.2 * i;
            }

        cc.gameingUI.referCardsPos();
    },
    //发牌
    pushCard(data) {
        console.log('data的数据' +JSON.stringify(data) );
        cc.gameingUI.cardList = [];
        cc.gameingUI.bottomCards = [];
        cc.gameingUI.chooseCardDataList = [];
        if (data) {
            data.sort(function (a, b) {
                if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
                    return b.value - a.value;
                }
                if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
                    return -1;
                }
                if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                    return 1;
                }
                if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
                    return b.king - a.king;
                }
            });
            //开始生成3副17张手牌
            for (let i = 0; i < data.length; i++) {
                    if(i<12){
                        let card = cc.instantiate(cc.gameingUI.cardPrefab);
                        card.status = SITDOWN;
                        card.isChiose = false;
                        card.flag = false;
                        card.serverData = data[i];
                        card.parent = cc.gameingUI.gameingUI.getChildByName('cardHuaDong');
                        card.scale = 0.68;
                        card.x = card.width + 200 * 0.5 * (17 - 1) * -0.25 + card.width * 0.25 * i;
                        card.getComponent('card').showCard(data[i], global.playerData.accountID);
                        cc.gameingUI.cardList.push(card);
                    }else{
                        let card = cc.instantiate(cc.gameingUI.cardPrefab);
                        card.status = SITDOWN;
                        card.isChiose = false;
                        card.flag = false;
                        card.serverData = data[i];
                        card.parent = cc.gameingUI.gameingUI.getChildByName('cardHuaDong');
                        card.scale = 0.68;
                        card.y = -120;
                        card.x = card.width + 200 * 0.93 * (17 - 1) * -0.25 + card.width * 0.25 * i;
                        card.getComponent('card').showCard(data[i], global.playerData.accountID);
                        cc.gameingUI.cardList.push(card);

                    }
            }
        }
        //三张底牌
        for (let i = 0; i < 3; i++) {
            let card = cc.instantiate(cc.gameingUI.cardPrefab);
            card.parent =cc.gameingUI.gameingUI.getChildByName('cardHuaDong');
            card.scale = 0.4;
            card.y = 830;
            card.x = (card.width * 0.4 + 20) * (3 - 1) * -0.5 + (card.width * 0.3 + 20) * i;
            cc.gameingUI.bottomCards.push(card);
        }
        console.log('cardList的牌' + this.cardList);

    },

    //生成底牌
    threeButtonCard(data){
        for (let i = 0; i < data.length; i++) {
            let card =cc.gameingUI.bottomCards[i];
            card.getComponent('card').showCard(data[i]);
        };
        cc.gameingUI.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
            let index = 0;
            const runActionCb = () => {
                index++;
                if (index === 3) {
                    cc.gameingUI.node.emit('add-card-to-player');
                }
            };
            for (let i = 0; i <cc.gameingUI.bottomCards.length; i++) {
                let card = cc.gameingUI.bottomCards[i];
                let width = card.width;
                cc.gameingUI.runCardAction(card, cc.p((card.width * 0.4 + 20) * (3 - 1) * -0.5 + (card.width * 0.3 + 20) * i, 830), runActionCb);
            }
             this.bottomCards = [];
        })));
    },
    onButtonClick(event, customData) {
        switch (customData) {
            case 'rob':
                console.log('抢');
              //cc.audioEngine.play(this.GrabLandlord, false, 1);
                cc.loader.loadRes("music/call_landlord", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });

                global.socket.notifyRobState('ok');
                this.robUI.active = false;
                break;
            case 'no-rob':
                global.socket.notifyRobState('no-ok');
                //cc.audioEngine.play(this.noGrabLandlord, false, 1);
                cc.loader.loadRes("music/not_call_landlord", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
                console.log('不抢');
                this.robUI.active = false;
                break;
            case 'no-push':
                console.log('不出')
               // cc.audioEngine.play(this.noPush, false, 1);
                cc.loader.loadRes("music/pass_1", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
                for (let i = 0; i < this.cardList.length; i++) {
                    this.cardList[i].emit('init-y', this.chooseCardDataList);
                }
                this.chooseCardDataList = [];
                for (let i = 0; i < this.cardList.length; i++) {
                    this.cardList[i].emit('init-y', this.chooseCardDataList);
                }
                this.chooseCardDataList = [];
                this.playUI.active = false;
                global.socket.requestPlayerPushCard([], () => {
                    console.log('不出牌回调');
                });
                break;
            case 'tip':
                console.log('提示');
                // cc.push.node.flag = true;
                if (this.tipsCardsList.length === 0) {
                    global.socket.requestTipsCards((err, data) => {
                        if (err) {
                        } else {
                            console.log('data = ' + JSON.stringify(data));
                            this.tipsCardsList = data.data;
                            console.log('this.tipsCardsList =  ' + JSON.stringify(this.tipsCardsList));
                            this.showTipsCards(this.tipsCardsList);
                            // this.tipsCardsIndex ++;
                        }
                    });
                } else {
                    // let cards = this.tipsCardsList[this.tipsCardsIndex];
                    this.showTipsCards(this.tipsCardsList);
                }
                // this.tipsCardsIndex ++;
                // if (this.tipsCardsIndex >= this.tipsCardsList.length){
                //     this.tipsCardsIndex = 0;
                // }
                break;
            case 'ok-push':
                if ( this.chooseCardDataList.length === 0) {
                    return;
                }
                global.socket.requestPlayerPushCard( this.chooseCardDataList, (err, data) => {
                    console.log('出牌后的返回data = ' + JSON.stringify(data));
                    if (err) {
                        console.log('push card err=' + err);
                        if (this.tipsLabel.string === '') {
                            this.tipsLabel.string = err;
                            setTimeout(() => {
                                this.tipsLabel.string = '';
                            }, 2000);
                        }
                        for (let i = 0; i < this.cardList.length; i++) {
                            this.cardList[i].emit('init-y', this.chooseCardDataList);
                        }
                        this.chooseCardDataList = [];

                    } else {
                        console.log('选择牌的数量是 =' + JSON.stringify(this.chooseCardDataList));
                            for (let i = 0; i < this.cardList.length; i++) {
                                this.cardList[i].emit('pushed-card', this.chooseCardDataList);
                            }
                            for (let i = 0; i < this.chooseCardDataList.length; i++) {
                                let cardData = this.chooseCardDataList[i];
                                for (let j = 0; j < this.cardList.length; j++) {
                                    let card = this.cardList[j];
                                    if (card.getComponent('card').id === cardData.id) {
                                        this.cardList.splice(j, 1);
                                    }
                                }
                        }
                        console.log('出牌成功 = ' + JSON.stringify(data));
                        this.playUI.active = false;
                        this.chooseCardDataList = [];
                        this.referCardsPos();
                    }
                });
                if(cc.gameingUI.cardList === 19){
                    // global.socket.notifyEnd('end game');
                    cc.director.loadScene('hallScene');
                }
                console.log('出牌');
                break;
            default:
                break;
        }
    },
    //刷新牌的操作
    referCardsPos() {
        for (let i = 0; i < cc.gameingUI.cardList.length; i++) {
                if(i<=12){
                    let card = cc.gameingUI.cardList[i];
                    let width = card.width;
                    card.x = (cc.gameingUI.cardList.length - 1) * width * 0.52 * -0.25 + width * 0.25 * i;
                    card.y = 0;
                }else{
                    let card = cc.gameingUI.cardList[i];
                    let width = card.width;
                    card.x = (cc.gameingUI.cardList.length - 1) * width * 1.19 * -0.25 + width * 0.25 * i;
                    card.y = -120;
                }

        }
    },
    //提示牌的操作
    showTipsCards(cardsList) {
        if (cardsList.length === 0) {
            if (this.tipsLabel.string === '') {
                this.tipsLabel.string = '你没有大过上家的牌形';
                setTimeout(() => {
                    this.tipsLabel.string = '';
                }, 2000);
            }
            return;
        }
        let cards = cardsList[this.tipsCardsIndex];
         for (let i = 0; i < this.cardList.length; i++) {
                this.cardList[i].emit('init-y');
        }
        // cc.push.flag = true;
        for (let i = 0; i < this.cardList.length; i++) {
            // init-y
            this.cardList[i].emit('tips-card', cards);
        }
        this.tipsCardsIndex++;
        if (this.tipsCardsIndex >= cardsList.length) {
            this.tipsCardsIndex = 0;
        }
    },
    //生成胜利的预制体
    Victory(data){
        let victory = cc.instantiate(cc.gameingUI.victory);
        console.log('胜利的名字 = ' +cc.gameingUI.victory.name);
        victory.getComponent('finish').initWithData(data);
        cc.gameingUI.node.addChild(victory);
    },
    //生成失败的预制体
    Failure(data){
        let failure = cc.instantiate(cc.gameingUI.failure);
        console.log('失败的名字 = ' +failure.name);
        failure.getComponent('finish').initWithData(data);
        cc.gameingUI.node.addChild(failure);
    },
});