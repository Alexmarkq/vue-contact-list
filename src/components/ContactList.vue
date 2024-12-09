<template>
  <div>
    <v-container>
      <v-card-title>
        Contact list
        <v-spacer />
        <!-- Botón para añadir nuevo contacto -->
        <v-btn
          rounded 
          small
          @click="newContactModal"
        >
          <v-icon 
            small 
            color="primary"
          >
            mdi-plus
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-text-field
        ref="searchField"
        v-model="search"
        label="Search"
        hide-details
        filled
      />
      <v-data-table
        :headers="headers"
        :items="filteredContacts"
        item-key="id"
        class="elevation-1"
        :search="search"
        :sort-by="['lastname']"
        :sort-desc="[false]"
        outlined
      >
        <template v-slot:[`item.email`]="{ item }">
          <template>
            <!-- Mostrar los primeros dos correos electrónicos como chips -->
            <v-chip
              v-for="(email, index) in item.email.slice(0, 2)"
              :key="index"
              color="orange"
              text-color="white"
              small
            >
              {{ email }}
            </v-chip>
            <!-- Chip indicativo de mails restantes -->
            <v-chip
              v-if="item.email.length > 2 && !showMoreMails"
              color="orange"
              text-color="white"
              small
              class="show-hide-chip"
              @click="showMoreMails=true"
            >         
              + {{ item.email.length - 2 }}
            </v-chip>           
            <v-chip
              v-for="(email, index) in item.email.slice(2)"
              v-show="showMoreMails"
              :key="'mail-' + index"
              color="orange"
              text-color="white"
              small
            >
              {{ email }}
            </v-chip>
            <v-chip
              v-if="item.email.length > 2 && showMoreMails"
              color="orange"
              text-color="white"
              small
              class="show-hide-chip"
              @click="showMoreMails=false"
            >         
              - {{ item.email.length - 2 }}
            </v-chip>
          </template>
        </template>

        <template v-slot:[`item.phoneNumber`]="{ item }">
          <template>
            <!-- Mostrar los primeros dos correos electrónicos como chips -->
            <v-chip
              v-for="(phone, index) in item.phoneNumber.slice(0, 2)"
              :key="index"
              color="orange"
              text-color="white"
              small
            >
              {{ phone }}
            </v-chip>
            <!-- Chip indicativo de mails restantes -->
            <v-chip
              v-if="item.phoneNumber.length > 2 && !showMorePhones"
              color="orange"
              text-color="white"
              small
              @click="showMorePhones=true"
            >         
              + {{ item.phoneNumber.length - 2 }}
            </v-chip>
            <v-chip
              v-for="(phone, index) in item.phoneNumber.slice(2)"
              v-show="showMorePhones"
              :key="'phoneNumber-' + index"
              color="orange"
              text-color="white"
              small
            >
              {{ phone }}
            </v-chip>
            <v-chip
              v-if="item.phoneNumber.length > 2 && showMorePhones"
              color="orange"
              text-color="white"
              small
              class="show-hide-chip"
              @click="showMorePhones=false"
            >         
              - {{ item.phoneNumber.length - 2 }}
            </v-chip>
          </template>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            rounded 
            small
            @click="editContactModal(item)"
          >
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-container>

    <!-- Modal para añadir o editar contacto -->
    <ContactForm
      ref="contactForm"
      :dialog.sync="dialog"
      :is-edit="isEdit"
      :contact-edition="contactEdition"
      @add-contact="addContact"
      @edit-contact="editContact"
    />
  </div>
</template>

<script>
/* eslint-disable no-console */

import ContactForm from './ContactForm.vue';

export default {
  name: "ContactList",
  components:{
    ContactForm
  },
  props: {
    contacts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localContacts: JSON.parse(JSON.stringify(this.contacts)),
      dialog: false,
      isEdit: false,
      search: '',
      contactEdition: {},
      showMoreMails: false,
      showMorePhones: false
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'firstname', sortable: false, align: 'center'},
        { text: 'Surname', value: 'lastname', sortable: false, align: 'center'},
        { text: 'Email', value: 'email', sortable: false, align: 'center'},
        { text: 'Phone number', value: 'phoneNumber', sortable: false, align: 'center'},
        { text: 'Actions', value: 'actions', sortable: false, align: 'center'},
      ];
    },

    // Filtrar contactos por nombre, apellido, email y teléfono
    filteredContacts() {
      const query = this.search.toLowerCase();

      return this.localContacts.filter(contact => {
        const matchFirstname = contact.firstname 
          ? contact.firstname.toLowerCase().includes(query) 
          : false;

        const matchLastname = contact.lastname 
          ? contact.lastname.toLowerCase().includes(query) 
          : false;

        const matchEmail = Array.isArray(contact.email) 
          ? contact.email.some(email => email ? email.toLowerCase().includes(query) : false)
          : false;

        const matchPhoneNumber = Array.isArray(contact.phoneNumber) 
          ? contact.phoneNumber.some(number => number ? number.toString().includes(query) : false)
          : false;

        return matchFirstname || matchLastname || matchEmail || matchPhoneNumber;
      });
    }
  },
  mounted() {
    // Asegura que el campo de búsqueda reciba el foco después de que el componente haya sido montado
    this.$refs.searchField.focus();
  },
  methods: {
    // Muestra el modal para crear un nuevo contacto y establece el estado de edición en false
    newContactModal() {
      this.dialog = true;
      this.isEdit = false;
    },

    // Función que recibe los datos del contacto del listado y los pasa al modal de edición
    editContactModal(contact) {
      this.dialog = true;
      this.isEdit = true;
      this.contactEdition = { ...contact };
    },

    // Función que agrega el nuevo contacto a la lista de contactos locales
    addContact(newContact) {
      this.localContacts.push(newContact)
    },

    // Actualiza un contacto existente en la lista de contactos locales
    editContact(editContact) {
      const index = this.localContacts.findIndex(
        contact => contact.id === editContact.id
      );
      if (index !== -1) {
        this.localContacts.splice(index, 1, editContact);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
