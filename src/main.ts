import {ErrorMapper} from "utils/ErrorMapper";
import util from "screepsUtil";
import roleWorker from "role.worker";
import rooms from "rooms";
import {
  ActionParams,
  HarvestAction,
  HarvestParams,
  MoveToAction,
  MoveToParams,
  TransferAction,
  TransferParams
} from "./actions";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  rooms.initialize();

  for (const creepName in Memory.creeps) {
    const creep = Game.creeps[creepName];

    if (!creep) {
      console.log('Clearing non-existing creep memory:', creepName);
      // Finish rest of script to retain world state
      // Memory.creeps[creepName].script.forEach((s) => finishAction(creepName));
      delete Memory.creeps[creepName];
      continue;
    }
  }

  for (const spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];

    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        {align: 'left', opacity: 0.8});
    }
  }

  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];

    if (creep.spawning) continue;

    if (creep.memory.script.length == 0) {
      roleWorker.run(creep);
    } else {
      const action: ActionParams = creep.memory.script[0];
      switch (action.action) {
        case "move":
          MoveToAction(action as MoveToParams);
          break;
        case "harvest":
          HarvestAction(action as HarvestParams);
          break;
        case "transfer":
          TransferAction(action as TransferParams);
          break;
      }
    }
  }

  if (util.roleCount("worker") < Memory.rooms["sim"].spots.length) {
    util.spawnNew([WORK, CARRY, MOVE], "worker");
  }
});
