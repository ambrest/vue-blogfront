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
    return Object.entries(data)
        .filter(v => v[1] !== null && v[1] !== undefined)
        .map(([k, v]) =>
            `$${k}:${Array.isArray(v) ? `[${cfl(v.length ? getType(v[0]) : types[k])}]` : cfl(getType(v))}!`
        );
}

function queryVarList(data) {
    return Object.entries(data)
        .filter(v => v[1] !== null && v[1] !== undefined)
        .map(([k]) => `${k}:$${k}`);
}

function cfl(str) {
    return str[0].toUpperCase() + str.substring(1);
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
