public static var primaryTokens = 4;
public static var sidearmTokens = 1;
public static var toolTokens = 0;

public static var gunsOwned : boolean[] = new boolean[4];
public static var playerStore : boolean = false;

var loadoutGUIPrimary : boolean = false;
var loadoutGUISidearm : boolean = false;
var loadoutGUITool : boolean = false;

var playerCharacter: GameObject;
var mainCamera: GameObject;
var weaponCamera: GameObject;


function Awake() {
	for (var i = 0; i < gunsOwned.length; i++) {
		gunsOwned[i] = false;
	}
	
	playerCharacter = GameObject.Find("Player");
	mainCamera = GameObject.Find("Main Camera");
	weaponCamera = GameObject.Find("Weapon Camera");
}

function OnGUI(){

	if (playerStore) {
	
		//Disables character movement
		playerCharacter.GetComponent("CharacterMotor").enabled = false;
		playerCharacter.GetComponent("MouseLook").enabled = false;
		mainCamera.GetComponent("MouseLook").enabled = false;
		weaponCamera.GetComponent("MouseLook").enabled = false;
		
		//Creates initial box
		GUI.Box(Rect(10,10,100,100),"Weapons");
		
		if (GUI.Button(Rect(20,30,80,40),"Primary")) {
			loadoutGUIPrimary = true;
			loadoutGUISidearm = false;
			
		}
		
		if (GUI.Button(Rect(20,80,80,40),"Sidearm")) {
			loadoutGUISidearm = true;
			loadoutGUIPrimary = false;
		}
		
		if (loadoutGUIPrimary) {
			GUI.Box(Rect(120,10,100,600),"Primary");
			
			//AK-47
			if (PlayerStore.gunsOwned[0] == false) {
				if (GUI.Button(Rect(130,30,80,40),"AR")) {
					if (primaryTokens > 0) {
						gunsOwned[0] = true;
						loadoutGUIPrimary = !loadoutGUIPrimary;
						primaryTokens--;
					}
				}
			}
			
			//AA-12
			if (PlayerStore.gunsOwned[1] == false) {
				if (GUI.Button(Rect(130,80,80,40),"Shotgun")) {
					if (primaryTokens > 0) {
						gunsOwned[1] = true;
						loadoutGUIPrimary = !loadoutGUIPrimary;
						primaryTokens--;
					}
				}
			}
			
			if (PlayerStore.gunsOwned[3] == false) {
				if (GUI.Button(Rect(130,130,80,40),"Winchester")) {
					if (primaryTokens > 0) {
						gunsOwned[3] = true;
						loadoutGUIPrimary = !loadoutGUIPrimary;
						primaryTokens--;
					}
				}
			}
		}
		
		if (loadoutGUISidearm) {
		
			//Smith And Wesson Model 29
			if (PlayerStore.gunsOwned[2] == false) {
				if (GUI.Button(Rect(130,130,80,40),"Revolver")) {
					if (sidearmTokens > 0) {	
						gunsOwned[2] = true;
						loadoutGUISidearm = !loadoutGUISidearm;
						sidearmTokens--;
					}
				}
			}
		}
	}
	
	GUI.Label(Rect(50,450,50,50),"" + primaryTokens);
	GUI.Label(Rect(100,450,50,50),"" + sidearmTokens);
   
}

function Update() {
	if(Input.GetKeyDown("x")) {
		if(LoadoutSelection.loadoutGUI == false) {
			playerStore = !playerStore;
		}
	}
}