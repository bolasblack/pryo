declare module 'yeoman-environment' {
  import { EventEmitter } from 'events'
  import { Store as MemFsStore } from 'mem-fs'
  import { Questions } from 'inquirer'
  import * as inquirer from 'inquirer'
  import Generator from 'yeoman-generator'

  export interface Adapter {
    prompt<T>(questions: Questions<T>): Promise<T>
    prompt<T1, T2>(questions: Questions<T1>, cb: (res: T1) => T2): Promise<T2>

    diff(actual: string, expected: string): string
  }
  export namespace Adapter {
    export type Question<T> = inquirer.Question<T>

    export type Questions<T> = inquirer.Questions<T>
  }

  class Environment<
    O extends Environment.Options = Environment.Options
  > extends EventEmitter {
    static createEnv<O extends Environment.Options = Environment.Options>(
      args?: string | string[],
      opts?: O,
      adapter?: Adapter,
    ): Environment<O>

    static enforceUpdate<E extends Environment>(env: E): E

    static namespaceToName(namespace: string): string

    arguments: string[]

    options: O

    cwd: string

    store: Generator.Storage

    sharedFs: MemFsStore

    lookups: string[]

    aliases: { match: RegExp; value: string }[]

    constructor(args?: string | string[], opts?: O, adapter?: Adapter)

    alias(match: string | RegExp, value: string): void

    create(name: string, options: object): void

    error(err: Error | object): Error

    findGeneratorsIn(list: string[]): string[]

    get(namespace: string): Generator | null

    getByPath(path: string): Generator | null

    getGeneratorNames(): string[]

    getGeneratorsMeta(): { [namespace: string]: Environment.GeneratorMeta }

    getNpmPaths(): string[]

    help(name: string): string

    instantiate(
      name: string,
      options: Environment.InstantiateOptions,
    ): Generator

    lookup(cb?: (err: null | Error) => void): void

    namespace(filepath: string): string

    namespaces(): string[]

    register(name: string, namespace?: string): string

    registerStub(Generator: Generator, namespace: string): this

    resolveModulePath(moduleId: string): string

    run(done: Environment.RunDone): void
    run(args: string | string[], done: Environment.RunDone): void
    run(
      args: string | string[],
      options: object,
      done: Environment.RunDone,
    ): void

    private _tryRegistering(generatorReference: string): void
  }
  namespace Environment {
    export interface Options {
      cwd?: string
      [key: string]: any
    }

    export interface GeneratorMeta {
      resolved: string
      namespace: string
    }

    export interface InstantiateOptions {
      arguments: string | string[]
      options: Options
    }

    export type RunDone = (err: null | Error) => void
  }

  export default Environment
}
