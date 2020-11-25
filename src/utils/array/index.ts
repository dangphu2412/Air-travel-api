export const enumToArray = (enumerable: any): any[] => Object.values(enumerable);

export const mapToIds = (entities: any) => {
  return entities.length ? entities.map((entity: { id: any; }) => entity.id) : [];
};
