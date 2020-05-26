/** v-dialogdrag */
const drag = {
  name: 'drag',
  rx: 0,
  ry: 0,
  value: {
    bind(el, binding, vnode) {
      if (binding.value === 'dialog') {
        const header = el.querySelector('.el-dialog__header')
        const dialog = el.querySelector('.el-dialog')
        const d = drag
        header.style.cursor = 'move'
        header.onmousedown = function(ev) {
          const { top, left, right, bottom } = dialog.getBoundingClientRect()
          const leftBoundary = -left + d.rx
          const rightBoundary = window.innerWidth - right + d.rx
          const topBoundary = -top + d.ry
          const bottomBoundary = window.innerHeight - bottom + d.ry

          let offsetX, offsetY
          offsetX = ev.clientX - d.rx
          offsetY = ev.clientY - d.ry
          document.onmousemove = function(ev) {
            d.rx = ev.clientX - offsetX
            d.ry = ev.clientY - offsetY
            if (d.rx < leftBoundary) {
              d.rx = leftBoundary
            } else if (d.rx > rightBoundary) {
              d.rx = rightBoundary
            }
            if (d.ry < topBoundary) {
              d.ry = topBoundary
            } else if (d.ry > bottomBoundary) {
              d.ry = bottomBoundary
            }
            dialog.style.transform = `translate(${d.rx}px, ${d.ry}px)`
            return false
          }
          document.onmouseup = function() {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    },
    update(el, binding, vnode) {
      if (!vnode.child.visible) {
        const dialog = el.querySelector('.el-dialog')
        setTimeout(() => {
          dialog.style.transform = `translate(0, 0)`
          drag.rx = 0
          drag.ry = 0
        }, 200)
      }
    }
  }
}

export default [drag]