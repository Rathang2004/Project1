/**var url = 'https://jsonplaceholder.typicode.com/albums/2/photos/';

    document.getElementById("display").innerHTML = 'Number of Photos: <br><br> 50';
    function fadeOut(ev)
{

    let timer = setInterval(function ()
    {
        document.getElementById("display").innerHTML = "Number of Photos:";
        document.getElementById("display1").innerHTML = (50 - timer);
        clearInterval(timer);
    }, 200)
    ev.currentTarget.remove();

}
function buildCard(data)
{
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute("class","product-card");

    var imgTag = document.createElement("img");
    imgTag.setAttribute("class", "product-img");
    imgTag.setAttribute("src", data.url);

    var titleTag = document.createElement("p");
    titleTag.setAttribute("class", "product-title");
    titleTag.appendChild(document.createTextNode(data.title));

    var productDiv = document.createElement("div");
    productDiv.setAttribute("class", "product-info");

    productDiv.appendChild(titleTag);
    cardDiv.appendChild(imgTag)
    cardDiv.appendChild(productDiv);
    cardDiv.addEventListener("click", fadeOut);
    return cardDiv;

}
async function fetchWithDOMAPI()
{
    try {
        var response = await fetch(url);
        var data = await response.json();
        var elements = data.map(buildCard);
        document.getElementById("product-list").append(...elements);
    }   catch (error){
        console.log(error);
    }
}
fetchWithDOMAPI();
 **/







