export class ThrowHelper {
  public static argumentNull(argumentName: string): MethodInvocationException {
    return new MethodInvocationException(
      `Argument '${argumentName}' is null or undefined`
    );
  }
  public static argumentOutOfRange(
    argumentName: string
  ): MethodInvocationException {
    return new MethodInvocationException(
      `Argument '${argumentName}' is out of range`
    );
  }
  public static empty(): MethodInvocationException {
    return new MethodInvocationException('Sequence is empty');
  }
  public static noMatch(): MethodInvocationException {
    return new MethodInvocationException(
      'Sequence contains no matching element'
    );
  }
  public static moreThanOneMach(): MethodInvocationException {
    return new MethodInvocationException(
      'Sequence contains more than one matching element'
    );
  }

  public static invalidOperation(message: string): MethodInvocationException {
    return new MethodInvocationException(message);
  }
}

export class ArgumentNullException extends Error {
  public constructor(parameter: string) {
    super(`Value cannot be null.\nParameter name: ${parameter}`);
  }
}

export class ArgumentException extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class MethodInvocationException extends Error {
  public constructor(message: string) {
    super(message);
  }
}
