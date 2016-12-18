public static var loadout = new Array();

var primaryFirst : GameObject;
var primarySecond : GameObject;

var weaponActive : boolean;

var primaryActive : boolean;
var sidearmActive : boolean;
var toolActive : boolean;

@HideInInspector var gs : GunScript;
@HideInInspector var gs2 : GunScript;

function Awake()
{
	loadout[0] = primaryFirst;
	loadout[1] = primarySecond;
	
	weaponActive = true;
	primaryActive = true;
	
}

function Start()
{
	loadout[0].SetActive(true);
	loadout[1].SetActive(false);
}

function Update() 
{		
	if (Input.GetKeyDown("1")) {
		if (primaryActive) {
			if (weaponActive == false) {
				
				loadout[0].SetActive(true);
				loadout[1].SetActive(false);
				
				gs = loadout[0].gameObject.GetComponent("GunScript");
				
				if (gs.rlding) {
					if (gs.rldingFromEmpty) {
						gs.rldTimer = gs.animClip.animRldEmpty.length;
					} if (!gs.rldingFromEmpty) {
						gs.rldTimer = gs.animClip.animRld.length;
					}
				}
			
				if (!gs.equipped) {
				    gs.animationComp.Play(gs.animClip.animEquipFirst.name);
					gs.equipped = true;
					gs.equipTimer = gs.animClip.animEquipFirst.length;
				}
				if (gs.equipped ) {
				    gs.animationComp.Play(gs.animClip.animEquip.name);
					gs.equipTimer = gs.animClip.animEquip.length;
				}
			}
			if (weaponActive == true) {
			
				loadout[0].SetActive(false);
				loadout[1].SetActive(true);
				
				gs2 = loadout[1].gameObject.GetComponent("GunScript");
				
				if (gs2.rlding) {
					if (gs2.rldingFromEmpty) {
						gs2.rldTimer = gs2.animClip.animRldEmpty.length;
					} if (!gs2.rldingFromEmpty) {
						gs2.rldTimer = gs2.animClip.animRld.length;
					}
				}
			
				if (!gs2.equipped) {
					gs2.animationComp.Play(gs2.animClip.animEquipFirst.name);
					gs2.equipped = true;
					gs2.equipTimer = gs2.animClip.animEquipFirst.length;
				}
				if (gs2.equipped) {
				    gs2.animationComp.Play(gs2.animClip.animEquip.name);
					gs2.equipTimer = gs2.animClip.animEquip.length;
				}
			}
			
			weaponActive = !weaponActive;
		}
					
		else if (!primaryActive) {
			primaryActive = true;
			sidearmActive = false;
			toolActive = false;
		}
	}	
}
