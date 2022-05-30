export class User {
  public firstName!: string;
  public lastName!: string;
  public id!: string;
  public age!: number;

  constructor(index: number) {
    const divisible = (by: number) => index % by === 0;
    if (divisible(2)) {
      this._assignIdxBy2();
    } else if (divisible(3)) {
      this._assignIdxBy3();
    } else if (divisible(5)) {
      this._assignIdxBy5();
    } else {
      this._assignDefault();
    }
  }

  private _assignIdxBy2() {
    this.firstName = 'Max';
    this.lastName = 'William';
    this.id = '2__I_D';
    this.age = 20;
  }

  private _assignIdxBy3() {
    this.firstName = 'Nancy';
    this.lastName = 'Albert';
    this.id = '53__I_D';
    this.age = 30;
  }

  private _assignIdxBy5() {
    this.firstName = 'Ian';
    this.lastName = 'Chad';
    this.id = '5__I_D';
    this.age = 50;
  }

  private _assignDefault() {
    this.firstName = 'Michael';
    this.lastName = 'FooBar';
    this.id = '0__I_D';
    this.age = 10;
  }
}
