//META{"name":"subViewer"}*//


/* 

-------- KNOWN BUGS

- sometimes when i use function innerHTML, plugin doesn't work o.O
- using the comment (//)


-------- TO DO  

- add a mini alert warning about used keys error
- fix counter animation on start
- beautify console.log information/alerts
- beautify/minify/simplify code 
- add custom animations (possible to change in settings of plugin)
- form verification (settings) 

-------- LAST UPDATE

Thu 26.12.2017

-------- ICONS

Icons made by Gregor Cresnar from www.flaticon.com is licensed by CC 3.0 BY


*/


var subViewer = function() {}, last_s;

// Basic Information
subViewer.about = {
	name: "SubViewer",
	description: "This simple plugin allows you to display the amount of your youtube channel subscriptions in Discord.",
	version: "1.0",
	author: "Dennijs" 
};

// Customizable options
subViewer.options = {
	shortcut: "sv",
	className: "subViewer-plugin",
	source: "channels-3g2vYe",
	style: `
	.user-select{
		-moz-user-select: text;
	    -ms-flex-positive: 1;
	    -ms-user-select: text;
	    -webkit-box-flex: 1;
	    -webkit-user-select: text;
	    flex-grow: 1;
	    user-select: text;
	}
	.sv-wrapper{
		-ms-flex-align: center; 
		-ms-flex-negative: 0; 
		-webkit-box-align: center; 
		align-items: center; 
		display: -webkit-box; 
		display: -ms-flexbox; 
		display: flex;
	}
	.sv-container{
		padding: 15px; 
		-ms-flex-align: center; 
		-ms-flex-negative: 0; 
		-webkit-box-align: center; 
		align-items: center; 
		background: rgba(32,34,37,.3); 
		color: #fff; 
		display: -webkit-box; 
		display: -ms-flexbox; 
		display: flex;
	}

	.sv-container svg{
		width: 100%
		height: auto;
	}

	.sv-container .sv__svg-icon{
		min-width: 11px;
	    margin: 0 0 0 5px;
	}

	.sv__item-title a{ 
		opacity: .3;
		font-weight: 500;
		width: 100%;
		color: #FFF;
		transition: .15s ease
	}

	.sv__item-title a:hover{
		opacity: 1;
	}

	.sv-block{
		margin: 0 0 20px
	} 

	.sv-settings{
		padding: 20px;
	}
	.sv-settings input[type=text],textarea{
		border: 0; 
		margin: 0; 
		width: 100%; 
		padding: 5px; 
		border-radius: 3px;
	} 
	.sv-title{
		color: #87909C; font-weight: 700;
	}
	#sub-counter{
		min-width: 90px;
    	text-align: right;
	} 
	.sv-settings .sv-text{
		border-top: 1px solid #3f4146; 
		color: #b0b6b9; 
		padding: 10px 0; 
		margin: 0px 0 25px; 
		margin-top: inherit !important;
	} 
	.sv-settings textarea{
		min-height: 150px; 
		min-width: 100%; 
		max-width: 100%
	} 
	.sv-settings input[type=number]{
		border: 0;
		display: block; 
		padding: 5px; 
		border-radius: 3px;
	} 
	.sv-settings label{
		color: white; 
		margin: 0 0 10px; 
		display: block;
	} 
	.sv-settings .sv-avatar{
		width: 28px;
	    height: 26px;
	    border-radius: 50%;
	    margin: 0px 13px 0 0;
	    overflow: hidden;
	}
	.sv-settings .sv-avatar img{
		width: 100%;
		height: auto;
	}

	.sv-container .active{
		animation: pulse 1s ease;
	} 
	@keyframes rubberBand { 
		from { transform: scale3d(1, 1, 1); } 
		30% { transform: scale3d(1.25, 0.75, 1); } 
		40% { transform: scale3d(0.75, 1.25, 1); } 
		50% { transform: scale3d(1.15, 0.85, 1); } 
		65% { transform: scale3d(.95, 1.05, 1); } 
		75% { transform: scale3d(1.05, .95, 1); } 
		to { transform: scale3d(1, 1, 1); } }

	@keyframes pulse {
	  from {
	    transform: scale3d(1, 1, 1);
	  }

	  50% {
	    transform: scale3d(1.05, 1.05, 1.05);
	  }

	  to {
	    transform: scale3d(1, 1, 1);
	  }
	}
	`
}

