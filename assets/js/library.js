/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Hsis = {
    token: 'c3a8352433c34efc8286031fcfbcce53c53bf915e95c471fafdcaf4cd908f6a9',
    lang: 'az',
    appId: 1000012,
    currModule: '',
    operationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    top: 0,
    eduLevels: [],
    universities: [],
    personId: '',
    stompClient:0,
    Codes: {
        SERIALTYPE: 1000101,
        SECTION: 1000102,
        COMPILER: 1000100,
        BIBDESC: 1000078,
        RESFORMAT: 1000075,
        RESTYPE: 3,
        CONTENT: 1000073,
        SUBJECT: 1000085,
        USEFULNESS: 6,
        COUNTRY: 1000095,
        RESLANG: 1000103,
        AUTHORS: 9,
        SCISUBJECT: 1000038,
        STATUS: 1000096,
        PDF_FORMAT : 'LIB1'
    },
    tempData: {
        form: ''
    },
    urls: {
//        ELIBRARY: "http://wcu.unibook.az/Library/",
//        ELIBRARY: "http://192.168.1.78:8082/Library/",
        ELIBRARY: "http://localhost:8080/Library/",
//        ROS: "http://wcu.unibook.az/ROS/",
        ROS: "http://192.168.1.78:8082/ROS/",
//        AdminRest: 'http://wcu.unibook.az/AdministrationRest/',
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
//        HSIS: "http://wcu.unibook.az/UnibookHsisRest/",
        HSIS: "http://192.168.1.78:8082/UnibookHsisRest/",
//          REPORT: 'http://wcu.unibook.az/ReportingRest/',
//            REPORT: 'http://192.168.1.78:8082/ReportingRest/',
        REPORT: 'http://localhost:8080/ReportingRest/',
        COMMUNICATION: 'http://192.168.1.78:8082/CommunicationRest/',
        NOTIFICATION: 'http://192.168.1.78:8082/NotificationSystem/greeting.html?token=',
        SOCKET: 'http://192.168.1.78:8082/SocketRest'
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/AdministrationSystem/greeting.html'
        } else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Hsis.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Hsis.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Hsis.lang.trim().length === 0) {
            Hsis.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Hsis.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Hsis.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Hsis.dictionary[Hsis.lang][attr]);
            $(this).attr('placeholder', Hsis.dictionary[Hsis.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Proxy: {
        
        removeAutFile: function(id, path, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'autfile/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                data: {filePath: path},
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                }
            })
        },
        
        removeResFile: function(id, path, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resfile/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                data: {filePath: path},
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },
                
        getLoadFile: function (id) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/' + id + '/image?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Danger");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        getUnusuals: function (params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'unusuals?token=' + Hsis.token + (params ? '&' + params : ''),
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Danger");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            })
        },

        getPersonDetails: function (formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'person/?token=' + Hsis.token,
                type: 'GET',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        var perData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(perData);
                                break;
                            case Hsis.statusCodes.INVALID_PARAMS:
                                break;
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            });
        },

        addRequest: function (form, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'request/add?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            })
        },

        updateRequest: function (id, form, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'request/' + id + '/update?token=' + Hsis.token,
                type: 'POST',
                data: form,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            })
        },

        removeRequest: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'requests/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            })
        },
        
        getAuthorResourcesListForRightPanel: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'author/' + id + '/resources?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        var autData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(Hsis.Service.parseAuthorResourcesListForRightPanel(autData));
                                break;
                            case Hsis.statusCodes.INVALID_PARAMS:
                                break;
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
            });
        },
        
        getResourceAuthorsListForRightPanel: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resource/' + id + '/authors?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        var autData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(Hsis.Service.parseResourceAuthorsListForRightPanel(autData));
                                
                                break;
                            case Hsis.statusCodes.INVALID_PARAMS:
                                break;
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
            });
        },

        getRequestDetails: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'requests/' + id + '?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        var reqData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(reqData);
                                break;
                            case Hsis.statusCodes.INVALID_PARAMS:
                                break;
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            });
        },

        getAuthorsList: function (page, params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'authors?token=' + Hsis.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    var authors = data.data;
                    var dataCount = data.dataCount;
                    if (authors) {
                        if (callback) {
                            callback(authors);
                        }
                        var b = ''
                        $.each(authors, function (i, v) {

                                b += '<tr data-id="' + v.id + '" data-about="' + v.about + '" class="book-info-block">' +
                                    '<td></td>' +
                                    '<td>' + v.authorName[Hsis.lang] + '</td>' +
//                                    '<td>' + v.resourceNames.substring(0, 30) + '</td>' +
                                    '<td>' + v.birthPlace.value[Hsis.lang] + '</td>' +
                                    '<td>' + v.birthDeath + '</td>' +
                                    '<td></td>' +
                                    '</tr>'
                        })

                        if (page) {
                            $('body').find('#muelliflist tbody').append(b);
                        } else {
                            $('body').find('#muelliflist tbody').html(b);
                        }
                        if($('.alfa').data('clicked')) {
                            $('body').find('#muellifsayi').html(authors.length);
                        }else{
                            $('body').find('#muellifsayi').html(dataCount);
                        }
                        $('body').find('.btn-load-more').prop('disabled', false);
                        $('body').find('img.author-photo').on('error', function () {
                            // $(this).attr('src','http://anl.az/new/images/book.png');
                            $(this).addClass('hidden')
                        });
                         var about = $('body').find('.abouta span');

                        $.each(about, function (i, v) {
                            if ($(v).html() == ' ') {
                                $(this).parents('.abouta').addClass('hidden');
                            }
                        })
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                    var tableRows = $('body').find('#muelliflist tbody tr td:first-child');

                    $.each(tableRows, function (i, v) {
                        $(v).html(++i)
                    });
                }
            });
        },
        
        getAuthorsList2: function (callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'authors?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    var authors = data.data;
                    if (authors) {
                        if (callback) {
                            callback(data.data);
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            });
        },
        getAuthorsListForSelect: function (callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'autselect?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    var authors = data.data;
                    if (authors) {
                        if (callback) {
                            callback(data.data);
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            });
        },

        addAuthor: function (formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'authors/add?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                }
            })
        },

        updateAuthor: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'author/' + id + '/update?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                }
            })
        },

        removeAuthor: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'authors/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                }
            })
        },

        getAuthorDetails: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'authors/' + id + '?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000124"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        var resData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(resData);
                                break;
                            case Hsis.statusCodes.INVALID_PARAMS:
                                break;
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000124"]').removeAttr('check', 1);
                }
            });
        },

        getResearch: function (page, params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'research?token=' + Hsis.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000117"]').attr('check', 1);
                },
                success: function (data) {
                    var research = data.data;
                    var dataCount = data.dataCount;
                    if (research) {
                        if (callback) {
                            callback(research);
                        }
                        var c = ''
                        $.each(research, function (i, v) {
                            var authorName = "";
                            $.each(v.authorList, function (j, k) {
                                if (k.authorName != "") {
                                    authorName += ((v.authorList.length == 1 || j == v.authorList.length - 1) ? k.authorName[Hsis.lang] : k.authorName[Hsis.lang] + ',');
                                }
                            }
                            );
//                            c += '<div><div data-id="' + v.id + '" data-subject="' + v.subject.id + '"\n\
//                                        data-place="' + v.publishPlace.id + '" data-langid="' + v.langId.id + '" \n\
//                                        class="book-info-block"><div class="book-operations">' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</div>' +
//                                    // '<img class="a-export" src="assets/img/html-icon.png" width="150" height="150" alt="html">'
//                                    '<h4 class="bashliq">' + v.researchName + '</h4>' +
//                                    '<p class="hauthor">M�?llif: ' + authorName + '</p>' +
//                                    '<p>' + v.publishPlace.value[Hsis.lang] + ' ' + v.publishDate + ' (' + v.langId.value[Hsis.lang] + ')</p>' +
//                                    '<p>F?nn: ' + v.subject.value[Hsis.lang] + '</p>' +
//                                    '<p id="pnotes">Qeydl?r: <span>' + v.notes.substring(0, 40) + '</span></p>' +
//                                    '</div></div>'
                             c += '<tr data-id="' + v.id + '" data-subject="' + v.subject.id + '" data-place="' + v.publishPlace.id + '" data-place-value="' + v.publishPlace.value[Hsis.lang] + '" data-lang-value="' + v.langId.value[Hsis.lang] + '" data-langid="' + v.langId.id + '" data-publish-date="' + v.publishDate + '" class="book-info-block">' +
                                    '<td></td>' +
                                    //'<td title="'+ res +'">' + res.substring(0, 40) + '...' + '</td>' + data-resource-id="'+ res +'"
                                    '<td>' + v.researchName + '</td>' +
                                    '<td>' + authorName + '</td>' +
                                    '<td>' + v.subject.value[Hsis.lang] + '</td>' +
//                                    '<td>' + v.publishPlace.value[Hsis.lang] + '</td>' +
//                                    '<td>' + v.publishDate + '</td>' +
//                                    '<td>' + v.langId.value[Hsis.lang] + '</td>' +
                                    '<td>' + v.notes.substring(0, 40) + '</td>' +
                                    '<td></td>' +
                                    '</tr>'
                        })
                        if (page) {
                              $('body').find('#resetable tbody').append(c);
                        } else {
                              $('body').find('#resetable tbody').html(c);
                        }
                        $('body').find('#arashdirmasayi').html(dataCount);
                        $('body').find('.btn-load-more').prop('disabled', false);
                        var notes = $('body').find('.data .research-list #pnotes span');

                        $.each(notes, function (i, v) {
                            if ($(v).html() == ' ') {
                                $(this).parents('#pnotes').addClass('hidden');
                            }
                        });
                        var tableRows = $('body').find('#resetable tbody tr td:first-child');
                        
                        $.each(tableRows, function(i, v){
                            $(v).html(++i)
                        });
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000117"]').removeAttr('check', 1);
                }
            });
        },

        getRequestForSelect: function (page, params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'requests?token=' + Hsis.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                data: params,
                beforeSend: function (xhr) {
                $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    
                    var requests = data.data;
                    var dataCount = data.dataCount;
                    if (requests) {
                        if (callback) {
                            callback(data.data);
                        }
                        var c = ''
                        $.each(requests, function (i, v) {

                            c += '<tr data-id="' + v.id + '" data-person-id="' + v.person.id + '"  class="book-info-block">' +
                                    '<td></td>' +
                                    //'<td title="'+ res +'">' + res.substring(0, 40) + '...' + '</td>' + data-resource-id="'+ res +'"
                                    '<td>' + v.person.firstName + ' ' + v.person.middleName + ' ' + v.person.lastName + '</td>' +
                                    '<td>' + v.person.degrees + '</td>' +
                                    '<td>' + v.person.uniOrg + '</td>' +
                                    '<td></td>' +
                                    '</tr>'

                        })
                        if (page) {
                            $('body').find('#requestlist tbody').append(c);
                        } else {
                              $('body').find('#requestlist tbody').html(c);
                        }
                        var tableRows = $('body').find('#requestlist tbody tr td:first-child');
                        
                        $.each(tableRows, function(i, v){
                            $(v).html(++i)
                        });
                        $('body').find('.btn-load-more').prop('disabled', false);
                        $('body').find('#muracietsayi').html(dataCount);
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            });
        },
        
        
        
         getStructureListByFilter: function (id, levelId, callback) {

            $.ajax({
                url: Hsis.urls.HSIS + 'structures/allFilter?token=' + Hsis.token,
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:

                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        
        getRequest: function (page, params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'requests?token=' + Hsis.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
//                data: params,
                beforeSend: function (xhr) {
                $('.module-block[data-id="1000125"]').attr('check', 1);
                },
                success: function (data) {
                    
                    var requests = data.data;
                    var dataCount = data.dataCount;
                    if (requests) {
                        if (callback) {
                            callback(data.data);
                        }
                        var c = ''
                        $.each(requests, function (i, v) {

                            c += '<tr data-id="' + v.id + '" data-person-id="' + v.person.id + '"  class="book-info-block">' +
                                    '<td></td>' +
                                    //'<td title="'+ res +'">' + res.substring(0, 40) + '...' + '</td>' + data-resource-id="'+ res +'"
                                    '<td>' + v.person.firstName + ' ' + v.person.middleName + ' ' + v.person.lastName + '</td>' +
                                    '<td>' + v.person.degrees + '</td>' +
                                    '<td>' + v.person.uniOrg + '</td>' +
                                    '<td></td>' +
                                    '</tr>'

                        })
                        if (page) {
                            $('body').find('#requestlist tbody').append(c);
                        } else {
                              $('body').find('#requestlist tbody').html(c);
                        }
                        var tableRows = $('body').find('#requestlist tbody tr td:first-child');
                        
                        $.each(tableRows, function(i, v){
                            $(v).html(++i)
                        });
                        $('body').find('.btn-load-more').prop('disabled', false);
                        $('body').find('#muracietsayi').html(dataCount);
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000125"]').removeAttr('check', 1);
                }
            });
        },

        getResources: function (page, params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources?token=' + Hsis.token + (params ? '&' + params : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    var resources = data.data;
                    var dataCount = data.dataCount;
                    if (resources) {
                        if (callback) {
                            callback(data.data);
                        }
                        var b = ''
                        $.each(resources, function (i, v) {
                            var authorName = "";
                            $.each(v.authorList, function (j, k) {

                                if (k.authorName != "") {
                                    authorName += ((v.authorList.length == 1 || j == v.authorList.length - 1) ? k.authorName[Hsis.lang] : k.authorName[Hsis.lang] + ',');
                                }
                            }
                        );

                            b += '<tr data-id="' + v.id + '" class="book-info-block">' +
                                    '<td></td>' +
                                    '<td>' + v.resourcesName + '</td>' +
                                    '<td>' + authorName + '</td>' +
                                    '<td>' + v.section.value[Hsis.lang] + '</td>' +
                                    '<td>' + v.resCount + '</td>' +
                                    '<td></td>' +
                                    '</tr>'
                        })


                        if (page) {
                            $('body').find('#restable tbody').append(b);
                        } else {
                              $('body').find('#restable tbody').html(b);
                        }

                        var tableRows = $('body').find('#restable tbody tr td:first-child');
                        
                        $.each(tableRows, function(i, v){
                            $(v).html(++i)
                        });

                        $('body').find('.btn-load-more').prop('disabled', false);
                        $('body').find('#kitabsayi').html(dataCount);
                        $('body').find('img.cover-photo').on('error', function () {
                            $(this).attr('src', 'http://anl.az/new/images/book.png');
                        });

                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            });
        },

        getResourcesSelectList: function (params, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources?token=' + Hsis.token + (params ? '&' + params : ''),
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    var resources = data.data;
                    if (resources) {
                        if (callback) {
                            callback(resources);
                        }

                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            });
        },

        getResourceDetails: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/' + id + '?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        var resData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(resData);

                                if ($('body').find('.for-align.res-edition-item').length < 2) {
                                    $('body').find('.erase[delete-contact]').fadeOut(1);
                                }
                                break;

                            case Hsis.statusCodes.INVALID_PARAMS:

                                break;

                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            });
        },

        getResearchDetails: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'research/' + id + '?token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000117"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        var resData = data.data;
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                callback(resData);
                                break;
                            case Hsis.statusCodes.INVALID_PARAMS:
                                break;
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;
                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000117"]').removeAttr('check', 1);
                }
            });
        },

        addResource: function (formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/add?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        addResearch: function (formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'research/add?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000117"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000117"]').removeAttr('check', 1);
                }
            })
        },
        
        addResourceCompiler: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/' + id + '/compiler/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },
        
        addResourceEdition: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/' + id + '/edition/add?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.modal').modal('hide')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        updateResource: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/' + id + '/update?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        updateResourceEdition: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/edition/' + id + '/update?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                //                                $('body').find('.add-new').css('right', '-100%')
                                $('body').find('.modal').modal('hide')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        updateResourceCompiler: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/compiler/' + id + '/update?token=' + Hsis.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                //                                $('body').find('.add-new').css('right', '-100%')
                                $('body').find('.modal').modal('hide')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        updateScientificResearch: function (id, formData, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'research/' + id + '/update?token=' + Hsis.token,
                type: 'POST',
                contentType: false,
                processData: false,
                data: formData,
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000117"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                $('body').find('.add-new').css('right', '-100%')

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000117"]').removeAttr('check', 1);
                }
            })
        },

        removeResource: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }
                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        removeResourceCompile: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/compile/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        removeResourceEdition: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'resources/edition/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000115"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        removeResearch: function (id, callback) {
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'research/' + id + '/remove?token=' + Hsis.token,
                type: 'POST',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000117"]').attr('check', 1);
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.OK:
                                if (callback) {
                                    callback(data.data);
                                }

                                break;
                            case Hsis.statusCodes.ERROR:
                                alert("Error");
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000115"]').removeAttr('check', 1);
                }
            })
        },

        loadApplications: function () {
            $.ajax({
                url: Hsis.urls.ROS + 'applications?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    Hsis.Service.parseApplications(data.data);
                                    Hsis.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadSubApplications: function (callback) {
            $.ajax({
                url: Hsis.urls.ROS + 'applications/1000014/subApplications?token=' + Hsis.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    if(callback)
                                        callback(data);
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadOrgTree: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Hsis.urls.HSIS + 'structures?token=' + Hsis.token,
                type: 'GET',
                global: false,
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        $('.btn.tree-modal').attr('data-check', 1);
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:

                                break;

                            case Hsis.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                },
                complete: function () {
                    callback(tree);
                    $('.btn.tree-modal').attr('data-check');

                }
            });
        },

        loadModules: function (callback) {
            var modules = {};
            $.ajax({
                url: Hsis.urls.ROS + 'applications/' + Hsis.appId + '/modules?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },

        loadSubModules: function (moduleId, callback) {
            $.ajax({
                url: Hsis.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            });
        },

        getProfile: function () {
            $.ajax({
                url: Hsis.urls.ROS + "profile?token=" + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        $('.profile-data li[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        $('.profile-data li[data-type="role"]').text(user.role.value[Hsis.lang]);
                                        $('.profile-data li[data-type="org"]').text(user.structure.name[Hsis.lang]);
                                        $('.side-title-block p').text(user.orgName.value[Hsis.lang]);
                                        $('.main-img').attr('src', Hsis.urls.AdminRest + 'users/' + user.id + '/image?token=' + Hsis.token);
                                        $('.side-title-block img').attr('src', Hsis.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Hsis.token);
                                        var img = $('.main-img');
                                        img.on('error', function (e) {
                                            $('.main-img').attr('src', 'assets/img/guest.png');
                                        })
                                        $('div.big-img img').attr('src', Hsis.urls.AdminRest + 'users/' + user.id + '/image?token=' + Hsis.token);
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        Hsis.structureId = user.structure.id;
                                    }
                                } catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },

        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Hsis.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Hsis.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    operations = data.data;
                                    Hsis.operationList = operations;

                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:
                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                    if ($('#buttons_div').find('ul li').length < 1) {
                        $('#buttons_div').hide();
                        console.log('empty')
                    }
                }
            });
        },

        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Hsis.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data.data;
                                    if (callback) {
                                        callback(result);
                                    }

                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                }
            });
        },

        loadDictionariTypes: function (callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/types?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data.data;
                                    if (callback) {
                                        callback(result);
                                    }
                                    var html = '';
                                    $.each(data.data, function (i, v) {
                                        html += '<tr data-id="' + v.id + '">' +
                                                '<td>' + v.code + '</td>' +
                                                '<td>' + v.value[Hsis.lang] + '</td>' +
                                                '</tr>';
                                    });
                                    result = data;
                                    $('#dic-type-table tbody').html(html);
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify("X?ta ba? verdi!", {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                }

            });
        },

        loadDictionaries: function () {
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        loadDictionariesByTypeCode: function (code, callback) {
            var obj = {};
            $.ajax({
                url: Hsis.urls.ELIBRARY + 'settings/dictionaries/type/' + code + '?token=' + Hsis.token,
                type: 'GET',
                global: false,
                success: function (result) {
                    try {
                        if (result) {
                            switch (result.code) {
                                case Hsis.statusCodes.OK:
                                    obj = result.data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(obj);
                }

            });
        },

        loadDictionariesListByParentId: function (parentId, callback) {
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/parentId/' + parentId + '?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    callback(data)
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }

            });
        },

        getDictionaryDetails: function (dicId, callback) {
            var code = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/' + dicId + '?token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                code = data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:

                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    callback(code);
                }
            });
        },

        getDictionariesTypeListByType: function (typeId, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/types/' + typeId + '?&token=' + Hsis.token,
                type: 'GET',
                beforeSend: function (xhr) {
                    $('.module-block[data-id="1000123"]').attr('check', 1);
                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data.data;
                                    if (callback)
                                        callback(result);
                                    var html = '';
                                    $.each(data.data, function (i, v) {
                                        html += '<tr data-id="' + v.id + '">' +
                                                '<td>' + v.code + '</td>' +
                                                '<td>' + v.value[Hsis.lang] + '</td>' +
                                                '</tr>';
                                    });
                                    result = data;
                                    $('#dic-type-table tbody').html(html);
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    $('.module-block[data-id="1000123"]').removeAttr('check', 1);
                }

            });
        },

        addDictionary: function (dic, callback) {
            var code = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/add?token=' + Hsis.token,
                type: 'POST',
                data: dic,
                beforeSend: function () {
                    $('#main-div .btn-dictionary').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify("X?ta ba? verdi!", {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.DUPLICATE_DATA:
                                $.notify("Daxil etdiyiniz kod art?q m�vcuddur!", {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                code = data;
                                $('body').find('.modal').modal('hide')
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:

                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                            case Hsis.statusCodes.INVALID_PARAMS:
                                $.notify("Daxil etdiyiniz parametrl?r yanl??d?r!", {
                                    type: 'danger'
                                });
                                break;
                        }
                    }
                    ;
                },
                complete: function () {
                    $('#main-div .btn-dictionary').removeAttr('disabled');
                    if (callback)
                        callback(code)
                }
            });
            return code;
        },

        editDictionary: function (dic, callback) {
            var code = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/' + dic.id + '/edit?token=' + Hsis.token,
                type: 'POST',
                data: dic,
                beforeSend: function () {
                    $('#main-div .btn-dictionary').attr('disabled', 'disabled');
                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify("X?ta ba? verdi!", {
                                    type: 'danger'
                                });
                                break;
                            case Hsis.statusCodes.OK:
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                code = data;
                                if (callback)
                                    callback(data);
                                $('body').find('.modal').modal('hide')
                                Hsis.Proxy.loadOperations(Hsis.currModule, function (operations) {
                                    $('#buttons_div').find('ul').html(Hsis.Service.parseOperations(operations, 1));

                                    Hsis.Proxy.loadDictionariesByTypeId(Hsis.dicTypeId, 0, function (result) {
                                        Hsis.Service.parseDictype(result);
                                    });

                                });
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:

                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                            case Hsis.statusCodes.INVALID_PARAMS:
                                $.notify("Daxil etdiyiniz parametrl?r yanl??d?r!", {
                                    type: 'danger'
                                });
                        }
                    }
                    ;
                },
                complete: function () {
                    $('#main-div .btn-dictionary').removeAttr('disabled');
                }
            });
        },

        removeDictionary: function (dicId, callback) {
            var code = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries/' + dicId + '/remove?token=' + Hsis.token,
                type: 'POST',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Hsis.statusCodes.ERROR:
                                if (data.message) {
                                    $.notify(data.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.OK:
                                code = data;
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:

                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }

                    }
                    ;
                },
                complete: function () {
                    callback(code);

                    Hsis.Proxy.loadOperations(Hsis.currModule, function (operations) {
                        $('#buttons_div').find('ul').html(Hsis.Service.parseOperations(operations, 1));

                        Hsis.Proxy.loadDictionariesByTypeId(Hsis.dicTypeId, 0, function (result) {
                            Hsis.Service.parseDictype(result);
                        });

                    });
                }
            });
            return code;
        },

        checkDictionaryCode: function (code, callback) {
            var result = {};
            $.ajax({
                url: Hsis.urls.AdminRest + 'settings/dictionaries?code=' + code + '&token=' + Hsis.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Hsis.statusCodes.OK:
                                    result = data;
                                    break;

                                case Hsis.statusCodes.ERROR:
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Hsis.statusCodes.UNAUTHORIZED:

                                    window.location = Hsis.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },

        changePassword: function (pass, callback) {
            $.ajax({
                url: Hsis.urls.AdminRest + 'users/changePassword?token=' + Hsis.token,
                type: 'POST',
                data: pass,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.OK:
                                callback(result);
                                break;

                            case Hsis.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Hsis.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Hsis.lang], {
                                        type: 'danger'
                                    });
                                } else {
                                    $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },

        loadTeachers: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'teachers?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('#main-div li.sub-module-item').attr('data-attr', 1);
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseTeachers(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    $('#main-div li.sub-module-item').removeAttr('data-attr');
                    $('.module-block[data-id="1000010"]').removeAttr('data-check');
                }
            })
        },

        loadStudents: function (page, queryParams, callback, before) {
            $.ajax({
                url: Hsis.urls.HSIS + 'students?token=' + Hsis.token + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function () {
                    if (before) {
                        $('.module-list .chekbox-con input').attr('disabled', 'disabled');
                    }
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Hsis.statusCodes.ERROR:
                                $.notify(Hsis.dictionary[Hsis.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Hsis.statusCodes.OK:
                                Hsis.Service.parseStudents(result.data, page);
                                $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                                $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
                                if (callback)
                                    callback(result.data);
                                break;

                            case Hsis.statusCodes.UNAUTHORIZED:
                                window.location = Hsis.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    $('.module-list .chekbox-con input').removeAttr('disabled');
                    $('.module-block[data-id="1000011"]').removeAttr('data-check');
                }
            })
        },

    },

    Service: {

        parseApplications: function (applications) {
            var html = '';
            $.each(applications, function (i, v) {
                html += '<div class="col-md-4 p-l-0" title = "' + v.name[Hsis.lang] + '">' +
                        '<li class="button-item">' +
                        '<a data-id="' + v.id + '" target="_blank" class="button-icon" href="' + v.url + '?token=' + Hsis.token + '">' +
                        '<div class="flex-center">' + '<div class="' + v.iconPath + '"></div>' +
                        '<span class="button-name">' + v.shortName[Hsis.lang] + '</span>' +
                        '</div>' +
                        '</a>' +
                        '</li>' +
                        '</div>';
            });

            $('#application-list .div-application').html(html);
        },
        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if(v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Hsis.lang] + '">' + 
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Hsis.token + '">' + v.shortName[Hsis.lang] + '</a>' + 
                                '</li>';
                });
                Hsis.Proxy.loadSubApplications(function(data) {
                    if(data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Hsis.lang] + '">' + 
                                        '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Hsis.token + '">' + v.shortName[Hsis.lang] + '</a>' + 
                                    '</li>';
                        })
                    }
                    
                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Hsis.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip();

                    var moduleListItems = $('body').find('.app-con li');
                    if(moduleListItems.length>5){
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    }else{
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }

                })
                
            }

        },

        parseModules: function (modules) {
            var html = '';
            if (modules.data) {
                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li title="' + v.name[Hsis.lang] + '" data-id="' + v.id + '" class="module-block">' +
                                '<a class="icon-' + v.iconPath + '" >' + v.shortName[Hsis.lang] +
                                '</a></li>';
                    }

                });
            }

            return html;
        },

        parseOperations: function (operations, type, $obj, callback) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                        '<div title = "?m?liyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="assets/img/upd/table-dots.svg">' +
                        '</div>' + '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>');

                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Hsis.lang] + '</a></li>';

                        } else if (type == '2') {
                            if ($obj) {
                                var statusId = $obj.status ? $obj.status.id : 0;
                                if ((v.id == 1000042 || v.id == 1000041) && statusId == 1000340) {
                                    html += '';
                                } else if ((v.id == 1000028 || v.id == 1000032) && statusId == 1000340 && v.roleId != 1000020 && v.roleId != 1000075) {
                                    html += '';
                                } else {
                                    html += '<li><a  id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Hsis.lang] + '</a></li>';
                                }
                            } else {
                                html += '<li><a id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Hsis.lang] + '</a></li>';
                            }
                        }
                    }
                });

                if (type == '2') {

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }

            }
            return html;
        },

        parseResourceAuthorsListForRightPanel: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<p class="authorlist">' + ++i + '. ' + v.authorName[Hsis.lang] + '</p>';
                });

            }
            return html;
        },

        parseAuthorResourcesListForRightPanel: function (data) {
            var html = '';
            if (data) {
                $.each(data.data, function (i, v) {
                    html += '<p>' + ++i + '. ' + v.resourcesName + '</p>';
                });

            }
            return html;
        },
        
        parseDictionaryForSelect: function (data) {
            var html = '<option value="0">' + Hsis.dictionary[Hsis.lang]["select"] + '</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Hsis.lang] + '</option>';
                });

            }
            return html;
        },

        parseDictype: function (data, page) {

            var html = '';
            var count;

            if (page) {
                count = $('body').find('#dictionary-table tbody tr').length;
            } else {
                count = 0;
            }
            if (data) {
                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '">' +
                            '<td>' + (++count) + '</td>' +
                            '<td class="hidden">' + (v.parentId != 0 ? v.parentId : 'No parent') + '</td>' +
                            '<td>' + v.value[Hsis.lang] + '</td>' +
                            //'<td>' + v.code + '</td>' +
                            '<td>' + v.updateDate + '</td>' +
                            '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2') + '</td>' +
                            '</tr>';
                });

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="dictionary" class="btn loading-margins btn-load-more">' + Hsis.dictionary[Hsis.lang]["load.more"] + '</button>');
                }

                if (page) {
                    $('body').find('#dictionary-table tbody').append(html);
                } else {
                    $('body').find('#dictionary-table tbody').html(html);
                }
            }
        },

    },

    Validation: {
        validateEmail: function (email) {
            var re = Hsis.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Hsis.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Hsis.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Hsis.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (requiredAttr !== 'default-teaching-required' && requiredAttr !== 'default-required' && v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Hsis.dictionary[Hsis.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });                   
                    $(v).on('change', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            } else {

                return false;
            }
        }
    },
    WebSocket: {
            
           connect: function () {
                var name = $('.namename').val();
                var socket = new SockJS(Hsis.urls.SOCKET + '/chat');
                Hsis.stompClient = Stomp.over(socket);
                Hsis.stompClient.connect({'Login':Hsis.token}, function (frame) {
                    var sessionId = /\/([^\/]+)\/websocket/.exec(socket._transport.url)[1];
                    Hsis.stompClient.subscribe('/topic/messages/' + sessionId, function (messageOutput) {
                            $('body .notification').removeClass('hidden');
                            
                    });
                });
            },

            disconnect: function (a) {
                if (Hsis.stompClient != 0) {
                    Hsis.stompClient.disconnect();
                }
                if(a==1) {
                    Hsis.WebSocket.connect();
                }
            },
    },

};

var fileTypes = {
    IMAGE_CONTENT_TYPE: '^(' + Hsis.REGEX.IMAGE_EXPRESSION + ')$',
    FILE_CONTENT_TYPE: '^(' + Hsis.REGEX.TEXT + '|' + Hsis.REGEX.PDF + '|' + Hsis.REGEX.XLS + '|' + Hsis.REGEX.XLSX + '|' + Hsis.REGEX.DOC + '|' + Hsis.REGEX.DOCX + '|' + Hsis.REGEX.IMAGE_EXPRESSION + ')$'
};