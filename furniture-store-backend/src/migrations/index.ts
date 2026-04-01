import * as migration_20260222_055103 from './20260222_055103';
import * as migration_20260224_162332 from './20260224_162332';
import * as migration_20260323_133451 from './20260323_133451';
import * as migration_20260323_140417 from './20260323_140417';

export const migrations = [
  {
    up: migration_20260222_055103.up,
    down: migration_20260222_055103.down,
    name: '20260222_055103',
  },
  {
    up: migration_20260224_162332.up,
    down: migration_20260224_162332.down,
    name: '20260224_162332',
  },
  {
    up: migration_20260323_133451.up,
    down: migration_20260323_133451.down,
    name: '20260323_133451',
  },
  {
    up: migration_20260323_140417.up,
    down: migration_20260323_140417.down,
    name: '20260323_140417'
  },
];
