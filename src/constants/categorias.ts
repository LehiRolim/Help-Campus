export const categorias = [
  { value: 'iluminacao', label: 'Iluminação' },
  { value: 'hidraulica', label: 'Hidráulica' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'infraestrutura', label: 'Infraestrutura' },
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'outros', label: 'Outros' },
] as const;

export type Categoria = (typeof categorias)[number]['value'];

export const tamanhoMaximoDescricao = 2000;

