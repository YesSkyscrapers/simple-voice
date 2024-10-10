import { Children, useState } from 'react'
import './Tabbar.css'

const Tabbar = ({ titles, children, defaultIndex = 0, HeaderLeftComponent }) => {
    const [selectedTab, selectTab] = useState(defaultIndex)

    return (
        <div className="Container">
            <div className="Header">
                {titles.map((title, index) => {
                    return (
                        <div
                            key={`title_${index}`}
                            className={`HeaderTitle Button ${index === 0 ? '' : 'HeaderTitleLeftBorder'} ${
                                selectedTab === index ? 'HeaderTitleSelected' : ''
                            }`}
                            onClick={() => selectTab(index)}
                        >
                            {title}
                        </div>
                    )
                })}
            </div>
            <div className="TabbatContentContainer">
                {Children.map(children, (child, index) => {
                    return (
                        <div
                            key={`content_${index}`}
                            className={`TabbarContent ${index === selectedTab ? '' : 'TabbarContentHidden'}`}
                        >
                            {child}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Tabbar
