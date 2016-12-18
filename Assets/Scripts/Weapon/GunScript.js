//The basic variables.
public class stats 
{
	var range = 500.0; //Maximum raycast distance
	var fireRate = 0.5; //Minimum time (in seconds) between shots
	var isAutomatic : boolean = false; //Does the gun fire continuously (true) or on each trigger pull (false)
	var isSpread : boolean = false; // Is the gun a shotgun (true) or not (false)
	var isSingleLoad : boolean = false; // Does the gun load a single bullet at a time (true) or a whole magazine (false)
	var shotsFired : int = 1; //Number of shots fired; more than 1 = burst fire.
	@HideInInspector var reloadTime : float; //Amount of time you are unable to do certain actions while reloading. Counts down while reloading
	@HideInInspector var reloadTimeEmpty : float;  //Same as above, but when magazine is empty
	@HideInInspector var equipTime : float; //Actual time-after-equip-until-player-can-fire timer
	@HideInInspector var equipTimeFirst  : float; //Same as above, but when equipping weapon for the first time
}

//Perk-related variables (reload speed, etc) CURRENTLY UNUSED
public class mult 
{
	var dmgMult : float;
	var defaultDamageMult : float = 1;
	var reloadMult : float;
	var defaultReloadMult : float = 1;
	var aimModified : boolean;
	var sightAimMult : float;
	var defaultSightAimMult : float = 1;
	var hipModified : boolean;
	var hipAimMult : float;
	var defaultHipAimMult : float = 1;
}

//The raycast spread calculation variables
//Amnt: Container for the current spread amount for calc; higher = more spread
//Max: Maximum possible spread value
//Min: Minimum possible spread value
//Inc: Amount that the spread values increment on each call of spreadcalc; higher = faster transition between low and high spread
public class spread 
{
	var spreadAmnt = 1.00;
	var spreadAmntMax = 1.00;
	@HideInInspector var defaultSpreadAmntMax : float;
	var spreadAmntMin = 1.00;
	@HideInInspector var defaultSpreadAmntMin : float;
	var spreadAmntInc = 1.00;

	var spreadAmntAim = 1.00;
	var spreadAmntAimMax = 1.00;
	@HideInInspector var defaultSpreadAmntAimMax : float;
	var spreadAmntAimMin = 1.00;
	@HideInInspector var defaultSpreadAmntAimMin : float;
	var spreadAmntAimInc = 1.00;
}

//Ammo-related variables, such as clip and reserve, and amount of pellets in shotgun blast.
public class ammo 
{
	var ammoCount = 30; // Ammo in clip currently
	var ammoReserve = 300; // Ammo in reserve currently
	var ammoCountMax = 30; // Maximum clip capacity
	var ammoReserveMax = 300; // Maximum reserve capacity
	var shotgunPellets = 6; // Number of raycasts when using isSpread
}

//Damage of the weapon (amount) and which weapon it is (type)
public class damage 
{
	var damageAmount : int = 1;
	//var damageGun : int = 0;
}

//Class that determines the values for aiming down the sights
//Position: The actual location
//Rotation: How the gun is rotated at the relevant position
//Quaternion: I hate quaternions. Storage for lerping.
//FOV: Camera FOV when in this aim profile; larger for hip/sprint, smaller for aim
//Hip: Resting idle position
//Aim: Where the gun is when it aims
//Sprint: Where the gun is when you sprint

public class aim 
{
	var hipPosition : Vector3;
	var hipRotation : Vector3;
	@HideInInspector var hipQuaternion : Quaternion;
	var hipFOV : float;

	var aimPosition : Vector3;
	var aimRotation : Vector3;
	@HideInInspector var aimQuaternion : Quaternion;
	var aimingFOV : float;
	@HideInInspector var defaultAimingFOV : float;
	var aimSpeed : float;

	var sprintPosition : Vector3;
	var sprintRotation : Vector3;
	@HideInInspector var sprintQuaternion : Quaternion;
	var sprintingFOV : float;
	@HideInInspector var defaultSprintingFOV : float;
	var sprintSpeed : float;
	
	var cameraFOV : float; //The current FOV of the "Main Camera" object
}

//Animation selection
public class animClip 
{
	var animFire : AnimationClip;
	var animEquip : AnimationClip;
	var animEquipFirst : AnimationClip;
	var animReload : AnimationClip;
	var animReloadEmpty : AnimationClip;
}

//The list of gun attachments. Nomenclature works like this:
//Name: The actual attachment object on the gun
//Tag: The string which determines what stat to modify
//Mult: The actual number to apply as a modifier
//Attached: If the attachment is on
//CURRENTLY UNUSED

