export default {
  findDirectory (item, items) {
    for (const childItem of items) {
      if (childItem.isDirectory) {
        if (childItem.id === item.id) {
          return childItem
        }
        return this.findDirectory(item, childItem.children)
      }
    }
    return undefined
  }
}
