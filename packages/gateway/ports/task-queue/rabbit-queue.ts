import { TaskEither } from 'fp-ts/lib/TaskEither.js';
import { Task } from 'core/model/task';
import { TaskQueue } from './task-queue.base';
import { Channel } from 'amqplib';
import { Either, TE } from 'yl-ddd-ts';

export class RabbitTaskQueue implements TaskQueue {
  constructor(
    private channel: Channel,
    private queue: string,
  ) {}

  putTask(task: Task): TaskEither<Error, void> {
    const a = Either.tryCatch(
      () => {
        this.channel.sendToQueue(
          this.queue,
          Buffer.from(
            JSON.stringify({
              docId: task.docId,
            }),
          ),
          {
            persistent: true,
          },
        );
      },
      (e) => e as Error,
    );
    return TE.fromEither(a);
  }
  putTaskById(id: string): TaskEither<Error, void> {
    const a = Either.tryCatch(
      () => {
        this.channel.sendToQueue(
          this.queue,
          Buffer.from(
            JSON.stringify({
              docId: id,
            }),
          ),
          {
            persistent: true,
          },
        );
      },
      (e) => e as Error,
    );
    return TE.fromEither(a);
  }
}
