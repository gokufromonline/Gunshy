function Update()
{
	if (Input.GetButton("Fire1") && !LoadoutSelection.loadoutGUI) {
		BroadcastMessage("Fire");
	}
}