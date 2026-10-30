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
  upstream?: string;
  parts: {
    name: string;
    compatibility?: boolean;
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

type ApiPart = ApiDocument['parts'][number];
interface ApiAlias {
  name: string;
  compatibility?: boolean;
  aliasOf: string;
}
export type StoredApiDocument = Omit<ApiDocument, 'parts'> & {
  parts: (ApiPart | ApiAlias)[];
};

export function expandApi(document: StoredApiDocument): ApiDocument {
  const canonical = new Map(
    document.parts
      .filter((part): part is ApiPart => !('aliasOf' in part))
      .map((part) => [part.name, part]),
  );
  return {
    ...document,
    parts: document.parts.map((part) => {
      if (!('aliasOf' in part)) return part;
      const target = canonical.get(part.aliasOf);
      if (!target) throw new Error(`Missing API alias target: ${part.aliasOf}`);
      const { aliasOf, ...label } = part;
      return { ...target, ...label };
    }),
  };
}
