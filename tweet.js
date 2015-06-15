function Twitter(param) {
    this.geo = param.geo;
}
Twitter.prototype = {
    consumerKey:    "f8t4MamjZIHhhn2xUCFQ3x5mP",
    consumerSecret: "TmchhnbhFY0fwYaEa0QMBnVFKKP5DVFiOmjuO4qqYjRTKzOwXd",
    accessToken:    "3244863727-2Gfb8WnYIPEFGygyVflxoc6ZQYzKqCOjYBE5kc9",
    tokenSecret:    "GVheJ5M2x4E7dOjOWR4pwePhm7DtFnK2H018sfX68BgGf"
};
Twitter.prototype.get = function(api, content) {
    var accessor = {
        consumerSecret: this.consumerSecret,
        tokenSecret: this.tokenSecret
    };

    var message = {
        method: "GET",
        action: api,
        parameters: {
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: this.consumerKey,
            oauth_token: this.accessToken,
            q:"　",
            geocode: this.geo.ido + "," + this.geo.kei + "," + this.geo.km,
//                    since_id:"24012619984051000",
//                    max_id:"250126199840518145",
            result_type:"mixed"
        }
    };
    for (var key in content) {
        message.parameters[key] = content[key];
    }
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var target = OAuth.addToURL(message.action, message.parameters);

    var options = {
        type: message.method,
        url: target,
        dataType: "jsonp",  //ここでjsonpを指定する
        jsonp: false,       //jQueryによるcallback関数名の埋め込みはしない
        cache: true         //リクエストパラメータに時刻を埋め込まない
    };
    $.ajax(options);
}


var param = {
    geo:{
        ido:"35.699855",
        kei:"139.763786",
        km:"2km"
    }
};
var twitter = new Twitter(param);
var markers = new Array();

function update(data){
    data = data.statuses;
    console.log(data);
    for( var i = 0; i < data.length; i++ ) {
        $(".tweet").append(
            "<li class='cf'>" +
                "<dl class='twList'>" +
                    "<dt><img src=" + "'" + data[i].user.profile_image_url + "'" +  "width='48' height='48'></dt>" +
                        "<dd>" +
                            "<ul>" +
                                "<li class='name'>" + data[i].user.name + "</li>" +
                                    "<li class='twCont'>" + data[i].text + "</li>" +
                                    "<li class='date'>" + data[i].user.created_at + "</li>" +
                            "</ul>" +
                        "</dd>" +
                "</dl>" +
            "</li>");

        markers[i] = new google.maps.Marker({
            position: new google.maps.LatLng
            (data[i].geo.coordinates[0], data[i].geo.coordinates[1]),   map: map
        });
        //dispInfo(markers[i],data[i].user.name);
    }
}

$(function(){
    //オプションとコールバック関数の指定
    var content = {count: "50", callback: "update"};
    //Twitter APIの呼び出し
    twitter.get("https://api.twitter.com/1.1/search/tweets.json", content)
});
