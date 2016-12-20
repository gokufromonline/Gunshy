using UnityEngine;
using System.Collections;

public class Gunscript : MonoBehaviour
{
    public float range = 500.0f; //Maximum raycast distance
    public float fireRate = 0.5f; //Minimum time (in seconds) between shots
    public bool isAutomatic = false; //Does the gun fire continuously (true) or on each trigger pull (false)
    public bool isSpread = false; // Is the gun a shotgun (true) or not (false)
    public bool isSingleLoad = false; // Does the gun load a single bullet at a time (true) or a whole magazine (false)
    public int shotsFired = 1; //Number of shots fired; more than 1 = burst fire.
	float reloadTime = 0.0f; //Amount of time you are unable to do certain actions while reloading. Counts down while reloading
	float reloadTimeEmpty = 0.0f;  //Same as above, but when magazine is empty
	float equipTime = 0.0f; //Actual time-after-equip-until-player-can-fire timer
	float equipTimeFirst = 0.0f; //Same as above, but when equipping weapon for the first time

    //Perk-related variables (reload speed, etc) CURRENTLY UNUSED
    public float dmgMult = 1.0f;
	float defaultDamageMult = 1.0f;
    public float reloadMult = 1.0f;
	float defaultReloadMult = 1.0f;
    public bool aimModified = false;
    public float sightAimMult = 1.0f;
	float defaultSightAimMult = 1.0f;
    public bool hipModified = false;
    public float hipAimMult = 1.0f;
	float defaultHipAimMult = 1.0f;

    //The raycast spread calculation variables
    //Amnt: Container for the current spread amount for calc; higher = more spread
    //Max: Maximum possible spread value
    //Min: Minimum possible spread value
    //Inc: Amount that the spread values increment on each call of spreadcalc; higher = faster transition between low and high spread

    public float spreadAmnt = 1.00f;
    public float spreadAmntMax = 1.00f;
    float defaultSpreadAmntMax = 0.00f;
    public float spreadAmntMin = 1.00f;
    float defaultSpreadAmntMin = 0.00f;
    public float spreadAmntInc = 1.00f;

    public float spreadAmntAim = 1.00f;
    public float spreadAmntAimMax = 1.00f;
    float defaultSpreadAmntAimMax = 0.00f;
    public float spreadAmntAimMin = 1.00f;
    float defaultSpreadAmntAimMin = 0.00f;
    public float spreadAmntAimInc = 1.00f;


    //Ammo-related variables, such as clip and reserve, and amount of pellets in shotgun blast.
    public int ammoCount = 30; // Ammo in clip currently
    public int ammoReserve = 300; // Ammo in reserve currently
    public int ammoCountMax = 30; // Maximum clip capacity
    public int ammoReserveMax = 300; // Maximum reserve capacity
    public int shotgunPellets = 6; // Number of raycasts when using isSpread

    //Damage of the weapon (amount) and which weapon it is (type)
    public int damageAmount = 1;

    //Class that determines the values for aiming down the sights
    //Position: The actual location
    //Rotation: How the gun is rotated at the relevant position
    //Quaternion: I hate quaternions. Storage for lerping.
    //FOV: Camera FOV when in this aim profile; larger for hip/sprint, smaller for aim
    //Hip: Resting idle position
    //Aim: Where the gun is when it aims
    //Sprint: Where the gun is when you sprint


    public Vector3 hipPosition;
    public Vector3 hipRotation;
    public Quaternion hipQuaternion;
    public float hipFOV = 0.0f;

    public Vector3 aimPosition;
    public Vector3 aimRotation;
    public Quaternion aimQuaternion;
    public float aimingFOV = 0.0f;
    float defaultAimingFOV = 0.0f;
    public float aimSpeed = 0.0f;

    public Vector3 sprintPosition;
    public Vector3 sprintRotation;
    public Quaternion sprintQuaternion;
    public float sprintingFOV = 0.0f;
	float defaultSprintingFOV = 0.0f;
    public float sprintSpeed = 0.0f;

    public float cameraFOV = 0.0f; //The current FOV of the "Main Camera" object

    //Animation selection
    public AnimationClip animFire;
    public AnimationClip animEquip;
    public AnimationClip animEquipFirst;
    public AnimationClip animReload;
    public AnimationClip animReloadEmpty;

