import React, {useEffect, useState} from "react";
import {checkPermission, ListPage, Toast, TypeToast} from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import {Form} from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import {CREATE, UPDATE} from "../../../../constants/permissionTypes";
import Pagination from "react-js-pagination";
import RoleManagementAction from "../../portal/role/RoleManagementAction";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import ReceivingInterestAction from "./ReceivingInterestAction";

const ReceivingInterest = () =>{const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    { label: "Receiving Interest", path: "/NWF/category/receiving-interest", active: true },
];

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [mode, setMode] = useState("TABLE");

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(2);

    const [totalRecords, setTotalRecords] = useState(0);

    const [list, setList] = useState([]);

    const [listPage, setListPage] = useState(ListPage);
    const [item, setItem] = useState();

    // form
    const [searchForm, setSearchForm] = useState();
    const [name, setName] = useState();
    const [code, setCode] = useState();
    const [status, setStatus] = useState();

    // action
    const [type, setType] = useState();

    const language = "vi";
    const listStatus = [
         {label: 'Hoạt động', value: "Y"},
        { label: "Không hoạt động", value: "N" },
    ];

    useEffect(() => {
        initForm();
    }, []);

    useEffect(() => {
        const searchForm = {
            code,
            name,
            status,
        };
        setSearchForm(searchForm);
    }, [code, name,status]);

    const initForm = (isReset = false) => {
        const form = {
            ...searchForm,
        };

        if (isReset) {
            setCode("");
            setName("");
            setStatus("");

            form.code = "";
            form.name = "";
            form.status = "";
        }

        search(form);
    };

    function onPageChange(pageNum) {
        setPage(pageNum);
        getAllByCondition(pageNum, limit,searchForm);
    }

    function changeLimit() {
        getAllByCondition();
    }

    function onUpdate(item) {
        setMode("ACTION");
        setItem(item);
    }

    const search = (form) => {
        setLimit(2);
        setPage(1);
        getAllByCondition(1, 2, form);
    };

    const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
        setLoading(true);

        const json = {
            code: values?.code,
            name: values?.name,
            status:values?.status,
            page: pageNum,
            limit: pageSize,
        };
        console.log("json", json);

        request.post(api.GET_RECEIVING_INTEREST_BY_CONDITION, json).then((res) => {
            setLoading(false);
            if (res && res.data) {
                setList(res.data);
                setTotalRecords(res.totalRecord);
            } else if (res.errorCode === "1") {
                Toast(res.errorDesc, TypeToast.ERROR);
            } else {
                Toast("Get data failed", TypeToast.ERROR);
            }
        });
    };

    return (
        <div className="container-fluid">
                <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý hình thức nhận lãi"}></Pagetitle>
                {mode === "TABLE" ? (
                    <div className="row">
                        <div className="col-12 card-box">
                            <fieldset>
                                <legend>
                                    <a
                                        onClick={() => {
                                            setIsCollapsed(!isCollapsed);
                                        }}>
                                        Tìm kiếm thông tin
                                        <i aria-hidden="true" className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}></i>
                                    </a>
                                </legend>

                                {isCollapsed && (
                                    <Form>
                                        <div className="row mb-2">
                                            <div className="col-4">
                                                <InputComponent title={"Mã"} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
                                            </div>
                                            <div className="col-4">
                                                <InputComponent title={"Tên"} name="name" value={name} onChange={(val) => setName(val)}></InputComponent>
                                            </div>
                                            <div className="col-4">
                                                <SelectComponent
                                                    firstRecord={{
                                                        label: "Tất cả",
                                                        value: "",
                                                    }}
                                                    name={"status"}
                                                    title={"Trạng thái"}
                                                    list={listStatus}
                                                    bindLabel={"label"}
                                                    bindValue={"value"}
                                                    value={status}
                                                    onChange={(val) => {
                                                        setStatus(val?.value);
                                                    }}></SelectComponent>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <button
                                                    hidden={!checkPermission(CREATE)}
                                                    onClick={() => {
                                                        setMode("ACTION");
                                                    }}
                                                    className="btn btn-primary"
                                                    type="button">
                                                    <i className="fas fa-plus mr-1"></i>
                                                    <span className="text-button">Tạo mới</span>
                                                </button>
                                            </div>
                                            <div className="col-6 text-right">
                                                <button onClick={() => initForm(true)} className="btn btn-secondary" type="button">
                                                    <i className="fas fa-undo-alt mr-1"></i>
                                                    <span className="text-button">Làm mới</span>
                                                </button>
                                                <button onClick={() => search(searchForm)} className="btn btn-primary ml-1" type="button">
                                                    <i className="fas fa-search mr-1"></i>
                                                    <span className="text-button">Tìm kiếm</span>
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </fieldset>

                            <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
                                <span className="font-weight-medium theme-color">Danh sách hình thức nhận lãi</span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-sm table-hover m-w-tabble">
                                    <thead>
                                    <tr className="m-header-table">
                                        <th className="text-center align-middle">STT</th>
                                        <th className="text-center align-middle mw-100">Mã</th>
                                        <th className="text-center align-middle mw-200">Tên</th>
                                        <th className="text-center align-middle mw-200">Tên tiếng anh</th>
                                        <th className="text-center align-middle">Trạng thái</th>
                                        <th className="text-center align-middle">Ghi chú</th>
                                        <th className="text-center align-middle mw-100">Thao tác</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {(!list || list.length <= 0) && (
                                        <tr>
                                            <td className="text-center align-middle" colSpan="10">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                    {list?.map((item, i) => {
                                        return (
                                            <tr key={item?.id}>
                                                <td className="text-center align-middle">{limit * (page - 1) + i + 1}</td>
                                                <td className="align-middle">{item?.code}</td>
                                                <td className="align-middle">{item?.name}</td>
                                                <td className="align-middle">{item?.nameEn}</td>

                                                <td className="align-middle text-center">
                                                    {item?.status == "Y" ? <i class="fas fa-check-circle text-success"></i> : <i class="fas fa-times-circle text-danger"></i>}
                                                </td>
                                                <td className="align-middle">{item?.note}</td>
                                                <td className="align-middle text-center">
                                                        <span hidden={!checkPermission(UPDATE)} onClick={() => onUpdate(item)} className="text-info m-cursor">
                                                            <i className="fas fa-pencil-alt"></i>
                                                        </span>
                                                </td>
                                            </tr>
                                        );
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
                                    totalItemsCount={totalRecords}
                                    pageRangeDisplayed={5}
                                    onChange={(pageNum) => onPageChange(pageNum)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <ReceivingInterestAction
                        item={item}
                        passEntry={(res) => {
                            initForm(true);
                            getAllByCondition();
                            setMode("TABLE");
                            setItem(null);
                        }}></ReceivingInterestAction>
                )}
            </div>
    );
};
export default ReceivingInterest;
