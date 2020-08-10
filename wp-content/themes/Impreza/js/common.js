const calcData = {
    typeSpec: [
        {name: 'Эвакуатор', price: '0'},
        {name: 'Манипулятор', price: '1'}
    ],
    typeCars: [
        {name: 'Малолитражные', price: [1600, 4500]},
        {name: 'Легковые иномарки', price: [1800, 4700]},
        {name: 'Легковые грузовики', price: [2200, 5500]},
        {name: 'Легковые отечественные', price: [1700, 4500]},
        {name: 'Внедорожники', price: [1900, 5000]},
        {name: 'Спецтехника', price: [2400, 6000]}
    ],
    wheelsLocked: [
        0, 1, 2, 3, 4
    ],
    blockings: [
        {name: 'Руль заблокирован', price: '350'}
        // {name: 'КПП заблокировано', price: '650'}
    ],
    distance: [
        {name: 'По Москве', price: '0'},
        {name: 'За МКАД 5км', price: '175'},
        {name: 'За МКАД 10км', price: '350'},
        {name: 'За МКАД 15км', price: '525'},
        {name: 'За МКАД 20км', price: '700'},
        {name: 'За МКАД 25км', price: '675'},
        {name: 'За МКАД 30км', price: '1050'},
        {name: 'За МКАД 35км', price: '1225'},
        {name: 'За МКАД 40км', price: '1400'},
        {name: 'За МКАД 45км', price: '1575'},
        {name: 'За МКАД 50км', price: '1750'},
        {name: 'За МКАД 55км', price: '1925'}
    ],
    time: [
        {name: 'Срочный заказ (выезд в течение 30 минут)', price: '0'},
        {name: 'Счастливые часы (выезд к 9:00 и 21:00 - скидка 9%)', price: '1'}
    ],
    selected: {
    	typeCars: 0,
        time: 1,
        wheels: 0,
        distance: 0,
        blockings: [],
        specCars: 0,
    },
    sum: 0
};

const calc = new Vue({
    el: '#calc',
    data: calcData,
    computed: {
        result: function() {
            let type_cars = this.typeCars[this.selected.typeCars]['price'][this.selected.specCars],
                wheels = this.wheelsLocked[this.selected.wheels] * 350,
                blockings =  Number(this.selected.blockings),
                distance = Number(this.selected.distance);

            let sum = type_cars + wheels + distance + blockings;
            if (this.selected.time == 1) sum = sum - (sum * 0.09);
            sum = Math.round(sum / 100) * 100;
            return sum;
        }
    }
});

// $(".attachment-large").attr({
//     alt: "Эвакуатор в [district-predl] дешево"
// });

// document.querySelector(".calculator__btn-order").onclick = function(){
//     let calc__result = (document.querySelector('.calculator__result')).innerHTML;
// 	console.log(calc__result);
// 	let popup = document.querySelector("popmake-26");
// 	popup.setAttribute('data-price-service', calc__result);
// // 	element.setAttribute(name, value);
// };



// document.querySelector(".calculator__btn-order").onclick = function(){
//     let calc__result = (document.querySelector('.calculator__result')).innerHTML;
// 	console.log(calc__result);
// 	let popup = document.querySelector("popmake-26");
// 	popup.setAttribute('data-price-service', calc__result);
// // 	element.setAttribute(name, value);
// };

document.querySelector(".evamax-calc__btn-order").onclick = function(){
    console.log((document.querySelector('.evamax-calc__result b')).innerHTML);
	let calc__result = (document.querySelector('.evamax-calc__result b')).innerHTML;
	let popup = document.querySelector(".evamax-calc__btn-order");
	let result = popup.setAttribute('data-price-service', calc__result);
	let result__popup = popup.getAttribute('data-price-service');
	document.querySelector(".hide-price").setAttribute('value', result__popup);
	document.querySelector(".calc_form_result").innerHTML = calc__result;
};


