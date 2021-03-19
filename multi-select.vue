<template>
    <div id="dq-multiselect" @focus="$emit('onFucos',_key)" @keypress.enter="onEnter" @keydown="keydown" @focusout="focusout" :tabindex="parseInt(key_index)" @click.right.prevent="" class="select relative fullwidth">
        <div  @click.prevent="mutate_option_open"  class="pointer flex spacebetween">
            <div class="padleft050 fullwidth flex flexwrap">
                <div 
                    :style="{border: `1px solid ${appearance.select_chip_border_color}`, background:appearance.select_chip_bg_color}"
                    class="s_opts padright025 padleft025 borderRad4" 
                    v-for="(so,si) in selected_opts" :key="`${so}-${si}`"
                    @mouseover="onhover(true,si,'s_opts')"
                    @mouseleave="onhover(false,si,'s_opts')"
                    >
                    <div class="flex flexcenter" >
                        <div class="padleft025" >
                            <small>{{so}}</small> 
                        </div>
                        <div 
                        @click.prevent="removeSelection(so)" 
                        @mouseover="onhover(true,si,'s_opts_close')"
                        @mouseleave="onhover(false,si,'s_opts_close')"
                        :style="{border:`1px solid ${appearance.select_chip_border_color}`}" 
                        class="marginleft025 s_opts_close padleft025 padright025 flex flexcenter" 
                        >
                            <small :style="{color: appearance.chip_close}" >&#215;</small>
                        </div>
                    </div>
                </div>
                <span style="color:gray" v-if="selected_opts.length == 0" >none</span> 
            </div>
            <div 
                :style="{color:appearance.select_arrow_down_color, background: appearance.values_bg_color}" 
                class="padright025 flex flexcol flexcenter">
                <div class="fullwidth" :style="{color:appearance.select_arrow_down_color, }" >
                    <small>&#9662;</small>
                </div>
            </div>
        </div>
        <div id="option-container" 
            :style="{background: appearance.select_option_bg, border:`1px solid ${appearance.select_option_border_color}`}"  
            :class="['section absolute fullwidth bordergray', option_open ? '' : 'collapsed']"
        >
            <div style="padding-top:1px;" >
                <div 
                    :style="{
                        color: appearance.color, 
                        background: selected_opts.includes(opt) ? appearance.select_option_hover_bg : '' || hovered_opt == opt ? appearance.select_option_hover_bg : '', 
                        marginBottom:'1px'}" 
                    @mouseover="hovered_opt = opt"
                    @mouseleave="hovered_opt = undefined"
                    @click.self="select_opt(opt)" 
                    class="pointer" 
                    v-for="opt in data.options" 
                    :key="`t-${opt}`">
                    
                    <small class="padleft050" > 
                        <span v-if="selected_opts.includes(opt)" >
                            <strong>
                                ✓
                            </strong>
                        </span>
                        <span :style="{marginLeft: !selected_opts.includes(opt) ? '12px': '' }" >
                            {{opt ? opt : 'none'}}
                        </span>
                    </small>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data", "_key", "appearance", "key_index", "disabled"],
    data: () => ({
        option_open: false,
        selected_opt: undefined,
        selected_opts: [],
        hovered_opt: undefined,
        hovered: false
    }),
    computed: {
        get_selected_opt() {
            return this.selected_opt
        },
        get_option_open_state() {
            return this.option_open
        }
    },
    watch: {
        get_selected_opt(current,prev) {
            this.data.value = this.data.options.indexOf(current)
        },
        selected_opts() {
            this.$emit("onChange", {
                err: null,
                data: this.selected_opts,
                key: this._key
            })
        }
    },
    methods: {
        onEnter() {
            this.option_open = !this.option_open
            // this.selected_opts.push(this.selected_opt)
            
        },
        onhover(state,index,el_class) {
            this.hovered = state
            switch(el_class) {
                case 's_opts':
                    if(state) {
                        document.getElementsByClassName(el_class)[index].style.background = 
                        this.appearance.select_chip_hover_bg_color

                        document.getElementsByClassName(el_class)[index].style.border = 
                        `1px solid ${this.appearance.color}`
                    } else {
                        document.getElementsByClassName(el_class)[index].style.background = 
                        this.appearance.select_chip_bg_color

                        document.getElementsByClassName(el_class)[index].style.border = 
                        `1px solid ${this.appearance.select_chip_border_color}`
                    }
                break;
                case 's_opts_close':
                    if(state) {
                        document.getElementsByClassName(el_class)[index].style.border = 
                        `1px solid ${this.appearance.color}`
                    } else {
                        document.getElementsByClassName(el_class)[index].style.border = 
                        `1px solid ${this.appearance.select_chip_border_color}`
                    }
                break
            }

            
        },
        removeSelection(el) {
            const elIndex = this.selected_opts.indexOf(el)
            this.selected_opts.splice(elIndex,1)
            this.hovered = false
        },  
        focusout() {
            this.option_open = false
        },
        keydown(e) {
            if(this.option_open) {
                if(e.code == 'ArrowUp') {
                    if(this.selected_opt == undefined) {
                        this.selected_opt = this.data.options[0]
                    } else {
                        // get index of current selected option
                        const currentSelectedOption = this.selected_opt
                        const currentSelectedIndex = this.data.options.indexOf(currentSelectedOption)
                        
                        // if current selected option index is in the start of array go back to 1
                        if(currentSelectedIndex == 0) {
                            const lastIndexOption = this.data.options[this.data.options.length - 1]
                            this.selected_opt = lastIndexOption
                        }
                         // if current selected option index is in not in the end or start
                        else {
                            const indexOfSelected = this.data.options.indexOf(this.selected_opt)
                            this.selected_opt = this.data.options[indexOfSelected - 1]
                        }
                    }
                } else if(e.code == 'ArrowDown') {
                    if(this.selected_opt == undefined) {
                        this.selected_opt = this.data.options[this.data.options.length - 1]
                    } else {
                        // get index of current selected option
                        const currentSelectedOption = this.selected_opt
                        const currentSelectedIndex = this.data.options.indexOf(currentSelectedOption)
                        
                        // if current selected option index is in the end of array go back to 0
                        if(currentSelectedIndex == this.data.options.length - 1) {
                            const indexZeroOption = this.data.options[0]
                            this.selected_opt = indexZeroOption
                        } 
                        // if current selected option index is in the start of array go back to 1
                        else if(currentSelectedIndex == 0) {
                            const goto_next = this.data.options[1]
                            this.selected_opt = goto_next
                        } 
                        // if current selected option index is in not in the end or start
                        else {
                            const indexOfSelected = this.data.options.indexOf(this.selected_opt)
                            this.selected_opt = this.data.options[indexOfSelected + 1]
                        }
                    }
                }
            }
        },
        mutate_option_open() {
            if(this.hovered == false) {
                this.option_open = !this.option_open
            }
        },
        select_opt(opt) {
            if(this.selected_opts.includes(opt) ) {
                this.removeSelection(opt)
            } else {
                this.selected_opt = opt
                this.option_open = false
                this.selected_opts.push(opt)
            }
            
        }
    },
    mounted() {
        this.data.value.map(e => {
            this.selected_opts.push(e)
        })
    }
}
</script>

<style>
#option-container {
    margin-top: 3px;
    box-shadow: 2px 2px 15px 1px #393e4244;
    z-index: 100;
}
#option-container > div {
    max-height: 250px;
    overflow-x: hidden;
}
.section {
  overflow:hidden;
  transition:transform 0.1s ease-in-out;
  height:auto;
  transform:scaleY(1);
  transform-origin:top;
}
.section.collapsed {
  transform:scaleY(0);
}
.s_opts{
    margin-top: 2px;
    margin-bottom: 2px;
    border-radius: 100px;
    margin-right: 2px;
}
.s_opts:hover{
    background: rgba(128, 128, 128, 0.562);
}
.s_opts_close{
    border-radius: 100%;
    height:16px;
    width:16px;
}
.s_opts_close:hover{
    transition: 0.3s;
}
#option-container{
    border-bottom-left-radius: 4px;
    border-bottom-left-radius: 4px;
}
div, div > *:focus{
    outline: none !important;
}
.borderOff > * {
    border: none !important;
}
</style>