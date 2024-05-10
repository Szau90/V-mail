<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input
        type="checkbox"
        :checked="allEmailSelected"
        :class="[someEmailSelected ? 'partial-check' : '']"
        @click="bulkSelect"
      />
    </span>
    <span class="buttons">
      <button
        @click="emailSelection.markRead()"
        :disabled="[...emailSelection.emails].every((e) => e.read)"
      >
        Mark read
      </button>
      <button
        @click="emailSelection.markUnread()"
        :disabled="[...emailSelection.emails].every((e) => !e.read)"
      >
        Mark unread
      </button>
      <button @click="emailSelection.archive()" :disabled="numberSelected === 0">Archive</button>
    </span>
  </div>
</template>

<script>
import useEmailSelection from '@/composables/useEmailSelection'
import { computed } from 'vue'

export default {
  setup(props) {
    const emailSelection = useEmailSelection()

    const numberSelected = computed(() => emailSelection.emails.size)

    const numberEmails = computed(() => props.emails.length)
    const allEmailSelected = computed(() => numberSelected.value == numberEmails.value)
    const someEmailSelected = computed(() => {
      return numberSelected.value > 0 && numberSelected.value < numberEmails.value
    })

    const bulkSelect = () => {
      if (allEmailSelected.value) {
        emailSelection.clear()
      } else {
        emailSelection.addMultiple(props.emails)
      }
    }
    return {
      allEmailSelected,
      someEmailSelected,
      bulkSelect,
      emailSelection,
      numberSelected
    }
  },
  props: {
    emails: {
      type: Array,
      required: true
    }
  }
}
</script>
