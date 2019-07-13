$.ajaxSetup(
        {
            crossDomain: true,
            timeout: 90000
        });

var ajaxloader = {
    type: 'GET',
    dataType: "html",
    async: true,
    jsonres: '',
    show_loader: true,
    inprocess: [],
    loadURL: function (url, vars, callback) {
        if (ajaxloader.inprocess[url])
            return false;
        ajaxloader.inprocess[url] = true;
        if (ajaxloader.show_loader)
            loader.init();
        $.post(url,
                vars,
                function (response) {
                    if (ajaxloader.show_loader)
                        loader.close();
                    ajaxloader.inprocess[url] = false;
                    try {
                        ajaxloader.jsonres = $.parseJSON(response);
                    } catch (e) {
                        ajaxloader.jsonres = eval(response);
                    }
                    callback(ajaxloader.jsonres);
                }).fail(function (jqXHR, textStatus, errorThrown) {
            ajaxloader.errorHandler(jqXHR, textStatus, errorThrown, url);
        });
    },
    load: function (url, callback, callbackparams, vars) {
        if (typeof vars == 'undefined')
            vars = null;
        if (ajaxloader.inprocess[url])
            return false;
        ajaxloader.inprocess[url] = true;
        if (ajaxloader.show_loader)
            loader.init();
        $.ajax({
            url: url,
            type: "POST",
            data: vars,
            type: ajaxloader.type,
            async: ajaxloader.async,
            success: function (response) {
                if (ajaxloader.show_loader)
                    loader.close();
                ajaxloader.inprocess[url] = false;
                callback = eval(callback);
                callback(response, callbackparams);
            },
            dataType: ajaxloader.dataType,
            error: function (jqXHR, textStatus, errorThrown) {
                ajaxloader.errorHandler(jqXHR, textStatus, errorThrown, url);
            }
        });

    },
    errorHandler: function (jqXHR, textStatus, errorThrown, url) {
        ajaxloader.inprocess[url] = false;
        if (ajaxloader.show_loader)
            loader.close();
        //alert("Network Error");
    }

}