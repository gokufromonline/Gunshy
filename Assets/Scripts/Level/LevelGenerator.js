public static var levelGeneration : int[,] = new int[4,4];

var flatTerrain : GameObject;
var flatUpTerrain : GameObject;

function Awake() {

	flatTerrain = GameObject.Find("Flat");
	flatUpTerrain = GameObject.Find("FlatUp");

	for (var x = 0; x <= 3; x++) {
		for (var y = 0; y <= 3; y++) {
		
			levelGeneration[x,y] = Mathf.RoundToInt(Random.value);
			
			
			if (levelGeneration[x,y] == 0) {
				Instantiate (flatTerrain, Vector3(x*16,0,y*16), Quaternion.identity);
			}
			
			if (levelGeneration[x,y] == 1) {
				Instantiate (flatUpTerrain, Vector3(x*16,0,y*16), Quaternion.identity);
			}
		}
	}
}