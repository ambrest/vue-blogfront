/**
 * Generates a graphql query object
 * @param type Query type.
 * @param operation Operation / function name.
 * @param vars Optional variables.
 * @param fields Array of fields.
 * @returns {{variables, query: string}}
 */
export default function ({type = 'query', operation, vars = {}, fields = []}) {
    const noVars = !!Object.keys(vars).length;
    return {
        query: `
            ${type} ${noVars ? `${cfl(operation)}(${queryTypeList(vars)})` : ''} {
                ${operation}${noVars ? `(${queryVarList(vars)})` : ''} {
                   ${Array.isArray(fields) ? fields.join(', ') : fields}
                }
            }
        `,
        variables: vars
    };
}

function cfl(str) {
    return str[0].toUpperCase() + str.substring(1);
}

function queryTypeList(data) {
    return Object.entries(data)
        .filter(v => v[1])
        .map(([k, v]) => `$${k}:${Array.isArray(v) ? `[${cfl(typeof v[0])}]` : cfl(typeof v)}!`);
}

function queryVarList(data) {
    return Object.entries(data)
        .filter(v => v[1])
        .map(([k]) => `${k}:$${k}`);
}
