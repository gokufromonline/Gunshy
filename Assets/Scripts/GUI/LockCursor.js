// Called when the cursor is actually being locked

function Update() {
	if(Input.GetButtonDown("Fire1")){
		Screen.lockCursor = true;
		Cursor.visible = false;
	}
	if (Input.GetKeyDown ("escape")){
		Screen.lockCursor = false;
		Cursor.visible = true;
	}
}