import global from './../global'
var audioPlayer = require('audioPlayer');
cc.Class({
    extends: cc.Component,
    properties: {
    },

    onLoad () {
        global.socket.onPushCardLeiXing((data) => {
            console.log('牌型rrrrrr = ' + JSON.stringify(data.cards));
            console.log('牌型rrrrrr = ' + JSON.stringify(data.cardsValue.name));
            console.log('牌型rrrrrr = ' + JSON.stringify(data.cards[0].value));
            if(data.cardsValue.name == 'One'){  //单张
                switch (data.cards[0].value) {

                    case 1 :
                        cc.loader.loadRes("music/1_3", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 2 :
                        cc.loader.loadRes("music/1_4", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 3 :
                        cc.loader.loadRes("music/1_5", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 4 :
                        cc.loader.loadRes("music/1_6", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 5 :
                        cc.loader.loadRes("music/1_7", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 6 :
                        cc.loader.loadRes("music/1_8", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 7 :
                        cc.loader.loadRes("music/1_9", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 8 :
                        cc.loader.loadRes("music/1_10", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 9 :
                        cc.loader.loadRes("music/1_11", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 10 :
                        cc.loader.loadRes("music/1_12", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 11 :
                        cc.loader.loadRes("music/1_13", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 12 :
                        cc.loader.loadRes("music/1_14", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 13 :
                        cc.loader.loadRes("music/1_15", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;

                    default:
                        if(data.cards[0].king === 14 ){
                            cc.loader.loadRes("music/1_16", cc.AudioClip, function (err, AudioClip) {
                                audioPlayer.playYinXiao(AudioClip);
                            });
                        }else {
                            cc.loader.loadRes("music/1_17", cc.AudioClip, function (err, AudioClip) {
                                audioPlayer.playYinXiao(AudioClip);
                            });
                        }
                        break;
                }
            }else if(data.cardsValue.name == 'Double') {  //对子
                switch (data.cards[0].value) {

                    case 1 :
                        cc.loader.loadRes("music/2_3", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 2 :
                        cc.loader.loadRes("music/2_4", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 3 :
                        cc.loader.loadRes("music/2_5", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 4 :
                        cc.loader.loadRes("music/2_6", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 5 :
                        cc.loader.loadRes("music/2_7", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 6 :
                        cc.loader.loadRes("music/2_8", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 7 :
                        cc.loader.loadRes("music/2_9", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 8 :
                        cc.loader.loadRes("music/2_10", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 9 :
                        cc.loader.loadRes("music/2_11", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 10 :
                        cc.loader.loadRes("music/2_12", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 11 :
                        cc.loader.loadRes("music/2_13", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 12 :
                        cc.loader.loadRes("music/2_14", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 13 :
                        cc.loader.loadRes("music/2_15", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                }
            }else if(data.cardsValue.name == 'Three') {  //三条
                switch (data.cards[0].value) {

                    case 1 :
                        cc.loader.loadRes("music/3_3", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 2 :
                        cc.loader.loadRes("music/3_4", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 3 :
                        cc.loader.loadRes("music/3_5", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 4 :
                        cc.loader.loadRes("music/3_6", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 5 :
                        cc.loader.loadRes("music/3_7", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 6 :
                        cc.loader.loadRes("music/3_8", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 7 :
                        cc.loader.loadRes("music/3_9", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 8 :
                        cc.loader.loadRes("music/3_10", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 9 :
                        cc.loader.loadRes("music/3_11", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 10 :
                        cc.loader.loadRes("music/3_12", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 11 :
                        cc.loader.loadRes("music/3_13", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 12 :
                        cc.loader.loadRes("music/3_14", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 13 :
                        cc.loader.loadRes("music/3_15", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                }
            }else  if(data.cardsValue.name == 'Boom'){   //炸弹
                switch (data.cards.length) {
                    case 2 :
                        cc.loader.loadRes("music/kings_2", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                        break;
                    case 4 :
                        cc.loader.loadRes("music/zhadan", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
                }
            }else  if(data.cardsValue.name == 'ThreeWithOne'){    //三带一
                        cc.loader.loadRes("music/3_with_1", cc.AudioClip, function (err, AudioClip) {
                            audioPlayer.playYinXiao(AudioClip);
                        });
            }else  if(data.cardsValue.name == 'ThreeWithTwo'){    //三带二
                cc.loader.loadRes("music/3_with_2", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            }/*else  if(data.cardsValue.name == 'FourWithOne') {    //四带一
                cc.loader.loadRes("music/4_1", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            }*/
            else  if(data.cardsValue.name == 'FourWithTow'){    //四带二
                cc.loader.loadRes("music/4_2", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            }else  if(data.cardsValue.name == 'Plane'){    //飞机
                cc.loader.loadRes("music/feiji", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            } else  if(data.cardsValue.name == 'PlaneWithOne'){    //飞机带翅膀
                cc.loader.loadRes("music/feiji_daichibang", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            }else  if(data.cardsValue.name == 'PlaneWithTwo'){    //飞机带翅膀
                cc.loader.loadRes("music/feiji_daichibang", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            } else  if(data.cardsValue.name == 'Scroll'){    //顺子
                cc.loader.loadRes("music/shun", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            }else  if(data.cardsValue.name == 'DoubleScroll'){    //连队
                cc.loader.loadRes("music/liandui", cc.AudioClip, function (err, AudioClip) {
                    audioPlayer.playYinXiao(AudioClip);
                });
            }



        });
    },
   /* start () {
    },*/
});
