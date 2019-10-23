import global from './../global'
var audioPlayer = require('audioPlayer');
cc.Class({
    extends: cc.Component,
    properties: {
        readyButton: cc.Node,
        gameStartButton: cc.Node,
        gameBeforUI: cc.Node
    },
    onLoad(){
        cc.loader.loadRes("music/bgMain", cc.AudioClip, function (err, AudioClip) {
            audioPlayer.playerBgMusic(AudioClip);
        });
        cc.again = this; //again重来一局的全局变量
        this.node.on('init', ()=>{
            if (global.playerData.houseMangerID === global.playerData.accountID){
                cc.again.readyButton.active = false;
                cc.again.gameStartButton.active = true;

            }else {
                cc.again.readyButton.active = true;
                cc.again.gameStartButton.active = false;
            }
        });
        //开始游戏，按钮设置为false；
        global.socket.onGameStart(()=>{
            cc.again.gameBeforUI.active = false;
        });

        //确定房主
        global.socket.onChangeHouseManager((data)=>{
            global.playerData.houseMangerID = data;
            if (global.playerData.accountID === data){
                cc.again.readyButton.active = false;
                cc.again.gameStartButton.active = true;
            }
        });
    },

//清除自己出的牌
    clearCard() {
        let len = cc.again.node.getChildByName('gameingUI');
        let ch = len.getChildByName('pushCardNode');
        let clen = ch.children.length;
        for (let i =0;i<clen;i++) {
            console.log('获取这个节点的子节点长度！'+i);
            ch.children[i].destroy();
        }

    },
    //重玩的按钮显示
     restart(a,b){
         this.gameBeforUI.active=true;
         this.readyButton.active = a;
         this.gameStartButton.active = b;
     },
    //关闭BUTTON按钮的状态
    rgButton(a){
        cc.again.gameBeforUI.active = false;
    },


    //销毁输赢预制体
    destruction(){
        if(global.playerData.accountID === cc.winID) {
            let toDestruction =cc.find('Canvas').getChildByName('victory');
            toDestruction.destroy();
        }else{

            let toDestruction =cc.find('Canvas').getChildByName('failure');
            toDestruction.destroy();
        }
    },
    onButtonClick(event, customData){
        switch (customData){
            case 'ready':
                console.log('ready');
                global.socket.notifyReady();
                break;
            case 'start-game':
                console.log('start game');
                global.socket.requestStartGame((err, data)=>{
                    if (err){
                        console.log('err = ' + err);
                    }else {
                        console.log('game start data = ' + data);
                    }
                });
                break;

            default:
                break;
        }
    },
})