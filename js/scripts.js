$(document).ready(function() {
    home.init();
});

function selectTab(eventSource){
    $(".tabs .active").removeClass("active");
    $(eventSource).addClass("active");
    let name = $(eventSource).attr("name");

    $(".tab-panel .active").removeClass("active");
    $("#" + name).addClass("active");
}

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

let home = extention.inherit(page, new function Home(){
    this.init = function(){
        filter.init();
        orderTable.load();
    }
});

let settings = extention.inherit(page, new function Settings(){
    let isLoaded = false;
    this.toggleSettingsPage = function(eventSource){
        this.togglePage(eventSource);
        this.init();
    }
    this.init = function(){
        if (isLoaded) return;
        productTable.load();
        categoryTable.load();
        userTable.load();
        isLoaded = true;
    }
});

let filter = new function Filter(){
    let hasAdvanced = false;
    let filterPanelId ='#filterPanel';
    let advFilterPanelId = '#advancedFilterPanel';
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
        let panel = $(filterPanelId);
        let butPanel =$(".filter .buttons-panel")
        advPanel.toggle();
        if (hasAdvanced){
            butPanel.css("width", "400");
            panel.css( "float", "" );
            eventSource.innerHTML = 'More Filters'
            hasAdvanced = false;
        }else{
            butPanel.css("width", "1200");
            panel.css( "float", "left" );
            hasAdvanced = true;
            eventSource.innerHTML = 'Less Filters'
        }
    }
}

let dataList = new function DataList(){
    this.load = function(id, response){
        let data = response.responseJSON;
        let dataList = document.getElementById(id);
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

let urlBuilder = function UrlBuilder(url, options){
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

function EntityTable(name, pageSetting){
    let serverUrl = 'http://localhost:3000/';
    let baseUrl = serverUrl + name;
    let pagination = pageSetting;
    let tableIds = name + 'Table';

    function load(){
       ajaxRequest.get(urlBuilder(baseUrl, pagination), loadTable);
    };

    function loadTable(response){
        let data = response.responseJSON;
        let links = response.getResponseHeader('link');
        let table = document.getElementById(tableIds);
        if(table && data){
            loadTbody(data, table);
            loadThead(data, table);
            if (links){
                loadPageButtons(links, table);
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
                let newText = document.createTextNode(propertyName);
                newCell.appendChild(newText);
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

    function loadPageButtons(linkstr, table){
        if(table && linkstr){
            let links = linkstr.split(', ')
            let newCell = table.createTFoot().insertRow(0).insertCell(0);
            newCell.setAttribute("colspan", "10");
            links.forEach(element => {
                let button = document.createElement('button');
                let linkParam = element.split('; ');                
                button.innerHTML = linkParam[1].slice(5, linkParam[1].length-1);
                button.onclick = function(){
                    ajaxRequest.get(linkParam[0].slice(1, linkParam[0].length-1), loadTable);
                }; 
                newCell.appendChild(button);
            });
        }
    };
    return Object.freeze({load})
}

let productTable = new EntityTable("products",[{Name:"_page", Value:"1"},{Name :"_limit", Value:"3"}]);
let categoryTable = new EntityTable("categories",[{Name:"_page", Value:"1"},{Name :"_limit", Value:"3"}]);
let userTable = new EntityTable("users",[{Name:"_page", Value:"1"},{Name :"_limit", Value:"2"}]);
let orderTable = new EntityTable("orders",[{Name:"_page", Value:"1"},{Name :"_limit", Value:"5"}]);