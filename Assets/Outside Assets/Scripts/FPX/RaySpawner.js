var Objects : GameObject[];
//Self Spawn N Position
var SelfSpawn : boolean = false;
var maxDistance :float= 5;
var maxHeight : float = 0;

//Variables
var MaxSpawn : int = 50;
var Wait : float = 1;


//Private Vars
private var currSpawn : int = 0;
private var Spawning : boolean = false;
private var m : int = 0;

function Start (){
	//currSpawn = 0;
}

function Update () {
	//Gather Spawns
	//spawned[0] = gameObject.FindWithTag("Enemy");
	//currSpawn = spawned.length;
	for(var i : int = 0; i < 100; i++){
		if(currSpawn < MaxSpawn){
			if(!Spawning){
				Spawn();
			}
		}
	}
}

function Spawn(){
	Spawning = true;
	//Choose Object
	m = Random.Range(0,Objects.length);
	//Choose Position
	if(!SelfSpawn){
		
		var X = Random.Range(-maxDistance,maxDistance);
		var Y =	Random.Range(0,maxHeight);
		var Z = Vector3(X,Y,X);
	}
	else if (SelfSpawn){
		Z = Vector3.zero;
	}
	
	//Instantiate Objects
	 var I = Instantiate (Objects[m], transform.position + Z, transform.rotation);

	currSpawn++;
	yield WaitForSeconds (Wait);
	Spawning = false;
}