    //The list of gun  Nomenclature works like this:
    //Name: The actual attachment object on the gun
    //Tag: The string which determines what stat to modify
    //Mult: The actual number to apply as a modifier
    //Attached: If the attachment is on
    //CURRENTLY UNUSED


    public GameObject underBarrel;
    public string underBarrelTag = "";
    public float underBarrelMult = 1.0f;
    public bool underBarrelAttached = false;

    public GameObject accessory;
    public string accessoryTag = "";
    public float accessoryMult = 1.0f;
    public bool accessoryAttached = false;

    public GameObject sight;
    public string sightTag = "";
    public float sightFOV = 1.0f;
    public bool sightAttached = false;

    public GameObject barrel;
    public string barrelTag = "";
    public float barrelMult = 1.0f;
    public bool barrelAttached = false;

    //Crosshair variables
         
    Color crosshairColor = Color.white;   //The crosshair color

    public float width = 5.0f;      //Crosshair width
    public float height = 35.0f;     //Crosshair height

    Texture2D tex;

    GUIStyle lineStyle;

    //Hidden booleans
    bool equipped = false; // Is the gun equipped?
    bool reloading = false; // Is the gun currently reloading?
    bool reloadingFromEmpty = false; // Is the gun reloading off an empty magazine? (useful for animations)
    bool isFiring = false; // Is the gun firing?
    bool aiming = false; // Is the player aiming down the sights?
    bool sprinting = false; // Is the player sprinting?
    bool drawCrosshair = true; // Draw the crosshair?

//Timers for firing, reloading, and equipping.
    float fireTimer = 0.0f; // Timer until next fire
    float reloadTimer = 0.0f; // Timer until next reload
    float equipTimer = 0.0f; // Timer until player can fire after equipping
    int burstAmount = 0; //Amount of shots still left to first in the burst

    //Objects
    public GameObject wepCamera; // The camera that renders the gun layer
    public GameObject mainCamera; // The player camera
    public GameObject cameraLoc;
    public GameObject muzzleFlash; // The sub-object on a gun where the muzzle flash is supposed to be
    public Animation animationComp; // The animation controller
    public ParticleEmitter hitParticles; // The particles that appear on hit
    public ParticleEmitter muzzleParticles; // The muzzle flash
    public AudioSource fireSound; // The sound of gunfire

    void Awake()
    {
        fireSound = this.gameObject.GetComponent("AudioSource") as AudioSource; // Can probably be stripped
        animationComp = this.gameObject.GetComponent("Animation") as Animation; // Can probably be stripped
        wepCamera = GameObject.Find("Weapon Camera"); // Can probably be stripped
        mainCamera = GameObject.Find("Main Camera"); // Can probably be stripped

        //Variable default storage (for attachment modifiers)
        defaultSpreadAmntAimMax = spreadAmntAimMax;
        defaultSpreadAmntAimMin = spreadAmntAimMin;
        defaultSpreadAmntMax = spreadAmntMax;
        defaultSpreadAmntMin = spreadAmntMin;

        defaultDamageMult = dmgMult;
        defaultHipAimMult = hipAimMult;
        defaultSightAimMult = sightAimMult;
        defaultReloadMult = reloadMult;

        /*if (accessoryAttached) {accessory.SetActive(true);} else {accessory.SetActive(false);}
        if (barrelAttached) {barrel.SetActive(true);} else {barrel.SetActive(false);}
        if (sightAttached) {sight.SetActive(true);} else {sight.SetActive(false);}
        if (underBarrelAttached) {underBarrel.SetActive(true);} else {underBarrel.SetActive(false);}*/


        //Crosshair (I honestly don't remember where I got this code, should be reworked)

        Texture2D tex = new Texture2D(1, 1);

        SetColor(tex, crosshairColor); //Set color

        GUIStyle lineStyle = GUIStyle.none;
        lineStyle.normal.background = tex;
    }

    void Start()
    {
        if (hitParticles)
        {
            hitParticles.emit = false; //Turn off the hitsparks, if they happen to be on
        }
    }

