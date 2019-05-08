// Type of Weapon (single,auto) ++ Mode Switching
var CanSwitch : boolean = false;
enum gunTypes 
{
	single,		// 单发小手枪;
	auto,		// 自动步枪;
	burst 		// 散弹枪;
}
var Modes : gunTypes[];
//Switcher variable
private var i : int = 1;		// xrl初始化射击模式;
//StartMode
private var Mode : gunTypes;
private var modeIn : String;
var Name : String = null;

//Never Empty Switch 
var autoReload : boolean = false;
var NeverEmpty : boolean = true;

// single && auto variables
var srate = .2;
var rrate = 3.8;
var count  = 20;
var clipset  = 2; 
var force = 200;	
var range = 250;
var Damage : int = 5;

//Spread, Recoil,  KickBack
private var actualSpread : float;
private var spreadRate : float = .05;
var maxSpread : float;

var recoilRot : Quaternion;
private var originalRot : Quaternion;
var recoilRate : float; 
private var recoilMod : float;
private var setRecoil : float;
private var coildown :boolean = false;

//Kickback
private var OriginalPos : Vector3 ; 
var KickAmount : float = 0.5;

//Shot Mods
var BuckShot : boolean = false;
var Bucks : int = 5;

// Effects variables
var Ssound : AudioClip;
var Rsound : AudioClip;
var Dsound : AudioClip;
var Muzzle : Renderer;
var Casing : Rigidbody;
var CasingSpawn : GameObject;

	// Hit PArticles
var Spark : GameObject;
var Smoke : GameObject;
var BulletHole : GameObject;

//Private Variables
private var clipcount = 0;
private var nextfire = 0.0;
private var clips = 0;
private var reloading : boolean = false;

private var m_FrameShot = -1;
private var shooting : boolean = false;
private var bursting : boolean = false;

// Gun ON VAriables
private var gunActive : boolean = false;
private var Running : boolean = false;
private var Aiming : boolean = false;
private var mcra : GameObject;
private var Poser : MonoBehaviour;

function Start (){

	gunActive = false;
	Muzzle.enabled = false;
	
	Mode = Modes[i];
	
	// Set Gun Stats	And get ready to shoot
	clipcount = count;
	clips = clipset;
	mcra = gameObject.FindWithTag ("MainCamera");
	OriginalPos = transform.localPosition;
	Poser = transform.GetComponent(RayGunPoser);
	// add audiosource
	gameObject.AddComponent.<AudioSource>();
	
	//Recoils & Spred
	setRecoil = recoilRate;
	recoilMod = recoilRate/2;	
	actualSpread = 0.0;
	
	//Casing Spawn
	if(CasingSpawn.gameObject.transform == Vector3.zero){
		CasingSpawn.transform.position = Vector3(.4,-.05,-.4);
	}
}

