
// Crosshair Variables (Ray Okoro)
var crosshair : Texture2D;
//Moving CrossHai
var guiCrosshair : GUITexture;
var GuiPos : Vector3 = Vector3(.5,.5,0);
var guiColor : Color = Color.green;
var Speed : float = .1;
var minguiSize : float = 48;
var maxguiSize : float = 128; 
private var guiSize : float = .1; 
//Possition
private var position : Rect; 
private var moving : boolean = false;

function Start (){
	guiCrosshair.transform.position = GuiPos;
	guiSize = minguiSize;
	guiCrosshair.color = guiColor;
}

// Crosshair Function (RayOkoro)
function Update () {
	guiCrosshair.enabled = true;

	//Enlarge Hair
	if(Input.GetAxis("Horizontal") || Input.GetAxis("Vertical") || Input.GetMouseButton(0)){
		moving = true;
		guiSize = Mathf.SmoothDamp(guiCrosshair.pixelInset.width, maxguiSize,Speed, .1);
	}
	//Shrink Hair
	else if(!Input.GetAxis("Horizontal")|| !Input.GetAxis("Vertical") || !Input.GetMouseButton(0)){
		moving = false;
		if(!moving){
			guiSize = Mathf.SmoothDamp(guiCrosshair.pixelInset.width, minguiSize,Speed, .1);
		}
	}
	
	//Scan for Enemies
	var fwd = transform.TransformDirection(Vector3.forward);
	var hit : RaycastHit; 
	// Did we hit an Enemy
	if (Physics.Raycast (Camera.main.transform.position, fwd, hit, 100)){
		if (hit.collider.transform.CompareTag ("Enemy")){
			guiCrosshair.color = Color.red;
			//GUI.backgroundColor = Color.red;
		}
		else{
			guiCrosshair.color = guiColor;
		}
	}
	else {
		guiCrosshair.color = guiColor;
	}
	
	// Alter The Gui Text
	guiCrosshair.pixelInset.width = guiSize;
	guiCrosshair.pixelInset.height = guiSize;	
	guiCrosshair.pixelInset.x = -(guiSize/2)+8;
	guiCrosshair.pixelInset.y = -(guiSize/2)+8;
}


function OnGUI () {
		// Define Screen Center & guiSize
		var w = crosshair.width/2;
		var h = crosshair.height/2;
		position = Rect((Screen.width - w)/2,(Screen.height - h )/2, w, h);
		//Draw Cross Center
		if (!Input.GetButton ("Sights")) { 
			GUI.DrawTexture(position, crosshair);
		}
		//Gui Based Crosshair
		/* 
			var Guix : float = 1;
			var Guiy : float = 40;
		GUI.Box(Rect((Screen.width/2) - (Guix), (Screen.height/2) - (guiSize/2), Guix, Guiy),"");
		GUI.Box(Rect((Screen.width/2) - (Guix), (Screen.height/2) + (guiSize/2), Guix, Guiy),"");
		
		GUI.Box(Rect((Screen.width/2) - (guiSize/2), (Screen.height/2) - (Guix), Guiy, Guix),"");
		GUI.Box(Rect((Screen.width/2) + (guiSize/2), (Screen.height/2) - (Guix), Guiy, Guix),"");

		*/
	} 
