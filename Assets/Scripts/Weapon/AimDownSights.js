//Hip position of the gun
var hipPosition : Vector3;
var hipRotation : Vector3;
@HideInInspector var hipQuaternion : Quaternion;
var hipFOV : int;

//Aiming position of the gun
var aimPosition : Vector3;
var aimRotation : Vector3;
@HideInInspector var aimQuaternion : Quaternion;
var aimingFOV : int;

//Sprinting position of the gun
var sprintPosition : Vector3;
var sprintRotation : Vector3;
@HideInInspector var sprintQuaternion : Quaternion;
var sprintingFOV : int;

//How long it takes for a gun to aim, return from aiming, and entering the "sprint" position.
var aimSpeed : float;
var sprintSpeed : float;

@HideInInspector var aiming : boolean;
@HideInInspector var sprinting : boolean;

var wepCamera : GameObject;
var mainCamera : GameObject;

function Awake()
{
	wepCamera = GameObject.Find("Weapon Camera");
	mainCamera = GameObject.Find("Main Camera");
}

function Update()
{
	if (Input.GetButton("Fire2")) {		
		aiming = true;
	} 
	if (!Input.GetButton("Fire2")) {
		aiming = false;
	}
	
	if (Input.GetKey(KeyCode.LeftShift)) {
		if (!aiming) {
			sprinting = true;
		}
	}
	if (!Input.GetKey(KeyCode.LeftShift)) {
		if (!aiming) {
			sprinting = false;
		}
	}
	
	if (aiming) {		
		Aiming();
	} 
	if (!aiming) {
		notAiming();
	}
	
	if (sprinting) {
		Sprinting();
	} 
	if (!sprinting) {
		notSprinting();
	}
}

function Aiming()
{
    transform.localPosition = Vector3.Lerp(transform.localPosition, aimPosition, aimSpeed);
    
    aimQuaternion = Quaternion.Euler(aimRotation);
    transform.localRotation = Quaternion.Lerp(transform.localRotation, aimQuaternion, aimSpeed);
    
    wepCamera.GetComponent.<Camera>().fieldOfView = aimingFOV;
    mainCamera.GetComponent.<Camera>().fieldOfView = aimingFOV;
	
	aiming = true;
}

function notAiming()
{
    transform.localPosition = Vector3.Lerp(transform.localPosition, hipPosition, aimSpeed);
    
    hipQuaternion = Quaternion.Euler(hipRotation);
    transform.localRotation = Quaternion.Lerp(transform.localRotation, hipQuaternion, aimSpeed);
    
    wepCamera.GetComponent.<Camera>().fieldOfView = hipFOV;
    mainCamera.GetComponent.<Camera>().fieldOfView = hipFOV;
	
	aiming = false;
}

function Sprinting()
{
	transform.localPosition = Vector3.Lerp(transform.localPosition, sprintPosition, sprintSpeed);
	
	sprintQuaternion = Quaternion.Euler(sprintRotation);
	transform.localRotation = Quaternion.Lerp(transform.localRotation, sprintQuaternion, sprintSpeed);
	
	wepCamera.GetComponent.<Camera>().fieldOfView = sprintingFOV;
    mainCamera.GetComponent.<Camera>().fieldOfView = sprintingFOV;
}

function notSprinting()
{
	transform.localPosition = Vector3.Lerp(transform.localPosition, hipPosition, sprintSpeed);
	
	ipQuaternion = Quaternion.Euler(hipRotation);
	transform.localRotation = Quaternion.Lerp(transform.localRotation, hipQuaternion, sprintSpeed);
	
	wepCamera.GetComponent.<Camera>().fieldOfView = hipFOV;
    mainCamera.GetComponent.<Camera>().fieldOfView = hipFOV;
}