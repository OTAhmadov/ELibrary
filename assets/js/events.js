/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Hsis.lang;
    } else {
        chosenLang = Hsis.getCookie('lang');
    }



    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        } catch (err) {
            console.error(err);
        }

    });

    if (Hsis.token == '0') {
        Hsis.initToken('tk');
    }


    Hsis.loadLanguagePack('az');
    Hsis.loadLanguagePack('en');
    Hsis.loadLanguagePack('ru');

    setTimeout(function () {
        Hsis.i18n();
        $.fn.datepicker.defaults.language = Hsis.lang;
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Hsis.dictionary[Hsis.lang]['ok'],
            cancelButton: Hsis.dictionary[Hsis.lang]['close'],
            title: Hsis.dictionary[Hsis.lang]['warning']
        });
    }, 1000)



    $('#logoutForm').attr("action", Hsis.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Hsis.token);

    Hsis.Proxy.getProfile();

    Hsis.Proxy.loadApplications();

    Hsis.Proxy.loadModules(function (modules) {
        $('ul.module .mod-con').prepend(Hsis.Service.parseModules(modules));
        $('.module-list').html(Hsis.Service.parseModules(modules));
        var currModule = Hsis.initCurrentModule('currModule');
        if (localStorage.button != undefined) {
            Hsis.Service[localStorage.button]();
            localStorage.removeItem('button');

        } else {
            if (currModule != "") {
                Hsis.currModule = currModule;
                var module = $('ul.module-list').find('.module-block[data-id="' + Hsis.currModule + '"] a');

                if (module.length) {
                    module.click();
                } else {
                    $('ul.module-list').find('.module-block a').eq(0).click();
                }
            } else {
                $('ul.module-list').find('.module-block a').eq(0).click();
            }
        }


    });

    $('ul.module-list').on('click', '.module-block a', function (e) {

        NProgress.done();
        NProgress.remove();
        var obj = $(this).parents('li');
        var title = obj.attr('title');
        var id = obj.attr('data-id');
        // $('.module-list').find('.sub-module-con').fadeOut(1);
        $('ul.module-list').find('li').removeClass('active');
        // $(this).parents('li').find('.sub-module-con').fadeIn();
        // $('.module-list').find('.sub-module-con').remove();
        $(this).parents('li').addClass('active');
        try {

            if (obj.attr('data-check') !== '1') {
                NProgress.start();
                Hsis.currModule = obj.attr('data-id');
                document.cookie = "currModule=" + Hsis.currModule;


                $('.main-content-upd').load('partials/module_' + Hsis.currModule + '.html?' + Math.random(), function () {
                    $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                    history.pushState({page: id}, null, '#' + title);
                    $('ul.module-list').find('li').removeAttr('data-check');
                    obj.attr('data-check', 1);

                });
            } else {
                return false
            }



            var moduleName = $(this).find('span').html();
            var html = '<li>' +
                    '<span style="color:white;">' + moduleName + '</span>' +
                    '</li>';
            $('ul.breadcrumb').html(html);
            // $('ul .sub_modules').remove();
            Hsis.tempData.form = '';
            $('#main-div').removeAttr('data-citizenship');

        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#orgBack', function () {
        $('ul.module').find('.module-item[data-id="' + Hsis.currModule + '"]').click();
    });
    
    $('body').on('click', '.res-info .panel-close', function () {
        $('body').find('.col-sm-4.res-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });

    $('body').on('click', '.info .panel-close', function () {
        $('body').find('.col-sm-4.info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });

    $('body').on('click', '.aut-info .panel-close', function () {
        $('body').find('.col-sm-4.aut-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });
    $('body').on('click', '.rese-info .panel-close', function () {
        $('body').find('.col-sm-4.rese-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });
//    
//    $(document).keypress(function(e) {
//    if(e.which == 13) {
//        alert('You pressed enter!');
//    }
//    });
    
    $(document).on('click', '.edit-page .dropdown-menu a.erasec', function (e) {
        try {
            var obj = $(this);
            var redatParent = obj.parents('.res-compiler-item').find('tbody tr');
            $('body').attr('data-resource-compile-id', redatParent.attr('data-id'));
            var compileId = $('body').attr('data-resource-compile-id');
            var resourceId = $('body').attr('data-resource-id');
            e.preventDefault();
            var parent = obj.parents('.for-align').find('tbody tr');

            $.confirm({
                title: Hsis.dictionary[Hsis.lang]['warning'],
                content: Hsis.dictionary[Hsis.lang]['delete_info'],
                confirm: function () {
                    Hsis.Proxy.removeResourceCompile(compileId, function () {
                        Hsis.Proxy.getResourceDetails(resourceId, function (result) {
                            var compilerList = result.compilerList;
                            var complist = '';
                            $.each(compilerList, function (i, v) {
                                complist += '<div class="col-md-12 for-align res-compiler-item">' +
                                            '<table class="table-block col-md-12">' +
                                            '<thead>' +
                                            '<th>Tərtibatçı</th>' +
                                            '<th>S.A.A</th>' +
                                            '</tr></thead>' +
                                            '<tbody>' +
                                            '<tr data-id="'+ v.id +'" data-res-compiler="' + v.compilerType.id + '" data-res-compiler-name="' + v.compilerName + '">' +
                                            '<td data-res-compiler>' + v.compilerType.value[Hsis.lang] + ' </td>' +
                                            '<td data-res-compiler-name>' + v.compilerName + ' </td>' +
                                            '</tr>' +
                                            '</tbody>' +
                                            '</table>' +
                                            '<div class="operations-button">' +
                                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                            ' class="glyphicon glyphicon-list"></span></div>' +
                                            '<ul class="dropdown-menu">' +
                                            '<li><a data-res-compiler="' + v.compilerType.id + '" edit-com-edition data-res-compiler-name="' + v.compilerName + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                            '<li><a delete-contact href="#" class="erasec">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                            '</ul>' +
                                            '</div>' +
                                            '</div>';
                            })
                            $('#append_compile_param').html(complist);
                        })
                    });
                },
                theme: 'black'
            });

        } catch (err) {
            console.error(err);
        }
    });
    
    $(document).on('click', '.edit-page .dropdown-menu a.erase', function (e) {

        try {
            var obj = $(this);
            var redatParent = obj.parents('.res-edition-item').find('tbody tr');
            $('body').attr('data-resource-edition-id', redatParent.attr('data-id'));
            var editionId = $('body').attr('data-resource-edition-id');

            var resourceId = $('body').attr('data-resource-id');
            e.preventDefault();
            var parent = obj.parents('.for-align').find('tbody tr');

            $.confirm({
                title: Hsis.dictionary[Hsis.lang]['warning'],
                content: Hsis.dictionary[Hsis.lang]['delete_info'],
                confirm: function () {

                    Hsis.Proxy.removeResourceEdition(editionId, function () {
                        Hsis.Proxy.getResourceDetails(resourceId, function (data) {
                            if (data.editionList) {
                                var editionList = data.editionList
                                var edlist = '';
                                $.each(editionList, function (i, v) {
                                    edlist += '<div class="col-md-12 for-align res-edition-item">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['res_page'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['res_publish_date'] + '</th>' +
                                    '<th>Qiyməti</th>' +
                                    '<th>Düzülüş şifrəsi</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr  data-id="' + v.id + '" data-res-page="' + v.pageCount + '" data-res-publish-date="' + v.publishDate + '" data-res-price = "' + v.resPrice + '" data-res-row-serial = "' + v.resRowSerial +'">' +
                                    '<td data-res-page >' + v.pageCount + ' </td>' +
                                    '<td data-res-publish-date>' + v.publishDate + ' </td>' +
                                    '<td data-res-price>' + v.resPrice + ' </td>' +
                                    '<td data-res-row-serial>' + v.resRowSerial + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a  data-res-price = "' + v.resPrice + '" data-res-row-serial = "' + v.resRowSerial +'" data-res-page="' + v.pageCount + '" edit-res-edition  data-publish-date="' + v.publishDate + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                    '<li><a delete-contact href="#" class="erase" data-erase-type="edit-page">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';

                                    $('#append_edit_res_param').html(edlist);
                                    $('.resource-edition-modal').modal('hide');
                                })
                            }

                        })
                    });
                },
                theme: 'black'
            });

        } catch (err) {
            console.error(err);
        }
    });

    $(document).on('click', '.add-page .dropdown-menu a.erasec', function (e) {
        
        try {
            var obj = $(this);
            e.preventDefault();
            var parent = $('body').find('.res-compiler-item')
            $.confirm({
                title: Hsis.dictionary[Hsis.lang]['warning'],
                content: Hsis.dictionary[Hsis.lang]['delete_info'],
                confirm: function () {
                    parent.remove();
                },
                theme: 'black'
            });

        } catch (err) {
            console.error(err);
        }
    });
    
    $(document).on('click', '.add-page .dropdown-menu a.erase', function (e) {
        
        try {
            var obj = $(this);
            e.preventDefault();
            var parent = obj.parents('.res-edition-item');
            $.confirm({
                title: Hsis.dictionary[Hsis.lang]['warning'],
                content: Hsis.dictionary[Hsis.lang]['delete_info'],
                confirm: function () {
                    parent.remove();
                },
                theme: 'black'
            });

        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '[close]', function () {
        try {
            $(this).parents('.modal-content').addClass('hidden');
        } catch (err) {
            console.error(err);
        }
    });

    setTimeout(function () {
        window.onpopstate = function (e) {

            if (e.state != null) {
                if ($('.module-item')) {
                    $('.main-content-upd').load('partials/module_' + e.state.page + '.html?' + Math.random(), function () {
                        $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');

                    });
                }
            }

        }, 0
    });

    $('#main-div').on('click', '#btn_cancel', function () {
        try {
            $('#main-div').load('partials/module_' + Hsis.currModule + '.html');
        } catch (err) {
            console.error(err);
        }
    });

    $('body').find('.table-scroll').slimScroll();


    $('body').on('click', '#operation_1001323', function (e) {
        $('body').find('.add-new .search-scroll').load('partials/add_resource.html', function () {
            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');
            });

            Hsis.Proxy.loadDictionariesByTypeId('1000017', 0, function (eduTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(eduTypes);
                $('#main-div #edu_type').html(html);
            });

            Hsis.Proxy.loadDictionariesByTypeId('1000053', 0, function (groupTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(groupTypes);
                $('#main-div #group-type').html(html);
            });
            $('#confirmGroup').attr('action-status', 'new');
        });
        
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });

    $('body').on('click', '#operation_1001338', function (e) {
        $('body').find('.add-new .search-scroll').load('partials/add_research.html', function () {
            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');
            });

            $('#confirmGroup').attr('action-status', 'new');
        });
    });

    $('body').on('click', '#operation_1001354', function (e) {
        $('body').find('.add-new .search-scroll').load('partials/add_author.html', function () {
            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');
            });

            $('#confirmGroup').attr('action-status', 'new');
        });
    });

//    $('body').on('click', '#operation_1001358', function (e) {
//        $('body').find('.add-new .search-scroll').load('partials/add_request.html', function () {
//            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
//                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
//                $('#main-div #edu_level').html(html);
//                $('#main-div #edu-level-list').html(html);
//                $('body').find('.add-new').css('right', '0');
//            });
//
//            $('#confirmGroup').attr('action-status', 'new');
//
//            $('body').find('#main-div').attr('data-person-select-type', 'student')
//          
//            
//  
//           
//            var options;
//
//            if ($('body').find('#main-div').attr('data-person-select-type') == 'student') {
////                url = 'http://192.168.1.78:8082/UnibookHsisRest/students?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000107,1000108'
//                
//                options = {
//                    ajax: {
//                        url: 'http://192.168.1.78:8082/UnibookHsisRest/students?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000107,1000108',
//                        dataType: 'json',
//                        delay: 250,
//                        data: function (params) {
//                            return {
//                                keyword: params.term
//                            };
//                        },
//                        processResults: function (data, params) {
//                            // parse the results into the format expected by Select2
//                            // since we are using custom formatting functions we do not need to
//                            // alter the remote JSON data, except to indicate that infinite
//                            // scrolling can be used
////                params.page = params.page || 1;
//
//                            return {
//                                results: data.data.studentList
//                            };
//                        },
//                        cache: true
//                    },
//                    placeholder: '',
//                    escapeMarkup: function (markup) {
//                        return markup;
//                    }, // let our custom formatter work
//                    minimumInputLength: 1,
//                    templateResult: formatRepo,
//                    templateSelection: formatRepoSelection
//
//                }
//            } else {
////                url = 'http://192.168.1.78:8082/UnibookHsisRest/teachers?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000062,1000061'
//                options = {
//                    ajax: {
//                        url: 'http://192.168.1.78:8082/UnibookHsisRest/teachers?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000062,1000061',
//                        dataType: 'json',
//                        delay: 250,
//                        data: function (params) {
//                            return {
//                                keyword: params.term
//                            };
//                        },
//                        processResults: function (data, params) {
//                            // parse the results into the format expected by Select2
//                            // since we are using custom formatting functions we do not need to
//                            // alter the remote JSON data, except to indicate that infinite
//                            // scrolling can be used
////                params.page = params.page || 1;
//
//                            return {
//                                results: data.data.studentList
//                            };
//                        },
//                        cache: true
//                    },
//                    placeholder: '',
//                    escapeMarkup: function (markup) {
//                        return markup;
//                    }, // let our custom formatter work
//                    minimumInputLength: 1,
//                    templateResult: formatRepo,
//                    templateSelection: formatRepoSelection
//
//                }
//            }
//            $('body').find('#request-read').select2(options);  
//
////            
////            var options = {
////                ajax: {
////                    url: url,
////                    dataType: 'json',
////                    delay: 250,
////                    data: function (params) {
////                        return {
////                            keyword: params.term
////                        };
////                    },
////                    processResults: function (data, params) {
////                        // parse the results into the format expected by Select2
////                        // since we are using custom formatting functions we do not need to
////                        // alter the remote JSON data, except to indicate that infinite
////                        // scrolling can be used
//////                params.page = params.page || 1;
////
////                        return {
////                            results: data.data.studentList
////                        };
////                    },
////                    cache: true
////                },
////                placeholder: '',
////                escapeMarkup: function (markup) {
////                    return markup;
////                }, // let our custom formatter work
////                minimumInputLength: 1,
////                templateResult: formatRepo,
////                templateSelection: formatRepoSelection
////
////            }
//
//            
//
//            function formatRepo(repo) {
//                if (repo.loading) {
//                    return repo.text;
//                }
//
//                var markup = "<div class='select2-result-repository clearfix' data-id='" + repo.id + "'>" +
//                        "<div class='select2-result-repository__meta'>" +
//                        "<div class='select2-result-repository__title' >" + repo.firstName + ' ' + repo.middleName + ' ' + repo.lastName + "</div>" +
//                        "</div></div>";
//
////          if (repo.description) {
////            markup += "<div class='select2-result-repository__description'>" + repo.lastName + "</div>";
////          }
//
////          markup += "<div class='select2-result-repository__statistics'>" +
////            "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.lastName + " Forks</div>" +
////            "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.lastName + " Stars</div>" +
////            "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.lastName + " Watchers</div>" +
////          "</div>" +
////          "</div></div>";
//
//                return markup;
//            }
//
//            function formatRepoSelection(repo) {
//                return repo.lastName || repo.text;
//            }      
//        $('body').on('change', '#person-type-select', function () {
//            var thisVal = $(this).val();
//
//            $('body').find('#main-div').attr('data-person-select-type', thisVal);
//                if ($('body').find('#main-div').attr('data-person-select-type') == 'student') {
////                url = 'http://192.168.1.78:8082/UnibookHsisRest/students?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000107,1000108'
//
//                    options = {
//                        ajax: {
//                            url: 'http://192.168.1.78:8082/UnibookHsisRest/students?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000107,1000108',
//                            dataType: 'json',
//                            delay: 250,
//                            data: function (params) {
//                                return {
//                                    keyword: params.term
//                                };
//                            },
//                            processResults: function (data, params) {
//                                // parse the results into the format expected by Select2
//                                // since we are using custom formatting functions we do not need to
//                                // alter the remote JSON data, except to indicate that infinite
//                                // scrolling can be used
////                params.page = params.page || 1;
//
//                                return {
//                                    results: data.data.studentList
//                                };
//                            },
//                            cache: true
//                        },
//                        placeholder: '',
//                        escapeMarkup: function (markup) {
//                            return markup;
//                        }, // let our custom formatter work
//                        minimumInputLength: 1,
//                        templateResult: formatRepo,
//                        templateSelection: formatRepoSelection
//
//                    }
//                } else {
////                url = 'http://192.168.1.78:8082/UnibookHsisRest/teachers?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000062,1000061'
//                    options = {
//                        ajax: {
//                            url: 'http://192.168.1.78:8082/UnibookHsisRest/teachers?token=b46f1d0853e14b5c97f1be3c23568b8858d2ceca7a054ed6908da36819ff30cd&subModuleId=1000638,1000639,1000062,1000061',
//                            dataType: 'json',
//                            delay: 250,
//                            data: function (params) {
//                                return {
//                                    keyword: params.term
//                                };
//                            },
//                            processResults: function (data, params) {
//                                // parse the results into the format expected by Select2
//                                // since we are using custom formatting functions we do not need to
//                                // alter the remote JSON data, except to indicate that infinite
//                                // scrolling can be used
////                params.page = params.page || 1;
//
//                                return {
//                                    results: data.data.teacherList
//                                };
//                            },
//                            cache: true
//                        },
//                        placeholder: '',
//                        escapeMarkup: function (markup) {
//                            return markup;
//                        }, // let our custom formatter work
//                        minimumInputLength: 1,
//                        templateResult: formatRepo,
//                        templateSelection: formatRepoSelection
//
//                    }
//                }
//            $('body').find('#request-read').select2("destroy").select2(options);
//
//        });
//            
//            
//        });
//    });

    $('body').on('click', '#operation_1001342', function () {

        if (!Hsis.dicTypeId) {
            $.notify(Hsis.dictionary[Hsis.lang]['select_information'], {
                type: 'warning'
            });
            return false;
        }

        $('#main-div #dictionary-modal #' + Hsis.lang + '').val('');
        $('#main-div #dictionary-modal #code').val('');
        $('#main-div #dictionary-modal #code').removeClass('error-border success-border');
        $('#main-div #dictionary-modal .span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');

        try {
            var html = '';
            Hsis.Proxy.getDictionariesTypeListByType(1000012, function (result) {
                $.each(result, function (i, v) {
                    html += '<option value="' + v.id + '">' + v.value.az + '</option>';
                });
                $('#dictionary-modal .dic-type-select').html(html);
                $('#dictionary-modal .dic-type-select').find('option').eq(0).attr('selected', 'selected');
                var type = $('#dictionary-modal .dic-type-select').find('option[selected]').val();
                Hsis.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                    var html2 = '';
                    $.each(result, function (i, v) {
                        html2 += '<option value="' + v.id + '">' + v.value.az + '</option>';
                    });
                    $('#dictionary-modal .parent-select').html(html2);
                    $('#dictionary-modal .parent-select').prepend('<option value="0">' + Hsis.dictionary[Hsis.lang]['no_parent'] + '</option>');
                    $('#dictionary-modal .parent-select').find('option').eq(0).attr('selected', 'selected');
                });
            });
            $('#code').val('');
            $('#az').val('');
            $('#en').val('');
            $('#ru').val('');
            $('#main-div .parent-div').hide()
            // $('#main-div .parent-show').attr('data-type', 'show')
            $('#main-div .parent-show').show(1)
            $('#dictionary-modal .btn-dictionary').attr('operation-type', 'add');
            $('#dictionary-modal').modal({
                backdrop: false
            });
            $('#dictionary-modal').find('.input-dictionary-name').removeAttr('id').attr('id', Hsis.lang)
        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1001324', function () {

        var obj = $(this).parents('.res-info');
        var id = obj.attr('data-id')
        $('body').attr('data-resource-id', id)
        $('body').find('.add-new .search-scroll').load('partials/edit_resource.html', function () {

            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');

            });
            Hsis.Proxy.loadDictionariesByTypeId('1000017', 0, function (eduTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(eduTypes);
                $('#main-div #edu_type').html(html);
            });

            Hsis.Proxy.loadDictionariesByTypeId('1000053', 0, function (groupTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(groupTypes);
                $('#main-div #group-type').html(html);
                $('#confirmGroup').attr('action-status', 'edit');

            });
            
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
        });

    });

    $('body').on('click', '#operation_1001339', function () {

        var obj = $(this).parents('.rese-info');
        var id = obj.attr('data-id')
        $('body').find('.col-sm-4.rese-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12'); 
        $('body').attr('data-id', id)
        $('body').find('.add-new .search-scroll').load('partials/edit_research.html', function () {

            Hsis.Proxy.loadDictionariesByTypeId('1000002', 0, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');
            });

            Hsis.Proxy.loadDictionariesByTypeId('1000017', 0, function (eduTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(eduTypes);
                $('#main-div #edu_type').html(html);
            });
//
            Hsis.Proxy.loadDictionariesByTypeId('1000053', 0, function (groupTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(groupTypes);
                $('#main-div #group-type').html(html);
                $('#confirmGroup').attr('action-status', 'edit');

            });

        });

    });

    $('body').on('click', '#operation_1001355', function () {

        var obj = $(this).parents('.aut-info');
        var id = obj.attr('data-id')
        $('body').find('.col-sm-4.aut-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12'); 
        $('body').attr('data-id', id)
        $('body').find('.add-new .search-scroll').load('partials/edit_author.html', function () {

            Hsis.Proxy.loadDictionariesByTypeId('1000002', 0, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');
            });

            Hsis.Proxy.loadDictionariesByTypeId('1000017', 0, function (eduTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(eduTypes);
                $('#main-div #edu_type').html(html);
            });
//
            Hsis.Proxy.loadDictionariesByTypeId('1000053', 0, function (groupTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(groupTypes);
                $('#main-div #group-type').html(html);
                $('#confirmGroup').attr('action-status', 'edit');

            });

        });

    });


    $('body').on('click', '#operation_DELETE', function (e) {
        var obj = $(this).parents('.book-info-block');
        var id = obj.attr('data-id');

        Hsis.Proxy.removeResource(id, function (data) {
            $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                type: 'success'
            });
        })

        return false
    });

    $('body').on('change', '.res_format', function () {
       var code = $(this).find('option:selected').attr('code');
       if(code === Hsis.Codes.PDF_FORMAT){
           $('body').find('#shekil').removeClass('hidden');
           $('body').find('#resfile').removeClass('hidden');
           $('body').find('#labId').removeClass('hidden');
           $('body').find('.file-name').removeClass('hidden');
       }else {
           $('body').find('#shekil').addClass('hidden');
           $('body').find('#resfile').addClass('hidden');
           $('body').find('#labId').addClass('hidden');
           $('body').find('.file-name').addClass('hidden');
       }

   });

    //    -----------------------------------------------------Request Events-----------------------------------------------

    $('#main-div').on('click', '.add-page .confirm-reading[data-type="add"]', function (e) {
        if (Hsis.Validation.validateRequiredFields('resource-edition-required')) {

            try {
 
                var personId = $(this).parents('.reading-item').find('tbody tr').attr('data-person-id');
                var resourceName = $('body').find('#request-res option:selected').text();
                var resourceId = $('body').find('#request-res').val();
                var startDate = $('body').find('#start_date').val();
                var endDate = $('body').find('#last_date').val();
                var html = '<div class="col-md-12 for-align reading-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['res_name'] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['started_read'] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['lastday_read'] + '</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-person-id="' + personId + '" data-resource-id="' + resourceId + '" data-res-push="' + startDate + '" data-res-adopt="' + endDate + '">' +
                        '<td data-res-name>' + resourceName + ' </td>' +
                        '<td data-res-push>' + startDate + ' </td>' +
                        '<td data-res-adopt>' + endDate + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<span class="remove-book-on-add-page">Sil</span>' +
                        '</div>';

                $('#append_read').append(html);
                $('.res-for-read-modal').modal('hide');

            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    });


    $('body').on('click', '.remove-book-on-add-page', function () {
        var removeEl = $(this).parents('.for-align.reading-item');

        $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {
                removeEl.remove();
            },
            theme: 'black'
        });



    })
    
    $('#main-div').on('click', '.edit-page .confirm-reading[data-type="add"]', function (e) {
        if (Hsis.Validation.validateRequiredFields('resource-edition-required')) {

            try {
                
                var person = $('body').find('#person_id').val();
                var request = {
                    personId: $('#person_id').val(),
                    resourceList: [{
                            resourceId: $('#request-res').val(),
                            startDate: $('body').find('#start_date').val(),
                            lastDate: $('body').find('#last_date').val()
                        }],
                    token: Hsis.token
                };
                var formData = new FormData();
                formData.append('request', new Blob([JSON.stringify(request)], {type: "application/json"}));

                Hsis.Proxy.addRequest(formData, function (addData) {

                    Hsis.Proxy.getRequestDetails(person, function (data) {
                        var resourceList = data.resource

                        var html = '';
                        $.each(resourceList, function (i, v) {

                            html += '<div class="col-md-12 for-align reading-item">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['res_name'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['started_read'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['lastday_read'] + '</th>' +
                                    '<th>Status</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resource-id="' + v.resourceId + '" data-res-push="' + v.startDate + '" data-res-adopt="' + v.lastDay + '" data-status-id="' + v.status.id + '">' +
                                    '<td data-res-name>' + v.resourceName + ' </td>' +
                                    '<td data-res-push>' + v.startDate + ' </td>' +
                                    '<td data-res-adopt>' + v.lastDay + ' </td>' +
                                    '<td data-status-id class="status_' + v.status.id + '">' + v.status.value[Hsis.lang] + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-person-id="' + v.personId + '" data-resources="' + v.resourceId + '" edit-reading data-res-push="' + v.startDate + '"  data-status-id="' + v.status.id + '"  data-res-adopt="' + v.lastDay + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                    '<li><a data-id="' + v.id + '" href="#" class="request-remove">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';
                        });

                        $('body').find('#append_edit_read').html(html);
                    });
                    $('.res-for-read-modal').modal('hide');
                });

            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }

        return false
    });

    $('#main-div').on('click', '.edit-page .confirm-reading[data-type="edit"]', function (e) {
        if (Hsis.Validation.validateRequiredFields('resource-edition-required')) {

            try {
                var id = $(this).attr('req-Id');
                var person = $('body').find('#person_id').val();
                var request = {
                    personId: $('#person_id').val(),
                    resourceId: $('#request-res').val(),
                    startDate: $('body').find('#start_date').val(),
                    lastDate: $('body').find('#last_date').val(),
                    status: $('body').find('#request-status').val()
                };
                
                Hsis.Proxy.updateRequest(id, request, function (addData) {

                    Hsis.Proxy.getRequestDetails(person, function (data) {
                        var resourceList = data.resource

                        var html = '';
                        $.each(resourceList, function (i, v) {

                            html += '<div class="col-md-12 for-align reading-item">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['res_name'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['started_read'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['lastday_read'] + '</th>' +
                                    '<th>Status</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resource-id="' + v.resourceId + '" data-res-push="' + v.startDate + '" data-res-adopt="' + v.lastDay + '" data-status-id="' + v.status.id + '">' +
                                    '<td data-res-name>' + v.resourceName + ' </td>' +
                                    '<td data-res-push>' + v.startDate + ' </td>' +
                                    '<td data-res-adopt>' + v.lastDay + ' </td>' +
                                    '<td data-status-id class="status_' + v.status.id + '">' + v.status.value[Hsis.lang] + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resources="' + v.resourceId + '" edit-reading data-res-push="' + v.startDate + '"  data-status-id="' + v.status.id + '"  data-res-adopt="' + v.lastDay + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                    '<li><a data-id="' + v.id + '" href="#" class="request-remove">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '</div>';
                        });

                        $('body').find('#append_edit_read').html(html);
                    });
                    $('.res-for-read-modal').modal('hide');
                });

            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }

        return false
    });

    $('#main-div').on('click', '.add-page .confirm-res-param[data-type="add"]', function (e) {
        if (Hsis.Validation.validateRequiredFields('resource-edition-required')) {

            try {

                var resPage = $('body').find('#res_page').val();
                var resPublishDate = $('body').find('#publish-date-id').val();
                var resPrice = $('body').find('#resource_price').val();
                var resRowSerial = $('body').find('#row_serial').val();
                var html = '<div class="col-md-12 for-align res-edition-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['res_page'] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['res_publish_date'] + '</th>' +
                        '<th>Qiyməti</th>' +
                        '<th>Düzülüş şifrəsi</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-res-page="' + resPage + '" data-res-publish-date="' + resPublishDate + '" data-res-price = "' + resPrice + '" data-res-row-serial = "' + resRowSerial +'">' +
                        '<td data-res-page >' + resPage + ' </td>' +
                        '<td data-res-publish-date>' + resPublishDate + ' </td>' +
                        '<td data-res-price>' + resPrice + ' </td>' +
                        '<td data-res-row-serial>' + resRowSerial + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a data-res-page="' + resPage + '" edit-res-edition data-publish-date="' + resPublishDate + '" data-res-price = "' + resPrice + '" data-res-row-serial = "' + resRowSerial +'" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                        '<li><a delete-contact href="#" class="erase">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';

                $('#append_res_param').append(html);
                $('.resource-edition-modal').modal('hide');
                $('.param-block').has('.blank-panel').children('.blank-panel').remove();
            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    });
    
    $('#main-div').on('click', '.edit-page .confirm-compile-param[data-type="edit"]', function (e) {
        var resourceId = $('body').attr('data-resource-id');
        var compileId = $('body').attr('data-resource-compiler-id');
        var objectForm = {
            compilerTypeId: $('body').find('#res_compiler').val(),
            compilerName: $('body').find('#res_compiler_name').val(),
        }
        Hsis.Proxy.updateResourceCompiler(compileId, objectForm, function (e) {
            Hsis.Proxy.getResourceDetails(resourceId, function (result) {
                var compilerList = result.compilerList;
                var complist = '';
                $.each(compilerList, function (i, v) {
                    complist += '<div class="col-md-12 for-align res-compiler-item">' +
                                '<table class="table-block col-md-12">' +
                                '<thead>' +
                                '<th>Tərtibatçı</th>' +
                                '<th>S.A.A</th>' +
                                '</tr></thead>' +
                                '<tbody>' +
                                '<tr data-id="'+ v.id +'" data-res-compiler="' + v.compilerType.id + '" data-res-compiler-name="' + v.compilerName + '">' +
                                '<td data-res-compiler>' + v.compilerType.value[Hsis.lang] + ' </td>' +
                                '<td data-res-compiler-name>' + v.compilerName + ' </td>' +
                                '</tr>' +
                                '</tbody>' +
                                '</table>' +
                                '<div class="operations-button">' +
                                '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                ' class="glyphicon glyphicon-list"></span></div>' +
                                '<ul class="dropdown-menu">' +
                                '<li><a data-res-compiler="' + v.compilerType.id + '" edit-com-edition data-res-compiler-name="' + v.compilerName + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                '<li><a delete-contact href="#" class="erasec">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '</div>';
                })
                $('#append_compile_param').html(complist);
            })
        })
    });
    
    $('#main-div').on('click', '.edit-page .confirm-compile-param[data-type="add"]', function (e) {
        var resourceId = $('body').attr('data-resource-id');
        var objectForm = {
            compilerTypeId: $('body').find('#res_compiler').val(),
            compilerName: $('body').find('#res_compiler_name').val(),
        }
        Hsis.Proxy.addResourceCompiler(resourceId, objectForm, function (e) {
            Hsis.Proxy.getResourceDetails(resourceId, function (result) {
                var compilerList = result.compilerList;
                var complist = '';
                $.each(compilerList, function (i, v) {
                    complist += '<div class="col-md-12 for-align res-compiler-item">' +
                                '<table class="table-block col-md-12">' +
                                '<thead>' +
                                '<th>Tərtibatçı</th>' +
                                '<th>S.A.A</th>' +
                                '</tr></thead>' +
                                '<tbody>' +
                                '<tr data-id="'+ v.id +'" data-res-compiler="' + v.compilerType.id + '" data-res-compiler-name="' + v.compilerName + '">' +
                                '<td data-res-compiler>' + v.compilerType.value[Hsis.lang] + ' </td>' +
                                '<td data-res-compiler-name>' + v.compilerName + ' </td>' +
                                '</tr>' +
                                '</tbody>' +
                                '</table>' +
                                '<div class="operations-button">' +
                                '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                ' class="glyphicon glyphicon-list"></span></div>' +
                                '<ul class="dropdown-menu">' +
                                '<li><a data-res-compiler="' + v.compilerType.id + '" edit-com-edition data-res-compiler-name="' + v.compilerName + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                '<li><a delete-contact href="#" class="erasec">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                '</ul>' +
                                '</div>' +
                                '</div>';
                })
                $('#append_compile_param').html(complist);
            })
        })
    });
    
    $('#main-div').on('click', '.add-page .confirm-compile-param[data-type="edit"]', function (e) {
        if (Hsis.Validation.validateRequiredFields('resource-compiler-required')) {
            try {

                var resCompilerTypeId = $('body').find('#res_compiler').find('option:selected').val();
                var resCompilerType = $('body').find('#res_compiler').find('option:selected').text();
                var resCompiler = $('body').find('#res_compiler_name').val();
                if (resCompilerTypeId>0) {
                var html = '<div class="col-md-12 for-align res-compiler-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>Tərtibatçı</th>' +
                        '<th>S.A.A</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-res-compiler="' + resCompilerTypeId + '" data-res-compiler-name="' + resCompiler + '">' +
                        '<td data-res-compiler>' + resCompilerType + ' </td>' +
                        '<td data-res-compiler-name>' + resCompiler + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a data-res-compiler="' + resCompilerTypeId + '" edit-com-edition data-res-compiler-name="' + resCompiler + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                        '<li><a delete-compile href="#" class="erasec">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';

                $('#append_compile_param').html(html);
                $('.resource-compiler-modal').modal('hide');
                $('.compile-block').has('.blank-panel').children('.blank-panel').remove();
            }else {
                $('.resource-compiler-modal').modal('hide');
            }

            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    });
    
    $('#main-div').on('click', '.add-page .confirm-compile-param[data-type="add"]', function (e) {

            try {

                var resCompilerTypeId = $('body').find('#res_compiler').find('option:selected').val();
                if ($('body').find('#res_compiler').val() > 0) {
                    $('body').find('#res_compiler_name').attr('resource-compiler-required', true);
                    if (Hsis.Validation.validateRequiredFields('resource-compiler-required')) {
                        //                        
                    } else {
                        return false;
                    }
                }
 
                var resCompilerType = $('body').find('#res_compiler').find('option:selected').text();
                var resCompiler = $('body').find('#res_compiler_name').val();
                if(resCompilerTypeId > 0){
                var html = '<div class="col-md-12 for-align res-compiler-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>Tərtibatçı</th>' +
                        '<th>S.A.A</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-res-compiler="' + resCompilerTypeId + '" data-res-compiler-name="' + resCompiler + '">' +
                        '<td data-res-compiler>' + resCompilerType + ' </td>' +
                        '<td data-res-compiler-name>' + resCompiler + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a data-res-compiler="' + resCompilerTypeId + '" edit-com-edition data-res-compiler-name="' + resCompiler + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                        '<li><a delete-compile href="#" class="erasec">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';

                $('#append_compile_param').append(html);
                $('.resource-compiler-modal').modal('hide');
                $('.compile-block').has('.blank-panel').children('.blank-panel').remove();
            }else{
                $('.resource-compiler-modal').modal('hide');
            }
            } catch (err) {
                console.error(err);
            }
    });

    $('#main-div').on('click', '.add-page .confirm-res-param[data-type="edit"]', function () {

        if (Hsis.Validation.validateRequiredFields('resource-edition-required')) {
            $('body').find('div.res-edition-item.selected').remove();
            try {

                var resPage = $('body').find('#res_page').val();
                var resPublishDate = $('body').find('#publish-date-id').val();
                var resPrice = $('body').find('#resource_price').val();
                var resRowSerial = $('body').find('#row_serial').val();
                var html = '<div class="col-md-12 for-align res-edition-item">' +
                        '<table class="table-block col-md-12">' +
                        '<thead>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['res_page'] + '</th>' +
                        '<th>' + Hsis.dictionary[Hsis.lang]['res_publish_date'] + '</th>' +
                        '<th>Qiyməti</th>' +
                        '<th>Düzülüş şifrəsi</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '<tr data-res-page="' + resPage + '" data-res-publish-date="' + resPublishDate + '" data-res-price = "' + resPrice + '" data-res-row-serial = "' + resRowSerial +'">' +
                        '<td data-res-page >' + resPage + ' </td>' +
                        '<td data-res-publish-date>' + resPublishDate + ' </td>' +
                        '<td data-res-price>' + resPrice + ' </td>' +
                        '<td data-res-row-serial>' + resRowSerial + ' </td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div class="operations-button">' +
                        '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                        ' class="glyphicon glyphicon-list"></span></div>' +
                        '<ul class="dropdown-menu">' +
                        '<li><a data-res-page="' + resPage + '" edit-res-edition data-publish-date="' + resPublishDate + '" data-res-price = "' + resPrice + '" data-res-row-serial = "' + resRowSerial +'" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                        '<li><a delete-contact href="#" class="erase">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';

                $('#append_res_param').append(html);
                $('.resource-edition-modal').modal('hide');

            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    })

    $('#main-div').on('click', '.edit-page .confirm-res-param[data-type="add"]', function (e) {
        
        var resourceId = $('body').attr('data-resource-id');
        var form = {
            publishDate: $('#publish-date-id').val(),
            pageCount: $('#res_page').val(),
            resPrice: $('body').find('#resource_price').val(),
            resRowSerial: $('body').find('#row_serial').val(),
            resourceId: resourceId,
        }

        Hsis.Proxy.addResourceEdition(resourceId, form, function () {
            Hsis.Proxy.getResourceDetails(resourceId, function (data) {
                var editionList = data.editionList
                var edlist = '';

                $.each(editionList, function (i, v) {
                    edlist += '<div class="col-md-12 for-align res-edition-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['res_page'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['res_publish_date'] + '</th>' +
                            '<th>Qiyməti</th>' +
                            '<th>Düzülüş şifrəsi</th>' +
                            '</tr></thead>' +
                            '<tbody>' +
                            '<tr  data-id="' + v.id + '" data-res-page="' + v.pageCount + '" data-res-publish-date="' + v.publishDate + '" data-res-price = "' + v.resPrice + '" data-res-row-serial = "' + v.resRowSerial +'">' +
                            '<td data-res-page >' + v.pageCount + ' </td>' +
                            '<td data-res-publish-date>' + v.publishDate + ' </td>' +
                            '<td data-res-price>' + v.resPrice + ' </td>' +
                            '<td data-res-row-serial>' + v.resRowSerial + ' </td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                            ' class="glyphicon glyphicon-list"></span></div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a  data-res-price = "' + v.resPrice + '" data-res-row-serial = "' + v.resRowSerial +'" data-res-page="' + v.pageCount + '" edit-res-edition  data-publish-date="' + v.publishDate + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a delete-contact href="#" class="erase" data-erase-type="edit-page">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';

                    $('#append_edit_res_param').html(edlist);
                    $('.resource-edition-modal').modal('hide');

                })
            });
        })
    })

    $('#main-div').on('click', '.edit-page .confirm-res-param[data-type="edit"]', function (e) {
        var editionId = $('body').attr('data-resource-edition-id');
        var resourceId = $('body').attr('data-resource-id');
        var form = {
            publishDate: $('#publish-date-id').val(),
            pageCount: $('#res_page').val(),
            resPrice: $('body').find('#resource_price').val(),
            resRowSerial: $('body').find('#row_serial').val()
        }
        Hsis.Proxy.updateResourceEdition(editionId, form, function () {
            Hsis.Proxy.getResourceDetails(resourceId, function (data) {
                var editionList = data.editionList
                var edlist = '';

                $.each(editionList, function (i, v) {
                    edlist += '<div class="col-md-12 for-align res-edition-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['res_page'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['res_publish_date'] + '</th>' +
                            '<th>Qiyməti</th>' +
                            '<th>Düzülüş şifrəsi</th>' +
                            '</tr></thead>' +
                            '<tbody>' +
                            '<tr  data-id="' + v.id + '" data-res-page="' + v.pageCount + '" data-res-publish-date="' + v.publishDate + '" data-res-price = "' + v.resPrice + '" data-res-row-serial = "' + v.resRowSerial +'">' +
                            '<td data-res-page >' + v.pageCount + ' </td>' +
                            '<td data-res-publish-date>' + v.publishDate + ' </td>' +
                            '<td data-res-price>' + v.resPrice + ' </td>' +
                            '<td data-res-row-serial>' + v.resRowSerial + ' </td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                            ' class="glyphicon glyphicon-list"></span></div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a  data-res-price = "' + v.resPrice + '" data-res-row-serial = "' + v.resRowSerial +'" data-res-page="' + v.pageCount + '" edit-res-edition  data-publish-date="' + v.publishDate + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a delete-contact href="#" class="erase" data-erase-type="edit-page">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';
                })

                $('body').find('#append_edit_res_param').html(edlist);
                $('.resource-edition-modal').modal('hide');
            });
        })
    })
    
    $('#main-div').on('click', '[edit-reading]', function (e) {
        try {
            
            $('body').find('#start_date').val('');
            $('body').find('#last_date').val('');
            $('body').find('#request_status').html('')
            $('body').find('#request-res').html('')
            
            var obj = $(this);
            
            obj.parents('div.reading-item').addClass('selected');
            var startDate = obj.attr('data-res-push');
            var lastDay = obj.attr('data-res-adopt');
            var status = obj.attr('data-res-status');
            var modal = $('body').find('.res-for-read-modal');

            $('body').find('#start_date').val(startDate);
            $('body').find('#last_date').val(lastDay);
            $('body').find('#request_status').val(status);
            $('body').find('.confirm-reading').attr('data-type', 'edit');

            var id = $(this).parents('.reading-item').find('tbody tr').attr('data-person-id');
            var resId = $(this).attr('data-resources');
            var requestId = $(this).attr('data-id');
            modal.find('[data-type="edit"]').attr('req-id',requestId);
           
            var statusId = $(this).parents('.reading-item').find('tbody tr').attr('data-status-id');

            Hsis.Proxy.getResourcesSelectList('', function (res) {
                var html = '<option value="0">' + Hsis.dictionary[Hsis.lang]["select"] + '</option>';
                if (res) {
                    $.each(res, function (i, v) {
                        html += '<option value="' + v.id + '">' + v.resourcesName + '</option>';
                    });
                }
                $('#request-res').html(html);

                Hsis.Proxy.getRequestDetails(id, function (data) {

                    $('body').find('#request-res').val(resId);
                    $('body').find('#request-status').val(statusId);
                    
                    modal.modal();

                })
            });

        } catch (er) {
            console.error(er);
        }
    });

    $('body').on('click', '.edit-page [edit-com-edition]', function () {
        $('body').find('confirm-compile-param').attr('data-type', 'edit');
    })
    $('body').on('click', '.add-page [edit-com-edition]', function () {
        $('body').find('confirm-compile-param').attr('data-type', 'add');
    })
    
    $('body').on('click', '.edit-page [edit-res-edition]', function () {
        $('body').find('confirm-res-param').attr('data-type', 'edit');
    })
    $('body').on('click', '.add-page [edit-res-edition]', function () {
        $('body').find('confirm-res-param').attr('data-type', 'add');
    })
    
    $('#main-div').on('click', '[edit-com-edition]', function (e) {
        try {
            var obj = $(this);
            obj.parents('div.res-compiler-item').addClass('selected');
            var compilerName = obj.attr('data-res-compiler-name');
            var compilerTypeId = obj.attr('data-res-compiler');
            var modal = $('body').find('.resource-compiler-modal');
            var id = $(this).parents('.res-compiler-item').find('tbody tr').attr('data-id');
            $('body').attr('data-resource-compiler-id', id);
            modal.modal();
            $('body').find('#res_compiler_name').val(compilerName);
            $('body').find('#res_compiler').find('option[value="' + compilerTypeId + '"]').prop('selected', true);

            $('body').find('.confirm-compile-param').attr('data-type', 'edit');

        } catch (er) {
            console.error(er);
        }
    });
    
    $('#main-div').on('click', '[edit-res-edition]', function (e) {
        try {
            var obj = $(this);
            obj.parents('div.res-edition-item').addClass('selected');
            var page = obj.attr('data-res-page');
            var publishPlaceId = obj.attr('data-publishplace-id');
            var publishDate = obj.attr('data-publish-date');
            var resPrice = obj.attr('data-res-price');
            var resRowSerial = obj.attr('data-res-row-serial');
            var modal = $('body').find('.resource-edition-modal');
            var id = $(this).parents('.res-edition-item').find('tbody tr').attr('data-id');
            $('body').attr('data-resource-edition-id', id);
            modal.modal();
            $('body').find('#res_page').val(page);
            $('body').find('#publish-place-id').find('option[value="' + publishPlaceId + '"]').prop('selected', true);
            $('body').find('#publish-date-id').val(publishDate);
            $('body').find('#resource_price').val(resPrice);
            $('body').find('#row_serial').val(resRowSerial);

            $('body').find('.confirm-res-param').attr('data-type', 'edit');

        } catch (er) {
            console.error(er);
        }
    });

    $('body').on('click', '.abroad-pincode-button-next', function () {
        var keyword = $('body').find('.search-pincode').val();

        if (keyword.length > 0) {
            var queryparams = $('body .search-form').serialize();
            Hsis.Proxy.getPersonDetails(queryparams, function (person) {
                if (person) {
                    if (person.requestUcunYoxlama != 0) {
                        $('.new-upd').css('right', '-100%');

                        var personId = person.id

                        $('body').find('.add-new .search-scroll').load('partials/edit_request.html', function () {

                            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                                $('#main-div #edu_level').html(html);
                                $('#main-div #edu-level-list').html(html);
                                $('body').find('.add-new').css('right', '0');

                            });
                            Hsis.Proxy.loadDictionariesByTypeId('1000017', 0, function (eduTypes) {
                                var html = Hsis.Service.parseDictionaryForSelect(eduTypes);
                                $('#main-div #edu_type').html(html);
                            });

                            Hsis.Proxy.loadDictionariesByTypeId('1000053', 0, function (groupTypes) {
                                var html = Hsis.Service.parseDictionaryForSelect(groupTypes);
                                $('#main-div #group-type').html(html);
                                $('#confirmGroup').attr('action-status', 'edit');

                            });

                            Hsis.Proxy.getRequestDetails(personId, function (data) {
                                var person = data.person
                                $('body #person_id').val(person.id);
                                $('body #person_user_name').val(person.userName);
                                $('body').find('#pincode').val(person.pinCode);
                                $('body').find('#person_birthday').val(person.birthDay);
                                $('body').find('#person_name').val(person.lastName + ' ' + person.middleName + ' ' + person.firstName);
                                $('body #resource_id').val(data.resource.id);
                                var resourceList = data.resource
                                var html = '';
                                $.each(resourceList, function (i, v) {
                                    html = '<div class="col-md-12 for-align reading-item">' +
                                            '<table class="table-block col-md-12">' +
                                            '<thead>' +
                                            '<th>' + Hsis.dictionary[Hsis.lang]['res_name'] + '</th>' +
                                            '<th>' + Hsis.dictionary[Hsis.lang]['started_read'] + '</th>' +
                                            '<th>' + Hsis.dictionary[Hsis.lang]['lastday_read'] + '</th>' +
                                            '<th>Status</th>' +
                                            '</tr></thead>' +
                                            '<tbody>' +
                                            '<tr data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resource-id="' + v.resourceId + '" data-res-push="' + v.startDate + '" data-res-adopt="' + v.lastDay + '" data-status-id="' + v.status.id + '">' +
                                            '<td data-res-name>' + v.resourceName + ' </td>' +
                                            '<td data-res-push>' + v.startDate + ' </td>' +
                                            '<td data-res-adopt>' + v.lastDay + ' </td>' +
                                            '<td data-status-id class="status_' + v.status.id + '">' + v.status.value[Hsis.lang] + ' </td>' +
                                            '</tr>' +
                                            '</tbody>' +
                                            '</table>' +
                                            '<div class="operations-button">' +
                                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                            ' class="glyphicon glyphicon-list"></span></div>' +
                                            '<ul class="dropdown-menu">' +
                                            '<li><a data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resources="' + v.resourceId + '" edit-reading data-res-push="' + v.startDate + '"  data-status-id="' + v.status.id + '"  data-res-adopt="' + v.lastDay + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                            '<li><a data-id="' + v.id + '" href="#" class="request-remove">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                                            '</ul>' +
                                            '</div>' +
                                            '</div>';

                                    $('#append_edit_read').append(html);
                                })
                            });
                        });

                    } else {
                        $('.new-upd').css('right', '-100%');
                        $('.add-new .search-scroll').load('partials/add_request.html', function () {
                            $('body').find('.add-new').css('right', '0');
                            $('body #person_id').val(person.id);
                            $('body #person_user_name').val(person.userName);
                            $('body').find('#pincode').val(person.pinCode);
                            $('body').find('#person_birthday').val(person.birthDay);
                            $('body').find('#person_name').val(person.lastName + ' ' + person.middleName + ' ' + person.firstName);

                        });
                    }
                } else {
                    $.notify('Tapılmadı', {
                        type: 'danger'
                    });
                }

            });
        }
    });

    $('body').on('click', '#confirmRequest', function () {
        if (Hsis.Validation.validateRequiredFields('resource-required')) {
            if ($('body').find('#append_read .reading-item').length > 0) {
                try {
                    var request = {
                        personId: $('#person_id').val(),
                        resourceList: [],
                        token: Hsis.token
                    };
                    $('.reading-item').each(function (i, v) {
                        var tr = $(this).find('tbody tr');
                        request.resourceList.push(
                                {
                                    resourceId: tr.attr('data-resource-id'),
                                    startDate: tr.attr('data-res-push'),
                                    lastDate: tr.attr('data-res-adopt'),
                                    status: tr.attr('data-status-id')
                                });
                    });
                    var formData = new FormData();
                    formData.append('request', new Blob([JSON.stringify(request)], {type: "application/json"}));

                    Hsis.Proxy.addRequest(formData, function () {
                        $('body').find('.add-new').css('right', '-100%')
                        Hsis.Proxy.getRequest();
                    });

                } catch (e) {

                }

            } else {
                $.notify('Resurs əlavə edin', {
                    type: 'danger'
                })
            }

        }
    }),
        
    $('body').on('click', '.add-page-res #confirmAddRes', function () {
        var allValid = true;
//        var allValid2 = true;
        if (Hsis.Validation.validateRequiredFields('resource-required')) {
            if ($('body').find('#append_res_param .res-edition-item').length > 0) {
                try {
                    var formData = new FormData();
                    var resource = {
                        resourceName: $('#res-name').val(),
                        isbnCode: $('#isbn').val(),
                        formatId: $('#format-id').val(),
                        langId: $('#lang-id').val(),
                        resCount: $('#res-count').val(),
                        sectionId: $('#adder_section').val(),
                        bibdescId: $('#bibdesc-id').val(),
                        contentId: $('#res-content').val(),
                        subjectId: $('#subject-id').val(),
                        serialTypeId: $('#res_serial').val(),
                        authorId: $('#author-id').val(),
                        publishPlace: $('#publish-place-id').val(),
                        edition: [],
                        compiler: [],
                        token: Hsis.token
                    };
                    $('.res-edition-item').each(function (i, v) {
                        var tr = $(this).find('tbody tr');
                        resource.edition.push(
                            {
                                publishDate: tr.attr('data-res-publish-date'),
                                pageCount: tr.attr('data-res-page'),
                                resPrice: tr.attr('data-res-price'),
                                resRowSerial: tr.attr('data-res-row-serial')
                            }
                        );
                    });
                    $('.res-compiler-item').each(function (i, v) {
                        var tr = $(this).find('tbody tr');
                        resource.compiler.push(
                            {
                                compilerTypeId: tr.attr('data-res-compiler'),
                                compilerName: tr.attr('data-res-compiler-name')
                            }
                        );
                    });
                    var wrongFiles = '';
                    if ($('.new-add-doc-file')[0].files[0]) {

                        var file = $('body').find('.new-add-doc-file')[0].files[0];
                        if (Hsis.Validation.checkFile(file.type, fileTypes.FILE_CONTENT_TYPE)) {

                            if (file.size > 5 * 1024 * 1024) {
                                $.notify(file.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
                                allValid = false;
                            } else {
                                formData.append('file', file);

                            }
                        } else {
                            wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;
                        }
                    }
//                    var wrongPics = '';
//                    if ($('.uzqabugu')[0].files[0]) {
//
//                        var file2 = $('body').find('.uzqabugu')[0].files[0];
//                        if (Hsis.Validation.checkFile(file2.type, fileTypes.IMAGE_CONTENT_TYPE)) {
//                            if (file2.size > 5 * 1024 * 1024) {
//                                $.notify(file2.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
//                                allValid2 = false;
//                            } else {
//                                formData.append('file2', file2);
//                            }
//                        } else {
//                            wrongPics += wrongPics != '' ? ', ' + file2.name : file2.name;
//                        }
//                    }

                    formData.append('resource', new Blob([JSON.stringify(resource)], {type: "application/json"}));
                    if (allValid) {
                        Hsis.Proxy.addResource(formData, function () {
                            var params = $('.resource-form').serialize();
                            Hsis.Proxy.getResources('', params);
                        });
                    }

                } catch (err) {
                    console.error(err);
                }

            } else {
                $.notify("Nəşri məlumatları doldurun", {
                    type: 'danger'
                });
            }
        } else {

            return false;
        }

    });
    
        
    $('body').on('click', '.edit-page-res', '#confirmAddRes', function () {
        var allValid = true;
        var resId = $('body').attr('data-resource-id')
        if (Hsis.Validation.validateRequiredFields('resource-required')) {

            try {
                var formData = new FormData();
                var imageId = $('body').find('#shekil').attr('data-image-id');
                var imagePath = $('body').find('#resfile').attr('data-path');
                var resource = {
                    resourceName: $('#res-name').val(),
                    isbnCode: $('#isbn').val(),
                    formatId: $('#format-id').val(),
                    langId: $('#lang-id').val(),
                    resCount: $('#res-count').val(),
                    sectionId: $('#adder_section').val(),
                    bibdescId: $('#bibdesc-id').val(),
                    contentId: $('#res-content').val(),
                    subjectId: $('#subject-id').val(),
                    authorId: $('#author-id').val(),
                    publishPlace: $('#publish-place-id').val(),
                    serialTypeId: $('#res_serial').val(),
                    fileId: imageId,
                    filePath:imagePath,
                    token: Hsis.token
                };
                        console.log(resource)
                var wrongFiles = '';
                if ($('.new-add-doc-file')[0].files[0]) {

                    var file = $('body').find('.new-add-doc-file')[0].files[0];
                    if (Hsis.Validation.checkFile(file.type, fileTypes.FILE_CONTENT_TYPE)) {

                        if (file.size > 5 * 1024 * 1024) {
                            alert('large file')
                            $.notify(file.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
                            allValid = false;
                        } else {
                            formData.append('file', file);
                        }
                    } else {
                        wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;
                    }
                }
                
                formData.append('resource', new Blob([JSON.stringify(resource)], { type: "application/json" }));
                    if(allValid) {
                   
                         Hsis.Proxy.updateResource(resId, formData, function () {
                        });
                        $('body').find('select').val(0)
                        Hsis.Proxy.getResources('', '');
                    }
                
            } catch (err) {
                console.error(err);
            }
        } else {
            return false;
        }
    });

    $('body').on('click', '.add-aut-page #confirmAddAuthor', function () {
        var allValid = true;
        if (Hsis.Validation.validateRequiredFields('resource-required')) {
            try {

                var formData = new FormData();
                var authors = {
                    authorName: $('#author-name').val(),
                    birthDeath: $('#about-life').val(),
                    birthPlace: $('#author-publish-place').val(),
                    about: $('#about-author').val(),
                    token: Hsis.token
                };

                var wrongFiles = '';
//                if ($('.new-add-doc-file-aut')[0].files[0]) {
//
//                    var file = $('body').find('.new-add-doc-file-aut')[0].files[0];
//                    if (Hsis.Validation.checkFile(file.type, fileTypes.IMAGE_CONTENT_TYPE)) {
//
//                        if (file.size > 5 * 1024 * 1024) {
//                            alert('large file')
//                            $.notify(file.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
//                            allValid = false;
//                        } else {
//                            formData.append('file', file);
//
//                        }
//                    } else {
//                        wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;
//                    }
//                }

                formData.append('authors', new Blob([JSON.stringify(authors)], {type: "application/json"}));
                if (allValid) {

                    Hsis.Proxy.addAuthor(formData, function () {
                        var params = $('.author-form').serialize();
                        Hsis.Proxy.getAuthorsList();
                    });
                }

            } catch (err) {
                console.error(err);
            }

        } else {

            return false;
        }

    });

    $('body').on('click', '.edit-aut-page #confirmAddAuthor', function () {
        var allValid = true;
        if (Hsis.Validation.validateRequiredFields('resource-required')) {
            try {
                var imageId = $('body').find('#shekilauthor').attr('data-image-id');
                var imagePath = $('body').find('#autfile').attr('data-path');
                var formData = new FormData();
                var author = {
                    authorName: $('#author-name').val(),
                    birthDeath: $('#author-life').val(),
                    birthPlace: $('#author-publish-place').val(),
                    about: $('#about-author').val(),
                    resourceNames: $('#research-author').val(),
                    token: Hsis.token,
                    fileId: imageId,
                    filePath:imagePath
                };
                
//                var wrongFiles = '';
//                if ($('.new-add-doc-file-aut')[0].files[0]) {
//
//                    var file = $('body').find('.new-add-doc-file-aut')[0].files[0];
//                    if (Hsis.Validation.checkFile(file.type, fileTypes.IMAGE_CONTENT_TYPE)) {
//
//                        if (file.size > 5 * 1024 * 1024) {
//                            alert('large file')
//                            $.notify(file.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
//                            allValid = false;
//                        } else {
//                            formData.append('file', file);
//
//                        }
//                    } else {
//                        wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;
//                    }
//                }

                formData.append('author', new Blob([JSON.stringify(author)], {type: "application/json"}));
                if (allValid) {
                    var authorId = $('body').attr('data-id');
                    Hsis.Proxy.updateAuthor(authorId, formData, function () {
                        Hsis.Proxy.getAuthorsList();
                    });
                }

            } catch (err) {
                console.error(err);
            }

        } else {

            return false;
        }

    });

    $('body').on('click', '#author-head', function () {
        Hsis.Proxy.getAuthorsList()
    });

    $('body').on('click', '#elmibash', function () {
        Hsis.Proxy.getResearch()
    });

    $('body').on('click', '.add-res-page #confirmAddResearch', function () {
        var allValid = true;
        if (Hsis.Validation.validateRequiredFields('resource-required')) {
            try {

                var formData = new FormData();
                var research = {
                    sciName: $('#research-name').val(),
                    sciLang: $('#research-language').val(),
                    sciSubject: $('#research-subject').val(),
                    notes: $('#research-notes').val(),
                    sciAuthor: $('#research-author').val(),
                    sciPublishPlace: $('#research-publish-place').val(),
                    sciPublishDate: $('#research-publish-date').val(),
                    token: Hsis.token
                };

                var wrongFiles = '';
                if ($('.new-add-doc-file')[0].files[0]) {

                    var file = $('body').find('.new-add-doc-file')[0].files[0];
                    if (Hsis.Validation.checkFile(file.type, fileTypes.IMAGE_CONTENT_TYPE)) {

                        if (file.size > 5 * 1024 * 1024) {
                            alert('large file')
                            $.notify(file.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
                            allValid = false;
                        } else {
                            formData.append('file', file);

                        }
                    } else {
                        wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;
                    }
                }

                formData.append('research', new Blob([JSON.stringify(research)], {type: "application/json"}));
                if (allValid) {

                    Hsis.Proxy.addResearch(formData, function () {
                        var params = $('.research-form').serialize();
                        Hsis.Proxy.getResearch();
                    });
                }

            } catch (err) {
                console.error(err);
            }

        } else {

            return false;
        }

    });

    $('body').on('click', '.edit-res-page #confirmAddResearch', function () {
        var allValid = true;
        if (Hsis.Validation.validateRequiredFields('resource-required')) {
            try {
                var formData = new FormData();
                var research = {
                    sciName: $('#research-name').val(),
                    sciLang: $('#research-language').val(),
                    sciSubject: $('#research-subject').val(),
                    sciPublishPlace: $('#research-publish-place').val(),
                    sciAuthor: $('#research-author').val(),
                    notes: $('#research_note').val(),
                    sciPublishDate: $('#research-publish-date').val(),
                    token: Hsis.token
                };

                var wrongFiles = '';
                if ($('.new-add-doc-file')[0].files[0]) {

                    var file = $('body').find('.new-add-doc-file')[0].files[0];
                    if (Hsis.Validation.checkFile(file.type, fileTypes.IMAGE_CONTENT_TYPE)) {

                        if (file.size > 5 * 1024 * 1024) {
                            alert('large file')
                            $.notify(file.name + Hsis.dictionary[Hsis.lang]['exceed_volume'], {type: 'warning'});
                            allValid = false;
                        } else {
                            formData.append('file', file);

                        }
                    } else {
                        wrongFiles += wrongFiles != '' ? ', ' + file.name : file.name;
                    }
                }

                formData.append('research', new Blob([JSON.stringify(research)], {type: "application/json"}));
                if (allValid) {
                    var researchId = $('body').attr('data-id');
                    Hsis.Proxy.updateScientificResearch(researchId, formData, function () {
                        Hsis.Proxy.getResearch();
                    });
                }

            } catch (err) {
                console.error(err);
            }

        } else {

            return false;
        }

    });

    $('body').on('click', '#operation_1001343', function () {
        var id = $(this).parents('tr').attr('data-id');
        try {

            if (!id) {
                $.notify(Hsis.dictionary[Hsis.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $('#main-div #dictionary-modal #' + Hsis.lang + '').val('');
            $('#main-div #dictionary-modal #code').val('');
            $('#main-div #dictionary-modal .dic-type-select').html('');
            $('#main-div #dictionary-modal .parent-select').html('');
            $('#main-div #dictionary-modal #code').removeClass('error-border');
            $('#main-div #dictionary-modal #code').removeClass('.success-border');
            $('#main-div #dictionary-modal .span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');

            Hsis.Proxy.getDictionaryDetails(id, function (result) {
                if (result) {
                    var html = '';
                    var parentId = result.data.parentId;
                    Hsis.Proxy.getDictionariesTypeListByType(1000012, function (data) {
                        if (data) {
                            $.each(data, function (i, v) {
                                html += '<option value="' + v.id + '">' + v.value.az + '</option>';
                            });
                            $('#dictionary-modal .dic-type-select').html(html);

                            $('#dictionary-modal #' + Hsis.lang).val(result.data.value[Hsis.lang]);
                            $('#dictionary-modal .btn-dictionary').attr('data-id', id);



                            if (parentId != 0) {
                                Hsis.Proxy.getDictionaryDetails(parentId, function (details) {
                                    Hsis.Proxy.loadDictionariesByTypeId(details.data.typeId, 0, function (type) {
                                        var html2 = '';
                                        $.each(type, function (i, v) {
                                            html2 += '<option value="' + v.id + '">' + v.value[Hsis.lang] + '</option>';
                                        });
                                        $('#dictionary-modal .parent-select').html(html2);
                                        $('#main-div #dictionary-modal #' + Hsis.lang).val(type.value[Hsis.lang]);
                                        $('body').find('#dictionary-modal .parent-select').prepend('<option value="0">' + Hsis.dictionary[Hsis.lang]["no_parent"] + '</option>');
                                        $('body').find('#dictionary-modal .parent-select').find('option[value=' + parentId + ']').attr('selected', 'selected');
                                        $('body').find('#dictionary-modal .dic-type-select').find('option[value=' + details.data.typeId + ']').attr('selected', 'selected');
                                    })
                                });
                            } else {
                                $('body').find('#dictionary-modal .parent-select').prepend('<option value="0">' + Hsis.dictionary[Hsis.lang]["no_parent"] + '</option>');
                                $('body').find('#dictionary-modal .parent-select').find('option[value=0]').attr('selected', 'selected');
                            }

                        }


                    });


                    $('#code').val(result.data.code);
                    $('#dictionary-modal .btn-dictionary').attr('operation-type', 'edit');
                    $('#dictionary-modal').modal({
                        backdrop: false
                    });
                    $('#dictionary-modal').find('.input-dictionary-name').removeAttr('id').attr('id', Hsis.lang);
                    $('.content-body #az').val(result.data.value.az);
                    $('.content-body #en').val(result.data.value.en);
                    $('.content-body #ru').val(result.data.value.ru);

                }
            });
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('change', '#dictionary-table .dic-type-select', function () {
        try {
            var type = $(this).find('option:selected').val();
            Hsis.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                var html2 = '<option value="0">' + Hsis.dictionary[Hsis.lang]["no_parent"] + '</option>';
                $.each(result, function (i, v) {
                    html2 += '<option value="' + v.id + '">' + v.value[Hsis.lang] + '</option>';
                });
                $('body').find('.parent-select').html(html2)
                $('#main-div .dictionary-modal .parent-select').html(html2);
//                $('#main-div .dictionary-modal .parent-select').prepend('<option value="0">' + Hsis.dictionary[Hsis.lang]["no_parent"] + '</option>');
//                $('#main-div .dictionary-modal .parent-select').find('option').eq(0).prop('selected', 'selected');
            });
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#dictionary-modal .btn-dictionary', function () {

        try {
            var operationType = $(this).attr('operation-type');
            var dicId = $(this).attr('data-id');
            var code = $('#code').val();
            var lang = Hsis.lang[0].toUpperCase() + Hsis.lang.slice(1);
            if (code.trim().length == 0) {
                $.notify(Hsis.dictionary[Hsis.lang]['fill_code'], {
                    type: 'warning'
                });
                return false;
            }

            var dictionary = {
                code: $('#main-div #code').val(),
                parentId: $('#main-div .parent-select').find('option:selected').val(),
                typeId: Hsis.dicTypeId

            };
            var nameLang = $('body #' + Hsis.lang).val();
            dictionary["name" + lang] = nameLang;

            if (nameLang.trim().length == 0) {
                $.notify(Hsis.dictionary[Hsis.lang]['fill_dictionary_name'], {
                    type: 'warning'
                });
                return false;
            }

            if (operationType == 'edit') {
                dictionary.id = dicId;

                Hsis.Proxy.editDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Hsis.statusCodes.OK) {
                            $('#main-div .dictionary-modal').modal('hide');
                            $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                type: 'success'
                            });
                            Hsis.Proxy.loadOperations(Hsis.currModule, function (operations) {
                                $('#buttons_div').find('ul').html(Hsis.Service.parseOperations(operations, 1));

                                Hsis.Proxy.loadDictionariesByTypeId(Hsis.dicTypeId, 0, function (result) {
                                    Hsis.Service.parseDictype(result);
                                });

                            });
                        }
                    }
                });
            } else if (operationType == 'add') {

                Hsis.Proxy.addDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Hsis.statusCodes.OK) {
                            $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                type: 'success'
                            });

                            $('.span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');
                            $('#main-div .dictionary-modal #code').val('');
                            $('#main-div .dictionary-modal #az').val('');
                            $('#main-div .dictionary-modal #en').val('');
                            $('#main-div .dictionary-modal #ru').val('');
                            $('#main-div .dictionary-modal #code').removeClass('error-border success-border');
                            Hsis.Proxy.getDictionariesTypeListByType(1000012, function () {
                                Hsis.Proxy.loadOperations(Hsis.currModule, function (operations) {
                                    $('#buttons_div').find('ul').html(Hsis.Service.parseOperations(operations, 1));

                                    Hsis.Proxy.loadDictionariesByTypeId(Hsis.dicTypeId, 0, function (result) {
                                        Hsis.Service.parseDictype(result);
                                    });

                                });
                            });
                        }
                    }
                });
            }
        } catch (err) {
            if (console)
                console.error(err);
        }
    });

    $('body').on('click', '#operation_1001344', function () {
        var id = $(this).parents('tr').attr('data-id');

        try {
            if (!id) {
                $.notify(Hsis.dictionary[Hsis.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }

            $.confirm({
                title: Hsis.dictionary[Hsis.lang]['warning'],
                content: Hsis.dictionary[Hsis.lang]['delete_info'],
                confirm: function () {
                    Hsis.Proxy.removeDictionary(id, function (code) {
                        if (code) {
                            if (code.code === Hsis.statusCodes.OK) {
                                $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                    type: 'success'
                                });
                                Hsis.Proxy.loadDictionaries();
                            }
                        }
                    });
                },
                theme: 'black'
            });

        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#operation_1001325', function () {
        var redat = $(this);
        var redatParent = redat.parents('div.res-info');
        var id = redatParent.attr('data-id');
        try {
            if (!redat) {
                $.notify(Hsis.dictionary[Hsis.lang]['select_information'], {
                    type: 'warning'
                });
                return false;
            }
            $.confirm({
                title: Hsis.dictionary[Hsis.lang]['warning'],
                content: Hsis.dictionary[Hsis.lang]['delete_info'],
                confirm: function () {
                    Hsis.Proxy.removeResource(id, function () {
                        var params = $('.resource-form').serialize();
                        Hsis.Proxy.getResources('', params);

                    });
                },
                theme: 'black'
            });
        $('body').find('.col-sm-4.res-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('change', '#dictionary-modal .dic-type-select', function () {
        try {
            var type = $(this).find('option:selected').val();
            Hsis.Proxy.loadDictionariesByTypeId(type, 0, function (result) {
                var html2 = '';
                $.each(result, function (i, v) {
                    html2 += '<option value="' + v.id + '">' + v.value[Hsis.lang] + '</option>';
                });
                $('#main-div #dictionary-modal .parent-select').html(html2);
                $('#main-div #dictionary-modal .parent-select').prepend('<option value="0">' + Hsis.dictionary[Hsis.lang]["no_parent"] + '</option>');
                $('#main-div #dictionary-modal .parent-select').find('option').eq(0).prop('selected', 'selected');
            });
        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.dictionary-modal .btn-dictionary', function () {

        try {
            var operationType = $(this).attr('operation-type');
            var dicId = $(this).attr('data-id');
            var code = $('#code').val();
            var lang = Hsis.lang[0].toUpperCase() + Hsis.lang.slice(1);
            if (code.trim().length == 0) {
                $.notify(Hsis.dictionary[Hsis.lang]['fill_code'], {
                    type: 'warning'
                });
                return false;
            }

            var dictionary = {
                code: $('#main-div #code').val(),
                parentId: $('#main-div .parent-select').find('option:selected').val(),
                typeId: Hsis.dicTypeId

            };
            var nameLang = $('body #' + Hsis.lang).val();
            dictionary["name" + lang] = nameLang;

            if (nameLang.trim().length == 0) {
                $.notify(Hsis.dictionary[Hsis.lang]['fill_dictionary_name'], {
                    type: 'warning'
                });
                return false;
            }

            if (operationType == 'edit') {
                dictionary.id = dicId;

                Hsis.Proxy.editDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Hsis.statusCodes.OK) {
                            $('#main-div .dictionary-modal').modal('hide');
                            $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                type: 'success'
                            });
                            Hsis.Proxy.loadOperations(Hsis.currModule, function (operations) {
                                $('#buttons_div').find('ul').html(Hsis.Service.parseOperations(operations, 1));

                                Hsis.Proxy.loadDictionariesByTypeId(Hsis.dicTypeId, 0, function (result) {
                                    Hsis.Service.parseDictype(result);
                                });

                            });
                        }
                    }
                });
            } else if (operationType == 'add') {

                Hsis.Proxy.addDictionary(dictionary, function (result) {
                    if (result) {
                        if (result.code === Hsis.statusCodes.OK) {
                            $.notify(Hsis.dictionary[Hsis.lang]['success'], {
                                type: 'success'
                            });

                            $('.span-code').removeClass('fa fa-close span-code-warning fa-check span-code-success');
                            $('#main-div .dictionary-modal #code').val('');
                            $('#main-div .dictionary-modal #az').val('');
                            $('#main-div .dictionary-modal #en').val('');
                            $('#main-div .dictionary-modal #ru').val('');
                            $('#main-div .dictionary-modal #code').removeClass('error-border success-border');
                            Hsis.Proxy.getDictionariesTypeListByType(1000012, function () {
                                Hsis.Proxy.loadOperations(Hsis.currModule, function (operations) {
                                    $('#buttons_div').find('ul').html(Hsis.Service.parseOperations(operations, 1));

                                    Hsis.Proxy.loadDictionariesByTypeId(Hsis.dicTypeId, 0, function (result) {
                                        Hsis.Service.parseDictype(result);
                                    });

                                });
                            });
                        }
                    }
                });
            }
        } catch (err) {
            if (console)
                console.error(err);
        }
    });

    $('body').on('click', '[delete-request]', function () {
        var reqData = $(this)
        var reqDataParent = reqData.parents('div.book-info-block');
        var id = reqDataParent.attr('data-id');

        $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {

                Hsis.Proxy.removeRequest(id, function () {
                    Hsis.Proxy.getRequest();
                });
            },
            theme: 'black'
        });
    });

    $('body').on('click', '#operation_1001356', function () {
//        var autData = $(this);
        var autParent = $(this).parents('.aut-info');
        var id = autParent.attr('data-id');

        $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {

                Hsis.Proxy.removeAuthor(id, function () {
                    Hsis.Proxy.getAuthorsList();
                     $('body').find('.col-sm-4.aut-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12'); 
                });
            },
            theme: 'black'
        });
    });

    $('#main-div').on('click', '#operation_1001358', function () {
        try {

            $('body').find('.new-upd').css('right', '0');
            $('#main-div .abroad-pincode-button-next').removeClass('hidden');
            $('#main-div .abroad-pincode-button-next').attr('data-step', '1');
            $('#main-div .abroad-pincode-button-next').attr('data-operation-type', 'new');
            $('#main-div .abroad-pincode-button-next').removeAttr('data-person-id');
            $('#main-div .abroad-pincode-button-next').removeAttr('data-person-status');
            $('#main-div .abroad-pincode-button-next').removeAttr('data-useless');
            $('#main-div .abroad-pincode-button-next').removeAttr('data-type');
            $('#main-div .abroad-pincode-div-first').removeClass('hidden');
            $('#main-div .pincode').text('');
            $('#main-div .abroad-pincode-div-second').addClass('hidden');
            $('#main-div .iamas-search').addClass('hidden');
            $('#main-div .abroad-pincode-button-back').addClass('hidden');
            $('#main-div .search-pincode').val('');

        } catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '#checkPin', function () {
        try {
        } catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.alfa', function () {
        $('body').find('.col-sm-4.aut-info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12'); 
//        $(this).data('clicked', true);
        var letter = $(this).html();
        var params = "alphabet=" + letter;
        $('body').find('#alphakey').val(letter)
        Hsis.Proxy.getAuthorsList('', params, function () {
        })
        return false
    });

    $('body').find('.select-with-search').select2();

    $('body').on('change', '#person-type-select', function () {
        var thisVal = $(this).val();

        $('body').find('#main-div').attr('data-person-select-type', thisVal)

    });

    $('body').on('click', '#operation_1001360', function () {

        var obj = $(this).parents('.book-info-block');
        var id = obj.attr('data-id')

        var objj = $(this).parents('.info');
        var personId = objj.attr('data-person-id');


        $('body').attr('data-librequest-id', id)
        $('body').find('.add-new .search-scroll').load('partials/edit_request.html', function () {
        $('body').find('.col-sm-4.info').fadeOut();
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12'); 
            Hsis.Proxy.loadDictionariesByTypeId('1000002', 1000700, function (eduLevel) {
                var html = Hsis.Service.parseDictionaryForSelect(eduLevel);
                $('#main-div #edu_level').html(html);
                $('#main-div #edu-level-list').html(html);
                $('body').find('.add-new').css('right', '0');

            });
            Hsis.Proxy.loadDictionariesByTypeId('1000017', 0, function (eduTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(eduTypes);
                $('#main-div #edu_type').html(html);
            });

            Hsis.Proxy.loadDictionariesByTypeId('1000053', 0, function (groupTypes) {
                var html = Hsis.Service.parseDictionaryForSelect(groupTypes);
                $('#main-div #group-type').html(html);
                $('#confirmGroup').attr('action-status', 'edit');

            });

            Hsis.Proxy.getRequestDetails(personId, function (data) {
                var person = data.person
                $('body #person_id').val(person.id);
                $('body #person_user_name').val(person.userName);
                $('body').find('#pincode').val(person.pinCode);
                $('body').find('#person_birthday').val(person.birthDay);
                $('body').find('#person_name').val(person.lastName + ' ' + person.middleName + ' ' + person.firstName);
                $('body #resource_id').val(data.resource.id);
                var resourceList = data.resource
                var html = '';
                $.each(resourceList, function (i, v) {
                    html = '<div class="col-md-12 for-align reading-item">' +
                            '<table class="table-block col-md-12">' +
                            '<thead>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['res_name'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['started_read'] + '</th>' +
                            '<th>' + Hsis.dictionary[Hsis.lang]['lastday_read'] + '</th>' +
                            '<th>Status</th>' +
                            '</tr></thead>' +
                            '<tbody>' +
                            '<tr data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resource-id="' + v.resourceId + '" data-res-push="' + v.startDate + '" data-res-adopt="' + v.lastDay + '" data-status-id="' + v.status.id + '">' +
                            '<td data-res-name>' + v.resourceName + ' </td>' +
                            '<td data-res-push>' + v.startDate + ' </td>' +
                            '<td data-res-adopt>' + v.lastDay + ' </td>' +
                            '<td data-status-id class="status_' + v.status.id + '">' + v.status.value[Hsis.lang] + ' </td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '<div class="operations-button">' +
                            '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                            ' class="glyphicon glyphicon-list"></span></div>' +
                            '<ul class="dropdown-menu">' +
                            '<li><a data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resources="' + v.resourceId + '" edit-reading data-res-push="' + v.startDate + '"  data-status-id="' + v.status.id + '"  data-res-adopt="' + v.lastDay + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                            '<li><a data-id="' + v.id + '" href="#" class="request-remove">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>';

                    $('#append_edit_read').append(html);
                })
            });
        });
    });
        
    $('body').on('click', '.request-remove', function () {
        var id = $(this).parents('.reading-item').find('tbody tr').attr('data-id');
        var personId = $(this).parents('.reading-item').find('tbody tr').attr('data-person-id');
        $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {

                Hsis.Proxy.removeRequest(id, function () {

                    Hsis.Proxy.getRequestDetails(personId, function (data) {
                        var resourceList = data.resource
                        var html = '';
                        $.each(resourceList, function (i, v) {

                            html += '<div class="col-md-12 for-align reading-item">' +
                                    '<table class="table-block col-md-12">' +
                                    '<thead>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['res_name'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['started_read'] + '</th>' +
                                    '<th>' + Hsis.dictionary[Hsis.lang]['lastday_read'] + '</th>' +
                                    '<th>Status</th>' +
                                    '</tr></thead>' +
                                    '<tbody>' +
                                    '<tr data-id="' + v.id + '" data-person-id="' + v.personId + '" data-resource-id="' + v.resourceId + '" data-res-push="' + v.startDate + '" data-res-adopt="' + v.lastDay + '" data-status-id="' + v.status.id + '">' +
                                    '<td data-res-name>' + v.resourceName + ' </td>' +
                                    '<td data-res-push>' + v.startDate + ' </td>' +
                                    '<td data-res-adopt>' + v.lastDay + ' </td>' +
                                    '<td data-status-id class="status_' + v.status.id + '">' + v.status.value[Hsis.lang] + ' </td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<div class="operations-button">' +
                                    '<div class="operations dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span' +
                                    ' class="glyphicon glyphicon-list"></span></div>' +
                                    '<ul class="dropdown-menu">' +
                                    '<li><a data-person-id="' + v.personId + '" data-resources="' + v.resourceId + '" edit-reading data-res-push="' + v.startDate + '"  data-status-id="' + v.status.id + '"  data-res-adopt="' + v.lastDay + '" href="#" class="edit">' + Hsis.dictionary[Hsis.lang]['edit'] + '</a></li>' +
                                    '<li><a data-id="' + v.id + '" href="#" class="request-remove">' + Hsis.dictionary[Hsis.lang]['erase'] + '</a></li>' + '</ul>' +
                                    '</div>' +
                                    '</div>';

                            });

                        $('body').find('#append_edit_read').html(html);
                    });
                });
            },
            theme: 'black'
        });

    });
    
    $('body').on('click', '#requestlist tbody tr', function (e) {
        try {
                       
            var id = $(this).attr('data-person-id');
            Hsis.Proxy.getRequestDetails(id, function (regData) {
                var html = '';
                $.each(regData.resource, function (i, v) {
                    html +=
                            '<p class="books-p" data-person-id="' + v.id + '">' + ++i + '. "' + v.resourceName + '",   ' + v.startDate + ' - ' + v.lastDay + ' <span class="status_' + v.status.id + '">' + v.status.value[Hsis.lang] + '</span> ' + v.finishDate + '</p>'

                })
                $('body').find('.definition-list').html(html)

            })
            
            $('.type_2_btns').html(Hsis.Service.parseOperations(Hsis.operationList, '2'));
            $('body').find('.col-sm-12.requestlist').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.info').fadeIn(1).css('right', '0').attr('data-person-id', id);
            $('body').find('#requestlist tr').removeClass('active');
            
            $(this).addClass('active')

        } catch (err) {
            console.error(err);
        }
    });
    
    $('body').on('click', '#restable tbody tr', function (e) {
        try {
            var id = $(this).attr('data-id');
            var formatId = $(this).attr('data-format-value');
            var format = $(this).attr('data-format');
            var formatCode = $(this).attr('data-format-code');
            var placeId = $(this).attr('data-place-value');
            var publishDate = $(this).attr('data-publishdate');
            var langId = $(this).attr('data-lang');
            var contentId = $(this).attr('data-content-value');
            var subjectId = $(this).attr('data-subject-value');
            var bibdescId = $(this).attr('data-bibdesc-value');
            var pageCount = $(this).attr('data-pagecount');
            var fileId = $(this).attr('data-file-id');
            if (fileId!=0 && (formatCode == Hsis.Codes.PDF_FORMAT)) {
                $('body').find('.res-info .faylyukleyen').removeClass('hidden');
            }else{
                $('body').find('.res-info .faylyukleyen').addClass('hidden');
            }
//            var fileId = $(this).attr('data-file-id');
//            if (fileId!=0 && format==1008043) {
//                $('body').find('.res-info .faylyukleyen').removeClass('hidden');
//            }else{
//                $('body').find('.res-info .faylyukleyen').addClass('hidden');
//            }
            $('.type_2_btns').html(Hsis.Service.parseOperations(Hsis.operationList, '2'))

            $('body').find('.info-item.student-name span.langspan').html(langId);
            $('body').find('.info-item.student-name span.placespan').html(placeId);
            $('body').find('.info-item.student-name span.datespan').html(publishDate);
            $('body').find('.info-item.student-name span.formatspan').html(formatId);
            $('body').find('.info-item.student-name span.contentspan').html(contentId);
            $('body').find('.info-item.student-name span.subjectspan').html(subjectId);
            $('body').find('.info-item.student-name span.bibdesspan').html(bibdescId);
            $('body').find('.info-item.student-name span.pagecountspan').html(pageCount);
            
            $('body').find('.col-sm-12.restablediv').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.res-info').fadeIn(1).css('right', '0').attr('data-id', id);
            $('body').find('.col-sm-4.res-info').attr('data-file-id', fileId);
            $('body').find('#restable tr').removeClass('active');
            $('body').find('.resource_file').attr('href', Hsis.urls.ELIBRARY + 'resources/'+ id +'/image?token=' + Hsis.token ? Hsis.urls.ELIBRARY + 'resources/'+ id +'/image?token=' + Hsis.token : '#')
            
            $(this).addClass('active')
            
        }catch (err) {
           console.error(err); 
        }
    });
    
     $('body').on('click', '#muelliflist tbody tr', function (e) {
        try {
            var id = $(this).attr('data-id');
            var haqqinda = $(this).attr('data-about');
            var eserleri = $(this).attr('data-resources');
            var res = eserleri.split(", ");
            var html = '';
            $.each(res, function (i, v) {
                    html +=
                            '<p>' + ++i + '. ' + v + '</p>'

                })
            
            $('.muellifshekli').removeClass('hidden')
            $('.type_2_btns').html(Hsis.Service.parseOperations(Hsis.operationList, '2'))

            $('body').find('.info-item.student-name span.haqqinda').html(haqqinda);
            $('body').find('.info-item.student-name span.eserleri').html(html);
            $('body').find('.muellifshekli-lightbox').attr('href', Hsis.urls.ELIBRARY + 'authors/'+ id +'/image?token=' + Hsis.token)
            $('body').find('.muellifshekli').attr('src', Hsis.urls.ELIBRARY + 'authors/'+ id +'/image?token=' + Hsis.token)
            $('body').find('img.muellifshekli').on('error', function () {
                            // $(this).attr('src','http://anl.az/new/images/book.png');
                            $('.muellifshekli').addClass('hidden')
                        });
            $('body').find('.col-sm-12.auttablediv').removeClass('col-sm-12').addClass('col-sm-8');
            
            setTimeout(function(){
                 $('body').find('.col-sm-4.aut-info').fadeIn(1).css('right', '0').attr('data-id', id);
            }, 200)
           
            $('body').find('#muelliflist  tr').removeClass('active');
            
            $(this).addClass('active')
            
        }catch (err) {
           console.error(err); 
        }
    });
    
    $('body').on('click', '#resetable tbody tr', function (e) {
        try {
            var id = $(this).attr('data-id');
            var placeId = $(this).attr('data-place');
            var placeValue = $(this).attr('data-place-value');
            var publishDate = $(this).attr('data-publish-date');
            var langId = $(this).attr('data-langid');
            var langValue = $(this).attr('data-lang-value');

            $('.type_2_btns').html(Hsis.Service.parseOperations(Hsis.operationList, '2'))

            $('body').find('.info-item.student-name span.langspan').html(langValue);
            $('body').find('.info-item.student-name span.langspan').attr('data-lang-id', langId);
            $('body').find('.info-item.student-name span.placespan').html(placeValue);
            $('body').find('.info-item.student-name span.placespan').attr('data-place-id', placeId);
            $('body').find('.info-item.student-name span.datespan').html(publishDate);
            
            $('body').find('.col-sm-12.resetablediv').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.rese-info').fadeIn(1).css('right', '0').attr('data-id', id);
            $('body').find('#resetable tr').removeClass('active');
            
            $(this).addClass('active')
            
        }catch (err) {
           console.error(err); 
        }
    });
    
        $('body').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');
            var resParams = $('.resource-form').serialize();
            var autParams = $('.author-form').serialize();
            var sciParams = $('.scientific-form').serialize();
            var reqParams = $('.request-filt-form').serialize();

            $btn.prop('disabled', true);
            if (typeTable == 'catalogue') {
           
                Hsis.Proxy.getResources(page, resParams, function (data) {
                     $btn.attr('data-page', parseInt(page) + 1);
                     $btn.prop('disabled', false);
                     if (!data || data.length == 0) {
                         $btn.remove();
                    }
                 });  
            
            }
            else if (typeTable == 'scicatalogue') {
           
                Hsis.Proxy.getResearch(page, sciParams, function (data) {
                     $btn.attr('data-page', parseInt(page) + 1);
                     $btn.prop('disabled', false);
                     if (!data || data.length == 0) {
                         $btn.remove();
                    }
                 });  
            
            }
            else if (typeTable == 'autcatalogue') {
           
                Hsis.Proxy.getAuthorsList(page, autParams, function (data) {
                     $btn.attr('data-page', parseInt(page) + 1);
                     $btn.prop('disabled', false);
                     if (!data || data.length == 0) {
                         $btn.remove();
                    }
                 });  
            
            }
            else if (typeTable == 'reqcatalogue') {
           
                Hsis.Proxy.getRequest(page, reqParams, function (data) {
                     $btn.attr('data-page', parseInt(page) + 1);
                     $btn.prop('disabled', false);
                     if (!data || data.length == 0) {
                         $btn.remove();
                    }
                 });  
            
            }
        }
        catch (err) {
            console.error(err);
        }
    });
  
    $('.main-content-upd').on('keypress', function (e) {
        if (e.keyCode == 13) {
            $('body').find('.col-sm-4').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
        }
    });
    
    //---------------------------------------------------------------------------- ELEKTRON KALATOG - Filter Changes -------------------------------------------------------------------------------------------------
        $('body').on('click', '.add-edition', function () {
            $('.resource-edition-modal').modal();
            $('.resource-edition-modal').find('input').val('');
            $('.resource-edition-modal select').find('option:selected').prop('selected', false);
            $('body').find('.confirm-res-param').attr('data-type', 'add');
        });
        $('body').on('click', '.add-compiler', function () {
            $('.resource-compiler-modal').modal();
            $('.resource-compiler-modal').find('input').val('');
            $('.resource-compiler-modal select').find('option:selected').prop('selected', false);
            $('body').find('.confirm-compile-param').attr('data-type', 'add');
        });
        
        $('body').on('click', '#elekbash', function () {
            $("#res_author_filter").select2("val", " ", true);
            $('.resource-form')[0].reset();
            $('body').find('#alphakey').val('');
            Hsis.Proxy.getResources();
        });
