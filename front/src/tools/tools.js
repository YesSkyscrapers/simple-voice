const waitFor = (delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}

const getAllPages = async (api, pageSize) => {
    let page = 0
    let data = []
    let shouldStop = false

    while (!shouldStop) {
        let pageData = await api({
            pageIndex: page,
            pageSize
        })
        data = data.concat(pageData)
        shouldStop = pageData.length < pageSize
    }

    return data
}

export { waitFor, getAllPages }
