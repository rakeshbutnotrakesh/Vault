export type TargetTranspileLanguage =
  | 'typescript'
  | 'rust'
  | 'go'
  | 'python-pydantic'
  | 'python-dataclass'
  | 'java-record'
  | 'csharp-record'
  | 'kotlin-data'
  | 'swift-codable'
  | 'cpp-struct'
  | 'sql-ddl';

interface InferredField {
  name: string;
  type: 'string' | 'number' | 'integer' | 'boolean' | 'null' | 'array' | 'object';
  arrayItemType?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'any';
  nestedFields?: InferredField[];
  nullable: boolean;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toLowerCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/-/g, '_');
}

export function inferFields(obj: any): InferredField[] {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }

  return Object.keys(obj).map((key) => {
    const val = obj[key];
    const isNull = val === null;

    if (isNull) {
      return { name: key, type: 'string', nullable: true };
    }

    if (Array.isArray(val)) {
      let arrayItemType: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'any' = 'any';
      if (val.length > 0) {
        const first = val[0];
        if (typeof first === 'number') {
          arrayItemType = Number.isInteger(first) ? 'integer' : 'number';
        } else if (typeof first === 'string') {
          arrayItemType = 'string';
        } else if (typeof first === 'boolean') {
          arrayItemType = 'boolean';
        } else if (typeof first === 'object' && first !== null) {
          arrayItemType = 'object';
        }
      }
      return {
        name: key,
        type: 'array',
        arrayItemType,
        nullable: false
      };
    }

    if (typeof val === 'number') {
      return {
        name: key,
        type: Number.isInteger(val) ? 'integer' : 'number',
        nullable: false
      };
    }

    if (typeof val === 'boolean') {
      return { name: key, type: 'boolean', nullable: false };
    }

    if (typeof val === 'object') {
      return {
        name: key,
        type: 'object',
        nestedFields: inferFields(val),
        nullable: false
      };
    }

    return { name: key, type: 'string', nullable: false };
  });
}

export function transpileJsonToModel(
  jsonString: string,
  modelName: string = 'GeneratedModel',
  target: TargetTranspileLanguage = 'typescript'
): string {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: any) {
    throw new Error(`Invalid JSON: ${err.message}`);
  }

  // If array, use first item
  const targetObj = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!targetObj || typeof targetObj !== 'object') {
    throw new Error('JSON root must be an object or an array of objects.');
  }

  const fields = inferFields(targetObj);
  const pascalName = toPascalCase(modelName || 'Model');

  switch (target) {
    case 'typescript':
      return generateTypeScript(pascalName, fields);
    case 'rust':
      return generateRust(pascalName, fields);
    case 'go':
      return generateGo(pascalName, fields);
    case 'python-pydantic':
      return generatePythonPydantic(pascalName, fields);
    case 'python-dataclass':
      return generatePythonDataclass(pascalName, fields);
    case 'java-record':
      return generateJavaRecord(pascalName, fields);
    case 'csharp-record':
      return generateCSharpRecord(pascalName, fields);
    case 'kotlin-data':
      return generateKotlinData(pascalName, fields);
    case 'swift-codable':
      return generateSwiftCodable(pascalName, fields);
    case 'cpp-struct':
      return generateCppStruct(pascalName, fields);
    case 'sql-ddl':
      return generateSqlDdl(toSnakeCase(modelName || 'models'), fields);
    default:
      return generateTypeScript(pascalName, fields);
  }
}

function generateTypeScript(name: string, fields: InferredField[]): string {
  const lines: string[] = [`export interface ${name} {`];
  fields.forEach((f) => {
    let tsType = 'string';
    if (f.type === 'number' || f.type === 'integer') tsType = 'number';
    else if (f.type === 'boolean') tsType = 'boolean';
    else if (f.type === 'array') tsType = f.arrayItemType === 'string' ? 'string[]' : f.arrayItemType === 'number' || f.arrayItemType === 'integer' ? 'number[]' : 'any[]';
    else if (f.type === 'object') tsType = 'Record<string, any>';
    if (f.nullable) tsType += ' | null';

    lines.push(`  ${f.name}: ${tsType};`);
  });
  lines.push('}');
  return lines.join('\n');
}

