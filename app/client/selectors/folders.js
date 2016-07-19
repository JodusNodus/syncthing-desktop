export const getFolder = ({folders}, id) => folders
.filter(x => x.id == id)[0]
