export interface VariantAttributeDTO {
  attributeName: string;
  valueId: string;
  value: string;
}

export interface VariantResponseDTO {
  id: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  isDefault: boolean;
  isActive: boolean;
  attributes: VariantAttributeDTO[];
}