public class attachments 
{
	var underBarrel : GameObject;
	var underBarrelTag : String;
	var underBarrelMult : float;
	var underBarrelAttached : boolean;
	var accessory : GameObject;
	var accessoryTag : String;
	var accessoryMult : float;
	var accessoryAttached : boolean;
	var sight : GameObject;
	var sightTag : String;
	var sightFOV : float;
	var sightAttached : boolean;
	var barrel : GameObject;
	var barrelTag : String;
	var barrelMult : float;
	var barrelAttached : boolean;
}

//Class initialization
var stats : stats;
var mult : mult;
var spread : spread;
var ammo : ammo;
var damage : damage;
var aim : aim;
var animClip : animClip;
var attachments : attachments;

//Crosshair variables
         
var crosshairColor = Color.white;   //The crosshair color
         
var width : float = 5;      //Crosshair width
var height : float = 35;     //Crosshair height
         
private var tex : Texture2D;
         
private var lineStyle : GUIStyle;

//Hidden booleans
var equipped : boolean = false; // Is the gun equipped?
var reloading : boolean = false; // Is the gun currently reloading?
var reloadingFromEmpty : boolean = false; // Is the gun reloading off an empty magazine? (useful for animations)
@HideInInspector var isFiring : boolean = false; // Is the gun firing?
var aiming : boolean = false; // Is the player aiming down the sights?
@HideInInspector var sprinting : boolean = false; // Is the player sprinting?
@HideInInspector var drawCrosshair : boolean = true; // Draw the crosshair?

//Timers for firing, reloading, and equipping.
var fireTimer = 0.0; // Timer until next fire
var reloadTimer = 0.0; // Timer until next reload
var equipTimer = 0.0; // Timer until player can fire after equipping
var burstAmount = 0; //Amount of shots still left to first in the burst

//Objects
var wepCamera : GameObject; // The camera that renders the gun layer
var mainCamera : GameObject; // The player camera
var cameraLoc : GameObject; 
var muzzleFlash : GameObject; // The sub-object on a gun where the muzzle flash is supposed to be
var animationComp : Animation; // The animation controller
var hitParticles : ParticleEmitter; // The particles that appear on hit
var muzzleParticles : ParticleEmitter; // The muzzle flash
var fireSound : AudioSource; // The sound of gunfire

function Awake()
{
	fireSound = GetComponent(AudioSource); // Can probably be stripped
	animationComp = GetComponent(Animation); // Can probably be stripped
	wepCamera = GameObject.Find("Weapon Camera"); // Can probably be stripped
	mainCamera = GameObject.Find("Main Camera"); // Can probably be stripped
	
	//Variable default storage (for attachment modifiers)
	spread.defaultSpreadAmntAimMax = spread.spreadAmntAimMax;
	spread.defaultSpreadAmntAimMin = spread.spreadAmntAimMin;
	spread.defaultSpreadAmntMax = spread.spreadAmntMax;
	spread.defaultSpreadAmntMin = spread.spreadAmntMin;
	
	mult.defaultDamageMult = mult.dmgMult;
	mult.defaultHipAimMult = mult.hipAimMult;
	mult.defaultSightAimMult = mult.sightAimMult;
	mult.defaultReloadMult = mult.reloadMult;
	
	/*if (attachments.accessoryAttached) {attachments.accessory.SetActive(true);} else {attachments.accessory.SetActive(false);}
	if (attachments.barrelAttached) {attachments.barrel.SetActive(true);} else {attachments.barrel.SetActive(false);}
	if (attachments.sightAttached) {attachments.sight.SetActive(true);} else {attachments.sight.SetActive(false);}
	if (attachments.underBarrelAttached) {attachments.underBarrel.SetActive(true);} else {attachments.underBarrel.SetActive(false);}*/
	
	
	//Crosshair (I honestly don't remember where I got this code, should be reworked)
	
	tex = Texture2D(1,1);
 
    SetColor(tex, crosshairColor); //Set color
 
    lineStyle = GUIStyle();
    lineStyle.normal.background = tex;    	
}

function Start() 
{
	if (hitParticles) 
	{
		hitParticles.emit = false; //Turn off the hitsparks, if they happen to be on
	}
}

