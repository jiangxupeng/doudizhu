import global from "../../global";
var audioPlayer = require('audioPlayer');
cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel1: cc.Label,
        goldLabel1: cc.Label,
        nickNameLabel2: cc.Label,
        goldLabel2: cc.Label,
        nickNameLabel3: cc.Label,
        goldLabel3: cc.Label,
        exitButton: cc.Node,
        reStartButtton: cc.Node
    },
    initWithData(data){
        console.log('data的数据 = ' + JSON.stringify(data));
        this.nickNameLabel1.string = data.roomPlayerList[0].nickName;
        this.goldLabel1.string  = data.roomPlayerList[0].gold;
        this.nickNameLabel2.string =data.roomPlayerList[1].nickName;
        this.goldLabel2.string  = data.roomPlayerList[1].gold;
        this.nickNameLabel3.string =data.roomPlayerList[2].nickName;
        this.goldLabel3.string  =data.roomPlayerList[2].gold;
    },
    onButtonClick(event, customData){
        switch (customData){
            case 'restart':
                console.log('上局的房主ID = ' + global.playerData.houseMangerID);
                console.log('这个玩家ID = ' + global.playerData.accountID);
                //cc.CancelToMonitor.removeListener('player_ready');
                //cc.CancelToMonitor.removeListener('game_start');
                //cc.CancelToMonitor.removeListener('player-rob-state');
               // cc.CancelToMonitor.removeListener('show-bottom-card');
               // cc.CancelToMonitor.removeListener('can-push-card');
               // cc.CancelToMonitor.removeListener('push_card');
                //cc.CancelToMonitor.removeListener('layer-rob-state');
               // cc.CancelToMonitor.removeListener('settle-accounts');

                cc.loader.loadRes("music/bgMain", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.resumeBgMusic(AudioClip);
                });
                cc.rob.masterIconOff(false);
                cc.again.clearCard();//销毁玩家出的牌
                cc.again.destruction();//销毁输赢预制体
               // debugger
                if (global.playerData.accountID === global.playerData.houseMangerID) {
                    cc.again.restart(false,true);   //again,再来一局；重新开始的按钮显示
                    } else {
                    cc.again.restart(true,false);   //again,再来一局；重新开始的按钮显示
                    }
                cc.winID = undefined;
                break;
            case 'exit':
                //取消监听事件
                cc.CancelToMonitor.removeAllListeners();
                cc.CancelToMonitor.removeListener('player_ready');
                cc.CancelToMonitor.removeListener('game_start');
                cc.CancelToMonitor.removeListener('player-rob-state');
                cc.CancelToMonitor.removeListener('show-bottom-card');
                cc.CancelToMonitor.removeListener('can-push-card');
                cc.CancelToMonitor.removeListener('push_card');
                cc.CancelToMonitor.removeListener('layer-rob-state');
                cc.CancelToMonitor.removeListener('settle-accounts');

                cc.again.clearCard();//销毁玩家出的牌
                cc.again.destruction();//销毁输赢预制体
                cc.gameScene. destruction();//销毁玩家头像
                global.socket.requestExit({
                                   accountID: global.playerData.accountID,
                               },(err, result)=>{
                                   if (err){
                                       console.log('err = ' + err);
                                   }else {
                                       console.log('退出返回的数据 = ' + JSON.stringify(result));
                                       global.playerData.goldCount = result.data.gold;
                                       cc.gameingUI = undefined;
                                       cc.director.loadScene('hallScene');
                                   }
                               });
                break;
            default:
                break;
        }
    }

});
