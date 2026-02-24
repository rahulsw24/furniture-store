import * as migration_20260222_055103 from './20260222_055103';
import * as migration_20260224_162332 from './20260224_162332';

export const migrations = [
  {
    up: migration_20260222_055103.up,
    down: migration_20260222_055103.down,
    name: '20260222_055103',
  },
  {
    up: migration_20260224_162332.up,
    down: migration_20260224_162332.down,
    name: '20260224_162332'
  },
];