function Update()
{
	
	//Controls
	
	//Shoot the gun!
	if (Input.GetButtonDown("Fire1") && !stats.isAutomatic) 
	{
		burstAmount = stats.shotsFired;

		Fire();
	}
	
	//Shoot the gun as long as the trigger is held down!
	if (Input.GetAxisRaw("Fire1") && stats.isAutomatic) 
	{
		Fire();
	}

	if (attachments.barrelAttached)
	{
		mult.dmgMult = 2.0f;
	}
	
	//Reload the gun on pressing user-defined Reload key
	//Checks to see if you are out of reserve, then if your current ammo count is below your max, then if you're already reloading
	//Sets the reload timer to the same length as the inspector-defined reload animation
	if (Input.GetAxisRaw("Reload")) 
	{		
		if (ammo.ammoReserve > 0 && ammo.ammoCount < ammo.ammoCountMax && !reloading) {
			GetComponent.<Animation>().Stop();
			
			if (ammo.ammoCount <= 0) 
			{
				reloadTimer = animClip.animReloadEmpty.length;
				reloadingFromEmpty = true;
			}
			if (ammo.ammoCount > 0) 
			{
				reloadTimer = animClip.animReload.length;
				reloadingFromEmpty = false;
			}
			
			reloading = true; // Start the reload!
		}		
	}
	
	//The actual reload. An if statement rather than a function to allow for canceling reloads, such as through firing or sprinting.
	if (reloading == true) 
	{
		reloadTimer -= Time.deltaTime; //As long as you're reloading, count down the reload timer
		aiming = false; //No aiming while reloading!
		sprinting = false; //Or sprinting!
		
		if (ammo.ammoCount <= 0) 
		{
			animationComp.Play(animClip.animReloadEmpty.name); //Use empty reload anim
		}
		if (ammo.ammoCount > 0) 
		{
			animationComp.Play(animClip.animReload.name); //use regular reload anim
		}
		
		//Once the reload timer expires, you actually get the ammo added. That's this function!
		if (reloadTimer <= 0 && ammo.ammoCount < ammo.ammoCountMax) 
		{
			Reload(); 
		}
		
		//Can't reload if you're empty!
		//NOTE: Add flair animation calls here
		if (ammo.ammoCount == ammo.ammoCountMax) 
		{
			reloading = false;
			reloadingFromEmpty = false;
		}
	}
	
	//Timers
	fireTimer -= Time.deltaTime;
	equipTimer -= Time.deltaTime;
	
	//Changes to spread based on timing, as long as you aren't firing.
	if (fireTimer <= 0) {
		spread.spreadAmnt -= Time.deltaTime * spread.spreadAmntInc * 5;
		spread.spreadAmntAim -= Time.deltaTime * spread.spreadAmntAimInc * 5;
	}
	
	drawCrosshair = !aiming; //Only draw crosshair if you aren't aiming down the sights
	
	spread.spreadAmnt = Mathf.Clamp(spread.spreadAmnt, spread.spreadAmntMin, spread.spreadAmntMax); //Clamp the spread amount to the min/max
	spread.spreadAmntAim = Mathf.Clamp(spread.spreadAmntAim, spread.spreadAmntAimMin, spread.spreadAmntAimMax); //Same as above, but while aiming
	
	//Input for aiming down the sights
	if (Input.GetAxisRaw("Fire2") && reloading == false) 
	{		
		aiming = true;
	} 
	if (!Input.GetAxisRaw("Fire2")) 
	{
		aiming = false;
	}
	
	//Input for sprinting
	//Currently doesn't change anything in player movement, only used for gun functionality testing
	if (Input.GetKey(KeyCode.LeftShift) && reloading == false) 
	{
		if (!aiming) {
			sprinting = true;
		}
	}
	if (!Input.GetKey(KeyCode.LeftShift)) 
	{
		if (!aiming) {
			sprinting = false;
		}
	}
	
	//if () { } 
	
	Aiming(aiming); //Call the aiming function with the value of whatever "aiming" is.
	
	//Ignore this shit
	/*aim.sprintingFOV = aim.defaultSprintingFOV;
	
	if (attachments.barrelAttached && attachments.barrelTag == "heavy") {
		mult.dmgMult = attachments.barrelMult;
	}
	
	if (mult.aimModified) {
    	spread.spreadAmntAimMin = spread.spreadAmntAimMin * mult.sightAimMult;
    	spread.spreadAmntAimMax = spread.spreadAmntAimMax * mult.sightAimMult;
    }
    if (mult.hipModified) {
    	spread.spreadAmntMin = spread.spreadAmntMin * mult.hipAimMult;
    	spread.spreadAmntMax = spread.spreadAmntMax * mult.hipAimMult;
    }*/
    
    aim.cameraFOV = wepCamera.GetComponent.<Camera>().fieldOfView; //FOV of the weapon camera
    
}

