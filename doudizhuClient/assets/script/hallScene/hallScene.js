import global from './../global'
cc.Class({
    extends: cc.Component,

    properties: {
        nickNameLabel: cc.Label,
        idLabel: cc.Label,
        goldCountLabel: cc.Label,
        headImage: cc.Sprite,
        createRoomPrefab: cc.Prefab,
        joinRoomPrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nickNameLabel.string = global.playerData.nickName;
        this.idLabel.string = 'ID:' + global.playerData.accountID;
        this.goldCountLabel.string = global.playerData.goldCount;

        cc.loader.load({url: global.playerData.avatarUrl, type: 'jpg'},  (err, tex)=> {
            cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
            let oldWidth = this.headImage.node.width;
            console.log('old withd' + oldWidth);
            this.headImage.spriteFrame = new cc.SpriteFrame(tex);
            let newWidth = this.headImage.node.width;
            console.log('old withd' + newWidth);
            this.headImage.node.scale = oldWidth / newWidth * 0.9;
        });
    },

    globalProper(data){
        console.log('join room =' + JSON.stringify(data));
        global.playerData.bottom = data.data.bottom;//底牌
        global.playerData.rate = data.data.rate;//倍数
        cc.director.loadScene('gameScene');
    },

    //重连操作
    start () {
        global.socket.requestReConnection(global.playerData.accountID,(err,data)=>{

            if(err){
                console.log(err);
            }else{
                global.master = data.data.master.uniqueID;//地主
                console.log('查询玩家的游戏信息为'+ JSON.stringify(data))
                global.socket.requestJoinRoom(data.data.roomID,(err, data)=>{
                    if (err){
                        console.log('err = ' + err);
                    }else {
                        this.globalProper(data)
                    }
                });
            }

        });    //  查询玩家是否正在进行游戏
    },

    onButtonClick(event, customData){
        switch (customData){
            case 'create_room':
                console.log('create room');
                // global.socket.c
                let createRoom = cc.instantiate(this.createRoomPrefab);
                createRoom.parent = this.node;
                break;
            case 'join_room':
                console.log('join room');
                let joinRoom = cc.instantiate(this.joinRoomPrefab);
                joinRoom.parent = this.node;
                break;
            default:
                break;
        }
    }
});
