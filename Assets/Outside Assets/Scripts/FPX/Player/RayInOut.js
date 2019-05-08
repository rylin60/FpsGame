enum enter {Vehicle,Mounted}
var Mode : enter;

private var inVehicle : boolean; 
private var nextToVehicle: boolean;

private var Vehicle : GameObject;
private var Player : GameObject;
var Control : MonoBehaviour; 
var Look : MonoBehaviour;
//var Sound : SoundController;

private var MnCam : Camera;
var VehicleCam : Camera;
var CamListener : AudioListener;

function Start ()
{
	MnCam = GetComponent.<Camera>().main;
	Player = gameObject.FindWithTag ("Player");
	Vehicle = transform.gameObject;
	
	MnCam.GetComponent.<Camera>().enabled = true;
	VehicleCam.GetComponent.<Camera>().enabled= false;
	
	//TurnVehicle Off
	Control.SendMessage ("VehicleOff");
	
}

function Update ()
{
	if (nextToVehicle)
	{
		if (Input.GetButtonDown ("Action")) 
		{
			GetINOut ();
		}
	}
	
	if (inVehicle)
	{
		//Control.SendMessage ("VehicleOn");
		Vehicle.tag = "Player";
		if(Look){
			Look.enabled = true;
		}
		Player.SetActiveRecursively (false);
		//Player.BroadcastMessage("deactivateWeapons", SendMessageOptions.DontRequireReceiver);
		
	}
	
	// 不在车里;
	if (false)//!inVehicle)
	{
		if(Mode == enter.Vehicle){
			var slow = Mathf.Lerp(Vehicle.GetComponent.<Rigidbody>().velocity.z, 0, .01);
			Vehicle.GetComponent.<Rigidbody>().velocity = Vector3(0,Vehicle.GetComponent.<Rigidbody>().velocity.y,slow);
		}
		if(Look){
			Look.enabled = false;
		}
		Vehicle.tag = "Vehicle";
		Control.SendMessage ("VehicleOff");
	}
}

function OnTriggerStay (collide : Collider)
{
	if (collide == Player.GetComponent.<Collider>())
	{
		nextToVehicle = true;
	}
}

function OnTriggerExit (collide : Collider)
{
	if (collide == Player.GetComponent.<Collider>()) 
	{
		nextToVehicle = false;
		//Object.Destroy("AudioSource");
	}
}	

function GetINOut ()
{
	if (!inVehicle)
	{
		inVehicle = true;

		Player.SetActiveRecursively (false);
		//Player.BroadcastMessage("deactivateWeapons", SendMessageOptions.DontRequireReceiver);
		
		Control.SendMessage ("VehicleOn");
		//Vehicle.tag = "Player";
		//Sound.enabled = true;
		
		MnCam.GetComponent.<Camera>().enabled = false;
		VehicleCam.GetComponent.<Camera>().enabled = true;
		VehicleCam.GetComponent(AudioListener).enabled =true; 
		//CamListener.enabled = true;
			
	}
	else 
	{
		inVehicle = false;
		nextToVehicle = false;
		
		MnCam.GetComponent.<Camera>().enabled = true;
		VehicleCam.GetComponent.<Camera>().enabled = false;
		VehicleCam.GetComponent(AudioListener).enabled =false; 
		//CamListener.enabled = false;
		
		Control.SendMessage ("VehicleOff");
		//Vehicle.tag = "Vehicle";
		//Sound.enabled = false;
		
		Player.transform.localPosition = Vehicle.transform.position + Vector3(2,1,0);
		Player.SetActiveRecursively (true);
	
		
	}
}