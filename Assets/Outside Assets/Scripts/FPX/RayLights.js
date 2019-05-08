enum lightMode {pulse,flash,flashlight}
var Mode : lightMode = lightMode.pulse;
//////////////////////////////////////////////
var Speed : float = 5; 
//////////////////////////////////////////////
private var On : boolean = false;
private var lights : Light; 
private var lightsColor : Color;


function Awake (){
	lights = gameObject.GetComponent("Light");
	if(lights.enabled  == true){
		On = true;
	}
	else {
		On = false;
	}
	
}
function Update (){
	///////Pulse///////////////
	if(Mode == lightMode.pulse){
		lights.intensity = Mathf.Sin(Time.time * Speed);
	}
	//////Flash////////////////////////////////////////////////////////////////////////
	else if(Mode == lightMode.flash){
		lightsColor = GetComponent.<Light>().color;
		var lerp : float = Mathf.PingPong (Time.time, .5/ .5) * Speed;
		lightsColor= Color.Lerp(Color.white, Color.black,lerp);
	}
	//////Flashlight///////////////////////////////////////////////////////////////////
	else if(Mode == lightMode.flashlight){
		if (Input.GetButtonDown ("Flashlight") && !On){
			lights.enabled = true;
			On = true;
		}
		else if (Input.GetButtonDown ("Flashlight") && On){
			lights.enabled = false;
			On = false;
		}
	}
}