




/*
     FILE ARCHIVED ON 23:08:24 апр 13, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:08:54 сен 22, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
var CalcData=new Object;
CalcData=
{
	/*TypesAvto:Array( // Типы Авто
		// {name:'-----------',price:'0'},
		{name:'<img src="/test/wp-content/themes/alloevak/images/moto.jpg" width="20px" height="20px"/>',price:'1400'}, // Мотоциклы
		{name:'<img src="/test/wp-content/themes/alloevak/images/moto.jpg" width="20px" height="20px"/>',price:'1500'}, //Малометражные
		{name:'<img src="/test/wp-content/themes/alloevak/images/moto.jpg" width="20px" height="20px"/>',price:'1600'}, // Легковые отечественные
		{name:'<img src="/test/wp-content/themes/alloevak/images/moto.jpg" width="20px" height="20px"/>',price:'1700'}, // Легковые иномарки
		// {name:'Импортный легковой автомобиль (представительский класс)',price:'2000'},
		{name:'<img src="/test/wp-content/themes/alloevak/images/moto.jpg" width="20px" height="20px"/>',price:'1900'}, // Джипы, внедорожники
		{name:'<img src="/test/wp-content/themes/alloevak/images/moto.jpg" width="20px" height="20px"/>',price:'2200'} // Спецтехника
	),*/
	Distance:Array( // Расстояние
		{name:'По Москве',price:'0'},
		{name:'За МКАД 5км',price:'175'},
		{name:'За МКАД 10км',price:'350'},
		{name:'За МКАД 15км',price:'525'},
		{name:'За МКАД 20км',price:'700'},
		{name:'За МКАД 25км',price:'675'},
		{name:'За МКАД 30км',price:'1050'},
		{name:'За МКАД 35км',price:'1225'},
		{name:'За МКАД 40км',price:'1400'},
		{name:'За МКАД 45км',price:'1575'},
		{name:'За МКАД 50км',price:'1750'},
		{name:'За МКАД 55км',price:'1925'}
	),
    SpecType:Array( // Расстояние
        {name:'Эвакуатор',price:'0'},
        {name:'Манипулятор',price:'1'}
    ),
	PriceBlockSteeringWheel:'350', // Цена за заблокированный руль
	PriceBlockWheel:'350', // Цена за заблокированное колесо
	Spec:[
		[1600, 1700, 1800, 1900, 2200, 2400],
		[4500, 4500, 4700, 5000, 5500, 6000],
	]
}