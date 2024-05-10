import {onBeforeUnmount} from 'vue'

 const useKeydown = (keyCombos) => {
    let onkeydown = (event) => {
        let keyCombo = keyCombos.find(keyCombo => keyCombo.key == event.key)
      if (keyCombo) {
       keyCombo.fn()
      }
    }

    window.addEventListener('keydown', onkeydown)

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onkeydown)
    })
}

export default useKeydown