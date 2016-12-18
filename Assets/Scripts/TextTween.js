#pragma strict

var textRenderer : CanvasRenderer;
var textAlpha : float;
var tweenSpeed : Vector3;
var timer : float;

function Awake () {
	textRenderer = this.GetComponent(CanvasRenderer);
	timer = 0.5f;
}

function Update () {
	this.GetComponent(UI.Text).CrossFadeAlpha(0.0f, 0.5f, false);
	timer -= Time.deltaTime;

	this.transform.position = this.transform.position + tweenSpeed;

	if (timer <= 0.0f){
		Destroy(this.gameObject);
	}
}
