export const diccionario = {};
export const estructuras = {};

export const isSmall = () => window.innerWidth <= sizes.small;
export const isMedium = () => window.innerWidth <= sizes.medium;
export const isLarge = () => window.innerWidth > sizes.medium;

export const sizes = {
 "small": 600,
 "medium": 900,
 "responsive": [600, 900],
 "responsive-min": [400, 900]
}

export const determinarAliasDeTamaño = (value) => {
  if (sizes[value]) {
    return sizes[value];
  }
  return value;
};