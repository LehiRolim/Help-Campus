import rotulos from './categorias-labels.json';

export type Categoria = keyof typeof rotulos;

export const categorias = (Object.keys(rotulos) as Categoria[]).map((value) => ({
  value,
  label: rotulos[value],
}));

export const tamanhoMaximoDescricao = 2000;

