enum Type { Enemy, Item}
var Mode : Type;

var Life : int = 50;
var KillTime : float= .05;
var HurtFX : GameObject;
var ShatterFX : GameObject;
var ExplodeFX : GameObject;
private var DAudio : AudioSource = null;
var HurtSound: AudioClip;

function Awake ()
{
	DAudio = gameObject.AddComponent(AudioSource);
}

function Update () 
{
	if ( Life <= 0){
		Kill ();
	}
	if(transform.position.y <=-1){
		transform.position.y = 1;
	}
}

function Kill () : boolean
{
	if (Mode == Type.Enemy) {
		killTime = KillTime * 2;
		if(ShatterFX == null){
			var Shatter : GameObject = Instantiate(ShatterFX, transform.position, transform.rotation);
		}
		var Hurt : GameObject = Instantiate(HurtFX, transform.position, transform.rotation);
		Hurt.transform.parent = gameObject.transform;
		Destroy (gameObject, KillTime);
	}
	
	if ( Mode == Type.Item) {
		var Explo : GameObject = Instantiate(ExplodeFX, transform.position, transform.rotation);
		Destroy (gameObject, KillTime);
	}
}

function ApplyDamage (Hit : float){
	GetComponent.<AudioSource>().PlayOneShot (HurtSound);
	var Hurt : GameObject = Instantiate(HurtFX, transform.position, transform.rotation);
	Life -= Hit;
}

function ApplyExplosion (Hit : float){
	GetComponent.<AudioSource>().PlayOneShot (HurtSound);
	Life -= Hit; 
}