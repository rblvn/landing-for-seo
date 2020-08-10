



/*
     FILE ARCHIVED ON 2:20:01 апр 14, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:09:19 сен 22, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
function ClacParseInt(i) {
    return parseInt(parseFloat(i));
}
var Calc = new Object;
Calc = {
    init: function () {
        this.ObjForm = document.getElementById("calc_form") || null;
        this.ObjResult = document.getElementById("calc_result");
        this.ObjCalcTypeAvto = document.getElementById("calc_type_avto");
        this.ObjCalcDistance = document.getElementById("calc_distance");
        this.ObjCalcSpecType = document.getElementById("calc_typeSpec");
        if (this.ObjCalcTypeAvto) {
            if (CalcData.TypesAvto) {
                // var inner='<input name="calc_type_avto" onChange=Calc.Result() >';
                for (i = 0; i < CalcData.TypesAvto.length; i++) {
                    inner += '<input type="radio" value=' + CalcData.TypesAvto[i].price + ' onchange="Calc.Result()">' + CalcData.TypesAvto[i].name + '';
                }
                // inner+='</select>';
                this.ObjCalcTypeAvto.innerHTML = inner;
            }
        }
        if (this.ObjCalcDistance) {
            if (CalcData.Distance) {
                var inner = '<select name="calc_distance" onChange=Calc.Result()>';
                for (i = 0; i < CalcData.Distance.length; i++) {
                    inner += '<option value=' + CalcData.Distance[i].price + ' >' + CalcData.Distance[i].name + '</option>';
                }
                inner += '</select>';
                this.ObjCalcDistance.innerHTML = inner;
            }
        }
        if (this.ObjCalcSpecType) {
            if (CalcData.SpecType) {
                var inner = '<select name="calc_typeSpec" onChange=Calc.Result()>';
                for (i = 0; i < CalcData.SpecType.length; i++) {
                    inner += '<option value=' + CalcData.SpecType[i].price + ' >' + CalcData.SpecType[i].name + '</option>';
                }
                inner += '</select>';
                this.ObjCalcSpecType.innerHTML = inner;
            }
        }
        this.Result();
    },
    Result: function () {
        var Sum = 0;
        if (this.ObjForm !== null && this.ObjForm["calc_type_avto"]) {
            var calc_type_spec = this.ObjForm["calc_typeSpec"].value;
            for (i = 0; i < this.ObjForm["calc_type_avto"].length; i++) {
                if (this.ObjForm["calc_type_avto"][i].checked == true) {
                    Sum += ClacParseInt(CalcData['Spec'][calc_type_spec][this.ObjForm["calc_type_avto"][i].value]);//*ClacParseInt(CalcData.PriceBlockWheel);
                }
            }
        }
        // if(this.ObjForm["calc_type_avto"].value) Sum+=ClacParseInt(this.ObjForm["calc_type_avto"].value);
        if (this.ObjForm !== null && this.ObjForm["calc_distance"].value) Sum += ClacParseInt(this.ObjForm["calc_distance"].value);
        if (this.ObjForm !== null && this.ObjForm["calc_block_wheel"]) {
            for (i = 0; i < this.ObjForm["calc_block_wheel"].length; i++) {
                if (this.ObjForm["calc_block_wheel"][i].checked == true)
                    Sum += ClacParseInt(this.ObjForm["calc_block_wheel"][i].value) * ClacParseInt(CalcData.PriceBlockWheel);
            }
        }
        if (this.ObjForm !== null && this.ObjForm["calc_block_steering_wheel"]) {

            //	for(i=0;i<this.ObjForm["calc_block_steering_wheel"].length;i++)
            //	{
            if (this.ObjForm["calc_block_steering_wheel"].checked == true)
                Sum += ClacParseInt(this.ObjForm["calc_block_steering_wheel"].value) * ClacParseInt(CalcData.PriceBlockSteeringWheel);
            if (this.ObjForm["calc_block_quickly"][1].checked == true)
                Sum = Sum - (Sum * 0.09);
            Sum = Math.round(Sum / 100) * 100;
            //}
        }
        if (this.ObjResult) {
            this.ObjResult.value = Sum;
        }
    }
}
