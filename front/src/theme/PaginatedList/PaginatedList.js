import './PaginatedList.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Spinner } from 'react-activity'
import eventsService from '../../tools/eventsService'

const PAGE_SIZE = 10

const PaginatedList = (props) => {
    const { api, renderItem, HeaderComponent, filters, name = 'stub' } = props

    const page = useRef(0)
    const isEndReached = useRef(false)

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const activeRequestsIdentifier = useRef(0)

    const downloadPage = useCallback(
        (_page) => {
            setIsLoading(true)
            page.current = _page

            const requestId = activeRequestsIdentifier.current
            api(
                {
                    pageIndex: page.current,
                    pageSize: PAGE_SIZE
                },
                filters
            )
                .then((response) => {
                    if (activeRequestsIdentifier.current !== requestId || !response) {
                        return
                    }
                    if (response.data.length === 0) {
                        isEndReached.current = true
                    } else {
                        setData((prevData) => prevData.concat(response.data))

                        if (response.data.length < PAGE_SIZE) {
                            isEndReached.current = true
                        } else {
                            setTimeout(() => {
                                const { scrollTop, clientHeight, scrollHeight } = document.documentElement

                                if (scrollTop === 0 && clientHeight === scrollHeight) {
                                    downloadPage(page.current + 1)
                                }
                            }, 100)
                        }
                    }
                })
                .finally(() => {
                    if (activeRequestsIdentifier.current !== requestId) {
                        return
                    }
                    setIsLoading(false)
                })
        },
        [api, filters]
    )

    useEffect(() => {
        isEndReached.current = false
        setData([])

        downloadPage(0)
    }, [filters, api])

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement

            if (scrollTop + clientHeight >= scrollHeight - 1000) {
                if (!isLoading && !isEndReached.current) {
                    downloadPage(page.current + 1)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [isLoading])

    const onDelete = useCallback(
        (item, field = 'id') => {
            setData((prev) => prev.filter((i) => i[field] != item[field]))
        },
        [data]
    )

    const onChange = useCallback(
        (item, field = 'id') => {
            setData((prev) =>
                prev.map((i) => {
                    if (i[field] != item[field]) {
                        return i
                    } else {
                        return item
                    }
                })
            )
        },
        [data]
    )

    const onAdd = useCallback(
        (item, toEnd) => {
            setData((prev) => (toEnd ? [item].concat(prev) : prev.concat([item])))
        },
        [data]
    )

    const onRefresh = useCallback(() => {
        isEndReached.current = false
        setData([])
        downloadPage(0)
    }, [])

    useEffect(() => {
        let unsubs = []
        unsubs.push(eventsService.subscribe(name + 'Delete', onDelete))
        unsubs.push(eventsService.subscribe(name + 'Change', onChange))
        unsubs.push(eventsService.subscribe(name + 'Add', onAdd))
        unsubs.push(eventsService.subscribe(name + 'Refresh', onRefresh))

        return () => {
            unsubs.forEach((i) => i())
            activeRequestsIdentifier.current++
        }
    }, [])

    return (
        <div className="ListContainer">
            {HeaderComponent && <div className="ListHeaderContainer">{HeaderComponent}</div>}

            {data.map((item, index) => {
                return (
                    <div key={item?.id || index}>{renderItem({ item, index, isLast: index === data.length - 1 })}</div>
                )
            })}
            {isLoading ? (
                <div className="PaginatedListLoader">
                    <Spinner size={13} />
                </div>
            ) : null}
        </div>
    )
}

export default PaginatedList
