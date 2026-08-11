export interface AttributeValueDTO {
  id: string;
  value: string;
  slug: string;
}

export interface AttributeDTO {
  id: string;
  name: string;
  slug: string;

  values: AttributeValueDTO[];
}
