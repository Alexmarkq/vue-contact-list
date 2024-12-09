
<template>
  <v-dialog 
    v-model="localDialog" 
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? 'Edit Contact' : 'New Contact' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="localContact.firstname"
            label="First Name"
            :rules="[rules.required, rules.maxLength(50)]"
            required
            clearable
            class="firstname-field"
          />
          <v-text-field
            v-model="localContact.lastname"
            label="Last Name"
            :rules="[rules.required , rules.maxLength(50)]"
            required
            clearable
            class="lastname-field"
          />
          <v-row 
            v-for="(email, index) in localContact.email" 
            :key="'email-' + index" 
            align="center"
            class="mail-field"
          >
            <v-col 
              class="form-col__no-padding"
            >
              <v-text-field
                :label="'Email ' + (index + 1)"
                :rules="[rules.required, rules.email, rules.minLength(6), rules.maxLength(100)]"
                :value="email"
                clearable
                @input="updateField('email', index, $event)"
              />
            </v-col>                      
            <v-col 
              v-if="index === 0"
              cols="auto"
            >
              <v-btn
                rounded 
                small                
                @click="addField('email')"
              >
                <v-icon small>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>

            <v-col
              v-else-if="localContact.email.length > 1"
              cols="auto"
            >
              <v-btn 
                rounded 
                small
                @click="removeField('email', index)"
              >
                <v-icon color="red">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row 
            v-for="(phone, index) in localContact.phoneNumber" 
            :key="'phone-' + index" 
            align="center"
          >
            <v-col 
              class="form-col__no-padding"
            >
              <v-text-field
                :label="'Phone Number ' + (index + 1)"
                :rules="[rules.required, rules.minLength(6), rules.maxLength(20)]"
                :value="phone"
                clearable
                type="number"
                hide-spin-buttons
                @input="updateField('phoneNumber', index, $event)"
              />
            </v-col>                      
            <v-col 
              v-if="index === 0"
              cols="auto"
            >
              <v-btn
                rounded 
                small                
                @click="addField('phoneNumber')"
              >
                <v-icon small>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>

            <v-col 
              v-if="localContact.phoneNumber.length > 1 && index > 0" 
              cols="auto"
            >
              <v-btn 
                rounded 
                small
                @click="removeField('phoneNumber', index)"
              >
                <v-icon color="red">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn 
          color="error" 
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn 
          @click="handleSaveContact"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validation } from '@/mixins/validation';

export default {
  mixins: [validation],
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    contactEdition: {
      type: Object,
      required: true,      
    }
  },
  data() {
    return {
      localContact: {
        firstname: '',
        lastname: '',
        email: [''],
        phoneNumber: ['']
      },
    };
  },
  computed: {
    localDialog: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit('update:dialog', value);
      }
    }
  },
  watch: {
    contactEdition(newVal) {
      // Crea una copia profunda del contacto para evitar referencias mutables
      this.localContact = JSON.parse(JSON.stringify(newVal));
    },
    dialog(val) {
      this.localDialog = val;
      if (val) {
      // Asegura que el formulario se inicialice después de que el diálogo se haya abierto y el DOM se haya actualizado
        this.$nextTick(() => {
          this.initializeForm();
        });
      }
    }
  },
  methods: {
    closeDialog() {
      this.localDialog = false;
    },

    initializeForm() {
      if (!this.isEdit) {
        this.$refs.form.resetValidation()
        this.localContact = {
          firstname: '',
          lastname: '',
          email: [''],
          phoneNumber: ['']
        };
    }},

    // Si la validación es correcta añade un nuevo contacto o lo edita
    handleSaveContact() {
      if (this.$refs.form.validate()) {
        this.isEdit ? this.editContact() : this.addContact();
        this.closeDialog();
      }
    },

    // Emite un evento para agregar un nuevo contacto con una ID única basada en la fecha actual
    addContact() {
      this.$emit('add-contact', { ...this.localContact, id: Date.now() });
    },

    // Emite un evento para editar un contacto existente con los datos actuales
    editContact() {
      this.$emit('edit-contact', { ...this.localContact });
    },

    // Función que agrega un nuevo campo de correo/teléfono
    addField(type) {
      if (type === 'email') {
        this.localContact.email.push('');
      } else if (type === 'phoneNumber') {
        this.localContact.phoneNumber.push('');
      }
    },

    // Función que elimina un campo de correo/teléfono
    removeField(type, index) {
      if (type === 'email') {
        if (this.localContact.email.length > 1) {
          this.localContact.email.splice(index, 1);
        }
      } else if (type === 'phoneNumber') {
        if (this.localContact.phoneNumber.length > 1) {
          this.localContact.phoneNumber.splice(index, 1);
        }
      }
    },

    // Función que actualiza el correo/teléfono
    updateField(type, index, newValue) {
      if (type === 'email') {
        this.$set(this.localContact.email, index, newValue);
      } else if (type === 'phoneNumber') {
        this.$set(this.localContact.phoneNumber, index, newValue);
      }
    }
  },
};
</script>

<style lang="scss" scoped></style>



          
