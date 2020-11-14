const util = {
  creepCount: () => Object.keys(Game.creeps).length,

  roleCount: (role: string) => _.filter(Game.creeps, (creep) => creep.memory.role == role).length,

  nextCreepName: (prefix: string) => {
    if (Memory.creepCounter === undefined) {
      Memory.creepCounter = 0;
    }

    let name = "" + Memory.creepCounter++;
    if (prefix !== undefined) name = prefix + name;

    return name;
  },

  spawnNew(parts: BodyPartConstant[], role: string) {
    var newName = this.nextCreepName(role);
    // console.log("Spawning " + role + ":", newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
      {memory: {role: role, script: []}});
  },

  getSpawnsByRoom: (room: Room) => room.find(FIND_MY_STRUCTURES, {
    filter: (s: Structure) => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN)
  }),

  makePos(pos: RoomPosition) {
    return new RoomPosition(pos.x, pos.y, pos.roomName);
  }
};

export default util;
