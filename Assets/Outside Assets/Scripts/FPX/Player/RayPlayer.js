//Health vars
var Hitpoints : int =  100;
private var CHitpoints : int;
private var RegenPoints : int;
private var Dead : boolean = false;
	//Height Check
	private var Y : float;
	private var YY : float;
	private var falling : boolean = false;

//Regen Vars
var Regenerate : boolean = false;
var RegenTime : float = 3;
var RegenSpeed : float = .5;
private var Regenerating : boolean = false;

//Effects
var PainSound : AudioClip[]; 
var BloodSplats : Texture2D[];
var CharSounds: AudioClip [];

	//FootSteps
var FootSteps : AudioClip [];
var StepTime: float = .5;
private var stepping : boolean = false;

//Refs
private var controller : CharacterController;

function Start(){
	CHitpoints = Hitpoints;
	controller = GetComponent (CharacterController);
}
function FixedUpdate(){
	if(!Input.GetAxis("Horizontal") && !Input.GetAxis("Vertical")){
		if(stepping == false){
			stepping = false;
			}
		}
}

function Update (){
	RegenPoints = CHitpoints;
	
	// Check If we have 0 health and Above 100%
	if(CHitpoints != Hitpoints){
		if (CHitpoints <= 0){
			CHitpoints = 0;
			// Call Death and Revive Codes
		}
		else if (CHitpoints > Hitpoints){
			CHitpoints = Hitpoints;
		}
		// Check for Regenerate
		else if (CHitpoints < Hitpoints){
			if (Regenerate && !Regenerating){
				Regen ();
			}
		}
	}
	//Normalized Helath Effects
	if (CHitpoints == Hitpoints){
		var X = 1 - Random.Range (0,300);
		if(!Input.GetButton("Fire2") && X == 0){ 
			CharaSound();
		}
	}
	if(controller.isGrounded){
		Y = controller.transform.position.y;
		//FootSteps hndlers
		if (Input.GetAxis("Horizontal") || Input.GetAxis("Vertical")){
			if(!stepping && controller.isGrounded){
				if(!Input.GetButton("Run") && !Input.GetButton("Sights")){
					var S = StepTime;
				}
				if(Input.GetButton("Run")){
					S = .2;
				}
				if(Input.GetButton("Sights")){
					S = .8;
				}
					WalkSound(S);
			}
		}
		
		if(falling){
			falling = false;
			if(Y<YY-10){
				ApplyDamage(Mathf.Abs(YY - Y/2));
				YY = 0;
			}
		}
	}
	//Height Handler
	if(!controller.isGrounded){
		if(!falling){
			falling = true;
			YY = controller.transform.position.y; 
		}
	}
}
//DrawTexture On Screen 
function OnGUI (){
	var position = Rect(0,0,Screen.width,Screen.height);
	if (CHitpoints < 30 ){
		GUI.DrawTexture (position,BloodSplats[0], ScaleMode.ScaleAndCrop);
	}
	if (CHitpoints < 60 && CHitpoints > 30){
		GUI.DrawTexture (position,BloodSplats[1], ScaleMode.ScaleAndCrop);
	}
	if (CHitpoints < 80 && CHitpoints > 60){
		GUI.DrawTexture (position,BloodSplats[2], ScaleMode.ScaleAndCrop);
	}
	if (CHitpoints < 100 && CHitpoints > 80){
		GUI.DrawTexture (position,BloodSplats[3], ScaleMode.ScaleAndCrop);
	}
	GUI.color = Color.red;
	GUI.Box(Rect(50, Screen.height -60, CHitpoints, 20), GUIContent  (""));
	GUI.Label(Rect(50, Screen.height -60, 100, 20), GUIContent  (" Health" ));
}

function ApplyDamage (Damage : int){
	CHitpoints -= Damage;
	if (!GetComponent.<AudioSource>().isPlaying){
		GetComponent.<AudioSource>().clip = (PainSound[Random.Range(0,PainSound.length)]);
		GetComponent.<AudioSource>().Play();
		}
	else{
		GetComponent.<AudioSource>().Stop();
		GetComponent.<AudioSource>().clip = (PainSound[Random.Range(0,PainSound.length)]);
		GetComponent.<AudioSource>().Play();
	}
		//audio.PlayOneShot (PainSound[Random.Range(0,PainSound.length)]);
}
function ApplyHealth (Health : int){
	if(CHitpoints < Hitpoints){
		CHitpoints += Health;
	}
}
//Character sounds
function CharaSound (){
	if (!GetComponent.<AudioSource>().isPlaying){
		GetComponent.<AudioSource>().clip = CharSounds[Random.Range(0,CharSounds.length)];
		GetComponent.<AudioSource>().Play();
		}
}

//Regenerate Health
function Regen (){ 
	Regenerating = true;
	yield WaitForSeconds (RegenTime);
	for (var R : int = CHitpoints; R < Hitpoints; R++){
		yield WaitForSeconds (RegenSpeed);
		CHitpoints ++;
	}
	Regenerating = false;
}

//Walk Function
function WalkSound(S : float){
	stepping = true;
	GetComponent.<AudioSource>().PlayOneShot (FootSteps[Random.Range(0,FootSteps.length-1)]);
	yield WaitForSeconds (S); 
	stepping = false;
}




