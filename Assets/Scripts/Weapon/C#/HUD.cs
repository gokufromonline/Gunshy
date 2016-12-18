using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HUD : MonoBehaviour
{

    public int playerXP = 0;

    void Awake()
    {

    }

    void Update()
    {

    }

    void OnGUI()
    {
        GUI.Label(new Rect(50, 300, 50, 50), "XP: " + playerXP);
    }
}