function Update ()
{
	if(!gunActive){
		// Reset gun if not active;
		shooting = false;
		nextfire = 0;
		if(clipcount == 0 && !reloading){
				Reload();
			}
	}
	else if (gunActive)
	{
		//AutoReload
		if(autoReload){
			if(clipcount == 0 && !reloading){
				Reload();
			}
		}
	
	  if(!Input.GetButton("Run")){
		//Fire single
		switch (Mode) {
			case (gunTypes.single):
				if ( Input.GetButtonDown ("Fire1") && nextfire == 0) 
				{
					print("single model");
					shooting = true;
						// Buck Shot For Shotguns or etc..
						if (BuckShot && clipcount > 0 ){
							for (var i : int =0 ; i < Bucks; i++){
								BuckFire();
							}
							Fire ();
						}
						else{
							Fire ();
						}
					// wait for next fire
					nextfire = 1;
				}
				//Define Mode
				modeIn = "Single";
		}
		//Fire auto
		switch (Mode) {
			case (gunTypes.auto):
				if ( Input.GetButton ("Fire1")) {
					print("auto model");
					if(Time.time > nextfire){
						// Buck Shot For Shotguns or etc..
						if (BuckShot && clipcount > 0 ){
							for ( var c : int =0 ; c < Bucks; c++){
								BuckFire();
							}
							Fire ();
							shooting = true;
							nextfire = Time.time + srate; 
						}
						else{
							Fire ();
							shooting = true;
							nextfire = Time.time + srate; 
						}
					}
				}
			//Define Mode
			modeIn = "Auto";
		}
		// 3Rou Burst
		switch (Mode) {
			case (gunTypes.burst):
				if (Input.GetButtonDown ("Fire1")  && !bursting){
					if( nextfire == 0){
						shooting = true; 
						Burst();
					}
				}
				//Define Mode
				modeIn = "Burst";
			}
		
		//Reload
		if (Input.GetButtonUp ("Reload")){
			// check t see if we are reloading then relaod
			if (!reloading)
			Reload ();
		}
	}
		
		// Shooting Cheks
		if (!shooting) 
		{	
			if (actualSpread > 0.0){
				actualSpread -= spreadRate * Time.deltaTime * 50;
			}
			if (actualSpread < 0.0){
				actualSpread = 0.0;
			}
			
			if (coildown){
				var rate : float = recoilRate;
					if(recoilRate > .5){
						rate = recoilRate/2;
					}
				mcra.GetComponent("MouseLook").rotationY -= (rate)  * Time.deltaTime * 5;
			}
			
			// Chek if we switched While not shooting
			if(CanSwitch && Input.GetKeyDown("x")){
				ModeSwitch();
			}
		}
	
		if (shooting && !reloading)
		{
			if (actualSpread < maxSpread){
				actualSpread += spreadRate * Time.deltaTime * 5;
			}
			if (actualSpread > maxSpread){
				actualSpread = maxSpread;
			}
			
			// Aiming
			if (Input.GetButton ("Sights")){
				//Aiming = true;
				actualSpread = actualSpread/2;
				recoilRate = recoilMod;
			}

			if (Input.GetButton ("Crouch")){
				actualSpread +=.001;
				recoilRate = recoilMod;
			}
			
			//Recoil 
			recoilRate = setRecoil;
			mcra.GetComponent("MouseLook").rotationY += recoilRate  * Time.deltaTime * 20;
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
	
	if(Mode == gunTypes.auto){
		if(Input.GetButtonUp("Fire1")){
			CoolDown ();
		}
	}
}
function ModeSwitch () {
	if(i + 1 <= Modes.length -1){
				i++;
	}
	else if(i + 1 > Modes.length -1){
				i = 0;
	}
	Mode = Modes[i];
}
// Burst Anf Fireing Functions Are andled Below///////////////////////////////////////
function Burst () {
	bursting = true;
	for(var bur : int = 0; bur < 3; bur++){
		Fire ();
		yield WaitForSeconds (srate);
	}
	yield WaitForSeconds (.1);
	bursting = false;
}
// Fire
function Fire (){	
	var direction = Spread ();
	var hit : RaycastHit; 
	
	if (clipcount > 0 ){
		// Did we hit
		if (Physics.Raycast (transform.position, direction, hit, range))
		{	
			Debug.DrawLine (transform.position, hit.point, Color.blue);
			hit.collider.SendMessageUpwards("ApplyDamage", Damage, SendMessageOptions.DontRequireReceiver);
		
			// Apply hit to Rigid Body
			if (hit.rigidbody ){ 
					hit.rigidbody.AddForceAtPosition(force * direction , hit.point);
				}
			//Bullet Hole && Smoke
			if (hit.collider.transform.CompareTag ("Level")) {
				var rotation =  Quaternion.FromToRotation(Vector3.up, hit.normal);
	
				if (BulletHole){
					var BulletHole : GameObject = Instantiate(BulletHole, hit.point , rotation);
					//Bullet Hole Stick Onto Object
					BulletHole.transform.parent = hit.collider.transform;
				}
				if (Smoke){
					var Smoke: GameObject = Instantiate (Smoke, hit.point , rotation);
				}
			}
			// Spawn Particles: Sparks			
			if (!hit.collider.transform.CompareTag ("Enemy")){
				var Spark: GameObject = Instantiate (Spark, hit.point, transform.rotation);
			}
		}
			
		// Spawn  Bullet Casing 
		if (Casing){
			var Housing : Rigidbody;
			Housing = Instantiate (Casing, CasingSpawn.transform.position, CasingSpawn.transform.rotation);
			Housing.velocity  = transform.TransformDirection (Vector3.right * 5);
			Housing.AddForce ( Vector3(Random.Range(.4, .6), Random.Range(-.6, .4), Random.Range(-.4, -.6)));
		}
		
		//////////////////////////////////////////////////////////////////////////////Kick Etc..
		
			KickBack ();
			// Enable Muzzle
			m_FrameShot = Time.frameCount;
		
			//Play sound
			GetComponent.<AudioSource>().PlayOneShot(Ssound);
			// Minus shot	
			clipcount --;
			
			
		if(Mode == gunTypes.single || Mode == gunTypes.burst){
			Muzzle.enabled =true;
			CoolDown ();
		}
	}
	
 else  
	{
		shooting = false;
		// Check that we are not reloading then reload
		if (!reloading)
		{
			GetComponent.<AudioSource>().PlayOneShot (Dsound);
			if (GetComponent.<AudioSource>()){
				GetComponent.<AudioSource>().loop = false;
			}
			Reload();
		}
	}
}
//Buc Shots
function BuckFire ()
{
	var directionx = BuckSpread ();
	var hitx : RaycastHit; 
		// Did we hit
		if (Physics.Raycast (transform.position, directionx, hitx, range)){
		
			Debug.DrawLine (transform.position, hitx.point, Color.blue);
			hitx.collider.SendMessageUpwards("ApplyDamage", Damage/2, SendMessageOptions.DontRequireReceiver);
		
			// Apply hit to Rigid Body
			if (hitx.rigidbody ){ 
					hitx.rigidbody.AddForceAtPosition(force * directionx, hitx.point);
			}
			//Bullet Hole && Smoke
			if (hitx.collider.transform.CompareTag ("Level")) {
				var rotation =  Quaternion.FromToRotation(Vector3.up, hitx.normal);
	
				if (BulletHole){
					var BulletHole : GameObject = Instantiate(BulletHole, hitx.point , rotation);
					//Bullet Hole Stick Onto Object
					BulletHole.transform.parent = hitx.collider.transform;
				}
				if (Smoke){
					var Smoke: GameObject = Instantiate (Smoke, hitx.point , rotation);
				}
			}
			// Spawn Particles: Sparks			
			if (!hitx.collider.transform.CompareTag ("Enemy")){
				var Spark: GameObject = Instantiate (Spark, hitx.point, transform.rotation);
			}
		}
}

// ALlow ther weapons to cool down to prevent spamming 
function CoolDown ()
{	
	switch (Mode) {
			case (gunTypes.auto):
				if (!Input.GetButton("Fire1") && !reloading)
				{
					//coildown = true;
					yield WaitForSeconds (.05);
					shooting = false;
					coildown = true;
				}
			case (gunTypes.single):
				//coildown =true;
				yield WaitForSeconds (.1);
				coildown = true;
				shooting = false;
					if (nextfire !=0){ 
						yield WaitForSeconds (srate);
						nextfire = 0;
					}
			case (gunTypes.burst):
				
				yield WaitForSeconds (.1);
				coildown = true;
				shooting = false;
					if (nextfire !=0){ 
						yield WaitForSeconds (srate);
						nextfire = 0;
					}
	}
	yield WaitForSeconds (.2);
	coildown =false;
}
// Lets reload////////////////////////////////////////
function Reload ()
{	
	if (clips > 0 && !reloading)
	{
		//Set clip to 0
		clipcount = 0;
		// Stop player from Rereloading Consecutivly 
		reloading = true;
		shooting = false;
		
		//Play Sound Only if Gun is active
		if(gunActive){
			GetComponent.<AudioSource>().PlayOneShot (Rsound);
			if (GetComponent.<AudioSource>())
				GetComponent.<AudioSource>().loop = false;
		}
		yield WaitForSeconds (rrate);
		if(!NeverEmpty){
			clips --; 
		}
		clipcount = count;
		reloading = false;
		
		//Allow Single Fire
		if(Mode == gunTypes.single){
			nextfire = 0;
		}
	}
	else 
	{
		if(gunActive){
			// xrl因为会报错，所以先注释这3行;
			//GetComponent.<AudioSource>().PlayOneShot (Dsound);		
			//if (GetComponent.<AudioSource>())
			//	GetComponent.<AudioSource>().loop = false;
		}
		reloading = false;	
		// Allow Single Fire
		if(Mode == gunTypes.single){
			nextfire = 0;
		}		
	}	
}
// Kick back simulation done by coding
function KickBack (){
	//transform.Translate(0,0, - KickAmount/4 * Time.deltaTime , Space.Self);
	transform.localPosition.z -= KickAmount  * Time.deltaTime ;
	
	//Rotation kick
	transform.rotation = Quaternion.Slerp(transform.rotation,recoilRot,Time.deltaTime);
	// Bring Back
	yield WaitForSeconds(.1);
	KickTO();
}
function KickTO (){
	if(Mode ==gunTypes.single){
		transform.Translate(0,0,KickAmount/4 * Time.deltaTime, Space.Self);
	}
	else
	transform.localPosition.z += KickAmount/2 * Time.deltaTime;
	transform.rotation = Quaternion.Slerp(transform.rotation,originalRot,Time.deltaTime);
}
/////////////////////////////////////////////////Spreads//////////////////////////////////////
function Spread (){
	vx = (1-2* Random.value) * actualSpread;
	vy = (1-2* Random.value) * actualSpread;
	vz = 1;
	return mcra.GetComponent.<Camera>().transform.TransformDirection(Vector3(vx,vy,vz));
}
//Buck Spread
function BuckSpread (){
	var vx = (1-2* Random.value) * .1;
	var vy = (1-2 * Random.value) * .1;
	var vz = 1;
	return mcra.GetComponent.<Camera>().transform.TransformDirection(Vector3(vx,vy,vz));
}
/////////////////////////////////////////////Wep Selects//////////////////////////////////////
function selectWeapon () 
{	
	gunActive =false;
	Poser.enabled = true;
	
	var Guns = GetComponentsInChildren(Renderer);
	yield WaitForSeconds (.2);
	for( var Gun : Renderer in Guns)
	{
		if (Gun.name != "Muzzle")
		Gun.enabled=true;
	}
	gunActive=true;
}

function deselectWeapon () 
{
	gunActive=false;
	Poser.enabled = false;
	yield WaitForSeconds (.15);
	var Guns = GetComponentsInChildren(Renderer);
	for( var Gun : Renderer in Guns)
	{
		Gun.enabled=false;
	}
}
//Pause functions 
function Paused(){
	gunActive = false;
}
function UnPause (){
	gunActive = true;
}
	

function OnGUI ()
{
	if (gunActive)
	{
		GUI.Box(Rect(Screen.width - 190, Screen.height -65, 100, 20), GUIContent ("Ammo: " +clipcount+"~"+ clips));
		GUI.Box(Rect(50, Screen.height -30, 100, 20), GUIContent ("Arm:  " + Name));
		GUI.Box(Rect(Screen.width - 190, Screen.height - 45, 100, 20), GUIContent ("Mode:  " +  modeIn));
	}
}