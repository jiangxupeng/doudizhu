import EventListener from './../utility/event-listener'
const SocketController  = function () {
    let that = {};
    let _socket = io(defines.serverUrl);
    let _callBackMap = {};
    let _callBackIndex = 0;
    let _event = EventListener({});

    cc.CancelToMonitor = _event;  //全局，取消监听事件
    // socket.on('connection', ()=>{
    //    console.log('链接成功');
    // });
    //

    _socket.on('notify', (data)=>{
        console.log('notify = ' + JSON.stringify(data));
        let callBackIndex = data.callBackIndex;
        if (_callBackMap.hasOwnProperty(callBackIndex)){
            let cb = _callBackMap[callBackIndex];
            if (data.data.err){
                cb(data.data.err);
            }else {
                cb(null,data.data);

            }
        }
        let type = data.type;
        _event.fire(type, data.data);

    });


    // _socket.on('start',(data) => {
    //     console.log(data);
    //     _socket.emit('yes',data.player.accountID);
    // });
    //
    // _socket.on('reconnection',(data) => {
    //     console.log('重连的的房间号码 = '+data)
    //     that.requestJoinRoom(data,(err, data)=>{
    //         if (err){
    //             console.log('err = ' + err);
    //         }else {
    //             cc.hallScene.globalProper(data)
    //         }
    //     });
    // });

    that.init = function () {

    };
    // that.requestWxLogin = function (data, cb) {
    //     socket.emit('wx-login', data);
    // };
    const notify = function (type, data, callBakIndex) {
        _socket.emit('notify', {type: type,  data: data, callBackIndex: callBakIndex});
    };

    const request = function (type,data, cb) {
        _callBackIndex ++;
        _callBackMap[_callBackIndex] = cb;
        notify(type, data, _callBackIndex);
    };
    
    that.requestLogin = function (data,cb) {
        request('login',data,cb);
    };
    that.requestCreateRoom = function (data, cb) {
        request('create_room', data, cb);
    };
    that.requestJoinRoom = function (data, cb) {
        request('join_room', data, cb);
    };
    //加入房间成功后，返回玩家相关信息(座位号)，用来显示头像框的信息
    that.requestEnterRoomScene = function (cb) {
        request('enter_room_scene', {},cb);
    };
    that.requestStartGame = function (cb) {
        request('start_game', {}, cb);
    };

    that.requestPlayerPushCard = function (value, cb) {

        request('myself-push-card', value, cb);
    };
    that.requestTipsCards = function (cb) {
        request('request-tips', {}, cb);
    };

    that.notifyReady = function () {
        notify('ready', {}, null);
    };

    that.notifyRobState = function (value) {
        notify('rob-state', value, null);
    };
    //退出游戏
    that.requestExit= function(data,cb){        //离开
        request('leave_room',data,cb)
    };


    that.onPlayerJoinRoom = function (cb) {
        _event.removeListener('player_join_room');
        _event.on('player_join_room', cb);
    };
    that.onPlayerReady = function (cb) {
        //_event.removeListener('player_ready');
        _event.on('player_ready', cb);
    };
    that.onGameStart = function (cb) {
        //_event.removeListener('game_start');
        _event.on('game_start', cb);
    };
    that.onChangeHouseManager = function (cb) {
        _event.removeListener('change_house_manager');
        _event.on('change_house_manager', cb);
    };
    that.onPushCard = function (cb) {
       // _event.removeListener('push_card');
        _event.on('push_card', cb);
    };
    //可以抢地主的人
    that.onCanRobMater = function (cb) {
       //_event.removeListener('can-rob-master');
        _event.on('can-rob-master', cb);
    };
    that.onPlayerRobState = function (cb) {
       //_event.removeListener('layer-rob-state');
        _event.on('player-rob-state', cb);
    };
    that.onChangeMaster = function (cb) {
        _event.removeListener('change-master');
        _event.on('change-master', cb);
    };
    that.onShowBottomCard = function (cb) {
        _event.removeListener('show-bottom-card');
        _event.on('show-bottom-card', cb);
    };
    that.onCanPushCard = function (cb) {
      // _event.removeListener('can-push-card');
        _event.on('can-push-card', cb);
    };
    that.onPlayerPushCard = function (cb) {
        //_event.removeListener('player-push-card');
        _event.on('player-push-card', cb);
    };

    that.onPushCardLeiXing = function (cb) {  //监听出牌类型，判断音效
        //_event.removeListener('player-push-card');
        _event.on('player-push-card-type', cb);
    };

    that.onSettlement = function(cb) {
      
      //_event.removeListener('settle-accounts');
        _event.on('settle-accounts',cb);
    };

    that.notifyPlayerLeave = function (cb) {   //  离开
        _event.on('leave-player', cb);
    };

    that.requestReConnection = function (data,cb) {        //  查询玩家游戏信息
        // _socket.emit('select_game',data);
        request('select_game', data, cb);
    };
    // that.onReExit = function(cb) {
    //     _event.on('re-exit',cb);
    // };



    return that;
};

export default SocketController;