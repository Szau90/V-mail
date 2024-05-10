<template>
  <button @click="selectScreen('inbox')" :disabled="selectedScreen == 'inbox'">Inbox</button>
  <button @click="selectScreen('archived')" :disabled="selectedScreen == 'archived'">
    Archived
  </button>
  <BulkActionBar :emails="filteredEmails" />
  <table class="mail-table">
    <tbody>
      <tr
        v-for="email in filteredEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
      >
        <td>
          <input
            type="checkbox"
            @click="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)"
          />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p>
            <strong>{{ email.subject }}</strong
            >- {{ email.body }}
          </p>
        </td>
        <td @click="openEmail(email)" class="date">
          {{ format(new Date(email.sentAt), 'MMM-do-yyyy') }}
        </td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView @changeEmail="changeEmail" :email="openedEmail" />
  </ModalView>
</template>

<script>
import { format } from 'date-fns'
import { ref } from 'vue'
import axios from 'axios'
import MailView from '@/components/MailView.vue'
import ModalView from '@/components/ModalView.vue'
import useEmailSelection from '@/composables/useEmailSelection'
import BulkActionBar from '@/components/BulkActionBar.vue'

export default {
  async setup() {
    const { data: emails } = await axios.get('http://localhost:3000/emails')

    return {
      format,
      emails: ref(emails),
      openedEmail: ref(null),
      emailSelection: useEmailSelection(),
      selectedScreen: ref('inbox')
    }
  },
  computed: {
    sortedEmails() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1
      })
    },
    filteredEmails() {
      if (this.selectedScreen === 'inbox') {
        return this.sortedEmails.filter((e) => !e.archived)
      } else {
        return this.sortedEmails.filter((e) => e.archived)
      }
    }
  },
  methods: {
    selectScreen(newScreen) {
      this.selectedScreen = newScreen
      this.emailSelection.clear()
    },
    openEmail(email) {
      this.openedEmail = email
      if (email) {
        email.read = true
        this.updateEmail(email)
      }
    },
    archiveEmail(email) {
      email.archived = true
      this.updateEmail(email)
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    },
    changeEmail({ toogleRead, toggleArchive, save, closeModal, changeIndex }) {
      const email = this.openedEmail
      if (toogleRead) {
        email.read = !email.read
      }
      if (toggleArchive) {
        email.archived = !email.archived
      }
      if (save) {
        this.updateEmail(email)
      }
      if (closeModal) {
        this.openedEmail = null
      }
      if (changeIndex) {
        const emails = this.filteredEmails
        const currentIndex = emails.indexOf(this.openedEmail)
        const newEmail = emails[currentIndex + changeIndex]
        this.openEmail(newEmail)
      }
    }
  },
  components: {
    MailView,
    ModalView,
    BulkActionBar
  }
}
</script>
