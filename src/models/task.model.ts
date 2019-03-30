import {Entity, model, property} from '@loopback/repository';

@model()
export class Task extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    required: true,
  })
  dueDate: string;

  @property({
    type: 'string',
    required: true,
    default: 'new',
  })
  status: string;

  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;


  constructor(data?: Partial<Task>) {
    super(data);
  }
}
