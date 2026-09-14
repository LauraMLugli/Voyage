import schemaData from './schema.json' with { type: 'json' }; // Ajuste de import se necessário

// O mapeador fica aqui, isolado, servindo apenas ao tradutor do Schema
const TYPE_MAP = {
    sqlite: {
        int: "INTEGER",
        datetime: "TEXT",
        string: "TEXT",
        autoIncrement: "AUTOINCREMENT",
        primaryKey: "PRIMARY KEY"
    },
    mysql: {
        int: "INT",
        datetime: "DATETIME",        
        default: "DEFAULT",
        defaultDatetime : "CURRENT_TIMESTAMP",
        defaultBoolean : [ false, true ],
        string: "VARCHAR",
        boolean: "BOOLEAN",
        size: "100",
        decimal : "3",
        autoIncrement: "AUTO_INCREMENT",
        primaryKey: "PRIMARY KEY"
    },
    sqlserver: {
        int: "INT",
        datetime: "DATETIME",        
        default: "DEFAULT",
        defaultDatetime : "CURRENT_TIMESTAMP",
        defaultBoolean : [ false, true ],
        string: "VARCHAR",
        boolean: "BOOLEAN",
        size: "100",
        decimal : "3",
        autoIncrement: "AUTO_INCREMENT",
        primaryKey: "PRIMARY KEY"
    }
};

export class DatabaseSchema {
    static async initialize(dbStrategy, forceRefresh = false) {
        const dialect = dbStrategy.type; // Lê a propriedade 'type' da estratégia instanciada
        
        if (!dialect || !TYPE_MAP[dialect]) {
            throw new Error(`[ORM] Dialeto '${dialect}' não suportado pelo Schema.`);
        }

        console.log(`[ORM] Verificando estrutura para: ${dialect.toUpperCase()}...`);
        const map = TYPE_MAP[dialect];
        const queries = [];

        for (const [tableName, tableConfig] of Object.entries(schemaData.tables)) {

            if (forceRefresh) {
                queries.push(`DROP TABLE IF EXISTS ${tableName};`);
            }

            const columnDefinitions = [];

            for (const [columnName, colConfig] of Object.entries(tableConfig.columns)) {
                console.log(`${columnName} ${map[colConfig.type]}`)
                let def = `${columnName} ${map[colConfig.type]}`;
                                
                if ( map.size && colConfig.size) def += `( ${colConfig.size} )`

                if (colConfig.primaryKey) def += ` ${map.primaryKey}`;
                if (colConfig.autoIncrement) def += ` ${map.autoIncrement}`;

                if (colConfig.nullable === false && !colConfig.primaryKey) {
                    def += " NOT NULL";
                } else if (colConfig.nullable === true) {
                    def += " NULL";
                }

                if ( map.default && colConfig.default ) {
                    switch (colConfig.type) {
                        case "datetime":
                            def += ` DEFAULT ( ${map.defaultDatetime} )`
                            break;
                        case "boolean":
                            if ( colConfig.default === true) {
                                def += ` ${"DEFAULT(1)"}`
                            } else {
                                def += ` ${"DEFAULT(0)"}`
                            }
                            break
                        default:
                            def += ` DEFAULT( ${ colConfig.default})`
                            break;
                    }
                }
                         
                columnDefinitions.push(def);
            }

            const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (
                ${columnDefinitions.join(',\n                ')}
            );`;
            
            console.log( sql ) ;
            queries.push(sql);
        }

        for (const query of queries) {
            await dbStrategy.execute( query );
        }
        
        console.log(`[ORM] Tabelas sincronizadas com sucesso no ${dialect.toUpperCase()}.`);
    }
}