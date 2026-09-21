declare module 'mammoth' {
  interface ExtractResult {
    value: string;
    messages: any[];
  }
  interface Options {
    arrayBuffer?: ArrayBuffer;
    buffer?: Buffer;
    path?: string;
  }
  export function extractRawText(input: Options): Promise<ExtractResult>;
  export function convertToHtml(input: Options): Promise<ExtractResult>;
  const mammoth: {
    extractRawText(input: Options): Promise<ExtractResult>;
    convertToHtml(input: Options): Promise<ExtractResult>;
  };
  export default mammoth;
}
