enum pickType {Health, Ammo}
var Mode : pickType = pickType.Health;
//Boolean Extra  Effect Checks
//var Gravity : boolean = true;
var neverKill : boolean = false;
var Rotae : boolean = true;
var Speed : int = 5;

//Vars
var Amount : int = 10;
var hitSound : AudioClip;

function Start (){
	if(gameObject.GetComponent("AudioSource") == null){
		gameObject.AddComponent.<AudioSource>();
	}
	
}

function Update (){
	if(Rotae){
		transform.Rotate(Vector3.up * (Time.deltaTime * Speed * 10));
	}
}

function OnTriggerEnter (Colide : Collider){
	//Health
	if(Mode == pickType.Health){
		if(Colide.GetComponent.<Collider>().CompareTag("Player")){
			//Play Sound + add Health
			GetComponent.<AudioSource>().PlayOneShot(hitSound);
			Colide.GetComponent.<Collider>().SendMessageUpwards("ApplyHealth", Amount, SendMessageOptions.DontRequireReceiver);
			if(!neverKill){
				Kill();
			}
		}
	}
	//Ammo
	if(Mode == pickType.Ammo){
		if(Colide.GetComponent.<Collider>().CompareTag("Player")){
			//Play Sound + add ammo
			GetComponent.<AudioSource>().PlayOneShot(hitSound);
			Colide.GetComponent.<Collider>().SendMessageUpwards("ApplyAmmo", Amount, SendMessageOptions.DontRequireReceiver);
			if(!neverKill){
				Kill();
			}
		}
	}
	
	
}


function Kill(){
	//Destroy 
	GetComponent.<AudioSource>().PlayOneShot(hitSound);
	Destroy(gameObject,.1);
	
}