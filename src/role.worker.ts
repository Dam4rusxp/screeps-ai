import {
  HarvestParams,
  MoveToParams,
  TransferParams
} from "./actions";
import util from "./screepsUtil";

const roleWorker = {

  run: function (creep: Creep) {
    creep.room.visual.text("Thinking", creep.pos.x, creep.pos.y - 1);

    if (creep.store.getUsedCapacity() < creep.store.getCapacity() * 0.3) {
      const freeSpots = creep.room.memory.spots.filter((spot) => spot.claimedBy === null && !spot.hasKeeper);
      const goalPositions = freeSpots.map((s) => new RoomPosition(s.pos.x, s.pos.y, s.pos.roomName));
      const shortestPath = PathFinder.search(creep.pos, goalPositions);
      const chosenSpot = creep.room.memory.spots.find((spot) => util.makePos(spot.pos).isEqualTo(shortestPath.path.slice(-1)[0]));

      if (chosenSpot != null) {
        chosenSpot.claimedBy = creep.id;
        creep.memory.script.push(new MoveToParams(creep.id, chosenSpot.pos));
        creep.memory.script.push(new HarvestParams(creep.id, chosenSpot));
      }
    } else {
      const targetSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
        filter: object => {
          return object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      if (targetSpawn != null) {
        creep.memory.script.push(new MoveToParams(creep.id, targetSpawn.pos, 1));
        creep.memory.script.push(new TransferParams(creep.id, targetSpawn.id));
      } else if (creep.room.controller) {
        creep.memory.script.push(new MoveToParams(creep.id, creep.room.controller.pos, 3));
        creep.memory.script.push(new TransferParams(creep.id, creep.room.controller.id));
      }
    }
  }
};

export default roleWorker;
