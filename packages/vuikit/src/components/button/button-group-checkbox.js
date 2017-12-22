import toArray from '@vuikit/core/utils/to-array'
import includes from '@vuikit/core/utils/includes'
import { warn } from '@vuikit/core/helpers/debug'

export default {
  functional: true,
  render (h, { data, props, children, listeners }) {
    const buttons = children.filter(n => n.tag)

    if (!validate(data, buttons)) {
      return
    }

    const groupValue = toArray(data.model.value)

    buttons.forEach(btn => {
      const index = buttons.indexOf(btn)
      const value = btn.data.attrs.value
      const isActive = includes(groupValue, value)

      if (isActive) {
        btn.data.class.push('uk-active')
      }

      // on click toggle value
      btn.data.on = {
        click: () => {
          if (isActive) {
            groupValue.splice(index, 1)
          } else {
            groupValue.splice(index, 0, value)
          }

          listeners.input(groupValue)
        }
      }
    })

    return h('div', {
      class: ['uk-button-group']
    }, [
      children
    ])
  }
}

function validate (data, buttons) {
  // check group def
  if (!data.model) {
    warn('ButtonGroupCheckbox declaration is missing the v-model directive.')
    return false
  }

  // check buttons def
  const btnValues = buttons.map(btn => btn.data.attrs.value)
  if (includes(btnValues, undefined)) {
    warn(`Some of the ButtonGroupCheckbox buttons declaration is missing the 'value' prop.`)
    return false
  }

  return true
}