function OnGUI() 
{
	
	GUI.Label(Rect(50,400,50,50),"" + ammo.ammoCount); //Draw magazine ammo on HUD
	GUI.Label(Rect(100,400,50,50),"" + ammo.ammoReserve); //Draw reserve ammo on HUD
	
	/*GUI.Label(Rect(100,450,50,50),"" + reloadTimer);  //Debug GUI
	GUI.Label(Rect(100,500,50,50),"" + spreadAmntAim);
	GUI.Label(Rect(100,550,50,50),"" + spreadAmnt);
	GUI.Label(Rect(100,300,50,50),"" + aim.cameraFOV);*/
	
	//Crosshair shit. I don't remember how this works all that well, can probably be simplified
	var centerPoint = Vector2(Screen.width / 2, Screen.height / 2);
                
    if (drawCrosshair) {
        GUI.Box(Rect(centerPoint.x - width / 2, centerPoint.y - (height + (spread.spreadAmnt * 360)), width, height), "", lineStyle);
        GUI.Box(Rect(centerPoint.x - width / 2, centerPoint.y + (spread.spreadAmnt * 360), width, height), "", lineStyle);
        GUI.Box(Rect(centerPoint.x + (spread.spreadAmnt * 360), (centerPoint.y - width / 2), height , width), "", lineStyle);
        GUI.Box(Rect(centerPoint.x - (height + (spread.spreadAmnt * 360)), (centerPoint.y - width / 2), height , width), "", lineStyle);
    }   
   
}


function Fire()
{
	//If you are firing or equipping, no bueno.
	if (fireTimer > 0 || equipTimer > 0 && burstAmount <= 0) 
	{
		return;
	}
	
	if (fireTimer <= 0) {
		
		//No ammo in magazine or reserve, no shooting
		if (ammo.ammoCount <= 0 && ammo.ammoReserve <= 0) 
		{
			return;
		}
		//Automatically start reloading from empty if you attempt to fire with an empty mag
		if (ammo.ammoCount <= 0 && ammo.ammoReserve > 0 && !reloading) 
		{
			reloadingFromEmpty = true;
			reloadTimer = animClip.animReloadEmpty.length;
			reloading = true;
			return;
		}
		
		//If you've got bullets, stop playing the current animation and play the firing one instead
		if (ammo.ammoCount > 0) 
		{
			GetComponent.<Animation>().Stop();
			GetComponent.<Animation>().Play(animClip.animFire.name);
			
			//Shotgun mode. Raycasts based on the number of pellets determined in inspector
			if (stats.isSpread) 
			{
				for (var i=0; i<ammo.shotgunPellets; i++) 
				{
					FireShot();
					reloading = false;
					reloadTimer = 0;
				}
				
				SpreadChng(); //Spread calculations
			}
			
			//Regular, single-bullet gun!	
			if (!stats.isSpread) 
			{
				FireShot();
				SpreadChng();
				reloading = false;
				reloadTimer = 0;
			}

			fireTimer = stats.fireRate; //Set timer to the fire rate to prevent firing too quick. Only action timer not to use animation length.
			ammo.ammoCount--; //Subtract an ammo!
			burstAmount--; //Countdown the burst timer
		}
	}
}

//The actual raycast for each shot
function FireShot()
{
	var direction =  SpreadCalc();
	var hit : RaycastHit;
	
	if (ammo.ammoCount > 0) 
	{
		fireSound.Play();
		muzzleParticles.Emit();
		if (Physics.Raycast(cameraLoc.transform.position, direction, hit, stats.range)) 
		{
			if (hit.collider.tag == "head") 
			{
				hit.collider.SendMessageUpwards("Damage", damage.damageAmount * mult.dmgMult * 2, SendMessageOptions.DontRequireReceiver);
			}
			if (hit.collider.tag == "body") 
			{
				hit.collider.SendMessageUpwards("Damage", damage.damageAmount * mult.dmgMult, SendMessageOptions.DontRequireReceiver);
			}
			if (hitParticles) 
			{
				hitParticles.transform.position = hit.point;
				hitParticles.transform.rotation = Quaternion.FromToRotation(Vector3.up, hit.normal);
				hitParticles.Emit();
			}
		isFiring = false;
		}
	} else { return; }
}

//Reloading
function Reload() 
{
	if (ammo.ammoReserve <= 0) 
	{
		return;
	}
	if (stats.shellLoading) 
	{
		ammo.ammoCount++;
		ammo.ammoReserve--;
	}
	if (!stats.shellLoading) 
	{
		var z = ammo.ammoCount + ammo.ammoReserve;
		
		if (z > ammo.ammoCountMax) 
		{
			ammo.ammoReserve -= ammo.ammoCountMax - ammo.ammoCount;
			ammo.ammoCount += ammo.ammoCountMax - ammo.ammoCount;
		}
		
		if (z <= ammo.ammoCountMax) 
		{
			ammo.ammoCount = ammo.ammoReserve + ammo.ammoCount;
			ammo.ammoReserve = 0;
			reloading = false;
		}
	}
}



