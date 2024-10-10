let storage = []
let globalId = 1

const eventsService = {
    subscribe: (name, sub) => {
        let item = {
            name,
            sub,
            id: globalId++
        }
        storage.push(item)
        return () => {
            storage = storage.filter((i) => i.id != item.id)
        }
    },
    call: (name) => {
        return (...params) => {
            setTimeout(() => {
                storage
                    .filter((item) => item.name == name)
                    .forEach((item) => {
                        try {
                            item.sub(...params)
                        } catch (err) {
                            console.log(err)
                        }
                    })
            }, 1)
        }
    }
}

export default eventsService
