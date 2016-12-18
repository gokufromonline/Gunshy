#pragma strict

var imageRenderer : CanvasRenderer;
var imageAlpha : float;
var timer : float;

function Awake () {
	imageRenderer = this.GetComponent(CanvasRenderer);
	timer = 1.5f;
}

function Update () {
	timer -= Time.deltaTime;

	if (timer <= 0.0f){
		this.GetComponent(UI.Image).color.a -= 0.1f;
	}

	if(this.GetComponent(UI.Image).color.a <= 0.0f){
		Destroy(this.gameObject);
	}
}
