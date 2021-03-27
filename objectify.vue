<template>
  <!-- @Objectify html -->
  <div id="dq-objectify" v-if="ready" class="relative">
    <!-- <debug :data="{entries_with_render_conditions,final_model,final_vanilla,hidden_entries,raw_data_set}"></debug> -->

    <!-- view start here -->
    <div >
      <h6 v-if="config.title" :style="{color: appearance.title_text_color}">{{config.title}}</h6>
      <p
        v-if="config.sub_title_description_text"
        :style="{color: appearance.sub_title_description_text_color}"
      >{{config.sub_title_description_text}}</p>
    </div>
    <div :style="{border: `1px solid ${appearance.wrap_around_border_color}`, fontSize: '15px'}">
      <div>
        <div
          class="flex flexcol"
          v-for="(obj_key,obj_index) in final_model"
          :key="`-o-${obj_index}`"
        >
          <div v-if="renderPaused != obj_index" class="flex">
            <!-- keys -->
            <div
              :id="`objectify-${obj_index}`"
              role="display object index"
              class="pointer flexwrap padleft050"
              :style="get_keys_style"
              :title="obj_key.hoverInfo"
            >{{obj_index}}</div>
            <div :style="{borderRight: `1px solid ${appearance.divider_border_color}`}"></div>
            <!-- value -->
            <div :style="get_value_style" role="display object value" class="flex3 flex flexcenter relative">
              <div v-if="disable_all_fields" id="disabler" class="absolute fullheight-percent fullwidth" style="z-index:100" ></div>
              <div
                :style="{color: get_value_style.color}"
                class="fullwidth padleft025 flex spacebetween"
                v-if="config.operation === 'r'"
              >
                <div class="flex1" >{{obj_key}}</div>
                <div
                  @click="removeProp(obj_index)"
                  v-if="config.allowRemoveProp"
                  style="max-width:20px;"
                  class="padleft025 pointer borderRad4 flex flexcenter"
                  >
                  <div 
                  class="flex flexcenter marginright025  relative"
                  :style="{background: appearance.divider_border_color, maxWidth:'17px', maxHeight:'10px', borderRadius: '100px'}"
                  >
                    <small style="margin-top:2px" >&#10134;</small>
                  </div>
                </div>
              </div>
              <div
                class="fullwidth"
                @onChange="data_change"
                @onFucos="onInputFucos"
                :_key="obj_index"
                :data="obj_key"
                :key_index="obj_key.tab_index"
                v-if="obj_key.type == 'string' && config.operation === 'rw'"
                :is="'str'"
                :color="get_value_style"
                :disabled="disabled_field == obj_index"
              ></div>
              <div
                class="fullwidth"
                @onChange="data_change"
                @onFucos="onInputFucos"
                :_key="obj_index"
                :data="obj_key"
                :key_index="obj_key.tab_index"
                v-if="obj_key.type == 'number' && config.operation === 'rw'"
                :is="'num'"
                :color="get_value_style"
                :disabled="disabled_field == obj_index"
              ></div>
              <div
                class="fullwidth"
                @onChange="data_change"
                @onFucos="onInputFucos"
                :_key="obj_index"
                :data="obj_key"
                :key_index="obj_key.tab_index"
                :appearance="appearance"
                v-if="obj_key.type == 'minmax' && config.operation === 'rw'"
                :is="'MinMax'"
                :color="get_value_style"
                :disabled="disabled_field == obj_index"
              ></div>
              <!-- @Objectify select usage -->
              <div
                class="fullwidth"
                @onFucos="onInputFucos"
                @onChange="data_change"
                :_key="obj_index"
                :data="obj_key"
                :key_index="obj_key.tab_index"
                :disabled="disabled_field == obj_index"
                :appearance="{
                  background: appearance.values_bg_color,
                  color: appearance.values_text_color,
                  background_selected: appearance.background_selected,
                  select_arrow_down_color: appearance.select_arrow_down_color,
                  chip_close: appearance.select_arrow_down_color,
                  select_option_hover_bg: appearance.select_option_hover_bg,
                  select_option_border_color: appearance.select_option_border_color,
                  select_chip_bg_color: appearance.select_chip_bg_color,
                  select_chip_hover_bg_color: appearance.select_chip_hover_bg_color,
                  select_chip_border_color: appearance.select_chip_border_color,
                  select_chip_text_color: appearance.select_chip_text_color,
                  select_option_bg: appearance.select_option_bg
                }"
                v-if="obj_key.type == 'select' && config.operation === 'rw'"
                :is="'sel'"
              ></div>
              <multiselect
                @onFucos="onInputFucos"
                @onChange="data_change"
                v-if="obj_key.type == 'multiselect' && config.operation === 'rw'"
                :_key="obj_index"
                :data="obj_key"
                :key_index="obj_key.tab_index"
                :disabled="disabled_field == obj_index"
                :appearance="{
                  background: appearance.values_bg_color,
                  color: appearance.values_text_color,
                  background_selected: appearance.background_selected,
                  select_arrow_down_color: appearance.select_arrow_down_color,
                  chip_close: appearance.select_arrow_down_color,
                  select_option_hover_bg: appearance.select_option_hover_bg,
                  select_option_border_color: appearance.select_option_border_color,
                  select_chip_bg_color: appearance.select_chip_bg_color,
                  select_chip_hover_bg_color: appearance.select_chip_hover_bg_color,
                  select_chip_border_color: appearance.select_chip_border_color,
                  select_chip_text_color: appearance.select_chip_text_color,
                  select_option_bg: appearance.select_option_bg
                }"
              />
            </div>
          </div>
          <div v-if="err_key == obj_index" class="">
            <div style="color:red;" class="backgrounderr pad025 err">Error: Invalid {{err_key}} - {{err}}</div>
          </div>
          <div v-if="info_key == obj_index" class="">
            <div class="backgroundinfo pad025">{{info}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="btn_visibility" class="margintop050 flex flexend">
      <button @blur="btnFucos(false)" @focus="btnFucos(true)" id="obj-btn" :tabindex="get_btn_index()" :disabled="btn_is_disabled" :style="get_button_style" @click="submit" class="dq-button borderRad4">
        <small v-if="!btn_is_loading" >{{config.submit_button}}</small>
        <div v-if="btn_is_loading" class="spinning flex flexcenter" style="width:20px; height:20px;" > 
          ⟲
        </div>
      </button>
    </div>
  </div>
</template>

<script>
// @Objectify JS

import num from "./number.vue";
import str from "./string.vue";
import sel from "./select.vue";
import MinMax from "./min-max"
import multiselect from './multi-select'
import miftm from './lib/multiInputField_tabIndex_mapping_system'
import themeManager from './themes/index'

export default {
  props: ["config", "theme"],
  components: { num, str, sel, MinMax, multiselect },
  computed: {
    /**
     * return type Object
     * convert the schema into vanilla object
     */
    normalize_data_set() {
      return this.raw_data_set;
    },
    /**
     * return type Array
     * Scans the schema with render condition and returns an array of keys
     */
    entries_with_render_conditions() {
      let arr = [];

      for (let key in this.raw_data_set) {
        if (this.raw_data_set[key]["renderCondition"]) {
          arr.push(key);
        }
      }

      return arr;
    },
    /**
     * returns an array
     * scans the schema, returns an array of keys of entries that should be hidden
     */
    hidden_entries() {
      let r = [];

      this.entries_with_render_conditions.map(keys => {
        const condition_result = this.normalize_data_set[
          keys
        ].renderCondition.method(this.normalize_data_set);
        if (!condition_result) {
          r.push(keys);
        }
      });

      return r;
    },

    // final model
    final_model() {
      let r = {};
      // dont include entries that is included in the hidden entries
      for (let key in this.normalize_data_set) {
        if (!this.hidden_entries.includes(key)) {
          r[key] = this.normalize_data_set[key];
        }
      }

      return r;
    },
    // final vanilla
    final_vanilla() {
      let f = {};
      for (let key in this.final_model) {
        const t = this.final_model[key].type;
        if (t == "string" || t == "number" || t == 'minmax' || t == 'multiselect') {
          f[key] = this.final_model[key].value;
        } else if (t == "select") {
          f[key] = this.final_model[key].options[this.final_model[key].value];
        }
      }

      return f;
    },

    // button style
    get_button_style() {
      return {
        background: this.appearance.button_bg_color,
        color: this.appearance.button_text_color
      };
    },

    // keys style
    get_keys_style() {
      return {
        borderBottom: `1px solid ${this.appearance.divider_border_color}`,
        minWidth: "140px",
        background: this.appearance.keys_bg_color,
        color: this.appearance.keys_text_color
      };
    },

    // value style
    get_value_style() {
      return {
        borderBottom: `1px solid ${this.appearance.divider_border_color}`,
        background: this.appearance.values_bg_color,
        color: this.appearance.values_text_color
      };
    }
  },
  data: () => ({
    ready: false,
    appearance: undefined,
    raw_data_set: undefined,
    has_initial_input: false,
    err: undefined,
    info: undefined,
    err_key: undefined,
    info_key: undefined,
    postErrorMode: false,
    change_occurs: false,
    btn_visibility: false,
    btn_is_disabled: false,
    btn_is_loading: false,
    disable_all_fields: false,
    data_keys: [],
    tab_index_mapping: [],
    tab_index_len: 0,
    fields: {},
    form: {},
    disabled_field: undefined,
    renderPaused: undefined,
    isFucosed: undefined
  }),
  watch: {
    final_vanilla(current, prev) {
      //
      this.$emit("onChange", {
        data: current,
        btn: {
          visibility: this.set_btn_visibility,
          disable: this.set_btn_disable,
          
        },
        /** fields
           * passes each field methods, ei: [fieldName].postError([Boolean Operation],'Error Msg')
           */
        fields: this.fields,
        form: this.form
      });
    },
  },
  methods: {
    onInputFucos(el) {
      this.isFucosed = el
    },
    set_btn_visibility(val) {
      this.btn_visibility = val
    },
    set_btn_disable(val) {
      this.btn_is_disabled = val
    },
    get_btn_index(keyname) {
      let l = this.tab_index_mapping[this.tab_index_mapping.length -1]
      if(l.includes(',')) {
        return parseInt(l.split(',')[1]) + 1
      }
    },
    btnFucos(val) {
      const el = document.getElementById("obj-btn")
      if(val) {
        el.style.border = `2px solid #629af4`
      } else {
        el.style.border = `none`
      }
    }, 
    find_key_controllers_on_entries(key, data_set) {
      let entry = [];
      let _key = key;

      for (let key in data_set) {
        if (data_set[key].renderCondition) {
          if (_key) {
            if (data_set[key].renderCondition.controllers.includes(_key)) {
              entry.push(key);
            }
          }
        }
      }

      return entry;
    },
    copy(o) {
      if (o === null) return null;

        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
          v = o[key];
          output[key] = typeof v === "object" ? this.copy(v) : v;
        }

        return output;
    },
    data_change({ err, data, key }) {
      if (!this.change_occurs) {
        this.change_occurs = true;
      }

      if (!err) {
        // change default value to final model
        this.final_model[key].value = data;

        //
        if (!this.has_initial_input) {
          this.has_initial_input = true;
        }

        //
        this.err = undefined;
        this.err_key = undefined;

        document.getElementById(`objectify-${key}`).classList.remove("err");
        document
          .getElementById(`objectify-${key}`)
          .classList.remove("backgrounderr");
      } else {
        // show err
        if (this.has_initial_input) {
          document.getElementById(`objectify-${key}`).classList.add("err");
          document
            .getElementById(`objectify-${key}`)
            .classList.add("backgrounderr");

          // triggers the real time error infomation to show the error
          this.err = err;
          this.err_key = key;

          // emit on error event
          this.$emit("onError", {
            err,
            key,
            data
          });
        }
      }
    },
    submit() {
      this.$emit("onSubmit", this.final_vanilla);
      this.set_btn_disable(true)
      this.btn_is_loading = true
      this.disable_all_fields = true
    },
    removeProp(prop_name) {
      const nc = this.copy(this.raw_data_set)

      this.$delete(nc,prop_name)
      if(Object.keys(nc).length == 0){
        this.$emit('onEmpty')
      }

      this.$emit('onRemoveProp',nc)
    },
    init() {
       // set theme if set by user
      if(this.config.theme) {
        if(typeof this.config.theme == 'string') {
          this.appearance = themeManager[this.config.theme]
        } else {
          this.appearance = this.config.theme 
        }

        this.ready = true
      } else if(!this.config.appearance) {
        this.appearance = themeManager.default
        this.ready = true
      }

      // set data
      this.raw_data_set = this.copy(this.config.data);
      this.$emit('onData',this.raw_data_set)

      

      // register multiple input fields
      const multipleInputFields = ['minmax']

      // assigning correct tab index
      if(this.config.operation == 'rw') {
        let dobuleTabIndexes = []
        this.data_keys = Object.keys(this.raw_data_set)
        this.data_keys.map((keys, index) => {
          const type = this.raw_data_set[keys].type
          if(multipleInputFields.includes(type)) {
            // multiple digit, a multiple input field
            this.tab_index_mapping.push(`${index},${index+1}`)
            this.tab_index_len = this.tab_index_mapping.length
            dobuleTabIndexes.push(index)
          } else {
            // single digit, a one input field
            this.tab_index_mapping.push(`${index}`)
          }
        })

        this.tab_index_mapping = miftm(this.tab_index_mapping)
        this.data_keys.map((k,ki) => {
          this.raw_data_set[k].tab_index = this.tab_index_mapping[ki]
          this.raw_data_set[k].render = true
        })

        const _ = this
        this.data_keys.map(key => {
          this.fields[key] = {
            // display's an error msg to selected input field
            postError(msg) {
              _.err = msg
              _.err_key = key
            },
            removeError() {
              _.err = undefined
              _.err_key = undefined
            },
            postInfoMsg(msg) {
              _.info_key = key
              _.info = msg
            },
            removeInfoMsg() {
              _.info = undefined
              _.info_key = undefined
            },
            pauseRender(cbCondition) {
              _.renderPaused = key
              cbCondition(() => {
                _.renderPaused = false
              }) 
            },
            // disable's input change
            lock() {
              _.disabled_field = key
            }
          }
        })

        this.form = {
          getCurrentFucos() {
            return _.isFucosed
          }
        }
      }
    }
  },
  mounted() {
    this.init()
  }
};
</script>

<style scoped >
.debugwin {
  overflow: auto;
  max-width: 300px;
}
.dq-button:disabled{
  background: gray !important;
  color: #333 !important;
  cursor: not-allowed;
}

@keyframes spin {
    from {
        transform:rotate(360deg);
    }
    to {
        transform:rotate(0deg);
    }
}
.spinning {
  animation-name: spin;
  animation-duration: 800ms; /* How long lasts 1 turn */
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
#disabler{
  background: rgba(77, 77, 77, 0.295);
  cursor: not-allowed;
}
div:focus {
  border: 1px solid rgba(211, 211, 211, 0.048);
}
</style>