var apmdata = {
	version : "2.3.5.2",
	host_or : "localhost:4209"
};
apmdata.checkSecure = function() { // index
    if (window.location.protocol == "http:" && window.location.host == apmdata.baseHost) { // Trick redirect segure
        window.location.href = "https://" + window.location.href.substring(window.location.href.indexOf(window.location.host));
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('assets/js/workerqa.js');
    }
};
apmdata.checkSource = function() {
    if (!window.localStorage.getItem("APM_DATA")) {
        var org = window.localStorage.getItem("ORG");
        if (org) {
            org = JSON.parse(org);
            if (org.origin) {
                window.location.href = "https://" + org.origin;
            } else {
                window.location.href = "https://" + apmdata.host_or;
            }
        }
    }
};
apmdata.fgprm = function() { // Only for developer
    function fgprm(parameterName) {
        var result = null,
            tmp = [];
        location.search
            .substr(1)
            .split("&")
            .forEach(function(item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }
    var _be = fgprm("be");
    if (_be != null) {
        var be = new AesUtil().decrypt(_be);
        window.localStorage.setItem("APM_DATA", be);
    }
};

apmdata.checkData = function(origin){ // body
    if(window.localStorage.getItem("APM_DATA")){
        window.localStorage.setItem("ORG", JSON.stringify({origin : origin}))
        window.location.href = "https://"+apmdata.host_be;
    }
};
apmdata.background = function(){

    var timeLoop, timeWait, total = 7;

    var loopBack = function(seconds, count, index){
        index = (typeof(index)=="undefined")?1:index;
        var img = document.createElement("img");
            img.src = 'https://'+apmdata.baseHost+'/source/img/background/'+((count == index)?1:(index))+'.jpg'; 
            img.onload = function () {
                timeLoop = window.setTimeout(function(){
                    var toRemove;
                    if(index==1){
                        toRemove = count;
                    } else {
                        toRemove = index-1;
                    }
                    document.querySelector('#tisContent').classList.add("back_"+index);
                    document.querySelector('#tisContent').classList.remove("back_"+toRemove); 
                    loopBack(seconds, count, (index == count)?1:index+1);

                }, seconds*1000);
            };
    };

    var init = (Math.floor(Math.random() * total) + 1);

    document.querySelector('#tisContent').classList.add("back_"+init);
    loopBack(20, total, (init==total)?1:(init+1));
    
    window.onbeforeunload = function (e) {
        clearTimeout(timeLoop);
        clearTimeout(timeWait);
    };

};

apmdata.render = function(_item, height, width){
    if(height <= 420){
        _item.sizeW_mgb = 1;
        _item.sizeW_img = 1;
        _item.sizeW_tit = 1;
        _item.sizeW_inp = 1;
        _item.sizeWidthImg = "60%";
    } else if(width < 420){
        _item.sizeW_mgb = 3;
        _item.sizeW_img = 2;
        _item.sizeW_tit = 3;
        _item.sizeW_inp = 1;
        _item.sizeWidthImg = "80%";
    } else if(height <= 530){
        _item.sizeW_mgb = 1;
        _item.sizeW_img = 2;
        _item.sizeW_tit = 2;
        _item.sizeW_inp = 2;
        _item.sizeWidthImg = "100%";
    } else {
        _item.sizeW_mgb = 1;
        _item.sizeW_img = 3;
        _item.sizeW_tit = 3;
        _item.sizeW_inp = 3;
        _item.sizeWidthImg = "100%";
    }
};

apmdata.getProfile = function(profiles){
    var defaultProfile = profiles[0].id;
    var finded = profiles.filter((profile) => profile.default == "1");
    if(finded.length>0){
        return finded[0].id;
    }
    return defaultProfile;
};