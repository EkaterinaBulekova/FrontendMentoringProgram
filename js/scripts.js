$(document).ready(function() {
    home.init();
    translator.setCurrLang();
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
        translator.fullTranslate();
    }
});

let flexPage = extention.inherit(page, new function FlexPage(){
    this.init = function(){
    }
});

let gridPage = extention.inherit(page, new function GridPage(){
    this.init = function(){
    }
});

let shapePage = extention.inherit(page, new function ShapePage(){
    this.init = function(){
    }
});

let langDictionary = new function Dictionary(){
    let dictionary = {
        home: {english: "Home", russian: "Главная"},
        settings: {english: "Settings", russian: "Настройки"},
        grid: {english: "GridPage", russian: "Гриды"},
        flex: {english: "FlexPage", russian: "Флексы"},
        shape: {english: "ShapePage", russian: "Шейпы"},
        userid: {english: "User Id", russian: "Пользователь"},
        status: {english: "Status", russian: "Статус"},
        date: {english: "Date", russian: "Дата"},
        orderdate: {english: "Order date", russian: "Дата доставки"},
        requireddate: {english: "Required date", russian: "Дата ож-ния"},
        address: {english: "Address", russian: "Адрес"},
        phone: {english: "Phone", russian: "Телефон"},
        product: {english: "Product", russian: "Продукт"},
        category: {english: "Category", russian: "Категория"},
        search: {english: "Search", russian: "Искать"},
        reset: {english: "Reset", russian: "Сбросить"},
        filters: {english: "Filters >", russian: "Фильтры >"},
        filtersback: {english: "> Filters", russian: "> Фильтры"},
        products: {english: "Products", russian: "Продукты"},
        categories: {english: "Categories", russian: "Категории"},
        users: {english: "Users", russian: "Пользователи"},
        id: {english: "Id", russian: "Номер"},
        name: {english: "Name", russian: "Наименование"},
        description: {english: "Description", russian: "Описание"},
        price: {english: "Price", russian: "Цена"},
        stock: {english: "Stock", russian: "Склад"},
        imageurl: {english: "Image URL", russian: "URL фото"},
        categoryid: {english: "Category Id", russian: "Категория"},
        email: {english: "Email", russian: "Почта"},
        groupid: {english: "Group Id", russian: "Группа"},
        password: {english: "Password", russian: "Пароль"},
        user1: {english: "User1", russian: "Пользователь1"},
        user2: {english: "User2", russian: "Пользователь2"},
        user3: {english: "User3", russian: "Пользователь3"},
        category1: {english: "Category1", russian: "Категория1"},
        category2: {english: "Category2", russian: "Категория2"},
        category3: {english: "Category3", russian: "Категория3"},
        name1: {english: "Product1", russian: "Товар1"},
        name2: {english: "Product2", russian: "Товар2"},
        name3: {english: "Product3", russian: "Товар3"},
        name4: {english: "Product4", russian: "Товар4"},
        name5: {english: "Product5", russian: "Товар5"},
        name6: {english: "Product6", russian: "Товар6"},
        name7: {english: "Product7", russian: "Товар7"},
        inwork: {english: "Inwork", russian: "В работе"},
        canceled: {english: "Canceled", russian: "Отменен"},
        delivered: {english: "Delivered", russian: "Доставлен"},
        all: {english: "All", russian: "Все"},
        first: {english: "First", russian: "Перв."},
        next: {english: "Next", russian: "След."},
        prev: {english: "Prev", russian: "Пред."},
        last: {english: "Last", russian: "Посл."}

    }
    this.get = function(key,lang){
        let transElement = "";
        let dictElement = dictionary[key];
        if(dictElement){
            transElement = dictElement[lang];
        }
        return transElement;
    }
}

let translator = new function Translator(){
    let languages = {
        english: ["en-US", "en-EN"],
        russian: ["ru-RU"]
    }
    this.currLang = "english";

    this.setCurrLang = function(){
        var userLang = navigator.language || navigator.userLanguage; 
        for(let propertyName in languages){
            if (arrayContains(userLang, languages[propertyName])){
                currLang = propertyName;
            }
        }
    }

    this.fullTranslate = function(){
        let listForTranslate = $(".translate")
        if (listForTranslate){            
            for (let i=0; i<listForTranslate.length; i++){
                let element =listForTranslate[i];
                let nm = element.getAttribute("name");
                let value = langDictionary.get(nm, currLang);
                if (value){
                    element.innerHTML = value;
                }
            }
        }
    }

    this.translate = function(eventSource){
        let lang = $(eventSource).attr("name");
            if (lang && languages[lang] && currLang != lang){
                currLang = lang;
                fullTranslate();
            }

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
            eventSource.setAttribute("name", "filters");
            eventSource.innerHTML = langDictionary.get("filters", translator.currLang);
            hasAdvanced = false;
        }else{
            eventSource.setAttribute("name", "filtersback");
            eventSource.innerHTML = langDictionary.get("filtersback", translator.currLang);
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
        translator.fullTranslate();
    };

    function loadThead(data, table) {
        if (data && table){
            let header = table.createTHead();
            let newRow = header.insertRow(0);
            let j = 0;
            for(let propertyName in data[0]) {
                let newCell = newRow.insertCell(j);
                let newText = document.createTextNode(propertyName);
                newCell.appendChild(newText);
                newCell.className = "translate";
                newCell.setAttribute("name", propertyName.toLowerCase());
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
                button.innerHTML = linkParam[1].slice(5, linkParam[1].length-1);
                button.className = "translate";
                button.setAttribute("name", button.innerHTML);
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
    let listNames = value.toLowerCase().split(" ");
    let result = "";
    listNames.forEach(element => result += element);
    return listNames;
}

Window.prototype.arrayContains = function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}