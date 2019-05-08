#pragma strict
#pragma implicit
#pragma downcast 

var layerMask : LayerMask; //make sure we aren't in this layer 
var skinWidth : float = 0.1; //probably doesn't need to be changed 
var antiPalyer : boolean = false;
private var minimumExtent : float; 
private var partialExtent : float; 
private var sqrMinimumExtent : float; 
private var previousPosition : Vector3; 
private var myRigidbody : Rigidbody; 
private var Player : GameObject;
//initialize values 
function Start() { 

   myRigidbody = GetComponent.<Rigidbody>();
   Player = gameObject.FindWithTag ("Player");
   
   previousPosition = myRigidbody.position; 
   minimumExtent = Mathf.Min(Mathf.Min(GetComponent.<Collider>().bounds.extents.x, GetComponent.<Collider>().bounds.extents.y), GetComponent.<Collider>().bounds.extents.z); 
   partialExtent = minimumExtent*(1.0 - skinWidth); 
   sqrMinimumExtent = minimumExtent*minimumExtent; 
   if (antiPalyer){
   Physics.IgnoreCollision(Player.GetComponent.<Collider>(),GetComponent.<Collider>());
   }
} 

function FixedUpdate() { 
   //have we moved more than our minimum extent? 
   if ((previousPosition - myRigidbody.position).sqrMagnitude > sqrMinimumExtent) { 
      var movementThisStep : Vector3 = myRigidbody.position - previousPosition; 
      var movementMagnitude : float = movementThisStep.magnitude; 
      var hitInfo : RaycastHit; 
      //check for obstructions we might have missed 
      if (Physics.Raycast(previousPosition, movementThisStep, hitInfo, movementMagnitude, layerMask.value)) 
         myRigidbody.position = hitInfo.point - (movementThisStep/movementMagnitude)*partialExtent; 
   } 
   previousPosition = myRigidbody.position; 
}

