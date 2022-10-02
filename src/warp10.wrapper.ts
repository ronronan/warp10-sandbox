import { DataPoint, Warp10 } from '@senx/warp10';

export interface IFetchResultWarp10 {
  result: any[];
  meta: {
    elapsed: number;
    ops: number;
    fetched: number;
  };
}

export interface IFetchDetailResultWarp10 {
  c: string,
  l: object;
  a: object;
  la: number;
  v: any[];
}

export interface IUpdateResultWarp10 {
  response: string|undefined;
  count: number;
}
export interface IDeleteResultWarp10 {
  result: string;
}

export class Warp10Wrapper {
  private readonly writeToken: string;
  private readonly readToken: string;

  public static readonly BASE_APP_CLASSNAME = 'fr.ronanmorel';

  public readonly w10: Warp10;

  constructor () {
    this.writeToken = process.env.WARP10_WRITE_TOKEN || '';
    this.readToken = process.env.WARP10_READ_TOKEN || '';
    this.w10 = new Warp10(process.env.WARP10_HOST || '');
  }

  exec (warpScript: string): Promise<IFetchResultWarp10> {
    return this.w10.exec(warpScript);
  }

  /**
   * Execute warp10, with append token and variables $rt, $wt, $dt
   * @param {string} warpScript
   */
  public execToken (warpScript: string): Promise<IFetchResultWarp10> {
    const warpScriptToken = warpScript.replace(/^/, `
      '${this.readToken}' 'rt' STORE
      '${this.writeToken}' 'wt' STORE
    `);
    return this.w10.exec(warpScriptToken);
  }

  public fetch (className: string, labels: object, start: string, stop: string, format: 'text' | 'fulltext' | 'json' | 'tsv' | 'fulltsv' | 'pack' | 'raw' = 'json'): Promise<IFetchResultWarp10> {
    return this.w10.fetch(this.readToken, className, labels, start, stop, format);
  }

  public update (dataPoints: (string | DataPoint)[]): Promise<IUpdateResultWarp10> {
    return this.w10.update(this.writeToken, dataPoints);
  }

  public delete (className: string, labels: object, start: string, end: string, deleteAll = false): Promise<IDeleteResultWarp10> {
    return this.w10.delete(this.writeToken, className, labels, start, end, deleteAll);
  }

  public meta (metaList: { className: string; labels: object; attributes: object; }[]): Promise<IUpdateResultWarp10> {
    return this.w10.meta(this.writeToken, metaList);
  }

  public setTimeout (to: number): void {
    this.w10.setTimeout(to);
  }
}
