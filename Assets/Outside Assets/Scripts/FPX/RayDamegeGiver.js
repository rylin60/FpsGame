var Damage : int = 20;
var Power : int = 10;
var Explode : boolean;
var Burn : boolean;

function OnCollisionEnter (Colide : Collision) {
	Colide.collider.SendMessageUpwards("ApplyDamage", Damage, SendMessageOptions.DontRequireReceiver);
	
	if (Explode){
		AreaDamage ();
	}
}

function OnTriggerStay (Colide : Collider) {
	if (Burn){
		if (!Colide == null)
			//yield WaitForSeconds (.05);
			Colide.GetComponent.<Collider>().SendMessageUpwards("ApplyDamage" * Time.deltaTime * 5, Damage/2, SendMessageOptions.DontRequireReceiver);
	}
}

function AreaDamage (){
	var explosionPosition = transform.position; 
	var colliders : Collider[] = Physics.OverlapSphere (explosionPosition, transform.GetComponent.<Collider>().radius); 
    
   for (var hit in colliders) { 
      if (!hit) 
         continue; 
       
      if (hit.GetComponent.<Rigidbody>()) { 
         hit.GetComponent.<Rigidbody>().AddExplosionForce(Power, explosionPosition, transform.GetComponent.<Collider>().radius, 3.0); 
                   
         var closestPoint = hit.GetComponent.<Rigidbody>().ClosestPointOnBounds(explosionPosition); 
         var distance = Vector3.Distance(closestPoint, explosionPosition); 

         // The hit points we apply fall decrease with distance from the hit point 
           var hitPoints = 1.0 - Mathf.Clamp01(distance /  transform.GetComponent.<Collider>().radius);
         hitPoints *= Damage; 

         // Tell the rigidbody or any other script attached to the hit object 
         // how much damage is to be applied! 
         hit.GetComponent.<Rigidbody>().SendMessageUpwards("ApplyDamage", hitPoints, SendMessageOptions.DontRequireReceiver); 
      } 
   } 

}

