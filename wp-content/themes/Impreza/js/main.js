/*
     FILE ARCHIVED ON 7:18:43 мар 11, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:04:33 сен 22, 2016.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
     */
     jQuery().ready(function () { 
          //$(document).on('click','.machine-feed-ban__phone > a', function(){
              //yaCounter11337958.reachGoal('PHONEHEAD');
              //console.log('PHONEHEAD');
              //return true;
          //});
        $(document)
        .ajaxStart(function () {
            $('button').prop('disabled', true);
            $('#send_callback').prop('disabled', true);
            $('#send_callback').addClass('disabled');
            $('#button_send_forma').removeClass('button_send_forma').addClass('button_send_formanoactive');
            $('#sendzakaz').removeClass('sendzakaz').addClass('sendzakaznoactive');
        })
        .ajaxStop(function () {
            $('button').prop('disabled', false);
            $('#send_callback').prop('disabled', false);
            $('#send_callback').removeClass('disabled');
            $('#send_callback').closest('form').trigger('reset');
            $('#button_send_forma').removeClass('button_send_formanoactive').addClass('button_send_forma');
            $('#sendzakaz').removeClass('sendzakaznoactive').addClass('sendzakaz');
        });

        jQuery('.burger_btn').click(function(){
          jQuery('.mobail-menu').toggle();
      });

        jQuery('.mobail-menu li a').click(function(e){
            if(jQuery(this).siblings(".mob-sub-menu").length > 0){
                e.preventDefault();
                jQuery(this).siblings(".mob-sub-menu").toggle();
            }            
        });

        jQuery('.titleBlok').append("<span class=\"titleBook_icon\"></span>");

        jQuery('.titleBlok').click(function(e) {
            if (jQuery(this).next()[0].nodeName == 'UL') {
                jQuery(this).next().toggle();
                jQuery(this).find('.titleBook_icon').toggleClass('open_arr');
                e.preventDefault();
            }            
        });

        jQuery(".kind-machine__items").on("click", function(){
            let link = jQuery(this).find("a").attr('href');
            window.open(link);
        });
        if(document.documentElement.clientWidth < 1024){
            let br = document.querySelector("#breadcrumb").outerHTML;
            jQuery("#breadcrumb").remove();
            jQuery(".machine-feed-ban").after(br);
            jQuery("#breadcrumb").show();
        }
        

        var validator = jQuery('#opinions').validate({
            rules: {
                fio: {
                    minlength: 2,
                    lettersonly: true,
                    required: true
                },
                email: {
                    required: true,
                    minlength: 3,
                    email: true
                },
                title: {
                    required: true,
                    minlength: 5
                },
                town: {
                    required: true,
                    minlength: 2
                },
                message: {
                    required: true,
                    minlength: 20
                }
            },
            errorPlacement: function (error, element) {
                return true;
            }
        });

        jQuery(document).on('keyup', '#opinions input', function () {
            validator.element(jQuery(this));
        });
        var validator1 = jQuery('#sendmailForm').validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2,
                    lettersonly: true
                },
                email: {
                    required: true,
                    minlength: 3,
                    email: true
                },
                message: {
                    required: true,
                    minlength: 100
                },
                phone: {
                    required: true,
                    maskedPhone: true
                }
            },
            errorPlacement: function (error, element) {
                return true;
            }
        });
        jQuery(document).on('keyup', '#sendmailForm input', function () {
            validator1.element(jQuery(this));
        });
        var validator2 = jQuery('#numberorderForm').validate({
            rules: {
                name: {
                    minlength: 2,
                    lettersonly: true
                },
                phone: {
                    required: true,
                    maskedPhone: true
                }
            },
            errorPlacement: function (error, element) {
                return true;
            }
        });
        jQuery(document).on('keyup', '#numberorderForm input', function () {
            validator2.element(jQuery(this));
        });
    });

function resetform(){
  jQuery("#my_phone").val('');
}
function messagedisplay(){

	var fon ='<p class="text_p" style="display:none;">Ваша заявка принята в течении минуты мы вам перезвоним</p>';
	jQuery('#block2').html(fon);
    jQuery('.text_p').fadeIn();
}
function send(phone){

    jQuery.ajax({
       type: "POST",
       url: 'wp-content/themes/f1studio/sender.php',
       data: "phone="+phone,
       success: function(data){
        if(data=='true'){
            resetform();
            messagedisplay();
        }
    }
});
}
jQuery(document).ready(function(){
	jQuery('#bigs_form').click(function(){
		jQuery('#blok_min_form').fadeOut();
		jQuery('#big_form').fadeIn();
	});
    jQuery('#button_send_form').click(function(){
      var phone =$("#my_phone").val();
      phone =jQuery.trim(phone);
      if(phone==''||phone=='+7 (___) ___-__-__'){
        jQuery("#my_phone").css({'border':'1px solid red','background':'#FEA0A0'})
        .animate({'opacity':'0'},300).animate({'opacity':'1'},300)
        .animate({'opacity':'0'},300).animate({'opacity':'1'},300)
        ;
        setTimeout(function(){
           jQuery("#my_phone").css({'border':'1px solid #434549','background':'#fff'});
       },2100);

    }else{
        send(phone);
    }
});
});
jQuery(function($){
   $("#my_phone").mask("+7 (999) 999-99-99");
});

jQuery('.BlockInputRadio').on('click', function(e){
    var $curBlock = $(this);
    jQuery('.BlockInputRadio span').removeClass('checked');
    $curBlock.find('input').prop("checked", true);
    $curBlock.find('span').addClass('checked');
});


jQuery('.BlockInput.rul').on('click', function(e){
    var $curBlock = $(this);
    jQuery('.BlockInputRadio span').removeClass('checked');
    $curBlock.find('input').prop("checked", true);
    $curBlock.find('span').addClass('checked');
});

jQuery('.BlockInput.kolesa label').on('click', function(e){
    var $curBlock = $(this);
    jQuery('.BlockInput.kolesa span').removeClass('checked');
    $curBlock.find('input').prop("checked", true);
    $curBlock.find('span').addClass('checked');
});

jQuery('.blockinput-result_calc').on('click', function(e){
    var $curBlock = $(this);
    jQuery('.blockinput-result_calc span').removeClass('checked');
    $curBlock.find('input').prop("checked", true);
    $curBlock.find('span').addClass('checked');
});

