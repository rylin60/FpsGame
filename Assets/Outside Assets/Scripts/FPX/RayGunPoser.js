
//Positions And Rotations-----------------
var AimPos : Vector3;
private var AimPos1 : Vector3;
var AimRot : Vector3;

var HipPos : Vector3;
private var HipPos1 : Vector3;
var HipRot : Vector3;

var SprintPos : Vector3;
private var SprintPos1 : Vector3;
var SprintRot : Vector3;

private var Gap : Vector3;

//Scope Variable----------------------------
var Speed : float = .5;
var Zoom : float = 1;
private var Zoom1 : float;
private var FOV : float = 60;

//Outside Objects-----------------------------
private var  cmra : GameObject; 
private var player : GameObject;

//Boolean Ckecks-------------------------
private var running : boolean = false;
private var aiming : boolean = false;
private var scopeOn : boolean = false;
var Scoped : boolean = false;

//Scope Sclass-------------------------------
class Scope extends System.Object{
    var ScopeTxt : Texture2D;
	var BreatheSound : AudioClip;
	var SoundHolder : AudioSource;
}
var scope = Scope();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Start (){
	// FindOutside Object 
	player = GameObject.FindWithTag("Player");
	cmra  = GameObject.FindWithTag ("MainCamera");
	Gap= HipPos-transform.localPosition;

}

function FixedUpdate (){
	//Fix Vectors ///////
	AimPos1 = AimPos;
	SprintPos1 = SprintPos;
	HipPos1 = HipPos;
	Zoom1 = Zoom;	
}

function Update (){
	//AIMING DOWN ////////////////////////////////////////////////////////////////////////////
	if (Input.GetButton ("Sights") && !Input.GetButton ("Run")){
		aiming = true;
		//////////////////
		Gap= AimPos1-transform.localPosition;
		
		if (transform.localPosition!=AimPos1){
			if(Mathf.Abs(Vector3.Distance(transform.localPosition , AimPos1)) < Gap.magnitude/Speed*Time.deltaTime){
				transform.localPosition=AimPos1;
			} 
			else {
				transform.localPosition +=Gap/Speed*Time.deltaTime;
			}
		  }
		
		if (transform.localEulerAngles != AimRot){
			transform.localEulerAngles = AimRot;
		}
		
		// Camera
		if (aiming){
			// Put Scope
			if(Scoped){
				scopeOn =true;
				var Guns = GetComponentsInChildren(Renderer);
				for( var Gun : Renderer in Guns){
					Gun.enabled=false;
				}
				//Breathe
				if(Input.GetButton("Fire2")){
					Breathe();
				}
				if(!Input.GetButton("Fire2")){
					scope.SoundHolder.GetComponent.<AudioSource>().mute = true;
					NoBreathe();
				}
			}
			
			if(cmra.GetComponent.<Camera>().fieldOfView > (60/Zoom1)){
				FOV = Mathf.Lerp(Camera.main.fieldOfView,(60/Zoom1), Speed * 5);
				cmra.GetComponent.<Camera>().fieldOfView = FOV;
			}
		}
	
	}
	//RUNNING ////////////////////////////////////////////////////////////////////////////
	 if(Input.GetButton ("Run") && !Input.GetButton ("Sights")){
		running = true;
		aiming = false;
		/////////////////////
		Gap= SprintPos1-transform.localPosition;
		
		// Gun Position
		horizontal = Input.GetAxis ("Horizontal");
		vertical = Input.GetAxis ("Vertical");
			
		var movement : float = Mathf.Abs(Input.GetAxis ("Vertical") *Input.GetAxis ("Vertical")); 
		var translation = (Gap/Speed *Time.deltaTime * 2);
		
		if (movement == 0){
			transform.localPosition=HipPos1;
			transform.localEulerAngles = HipRot;
		}
		
		if(transform.localPosition!=SprintPos1){
			if(Mathf.Abs(Vector3.Distance(transform.localPosition , SprintPos1)) < Gap.magnitude/Speed*Time.deltaTime)
			{
				if (movement > 0)
				transform.localPosition=SprintPos1;
			}
			else {
				if (movement > 0)
				transform.localPosition +=translation;
			}
		}
		
		if(transform.localEulerAngles != SprintRot){
			if(movement > 0){
				for (var i : float; i < 10; i +=.2){
				transform.localEulerAngles += SprintRot/2 *Time.deltaTime * 5; 
				}
				if( i >= 10)
				transform.localEulerAngles = SprintRot;
				i = 0;
			}
		}
		
		// Camera
		if(cmra.GetComponent.<Camera>().fieldOfView != 60)
		{
			FOV = Mathf.Lerp(cmra.GetComponent.<Camera>().fieldOfView,60, Speed * 3);
			cmra.GetComponent.<Camera>().fieldOfView = FOV;
		}
		// ScopeOff
		scopeOn = false;
		
		///Bring guns If scoped////
		Guns = GetComponentsInChildren(Renderer);
		for( var Gun : Renderer in Guns)
		{
			Gun.enabled=true;
		}
	}
	//NORMAL ////////////////////////////////////////////////////////////////////////////
	 if (!Input.GetButton ("Sights") && !Input.GetButton ("Run")){
		aiming = false;
		running = false;
		//////////////////////
		Gap= HipPos1-transform.localPosition;
	
		// Gun Position
		if (transform.localPosition!=HipPos1)
		{
			if(Mathf.Abs(Vector3.Distance(transform.localPosition , HipPos1)) < Gap.magnitude/Speed*Time.deltaTime)
			{
				transform.localPosition=HipPos1;
			} else 
			{
				transform.localPosition +=Gap/Speed*Time.deltaTime;
			}
		}
		  
		if (transform.localEulerAngles != HipRot)
		{
			transform.localEulerAngles = HipRot;
		}
		
		// Camera
		if(cmra.GetComponent.<Camera>().fieldOfView != 60)
		{
			FOV = Mathf.Lerp(cmra.GetComponent.<Camera>().fieldOfView,60, Speed * 3);
			cmra.GetComponent.<Camera>().fieldOfView = FOV;
			
		}
		//Scope Off
		scopeOn = false;
		///Bring guns If scoped////
		Guns = GetComponentsInChildren(Renderer);
		for( var Gun : Renderer in Guns)
		{
			Gun.enabled=true;
		}
	}
}

//Breathe
function Breathe(){
	if(!scope.SoundHolder.GetComponent.<AudioSource>().isPlaying){
		scope.SoundHolder.GetComponent.<AudioSource>().clip = scope.BreatheSound;
		scope.SoundHolder.GetComponent.<AudioSource>().Play();
		scope.SoundHolder.GetComponent.<AudioSource>().mute = false;
	} 
}
function NoBreathe(){
	scope.SoundHolder.GetComponent.<AudioSource>().Stop();
	scope.SoundHolder.GetComponent.<AudioSource>().mute = true;
}

// Display Scope
function OnGUI () {
	var ScopePos = Rect(0,0,Screen.width,Screen.height);
	if(scopeOn){
		GUI.DrawTexture(ScopePos, scope.ScopeTxt, ScaleMode.StretchToFill);
	}

}