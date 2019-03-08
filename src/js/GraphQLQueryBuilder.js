/**
 * Generates a graphql query object
 * @param type Query type.
 * @param operation Operation / function name.
 * @param vars Optional variables.
 * @param types Types map if var contains a array which is empty and the type cannot be examined
 * @param fields Array of fields.
 * @returns {{variables, query: string}}
 */
export default function ({type = 'query', operation, vars = {}, types = {}, fields = []}) {
    const noVars = !!Object.keys(vars).length;

    return {
        query: `
            ${type} ${noVars ? `${cfl(operation)}(${queryTypeList(vars, types)})` : ''} {
                ${operation}${noVars ? `(${queryVarList(vars)})` : ''} 
                ${fields.length ? `{${Array.isArray(fields) ? fields.join(', ') : fields}}` : ''}
            }
        `,
        variables: vars
    };
}

function queryTypeList(data, types) {
    let typeList = '';

    for (const [k, v] of Object.entries(data)) {
        if (v !== null && v !== undefined) {
            typeList += `,$${k}:${Array.isArray(v) ? `[${cfl(v.length ? getType(v[0]) : types[k])}!]` : cfl(getType(v))}!`;
        }
    }

    return typeList.substr(1);
}

function queryVarList(data) {
    let varList = '';

    for (const [k, v] of Object.entries(data)) {
        if (v !== null && v !== undefined) {
            varList += `,${k}:$${k}`;
        }
    }

    return varList.substr(1);
}

function cfl(str) {
    return str[0].toUpperCase() + str.substr(1);
}

function getType(v) {
    switch (typeof v) {
        case 'string':
            return 'String';
        case 'number':
            return 'Int';
        case 'boolean':
            return 'Boolean';
    }
}
