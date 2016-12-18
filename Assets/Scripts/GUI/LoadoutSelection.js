static var loadoutGUI : boolean = false;
var loadoutGUIPrimary : boolean = false;
var loadoutGUISecondary : boolean = false;
var loadoutGUISidearm : boolean = false;
var loadoutGUITool : boolean = false;
var loadoutInventory : Component;

var playerCharacter: GameObject;
var mainCamera: GameObject;
var weaponCamera: GameObject;

var weaponsCategory : GameObject;
var AK47 : GameObject;
var AA12 : GameObject;
var SNW29 : GameObject;
var Winchester : GameObject;

function Awake () {
	AK47 = GameObject.Find("AK-49");
	AA12 = GameObject.Find("aa-13");
	SNW29 = GameObject.Find("SnW30");
	Winchester = GameObject.Find("winchester repeater1");
	weaponsCategory = GameObject.Find("WeaponCategory");
	
	playerCharacter = GameObject.Find("Player");
	mainCamera = GameObject.Find("Main Camera");
	weaponCamera = GameObject.Find("Weapon Camera");
}

function Start () {
	weaponsCategory.SetActive(false);
}


function Update() {

	if(Input.GetKeyDown("z")) {
		if(PlayerStore.playerStore == false) {
			loadoutGUI = !loadoutGUI;
		}
	}
	
	/*if (loadoutGUI) {
		playerCharacter.GetComponent("CharacterMotor").enabled = false;
		playerCharacter.GetComponent("MouseLook").enabled = false;
		mainCamera.GetComponent("MouseLook").enabled = false;
		weaponCamera.GetComponent("MouseLook").enabled = false;
	}*/
	
	if (!loadoutGUI) {
		playerCharacter.GetComponent("CharacterMotor").enabled = true;
		playerCharacter.GetComponent("MouseLook").enabled = true;
		mainCamera.GetComponent("MouseLook").enabled = true;
		weaponCamera.GetComponent("MouseLook").enabled = true;
	}
}
		
	

