$(document).ready(function() {
    home.init();
    translator.init();
});

let extention = new function Extention(){
    this.inherit = function(parent, child){
        child.__proto__.__proto__ = parent;
        return child;
    };
}

let page = new function Page(){
    this.togglePage = function(eventSource){
        let name = $(eventSource).attr("name");
        $("section.active").removeClass("active");
        $("#" + name).addClass("active");
    }
}

//page.constructor.prototype

let home = extention.inherit(page, new function Home(){
    this.init = function(){
        filter.init();
        orderTable.load();
    }
});

let formPage = extention.inherit(page, new function FormPage(){
    this.toggleFormPage = function(eventSource){
        this.togglePage(eventSource);
        this.init();
    }
    this.init = function(){
        order.load();
    }
}); 

let settings = extention.inherit(page, new function Settings(){
    let isLoaded = false;
    this.toggleSettingsPage = function(eventSource){
        this.togglePage(eventSource);
        this.init();
    }
    this.selectTab = function(eventSource){
    $(".tabs .active").removeClass("active");
    $(eventSource).addClass("active");
    let name = $(eventSource).attr("name");

    $(".tab-panel .active").removeClass("active");
    $("#" + name).addClass("active");
    }
    this.init = function(){
        if (isLoaded) return;
        productTable.load();
        categoryTable.load();
        userTable.load();
        isLoaded = true;
    }
});

let documents = extention.inherit(page, new function DocPage(){
    this.init = function(){
    }
});

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
        videoblock: {en:"Video block", ru: "Видео блок"}
    }

    let currLang = "en";

    this.init = function(){
        let sysLang = navigator.language || navigator.userLanguage;
        this.currLang = sysLang.substring(0, 2);
        this.translateFull(this.currLang);
    }

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

    this.translateElement = function(element, name){
        element.className = (element.classList.contains("translate"))
            ? element.className
            : element.className + " translate";
        element.setAttribute("name", name);
        element.innerHTML = dictionary[name][currLang];
    }
}

let filter = new function Filter(){
    let hasAdvanced = false;
    let advFilterPanelId = '.advanced-filter';
    let serverUrl = 'http://localhost:3000/';
    let listsIds = ['products', 'statuses', 'categories', 'users'];

    this.init = function(){
        listsIds.forEach(element => {
                ajaxRequest.get(serverUrl+element,function(response){
                dataList.load(element, response);
            });
        });
    };

    function validate(){
    };

    this.toggleAdvansedPanel = function(eventSource){
        let advPanel = $(advFilterPanelId);
        advPanel.toggle();
        if (hasAdvanced){
            translator.translateElement(eventSource, "filters");
            hasAdvanced = false;
        }else{
            translator.translateElement(eventSource, "filtersback");
            hasAdvanced = true;
        }
    }
}

let dataList = new function DataList(){
    this.load = function(id, response){
        let data = response.responseJSON;
        let dataList = document.getElementById(id+"Filter");
        dataList.innerHTML = '';
        dataList.appendChild(getOption(0 ,'All'));
        for(let i = 0; i < data.length; i++){
            let item = data[i];
            dataList.appendChild(getOption(item['id'] ,item['name']));
        }
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
    this.get = function(url, callback){
            let fullResult = $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: url,
            success: function(){
                callback(fullResult);
            },
            error: function(textStatus){
                alert("Error" + textStatus);
            }
        });
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
    
    this.load =  function(){
        let tableId = this.name + 'Table';
        let url = 'http://localhost:3000/' + this.name;
        let paginate = this.pagination
        ajaxRequest.get(urlBuilder.getUrl(url, paginate), (response)=>{loadTable(response, tableId)});
    };

    function loadTable(response, id){
        let data = response.responseJSON;
        let links = response.getResponseHeader('link');
        let table = document.getElementById(id);
        if(table && data){
            loadTbody(data, table);
            loadThead(data, table);
            if (links){
                loadPageButtons(links, table, id);
            }
        }
    };

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
                    ajaxRequest.get(linkParam[0].slice(1, linkParam[0].length-1), (response)=>{loadTable(response, id)});
                }; 
                newCell.appendChild(button);
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
    this.orderById = [{Name:"id", Value:"1"},{Name :"_limit", Value:"5"}];
    this.loadById =  function(){
        let tableId = this.name + 'Table';
        let url = 'http://localhost:3000/' + this.name;
        let paginate = this.orderById
        ajaxRequest.get(urlBuilder.getUrl(url, paginate), (response)=>{loadForm(response, formId)});
    };
});

Window.prototype.genDictionaryName=function(value){    
    return value.toLowerCase().split(' ').join('');
}

Window.prototype.arrayContains = function arrayContains(needle, arrhaystack)
{
    return (arraystack.indexOf(needle) > -1);
}