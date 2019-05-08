enum nadeType {frag, smoke,proxMine,remoteMine,Impact}

var Mode : nadeType = nadeType.frag;
var Gravity : boolean = true;
var sticky : boolean = false;
var Force : boolean = false;

var Speed : int = 50;
var timeCap = 10;
var timer = 3.0;

var hitSound : AudioClip;
var Explosion : GameObject;
var Smoke : GameObject;
//var Burn: GameObject;

function Start ()
{
	if(Mode != nadeType.proxMine && Mode != nadeType.remoteMine && Mode != nadeType.Impact){
		yield WaitForSeconds (timer);
		Explode ();
	}
	//Cap Impact 
	if(Mode == nadeType.Impact){
		TimeCap();
	}
}

function Update () {
	if(Input.GetButton("Fire3")){
		if(Mode == nadeType.remoteMine){
			Explode();
		}
	}
	//Force
	if(Force){
		GetComponent.<Rigidbody>().freezeRotation = true;
		//transform.Translate(Vector3.forward * Speed * Time.deltaTime);
		GetComponent.<Rigidbody>().AddRelativeForce (Vector3.forward *  Speed );
	}
	//Gravity
	if(!Gravity){
		transform.GetComponent.<Rigidbody>().useGravity = false;
	}
}
function Explode (){
	//var rotation =  Quaternion.FromToRotation(Vector3.up, transform.rotation);
	//var Burn : GameObject = Instantiate ( Burn, transform.position, transform.rotation);
	if(Mode != nadeType.smoke){
		var explosion : GameObject =  Instantiate (Explosion, transform.position,transform.rotation); 
	}
	if(Mode == nadeType.smoke){
		if(Smoke){
			var pos = transform.position + Vector3(Random.Range(-1,1),Random.Range(0,1),Random.Range(-1,1));
			for (var s : int = 0; s < 10; s++){
				var smoke : GameObject = Instantiate (Smoke, pos , transform.rotation);
			}
		}
	}
				
	Kill ();
}

function OnTriggerEnter (collision : Collider){
	if (collision.gameObject.tag == "Explosion"){
		Explode();
	}
	if(Mode == nadeType.proxMine){
		if (collision.gameObject.tag == "Enemy"){
			Explode();
		}
	}
	
	else{
		GetComponent.<AudioSource>().PlayOneShot(hitSound);
	}
}
function OnCollisionStay (colide : Collision){
	if (colide.gameObject.tag != "Explosion" && colide.gameObject.tag != "Player"){
		if(sticky && colide.transform.tag != ("Level")){
	
			transform.position = colide.transform.position;
			transform.GetComponent.<Rigidbody>().velocity = Vector3.zero;
			transform.GetComponent.<Rigidbody>().freezeRotation = true; 
			transform.GetComponent.<Rigidbody>().useGravity = false;
			Physics.IgnoreCollision(transform.GetComponent.<Collider>(),colide.transform.GetComponent.<Collider>());
		}
	}
}
function OnCollisionEnter (colide : Collision){
	if(colide.gameObject.tag != "Player"){
		if(Mode == nadeType.Impact){
			Explode();
		}
	}
}

function Kill (){	
	Destroy(gameObject);
}
function TimeCap(){
	yield WaitForSeconds(timeCap);
	Explode();
	
}