// General functions
subViewer.general = {

	isPluginExist: function(){ // test is plugin already exist

		var pl = document.getElementsByClassName(subViewer.options.className)
		if(pl.length) return true
	},

	isDataExist: function(){
		
		var sv_settings = bdPluginStorage.get("subViewer", "settings");

		// if saved data exist
		if( sv_settings != null ){

			// if doesn't exist testData value - create one
			if( !(["testData"] in sv_settings) ){
				sv_settings["testData"] = "true";
				bdPluginStorage.set("subViewer", "settings", sv_settings);
			}

		// else set default data
		}else{

			var obj = {
		        "sv_refresh_time": 10,
		        "sv_yt_id": "UC-lHJZR3Gqxm24_Vd_AJ5Yw", // pewdiepie channel
		        "sv_yt_keys": "AIzaSyABUYBHkmviF3v7hG8W9AeSVjw5Cz4zMhE,AIzaSyA_lCezx_Pi373S6q1D4CmQjjlAeTfHdbo,AIzaSyDbbGYLdtAUIdmvna3GtfXqaXrK6gsaEdQ,AIzaSyDbbGYLdtAUIdmvna3GtfXqaXrK6gsaEdQ,AIzaSyDskafdNketvkkGwEYiU8IpPz1e6k5K4iw,AIzaSyCNKf_QzOK3YmyQvcBKRq2FqbV5IngbiNk,AIzaSyDdL5NKt76iP60RjCgiJK0LuDAKSemoAR0,AIzaSyDXgnhAE8S_2wT8pvvgytGLP63HtiiejlE,AIzaSyDb4WnIWOYQwJOemq2v9cEWB7Oc7149LhI,AIzaSyAJ46YZLzaiGtbRi14fikKGmDcNLOfkLKI,AIzaSyCMj8R_4_1NT9jpHJ2qGFM1OPDfS1lhpVk,AIzaSyDDLFt_-P2DkecD4akKsOAjdbn5Ips1sPI,AIzaSyDRtIUIzkK1rpGxZYp1b2YsFWWYiXqlOjo,AIzaSyAUJSi3kVuSAONOBNRz9vcYvmLYP-EvBc8,AIzaSyDinE7kGAccYnwOooqu85y2Eht9wySTZFA,AIzaSyB4vLjdLgXTAEJgGQYTHkcTJy7SimBBgyM,AIzaSyCFq0dZDYGxYd0NSfhLNvWcLsOOmvJGXOA,AIzaSyAvkhdktXVe5R695zrToiW6ZUkEaU7NUAU,AIzaSyDNDbHN4hhxmWZoh4JFTAGul7zeN31MpVw,AIzaSyAEjIetdx8Hmql52eRmKlWDEPUD-wrKPXk,AIzaSyB_5bn9rgzp67Tb5vRHaNDSlfMTkF7yzbI,AIzaSyC-HwrtQ3c_tvh23rhaiV4-8knYE-fK8HU,AIzaSyADYyzXwJlMyn3QGDO1ai_vtb9brDU_8iM,AIzaSyB43jXrzJY-wFL-B6-6Fh5u8ABe9u0xxSw,AIzaSyBkqmQqBYavQ4_WcJJobCto8vZwfdTezYk,AIzaSyAoJOaXUSpA2ZVITezm_ZteOj0Ofm5URGA,AIzaSyCBswZ-VYVCJSaOGh_am3jHkw6m1XzjXnE,AIzaSyCT3IghHjXDY8TrK7XsFhy2TAg7KaCpU7o,AIzaSyCe0nkux3D4gik9F-R_PzVFEZQkQqWgk7E,AIzaSyC0wkyNSYS8bxge0IQcHJj5XsOREnAiDH0,AIzaSyDrfgPfCkuQQ3UWUkOQ1ihr1T-eq8X1jTU,AIzaSyAYbxv9iW2zdAmkJ_Yr74dnbkvb01_7SAI,AIzaSyDEzk67KPlU8poJufb7kVOL4VmPMPJ7f5k,AIzaSyAej78FUFBCKKBKhUSNs-CnfbbpHxL7cKw,AIzaSyAdrxfhMtBQdGNjMXMu_0c8dLcUddazYUE,AIzaSyCOZbEJps5dwVXlQNsKBWn9r0RnRwo7aec,AIzaSyAHV0_NYjirL3JgnYZmBtDJ8ogrirG_SPQ,AIzaSyC3zh3BJffyCPklwO7cIh5v9sJU3Py5eRQ,AIzaSyAsUE6WF4brJz5Vw-qejkNotmhzM3kpB-U,AIzaSyAgyQjEd0w_VZpKootTvnAP_keLJXHZTOE,AIzaSyDqJSCbAeQQyQ8dI76N3gTmwLOwmNqXAc0,AIzaSyAd3E4XlUx1xS9fEtmuRWxX5ruJBQmCUIw,AIzaSyDDrTTbRwleZbhbjBhk4J7EWSPChvDm6V0,AIzaSyDH-AmwSOGduYt-tDfAzVLMOoC1RXrR9qE,AIzaSyCR48jSAQQDU2oJh9jRtLYU4rOcH0tcQOc,AIzaSyAPpYdxSjEfRHgX0nWJMvrdr8aEbfGnaO8,AIzaSyCcWdqrsYvafX5VCqnp8RqOGQsJOQiZmyE,AIzaSyB0n5mXLcfF8W9ycueQr5mSWiyMfCTQqaE,AIzaSyB_w78ZnTKbhX4-dc8Qb5C1Un1748-WHMc,AIzaSyCW_C8XB5Y8kd9SQIJh-7234TaQ0EFpyfQ,AIzaSyCytBPXzetMtQExCYf9BbXETZLR8OgdYb8,AIzaSyAYM-VgvcT0dYm-5EoybcSL4pWC0h0J6vQ,AIzaSyABLNUyxVmm3wWmQTTnYI4k-l5JhZtVz1M,AIzaSyBsmzI2x1UG4wqxYF2HlAjCXlXF23e9ibU,AIzaSyClsHNnNvEP9eAARNhOpE6zpPFeMtx2tWQ,AIzaSyA5WXw9XNqtpWxTvxQkMikY8h3zas6X_vk,AIzaSyBGrhiqT3x7rTLxM0OZEtwZhYhKnyeKk9s,AIzaSyBTMOSuMot_jGE-zMYxXU1h8SoXeszyrV8,AIzaSyBSJAL4lc2tbyNzWurTV_cy9R36x0aRil0,AIzaSyBWgeckMfmyH4N2RIlx9prE0Rp70JqFscY,AIzaSyCyYTSS0bpKUib35QeoLcwAdCUvwOURz9k,AIzaSyBlRW80PZTIzYU77RdyBZcMp226e-e-fSE,AIzaSyCMig-_giQKWDc9n-r7PNk3-SCOG7ZAjlY,AIzaSyAfEyn3TRvU03co5FhN5xp_y5qViSg2j24,AIzaSyDvhfTFhqolNBcCTDbw4db7QZp73yD7tcA,AIzaSyBuTLrZpFr0mi41SkBuS-AyZEkNopeins8,AIzaSyBCRJV9zQqx-J7RPsZ8tHrG70bq5QeAyNg,AIzaSyBXwxwb8-4Lf3YFiiiUru9dF5DON6hX8L0,AIzaSyAhrHsyxVcn1HT2t-EcKnd-B2J8HEgrfeI,AIzaSyC-HYObfINjSaj0091L8bFMqgk27jPCYlI,AIzaSyDf8ZZ9xklhTE-Ib_Hyn_JpI0YuKbT6YHo,AIzaSyAPYlu_6PfqN8hqdpy_l8NAhKpqVyKf_XM,AIzaSyBX1NqEGu4t6ZhFmHJM_wAf2U275avKZEc,AIzaSyDBB6Y93UJ1YBrdBJKWdeviAqq9dYnjWQk,AIzaSyCnBos9oX01oyK2M9854tlyQz3Qhk1DlNg,AIzaSyBZFcjqx6dmCXxaK2ro0WXj7DFLmkwP9W8,AIzaSyDkItj48PHQ2i5F8iCIUsaHdfG8gvjfSd8,AIzaSyCn0VyVb0nWbc589Y-NJE5xcpLuzKY0i-k,AIzaSyBg_ai96wt4BGuf9kmGN7rZPf8_SsQgNDM,AIzaSyDLsKSQeM5tY9ryxuwaIXnSwXYjZoGx0Vs,AIzaSyDzT9hwMzE8Y1OiVScfzKazZzj98Fc292Y,AIzaSyCvMQPn6AnCnq4zfHaokQrGr-TU12CmLvo,AIzaSyCezfbSEEYwtiYVg7IiwJ_LRc5OrsDMp1M,AIzaSyCFjhzGdg_NWmwoSTDOlcu4VKE3tcBmy_0,AIzaSyD0Tv8f0OxOeGEBOuqA7Z0l6Jx-_uYAOUc,AIzaSyBzMkLn9MNubrO_TwSsQAOMBJ6wOqyy95c,AIzaSyBMGfRSS0nLegc9z5xkKnYWGa-CiKo7epw,AIzaSyCDT-m4tGHS8A5HaUx2wjvwrVa0DHfrZdg,AIzaSyAEtwLTHtWBGsfw1ah02bC19QWS-gIIb9I,AIzaSyDuAM3PhEmtbLxQt-kGiDFoZE5ixhs7DAM,AIzaSyBbq3q1iGRRfWHdqC8c4BwO9w122p_thiI,AIzaSyDrtF_ivKA6ycjvmPQEsI63mnw2Cb6zc2A,AIzaSyAh1dGs0xEHHsuiZDdGROLdAvq3m5hYJ9o,AIzaSyCNHzwWe6iUBc-QjNFPENcvob1FbathPnY,AIzaSyAKz8hoCNcKYuSItm-d4DfBA3VGprpeU9k,AIzaSyCtnXcBbpDVySp6FacvdDkRMIsrgfsV1kc,AIzaSyCUFwwuYnsxlvm8VQR6S1jz8TuF6cHxeHw,AIzaSyA3KvMMHeM9kYkLDfwSP1YWk6q30T9y34E,AIzaSyDzR9tlzIMB5DGQUPWEH1e0iu3kSRVISv0,AIzaSyAdYeMx6afUddn2SW2F2ToLC8vEeElbvHc,AIzaSyC53-IkYmNXcOhsU2Y0bxAk3VSxc6xxPgM,AIzaSyBcWIYlWT_h0gBehrcPCR766meTf7q4nSg,AIzaSyCvhneEJK2xHMacpEyEavNHnVKUbNj85kg,AIzaSyCoyKutQTbdxEy4yxfoSLZfV_sIRWpmARE,AIzaSyAgpSBH4QML3BLLU7gq6uVw5AIHLadkDYA,AIzaSyAnLC7P_1LsZla70HJ61M4Xd3g1LCY6uok,AIzaSyAHijtoCWLa8lML2DJUU4QKB1w0hYV-SUs,AIzaSyBqyhI_BAfxQNwDoekzSuLljo5JS4gKsQ8,AIzaSyBt9ZenT8TIs75fLDhRhcRmYSe1htpHWYY,AIzaSyDSPfqmeh-fyBNPdFJ0VT8dSjZXPdBO4Lk,AIzaSyDnpzZf9yzhzRhTpKa3rO7rS4oiD3qTPg0,AIzaSyDzeIzyP-IVb8z2ecbNAli2Ip8Q0NRdLYg,AIzaSyDH__UCY8var72fcMx4Zq1Hq6T7yTIS1RE,AIzaSyCwy3UuVz8NovRjtWlfK6Vd7jdJeVVSyRk,AIzaSyAHSPns8aC6zJTzJQl0DDGFqgu9lcExCXI,AIzaSyD7raSbbQqbpooaOUzn2RdzftcLYkb6U-w,AIzaSyASTJSUNdpA0T7os-6h3O6CTwuPZ8DzrkM,AIzaSyCawQTCAw3ncAGE4udxO10jZmNPhcTG3zs,AIzaSyA9CFXyBWkpaIpXQOF_Vr474FV7QfoXWWg,AIzaSyAVY5NGGtaeUQ6GmrJWwT_89a1iwtnoqMw,AIzaSyDeu5duaT2BwNnJ27wTNyDpOzMEXxalhnc,AIzaSyDSRmsWBgbk4Y7-nnn0MuRC0jVm804urzQ,AIzaSyBRZN35Xa33m29mZc6qsrAayAlkTCtXerM,AIzaSyAnLGaqletmWzRssBFwvdKxqcKoTSvbDUE,AIzaSyAqBhAvUMkObOk33DMC2QXcOFJk9gv74To,AIzaSyBRCWu6lNRncqWHjcFMIbAvFTPbWKijfss,AIzaSyD2QxZEj1WkB0n-N7tdBJiyJFRfHRDV6NY,AIzaSyDa-GXI_0Jj-1o-cuKLQQpsCpouVKE8esc,AIzaSyDFQh8Trft4F50navQSA3wTt6p7lxt57k8,AIzaSyDakcRH8wuvGEYwHvXIzKKbK6qcN6yH9Xg", // so many keys :O
		        "testData": "true"
		    }

		    bdPluginStorage.set("subViewer", "settings", obj);

		}
	},

	getRandomYtKey: function(){
		var keys = subViewer.functions.getSettings("sv_yt_keys").split(",");
		return keys[Math.floor(Math.random()*keys.length)].trim();
	},

	numberWithSpaces: function(x){
		var parts = x.toString().split(".");
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	    return parts.join(".");
	}
} 

