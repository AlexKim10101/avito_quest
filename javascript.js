
(function(){

'use strict'



let url1 = 'https://avito.dump.academy/';

fetch(url1)
    .then(response => response.json())
    .then(function(ans){
        let urlProducts = ans.links.products;       
        let urlSellers = ans.links.sellers;     
        return Promise.all([fetch(urlProducts),
            fetch(urlSellers)])         
        })
    .then(function(results){
        return Promise.all([results[0].json(),results[1].json()])
    })
    .then(function(results){
        let products = results[0].data;
        let sellers = results[1].data;
        console.log(products);
        init(products, sellers);
    })

let minPrice;
let maxPrice;




    
let inputMinPrice = document.getElementById('filterByMinPrice');
let inputMaxPrice = document.getElementById('filterByMaxPrice');

let inputFavotites = document.getElementById('filterByFavorite');

let inputSortByPrice = document.getElementById('sortByPrice');
let inputSortByRating = document.getElementById('sortByRating');


let cookies;
let favoriteIdArr =[];
let favoriteIdInStr;

let productsCardCollection;



function init(products, sellers){
    let galery;
    galery = document.getElementById('galery');

    let galeryItem = document.createElement('div');
    galeryItem.className = 'galery__item';
    galeryItem.classList.add('visible');

    let galeryItemProduct = document.createElement('div');
    galeryItemProduct.className = 'galery__item__product';

    let galeryItemProductWrapperImage = document.createElement('div');
    galeryItemProductWrapperImage.className = 'galery__item__product__wrapper__image';

    let galeryItemProductImage = document.createElement('img');
    galeryItemProductImage.className = 'galery__item__product__image';

    let galeryItemProductQuantityImage = document.createElement('div');
    galeryItemProductQuantityImage.className = 'galery__item__product__quantity_image';

    let galeryItemDesc = document.createElement('div');
    galeryItemDesc.className = 'galery__item__desc';

    let galeryItemDescTitle = document.createElement('div');
    galeryItemDescTitle.className = 'galery__item__desc__title';

    let galeryItemDescPrice = document.createElement('div');
    galeryItemDescPrice.className = 'galery__item__desc__price';

    let galeryItemDescSeller = document.createElement('div');
    galeryItemDescSeller.className = 'galery__item__desc__seller';

    let galeryItemDescSellerName = document.createElement('div');
    galeryItemDescSellerName.className = 'galery__item__desc__seller__name';

    let galeryItemDescSellerRating = document.createElement('div');
    galeryItemDescSellerRating.className = 'galery__item__desc__seller__rating';

    let galeryItemProductFavoritesAddIcon = document.createElement('div');
    galeryItemProductFavoritesAddIcon.className = 'galery__item__product__favorites_add_icon';

    galeryItemDescSeller.appendChild(galeryItemDescSellerName);
    galeryItemDescSeller.appendChild(galeryItemDescSellerRating);

    
    galeryItemProduct.appendChild(galeryItemProductWrapperImage);
    galeryItemProductWrapperImage.appendChild(galeryItemProductImage);

    galeryItemProductWrapperImage.appendChild(galeryItemProductQuantityImage);
    galeryItemProduct.appendChild(galeryItemProductFavoritesAddIcon);

    galeryItemDesc.appendChild(galeryItemDescTitle);
    galeryItemDesc.appendChild(galeryItemDescPrice);
    galeryItemDesc.appendChild(galeryItemDescSeller);

    galeryItem.appendChild(galeryItemProduct);
    galeryItem.appendChild(galeryItemDesc);


    
    minPrice = products[0].price;
    maxPrice = products[0].price;

    if(getCookie('favoriteIdInCookie')){
        favoriteIdInStr = getCookie('favoriteIdInCookie');
        favoriteIdArr = favoriteIdInStr.split(',');
        console.log(favoriteIdArr);
    }
    else{
        document.cookie = 'favoriteIdInCookie=';
    }


    for (var i =0; i<products.length; i++){
        let item = galeryItem.cloneNode(true);
        item.querySelector('.galery__item__product__image').setAttribute('src', 'http:'+products[i].pictures[0]);
        item.querySelector('.galery__item__product__quantity_image').textContent ='all ' +products[i].pictures.length + ' photo';
        item.querySelector('.galery__item__desc__title').textContent = products[i].title;
        item.querySelector('.galery__item__desc__price').textContent = (!products[i].price)? 'Цена не указана': products[i].price +' ₽';
        item.querySelector('.galery__item__desc__seller__name').textContent = 'Имя ' + sellerName(products[i].relationships.seller, sellers);
        item.querySelector('.galery__item__desc__seller__rating').textContent = 'Рейтинг ' + sellerRating(products[i].relationships.seller, sellers);

        item.setAttribute('data-category', products[i].category);
        item.setAttribute('data-price', products[i].price);
        item.setAttribute('data-seller-rating', -sellerRating(products[i].relationships.seller, sellers));
        item.setAttribute('data-order',i);
        item.setAttribute('data-id',products[i].id);

        if (favoriteIdArr.length>0){
            if(favoriteIdArr.indexOf(products[i].id,1) !== -1){
                item.classList.add('favorite');
            }
        }

        //item.setAttribute('data-favorite', 'false');
        if (+minPrice>+products[i].price){
            minPrice = products[i].price;
        }

        if (+maxPrice<+products[i].price){
            maxPrice = products[i].price;
        }

        galery.appendChild(item);


    }
   
    console.log(sellers[0]);
    console.log(products[0]);
    inputMinPrice.setAttribute('placeholder', minPrice);
    inputMinPrice.value = minPrice;
    
    inputMaxPrice.setAttribute('placeholder', maxPrice);
    inputMaxPrice.value = maxPrice;

    productsCardCollection = document.querySelectorAll('.galery__item');




  
    galery.addEventListener("click",function(event){
        var target = event.target;
        if(target.classList.contains('galery__item__product__favorites_add_icon')){ 
            target.parentNode.parentNode.classList.toggle('favorite');
            if (target.parentNode.parentNode.classList.contains('favorite')){
                favoriteIdInStr+=','+target.parentNode.parentNode.getAttribute('data-id');
                favoriteIdArr = favoriteIdInStr.split(',');
                console.log(favoriteIdArr);
                console.log(target.parentNode.parentNode.getAttribute('data-id'));
                console.log('favoriteIdInCookie='+favoriteIdInStr);
                document.cookie = 'favoriteIdInCookie=';
                document.cookie = 'favoriteIdInCookie='+favoriteIdInStr;
            }
            else{
                favoriteIdArr.splice(favoriteIdArr.indexOf(target.parentNode.parentNode.getAttribute('data-id')),1)
                favoriteIdInStr = favoriteIdArr.join(',');
                document.cookie = 'favoriteIdInCookie=';
                document.cookie = 'favoriteIdInCookie='+favoriteIdInStr;
            }
        }
    },true);

}

function sellerName(id, sellers){
    var result = 'no name';
    sellers.forEach(function(seller){
        if (seller.id == id){
            result = seller.name;
            return;
        }
    })
    return result
}

function sellerRating(id, sellers){
    var result = 'no rating';
    sellers.forEach(function(seller){
        if (seller.id == id){
            result = seller.rating;
            return;
        }
    })
    return result
}


/*Сортировка*/


inputSortByPrice.onchange = sortByPrice;
inputSortByRating.onchange = sortByRating;

function sortByAnything(attr){
    let cloneProductsCardCollection = [];
    let cloneProductsCardCollectionWithUndefAttr = [];
    for (let i = 0; i<productsCardCollection.length; i++){
        let el = galery.removeChild(productsCardCollection[i]);

        if (el.getAttribute(attr)=='undefined'){
            cloneProductsCardCollectionWithUndefAttr.push(el);
        }
        else{
            cloneProductsCardCollection.push(el);
        }       
    }




    cloneProductsCardCollection.sort(function(a,b){

        if (+(a.getAttribute(attr))<+(b.getAttribute(attr))){
            return -1;            
        }
        else {return 1}
    });

    cloneProductsCardCollection = cloneProductsCardCollection.concat(cloneProductsCardCollectionWithUndefAttr);
    cloneProductsCardCollection.forEach(function(elem){
        galery.appendChild(elem);
    })

}

function sortByRating(){
    galery.classList.toggle('onSortByRating');

    if(galery.classList.contains('onSortByRating')){
        sortByAnything('data-seller-rating');
    }
    else{
        if (galery.classList.contains('onSortByPrice')){
            sortByAnything('data-price')
        }
        else{
            sortByAnything('data-order')
        } 

    }

}

function sortByPrice(){
    galery.classList.toggle('onSortByPrice');

    if(galery.classList.contains('onSortByPrice')){
        sortByAnything('data-price');
    }
    else{
        if (galery.classList.contains('onSortByRating')){
            sortByAnything('data-seller-rating')
        }
        else{
            sortByAnything('data-order')
        } 

    }

}





/*Filters*/
let firstSelect = document.getElementById('filterByCategory');

firstSelect.onchange = reloadGalery;
inputMinPrice.onchange = reloadGalery;
inputMaxPrice.onchange = reloadGalery;
inputFavotites.onchange = reloadGalery;

function checkCategory(item){
    if (item.getAttribute('data-category') == firstSelect.value){return true}
    else{return false};
}

function checkPrice(item){
    minPrice = inputMinPrice.value;
    maxPrice = inputMaxPrice.value;
    if ((+(item.getAttribute('data-price')) <= maxPrice) && (+(item.getAttribute('data-price')) >= minPrice)){
        return true;
    }
    else {return false};
}

function checkFavorite(item){
    if (item.classList.contains('favorite')){
        return true;
    }
    else{ return false};
}

function reloadGalery(){    

    productsCardCollection.forEach(function(item){
        item.classList.remove('visible');
    })
    productsCardCollection.forEach(function(item){
        if(((checkCategory(item))||(firstSelect.value == 'all'))&&(checkPrice(item))&&(inputFavotites.value == 'показать все')||(checkFavorite(item))){
            item.classList.add('visible');
        }
        
    })
   
}



function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


}())