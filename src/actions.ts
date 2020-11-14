import util from "./screepsUtil";

export abstract class ActionParams {

  public readonly action: string;
  public readonly creep: Id<Creep>;

  protected constructor(action: string, creep: Id<Creep>) {
    this.action = action;
    this.creep = creep;
  }
}

export class MoveToParams extends ActionParams {

  public readonly moveTarget: RoomPosition;
  public readonly targetRange: number;

  constructor(creep: Id<Creep>, moveTarget: RoomPosition, targetRange: number = 0) {
    super("move", creep);
    this.moveTarget = moveTarget;
    this.targetRange = targetRange;
  }
}

export const MoveToAction = (params: MoveToParams) => {
  const creep = Game.getObjectById(params.creep);
  const targetPos = util.makePos(params.moveTarget);

  if (creep == null) {
    console.log("No creep found.");
    return;
  }

  creep.moveTo(targetPos);

  if (creep.pos.inRangeTo(targetPos, params.targetRange)) {
    finishAction(creep);
  }
};

export class HarvestParams extends ActionParams {

  public readonly spot: HarvestSpot;

  constructor(creep: Id<Creep>, spot: HarvestSpot) {
    super("harvest", creep);
    this.spot = spot;
  }
}

export const HarvestAction = (params: HarvestParams) => {
  const creep = Game.getObjectById(params.creep);
  const source = Game.getObjectById(params.spot.source);

  if (creep === null || source === null) {
    console.log("No creep found.");
    return;
  }

  creep.harvest(source);

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0
    || source.energy == 0) {
    creep.room.memory.spots[params.spot.id].claimedBy = null;
    finishAction(creep);
  }
};

export const finishAction = (creep: Creep) => {
  creep.memory.script.shift();
};

export class TransferParams extends ActionParams {

  public readonly fillTarget: Id<StructureSpawn | StructureController>;
  public readonly resourceType: ResourceConstant;

  constructor(creep: Id<Creep>, fillTarget: Id<StructureSpawn | StructureController>, resourceType: ResourceConstant = RESOURCE_ENERGY) {
    super("transfer", creep);
    this.fillTarget = fillTarget;
    this.resourceType = resourceType;
  }
}

export const TransferAction = (params: TransferParams) => {
  const creep = Game.getObjectById(params.creep);
  const fillTarget = Game.getObjectById(params.fillTarget);

  if (creep == null || fillTarget == null) {
    console.log("Object not found.");
    return;
  }

  creep.transfer(fillTarget, params.resourceType);

  if (creep.store.getUsedCapacity(params.resourceType) == 0
    || (fillTarget.structureType == STRUCTURE_SPAWN && fillTarget.store.getFreeCapacity(RESOURCE_ENERGY) == 0)) {
    finishAction(creep);
  }
};
