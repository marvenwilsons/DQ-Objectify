export default {
    // Normal
    id: {
        type: "string",
        minChar: 3,
        maxChar: 20,
        allowSpecialChars: false,
        allowWhiteSpace: false,
        hoverInfo: "Element Id",
        value: 'asdvasdf-12xwej-3hhx'
    },
    name: {
        type: "string",
        minChar: 1,
        maxChar: 100,
        value: null,
        renderCondition: {
            controllers: ["id"],
            method: schema => schema.id.value && schema.id.value.length > 5
        }
    },
    tabindex: {
        type: "number",
        min: 0,
        max: 999,
        step: 1,
        value: null,
        renderCondition: {
            controllers: ["id", "name"],
            method: schema => {
                if (schema.id.value) {
                    return (
                        schema.id.value.length > 2 &&
                        schema.name.value == "test"
                    );
                }
            }
        }
    },
    //
    isAList: {
        type: "select",
        options: ["Yes", "No"],
        value: 1,
        hoverInfo:
            "dq-studio global attribute: re renders element repeatedly",
        renderCondition: {
            controllers: ["tabindex"],
            method: schema => schema.tabindex.value == 5
        }
    },
    /**
     * list origin from depends on isAList value
     */
    "list origin from": {
        type: "select",
        options: ["models", "collections"],
        value: null,
        hoverInfo:
            "dq-studio global attribute: re renders element repeatedly",
        renderCondition: {
            controllers: ["isAList", "tabindex"],
            method: schema =>
                schema.isAList.value == 0 &&
                schema.tabindex.value == 5
        }
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
        renderCondition: {
            controllers: ["list origin from", "isAList"],
            method: schema =>
                schema["list origin from"].value == 1 &&
                schema.isAList.value == 0
        }
    },
    models: {
        type: "string",
        minChar: 1,
        maxChar: 900,
        allowWhiteSpace: false,
        value: null,
        renderCondition: {
            controllers: ["list origin from", "isAList"],
            method: schema =>
                schema["list origin from"].value == 0 &&
                schema.isAList.value == 0
        }
    },
    password: {
        type: "string",
        mode: 'password',
        minChar: 1,
        maxChar: 900,
        allowWhiteSpace: false,
        value: null,
        renderCondition: {
            controllers: ["list origin from", "isAList"],
            method: schema =>
                schema["list origin from"].value == 0 &&
                schema.isAList.value == 0
        }
    },
    tags: {
        type: "multiselect",
        options: ['foo','baz', 'bar','sample_1','sample_2'],
        value: ['bar','foo'],
        renderCondition: {
            controllers: ["list origin from", "isAList"],
            method: schema =>
                schema["list origin from"].value == 0 &&
                schema.isAList.value == 0
        }
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
        },
        renderCondition: {
            controllers: ["list origin from", "isAList"],
            method: schema =>
                schema["list origin from"].value == 0 &&
                schema.isAList.value == 0
        }
    }
}