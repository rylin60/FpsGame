var massCap : int = 500;
var catchRange = 30.0; 
var holdDistance = 4.0; 
var minForce : int = 0; 
var maxForce : int = 100; 
var forceChargePerSec : int = 5; 
var layerMask : LayerMask = -1;

private var gunActive : boolean = false;

enum GravityGunState { Free, Catch, Occupied, Charge, Release}; 
private var gravityGunState : GravityGunState = 0; 
private var rigid : Rigidbody = null; 
private var currentForce : int = minForce; 


function Start ()
{
	deselectWeapon ();
}

// Try FixedUpdate if errors
function FixedUpdate () {
if (rigid == null)
{
	gravityGunState = GravityGunState.Free;
}
if (gunActive)
{
   if(gravityGunState == GravityGunState.Free) { 
      if(Input.GetButton("Fire1")) { 
         var hit : RaycastHit; 
         if(Physics.Raycast(transform.position, transform.forward, hit, catchRange, layerMask)) { 
            if(hit.rigidbody) {
				if (hit.rigidbody.mass <= massCap)
				{
					rigid = hit.rigidbody; 
					gravityGunState = GravityGunState.Catch; 
                }
            } 
         } 
      } 
   }

    else if(gravityGunState == GravityGunState.Catch) { 
      rigid.MovePosition(transform.position + transform.forward * holdDistance);
	  
		// No Gravity 
		rigid.useGravity = false; 
		
      if(!Input.GetButton("Fire1")) 
         gravityGunState = GravityGunState.Occupied; 
   } 
   
 
   else if(gravityGunState == GravityGunState.Occupied) {
      rigid.MovePosition(transform.position + transform.forward * holdDistance); 
      if(Input.GetButton("Fire1")) 
         gravityGunState = GravityGunState.Charge;
   }
   
		if(gravityGunState == GravityGunState.Charge) { 
      rigid.MovePosition(transform.position + transform.forward * holdDistance); 
      if(currentForce < maxForce) { 
         currentForce += forceChargePerSec * Time.deltaTime;
      } 
      else { 
         currentForce = maxForce; 
      } 
      if(!Input.GetButton("Fire1")) 
         gravityGunState = GravityGunState.Release; 
          
   } 
   else if(gravityGunState == GravityGunState.Release) { 
   
	  rigid.useGravity = true;
      rigid.AddForce(transform.forward * ((currentForce * 100)* 2)); 
	  rigid.AddForce(Vector3.up * 10);
	  
      currentForce = minForce; 
      gravityGunState = GravityGunState.Free; 
       
   } 
} 

else{
	if (gravityGunState == GravityGunState.Free)
	{	
		//rigid.useGravity = true;
		gravityGunState = GravityGunState.Free;
	}
}
}

//Deselect + select Weapon/////////////////////////////////////////////
function selectWeapon () {	
	gunActive=true;
	//Poser.enabled = true;
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
	//Poser.enabled = false;
	///////////////////////
	var gos = GetComponentsInChildren(Renderer);
	for( var go : Renderer in gos){
		go.enabled=false;
	}
}
////////////////////////////////////////////////////////////////////////

function OnGUI (){
	if (gunActive){
		GUI.Box(Rect(50, Screen.height -30, 100, 20), GUIContent ("State: "+ gravityGunState ));
		GUI.Box(Rect(Screen.width - 190, Screen.height -60, (currentForce), 20), GUIContent (""));
	}	
}	


@script ExecuteInEditMode() 