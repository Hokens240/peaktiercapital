   
        var r_text = new Array ();
r_text[0] = "London";
r_text[1] = "Edinburgh";
r_text[2] = "Cardiff";
r_text[3] = "Cambridge";
r_text[5] = "Windsor";
r_text[4] = "Liverpool";
r_text[6] = "Grimsby";
r_text[7] = "Manchester";
r_text[8] = "Leeds";
r_text[9] = "Reading";


var r_name = new Array ();
r_name[0] = "Liam";
r_name[1] = "Joe";
r_name[2] = "Catherine";
r_name[3] = "Amanda";
r_name[5] = "Kyle";
r_name[4] = "Steven";
r_name[6] = "Richard";
r_name[7] = "Williams";
r_name[8] = "Anderson";
r_name[9] = "Gregory";

    var r_map = new Array ();
r_map[0] = "img/chat (1).png";
r_map[1] = "img/chat (1).png";
r_map[2] = "img/chat (1).png";
r_map[4] = "img/chat (1).png";
r_map[5] = "img/chat (1).png";
r_map[6] = "img/chat (1).png";

 
var r_product = new Array ();
r_product[0] = "$40,769";
r_product[1] = "$12,935";
r_product[2] = "$32,227";
r_product[3] = "$27,896 ";
r_product[4] = "$33,770";
r_product[5] = "$16,620";
r_product[6] = "$6375";
r_product[7] = "$31,868 ";
     setInterval(function(){ $(".custom-social-proof").stop().slideToggle('slow'); }, 3000);
      $(".custom-close").click(function() {
        $(".custom-social-proof").stop().slideToggle('slow');
      });
        setInterval(function(){    
        	var myNumber = Math.floor(7*Math.random());
        	$("#map1").attr("src",r_map[myNumber]);
 			$('#country').text(r_text[myNumber]);
             $('#username').text(r_name[myNumber]);

          	$('#product').text(r_product[Math.floor(7*Math.random())]);
 			var timeVal = Math.floor(7*Math.random());
 	
 			$('#time').text(timeVal);
 		
 		 
     //console.log(timeVal); 
 }, 6000);