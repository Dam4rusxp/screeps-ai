declare module "*";

interface CreepMemory {
  role: string
  script: ActionParams[]
}

interface RoomMemory {
  initialized: boolean
  spots: ClaimableHarvestSpot[]
}

interface Memory {
  creepCounter: number
}

interface HarvestSpot {
  id: number
  source: Id<Source>
  pos: RoomPosition
  hasKeeper: boolean
}

interface ClaimableHarvestSpot extends HarvestSpot {
  claimedBy: Id<Creep> | null
}