function OnGUI() {

	if (loadoutGUI) {
		//Disables character movement
		playerCharacter.GetComponent("CharacterMotor").enabled = false;
		playerCharacter.GetComponent("MouseLook").enabled = false;
		mainCamera.GetComponent("MouseLook").enabled = false;
		weaponCamera.GetComponent("MouseLook").enabled = false;
		
		//Creates initial box
		GUI.Box(Rect(10,10,100,100),"Weapons");
		
		if (GUI.Button(Rect(20,30,80,40),"Primary")) {
			loadoutGUIPrimary = true;
			loadoutGUISecondary = false;
			loadoutGUISidearm = false;
		}
		
		if (GUI.Button(Rect(20,80,80,40),"Secondary")) {
			loadoutGUIPrimary = false;
			loadoutGUISecondary = true;
			loadoutGUISidearm = false;
		}
		
		if (GUI.Button(Rect(20,130,80,40),"Sidearm")) {
			loadoutGUIPrimary = false;
			loadoutGUISecondary = false;
			loadoutGUISidearm = true;
		}
		
		//First normal gun slot
		
		if (loadoutGUIPrimary) {
			GUI.Box(Rect(120,10,100,600),"Primary");
			
			if (PlayerStore.gunsOwned[0] == true) {
				
				if (GUI.Button(Rect(130,30,80,40),"AR")) {
					if (Loadout.loadout[1] != AK47) {
						Loadout.loadout[0].SetActive(false);
						Loadout.loadout[0] = AK47;
						//loadoutGUISecondary = !loadoutGUISecondary;
					}
				}
				
				if (GUI.Button(Rect(210,80,80,40),"Bayonet")) {
					if (Loadout.loadout[0] == AK47) {
						if (Loadout.loadout[0].GetComponent("GunScript").attachments[1] == 1) {
							Loadout.loadout[0].GetComponent("GunScript").attachments[1] = 0;
						}
						else if (Loadout.loadout[0].GetComponent("GunScript").attachments[1] != 1) {
							Loadout.loadout[0].GetComponent("GunScript").attachments[1] = 1;
						}
					}
				}
					
				if (GUI.Button(Rect(210,30,80,40),"Red Dot Sight")) {
					if (Loadout.loadout[0] == AK47) {
						if (Loadout.loadout[0].GetComponent("GunScript").attachments[0] == 1) {
							Loadout.loadout[0].GetComponent("GunScript").attachments[0] =0;
						}						
						else if (Loadout.loadout[0].GetComponent("GunScript").attachments[0] != 1) {
							Loadout.loadout[0].GetComponent("GunScript").attachments[0] = 1;
						}
					}
				}
				
				if (GUI.Button(Rect(210,130,80,40),"Close")) {
					loadoutGUIPrimary = !loadoutGUIPrimary;
				}
			}

			
			if (PlayerStore.gunsOwned[1] == true) {
				if (GUI.Button(Rect(130,80,80,40),"Shotgun")) {
					if (Loadout.loadout[1] != AA12) {
						Loadout.loadout[0].SetActiveRecursively(false);
						Loadout.loadout[0] = AA12;
						loadoutGUIPrimary = !loadoutGUIPrimary;
					}
				}
			}
			
			if (PlayerStore.gunsOwned[3] == true) {
				if (GUI.Button(Rect(130,130,80,40),"Winchester")) {
					if (Loadout.loadout[1] != Winchester) {
						Loadout.loadout[0].SetActiveRecursively(false);
						Loadout.loadout[0] = Winchester;
						loadoutGUIPrimary = !loadoutGUIPrimary;
					}
				}
			}
		}
		
		if (loadoutGUISecondary) {
			GUI.Box(Rect(120,10,100,600),"Secondary");
			
			if (PlayerStore.gunsOwned[0] == true) {
				
				if (GUI.Button(Rect(130,30,80,40),"AR")) {
					if (Loadout.loadout[0] != AK47) {
						Loadout.loadout[1].SetActiveRecursively(false);
						Loadout.loadout[1] = AK47;
						//loadoutGUISecondary = !loadoutGUISecondary;
					}
				}
				
				if (GUI.Button(Rect(210,80,80,40),"Bayonet")) {
					if (Loadout.loadout[1] == AK47) {
						Loadout.loadout[1].GetComponent("GunScript").attachments[1] = 1;
					}
				}
					
				if (GUI.Button(Rect(210,30,80,40),"Red Dot Sight")) {
					if (Loadout.loadout[1] == AK47) {
						Loadout.loadout[1].GetComponent("GunScript").attachments[0] = 1;
					}
				}
				
				if (GUI.Button(Rect(210,130,80,40),"Close")) {
					loadoutGUISecondary = !loadoutGUISecondary;
				}
			}

			
			if (PlayerStore.gunsOwned[1] == true) {
				if (GUI.Button(Rect(130,80,80,40),"Shotgun")) {
					if (Loadout.loadout[0] != AA12) {
						Loadout.loadout[1].SetActiveRecursively(false);
						Loadout.loadout[1] = AA12;
						loadoutGUISecondary = !loadoutGUISecondary;
					}
				}
			}
			
			if (PlayerStore.gunsOwned[3] == true) {
				if (GUI.Button(Rect(130,130,80,40),"Winchester")) {
					if (Loadout.loadout[0] != Winchester) {
						Loadout.loadout[1].SetActiveRecursively(false);
						Loadout.loadout[1] = Winchester;
						loadoutGUISecondary = !loadoutGUISecondary;
					}
				}
			}
		}
		
		if (loadoutGUISidearm) {
			GUI.Box(Rect(120,10,100,600),"Sidearm");
		
			if (PlayerStore.gunsOwned[2] == true) {
				if (GUI.Button(Rect(130,130,80,40),"Revolver")) {
					Loadout.loadout[2] = SNW29;
					loadoutGUISidearm = !loadoutGUISidearm;
				}
			}
		}
	}
}