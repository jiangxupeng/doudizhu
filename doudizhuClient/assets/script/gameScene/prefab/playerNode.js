import global from "../../global";

cc.Class({
    extends: cc.Component,
    properties: {
        headImage: cc.Sprite,
        idLabel: cc.Label,
        nickNameLabel: cc.Label,
        goldLabel: cc.Label,
        readyIcon: cc.Node,
        offlineIcon: cc.Node,
        cardsNode: cc.Node,
        pushCardNode: cc.Node,
        cardPrefab: cc.Prefab,
        tipsLabel: cc.Label,
        infoNode: cc.Node,
        timeLabel: cc.Label,
        robIconSp: cc.Sprite,
        masterIcon: cc.Node,
        robIcon: cc.SpriteFrame,
        noRobIcon: cc.SpriteFrame
    },
    onLoad() {
        cc.rob = this;
        this.cardList = [];
        this.readyIcon.active = false;
        this.offlineIcon.active = false;
        this.node.on('game-start', () => {
            this.readyIcon.active = false;
        });
        this.node.on('push-card', () => {
            if (this.accountID !== global.playerData.accountID) {
                this.pushCard();
            }
        });

        //轮流抢地主的UI显示
        this.node.on('can-rob-mater', (event) => {
            console.log('can-rob-mater = ' +  JSON.stringify(event));
            let detail = event;
            if (detail === this.accountID && detail !== global.playerData.accountID) {
                this.infoNode.active = true;
                this.tipsLabel.string = '正在抢地主';
                this.timeLabel.string = '5';
            }
        });
        this.node.on('rob-state', (event) => {
            let detail = event;
            console.log(' player node  rob state detail = ' + JSON.stringify(event));
            if (detail.accountID === this.accountID) {
                this.infoNode.active = false;
                switch (detail.value) {
                    case 'ok':
                        this.robIconSp.node.active = true;
                        this.robIconSp.spriteFrame = this.robIcon;
                        break;
                    case 'no-ok':
                        this.robIconSp.node.active = true;
                        this.robIconSp.spriteFrame = this.noRobIcon;
                        break;
                    default:
                        break;
                }
            }
        });

        //确定地主
        this.node.on('change-master', (event) => {
            let detail = event;
            this.robIconSp.node.active = false;
            if (detail === this.accountID) {
                cc.rob.masterMax = this.accountID;
                this.masterIcon.active = true;
                this.masterIcon.scale = 0.6;
                this.masterIcon.runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
            }
        });

        //给地主头像加3张背面牌
        this.node.on('add-three-card', (event) => {
            let detail = event;
            if (detail === this.accountID) {
                for (let i = 0; i < 3; i++) {
                    this.pushOneCard();
                }
                // let cardCount = cc.find('Canvas').getChildByName('playerPosNode').getChildByName(this.accountID).getChildByName('cardsNode').getChildByName('cardCount');
                // cardCount.getComponent(cc.Label).string = this.cardList.length;
                console.log('背面的长度='+ this.cardsNode.children.length);
            }
        });

        //接收到玩家出牌的消息
        this.node.on('player-push-card', (event) => {
            let detail = event;
            //如果是本人出的牌就不接收出牌消息
            if (detail.accountID === this.accountID && this.accountID !== global.playerData.accountID) {
                this.playerPushCard(detail.cards);
            }
        });

        //结算回传的数据
        this.node.on('settle-accounts', (event) => {
            //let detail = event.detail;
        });
    },
    //再来一局false上一局的地主
    masterIconOff(a){
        console.log('屏蔽庄UI');
        console.log(cc.find('Canvas').getChildByName('playerPosNode'));
        console.log(cc.find('Canvas').getChildByName('playerPosNode').getChildByName(cc.rob.masterMax));
        if(cc.find('Canvas').getChildByName('playerPosNode').getChildByName(cc.rob.masterMax)){
            cc.find('Canvas').getChildByName('playerPosNode').getChildByName(cc.rob.masterMax).getChildByName('masterIcon').active = a;
        }

        //cc.rob. = a;
    },


    //初始化玩家头像
    initWithData(data, index,findNode) {
        this.accountID = data.accountID;
        //this.idLabel.string = 'ID:' + data.accountID;//玩家ID
        this.nickNameLabel.string = data.nickName;//玩家名字
       // this.goldLabel.string = data.gold; //玩家金币
        this.index = index; //玩家座位号
        this.node.name = data.accountID;
        //加载玩家头像
        cc.loader.load({url: data.avatarUrl, type: 'jpg'}, (err, tex) => {
            let oldWidth = this.headImage.node.width;
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            this.headImage.node.scale = oldWidth / newWidth;
        });
        //结算时删除玩家背面牌和显示在玩家头像的牌
        global.socket.onSettlement((data)=>{
            cc.winID = data.winId;
            let playerData = data.roomPlayerList;
            for(let i=0;i<data.roomPlayerList.length;i++){
                console.log('当前玩家ID' + global.playerData.accountID);
                console.log('返回的ID' +  playerData[i].accountID);
                console.log('赢的ID' +  data.winId);
                //如果当前玩家ID === 返回的玩家ID 并且 ===赢的ID，删除赢的ID，否则删除输的人的牌节点
                if(global.playerData.accountID === playerData[i].accountID && global.playerData.accountID === data.winId){
                    //获取显示在玩家头像牌的节点
                    let puNode =cc.find('Canvas').getChildByName('playerPosNode').getChildByName(playerData[i].accountID);
                    //获取玩家背面牌的节点
                    let carNode = cc.find('Canvas').getChildByName('playerPosNode').getChildByName(playerData[i].accountID).getChildByName('cardsNode');
                    console.log(carNode.children.length);
                    console.log('ccccccc' + puNode.getChildByName('pushCardNode').children.length)

                    puNode.getChildByName('pushCardNode').destroyAllChildren();

                    //销毁玩家背面牌的节点
                    carNode.destroyAllChildren();


                }else {
                    //获取显示在玩家头像牌的节点
                    let noWinNode = cc.find('Canvas').getChildByName('playerPosNode').getChildByName(playerData[i].accountID);
                    //获取玩家背面牌的节点
                    let noCardsNode = cc.find('Canvas').getChildByName('playerPosNode').getChildByName(playerData[i].accountID).getChildByName('cardsNode');
                    console.log('dfdsfad;las = >' + noWinNode.getChildByName('pushCardNode').children.length)
                    console.log('名字 = >' + playerData[i].accountID)
                    noWinNode.getChildByName('pushCardNode').destroyAllChildren();
                    //销毁玩家背面牌的节点
                    noCardsNode.destroyAllChildren();
                }
            }
        });

        //接收到玩家准备消息，头像显示准备状态
        this.node.on('player_ready', (event) => {
            let detail = event;
            console.log('player ready = ' + detail);
            if (detail === this.accountID) {
                this.readyIcon.active = true;
            }
        });
        //判断玩家的位置1或2；
        if (index === 1) {
            if(findNode){
                console.log('重新进入不转向')
            }else{
                this.cardsNode.x *= -1;
                this.pushCardNode.x *= -1;
                //this.pushCardNode.x *=43;
            }

        }

    },
    //生成玩家头像背面牌
    pushCard() {
        this.cardList = [];
        this.cardsNode.active = true;

        for (let i = 0; i < 17; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.cardsNode;
            console.log('背面牌的X坐标 = ' +this.cardsNode.x );
            card.scale = 0.4;
            let height = card.height;
            card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
            this.cardList.push(card);
        }
        // let cardCount = cc.find('Canvas').getChildByName('playerPosNode').getChildByName(this.accountID).getChildByName('cardsNode').getChildByName('cardCount');
        // console.log('rrrrrrrrr' +cardCount);
        // debugger
        // cardCount.zIndex = 99;
    },

    //抢完地主后另外两个玩家添加的三张背面牌
    pushOneCard() {
        let card = cc.instantiate(this.cardPrefab);
        card.parent = this.cardsNode;
        card.scale = 0.4;
        let height = card.height;
        card.y = (17 - 1) * 0.5 * height * 0.4 * 0.3 - this.cardList.length * height * 0.4 * 0.3;
        this.cardList.push(card);
    },
    playerPushCard(cardsData) {
        for (let i = 0 ; i < this.pushCardNode.children.length ; i ++){
            this.pushCardNode.children[i].destroy();
        }
        if(cc.winID != undefined){
            return;
        }
        for (let i = 0; i < cardsData.length; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.pushCardNode;
            card.scale = 0.4;
            let height = card.height;
            card.y = (cardsData.length - 1) * 0.5 * height * 0.2 * 0.3 - i * height * 0.4 * 0.3;
            card.getComponent('card').showCard(cardsData[i]);
        }
        console.log('数量 =>' + this.pushCardNode.children.length)
        //每出一次牌，就销毁玩家头像旁的牌的相应数量
        for (let i = 0; i < cardsData.length; i++) {
            let card = this.cardList.pop();
            card.destroy();
        }
        this.referCardPos();


    },
    //重连后加载牌
    playerPushCardB(cardsData) {
        this.cardsNode.active = true;
        for (let i = 0; i < cardsData.length; i++) {
            let card = cc.instantiate(this.cardPrefab);
            card.parent = this.cardsNode;
            console.log('重连后的节点的X坐标 = ' +this.cardsNode.x );
            card.scale = 0.4;
            let height = card.height;
            card.y = (cardsData.length - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
            console.log('重连后的背面牌的X坐标 = ' + card.x );
            console.log('重连后的背面牌的Y坐标 = ' + card.y );
            this.cardList.push(card);
        }
        this.referCardPos();
    },


    //重新刷新牌的位置
    referCardPos() {
        for(let i = 0 ; i < this.cardList.length ; i ++){
            let card = this.cardList[i];
            let height = card.height;
            card.y = (this.cardList.length - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
        }
    }
});

    //出的牌显示在玩家头像旁
//     playerPushCard(cardsData) {
//         this.card = [];
//         //删除上一轮玩家出的牌
//         for (let i = 0 ; i < this.pushCardNode.children.length ; i ++){
//             this.pushCardNode.children[i].destroy();
//         }
//         if(cc.winID != undefined){
//             return;
//         }
//             //显示出在玩家头像旁的牌
//             for (let i = 0; i < cardsData.length; i++) {
//                 let card = cc.instantiate(this.cardPrefab);
//                 card.parent = this.pushCardNode;
//                 card.scale = 0.5;
//                 if (cc.rob.index === 1) {
//                     if (cardsData) {
//                         cardsData.sort(function (a, b) {
//                             if (a.hasOwnProperty('value') && b.hasOwnProperty('value')) {
//                                 return b.value - a.value;
//                             }
//                             if (a.hasOwnProperty('king') && !b.hasOwnProperty('king')) {
//                                 return -1;
//                             }
//                             if (!a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
//                                 return 1;
//                             }
//                             if (a.hasOwnProperty('king') && b.hasOwnProperty('king')) {
//                                 return b.king - a.king;
//                             }
//                         });
//                         card.x = card.width + 200 * 0.2 * (17 - 1) * -0.25 + card.width * 0.25 * i;
//                     }
//                 } else {
//                     card.zIndex = cardsData.length - i;
//                     card.x = (card.width + 200 * 0.2 * (17 - 1) * -0.25 + card.width * 0.25 * i) * -1;
//                 }
//                 card.getComponent('card').showCard(cardsData[i]);
//             }
//
//             //每出一次牌，就销毁玩家背面牌的相应数量
//             for (let i = 0; i < cardsData.length; i++) {
//                 console.log('销毁背面牌' + i);
//                 let card = this.cardList.pop();
//                 card.destroy();
//             }
//         // let cardCount = cc.find('Canvas').getChildByName('playerPosNode').getChildByName(this.accountID).getChildByName('cardsNode').getChildByName('cardCount');
//         //
//         // cardCount.getComponent(cc.Label).string = this.cardList.length;
//             //每出一次刷新一次牌的位置
//             //this.referCardsNodeCardPos();
//        // }
//
//     },
//         //重连后加载牌
//     playerPushCardB(cardsData) {
//         this.cardsNode.active = true;
//         for (let i = 0; i < cardsData.length; i++) {
//             let card = cc.instantiate(this.cardPrefab);
//             card.parent = this.cardsNode;
//             console.log('重连后的节点的X坐标 = ' +this.cardsNode.x );
//             card.scale = 0.4;
//             let height = card.height;
//             card.y = (cardsData.length - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
//             console.log('重连后的背面牌的X坐标 = ' + card.x );
//             console.log('重连后的背面牌的Y坐标 = ' + card.y );
//             this.cardList.push(card);
//         }
//         this.referCardPos();
//     },
//
//
//     //重新刷新牌的位置
//     referCardPos() {
//         for(let i = 0 ; i < this.cardList.length ; i ++){
//             let card = this.cardList[i];
//             let height = card.height;
//             card.y = (this.cardList.length - 1) * 0.5 * height * 0.4 * 0.3 - height * 0.4 * 0.3 * i;
//         }
//     },
// });