//---------------------------------------------------------------------------- ELEKTRON KALATOG - Filter Changes -------------------------------------------------------------------------------------------------
        
        $('body').on('click', '.resalpha', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            $(this).data('clicked', true);
            var letter = $(this).html();
//            var params = "alphabet=" + letter;
            $('body').find('#alphakey').val(letter)
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
            return false
        });
    
        $('body').on('change', '#res_section_filter', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });
        
        $('body').on('change', '#res_author_filter', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });
        
        $('body').on('change', '#res_bib_description', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });

        $('body').on('change', '#res_publish_country', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });

        $('body').on('change', '#res_subject', function () {
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });
        $('body').on('change', '#res_format', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            //        var value = $(this).val();
            //        $('form input[name="format"]').val(value);
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });
        $('body').on('change', '#res_language', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });

        $('body').on('change', '#res_content', function () {
            $('body').find('.col-sm-4.res-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.resource-form').serialize();
            Hsis.Proxy.getResources('', params);
            $('.btn-load-more').remove('data-page')
        });

//---------------------------------------------------------------------------- Remove Resource File-------------------------------------------------------------------------------------------------    
    


    $('body').on('click', '#clearauthor', function () {
        
        $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {
                $('body').find('#shekilauthor').attr('data-image-id', '');
                $('body').find('.new-add-doc-file').val('');
                $('body').find('#autfile').html('');
                $('#clearauthor').addClass('hidden');
            },
            theme: 'black'
        });
        
        return false;
    });
    
    $('body').on('click', '#clear', function () {
        
        $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {
                $('body').find('#shekil').attr('data-image-id', '');
                $('body').find('.new-add-doc-file').val('');
                $('body').find('#resfile').html('');
                $('#clear').addClass('hidden');
            },
            theme: 'black'
        });
        
        return false;
    });
    $('body').on('click', '#clearuzqabugu', function () {
            $.confirm({
            title: Hsis.dictionary[Hsis.lang]['warning'],
            content: Hsis.dictionary[Hsis.lang]['delete_info'],
            confirm: function () {
                $('body').find('.uzqabugu').val('');
                $('body').find('.uzfile').attr('src', '');
                $('#clearuzqabugu').addClass('hidden');        
             },
            theme: 'black'
        });    
        return false;
    });

            $('body').on('change', '.uzqabugu', function (e) {
                var FileSize = $(this)[0].files[0].size / 1024 / 1024;
                if (FileSize > 5) {
                    $.notify("Maksimal fayl həcmi 5mb olmalıdır! Faktiki(" + this.files[0].size/1024/1024 + "MB)", {
                                        type: 'danger'
                                    });
                                    this.value = "";
               // $(file).val(''); //for clearing with Jquery
            } else {
                            $('body #clearuzqabugu').removeClass('hidden');
                            $('body').find('#uzfile').attr('src', this.files[0]);
            }
        });
        
            $('body').on('change', '.new-add-doc-file', function (e) {
                var fileName = this.files[0].name;
                var FileSize = $(this)[0].files[0].size / 1024 / 1024;
                if (FileSize > 5) {
                    $.notify("Maksimal fayl həcmi 5mb olmalıdır! Faktiki(" + this.files[0].size/1024/1024 + "MB)", {
                                        type: 'danger'
                                    });
                                    this.value = "";
               // $(file).val(''); //for clearing with Jquery
            } else {
                            $('body #clear').removeClass('hidden');
                            $('body').find('#resfile').text(fileName);
            }
        });
        
        $('body').on('change', '.new-add-doc-file-aut', function (e) {
        var fileName = this.files[0].name;
        var FileSize = $(this)[0].files[0].size / 1024 / 1024;
        if (FileSize > 5) {
            $.notify("Maksimal fayl həcmi 5mb olmalıdır! Faktiki(" + this.files[0].size/1024/1024 + "MB)", {
                        type: 'danger'
                });
            this.value = "";
        } else {
                $('body').find('#clearauthor').removeClass('hidden');
                $('body').find('#autfile').text(fileName);
        }
    });
    
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    
    //---------------------------------------------------------------------------- ELMİ ARAŞDIRMALAR - Filter Changes -------------------------------------------------------------------------------------------------
    

    
        
        $('body').on('change', '#sci_publish_country', function () {
            $('body').find('.col-sm-4.rese-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.scientific-form').serialize();
            Hsis.Proxy.getResearch('', params);
            $('.btn-load-more').remove()
        });

        $('body').on('change', '#sci_subject', function () {
            $('body').find('.col-sm-4.rese-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.scientific-form').serialize();
            Hsis.Proxy.getResearch('', params);
            $('.btn-load-more').remove()
        });

        $('body').on('change', '#sci_language', function () {
            $('body').find('.col-sm-4.rese-info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            var params = $('.scientific-form').serialize();
            Hsis.Proxy.getResearch('', params);
            $('.btn-load-more').remove()
        });
        
    //---------------------------------------------------------------------------- Remove Author File-------------------------------------------------------------------------------------------------


    //---------------------------------------------------------------------------- END Filter Changes -------------------------------------------------------------------------------------------------
        
    
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    
    
    
    //---------------------------------------------------------------------------- Sorğular - Filter Changes -------------------------------------------------------------------------------------------------


    
        
        $('body').on('change', '#status', function () {
            var params = $('.request-filt-form').serialize();
            $('body').find('.col-sm-4.info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            Hsis.Proxy.getRequest('', params);
            $('.btn-load-more').remove()
        });
        $('body').on('change', '#start_dated, #last_dated', function(){
            var start = $('body').find('#start_dated').val();
            var last = $('body').find('#last_dated').val();
            if(start&&last){
    //        $('body').on('click', '.search-reqlist', function () {
                var params = $('.request-filt-form').serialize();
                $('body').find('.col-sm-4.info').fadeOut();
                $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                Hsis.Proxy.getRequest('', params);
                $('.btn-load-more').remove();
                return false;
            }
        });
        $('body').on('change', '#uni', function () {
            var params = $('.request-filt-form').serialize();
            $('body').find('.col-sm-4.info').fadeOut();
            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
            Hsis.Proxy.getRequest('', params);
            $('.btn-load-more').remove()
        });
        
        $('body').on('click', '.filter', function () {
            $(".module_s").stop().slideToggle(400)
        
        });
        $('body').on('click', '.filter-res', function () {
            $(".module_1000015").stop().slideToggle(400)
        
        });
        $('body').on('click', '.filter-rese', function () {
            $(".module_1000017").stop().slideToggle(400)
        
        });
        $('body').on('click', '.hide-menu', function () {
            $('.app-list').stop().slideToggle();
        });
//     $('body').on('click', '.search-reqlist', function (e) {
//        try {
//                var request = {
//                        startDate: $('#start_dated').val(),
//                        lastDate: $('#last_dated').val(),
//                    };
//                    $('body').find('.col-sm-4.info').fadeOut();
//                    $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
//                    Hsis.Proxy.getRequestForSelect('', request, function (data) {
//                
//                });
//                    return false;
//                    $('.filter-for-lastdate').modal('hide');
//        } catch (e) {
//            
//        }
//
//        
//    })
    //---------------------------------------------------------------------------- END Filter Changes -------------------------------------------------------------------------------------------------
    $(window).resize(function () {
        var width = window.innerWidth;
        if(width > 1500) {
            $('.app-list').show();
        } else {
            $(document).on('click','.hide-menu',function(e){
                e.stopPropagation();
                var display = $(".app-list").css('display');
                if(display === "none") {
                    $('.app-list').fadeIn();
                } else{
                    $('.app-list').fadeOut();
                }
            });

            $("body").on("click",function() {
                $('.app-list').hide();
            });
        }
    });
 
});