function generateRust(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    'use serde::{Deserialize, Serialize};',
    '',
    '#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]',
    `pub struct ${name} {`
  ];

  fields.forEach((f) => {
    let rustType = 'String';
    if (f.type === 'integer') rustType = 'i64';
    else if (f.type === 'number') rustType = 'f64';
    else if (f.type === 'boolean') rustType = 'bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'i64' : f.arrayItemType === 'number' ? 'f64' : f.arrayItemType === 'string' ? 'String' : 'serde_json::Value';
      rustType = `Vec<${inner}>`;
    } else if (f.type === 'object') {
      rustType = 'serde_json::Value';
    }

    if (f.nullable) rustType = `Option<${rustType}>`;

    const snakeKey = toSnakeCase(f.name);
    if (snakeKey !== f.name) {
      lines.push(`    #[serde(rename = "${f.name}")]`);
    }
    lines.push(`    pub ${snakeKey}: ${rustType},`);
  });

  lines.push('}');
  return lines.join('\n');
}

function generateGo(name: string, fields: InferredField[]): string {
  const lines: string[] = [`type ${name} struct {`];
  fields.forEach((f) => {
    let goType = 'string';
    if (f.type === 'integer') goType = 'int64';
    else if (f.type === 'number') goType = 'float64';
    else if (f.type === 'boolean') goType = 'bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'int64' : f.arrayItemType === 'number' ? 'float64' : f.arrayItemType === 'string' ? 'string' : 'any';
      goType = `[]${inner}`;
    } else if (f.type === 'object') {
      goType = 'map[string]any';
    }

    if (f.nullable) goType = `*${goType}`;

    const goField = toPascalCase(f.name);
    lines.push(`\t${goField} ${goType} \`json:"${f.name}"\``);
  });
  lines.push('}');
  return lines.join('\n');
}

function generatePythonPydantic(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    'from pydantic import BaseModel, Field',
    'from typing import Optional, List, Any',
    '',
    `class ${name}(BaseModel):`
  ];

  fields.forEach((f) => {
    let pyType = 'str';
    if (f.type === 'integer') pyType = 'int';
    else if (f.type === 'number') pyType = 'float';
    else if (f.type === 'boolean') pyType = 'bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'int' : f.arrayItemType === 'number' ? 'float' : f.arrayItemType === 'string' ? 'str' : 'Any';
      pyType = `List[${inner}]`;
    } else if (f.type === 'object') {
      pyType = 'dict[str, Any]';
    }

    if (f.nullable) {
      pyType = `Optional[${pyType}] = None`;
    }

    const pyField = toSnakeCase(f.name);
    if (pyField !== f.name) {
      lines.push(`    ${pyField}: ${pyType} = Field(..., alias="${f.name}")`);
    } else {
      lines.push(`    ${pyField}: ${pyType}`);
    }
  });

  return lines.join('\n');
}

function generatePythonDataclass(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    'from dataclasses import dataclass',
    'from typing import Optional, List, Any',
    '',
    '@dataclass',
    `class ${name}:`
  ];

  fields.forEach((f) => {
    let pyType = 'str';
    if (f.type === 'integer') pyType = 'int';
    else if (f.type === 'number') pyType = 'float';
    else if (f.type === 'boolean') pyType = 'bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'int' : f.arrayItemType === 'number' ? 'float' : f.arrayItemType === 'string' ? 'str' : 'Any';
      pyType = `List[${inner}]`;
    } else if (f.type === 'object') {
      pyType = 'dict[str, Any]';
    }

    if (f.nullable) {
      pyType = `Optional[${pyType}] = None`;
    }

    lines.push(`    ${toSnakeCase(f.name)}: ${pyType}`);
  });

  return lines.join('\n');
}

function generateJavaRecord(name: string, fields: InferredField[]): string {
  const params = fields.map((f) => {
    let javaType = 'String';
    if (f.type === 'integer') javaType = 'Long';
    else if (f.type === 'number') javaType = 'Double';
    else if (f.type === 'boolean') javaType = 'Boolean';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'Long' : f.arrayItemType === 'number' ? 'Double' : f.arrayItemType === 'string' ? 'String' : 'Object';
      javaType = `java.util.List<${inner}>`;
    } else if (f.type === 'object') {
      javaType = 'java.util.Map<String, Object>';
    }

    return `    ${javaType} ${toCamelCase(f.name)}`;
  });

  return `public record ${name}(\n${params.join(',\n')}\n) {}`;
}

