$(document).ready(function() {
    OrderList.load();
});

let Filter = {
    init: function(){
    
    },
    
    toggleAdvansedPanel: function(){
        $('#advancedFilterPanel').toggle();
    }
}

let OrderList = {
    load: function(){
        url = "http://localhost:3000/orders?";
        var options = [{Name:"_page", Value:"1"},{Name :"_limit", Value:"5"}];
        
        AjaxLoad(url, options, LoadTable)
    }
}


let Ajax = {
    get: function(url){
        var requestresult = $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: fullurl,
            success: function (result) { 
                callback(result, requestresult.getResponseHeader('link'));
            },
            error: function () {
                alert("Извините произошла непредвиденная ошибка обратитись пожалуйста к администратору сайта.");
            }
        });
    },
    post: function(url, data){

    },
    update: function(url, data){

    },
    delete: function(url, data){

    }
}

let UrlBuilder = {
    fullUrl: function(url, options){
        let fullurl = url
        if(options != null) {
            for(let i=0; i<options.length; i++){
                fullurl = (i > 0) ? fullurl + '&' : fullurl
                fullurl += options[i].Name + "=" + options[i].Value;
            }
        }
    }

}

function AjaxLoad(LoadUrl, options, callback) {
    var fullurl = LoadUrl
    if(options != null) {
        for(let i=0; i<options.length; i++){
            fullurl = (i>0) ? fullurl+'&': fullurl
            fullurl += options[i].Name + "=" + options[i].Value;
        }
    }
 
    var requestresult = $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: fullurl,
        success: function (result) { 
            callback(result, requestresult.getResponseHeader('link'));
        },
        error: function () {
            alert("Извините произошла непредвиденная ошибка обратитись пожалуйста к администратору сайта.");
        }
    });
}

function LoadTable(data, linkstr){
   var tableHead = document.getElementById('OrderTableHead');
   tableHead.innerHTML = "";
    let newRow = tableHead.insertRow(0);
    let j =0;
    for(let propertyName in data[0]) {
        
        let newCell = newRow.insertCell(j);
        let newText = document.createTextNode(propertyName);
        newCell.appendChild(newText);
        j++;
    }

    var tableRef = document.getElementById('OrderTableBody');
    tableRef.innerHTML = "";
     for(let i = 0; i < data.length; i++){
        let item = data[i]
        let newRow   = tableRef.insertRow(i);
        let j =0;
        for(let propertyName in item) {
            let newCell  = newRow.insertCell(j);
            let newText  = document.createTextNode(item[propertyName]);
            newCell.appendChild(newText);
            j++;
        }
    }
 
    var pageButtons = document.getElementById('pageButtons');
    pageButtons.innerHTML = "";
    var links = linkstr.split(', ')   
    for(let i = 0; i < links.length; i++){
        let button = document.createElement('button');
        let linkParam = links[i].split('; ');
        let buttonName = linkParam[1].slice(5, linkParam[1].length-1);
        let buttonUrl = linkParam[0].slice(1, linkParam[0].length-1);
        button.innerHTML = buttonName;
        button.onclick = function(){
            AjaxLoad(buttonUrl, null, LoadTable);
        }; 
        pageButtons.appendChild(button);
    }
}


 