//This function randomizes the raycast by an amount set in the inspector panel
//I honestly don't understand quaternion math at all, but I fucked around until this works
//PROGRAMMING IS COOL
function SpreadCalc()
{
	var vx = 1.00;
	var vy = 1.00;
	var vz = 1.00;

	if	(aiming) 
	{
		vx = (1 - 2 * Random.value) * spread.spreadAmntAim; //Why does this work?
		vy = (1 - 2 * Random.value) * spread.spreadAmntAim; //I honestly don't know why
		vz = 1.00;
	}
	
	if	(!aiming) 
	{
		vx = (1 - 2 * Random.value) * spread.spreadAmnt; //I mean it makes sense to multiply a random to get the raycast within the spread values
		vy = (1 - 2 * Random.value) * spread.spreadAmnt; //But WHY THE FUCK DOES IT WORK
		vz = 1.00;
	}
	
	return cameraLoc.transform.TransformDirection(Vector3(vx,vy,vz));
}

function SpreadChng()
{
	spread.spreadAmntAim += spread.spreadAmntAimInc;
	spread.spreadAmnt += spread.spreadAmntInc;
}

//Are you aiming? If so, this tells your gun to either be in the aim position (true) or the hip position (false)
function Aiming(aimBool : boolean)
{
	if (aimBool == true) 
	{	
    	transform.localPosition = Vector3.Lerp(transform.localPosition, aim.aimPosition, aim.aimSpeed);
    
	    aim.aimQuaternion = Quaternion.Euler(aim.aimRotation);
	    transform.localRotation = Quaternion.Lerp(transform.localRotation, aim.aimQuaternion, aim.aimSpeed);
	    
	    wepCamera.GetComponent.<Camera>().fieldOfView = Mathf.Lerp(aim.aimingFOV, aim.hipFOV, aim.aimSpeed);
		mainCamera.GetComponent.<Camera>().fieldOfView = Mathf.Lerp(aim.aimingFOV, aim.hipFOV, aim.aimSpeed);
	}
    if (aimBool == false) 
	{    	
    	transform.localPosition = Vector3.Lerp(transform.localPosition, aim.hipPosition, aim.aimSpeed);

	    aim.hipQuaternion = Quaternion.Euler(aim.hipRotation);
	    transform.localRotation = Quaternion.Lerp(transform.localRotation, aim.hipQuaternion, aim.aimSpeed);
	    
	    wepCamera.GetComponent.<Camera>().fieldOfView = Mathf.Lerp(aim.hipFOV, aim.aimingFOV, aim.aimSpeed);
		mainCamera.GetComponent.<Camera>().fieldOfView = Mathf.Lerp(aim.hipFOV, aim.aimingFOV, aim.aimSpeed);
    }
}

//Who fucking cares. Need to fix this.
function Sprinting()
{
	transform.localPosition = Vector3.Lerp(transform.localPosition, aim.sprintPosition, aim.sprintSpeed);
	
	aim.sprintQuaternion = Quaternion.Euler(aim.sprintRotation);
	transform.localRotation = Quaternion.Lerp(transform.localRotation, aim.sprintQuaternion, aim.sprintSpeed);
	
	wepCamera.GetComponent.<Camera>().fieldOfView = aim.sprintingFOV;
    mainCamera.GetComponent.<Camera>().fieldOfView = aim.sprintingFOV;
}

function notSprinting()
{
	transform.localPosition = Vector3.Lerp(transform.localPosition, aim.hipPosition, aim.sprintSpeed);
	
	aim.hipQuaternion = Quaternion.Euler(aim.hipRotation);
	transform.localRotation = Quaternion.Lerp(transform.localRotation, aim.hipQuaternion, aim.sprintSpeed);
	
	wepCamera.GetComponent.<Camera>().fieldOfView = aim.hipFOV;
    mainCamera.GetComponent.<Camera>().fieldOfView = aim.hipFOV;
}

//Crosshair color.
function SetColor(myTexture : Texture2D, myColor : Color)
{
    for (var y : int = 0; y < myTexture.height; ++y)
    {
        for (var x : int = 0; x < myTexture.width; ++x)
        {
            myTexture.SetPixel(x, y, myColor);
        }
    }
     
    myTexture.Apply();
}
	