import {
  PromisedScryResult,
  ScryResult,
  ScryResultMap,
  ScryResultMapProperties,
  ScryResultPromiseMap,
  ScryResults,
  ScryResultsMap
} from "src/types/datas";
import { DataFetcherSettings } from "src/types/settings";

/**
 * Implementation of the scry result interface for a single item. 
 */
export function SingleScryResult<TResult>(result: TResult | undefined, options: DataFetcherSettings): ScryResult<TResult> | PromisedScryResult<TResult> {
  if (result === undefined) {
    return undefined;
  }

  if (result === null) {
    /**@ts-expect-error */
    return null;
  }

  if (typeof result !== "object") {
    if (typeof result === "number") {
      if ((Number.prototype as any).value === undefined) {
        Object.defineProperty(Number.prototype, "value", {
          get(): number {
            return this;
          }
        });
      }
    } else if (typeof result === "string") {
      if ((String.prototype as any).value === undefined) {
        Object.defineProperty(String.prototype, "value", {
          get(): string {
            return this;
          }
        });
      }
    }

    return result as ScryResult<TResult>;
  } else if (result instanceof Promise) {
    if (!(result as any as object).hasOwnProperty("options")) {
      Object.defineProperty(result, "options", {
        get(): DataFetcherSettings {
          return options;
        }
      });
    }
  
    if (!(result as any as object).hasOwnProperty("value")) {
      Object.defineProperty(result, "value", {
        get(): Promise<TResult> {
          return this;
        }
      });
    }

    if (!(result as any as object).hasOwnProperty("promise")) {
      Object.defineProperty(result, "promise", {
        get(): PromisedScryResult<TResult> {
          return this;
        }
      });
    }

    return result.then(
      r => SingleScryResult(r, options)
    ) as PromisedScryResult<TResult>;
  } else {
    if (!(result as any as object).hasOwnProperty("options")) {
      Object.defineProperty(result, "options", {
        get(): DataFetcherSettings {
          return options;
        }
      });
    }
  
    if (!(result as any as object).hasOwnProperty("value")) {
      Object.defineProperty(result, "value", {
        get(): TResult {
          return result as TResult;
        }
      });
    }

    return result as ScryResult<TResult>;
  }
}

export function ScryResultsMap<TResult>(
  result: (ScryResultMap<TResult> & ScryResultMapProperties) | (ScryResultPromiseMap<TResult> & ScryResultMapProperties),
  options: DataFetcherSettings
): ScryResultsMap<TResult> | ScryResultPromiseMap<TResult> {
  if (result === undefined) {
    /**@ts-expect-error */
    return undefined;
  }

  if (!result.hasOwnProperty("map")) {
    Object.defineProperty(result, "map", {
      get(): ScryResultMap<TResult> {
        return this as ScryResultMap<TResult>;
      }
    });
  }

  if (!result.hasOwnProperty("options")) {
    Object.defineProperty(result, "options", {
      get(): DataFetcherSettings {
        return options;
      }
    });
  }

  if (!result.hasOwnProperty("any")) {
    Object.defineProperty(result, "any", {
      get(): boolean {
        return this.keys.length;
      }
    });
  }

  if (!result.hasOwnProperty("values")) {
    Object.defineProperty(result, "values", {
      get(): Array<TResult> {
        if (this.options.flatten) {
          return this.keys
            .map(
              (k: string) => this[k]
            ).filter(
              (x: ScryResults<TResult>) =>
                !(x instanceof ScryResultsMap)
                  && x !== null);
        }

        const results: Array<TResult> = flattenResults
          .call(this)
          .filter((r: typeof SingleScryResult<TResult>) => r !== undefined);
        
        return results;
      }
    });
  }

  if (!result.hasOwnProperty("all")) {
    Object.defineProperty(result, "all", {
      get(): Array<TResult|undefined> {
        if (this.options.flatten) {
          return this.keys
            .map(
              (k: string) => this[k]
            ).filter(
              (x: ScryResults<TResult>) => !(x instanceof ScryResultsMap)
            );
        }

        const results: Array<TResult> = flattenResults
          .call(this);
        
        return results;
      }
    });
  }

  return result as ScryResultsMap<TResult> | ScryResultPromiseMap<TResult>;

  // helper methods
  function flattenResults(self: (ScryResultsMap<TResult> & ScryResultMapProperties)): Array<ScryResult<TResult>> {
    let results: Array<ScryResult<TResult>> = [];
    (self as ScryResultMap<TResult>).keys.forEach((key: string) => {
      const result = self[key];
      if (result?.map !== undefined) {
        results = results.concat(
          flattenResults(result as (ScryResultsMap<TResult> & ScryResultMapProperties))
        );
      } else {
        results.push(result as ScryResult<TResult>);
      }
    });

    return results;
  }
}