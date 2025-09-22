const customTypeMapping: { [key: string]: string } = {
  int4: 'number',
  int8: 'number',
  int16: 'number',
  int32: 'number',
  uint8: 'number',
  uint16: 'number',
  uint32: 'number',
  bigint: 'bigint',
  char: 'string',
  longtext: 'string',
  smallint: 'number',
  // Add more custom mappings as needed
};

export const getType = (type: string): string => {
  switch (type) {
    case 'varchar':
    case 'text':
    case 'uuid':
    case 'decimal':
      return 'string';
    case 'int':
    case 'float':
    case 'double':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'timestamp':
    case 'date':
      return 'Date';
    case 'json':
      return 'object';
    default:
      if (customTypeMapping.hasOwnProperty(type)) {
        return customTypeMapping[type];
      }
      return 'any';
  }
};

export const getPropertyType = (type: string): string => {
  switch (type) {
    case 'varchar':
    case 'text':
    case 'uuid':
    case 'char':
    case 'longtext':
      return 'String';
    case 'int':
    case 'decimal':
    case 'float':
    case 'double':
    case 'int4':
    case 'int8':
    case 'int16':
    case 'int32':
    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'smallint':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'timestamp':
    case 'date':
      return 'Date';
    case 'json':
      return 'Object';
    default:
      return type;
  }
};
