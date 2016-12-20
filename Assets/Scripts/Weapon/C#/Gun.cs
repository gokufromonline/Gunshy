using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gun : MonoBehaviour {

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    //This function randomizes the raycast by an amount set in the inspector panel
    //I honestly don't understand quaternion math at all, but I fucked around until this works
    //PROGRAMMING IS COOL
    public Vector3 SpreadCalc(GameObject raycast, bool aiming, float spreadHip, float spreadAim)
    {
        float vx = 1.00f;
        float vy = 1.00f;
        float vz = 1.00f;

        if (!aiming)
        {
            vx = (1 - 2 * Random.value) * spreadHip; //I mean it makes sense to multiply a random to get the raycast within the spread values
            vy = (1 - 2 * Random.value) * spreadHip; //But WHY THE FUCK DOES IT WORK
            vz = 1.00f;
        }

        if (aiming)
        {
            vx = (1 - 2 * Random.value) * spreadAim; //Why does this work?
            vy = (1 - 2 * Random.value) * spreadAim; //I honestly don't know why
            vz = 1.00f;
        }

        return raycast.transform.TransformDirection(new Vector3(vx, vy, vz));
    }

    //The actual raycast for each shot
    public Vector3 FireRaycast(GameObject raycast, Vector3 direction, float damage, float range)
    {
        
        RaycastHit hit;

        if (Physics.Raycast(raycast.transform.position, direction, out hit, range))
        {
            if (hit.collider.tag == "head")
            {
                hit.collider.SendMessageUpwards("DamageHurt", damage * 2, SendMessageOptions.DontRequireReceiver);
            }
            if (hit.collider.tag == "body")
            {
                hit.collider.SendMessageUpwards("DamageHurt", damage, SendMessageOptions.DontRequireReceiver);
            }

            return (hit.transform.position);

        }

        else { return Vector3.zero; }
    }
}
