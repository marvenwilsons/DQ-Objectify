<template>
  <div>
    <input
      @focus="$emit('onFucos',_key), inputIsActive = true"
      @blur="inputIsActive = false"
      :disabled="disabled"
      :tabindex="parseInt(key_index)"
      :style="{border:'none',outline:'none', color:color.color}"
      v-model="text_input_model"
      class="fullwidth dq-inp-objtfy padleft050"
      :type="data.mode ? data.mode : 'text'"
      :placeholder="text_placehoder"
    />
  </div>
</template>

<script>
export default {
  props: ["data", "_key", "color", "key_index", "disabled"],
  data: () => ({
    text_input_model: undefined,
    text_placehoder: undefined,
    inputIsActive: false,
    string_validation: {
      minChar(val, arg, err) {
        if (val.length > arg.minChar) {
          return {
            status: true
          };
        } else {
          err({
            Msg: `Character length is lesser than the defined minimum of ${arg.minChar} characters required`,
            App: "objectfySingle",
            onMethod: "change"
          });
          return {
            status: false,
            msg: `Character length is lesser than the defined minimum of ${arg.minChar} characters required`
          };
        }
      },
      maxChar(val, arg, err) {
        if (val.length < arg.maxChar) {
          return {
            status: true
          };
        } else {
          err({
            Msg: `Character length is greater than the defined maximum character required`,
            App: "objectfySingle",
            onMethod: "change"
          });
          return {
            status: false,
            msg:
              "Character length is greater than the defined maximum character required"
          };
        }
      },
      allowSpecialChars(val, arg, err) {
        if (!arg.allowSpecialChars) {
          const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/gim;
          if (regex.exec(val) != null) {
            err({
              Msg: `Special character detected`,
              App: "objectfySingle",
              onMethod: "change"
            });
            return {
              status: false,
              msg: "Special character detected"
            };
          } else {
            return {
              status: true
            };
          }
        }
      },
      allowWhiteSpace(val, arg, err) {
        if (!arg.allowWhiteSpace) {
          if (val.indexOf(" ") != -1) {
            err({
              Msg: `White space detected`,
              App: "objectfySingle",
              onMethod: "change"
            });
            return {
              status: false,
              msg: "White space detected"
            };
          } else {
            return {
              status: true
            };
          }
        }
      }
    }
  }),
  computed: {
    raw_data_set() {
      return this.data;
    },
    final() {}
  },
  watch: {
    text_input_model(current_string_being_input, prev_string_input) {
      // validation set
      const validationSet = new Set([
        "minChar",
        "maxChar",
        "allowSpecialChars",
        "allowWhiteSpace"
      ]);

      const final = Object.keys(this.data).map(e => {
        if (validationSet.has(e)) {
          const exec = this.string_validation[e](
            current_string_being_input,
            this.data,
            err => this.$emit("onError", err)
          );

          if (exec) {
            if (!exec.status) {
              return (this.validation_err = exec.msg);
            }
          }
        }
      });

      let err = undefined

      if (final.every(e => {
        if(e == undefined) {
          return true
        } else {
          err = e
          return false
        }
      })) {
        if(this.inputIsActive == true) {
          console.log('emitting')
          this.$emit("onChange", {
            err: null,
            data: current_string_being_input,
            key: this._key
          });
        }
      } else {
        this.$emit("onChange", {
          err: err,
          data: null,
          key: this._key
        })
      }
    }
  },
  mounted() {
    if(!this.data.value){
      this.text_placehoder = 'none'
    } else {
      this.text_input_model = this.data.value
    }
  }
};
</script>

<style>
.dq-inp-objtfy {
  background: transparent;
}
</style>