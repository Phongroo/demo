import {Link} from "react-router-dom";

const Pagetitle = (props) => {
    const {title, breadcrumbItems} = props;
    const currentLang = 'vi'

    return (
        <div className="row">
            <div className="col-12">
                <div className="page-title-box">
                    <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                            {breadcrumbItems?.map(item => {
                                return (
                                    <li key={item.label} className={(item.active ? 'active ' : ' ') + 'breadcrumb-item'}>
                                        {!item.active ?
                                            <Link
                                                to={item.path}>{currentLang === 'vi' ? item.label : item.labelEn}</Link> :
                                            <span>{currentLang === 'vi' ? item.label : item.labelEn}</span>
                                        }
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                    <h4 className="page-title">{title}</h4>
                </div>
            </div>
        </div>
    )
}
export default Pagetitle
