// import { IEnumerable } from '@core/enumerable';
// import { __awaiter } from 'tslib';

// export const enum AsyncState {
//   Pending = 0,
//   Resolved = 1,
//   Rejected = 2,
// }

// export class AsyncStateMachine<TResult> {
//   public state: AsyncState = AsyncState.Pending;

//   protected _result!: TResult;
//   protected _error!: unknown;

//   protected _promise!: Promise<TResult> | TResult;

//   protected _awaiter!: Awaiter<TResult>;

//   constructor(promise: TResult | Promise<TResult>) {
//     this._awaiter = new Awaiter(this, promise);
//     queueMicrotask(async () => {
//       try {
//         this._result = await this._promise;
//         this.state = AsyncState.Resolved;
//       } catch (error) {
//         this._error = error;
//         this.state = AsyncState.Rejected;
//       }
//     });
//   }

//   public moveNext(): TResult {
//     if (this.state === AsyncState.Resolved) {
//       return this._result;
//     }

//     if (this.state === AsyncState.Rejected) {
//       throw this._error;
//     }

//     return this._awaiter.getResult();
//   }

//   private _awaitSynchronizePromise(): TResult {
//     return __awaiter(
//       this,
//       void 0,
//       <any>void 0,
//       function* (this: AsyncStateMachine<TResult>) {
//         yield this._promise;
//         // yield new Promise((resolve) =>
//         //   __awaiter(
//         //     this,
//         //     void 0,
//         //     <any>void 0,
//         //     function* (this: AsyncStateMachine<TResult>) {
//         //       try {
//         //         resolve(yield this._promise);
//         //       } catch (error) {
//         //         this._error = error;
//         //         this.state = AsyncState.Rejected;
//         //       }
//         //     }
//         //   )
//         // );
//       }
//     );
//   }
// }

// export class IteratorAwaiter<T> {
//   private source!: IEnumerable<Promise<T>>;

//   constructor(source: IEnumerable<Promise<T>>) {
//     this.source = source;
//   }

//   public *[Symbol.iterator](): any {
//     const e = this.source.getEnumerator();
//     while (e.moveNext()) {
//       yield __await(function* () {
//         yield e.current!;
//       });
//     }
//   }
// }

// function __await<T>(promiseGenerator: () => Generator<Promise<T>>): any {
//   const gen = promiseGenerator();

//   return new Promise((resolve, reject) => {
//     function step(key: any, arg?: any) {
//       let info;
//       let value;
//       try {
//         info = (<any>gen)[key](arg);
//         value = info.value;
//       } catch (error) {
//         reject(error);
//         return;
//       }

//       if (info.done) {
//         resolve(value);
//       } else {
//         Promise.resolve(value).then(
//           (value) => {
//             step('next', value);
//           },
//           (err) => {
//             step('throw', err);
//           }
//         );
//       }
//     }

//     return step('next');
//   });
// }

// export class Awaiter<TResult> {
//   private _promise: TResult | Promise<TResult>;
//   private _stateMachine: AsyncStateMachine<TResult>;

//   private _fulfilled: boolean = false;

//   constructor(
//     stateMachine: AsyncStateMachine<TResult>,
//     promise: TResult | Promise<TResult>
//   ) {
//     this._stateMachine = stateMachine;
//     this._promise = promise;
//     this._bindFulfilled();
//   }

//   private _bindFulfilled() {
//     if (!(this._promise instanceof Promise)) {
//       this._fulfilled = true;
//       return;
//     }

//     this._promise.finally(() => {
//       this._fulfilled = true;
//     });
//   }

//   public get isCompleted(): boolean {
//     return this._fulfilled;
//   }

//   public getResult(): TResult {
//     throw '';
//   }
// }
