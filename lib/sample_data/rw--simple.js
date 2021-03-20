export default {
    // Normal
    id: {
        type: "string",
        value: 'null'
    },
    name: {
        type: "string",
        value: null,
    },
    tabindex: {
        type: "number",
        min: 0,
        max: 999,
        value: null,
    },
    //
    isAList: {
        type: "select",
        options: ["Yes", "No"],
        value: 1,
    },
    "list origin from": {
        type: "select",
        options: ["models", "collections"],
        value: null,
    },
    /**
     * Collections list and Models depends on isAList value and list origin from value
     */
    "collections list": {
        type: "string",
        minChar: 1,
        maxChar: 900,
        allowWhiteSpace: false,
        value: null,
    },
    password: {
        type: "string",
        mode: 'password',
        minChar: 1,
        maxChar: 900,
        allowWhiteSpace: false,
        value: null
    },
    tags: {
        type: "multiselect",
        options: ['foo','baz', 'bar','sample_1','sample_2'],
        value: ['bar','foo'],
    },
    "EXR Range2": {
        type: 'minmax',
        options: {
            min: 1,
            max: 15
        },
        value: {
            min: 1,
            max: 10
        }
    }
}