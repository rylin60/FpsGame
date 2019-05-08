private var self : Rigidbody;
var Target : Transform;
var Damage : int = 1;
var Range : int = 50;
//Effects
var Flash : boolean = true;
private var rend : Renderer;
private var origColor : Color;
var FlashColor : Color;

//Movement & Rotation Variables
var Speed : float = 5;
private var Rot : Quaternion; 
private var NextPos : Vector3;
private var OnMove : boolean = false;

//---------------------------------------------------------------------------------//
function Awake (){
	// Find Self

		rend = gameObject.GetComponent.<Renderer>();
		origColor = rend.material.color;		
	
	if(!Target){
		Target = GameObject.FindWithTag("Player").transform;
	}
}
//---------------------------------------------------------------------------------//
function Update () {
	// Make Sure We are Always Facing Proper/ And Not Flying
		
	// If we don't see the Player (Patrol/Move)-------
	if(!CanSeeTarget()){
		transform.eulerAngles.x = 1;
		//Restore color
		if(Flash){
			rend.material.color = origColor;
		}
		
		if(!OnMove){
			Patrol();
		}
		
		//Rotate
		Rot = Quaternion.LookRotation(NextPos - transform.position,Vector3.up);
		transform.rotation = Quaternion.Slerp(transform.rotation,Rot,Time.deltaTime * 1);
		//Move
		var hitz : RaycastHit;
		var fwd = Vector3.forward;
		
		if(Physics.Raycast(transform.position,fwd,hitz,20)){ 
			if(hitz.collider.gameObject.tag != "Player"){
				NextPos = - NextPos;
				//Patrol();
			}
		}
		transform.Translate(Vector3(0,0,5) * Time.deltaTime * Speed);
	}
	
	// We Do see the Player------------------------------
	else if(CanSeeTarget()){
		//Flash
		if(Flash){
			var lerp : float = Mathf.PingPong (Time.time, .5 / .5);
			rend.material.color = Color.Lerp (origColor, FlashColor, lerp);
		}
		// For Facing
		NextPos = Target.position;
		
		//RotateTowards
		Rot = Quaternion.LookRotation(Target.position - transform.position,Vector3.up);
		transform.rotation = Quaternion.Slerp(transform.rotation, Rot,Time.deltaTime * 5);
		//Move Towards
		transform.Translate(Vector3(0,0,5) * Time.deltaTime * Speed);
	}
}
//---------------------------------------------------------------------------------//
function CanSeeTarget () : boolean{

	// If we are Too Far
	if(Vector3.Distance(Target.position, transform.position) > Range){
		return false;
	}
	// If we are close Check, Also see if there are objects
	else{
		//Cast For Objects
		var hit : RaycastHit;
		if(Physics.Linecast(transform.position,Target.position,hit)){ 
			if(hit.collider.gameObject.tag != "Player"){
				Patrol();
				
				return false;
			}
			else{
				NextPos = Target.position;
				return true;
			}
		}
	}
}

//Collision With Object------------------------------------------------------------//
function OnCollisionEnter (colide : Collision){
	/// xrl发生碰撞;
	if(colide.gameObject.tag == "Player"){
		for(var i : int = 0; i < 5; i ++){
			Target.SendMessageUpwards("ApplyDamage", Damage, SendMessageOptions.DontRequireReceiver);
		}
	}else {
		Patrol();
		//NextPos = -NextPos;
	}
}

//Patrol-------------------------------------------------------------------------//
function Patrol (){
		OnMove = true;
	NextPos.x = transform.position.x + Random.Range(-5,5);
	NextPos.z = transform.position.z + Random.Range(-5,5);
	yield WaitForSeconds(Random.Range(5,5));
			OnMove = false;
}