// ... and main functions
subViewer.functions = {

	reloadPreview: function(a){
		var el = document.getElementById("sv_yt_avatar"),
			sv_settings = bdPluginStorage.get("subViewer", "settings");

		// if saved data exist
		if( sv_settings != null ){
			sv_settings["sv_yt_avatar"] = a;
			bdPluginStorage.set("subViewer", "settings", sv_settings);
		}

		el.src = subViewer.functions.getSettings('sv_yt_avatar');

	},

	getSettings: function(name){
		var obj = bdPluginStorage.get("subViewer", "settings");
		return obj[name];
	},

	updateSettings: function(){

		var s_counter = document.getElementById("sub-counter"),
			name = document.getElementById("yt-name");

		s_counter.innerHTML = "...";
		name.innerHTML = "Loading...";

		// is item in array
		function include(arr,item) {
		    return (arr.indexOf(item) != -1);
		}

		// get all elements from settings form
		var elInForm = document.querySelectorAll(".sv-settings input, .sv-settings textarea"),
			sv_settings = {};

		for (i = 0; i < elInForm.length; i++) {

			var key = elInForm[i].name,
				value = elInForm[i].value;	

			// if key doesn't exist in array
			if( !([key] in sv_settings) ){
				// add key with current value
				sv_settings[key] = value;

			}else{
				// edit (remove and after this add key with value)
				delete sv_settings[key];
				sv_settings[key] = value;
			};
		};

		bdPluginStorage.set("subViewer", "settings", sv_settings);

		// restart
		subViewer.functions.getYoutubeStats();
		subViewer.functions.stop();
		subViewer.functions.load();

	},
 
	update: function(n,s,a){

		var s_counter = document.getElementById("sub-counter"),
			name = document.getElementById("yt-name");

		if( s !== last_s){

			// make an animation ^^
			s_counter.classList.add("active");
			setTimeout(function(){
				s_counter.classList.remove("active");
			},1000);

			last_s = s; //remember last s
		};

		name.innerHTML = n;
		s_counter.innerHTML = subViewer.general.numberWithSpaces(s);

	},

	// kill all process and shut down a plugin
	stop: function(loop){
		// remove plugin div
		var plugin = document.getElementsByClassName(subViewer.options.className);
		plugin.remove();
		// stop loop
		clearInterval(loop);
		// remove css
		BdApi.clearCSS(subViewer.options.shortcut+"_plugin_style");
	},

	// load basic functions on start
	load: function(){

		subViewer.general.isDataExist()

		// append code if plugin isn't initialized 
		if(!subViewer.general.isPluginExist()){

			var code = `
			<div class=' `+subViewer.options.className+` sv-container'>
				<div class='sv__item-title'><a id='yt-name' target="_blank" href="https://www.youtube.com/channel/`+ subViewer.functions.getSettings('sv_yt_id') +`">Loading... </a></div> 
				<div id='sub-counter' class='user-select'>...</div>
				<div class='sv__svg-icon'>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 350"><path d="M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z" fill="#FFFFFF"/> <path d="M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z" fill="#FFFFFF"/> <path d="M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z" fill="#FFFFFF"/> <path d="M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z" fill="#FFFFFF"/>
					</svg>
				</div>
			</div>`,
				src = document.getElementsByClassName(subViewer.options.source)[0],
				getStatsLoop;


			src.insertAdjacentHTML( 'beforeend', code );
			/*
			src.innerHTML += code; BUG!!! idk know why ;-;
			*/
			
			// add a css
			BdApi.clearCSS(subViewer.options.shortcut+"_plugin_style");
			BdApi.injectCSS(subViewer.options.shortcut+"_plugin_style", subViewer.options.style);
			
			// get data from youtube
			subViewer.functions.getYoutubeStats();

			// // get data from youtube every 10s
			clearInterval(getStatsLoop);
			getStatsLoop = setInterval(function(){
				subViewer.functions.getYoutubeStats();
			}, /* get time of loop (s) from settings*/ subViewer.functions.getSettings("sv_refresh_time") * 1000);

		}else{
			subViewer.functions.stop(getStatsLoop);
			subViewer.functions.load();
		}
	},

	getYoutubeStats: function(key){

		if(!key){
			key = subViewer.general.getRandomYtKey();
		}else{
			key = "AIzaSyABUYBHkmviF3v7hG8W9AeSVjw5Cz4zMhE";
		};

		var request = require("request"),
			url = "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id="+ subViewer.functions.getSettings('sv_yt_id') +"&key="+ key;

		request({
		    url: url,
		    json: true
		}, function (error, response, json) {

		    if (!error && response.statusCode === 200) {

		    	let sn = json.items[0].snippet,
		    		st = json.items[0].statistics;

		        var s = json.items[0].statistics.subscriberCount, // amount of subscribers
		        	n = json.items[0].snippet.title, // youtuber name
		        	a = json.items[0].snippet.thumbnails.default.url; // default size thumbnail

		       
		        // make update of data
		        subViewer.functions.update(n,s,a);
		        subViewer.functions.reloadPreview(a);

		    }else{
		    	console.log("SubViewer Plugin |  Error YouTube API request: ");
		    	console.log(json["error"]["message"]);
		    }

		})


		
	}
};
 
