import React, {useEffect, useState} from "react";
import {checkPermission, ListPage, Toast, TypeToast, getLabelByIdInArray} from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import {Form} from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import {CREATE, UPDATE} from "../../../../constants/permissionTypes";
import Pagination from "react-js-pagination";
import ReceivingInterestAction from "../receiving-interest/ReceivingInterestAction";
import TermDepositProductAction from "./TermDepositProductAction";

const TermDepositProduct = () =>{const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    { label: "Term deposit product", path: "/NWF/category/term-deposit-product", active: true },
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

    const [status, setStatus] = useState();

    // action
    const [type, setType] = useState();
    const [listMoneyType,setListMoneyType] = useState([]);
    const [listReceivingInterest,setListReceivingInterest] = useState([]);
    const [listPeriod,setListPeriod] = useState([]);

    const language = "vi";
    const listStatus = [
        {label: 'Hoạt động', value: "Y"},
        { label: "Không hoạt động", value: "N" },
    ];

    useEffect(() => {
             getPeriod();
            getMoneyType();
            getReceivingInterest();
        initForm();
    }, []);

    useEffect(() => {
        const searchForm = {

            name,
            status,
        };
        setSearchForm(searchForm);
    }, [ name,status]);

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
        getAllByCondition(1, 10, form);
    };

    const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
        setLoading(true);

        const json = {

            name: values?.name,
            status:values?.status,
            page: pageNum,
            limit: pageSize,
        };
        console.log("json", json);

        request.post(api.GET_TERM_DEPOSIT_PRODUCT_BY_CONDITION, json).then((res) => {
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
    function getMoneyType() {
        setLoading(true);
        request
            .post(api.GET_MONEY_TYPE, {status:"Y"})
            .then((res) => {
                setLoading(false);
                setListMoneyType(res.data);

            })
            .catch((err) => setLoading(false));
    }
    function getPeriod() {
        setLoading(true);
        request
            .post(api.GET_PERIOD, {status:"Y"})
            .then((res) => {
                setLoading(false);
                setListPeriod(res.data);

            })
            .catch((err) => setLoading(false));
    }
    function getReceivingInterest() {
        setLoading(true);
        request
            .post(api.GET_RECEIVING_INTEREST_BY_CONDITION, {status:"Y"})
            .then((res) => {
                setLoading(false);
                setListReceivingInterest(res.data);

            })
            .catch((err) => setLoading(false));
    }

    return (
        <div className="container-fluid">
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý sản phẩm tiền gửi có kỳ hạn"}></Pagetitle>
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
                                            <InputComponent title={"Tên sản phẩm"} name="name" value={name} onChange={(val) => setName(val)}></InputComponent>
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
                                    <th className="text-center align-middle mw-200">Tên sản phẩm</th>
                                    <th className="text-center align-middle mw-200">Loại tiền</th>
                                    <th className="text-center align-middle mw-200">Kỳ hạn</th>
                                    <th className="text-center align-middle mw-200">Hình thức nhận lãi</th>
                                    <th className="text-center align-middle mw-200">Đối tượng khách hàng</th>
                                    <th className="text-center align-middle mw-200">Nhóm khách hàng</th>
                                    <th className="text-center align-middle mw-200">Group</th>
                                    <th className="text-center align-middle mw-200">Minor trên DNA</th>
                                    <th className="text-center align-middle">Trạng thái</th>
                                    <th className="text-center align-middle mw-100">Thao tác</th>
                                </tr>
                                </thead>

                                <tbody>
                                {(!list || list.length <= 0) && (
                                    <tr>
                                        <td className="text-center align-middle" colSpan="11">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                                {list?.map((item, i) => {
                                    return (
                                        <tr key={item?.id}>
                                            <td className="text-center align-middle">{limit * (page - 1) + i + 1}</td>
                                            <td className="align-middle">{item?.name}</td>
                                            <td className="align-middle">{getLabelByIdInArray(item?.moneyTypeId, listMoneyType, "id", "name")}</td>
                                            <td className="align-middle">{getLabelByIdInArray(item?.periodId, listPeriod, "id", "name")}</td>
                                            <td className="align-middle">{getLabelByIdInArray(item?.receivingInterestId,listReceivingInterest,"id","name")}</td>
                                            <td className="align-middle">{item?.customerObject}</td>
                                            <td className="align-middle">{item?.customerGroup}</td>
                                            <td className="align-middle">{item?.group}</td>
                                            <td className="align-middle">{item?.minor}</td>
                                            <td className="align-middle text-center">
                                                {item?.status == "Y" ? <i class="fas fa-check-circle text-success"></i> : <i class="fas fa-times-circle text-danger"></i>}
                                            </td>

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
                <TermDepositProductAction
                    item={item}
                    listPeriod={listPeriod}
                    listMoneyType={listMoneyType}
                    listReceivingInterest={listReceivingInterest}
                    passEntry={(res) => {
                        initForm(true);
                        getAllByCondition();
                        setMode("TABLE");
                        setItem(null);
                    }}></TermDepositProductAction>
            )}
        </div>
    );
};
export default TermDepositProduct;
