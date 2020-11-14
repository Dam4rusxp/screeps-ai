import has = Reflect.has;

const rooms = {

  initialize: () => {
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const mem = room.memory;

      if (mem.initialized) {
        continue;
      }

      mem.spots = [];
      const sources = room.find(FIND_SOURCES);
      for (const source of sources) {
        const hasKeeper = source.pos.findInRange(FIND_HOSTILE_STRUCTURES, 6, {
          filter: (struc) => struc.owner && struc.owner.username === "Source Keeper"
        }).length > 0;

        let terrain = source.room.lookForAtArea(
          LOOK_TERRAIN,
          source.pos.y - 1, source.pos.x - 1,
          source.pos.y + 1, source.pos.x + 1,
          true);

        // Filter for plain terrain
        let spots = terrain.filter((spot) => spot.terrain === "plain");

        spots.forEach((spot) => {
          mem.spots.push({
            id: mem.spots.length,
            source: source.id,
            pos: new RoomPosition(spot.x, spot.y, room.name),
            claimedBy: null,
            hasKeeper: hasKeeper
          });
        });
      }
      mem.initialized = true;
      console.log("Initialized Room " + room.name + " with " + mem.spots.length + " harvesting spots.");
    }
  }
};

export default rooms;