subViewer.prototype.start = function() { 
	subViewer.functions.load();
};
subViewer.prototype.load = function() { };
subViewer.prototype.unload = function() { };
subViewer.prototype.stop = function() { 
	subViewer.functions.stop();
};
subViewer.prototype.onMessage = function() { };
subViewer.prototype.observer = function(e) { }; 
subViewer.prototype.getSettingsPanel = function() {
    return `<div class='sv-settings'>
    	<div class='sv-title'>Settings</div>
    	<div class='sv-text'>You must complete the fields below to make the plugin work properly.</div>
    	<div class='sv-block'>
    		<label>Youtube channel ID</label>
    		<div class="sv-wrapper"><div class="sv-avatar"><img id="sv_yt_avatar" src="`+subViewer.functions.getSettings('sv_yt_avatar')+`"></div>
    		<input oninput='subViewer.functions.updateSettings();subViewer.functions.reloadPreview();' value='`+ subViewer.functions.getSettings('sv_yt_id') +`' type='text' name='sv_yt_id' placeholder='Youtube channel ID'></div>
    	</div>
    	<div class='sv-block'>
    		<label>Youtube API keys</label>
    		<textarea oninput='subViewer.functions.updateSettings()' name='sv_yt_keys' placeholder='Paste here your YT API key (if you want to use more than one, separate the keys with a comma).'>`
    		+ subViewer.functions.getSettings('sv_yt_keys') +`</textarea>
    	</div>
    	<div class='sv-block'>
    		<label>Refresh statistics every (sec)</label>
    		<input oninput='subViewer.functions.updateSettings()' value='`+ subViewer.functions.getSettings('sv_refresh_time') +`' type='number' min='8' name='sv_refresh_time' title='Refresh statistics every (s)'>
    	</div>
    </div>`;
};
 
 

subViewer.prototype.getName = function() { return subViewer.about.name; };
subViewer.prototype.getDescription = function() { return subViewer.about.description; };
subViewer.prototype.getVersion = function() { return subViewer.about.version; };
subViewer.prototype.getAuthor = function() { return subViewer.about.author; };