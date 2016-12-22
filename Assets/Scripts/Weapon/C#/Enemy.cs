using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Image = UnityEngine.UI.Image;
using Text = UnityEngine.UI.Text;

public class Enemy : MonoBehaviour {

    public int health = 10;
    public int maxHealth = 30;
    int damageGun = 0;
    int damageAmount = 0;

    public Canvas dmgCanvas;

    //the text container, text prefab, and timer until it disappears
    GameObject damageText;
    public GameObject textPrefab;
    CanvasRenderer textAlpha;

    //the bar container, bar prefab, and timer until it disappears
    GameObject damageBar;
    public GameObject barPrefab;

    //the container to track stats
    public GameObject statsTrack;

    void Awake()
    {
        //textAlpha = textPrefab.GetComponent(CanvasRenderer);
    }

    void Update()
    {
        //textPrefab.CrossFadeAlpha(0.0f, 0.5f, false);
        //barPrefab.rectTransform.sizeDelta = Vector2(health, 0.5);
    }

    void DamageHurt(int damageAmount)
    {

        health -= damageAmount;
        //textAlpha.SetAlpha(1.0f);

        if (health <= 0)
        {
            Die();
        }

        damageText = Instantiate(textPrefab, new Vector3(Random.value * 6, Random.value * 3, 0), Quaternion.identity);
        damageText.transform.SetParent(dmgCanvas.transform, false);
        Text dmgTextTxt = damageText.GetComponent<Text>() as Text;
        dmgTextTxt.text = damageAmount.ToString();

        Destroy(damageBar);

        damageBar = Instantiate(barPrefab, new Vector3(0, 0, 0), Quaternion.identity);
        damageBar.transform.SetParent(dmgCanvas.transform, false);
        Image dmgBarImage = damageBar.GetComponent<Image>() as Image;
        float dmgBarAlpha = dmgBarImage.color.a;
        dmgBarAlpha = 1.0f;

        RectTransform dmgRectTrans = damageBar.GetComponent<RectTransform>() as RectTransform;
        dmgRectTrans.sizeDelta = new Vector2(health, 0.5f);

    }

    void Die()
    {
        HUD statsHUD = statsTrack.GetComponent<HUD>() as HUD;
        int xp = statsHUD.playerXP;
        xp += 25;

        Destroy(this.gameObject);
    }
}
