const misc = require('../sMisc');


class HeadOverlaySingletone {
	async saveHeadOverlay(player, d) {
		if (d.hairStyle) await misc.query(`UPDATE usersHeadOverlay SET hair = '${d.hairStyle}' WHERE id = ${player.guid}`);
		else if (d.hairCol1 && d.hairCol2) {
			const hairColor = {	c1: d.hairCol1, c2: d.hairCol2 };
			await misc.query(`UPDATE usersHeadOverlay SET hairColor = '${JSON.stringify(hairColor)}' WHERE id = ${player.guid}`);
		}
		else if (d.browStyle && d.browOp) {
			const brow = { s: d.browStyle, o: d.browOp }
			await misc.query(`UPDATE usersHeadOverlay SET brow = '${JSON.stringify(brow)}' WHERE id = ${player.guid}`);
		}
		else if (d.beardStyle && d.beardOp) {
			const beard = { s: d.beardStyle, o: d.beardOp }
			await misc.query(`UPDATE usersHeadOverlay SET beard = '${JSON.stringify(beard)}' WHERE id = ${player.guid}`);
		}
	}

	loadUser(player) {
		player.updateHeadOverlay = async function() {
			const d = await misc.query(`SELECT * FROM usersHeadOverlay WHERE id = '${this.guid}'`);
			if (d[0].hair) {
				this.setClothes(2, d[0].hair, 0, 0);
			}
			if (d[0].hairColor) {
				const c = JSON.parse(d[0].hairColor);
				this.setHairColor(c.c1, c.c2);
			}
			if (d[0].brow) {
				const c = JSON.parse(d[0].brow);
				this.setHeadOverlay(2, [c.s, c.o, 1, 1]);
			}
			if (d[0].beard) {
				const c = JSON.parse(d[0].beard);
				this.setHeadOverlay(1, [c.s, c.o, 1, 1]);
			}
		}
		player.updateHeadOverlay();
	}

	async createNewUser(id) {
		const hairColor = { c1: misc.getRandomInt(0, 63), c2: misc.getRandomInt(0, 63) }
		const brow = { s: misc.getRandomInt(0, 33), o: 0, }
		const beard = { s: misc.getRandomInt(0, 28), o: 0 }
		await misc.query(`INSERT INTO usersHeadOverlay (id, hair, hairColor, brow, beard) VALUES ('${id}', '15', '${JSON.stringify(hairColor)}', '${JSON.stringify(brow)}', '${JSON.stringify(beard)}');`);
	}
}
const headOverlaySingletone = new HeadOverlaySingletone();
module.exports = headOverlaySingletone;