let advFiltersButton = document.getElementById("aFilterButton");
advFiltersButton.addEventListener('click', function(){
    let advFiltersPanel = document.getElementById("aFilterPanel");
    advFiltersPanel.style =  (advFiltersPanel.style["display"] == "block")
        ? "display: none" 
        : "display: block";
}); 

function AjaxLoad(LoadUrl, options, callback) {
    var fullurl = LoadUrl
    console.log(options)
 
    if(options != null) {
        for(let i=0; i<options.length; i++){
            fullurl = (i>0) ? fullurl+'&': fullurl
            fullurl += options[i].Name + "=" + options[i].Value;
        }
    }
    console.log(fullurl)
 
    var requestresult = $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: fullurl,
        success: function (result) { 
            callback(result, requestresult.getResponseHeader('x-total-count'), requestresult.getResponseHeader('link'));
        },
        error: function () {
            alert("Извините произошла непредвиденная ошибка обратитись пожалуйста к администратору сайта.");
        }
    });
}

function LoadTable(data, count, linkstr){
   var tableHead = document.getElementById('OrderTableHead');
   tableHead.innerHTML = "";    
    let newRow = tableHead.insertRow(0);
    let j =0;
    for(let propertyName in data[0]) {
        
        let newCell  = newRow.insertCell(j);
        let newText  = document.createTextNode(propertyName);
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

$(document).ready(function() {
    url = "http://localhost:3000/orders?";
    var options = [{Name:"_page", Value:"1"},{Name :"_limit", Value:"5"}];
    AjaxLoad(url, options, LoadTable)
});
 

