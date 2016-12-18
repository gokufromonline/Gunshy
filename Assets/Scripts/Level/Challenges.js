public static var statsTrackPrimaryKills = new Array(20);

var damageAmount : int = 0;
var damageGun : int = 0;

function Awake() {
	for (var x = 0; x <= 19; x++) {
		statsTrackPrimaryKills[x] = 0;
	}
}