using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PowerUp : MonoBehaviour {

    GameObject playerGun;

    public float fireRateChange;
    public float fireRateMult;
    public int damageChange;
    public float damageMult;
    public int ammoMaxChange;
    public int burstChange;

    GameObject plyr;

    void OnTriggerEnter(Collider other)
    {
        plyr = GameObject.FindGameObjectWithTag("gun1");
        GunscriptCS gs = plyr.gameObject.GetComponent<GunscriptCS>();

        gs.ammoCount += 12;
        gs.ammoCountMax += 12;

        gs.fireRate -= fireRateChange;

        gs.damageAmount += damageChange;
        gs.burstAmnt += burstChange;

        //gs.stats.isSpread = true;

        //gs.ammo.shotgunPellets = 2;

        Destroy(this.gameObject);
    }
    // Use this for initialization
    void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
