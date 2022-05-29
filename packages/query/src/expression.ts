/**
 * Wraps the given source into an Expression,
 * which, by itself, is not used / executed.
 *
 * Expressions can be used to interpret
 * source code in oder to define custom
 * functionality for that code.
 */
export type Expr<T> = T;

export abstract class Expression<T> {
  public nodeType!: NodeType;
  public type!: T;

  public static lambda() {}
}

abstract class NodeType {}
