//Objects
var explosive : Rigidbody[] ;
private var i : int = 0;
//Counts and Throw
var counts : int [];
private var count : int;
var neverEmpty : boolean = false;
//Throw
var ThrowRate : float = .5;
var Speed : float = 0 ;
var MinSpeed : float = 5;
var ThrowPos : Transform;
private var Power : float = 0;
//Booleans
private var gunActive : boolean = true; 
private var throwing : boolean  = false;
private var Poser : MonoBehaviour;


function Awake (){
	deselectWeapon ();
	/////Establish Poser
	Poser = GetComponent(RayGunPoser);
	Power = MinSpeed;
	
	//Get Count
	count = counts[i];
}

function Update () 
{
	//GetCount 
	count = counts[i];
	//
	if ( Input.GetButton("Fire1") && gunActive){
		if (!throwing && Power < Speed)
		Power += MinSpeed * Time.deltaTime * 5;
	}
	if(Input.GetButtonUp("Fire1") && gunActive){
		if(!throwing)
		Fire(Power);
	}
	// Press x to Switch 
	if(Input.GetKeyDown("x") && gunActive){
		if(i + 1 <= explosive.length - 1){
			i++;
		}
		else if(i + 1 > explosive.length - 1){
			i = 0;
		}
	}
	
}


function Fire (power : float) {
	
	if (count > 0){
		throwing = true;
		//throwing = true;
		var pos : Vector3 = ThrowPos.transform.position + Vector3(0,0,.01);
		
		// Lunch Nde
		var release : Rigidbody =  Instantiate (explosive[i], pos, ThrowPos.transform.rotation); 
		// Give Speed
		release.velocity = ThrowPos.transform.TransformDirection(Vector3 (0, 0, power));
	
		//Get gunActive to throw
		
		yield WaitForSeconds (ThrowRate);
		Power = MinSpeed;
		throwing = false;
		
		if(!neverEmpty){
			counts[i] -= 1;
		}
	}
	else{
		throwing = false;
		Power = MinSpeed;	
	}
		Power = MinSpeed;
		throwing = false;
}

function selectWeapon () {	
	gunActive=true;
	Poser.enabled = true;
	yield WaitForSeconds (.2);
	///////////////////////
	var gos = GetComponentsInChildren(Renderer);
	for( var go : Renderer in gos){
		go.enabled=true;
	}
	gunActive=true;
}

function deselectWeapon () {
	gunActive=false;
	yield WaitForSeconds (.15);
	Poser.enabled = false;
	///////////////////////
	var gos = GetComponentsInChildren(Renderer);
	for( var go : Renderer in gos){
		go.enabled=false;
	}
}
//Pause functions 
function Paused(){
	gunActive = false;
}
function UnPause (){
	gunActive = true;
}
	

function OnGUI (){
	if(gunActive){
		GUI.Box(Rect(Screen.width - 150, Screen.height -60, Power * 2, 20), GUIContent (""));
		GUI.Box(Rect(Screen.width - 190, Screen.height -60, 30, 20), GUIContent ("" + (i+1)));
		GUI.Box(Rect(50, Screen.height -30, 100, 20), GUIContent (explosive[i].name));
	}
	GUI.Box(Rect(Screen.width - 190, Screen.height -25, 100, 19.5), GUIContent ("Count:   " +count));
}


