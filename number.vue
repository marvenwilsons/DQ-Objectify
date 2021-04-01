<template>
    <div class="flex" >
        <input 
        @focus="$emit('onFucos',_key), inputIsActive = true"
        @blur="inputIsActive = false" 
        :tabindex="parseInt(key_index)" 
        :placeholder="number_placeholder" 
        v-model="number_v_model" 
        :style="{border:'none',outline:'none', color: color.color}" 
        :step="step"
        class="fullwidth padleft050 dq-inp-objtfy flex1" 
        type="number" 
        />
        <div  style="max-width:70px; max-height:25px;" class="flex relative" >
            <div v-if="!isStepOpen" @click="isStepOpen = true" class="pad025 pointer flex flexcenter" >
                ‹
            </div>
            <div v-if="isStepOpen" @click="isStepOpen = false" class="pad025 pointer flex flexcenter" >
                ›
            </div>
            <input v-if="isStepOpen" v-model="step" style="max-width:50px;" type="number">
        </div>
    </div>
</template>

<script>
    export default {
        props: ["data", "_key", "color", "key_index", "disabled"],
        data: () => ({
            number_v_model: undefined,
            number_placeholder: undefined,
            inputIsActive: false,
            isStepOpen: false,
            step: 1
        }),
        watch: {
            number_v_model(current_input,prev_input){
                if (this.data.max < current_input) {
                    this.$emit("onChange", {
                        err: `The value of ${this._key} exceeds the defined maximum value of ${this.data.max}`,
                        data: null,
                        key: this._key
                    })
                } else if (this.data.min > current_input) {
                    this.$emit("onChange", {
                        err: `The value of ${this._key} exceeds the defined minimum value of ${this.data.max}`,
                        data: null,
                        key: this._key
                    })
                } else {
                    if(this.inputIsActive == true) {
                        this.$emit("onChange", {
                            err: null,
                            data: current_input,
                            key: this._key
                        })
                    }
                }
            }
        },
        mounted() {
            if(this.data.value){
                this.number_v_model = this.data.value
            } else {
                this.number_placeholder = 'none'
            }

            if(this.data.step) {
                this.step = this.data.step
            }
        }
    }
</script>