function generateCSharpRecord(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    'using System.Text.Json.Serialization;',
    '',
    `public record ${name}(`
  ];

  const params = fields.map((f) => {
    let csType = 'string';
    if (f.type === 'integer') csType = 'long';
    else if (f.type === 'number') csType = 'double';
    else if (f.type === 'boolean') csType = 'bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'long' : f.arrayItemType === 'number' ? 'double' : f.arrayItemType === 'string' ? 'string' : 'object';
      csType = `IReadOnlyList<${inner}>`;
    } else if (f.type === 'object') {
      csType = 'IReadOnlyDictionary<string, object>';
    }

    if (f.nullable) csType += '?';

    return `    [property: JsonPropertyName("${f.name}")] ${csType} ${toPascalCase(f.name)}`;
  });

  return `${lines[0]}\n${lines[1]}\n${lines[2]}\n${params.join(',\n')}\n);`;
}

function generateKotlinData(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    'import kotlinx.serialization.SerialName',
    'import kotlinx.serialization.Serializable',
    '',
    '@Serializable',
    `data class ${name}(`
  ];

  const params = fields.map((f) => {
    let ktType = 'String';
    if (f.type === 'integer') ktType = 'Long';
    else if (f.type === 'number') ktType = 'Double';
    else if (f.type === 'boolean') ktType = 'Boolean';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'Long' : f.arrayItemType === 'number' ? 'Double' : f.arrayItemType === 'string' ? 'String' : 'Any';
      ktType = `List<${inner}>`;
    } else if (f.type === 'object') {
      ktType = 'Map<String, Any>';
    }

    if (f.nullable) ktType += '? = null';

    return `    @SerialName("${f.name}") val ${toCamelCase(f.name)}: ${ktType}`;
  });

  return `${lines.join('\n')}\n${params.join(',\n')}\n)`;
}

function generateSwiftCodable(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    'import Foundation',
    '',
    `struct ${name}: Codable {`
  ];

  fields.forEach((f) => {
    let swiftType = 'String';
    if (f.type === 'integer') swiftType = 'Int';
    else if (f.type === 'number') swiftType = 'Double';
    else if (f.type === 'boolean') swiftType = 'Bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'Int' : f.arrayItemType === 'number' ? 'Double' : f.arrayItemType === 'string' ? 'String' : 'AnyCodable';
      swiftType = `[${inner}]`;
    } else if (f.type === 'object') {
      swiftType = '[String: AnyCodable]';
    }

    if (f.nullable) swiftType += '?';

    lines.push(`    let ${toCamelCase(f.name)}: ${swiftType}`);
  });

  lines.push('}');
  return lines.join('\n');
}

function generateCppStruct(name: string, fields: InferredField[]): string {
  const lines: string[] = [
    '#include <string>',
    '#include <vector>',
    '#include <optional>',
    '#include <nlohmann/json.hpp>',
    '',
    `struct ${name} {`
  ];

  fields.forEach((f) => {
    let cppType = 'std::string';
    if (f.type === 'integer') cppType = 'int64_t';
    else if (f.type === 'number') cppType = 'double';
    else if (f.type === 'boolean') cppType = 'bool';
    else if (f.type === 'array') {
      const inner = f.arrayItemType === 'integer' ? 'int64_t' : f.arrayItemType === 'number' ? 'double' : f.arrayItemType === 'string' ? 'std::string' : 'nlohmann::json';
      cppType = `std::vector<${inner}>`;
    } else if (f.type === 'object') {
      cppType = 'nlohmann::json';
    }

    if (f.nullable) cppType = `std::optional<${cppType}>`;

    lines.push(`    ${cppType} ${toSnakeCase(f.name)};`);
  });

  lines.push('};');
  lines.push(`NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(${name}, ${fields.map((f) => toSnakeCase(f.name)).join(', ')})`);
  return lines.join('\n');
}

function generateSqlDdl(tableName: string, fields: InferredField[]): string {
  const lines: string[] = [`CREATE TABLE ${tableName} (`];
  const colDefs: string[] = [
    '    id BIGSERIAL PRIMARY KEY'
  ];

  fields.forEach((f) => {
    const colName = toSnakeCase(f.name);
    if (colName === 'id') return; // already handled

    let sqlType = 'VARCHAR(255)';
    if (f.type === 'integer') sqlType = 'BIGINT';
    else if (f.type === 'number') sqlType = 'NUMERIC(15, 4)';
    else if (f.type === 'boolean') sqlType = 'BOOLEAN';
    else if (f.type === 'array' || f.type === 'object') sqlType = 'JSONB';

    const nullableStr = f.nullable ? '' : ' NOT NULL';
    colDefs.push(`    ${colName} ${sqlType}${nullableStr}`);
  });

  colDefs.push('    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP');
  lines.push(colDefs.join(',\n'));
  lines.push(');');
  return lines.join('\n');
}
