export default {
  findDirectory (item, items) {
    for (const childItem of items) {
      if (childItem.isDirectory) {
        if (childItem.id === item.id) {
          return childItem
        }
        const nestedItem = this.findDirectory(item, childItem.children)
        if (nestedItem) {
          return nestedItem
        }
      }
    }
    return undefined
  },
  indexOfTheme (items, id) {
    let index = -1
    items.some((element, curIdx) => {
      if (element.id === id) {
        index = curIdx
        return true
      }
    })
    return index
  },
  idndexOfDirectoryOrInvCard (items, id, isDirectory) {
    let index = -1
    items.some((element, curIdx) => {
      if ((isDirectory ? element.isDirectory : element.isInventoryCard) && element.id === id) {
        index = curIdx
        return true
      }
    })
    return index
  },
  enrichTheme (item) {
    item.isTheme = true
    item.children = []
    item.name = item.themeName + ' ' + item.cipher
    return item
  },
  enrichDirectory (item) {
    item.isDirectory = true
    item.children = []
    item.name = item.directoryName
    return item
  },
  enrichInvCard (item) {
    item.isInventoryCard = true
    item.name = item.cardName + ' ' + item.designation
    return item
  }
}
