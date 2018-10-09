let advFiltersButton = document.getElementById("aFilterButton");
advFiltersButton.addEventListener('click', function(){
    let advFiltersPanel = document.getElementById("aFilterPanel");
    advFiltersPanel.style = "display:block"
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
 
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: fullurl,
        success: function (result) {
            callback(result);
        },
        error: function (data) {
            alert("Извините произошла непредвиденная ошибка обратитись пожалуйста к администратору сайта.");
        }
    });
}

function LoadTable(data){
    var tableHead = document.getElementById('OrderTableHead');
    var tableRef = document.getElementById('OrderTableBody');
    tableRef.innerHTML = "";    
    let newRow = tableHead.insertRow(0);
    let j =0;
    for(var propertyName in data[0]) {
        
        let newCell  = newRow.insertCell(j);
        let newText  = document.createTextNode(propertyName);
        newCell.appendChild(newText);
        j++;
    }
    for(let i = 0; i < data.length; i++){
        let item = data[i]
        let newRow   = tableRef.insertRow(i);          
        let j =0;
        for(var propertyName in item) {
            let newCell  = newRow.insertCell(j);
            let newText  = document.createTextNode(item[propertyName]);
            newCell.appendChild(newText);
            j++;
        }       
    }
}

$(document).ready(function() {
    url = "http://localhost:3000/orders?";
    var options = [{Name:"_page", Value:"2"},{Name :"_limit", Value:"5"}];
    AjaxLoad(url, options, LoadTable)
 //   AjaxLoad(url, [{Name:"_page", Value:"1"},{Name :"_limit", Value:"5"}], LoadTable)
 });
 

