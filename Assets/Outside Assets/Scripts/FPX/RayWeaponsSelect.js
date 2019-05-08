//
public var Weapons : GameObject[];
public var GunKey : KeyCode[];
var StartGun : int = 0;
var Transition : float;
var sSounds : AudioClip; 

//Private Vars
private var selecting : boolean;
private var numWeapons : int;
private var currentWeapon : int;
private var X : int;


function Start (){
	numWeapons = Weapons.length;
	//deactivateWeapons();
	// Select Start Weapon 
	Select(StartGun);
	currentWeapon = StartGun;
	gameObject.AddComponent.<AudioSource>();	
}

//GetKey From User
function Update (){
	if(!selecting){
		// ScrollWheel UP
		if (Input.GetAxis("Mouse ScrollWheel") > 0){
			if (currentWeapon + 1 <= numWeapons - 1){
				X = currentWeapon+1;
			}
			else if (currentWeapon + 1 > numWeapons - 1){
				X = 0;
			}
			Select (X);
			currentWeapon = X;	
		}
		// ScrollWheel Down
		if (Input.GetAxis("Mouse ScrollWheel") < 0){
			if (currentWeapon - 1 >= 0){
				X = currentWeapon - 1;
			}
			else if (currentWeapon - 1 < 0){
				X = numWeapons -1;
			}	
			else if (currentWeapon - 1 == 0){
				X = 0;
			}
			Select (X);
			currentWeapon = X;	
		}
		// Numeral Input. Scans For keyCode Input
		for (var n : int = 0; n < numWeapons; n++){
			if (Input.GetKeyDown(GunKey[n])){
				X = n;
				if(currentWeapon != X){
					Select (X);
					currentWeapon = X;
				}
			}
		}
		
		
		//////////////////Position Animation///////////////////
		if (transform.localPosition.y != 0){
			newPosY = Mathf.SmoothDamp(transform.localPosition.y, 0, Transition, .1);
			transform.localPosition.y = newPosY;
		}
	}
	else if(selecting){
		/////////Movemet Down
		newPosY = Mathf.SmoothDamp(transform.localPosition.y, -.2, Transition, .1);
		transform.localPosition.y = newPosY;
	}
	
	// Wall checker
	var fwd = transform.TransformDirection(Vector3.forward);
	var hit : RaycastHit; 
	// Did we hit a wall etc
	if (Physics.Raycast (transform.position, fwd, hit, 1)){
		if (hit.collider.transform.CompareTag ("Level") && !selecting){
			transform.localEulerAngles.x = -50.0;
			transform.localPosition.z = 0.1;
		}
	}
	else {
		transform.localEulerAngles.x = 0.0;
		transform.localPosition.z = .21;
	}
}

//Select Weapons
function Select (index : int){ 
	selecting = true;
	for (var i : int=0 ;i<numWeapons; i++){
		if (i == index){
			yield WaitForSeconds (Transition * 4);
			Weapons[i].SendMessage("selectWeapon");
		}
		else {
			yield WaitForSeconds (Transition * 4);
			Weapons[i].SendMessage("deselectWeapon");
		}
	}
	//Play Sound:
	GetComponent.<AudioSource>().PlayOneShot(sSounds);
	yield WaitForSeconds (.2);
	selecting = false;
}

//Deactivate Weapons
function deactivateWeapons(){
	for (var i : int=0 ;i<numWeapons; i++){
		Weapons[i].SendMessage("deselectWeapon");
	}	
}

//For Puase
function pauseWeapon(){
		Weapons[currentWeapon].SendMessage("Paused",SendMessageOptions.DontRequireReceiver);
}

function unpauseWeapon(){
		Weapons[currentWeapon].SendMessage("UnPause",SendMessageOptions.DontRequireReceiver);
}


function OnGUI (){
	//
}
