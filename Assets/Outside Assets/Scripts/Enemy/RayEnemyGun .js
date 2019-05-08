var attackRange = 30.0;
var shootAngleDistance = 10.0;
var Damage : float = 10.0;

var target : Transform;
var ShootPoint : GameObject;
var NoGravity : boolean = false;

var Bullet : Rigidbody; 
var Shot : AudioClip;


private var Shooting : boolean = false;
private var HeightZ : float = 5;

function Start () {
	if (target == null && GameObject.FindWithTag("Player"))
		target = GameObject.FindWithTag("Player").transform;
		HeightZ = transform.localPosition.y; 
		//gameObject.AddComponent("AudioSource");
}

function Update () {
	if (NoGravity)
	{
		transform.GetComponent.<Rigidbody>().useGravity = false; /// xrl没有重力;
		transform.localPosition.y = Mathf.Lerp (transform.localPosition.y, HeightZ, Time.deltaTime * .2);
	}
	if (transform.localPosition.y >= HeightZ){
		transform.localPosition += Mathf.Sin(Time.deltaTime * .5) * Vector3.up * 0.05;
	}
		
	
	if (!CanSeeTarget ())
	{
		return;
	}
		
	
	// Rotate towards target	
	var targetPoint = target.position;
	var targetRotation = Quaternion.LookRotation (targetPoint - transform.position, Vector3.up);
	transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * 15.0);
	
	//Move towards target
	transform.position = Vector3.Lerp (transform.position, target.transform.position + Vector3(.5,0,.5), Time.deltaTime * .5);

	// If we are almost rotated towards target - fire one clip of ammo
	var forward = transform.TransformDirection(Vector3.forward);
	var targetDir = target.position - transform.position;
	if (Vector3.Angle(forward, targetDir) < shootAngleDistance)
		
		if (!Shooting)
		{
			Shoot ();
			//ShootProjectile();
		}
}

function CanSeeTarget () : boolean
{
	if (Vector3.Distance(transform.position, target.position) > attackRange)
		return false;
		
	var hit : RaycastHit;
	if (Physics.Linecast (transform.position, target.position, hit))
		return hit.transform == target;

	return false;
}

function Shoot (){
	Shooting = true;
	//Projectile
	var Shots : Rigidbody =  Instantiate (Bullet, ShootPoint.transform.position, target.rotation); 
	Shots.velocity = transform.TransformDirection(Vector3.forward * 40);
	//Shots.velocity = Spread();
	
	////////RayCast/////////
	var direction = Spread (); 
	var hit : RaycastHit; 
	GetComponent.<AudioSource>().PlayOneShot (Shot);
	// Did we hit
	if (Physics.Raycast (transform.position, direction, hit, attackRange * 2))
	{	
		//Debug.DrawLine (transform.position, hit.point, Color.blue);
		hit.collider.SendMessageUpwards("ApplyDamage", Damage, SendMessageOptions.DontRequireReceiver);
		// Apply hit to Rigid Body
		if (hit.rigidbody ){ 
			hit.rigidbody.AddForceAtPosition(250 * direction , hit.point);
		}
	}
	yield WaitForSeconds (.15);
	Shooting = false;
}

function ShootProjectile (){
	var vx = (1 - 2 * Random.value) * .08;
	Shooting = true;
	//audio.PlayOneShot (Shot);
	var Shot : Rigidbody =  Instantiate (Bullet, transform.position, target.rotation); 
	Shot.velocity = transform.TransformDirection(Vector3(Random.Range(-vx,vx),0,1) * 35);
	yield WaitForSeconds (.15);
	Shooting = false;
	
}
function Spread ()
{
	var vx = (1 - 2 * Random.value) * .2;
	var vy = (1 - 2 * Random.value) * .2;
	var vz = 1.0;
	return ShootPoint.transform.TransformDirection(Vector3(vx,vy,vz));

}