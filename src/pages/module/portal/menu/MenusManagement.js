import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import React, {useEffect, useState} from "react";
import {checkPermission, getLabelByIdInArray, ListPage, Toast, TypeToast} from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import MenusManagementAction from "./MenusManagementAction";
import Pagination from "react-js-pagination";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import {Form} from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import {CREATE, UPDATE} from "../../../../constants/permissionTypes";

const MenusManagement = (props) => {
    const breadcrumbItems = [
        {label: "Home page", path: "/home-page"},
        {label: "Quản lý menu", path: "/administration/menu-management", active: true},
    ];

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [mode, setMode] = useState("TABLE");

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [maxSize, setMaxSize] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);

    const [list, setList] = useState([]);
    const [listMenu, setListMenu] = useState([]);
    const [listMenuParent, setListMenuParent] = useState([]);
    const [listPage, setListPage] = useState(ListPage);
    const [item, setItem] = useState();

    // form
    const [name, setName] = useState();
    const [parentId, setParentId] = useState("");
    const [status, setStatus] = useState("ALL");

    const [searchForm, setSearchForm] = useState({
        name,
        parentId,
        status
    });

    const language = "vi";

    useEffect(() => {
        initForm();
        findAll();
    }, []);

    // initForm
    useEffect(() => {
        const searchForm = {
            name,
            parentId,
            status,
        };

        setSearchForm(searchForm);
    }, [name, parentId, status]);

    const initForm = (isReset = false) => {
        const form = {
            ...searchForm,
        };

        if (isReset) {
            setName("");
            setParentId("");
            setStatus("ALL");

            form.name = "";
            form.parentId = "";
            form.status = "ALL";
        }

        search(form);
    };

    function findAll() {
        setLoading(true);
        request
            .post(api.FIND_ALL_MENU, {})
            .then((res) => {
                setLoading(false);
                setListMenu(res.data);
                setListMenuParent(() => res.data.filter((h) => !h.parentId));
            })
            .catch((err) => setLoading(false));
    }

    function onPageChange(pageNum) {
        setPage(pageNum);
        getAllByCondition(pageNum, limit);
    }

    function changeLimit() {
        getAllByCondition();
    }

    function onUpdate(item) {
        setMode("ACTION");
        setItem(item);
    }

    const search = (form) => {
        setLimit(10);
        setPage(1);
        getAllByCondition(1, 10, form);
    };

    const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
        setLoading(true);

        const json = {
            limit: pageSize,
            page: pageNum,
            name: values?.name,
            parentId: values?.parentId,
            status: values?.status === "ALL" ? null : values?.status,
        };

        request.post(api.GET_MENU_BY_CONDITION, json).then((res) => {
            setLoading(false);
            if (res.errorCode === "0") {
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
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý menu"}></Pagetitle>
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
                                    <i aria-hidden="true"
                                       className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}></i>
                                </a>
                            </legend>

                            {isCollapsed && (
                                <Form>
                                    <div className="row mb-2">
                                        <div className="col-4">
                                            <InputComponent title={"Tên menu"} name="name" value={name}
                                                            onChange={(val) => setName(val)}></InputComponent>
                                        </div>

                                        <div className="col-4">
                                            <SelectComponent
                                                name={"parentId"}
                                                title={"Menu cha"}
                                                list={listMenuParent}
                                                bindLabel={"name"}
                                                bindValue={"id"}
                                                value={parentId}
                                                onChange={(val) => {
                                                    setParentId(val?.value);
                                                }}></SelectComponent>
                                        </div>

                                        <div className="col-4">
                                            <SelectComponent
                                                notFirstDefault
                                                name={"status"}
                                                title={"Trạng thái"}
                                                list={[
                                                    {value: "ALL", label: "Tất cả"},
                                                    {value: "Y", label: "Hoạt động"},
                                                    {value: "N", label: "Không hoạt động"},
                                                ]}
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
                                            <button onClick={() => initForm(true)} className="btn btn-secondary"
                                                    type="button">
                                                <i className="fas fa-undo-alt mr-1"></i>
                                                <span className="text-button">Làm mới</span>
                                            </button>
                                            <button onClick={() => search(searchForm)} className="btn btn-primary ml-1"
                                                    type="button">
                                                <i className="fas fa-search mr-1"></i>
                                                <span className="text-button">Tìm kiếm</span>
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </fieldset>

                        <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
                            <span className="font-weight-medium theme-color">Danh sách menu</span>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover m-w-tabble">
                                <thead>
                                <tr className="m-header-table">
                                    <th className="text-center align-middle mw-200">Tên</th>
                                    <th className="text-center align-middle mw-200">Menu cha</th>
                                    <th className="text-center align-middle mw-150">Đường dẫn</th>
                                    <th className="text-center align-middle mw-100">Độ ưu tiên</th>
                                    <th className="text-center align-middle mw-100">Trạng thái</th>
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
                                            <td className="align-middle">
                                                <span>{language === "vi" ? item?.name : item?.nameEn}</span>
                                            </td>
                                            <td className="align-middle">{getLabelByIdInArray(item.parentId, listMenu, "id", language === "vi" ? "name" : "nameEn")}</td>
                                            <td className="align-middle">{item?.path}</td>
                                            <td className="align-middle text-center">{item?.priority}</td>
                                            <td className="align-middle text-center">{item?.status === "Y" ? "Hoạt động" : "Không hoạt động"}</td>
                                            <td className="align-middle text-center">
													<span hidden={!checkPermission(UPDATE)}
                                                          onClick={() => onUpdate(item)} className="text-info m-cursor">
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
                <MenusManagementAction
                    item={item}
                    listMenuParent={listMenuParent}
                    passEntry={(res) => {
                        initForm(true);
                        findAll();
                        setMode("TABLE");
                        setItem(null);
                    }}></MenusManagementAction>
            )}
        </div>
    );
};

export default MenusManagement;
