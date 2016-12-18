var playerXP : int;

function Awake()
{

}

function Update()
{

}

function OnGUI()
{
	GUI.Label(Rect(50,300,50,50),"XP: " + playerXP);
}