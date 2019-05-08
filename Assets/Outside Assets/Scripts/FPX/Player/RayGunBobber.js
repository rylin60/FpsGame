//////Oriignals///////////////
private var OriginalPos : Vector3;
private var OriginalSpeed : float;
private var OriginalswayRate : float;
private var OriginalYPos : float ;
private var OriginalXPos : float;

var Speed : float = 3;
var FreezeY : boolean = true;
private var maxSpeed : float;
private var currentSpeed : float;
var YPos : float = .02;
var XPos : float = .02;

//////Sway///////////////////////////
private var curVect : Vector3;
private var swayFactor : Vector3;

private var walkSway1 : Vector3;
private var walkSway2 : Vector3;


private var swayTarget : int = 1;
var swayRate : float = .4;
//////////////////////////////////////
private var move : boolean;
private var aiming : boolean;
private var running : boolean;
function Start ()
{
	// Set Positions + Originals//
	OriginalPos = transform.localPosition;
	OriginalSpeed = Speed;
	maxSpeed = OriginalSpeed * 2;
	OriginalswayRate = swayRate;
	OriginalYPos = YPos;
	OriginalXPos = XPos;
	// Set Original Points
	SwayPoints (OriginalXPos,OriginalYPos);
		
}

function Update () 
{
	if (Input.GetButton ("Sights") && !Input.GetButton ("Run")){
	aiming = true;
	running = false;
	YPos = OriginalYPos/2;
	XPos = .015;
	Speed = OriginalSpeed/5;
	}
	
	if (Input.GetButton ("Run") && !Input.GetButton ("Sights")){
	aiming = false;
	running = true;
	YPos = OriginalYPos;
	XPos = OriginalXPos;
	if(move)
	Speed = OriginalSpeed * 2;
	}
	
	if (!Input.GetButton ("Sights") && !Input.GetButton ("Run")){
	aiming = false;
	running = false;
	YPos = OriginalYPos;
	Speed = OriginalSpeed;
	if (move)
		XPos = OriginalXPos;
	}
	///////////////////////////////////////////////////

	horizontal = Input.GetAxis("Horizontal"); 
	vertical = Input.GetAxis("Vertical"); 
	
	 if (Mathf.Abs(horizontal) == 0 && Mathf.Abs(vertical) == 0) {
		XPos = 0;
		if(FreezeY){
			YPos = 0;
		}
		move = false;
		currentSpeed = Speed/2;
	}
	else {
		move = true;
		if (running){
			if (currentSpeed < maxSpeed)
				currentSpeed +=  Speed/2 * Time.deltaTime;
		}
		else{
			currentSpeed = Speed;
		}
	}

	////////////////Sway And BoB/////////////////////			
	if(swayTarget == 1)
	{	
		if (Vector3.Distance(transform.localPosition, walkSway1) >= .01){
			curVect= walkSway1 - transform.localPosition;
			transform.Translate(curVect*Time.deltaTime*swayRate * currentSpeed,Space.Self);
		} else {
			swayTarget = 2;
		}
	} else if(swayTarget == 2) {
		if (Vector3.Distance(transform.localPosition, walkSway2) >= .01){
			curVect= walkSway2 - transform.localPosition;
			transform.Translate(curVect*Time.deltaTime*swayRate * currentSpeed,Space.Self);
		} else {
				swayTarget = 1;
		}
	}
} 

function FixedUpdate ()
{
	SwayPoints (XPos,YPos);
}


function SwayPoints (x: float, y: float) {
	
	walkSway1 = OriginalPos + Vector3 (x,y);
	walkSway2 = OriginalPos - Vector3 (x,y);
	
}
	


