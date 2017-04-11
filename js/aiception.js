function face_age(token, image_url, callback){
    callEndpoint("https://aiception.com/api/v2.1/face_age", token, image_url, callback)
}

function detect_object(token, image_url, callback){
    var initial_wait = 2000;
    callEndpoint("https://aiception.com/api/v2.1/detect_object", token, image_url, callback, initial_wait)
}

function adult_content(token, image_url, callback){
    var initial_wait = 2000;
    callEndpoint("https://aiception.com/api/v2.1/adult_content", token, image_url, callback, initial_wait)
}

function faces(token, image_url, callback){
    var initial_wait = 3000;
    var retries = 30;
    var increment_wait = 300;
    // callEndpoint("http://localhost/api/v2.1/face", token, image_url, callback, 3000)
    callEndpoint("https://aiception.com/api/v2.1/face", token, image_url, callback, initial_wait, increment_wait, retries)
}

function artistic_image(token, image_url, style_url, callback){
    data = {
        'image_url' : image_url,
        'style_url' : style_url
    }
    var initial_wait = 60*1000;
    var increment_wait = 10*1000;
    callEndpoint2("https://aiception.com/api/v2.1/artistic_image", token, data, callback, initial_wait, increment_wait)
}


function callEndpoint(endpoint, token, image_url, callback, initial_wait=1000, increment_wait=100, retries=20){
    // 2
    $.ajax({
        headers: {
            "Authorization": "Basic " + btoa(token + ":" + 'password is ignored')
        },
        type: "POST",
        url: endpoint,
        //url: "https://aiception.com/api/v2.1/face_age",
        // url: "/api/v2.1/face_age",
        contentType : 'application/json',
        dataType: 'json',
        async: true,
        // use stringify or else jquery will urlencode the data
        data: JSON.stringify({"image_url": image_url}),
        error: function (xhr, ajaxOptions, thrownError){
            callback(thrownError, null)
        },
        success: function(task_created, textStatus, jqXHR){
            console.log("created task: ", task_created)
            age_task_url = task_created['Location'];
            // wait 300 ms
            setTimeout(function(){
                getTask(age_task_url, callback);
            }, initial_wait);            
        }
    });

    function getTask(task_url, callback){
        var counter = 0;
        (function pollTaskUntilDone() {
            $.ajax({
                headers: {
                    "Authorization": "Basic " + btoa(token + ":" + 'password is ignored')
                },
                type: "GET",
                url: task_url,
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                error: function (xhr, ajaxOptions, thrownError){
                    console.error(thrownError)
                    callback(thrownError, null);
                },
                success: function(task){
                    counter++;
                    console.log(task);

                    // probably too many requests
                    if(!("answer" in task)){
                        console.error(task)
                        callback(null, task);
                    }

                    // check if done
                    //if (task.answer.length <= 6){//jQuery.isEmptyObject(task['answer'])){
                    if($.type(task.answer) === "string"){
                        if(counter > retries){
                            callback('giving up', null);
                            return;
                        }
                        // pool every 300 ms
                        setTimeout(pollTaskUntilDone, 300 + increment_wait*counter);
                    }else{
                        callback(null, task)
                    }
                }
            });
        })();
    }
}


function callEndpoint2(endpoint, token, datapayload, callback, initial_wait=1000, increment_wait=100, retries=20){
    // 2
    $.ajax({
        headers: {
            "Authorization": "Basic " + btoa(token + ":" + 'password is ignored')
        },
        type: "POST",
        url: endpoint,
        //url: "https://aiception.com/api/v2.1/face_age",
        // url: "/api/v2.1/face_age",
        contentType : 'application/json',
        dataType: 'json',
        async: true,
        // use stringify or else jquery will urlencode the data
        data: JSON.stringify(datapayload),
        error: function (xhr, ajaxOptions, thrownError){
            callback(thrownError, null)
        },
        success: function(task_created, textStatus, jqXHR){
            console.log("created task: ", task_created)
            age_task_url = task_created['Location'];
            // wait 300 ms
            setTimeout(function(){
                getTask(age_task_url, callback);
            }, initial_wait);            
        }
    });

    function getTask(task_url, callback){
        var counter = 0;
        (function pollTaskUntilDone() {
            $.ajax({
                headers: {
                    "Authorization": "Basic " + btoa(token + ":" + 'password is ignored')
                },
                type: "GET",
                url: task_url,
                contentType : 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                error: function (xhr, ajaxOptions, thrownError){
                    console.error(thrownError)
                    callback(thrownError, null);
                },
                success: function(task){
                    counter++;
                    console.log(task);

                    // probably too many requests
                    if(!("answer" in task)){
                        console.error(task)
                        callback(null, task);
                    }

                    // check if done
                    //if (task.answer.length <= 6){//jQuery.isEmptyObject(task['answer'])){
                    if($.type(task.answer) === "string"){
                        if(counter > retries){
                            callback('giving up', null);
                            return;
                        }
                        // pool every increment_wait ms
                        setTimeout(pollTaskUntilDone, increment_wait*counter);
                    }else{
                        callback(null, task)
                    }
                }
            });
        })();
    }
}