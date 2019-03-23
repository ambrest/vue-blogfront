/**
 * Generates a graphql query object
 * @param type Query type.
 * @param op Operation / function name.
 * @param vars Optional variables.
 * @param types Types map if var contains a array which is empty and the type cannot be examined
 * @param fields Array of fields.
 * @returns {{variables, query: string}}
 */
export default function ({type = 'query', op, vars = {}, types = {}, fields = []}) {
    const noVars = !!Object.keys(vars).length;

    return {
        query: `
            ${type} ${noVars ? `${cfl(op)}(${queryTypeList(vars, types)})` : ''} {
                ${op}${noVars ? `(${queryVarList(vars)})` : ''} 
                ${fields ? `{${toGraphQLFieldString(fields)}}` : ''}
            }
        `,
        variables: vars
    };
}

function queryTypeList(data, types) {
    const typeList = [];

    for (const [k, v] of Object.entries(data)) {
        if (v !== null && v !== undefined) {
            if (Array.isArray(v)) {
                typeList.push(`$${k}:[${cfl(v.length ? getType(v[0]) : types[k])}!]!`);
            } else {
                typeList.push(`$${k}:${cfl(getType(v))}!`);
            }
        }
    }

    return typeList.join(',');
}

function queryVarList(data) {
    const varList = [];

    for (const [k, v] of Object.entries(data)) {
        if (v !== null && v !== undefined) {
            varList.push(`${k}:$${k}`);
        }
    }

    return varList.join(',');
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

    /* eslint-disable no-console */
    console.warn(`[GQB] getType: Unknown type - `, v);
}

function toGraphQLFieldString(q) {
    if (typeof q === 'string') {
        return q;
    } else if (Array.isArray(q)) {
        return q.join(',');
    } else if (typeof q === 'object') {
        const str = (q.$ || []);

        delete q.$;
        for (const group in q) {
            str.push(`${group}{${toGraphQLFieldString(q[group])}}`);
        }

        return str.join(',');
    } else {

        /* eslint-disable no-console */
        console.warn(`[GQB] toGraphQLFieldString: Unknown type - `, q);
    }
}
