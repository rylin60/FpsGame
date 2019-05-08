//Main Pause Var
@System.NonSerialized
public var paused : boolean = false;
//Private Vars
private var wasLocked = false;
var weaponHolder : GameObject;

function Start (){
	// Find Player
	if(weaponHolder == null){
		//weaponHolder = gameObject.FindWithTag("Weapon Holder");
	}
	// Start out in paused mode in web player
	if (Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer){
		SetPause(true);
	}else{
		SetPause(false);
		Screen.lockCursor = true;
	}
}

function OnApplicationQuit (){
	Time.timeScale = 1;
}

function SetPause (pause : boolean){
	Input.ResetInputAxes();
	var gos : Object[] = FindObjectsOfType(GameObject);
	for (var go : GameObject in gos)
		go.SendMessage("DidPause", pause, SendMessageOptions.DontRequireReceiver);
	
	transform.position = Vector3.zero;
	
	if (pause){
		// Disable Weapons
		weaponHolder.SendMessage("pauseWeapon", SendMessageOptions.DontRequireReceiver);
		Time.timeScale = 0;
		paused = true;
	}
	else{
		//Enable Weapons
		weaponHolder.SendMessage("unpauseWeapon", SendMessageOptions.DontRequireReceiver);
		Time.timeScale = 1;
		paused = false;
	}
}

function DidPause (pause : boolean){
	if (pause){
		wasLocked = false;
	}
	else{
		wasLocked = true;
	}
}

function Update (){
	if(paused){
		if (Input.GetKey("escape")){
			print("xlr cancle pause");
			SetPause(false);
			DidPause(false);
		}
		Screen.lockCursor = false;
	}
	
	if(!paused){
		if (Input.GetKey("escape")){
			print("xlr pause");
			SetPause(true);
			DidPause(true);
		}
		Screen.lockCursor = true;
	}
}

function OnGUI (){
	if(!wasLocked){
		Time.timeScale = 0;
		if(GUI.Button(Rect(50, Screen.height -240, 60, 20), GUIContent  ("Menu" ))){
			//
		}
		if(GUI.Button(Rect(50, Screen.height -210, 60, 20), GUIContent  ("Options" ))){
			//
		}
		if(GUI.Button(Rect(50, Screen.height -180, 60, 20), GUIContent  ("Reset" ))){
			//
			Application.LoadLevel (0);
		}
		if(GUI.Button(Rect(50, Screen.height -150, 60, 20), GUIContent  ("Quit" ))){
			//
			Application.Quit();
		}
	}
}