    void Update()
    {

        //Controls//

        //Shoot the gun!
        if (Input.GetButtonDown("Fire1") && !isAutomatic)
        {
            Fire(shotsFired);
        }

        //Shoot the gun as long as the trigger is held down!
        if (Input.GetButton("Fire1") && isAutomatic)
        {

            Fire(shotsFired);
        }

        if (barrelAttached)
        {
            dmgMult = 2.0f;

            Fire(1);

        }

        //Reload the gun on pressing user-defined Reload key
        //Checks to see if you are out of reserve, then if your current ammo count is below your max, then if you're already reloading
        //Sets the reload timer to the same length as the inspector-defined reload animation
        if (Input.GetButton("Reload"))
        {
            if (ammoReserve > 0 && ammoCount < ammoCountMax && !reloading)
            {
                animationComp.Stop();

                if (ammoCount <= 0)
                {
                    reloadTimer = animReloadEmpty.length;
                    reloadingFromEmpty = true;
                }
                if (ammoCount > 0)
                {
                    reloadTimer = animReload.length;
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

            if (ammoCount <= 0)
            {
                animationComp.Play(animReloadEmpty.name); //Use empty reload anim
            }
            if (ammoCount > 0)
            {
                animationComp.Play(animReload.name); //use regular reload anim
            }

            //Once the reload timer expires, you actually get the ammo added. That's this function!
            if (reloadTimer <= 0 && ammoCount < ammoCountMax)
            {
                Reload();
            }

            //Can't reload if you're empty!
            //NOTE: Add flair animation calls here
            if (ammoCount == ammoCountMax)
            {
                reloading = false;
                reloadingFromEmpty = false;
            }
        }

        //Timers
        fireTimer -= Time.deltaTime;
        equipTimer -= Time.deltaTime;

        //Changes to spread based on timing, as long as you aren't firing.
        if (fireTimer <= 0)
        {
            spreadAmnt -= Time.deltaTime * spreadAmntInc * 5;
            spreadAmntAim -= Time.deltaTime * spreadAmntAimInc * 5;
        }

        drawCrosshair = !aiming; //Only draw crosshair if you aren't aiming down the sights

        spreadAmnt = Mathf.Clamp(spreadAmnt, spreadAmntMin, spreadAmntMax); //Clamp the spread amount to the min/max
        spreadAmntAim = Mathf.Clamp(spreadAmntAim, spreadAmntAimMin, spreadAmntAimMax); //Same as above, but while aiming

        //Input for aiming down the sights
        if (Input.GetButton("Fire2") && reloading == false)
        {
            aiming = true;
        }
        if (!Input.GetButton("Fire2"))
        {
            aiming = false;
        }

        //Input for sprinting
        //Currently doesn't change anything in player movement, only used for gun functionality testing
        if (Input.GetKey(KeyCode.LeftShift) && reloading == false)
        {
            if (!aiming)
            {
                sprinting = true;
            }
        }
        if (!Input.GetKey(KeyCode.LeftShift))
        {
            if (!aiming)
            {
                sprinting = false;
            }
        }

        Aiming(aiming); //Call the aiming function with the value of whatever "aiming" is.

        //Ignore this shit
        /*sprintingFOV = defaultSprintingFOV;

        if (barrelAttached && barrelTag == "heavy") {
            dmgMult = barrelMult;
        }

        if (aimModified) {
            spreadAmntAimMin = spreadAmntAimMin * sightAimMult;
            spreadAmntAimMax = spreadAmntAimMax * sightAimMult;
        }
        if (hipModified) {
            spreadAmntMin = spreadAmntMin * hipAimMult;
            spreadAmntMax = spreadAmntMax * hipAimMult;
        }*/

        //cameraFOV = wepCamera.GetComponent.("Camera").fieldOfView; //FOV of the weapon camera

    }

    void OnGUI()
    {

        GUI.Label(new Rect(50, 400, 50, 50), "" + ammoCount); //Draw magazine ammo on HUD
        GUI.Label(new Rect(100, 400, 50, 50), "" + ammoReserve); //Draw reserve ammo on HUD

        /*GUI.Label(Rect(100,450,50,50),"" + reloadTimer);  //Debug GUI
        GUI.Label(Rect(100,500,50,50),"" + spreadAmntAim);
        GUI.Label(Rect(100,550,50,50),"" + spreadAmnt);
        GUI.Label(Rect(100,300,50,50),"" + cameraFOV);*/

        //Crosshair shit. I don't remember how this works all that well, can probably be simplified
        Vector2 centerPoint = new Vector2(Screen.width / 2, Screen.height / 2);

        if (drawCrosshair)
        {
            //GUI.Box(new Rect(centerPoint.x - width / 2, centerPoint.y - (height + (spreadAmnt * 360)), width, height), "", lineStyle);
            //GUI.Box(new Rect(centerPoint.x - width / 2, centerPoint.y + (spreadAmnt * 360), width, height), "", lineStyle);
            //GUI.Box(new Rect(centerPoint.x + (spreadAmnt * 360), (centerPoint.y - width / 2), height, width), "", lineStyle);
            //GUI.Box(new Rect(centerPoint.x - (height + (spreadAmnt * 360)), (centerPoint.y - width / 2), height, width), "", lineStyle);
        }

    }


    void Fire(int burstAmnt)
    {
        //If you are firing or equipping, no bueno.
        if (fireTimer > 0 || equipTimer > 0)
        {
            return;
        }

        if (fireTimer <= 0)
        {

            //No ammo in magazine or reserve, no shooting
            if (ammoCount <= 0 && ammoReserve <= 0)
            {
                return;
            }
            //Automatically start reloading from empty if you attempt to fire with an empty mag
            if (ammoCount <= 0 && ammoReserve > 0 && !reloading)
            {
                reloadingFromEmpty = true;
                reloadTimer = animReloadEmpty.length;
                reloading = true;
                return;
            }

            //If you've got bullets, stop playing the current animation and play the firing one instead
            if (ammoCount > 0)
            {
                animationComp.Stop();
                animationComp.Play(animFire.name);

                //Shotgun mode. Raycasts based on the number of pellets determined in inspector
                if (isSpread)
                {
                    for (var i = 0; i < shotgunPellets; i++)
                    {
                        FireShot();
                        reloading = false;
                        reloadTimer = 0;
                    }

                    SpreadChng(); //Spread calculations
                }

                //Regular, single-bullet gun!	
                if (!isSpread)
                {
                    FireShot();
                    SpreadChng();
                    reloading = false;
                    reloadTimer = 0;
                }

                fireTimer = fireRate * burstAmnt; //Set timer to the fire rate to prevent firing too quick. Only action timer not to use animation length.
                ammoCount--; //Subtract an ammo!
                burstAmount--; //Countdown the burst timer
            }
        }
    }

    //The actual raycast for each shot
    void FireShot()
    {
        Vector3 direction = SpreadCalc();
        RaycastHit hit;

        if (ammoCount > 0)
        {
            fireSound.Play();
            muzzleParticles.Emit();

            if (Physics.Raycast(cameraLoc.transform.position, direction, out hit, range))
            {
                if (hit.collider.tag == "head")
                {
                    hit.collider.SendMessageUpwards("DamageHurt", damageAmount * dmgMult * 2, SendMessageOptions.DontRequireReceiver);
                }
                if (hit.collider.tag == "body")
                {
                    hit.collider.SendMessageUpwards("DamageHurt", damageAmount * dmgMult, SendMessageOptions.DontRequireReceiver);
                }
                if (hitParticles)
                {
                    hitParticles.transform.position = hit.point;
                    hitParticles.transform.rotation = Quaternion.FromToRotation(Vector3.up, hit.normal);
                    hitParticles.Emit();
                }

                isFiring = false;
            }
        }
        else { return; }
    }

    //Reloading
    void Reload()
    {
        if (ammoReserve <= 0)
        {
            return;
        }
        if (isSingleLoad)
        {
            ammoCount++;
            ammoReserve--;
        }
        if (!isSingleLoad)
        {
            var z = ammoCount + ammoReserve;

            if (z > ammoCountMax)
            {
                ammoReserve -= ammoCountMax - ammoCount;
                ammoCount += ammoCountMax - ammoCount;
            }

            if (z <= ammoCountMax)
            {
                ammoCount = ammoReserve + ammoCount;
                ammoReserve = 0;
                reloading = false;
            }
        }
    }



    //This function randomizes the raycast by an amount set in the inspector panel
    //I honestly don't understand quaternion math at all, but I fucked around until this works
    //PROGRAMMING IS COOL
    Vector3 SpreadCalc()
    {
        float vx = 1.00f;
        float vy = 1.00f;
        float vz = 1.00f;

        if (aiming)
        {
            vx = (1 - 2 * Random.value) * spreadAmntAim; //Why does this work?
            vy = (1 - 2 * Random.value) * spreadAmntAim; //I honestly don't know why
            vz = 1.00f;
        }

        if (!aiming)
        {
            vx = (1 - 2 * Random.value) * spreadAmnt; //I mean it makes sense to multiply a random to get the raycast within the spread values
            vy = (1 - 2 * Random.value) * spreadAmnt; //But WHY THE FUCK DOES IT WORK
            vz = 1.00f;
        }

        return cameraLoc.transform.TransformDirection(new Vector3(vx, vy, vz));
    }

    void SpreadChng()
    {
        spreadAmntAim += spreadAmntAimInc;
        spreadAmnt += spreadAmntInc;
    }

    //Are you aiming? If so, this tells your gun to either be in the aim position (true) or the hip position (false)
    void Aiming(bool aimBool)
    {
        if (aimBool == true)
        {
            Camera wepCam = wepCamera.GetComponent("Camera") as Camera;
            Camera mainCam = mainCamera.GetComponent("Camera") as Camera;

            transform.localPosition = Vector3.Lerp(transform.localPosition, aimPosition, aimSpeed);

            aimQuaternion = Quaternion.Euler(aimRotation);
            transform.localRotation = Quaternion.Lerp(transform.localRotation, aimQuaternion, aimSpeed);

            wepCam.fieldOfView = Mathf.Lerp(aimingFOV, hipFOV, aimSpeed);
            mainCam.fieldOfView = Mathf.Lerp(aimingFOV, hipFOV, aimSpeed);
        }
        if (aimBool == false)
        {
            Camera wepCam = wepCamera.GetComponent("Camera") as Camera;
            Camera mainCam = mainCamera.GetComponent("Camera") as Camera;

            transform.localPosition = Vector3.Lerp(transform.localPosition, hipPosition, aimSpeed);

            hipQuaternion = Quaternion.Euler(hipRotation);
            transform.localRotation = Quaternion.Lerp(transform.localRotation, hipQuaternion, aimSpeed);

            wepCam.fieldOfView = Mathf.Lerp(hipFOV, aimingFOV, aimSpeed);
            mainCam.fieldOfView = Mathf.Lerp(hipFOV, aimingFOV, aimSpeed);
        }
    }

    //Who fucking cares. Need to fix this.
    void Sprinting()
    {
        Camera wepCam = wepCamera.GetComponent("Camera") as Camera;
        Camera mainCam = mainCamera.GetComponent("Camera") as Camera;

        transform.localPosition = Vector3.Lerp(transform.localPosition, sprintPosition, sprintSpeed);

        sprintQuaternion = Quaternion.Euler(sprintRotation);
        transform.localRotation = Quaternion.Lerp(transform.localRotation, sprintQuaternion, sprintSpeed);

        wepCam.fieldOfView = sprintingFOV;
        mainCam.fieldOfView = sprintingFOV;
    }

    void notSprinting()
    {
        Camera wepCam = wepCamera.GetComponent("Camera") as Camera;
        Camera mainCam = mainCamera.GetComponent("Camera") as Camera;

        transform.localPosition = Vector3.Lerp(transform.localPosition, hipPosition, sprintSpeed);

        hipQuaternion = Quaternion.Euler(hipRotation);
        transform.localRotation = Quaternion.Lerp(transform.localRotation, hipQuaternion, sprintSpeed);

        wepCam.fieldOfView = hipFOV;
        mainCam.fieldOfView = hipFOV;
    }

    //Crosshair color.
    void SetColor(Texture2D myTexture, Color myColor)
    {
        for (int y = 0; y < myTexture.height; ++y)
        {
            for (int x = 0; x < myTexture.width; ++x)
            {
                myTexture.SetPixel(x, y, myColor);
            }
        }

        myTexture.Apply();
    }
}

