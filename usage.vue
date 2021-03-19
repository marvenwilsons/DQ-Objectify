<template>
    <!-- @Objectify usage -->
    <div>
        <div>
            <!-- Usage of Objectify -->
            <Objectify
                @onChange="change"
                @onError="err"
                @onSubmit="submit"
                @onEmpty="onEmpty"
                @onRemoveProp="onRemoveProp"
                @onData="onData"
                :config="{
                    title: 'Objectify Sample Usage',
                    sub_title_description_text: 'The quick brown fox jumps over the lazy dog.',
                    data: RW_sampleData, // object a schema
                    operation:'rw', // rw , r
                    submit_button: 'UPDATE', // string: if supplied the button will appear
                    allowRemoveProp: true, // only in read only operations
                }"
            />
            <!-- done usage -->
        </div>
    </div>
</template>

<script>
import RW_sampleData from './lib/sample_data/rw'
import R_sampleData from './lib/sample_data/r'
export default {
    data: () => ({
        submit_data: undefined,
        RW_sampleData: RW_sampleData
    }),

    methods: {
        // triggers when error occurs
        err(err) {
            // console.log(err)
        },

        // triggers when change occurs
        change({data,btn,fields,form}) {
            /**
             * data     - form data
             * setBtn   - a function to control the state of button, there are 3 btn states, disable, show
             */
            const { isAList } = data
            if(isAList == 'Yes') {
                btn.visibility(true)
                // btn.disable(false)
            }

            const { id, tabindex, name } = fields
            // id.postError('Hello this is an error')
            // id.lock()
            const currentFucos = form.getCurrentFucos()

            tabindex.pauseRender((render) => {
                if(data.name == 'test' && currentFucos == 'name') {
                    name.postInfoMsg('loading ..')
                    setTimeout(() => {
                        id.removeInfoMsg()
                        render(true)
                    }, 500)
                } else {
                    // remain render
                    render(true)
                }
            })


            setTimeout(() => {
                // id.removeError()
            },1000)
        },

        // triggers when sumbit button is press
        submit(val) {
            this.submit_data = val;
            console.log(val)
        },

        // triggers on empty
        onEmpty() {
            console.log("its not empty!");
        },

        // triggers on prop delete
        onRemoveProp(value) {
            // console.log('prop removed')
            // console.log(value)
        },

        // triggers on every mount
        onData(value) {}
    }
};
</script>