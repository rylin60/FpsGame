var neverEmpty : boolean = true;
//Refrences
var weapon : Transform;
private var weaponPos : Vector3;
var shootPos : Transform;
var Mcam : GameObject;
var Muzzle : Renderer;
var Sound : AudioClip;
var BulletHole : GameObject;
var Smoke : GameObject;
//Shooting vars
var fireRate : float = .08;
var ammo : int = 100;
var Damage : int = 5;
var force : int = 1000;
var range : int = 100;
var KickAmount : float = 0.5;

 
private var m_FrameShot = -1;
private var mounted : boolean = false;
private var nextFire : int = 0;



function Start (){
	weaponPos = weapon.transform.localPosition;
	VehicleOff();
	gameObject.AddComponent.<AudioSource>();
	Muzzle.enabled = false;
}

function Update (){
	if(mounted){
		if(Input.GetButton("Fire1") && nextFire == 0){
			Fire();

		}
	}
}
function LateUpdate (){
	if (Muzzle){
		if (m_FrameShot == Time.frameCount){
			Muzzle.enabled = true;
			Muzzle.GetComponent.<Light>().enabled = true;
		}
		
		else{
			Muzzle.enabled = false;
			Muzzle.GetComponent.<Light>().enabled = false;
		}
	}
}

function Fire (){
	// Stop Fire Spawwning
	nextFire = 1;
	
	var direction = Spread ();
	var hit : RaycastHit; 
	
	if (ammo > 0 ){
		GetComponent.<AudioSource>().PlayOneShot(Sound); 
		// Did we hit
		if (Physics.Raycast (shootPos.position, direction, hit, range))
		{	
			Debug.DrawLine (transform.position, hit.point, Color.blue);
			hit.collider.SendMessageUpwards("ApplyDamage", Damage, SendMessageOptions.DontRequireReceiver);
		
			// Apply hit to Rigid Body
			if (hit.rigidbody ){ 
					hit.rigidbody.AddForceAtPosition(force * direction , hit.point);
				}
		
			//BulletHole and Smoke
			if (hit.collider.transform.CompareTag ("Level")) {
					var rotation =  Quaternion.FromToRotation(Vector3.up, hit.normal);
	
					if (BulletHole){
						var BulletHole : GameObject = Instantiate(BulletHole, hit.point , rotation);
					}
					if (Smoke){
						var Smoke: GameObject = Instantiate (Smoke, hit.point , rotation);
					}
			}
		}
		KickBack();
		// Enable Muzzle
		m_FrameShot = Time.frameCount;
		
		//Never Empty
		if(!neverEmpty){
			ammo--;
		}
		
		yield WaitForSeconds(fireRate);
		nextFire = 0;
	}
}
// Kick back simulation done by coding
function KickBack (){
	//transform.Translate(0,0, - KickAmount/4 * Time.deltaTime , Space.Self);
	weapon.transform.localPosition.z -= KickAmount  * Time.deltaTime ;
	
	// Bring Back
	yield WaitForSeconds(.1);
	KickTO();
}
function KickTO (){
	//transform.Translate(0,0,KickAmount/4 * Time.deltaTime, Space.Self);
	weapon.transform.localPosition= weaponPos;
}
//Spread
function Spread (){
	vx = (.5* Random.value) * .01;
	vy = (.5* Random.value) * .01;
	vz = .5;
	return Mcam.GetComponent.<Camera>().transform.TransformDirection(Vector3(vx,vy,vz));
}

//Gui Displyes
function OnGUI (){
	if (mounted){
		GUI.Box(Rect(Screen.width - 190, Screen.height -40, 100, 20), GUIContent ("Ammo: " +ammo));
	}
}

//Turn On or Off. 
function VehicleOn (){
	mounted = true;
	//audio.Play();
}

function VehicleOff (){
	mounted = false;
	//audio.Stop();
}