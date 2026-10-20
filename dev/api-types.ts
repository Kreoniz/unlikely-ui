export interface ApiProperty {
  name: string;
  type: string;
  expandedType?: string;
  required: boolean;
  description: string;
  defaultValue: string;
  deprecated: boolean;
  origin: string;
  native: boolean;
}
export interface ApiDocument {
  name: string;
  importPath: string;
  declaration: string;
  upstream: string;
  parts: {
    name: string;
    kind: 'component' | 'function';
    description: string;
    source: string;
    signatures: string[];
    propsType: string;
    props: ApiProperty[];
    returns: ApiProperty[];
  }[];
  types: {
    name: string;
    declaration: string;
    description: string;
    props: ApiProperty[];
  }[];
  values: { name: string; type: string }[];
}
