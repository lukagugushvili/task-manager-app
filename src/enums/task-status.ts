import { registerEnumType } from '@nestjs/graphql';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});
