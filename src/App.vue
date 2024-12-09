<template>
  <v-app>
    <div 
      id="app" 
      data-app="true"
    >
      <ContactList :contacts="contacts" />
    </div>
  </v-app>
</template>

<script>
import ContactList from "@/components/ContactList";
import contacts from './assets/contacts.json'

export default {
  name: 'App',
  components: {
    ContactList,
  },
  data() {
    return {
      contacts,
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
