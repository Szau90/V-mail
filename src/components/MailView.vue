<template>
  <div class="email-display">
    <div>
      <button @click="toogleArchive()">
        {{ email.archived ? 'Move to inbox (a)' : 'Archive (a)' }}
      </button>
      <button @click="toogleRead()">
        {{ email.read ? 'Mark as unread (r)' : 'Mark read (r)' }}
      </button>
      <button @click="goNewer()">Newer (k)</button>
      <button @click="goOlder()">Older (j)</button>
    </div>
    <h2>
      Subject: <strong>{{ email.subject }}</strong>
    </h2>
    <div>
      <em>From: {{ email.from }} on {{ format(new Date(email.sentAt), 'MMM-do-yyyy') }}</em>
    </div>
    <div v-html="marked(email.body)"></div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { marked } from 'marked'
import useKeydown from '@/composables/useKeydown'

export default {
  props: {
    email: {
      type: Object,
      required: true
    }
  },
  setup(props, {emit}) {
  

const toogleRead = () => {
emit('changeEmail', {toogleRead: true, save: true})
}
const toogleArchive = () => {
emit('changeEmail', {toogleArchive: true, save: true, closeModal: true})
}
const goNewer = () => {
emit('changeEmail', {changeIndex: -1})
}
const goOlder = () => {
emit('changeEmail', {changeIndex: 1})
}
const goNewerAndArchive = () => {
emit('changeEmail', {changeIndex: -1, toogleArchive: true, save:true})
}
const goOlderAndArchive = () => {
emit('changeEmail', {changeIndex: -1, toogleArchive: true, save: true})
}
    useKeydown([
      {
        key: 'r',
        fn: toogleRead
      },
      {
        key: 'a',
        fn: toogleArchive
      },
      {
        key: 'k',
        fn: goNewer
      },
      {
        key: 'j',
        fn: goOlder
      },
      {
        key: '[',
        fn: toogleArchive
      },
      {
        key: ']',
        fn: toogleArchive
      },
    ])
    return {
      emit,
      format,
      marked,
      toogleRead,
      toogleArchive,
      goNewer,
      goOlder,
      goNewerAndArchive,
      goOlderAndArchive
    }
  }
}
</script>

<style lang="scss" scoped></style>
