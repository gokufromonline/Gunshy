var health = 10;
var maxHealth = 30;
var damageGun : int = 0;
var damageAmount : int = 0;

var dmgCanvas : Canvas;

//the text container, text prefab, and timer until it disappears
var damageText : GameObject;
var dmgText : GameObject;
var textAlpha : CanvasRenderer;

//the bar container, bar prefab, and timer until it disappears
var damageBar : GameObject;
var dmgBar : GameObject;

//the container to track stats
var statsTrack : GameObject;

function Awake()
{
	//textAlpha = dmgText.GetComponent(CanvasRenderer);
}

function Update()
{
	//dmgText.CrossFadeAlpha(0.0f, 0.5f, false);
	//dmgBar.rectTransform.sizeDelta = Vector2(health, 0.5);
}

function Damage (damageAmount) {

	health -= damageAmount;
	//textAlpha.SetAlpha(1.0f);
	
	if (health <= 0) {
		Die();
	}

	damageText = Instantiate(dmgText, new Vector3(Random.value*6, Random.value*3, 0), Quaternion.identity);
	damageText.transform.SetParent(dmgCanvas.transform, false);
	damageText.GetComponent(UI.Text).text = damageAmount.ToString();

	Destroy(damageBar);

	damageBar = Instantiate(dmgBar, new Vector3(0, 0, 0), Quaternion.identity);
	damageBar.transform.SetParent(dmgCanvas.transform, false);
	damageBar.GetComponent(UI.Image).color.a = 1.0f;
	damageBar.GetComponent(RectTransform).sizeDelta = Vector2(health, 0.5);
	
}

function Die () {
	statsTrack.GetComponent(HUD).playerXP += 25;

	Destroy(this.gameObject);
}