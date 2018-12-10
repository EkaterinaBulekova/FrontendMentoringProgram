var siteManager = (function($,root){

    let extention = new function Extention(){
        this.inherit = function(parent, child){
            child.__proto__.__proto__ = parent;
            return child;
        };
    }

    let page = new function Page(){
        this.isLoaded = false;
        this.togglePage = function(pageId){
            $('section').each(function(){
                var that = $(this);
                that[ that.attr( 'id' ) === pageId ? 'addClass' : 'removeClass' ]( 'active' );
            });
        }
    }

    let pages = {
        orderListPage : extention.inherit(page, new function Home(){
            this.init = function(){
                if (orderListPage.isLoaded) return $.when()
                dialogue.create(loadDialogue);
                dialogue.open();
                return filterBlock.init()
                .then(result => {orderTable.load()})
                .then(result => {
                    orderListPage.isLoaded = true;
                    dialogue.close();
                    return $.when();
                })
                .fail(function(){
                    console.log('Error loading Home page')
                })
            }
        }),
    
        formPage : extention.inherit(page, new function FormPage(){
            this.toggleFormPage = function(eventSource){
                this.togglePage(eventSource);
                this.init();
            }
            this.init = function(){
                order.load();
            }
        }), 
    
        settingsPage : extention.inherit(page, new function Settings(){

            this.selectTab = function(eventSource){
                $(".tabs .active").removeClass("active");
                $(eventSource).addClass("active");
                let name = $(eventSource).attr("name");
    
                $(".tab-panel .active").removeClass("active");
                $("#" + name).addClass("active");
            }
            
            this.init = function(){
                if (settingsPage.isLoaded) return $.when(); 
                if($("#settingsPage").length){
                    $(".tabs li").click(function() {
                        pages.settingsPage.selectTab(this);
                    });
                }
                dialogue.create(loadDialogue);
                dialogue.open();
                return productTable.load()
                .then(result => {categoryTable.load()})
                .then(result => {userTable.load()})
                .then(result => {
                    settingsPage.isLoaded = true;
                    // $('.tab-panel').toggle();
                    // $('.tabs').toggle();
                    dialogue.close();
                    return $.when();
                })
                .fail(error => {
                    console.log('Error loading Settings page');
                })
            }
        }),
    
        documentsPage : extention.inherit(page, new function DocPage(){

            function videoSwap(eventSource) {
                $(eventSource).addClass("active");
                videoBlock.start($(eventSource).attr("data-video"));
            }

            function videoButtonsInit() {
                let buttons = $(".video-source");
                if (buttons.length){
                    buttons.click(function() {
                        buttons.removeClass("active")
                        videoSwap(this);
                    });
                }
            }

            this.init = function(){
                videoBlock.init();
                if (documentsPage.isLoaded) return $.when();
                videoButtonsInit();
                documentsPage.isLoaded = true;
                window.onscroll = function(){videoBlock.swap();};
                return $.when();
            }
        })
    }

    let navigation = new function Navigation(){
        function pageButtonsInit(){
            if($(".nav-button").length){
                let buttons = $(".nav-button .button-3d");
                buttons.click(function() {
                    let name = $(this).attr("name");
                    dialogue.create(confirmNavigationDialogue(name, function(){
                        window.location.hash = name;
                    }));
                    dialogue.open();
                });
            }
        }

        function locationOnChangeInit(){
            window.onhashchange = function(){
                var hash = location.hash;
                pageId = hash.replace( /^#/, '' ) || 'orderListPage';
                pageInit(pages[pageId])
                .then(result => {
                    page.togglePage(pageId);
                    videoBlock.pause();
                })
                .fail(error => {
                    dialogue.create(errorDialogue("Sorry, can't loading " + pageId + " page"));
                    dialogue.open();
                });
           };
        }

        function pageInit(page){
            return page.init();
        }

        this.init = function(){
            locationOnChangeInit();
            pageButtonsInit();
            window.onhashchange();
        }
    }

    let translator = new function Translator(){
        let dictionary = {
            home: {en: "Home", ru: "Главная"},
            settings: {en: "Settings", ru: "Настройки"},
            documents: {en: "Documents", ru: "Документы"},
            userid: {en: "User Id", ru: "Пользователь"},
            status: {en: "Status", ru: "Статус"},
            date: {en: "Date", ru: "Дата"},
            orderdate: {en: "Order date", ru: "Дата доставки"},
            requireddate: {en: "Required date", ru: "Дата ож-ния"},
            address: {en: "Address", ru: "Адрес"},
            phone: {en: "Phone", ru: "Телефон"},
            product: {en: "Product", ru: "Продукт"},
            category: {en: "Category", ru: "Категория"},
            search: {en: "Search", ru: "Искать"},
            reset: {en: "Reset", ru: "Сбросить"},
            filters: {en: "Filters >", ru: "Фильтры >"},
            filtersback: {en: "> Filters", ru: "> Фильтры"},
            products: {en: "Products", ru: "Продукты"},
            categories: {en: "Categories", ru: "Категории"},
            users: {en: "Users", ru: "Пользователи"},
            id: {en: "Id", ru: "Номер"},
            name: {en: "Name", ru: "Наименование"},
            description: {en: "Description", ru: "Описание"},
            price: {en: "Price", ru: "Цена"},
            stock: {en: "Stock", ru: "Склад"},
            imageurl: {en: "Image URL", ru: "URL фото"},
            categoryid: {en: "Category Id", ru: "Категория"},
            email: {en: "Email", ru: "Почта"},
            groupid: {en: "Group Id", ru: "Группа"},
            password: {en: "Password", ru: "Пароль"},
            user1: {en: "User1", ru: "Пользователь1"},
            user2: {en: "User2", ru: "Пользователь2"},
            user3: {en: "User3", ru: "Пользователь3"},
            category1: {en: "Category1", ru: "Категория1"},
            category2: {en: "Category2", ru: "Категория2"},
            category3: {en: "Category3", ru: "Категория3"},
            name1: {en: "Product1", ru: "Товар1"},
            name2: {en: "Product2", ru: "Товар2"},
            name3: {en: "Product3", ru: "Товар3"},
            name4: {en: "Product4", ru: "Товар4"},
            name5: {en: "Product5", ru: "Товар5"},
            name6: {en: "Product6", ru: "Товар6"},
            name7: {en: "Product7", ru: "Товар7"},
            inwork: {en: "Inwork", ru: "В работе"},
            canceled: {en: "Canceled", ru: "Отменен"},
            delivered: {en: "Delivered", ru: "Доставлен"},
            all: {en: "All", ru: "Все"},
            first: {en: "First", ru: "Перв."},
            next: {en: "Next", ru: "След."},
            prev: {en: "Prev", ru: "Пред."},
            last: {en: "Last", ru: "Посл."},
            productName: {en:"Product Name", ru: "Наименование товара"},
            videoblock: {en:"Video block", ru: "Видео блок"},
            ok: {en: "Ok", ru: "Ок"},
            yes: {en: "Yes", ru: "Да"},
            no: {en: "No", ru: "Нет"},
            confirmation: {en: "Confirmation", ru: "Подтверждение"},
            load: {en: "Loading", ru: "Загрузка"},
            wouldYouLikeToGoTo: {en: "Would you like to go to ", ru: "Хотите перейти на "},
            loading: {en: "Loading...", ru: "Идет загрузка..."}
        }

        let currLang = "en";

        this.translateFull = function(lang){
            let dict = dictionary;
            if(lang){
                currLang = (lang) ? lang : currLang;
                $(".lang-button img").each(function() {
                    if($(this).attr("name") === lang){
                        $(this).css("display", "none")
                    }else{
                        $(this).css("display", "inline-block")
                    }
                });
            }
            $(".translate").each(function() {
                let name = $(this).attr("name");
                name && $(this).text(dict[name][currLang]);
            });
        }

        this.init = function(){
            let sysLang = navigator.language || navigator.userLanguage;
            this.currLang = sysLang.substring(0, 2);
            translator.translateFull(this.currLang);
            if($(".lang-button").length){
                $(".lang-button img").click(function() {
                    translator.translateFull($(this).attr("name"));
                });
            }
        }

        this.translateText = function(name){
            let result = (dictionary[name])?dictionary[name][currLang]:name;
            return result;
        }

        this.translateElement = function(element, name){
            element.className = (element.classList.contains("translate"))
                ? element.className
                : element.className + " translate";
            element.setAttribute("name", name);
            element.innerHTML = dictionary[name][currLang];
        }
    }

    var videoBlock = new function VideoBlock(){
        var $bigBlock;
        var $smallBlock;
        var video;
        var $activeBlock;
    
        function isOffset(){
            var bodyBlock = document.body.getBoundingClientRect();
            return bodyBlock.top < -200;
        };
    
        this.init = function(){
            $bigBlock = $('#videoBigBlock');
            $smallBlock = $('#videoSmallBolock');
            video = document.getElementsByTagName('video')['currentVideo'];
            $activeBlock = null;
        };
    
        this.start = function(videoLink){
            if (!$activeBlock){
                $activeBlock = (isOffset()) ? $smallBlock : $bigBlock;
                $activeBlock.addClass('show');
            }
            $activeBlock.append(video);
            video.setAttribute('src', videoLink);
            video.load();
            video.play();
        };
    
        this.pause = function(){
            if($activeBlock){
                video.pause();
            }
        }
    
        this.swap = function(){
            if($activeBlock){
                if(isOffset() && $activeBlock.id === $bigBlock.id){
                    $bigBlock.removeClass('show');
                    $smallBlock.append(video);
                    $smallBlock.addClass('show');
                    $activeBlock = $smallBlock;
                }
    
                if(!isOffset() && $activeBlock.id === $smallBlock.id){
                    $smallBlock.removeClass('show');
                    $bigBlock.append(video);
                    $bigBlock.addClass('show');
                    $activeBlock = $bigBlock;
                }
            }
    
        }
    }
    

    let filterBlock = new function FilterBlock(){
        let serverURL = 'http://localhost:3000/';
        var isAdvancedShow = false;
        var $advFilterPanel;
        var $advFilterButton;

        function initFilterStaticElement(){
            var defer = new $.Deferred();
            if ($('.filter').length){
                $advFilterPanel = $('.advanced-filter');
                $advFilterButton = $('.addvanced-filter-button');
                $advFilterButton.click(function() {
                    filterBlock.toggleAdvansedPanel(this);
                });
                // $('.filter').toggle();
                // $('.buttons-panel').toggle();
                defer.resolve();
            }else{
                defer.reject(new Error ("Element Filter doesn't exists!"));
            }
            return defer;
        }
        function loadList(id){
            return ajaxRequest.get(serverURL+ id)
            .then(result => {dataListObject.load(id, result)});
        }

        this.init = function(){
            return loadList('products')
                .then(result=>{loadList('users')})
                .then(result=>{loadList('statuses')})
                .then(result=>{loadList('categories')})
                .then(result => {
                    initFilterStaticElement();
                    return $.when();
                })
                .fail(error => {console.log(error)});
        }

        this.toggleAdvansedPanel = function(button){
            $advFilterPanel.toggle();
            if (isAdvancedShow){
                translator.translateElement(button, "filters");
                isAdvancedShow = false;
            }else{
                translator.translateElement(button, "filtersback");
                isAdvancedShow = true;
            }
        }
    }

    let dataListObject = new function DataListObj(){
        this.load = function(id, data){
            let dataList = document.getElementById(id+"Filter");
            dataList.innerHTML = '';
            dataList.appendChild(getOption(0 ,'All'));
            data.map((value) => {
                dataList.appendChild(getOption(value['id'] ,value['name']));
            })
        };
        function getOption(id, name){
            let newOption = document.createElement('option');
            newOption.text = name;
            newOption.value = id;
            newOption.className = "translate";
            newOption.setAttribute("name", name.toLowerCase())
            return newOption;
        };
    }

    let ajaxRequest = new function Ajax(){
        this.get = function(url){
                return $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: url
            })
        };
        // post: function(url, data){

        // },
        // update: function(url, data){

        // },
        // delete: function(url, data){

        // }
    // return Object.freeze({get})
    }

    let urlBuilder = new function Builder(){ 
        this.getUrl = function(url, options){
            let fullurl = url
            if(options != null) {
                fullurl += "?"
                for(let i=0; i<options.length; i++){
                    fullurl = (i > 0) ? fullurl + '&' : fullurl
                    fullurl += options[i].Name + "=" + options[i].Value;
                }
            }
            return fullurl;
        }
    }

    let commonDictionary = new function CommonDictionary(){

        this.loadById = function(id){
            let formId = this.name + 'Form';
            let orderById = [{Name:"id", Value:id}];
            let url = 'http://localhost:3000/' + this.name;
            return ajaxRequest.get(urlBuilder.getUrl(url, orderById))
                .then(function(data, textStatus, jqXHR){
                    return $.when(formBuilder.load(jqXHR, formId));
                })
                .fail(console.log("Can't load data from " + urlBuilder.getUrl(url, orderById)))
        };

        this.load = function(){
            let tableId = this.name + 'Table';
            let url = 'http://localhost:3000/' + this.name;
            let paginate = this.pagination;
            return ajaxRequest.get(urlBuilder.getUrl(url, paginate))
            .then(function(data, textStatus, jqXHR) {
                return $.when(
                    tableBuilder.clickFunc = function(id){orderTable.loadById(id)},
                    tableBuilder.load(jqXHR, tableId));
            })
            .fail(console.log("Can't load data from " + urlBuilder.getUrl(url, paginate)));
        };
    }

    let formBuilder = new function FormBilder(){

        this.load = function(response, id){
            $("#"+id).text(response.responseJSON[0]["id"]);
        }
    }

    let dialogueButtons = {
        ok: {
            name: "ok",
            type: "inactive"
        },

        yes: {
            name: "Yes",
            type: "active"
        },

        no: {
            name: "no",
            type: "inactive"
        }
    }

    let dialogueTypes = {
        wait: {
            buttons: [],
            class: "wait-dialogue",
            img: "images/giphy.gif"
        },
        info: {
            buttons: [dialogueButtons.ok],
            class: "info-dialogue",
            img: ""
        },
        error: {
            buttons: [dialogueButtons.ok],
            class: "error-dialogue",
            img: ""
        },
        confirmYN: {
            buttons: [dialogueButtons.yes, dialogueButtons.no],
            class: "yes-no-dialogue",
            img: ""
        }
    };

    let loadDialogue = {
        type: dialogueTypes.wait,
        title: translator.translateText('load'),
        text: translator.translateText('loading')
    }

    let confirmNavigationDialogue = function(name, action){
        type = dialogueTypes.confirmYN;
        title = translator.translateText('confirmation');
        text = translator.translateText('wouldYouLikeToGoTo') + name + '?';
        return {type, title, text, action};
    }

    let errorDialogue = function(error){
        type = dialogueTypes.error;
        title = translator.translateText('error');
        text = translator.translateText('error') + ': '+ error + '.';
        return {type, title, text}
    }
    
    let dialogue = new function Dialogue(){
        let dlg;

        this.create = function(dlgType){
            dlg = dlgType;
        }

        this.open = function(){
            let overlay = $('<div>', {class: "overlay-box"});
            let dlgBox = $('<div>', {class: "dialogue"});
            contentCreate(dlgBox)
            buttonsCreate(dlgBox);
            $('body').append(overlay, dlgBox);
            dlgBox.addClass(dlg.type.class);
        }

        function contentCreate(dlgBox){
            dlgBox.append($('<div>', {class: "dialogue-title", html: dlg.title}));
            dlgBox.append($('<img>', {class: "dialogue-img", src: dlg.type.img}));
            dlgBox.append($('<div>', {class: "dialogue-text", html: dlg.text}));
        }

        function buttonsCreate(dlgBox){
            let btns =$('<div>', {class: "dialogue-buttons"});
            dlg.type.buttons.forEach(function(value){
                let btn = $('<button>', {
                    class: value.name, 
                    html: translator.translateText(value.name)
                });
                btn.on("click", function(){
                        dialogue.close();
                        if (value.type === 'active'){
                            dlg.action();
                        }
                    })
                btns.append(btn);
            })
            dlgBox.append(btns);
        }

        this.close = function(){
            $('.overlay-box').remove();
            $('.dialogue').remove();
        }
    }

    let tableBuilder = new function TableBilder(){

        this.clickFunc;

        function loadThead(data, table) {
            if (data && table){
                let header = table.createTHead();
                let newRow = header.insertRow(0);
                let j = 0;
                for(let propertyName in data[0]) {
                    let newCell = newRow.insertCell(j);
                    translator.translateElement(newCell, propertyName.toLowerCase());
                    j++;
                }
            }
        };

        function loadTbody(data, table){
            if (data && table){
                table.innerHTML = "";
                for(let i = 0; i < data.length; i++){
                    let item = data[i];
                    let newRow = table.insertRow(i);
                    newRow.setAttribute("id",data[i]["id"]);
                    let j = 0;
                    for(let propertyName in item) {
                        let newCell = newRow.insertCell(j);
                        let newText = document.createTextNode(item[propertyName]);
                        newCell.appendChild(newText);
                        j++;
                    }
                }
            }
        };

        function loadPageButtons(linkstr, table, id){
            if(table && linkstr){
                let links = linkstr.split(', ')
                let newCell = table.createTFoot().insertRow(0).insertCell(0);
                newCell.setAttribute("colspan", "10");
                links.forEach(element => {
                    let button = document.createElement('button');
                    let linkParam = element.split('; ');
                    let name = linkParam[1].slice(5, linkParam[1].length-1);
                    translator.translateElement(button, name);
                    button.onclick = function(){
                        $.when(ajaxRequest.get(linkParam[0].slice(1, linkParam[0].length-1)))
                        .done(function(data, textStatus, jqXHR){
                            tableBuilder.load(jqXHR, id);
                        })
                        .fail(function(){
                            console.log('error', jqXHR);
                        });
                     }; 
                    newCell.appendChild(button);
                });
            }
        };

        this.load = function(response, id){
            let data = response.responseJSON;
            let links = response.getResponseHeader('link');
            let table = document.getElementById(id);
            if(table && data){
                $.when(loadTbody(data, table, id))
                .then(loadThead(data, table))
                .then(function(){
                    if (links){
                        loadPageButtons(links, table, id);
                    }
                })
                .then(function(){
                    $("#"+id +" tr").click(function(){
                        if(id==="ordersTable") tableBuilder.clickFunc($(this).attr("id"));
                    })
                });
            }
        };
    }

    let productTable = extention.inherit(commonDictionary, new function ProductTable(){
        this.name = "products";
        this.pagination = [{Name:"_page", Value:"1"},{Name :"_limit", Value:"3"}];
    });

    let categoryTable = extention.inherit(commonDictionary, new function CategoryTable(){
        this.name = "categories";
        this.pagination = [{Name:"_page", Value:"1"},{Name :"_limit", Value:"3"}];
    });

    let userTable = extention.inherit(commonDictionary, new function UserTable(){
        this.name = "users";
        this.pagination = [{Name:"_page", Value:"1"},{Name :"_limit", Value:"3"}];
    });

    let orderTable = extention.inherit(commonDictionary, new function OrderTable(){
        this.name = "orders";
        this.pagination = [{Name:"_page", Value:"1"},{Name :"_limit", Value:"5"}];
    });

    function initSite(){
            dialogue.create({
                type: dialogueTypes.wait,
                title: translator.translateText('load'),
                text: translator.translateText('loading')});
            dialogue.open();
            $.when(translator.init(), navigation.init())
            .then(dialogue.close())
            .fail(function(error){console.log('Error application start'+error)})
    }

    let PublicAPI={
        init: function(){
            initSite();
        }
    }
    
    return PublicAPI;
})(jQuery, this);


$(document).ready(function() {
    siteManager.init();
});
