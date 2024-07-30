import {useEffect, useState} from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import InputComponent from "../../../../shared/component/input/InputComponent";
import {Form} from "reactstrap";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import Pagination from "react-js-pagination";
import api from "../../../../utils/api";
import request from "../../../../utils/request";
import {checkPermission} from "../../../../utils/app.util";
import {CREATE} from "../../../../constants/permissionTypes";
import moment from "moment";
import APIManagementAction from "./ApiManagementAction";

const APIManagement = (props) => {
    const breadcrumbItems = [
        {label: "Home page", path: "/NWF/home-page"},
        {label: "APIManagement", path: "/NWF/Category Management/APIManagement", active: true},
    ];


    const [mode, setMode] = useState("TABLE");
    const [isCollapsed, setIsCollapsed] = useState(true);

    const [name, setName] = useState();
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [item, setItem] = useState();
    const [type, setType] = useState();
    const [searchForm, setSearchForm] = useState();
    const [listApi, setListApi] = useState();
    const [loading, setLoading] = useState(false);
    const [totalRecord, setTotalRecord] = useState(0);
    const [method, setMethod] = useState();


    useEffect(() => {
        const searchForm = {
            status,
            name,
        };

        getPaging();

        setSearchForm(searchForm);
    }, [status, name]);

    useEffect(() => {
        getPaging();

    }, [])


    function onUpdate(type, item) {
        setMode("ACTION");
        setType(type);
        setItem(item);
    }

    const initForm = (isReset = false) => {
        const form = {
            ...searchForm,
        };

        if (isReset) {
            setName("");
            setStatus("");

            form.name = "";
            form.status = "";
        }

        search(form);
    };


    const search = (form) => {
        setLimit(10);
        setPage(1);
        getPaging(1, 10, form);
    };

    function onPageChange(pageNum) {
        setPage(pageNum);
        getPaging(pageNum, limit);
    }


    const getPaging = (pageNum = page, pageSize = limit) => {
        setLoading(true);

        const json = {
            page: pageNum,
            limit: pageSize,
        };

        request
            .post(api.PAGING_API_REQUEST, json)
            .then((res) => {
                if (res) {
                    setLoading(false);
                    setListApi(res.data);
                    setTotalRecord(res.totalRecord);
                } else {
                    setListApi([]);
                    setTotalRecord(0);
                }
            })
            .catch((err) => setLoading(false));
    };


    return (
        <div className="container-fluid">
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý biểu mẫu"}>
            </Pagetitle>
            {mode === "TABLE" ? (
                    <div className="row">
                        <div className="col-12 card-box">
                            <fieldset>
                                <legend><a
                                    onClick={() => {
                                        setIsCollapsed(!isCollapsed);
                                    }}>
                                    Tìm kiếm thông tin
                                    <i aria-hidden="true"
                                       className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}></i>
                                </a></legend>

                                {isCollapsed && (
                                    <Form>
                                        <div className="row">
                                            <div className="col-4">
                                                <InputComponent title={"Tên tiếng việt"} name="name" value={name}
                                                                onChange={(val) => setName(val)}></InputComponent>
                                            </div>

                                            <div className="col-4">
                                                <SelectComponent

                                                    name={"method"}
                                                    title={"Loại khiếu nại"}
                                                    list={[
                                                        {value: "GET", name: "GET", nameEn: "GET"},
                                                        {value: "POST", name: "POST", nameEn: "POST"},
                                                    ]}
                                                    bindLabel={"name"}
                                                    bindValue={"value"}
                                                    value={method}
                                                    onChange={(val) => {
                                                        setMethod(val?.value);
                                                    }}></SelectComponent>
                                            </div>


                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-6">
                                                <button
                                                    disabled={!checkPermission(CREATE)}
                                                    onClick={() => {
                                                        onUpdate("create", item);
                                                    }}
                                                    className="btn btn-primary"
                                                    type="button">
                                                    <i className="fas fa-plus mr-1"></i>
                                                    <span className="text-button">Tạo mới</span>
                                                </button>
                                            </div>
                                            <div className="col-6 text-right">
                                                <button onClick={() => initForm(true)} className="btn btn-secondary"
                                                        type="button">
                                                    <i className="fas fa-undo-alt mr-1"></i>
                                                    <span className="text-button">Làm mới</span>
                                                </button>
                                                <button onClick={() => search(searchForm)}
                                                        className="btn btn-primary ml-1" type="button">
                                                    <i className="fas fa-search mr-1"></i>
                                                    <span className="text-button">Tìm kiếm</span>
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </fieldset>

                            <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
                                <span className="font-weight-medium theme-color">Danh sách biểu mẫu</span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-sm table-hover m-w-tabble">
                                    <thead>
                                    <tr className="m-header-table">
                                        <th className="text-center align-middle mw-200">Tạo API</th>
                                        <th className="text-center align-middle mw-250">Đường dẫn</th>
                                        <th className="text-center align-middle mw-150">Phương thức</th>
                                        <th className="text-center align-middle mw-150">Loại API</th>
                                        <th className="text-center align-middle mw-50">Loại API Form</th>
                                        <th className="text-center align-middle mw-50">Ngày tạo</th>
                                        <th className="text-center align-middle mw-50">Hành động</th>

                                    </tr>
                                    </thead>

                                    <tbody>
                                    {(!listApi || listApi.length <= 0) && (
                                        <tr>
                                            <td className="text-center align-middle" colSpan="10">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}

                                    {listApi?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="align-middle">
                                                    <span>{item?.name}</span>
                                                </td>
                                                <td className="align-middle">
                                                    <span>{item?.url}</span>
                                                </td>
                                                <td className="align-middle text-center">
                                                    <span>{item?.method}</span>
                                                </td>
                                                <td className="align-middle text-center">
                                                    <span>{item?.type}</span>
                                                </td>
                                                <td className="align-middle text-center">
                                                    <span>{item?.endpointType}</span>
                                                </td>
                                                <td className="align-middle">
                                                    <span>{item?.createDate ? moment(item?.createDate).format("DD/MM/yyyy") : ""}</span>
                                                </td>

                                                <td className="align-middle text-center">
                                                    <i class="fas fa-edit fa-lg m-cursor mr-1 text-primary"></i>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                    </tbody>
                                </table>
                            </div>


                            <div className="float-right">
                                <Pagination
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    activePage={page}
                                    itemsCountPerPage={limit}
                                    totalItemsCount={totalRecord}
                                    pageRangeDisplayed={5}
                                    onChange={(pageNum) => onPageChange(pageNum)}
                                />
                            </div>
                        </div>
                    </div>

                ) :
                (
                    <APIManagementAction>

                    </APIManagementAction>

                )
            }


        </div>
    )
}

export default APIManagement
