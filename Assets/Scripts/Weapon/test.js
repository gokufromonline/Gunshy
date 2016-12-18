#pragma strict

var reloadTimer = 0.0;

function Update () {
	
	
	reloadTimer -= Time.deltaTime;
	
	if (reloadTimer <= 0) 
	{
		GetComponent.<Animation>().Play("rack_slide");
		reloadTimer = 10;
	}
}