#pragma strict
var playerGun : GameObject;

var fireRateChange : float;
var fireRateMult : float;
var damageChange : int;
var damageMult : float;
var ammoMaxChange : int;

var gs : GunScript;
var plyr : GameObject;

function Start () 
{
	
}

function Update () 
{
	
}

function OnTriggerEnter (other : Collider) 
{
	plyr = GameObject.FindGameObjectWithTag("gun1");
	gs = plyr.gameObject.GetComponent("GunScript");
	
	gs.ammo.ammoCount += 12;
	gs.ammo.ammoCountMax += 12;

	gs.damage.damageAmount += damageChange;

	//gs.stats.isSpread = true;

	//gs.ammo.shotgunPellets = 2;

	Destroy(this.gameObject);
}