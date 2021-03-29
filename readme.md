# Objectify
@docs - Objectify
## Props
- config
- appearance
## Events
- `onChange()`
- `onError()`
- `onSubmit()`
- `onEmpty()`
- `onData()`

## Vue Usage
```html
<template>
    <div>
        <Objectify
            @onChange="change"
            @onError="err"
            @onSubmit="submit"
            @onEmpty="onEmpty"
            @onRemoveProp="onRemoveProp"
            @onData="onData"
            :config="{}"
            :appearance="{}"
        />
    </div>
</template>
<script>
    methods: {
        /** handle events here */
    }
</script>
```

# Props
- ### **Config** properties
    - 
    -  `data` 
        - type: `Object`
        - Accepted: Objectify Schema
        - Desc: A data object uses the `key` of the property for the name of the field, and the object body as the configuration of the input field.
    - `operation` 
        - type: `String`
        - desc: `"r"` for read operation, or `"rw"` for read and write
    - `submit_button` 
        - type:`String`
        - The text that will appear on the submit button
    - `allowRemoveProp` 
        - type: `Boolean`
        - Feature is only in available in `r` (read) operations, if set to true you will be able to remove a field item.
    - `config`
    - `theme` 
        - Type:`Object || String`
        - first it will check nuxt's `$colorMode.preference` value and use it if its defined.

        - ## Theme properties
            - title_text_color
            - sub_title_description_text_color
            - wrap_around_border_color
            - divider_border_color
            - keys_bg_color
            - keys_text_color
            - values_bg_color
            - values_text_color
            - select_arrow_down_color
            - button_bg_color
            - button_text_color
            - background_selected
            - modal_overlay_bg
            - select_arrow_down_color
            - select_option_hover_bg
            - select_option_border_color
            - select_option_bg
            - select_chip_bg_color
            - select_chip_hover_bg_color
            - select_chip_border_color

# Events
- **`onChange({data,btn,fields,form})`** - fires everytime a user input's data
    - `data[<input name>]` - `Object`
        - returns the current stream of user input
    - `btn` - Object
        - `visibility` - `Boolean Function`
            - toggles submit button visibility
        - `disable` - `Boolean Function`
            - disables button if set to true
    - `fields[<input name>]` - `Function`
        - `postError(<String>)`
            - display's an error message on the bottom of the input
        - `removeError()`
            - removes the error displayed by `postError()`
        - `postInfoMsg(<String>)`
            - display's an info msg in the bottom of the input
        - `removeInfoMsg()`
            - remove current info message displayed by `postInfoMsg()`
        - `lock()`
            - disables an input
        - `pauseRender(<Boolean Function>)`
            - hides the input until the callback is executed `callback(true)`
    - `form`
        - `getCurrentFucos()`
            - returns the name of the current input being fucosed
- **`onError(err)`** 
    - fires everytime an error occours
    - `err` a stream of text or msg about the current error
- **`onSubmit(data:Object)`**
    - `data` returns the newly composed user input, ready to sent to the server.
- **`onMount(data:Object)`**
    - fires after objectify data initialization, passes the data payload

# Defining data schema
- a schema file is a simple javascript object

### Anatomy of a schema data item
the code below are global essential properties that every item schema declaration should have.
```js
[key name]: {
    type: "", // string, number, select, multiselect, minmax, range
    value: "", // default input value on load
    hoverInfo: "", // description that will appear on key hover

    // render condition is used when an input is dependent on other input value
    // render condition is optional
    renderCondition: {
        controllers: [], // array of key name's that this input depends on
        // method is boolean function, if it returns true then this input will show.
        method: el => el[keyName].value == 'something' && true
    }
}
```

### Native properties on each schema item
#### Type: `string`
```js
{
    mode: '', // password or search
    minChar: 3, // minimum character allowed
    maxChar: 20, // maximum character allowed
    allowSpecialChars: false, // special character allowed or not
    allowWhiteSpace: false, // allow white space
}
```

#### Type: `number`
```js
{
    min: 0, // minimum value
    max: 999, // maximum value
    step: 1, // increment by
}
```

#### Type: `select`
```js
{
    options: ["Option 1", "Option 2"]
}
```

#### Type: `multiselect`
```js
{
    options: ["Option 1", "Option 2"]
}
```

#### Type: `minmax`
```js
{
    options: {
        min: 1,
        max: 15
    }
}
```

