import React, { useEffect, useState } from "react";
import { checkPermission, ListPage, parseDate, Toast, TypeToast } from "../../../utils/app.util";
import request from "../../../utils/request";
import api from "../../../utils/api";
import Pagetitle from "../../../shared/ui/page-title/Pagetitle";
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import InputComponent from "../../../shared/component/input/InputComponent";
import SelectComponent from "../../../shared/component/select/SelectComponent";
import { CONFIRM, CREATE, UPDATE } from "../../../constants/permissionTypes";
import Pagination from "react-js-pagination";
import RoleManagementAction from "../portal/role/RoleManagementAction";
import TimeLine from "../../../shared/component/process/TimeLine";
import Swal from "sweetalert2";

const ProcessFormPending = (props) => {
    const breadcrumbItems = [
        { label: "Home page", path: "/NWF/home-page" },
        { label: "Process Form Pending", path: "/NWF/smart-form/process", active: true },
    ];

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [mode, setMode] = useState("TABLE");

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [totalRecords, setTotalRecords] = useState(0);

    const [list, setList] = useState([]);

    const [listPage, setListPage] = useState(ListPage);
    const [item, setItem] = useState();

    // form
    const [searchForm, setSearchForm] = useState();
    const [name, setName] = useState();
    const [code, setCode] = useState();
    const [listForm, setListForm] = useState([]);
    const [formId, setFormId] = useState("");
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    // action
    const [type, setType] = useState();

    const language = "vi";

    useEffect(() => {
        // getFormList();
        initForm();
    }, []);

    useEffect(() => {
        const searchForm = {
            code,
            formId,
        };
        setSearchForm(searchForm);
    }, [code, formId]);

    const initForm = (isReset = false) => {
        const form = {
            ...searchForm,
        };

        if (isReset) {
            setCode("");
            setFormId("");
            // setLimit(4);

            form.code = "";
            form.formId = "";
        }

        search(form);
    };

    function onPageChange(pageNum) {
        setPage(pageNum);
        getAllByCondition(pageNum, limit, searchForm);
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
    function openModal(item) {
        setItem(item);
        toggleModal();
    }

    const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
        setLoading(true);

        const json = {
            code: values?.code,
            formId: values?.formId,
            ticketNeedApprove: true,
            page: pageNum,
            limit: pageSize,
        };
        console.log("json", json);

        request.post(api.GET_FORM_SIGN, json).then((res) => {
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

    function getFormList() {
        setLoading(true);
        request
            .post(api.GET_FORM_MANAGEMENT)
            .then((res) => {
                setLoading(false);
                setListForm(res?.data);
                // setListMenuParent(() => res.data.filter((h) => !h.parentId));
            })
            .catch((err) => setLoading(false));
    }

    function onApprove(item, action) {
        Swal.fire({
            icon: (action === "APPROVE" ? "question" : (action === "RETURN") ? "warning" : "error"),
            title: (action === "APPROVE" ? "Phê duyệt" : (action === "RETURN") ? "Trả về" : "Từ chối"),
            backdrop: true,
            allowOutsideClick: false,
            input: "file",
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            showLoaderOnConfirm: true,
        }).then((result) => {
            console.log("result", result);
            if (result.isConfirmed) {
                const json = {
                    // ...item,
                    id: item?.id,
                    action: action,
                };
                const file = result?.value;

                // Nếu có file
                if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        json.attachedFile = reader.result;
                        json.attachedFileName = file.name;

                        console.log('json', json);
                        // Để trong này vì nó bất đồng bộ
                        approveTicket(json);
                    };
                } else {
                    console.log('json', json);
                    approveTicket(json);
                }
            }
        });
    }

    const approveTicket = (json) => {
        request.post(api.APPROVE_SIGN_FORM, json).then((res) => {
            if (res?.data) {
                Toast("Thao tác thành công", TypeToast.SUCCESS);
                search();
            } else {
                Toast(res.errorDesc, TypeToast.WARNING);
            }
        });
    };

    const viewTimeLine = (item) => {
        if (item?.processId) {
            setItem(item);
            toggleModal();
        }

    };

    return (
        <div className="container-fluid">
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý vai trò"}></Pagetitle>
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
                                            <InputComponent title={"Mã "} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
                                        </div>
                                        <div className="col-4">
                                            <SelectComponent

                                                name={"formId"}
                                                title={"Biểu mẫu"}
                                                list={listForm}
                                                bindLabel={"name"}
                                                bindValue={"id"}
                                                value={formId}
                                                onChange={(val) => {
                                                    setFormId(val?.value);
                                                }}
                                            ></SelectComponent>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            {/*<button*/}
                                            {/*    hidden={!checkPermission(CREATE)}*/}
                                            {/*    onClick={() => {*/}
                                            {/*        setMode("ACTION");*/}
                                            {/*    }}*/}
                                            {/*    className="btn btn-primary"*/}
                                            {/*    type="button">*/}
                                            {/*    <i className="fas fa-plus mr-1"></i>*/}
                                            {/*    <span className="text-button">Tạo mới</span>*/}
                                            {/*</button>*/}
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
                            <span className="font-weight-medium theme-color">Danh sách</span>
                        </div>

                        <div className="table-responsive">

                            <table className="table table-bordered table-sm table-hover m-w-tabble">
                                <thead>
                                    <tr className="m-header-table">
                                        <th className="text-center align-middle mw-100">Mã</th>
                                        <th className="text-center align-middle mw-200">Mã hồ sơ</th>
                                        <th className="text-center align-middle mw-200">Biểu mẫu</th>
                                        <th className="text-center align-middle mw-150">Trạng thái</th>
                                        <th className="text-center align-middle mw-100">Kênh</th>
                                        <th className="text-center align-middle mw-50">Ngày tạo</th>
                                        <th className="text-center align-middle mw-50" >Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/*    <tr key={item?.id}>*/}
                                    {/*        <td className="text-center align-middle">FS.2023.0283</td>*/}
                                    {/*        <td className="align-middle">EIB20231220000008</td>*/}
                                    {/*        <td className="align-middle">Giấy nộp tiền Demo</td>*/}
                                    {/*        <td className="align-middle">Hoàn thành</td>*/}
                                    {/*        <td className="align-middle text-center">*/}
                                    {/*            10.86.144.131*/}
                                    {/*        </td>*/}
                                    {/*        <td className="align-middle">20/12/2023	</td>*/}
                                    {/*        <td className="text-center">*/}
                                    {/*						<span hidden={!checkPermission(UPDATE)} onClick={() => onUpdate(item)} className="text-info m-cursor">*/}
                                    {/*							<i className="fas fa-pencil-alt"></i>*/}

                                    {/*						</span>*/}
                                    {/*            <span class="m-cursor" title="Phê duyệt" >*/}
                                    {/*            <i class="fas fa-check fa-lg text-success"></i>*/}
                                    {/*        </span>*/}
                                    {/*        <span class="m-cursor ml-2" title="Yêu cầu bổ sung thông tin" >*/}
                                    {/*        <i class="fas fa-user-edit fa-lg text-info"></i>*/}
                                    {/*    </span>*/}
                                    {/*    <span class="m-cursor ml-2" title="Trả về" >*/}
                                    {/*    <i class="fas fa-undo fa-lg text-warning"></i>*/}
                                    {/*    </span>*/}
                                    {/*    <span class="m-cursor ml-2" title="Từ chối" >*/}
                                    {/*    <i class="fas fa-ban fa-lg text-danger"></i>*/}
                                    {/*</span>*/}

                                    {/*        </td>*/}
                                    {/*    </tr>*/}
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
                                                <td className="text-center align-middle">{item?.code}</td>
                                                <td className="align-middle">{item?.monitorCode}</td>
                                                <td className="align-middle">{item?.formName}</td>
                                                <td className="align-middle">
                                                    <span onClick={() => viewTimeLine(item)}
                                                        className={(item?.lastAction === "RETURN") ? "badge badge-warning" : (item?.lastAction === "REJECT") ? "badge badge-danger" : "badge badge-success"}>
                                                        {item?.statusName}
                                                    </span>
                                                </td>
                                                <td className="align-middle text-center">
                                                    {item?.channel}
                                                </td>
                                                <td className="align-middle">{parseDate(item.createDate)}</td>
                                                <td className="align-middle text-center">
                                                    <span hidden={!checkPermission(UPDATE)} onClick={() => onUpdate(item)} className="text-info m-cursor">
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </span>
                                                    <span title="Phê duyệt"
                                                        hidden={!checkPermission(CONFIRM) || item?.endProcess}
                                                        onClick={() => {
                                                            onApprove(item, "APPROVE");
                                                        }}
                                                        className="text-success m-cursor ml-1">
                                                        <i className="fas fa-check"></i>
                                                    </span>
                                                    <span title="Trả về"
                                                        hidden={!checkPermission(CONFIRM) || item?.endProcess || item?.stepId !== "Activity_3"}
                                                        onClick={() => {
                                                            onApprove(item, "RETURN");
                                                        }}
                                                        className="text-warning m-cursor ml-1">
                                                        <i className="fas fa-undo"></i>
                                                    </span>
                                                    <span title="Từ chối"
                                                        hidden={!checkPermission(CONFIRM) || item?.endProcess || item?.stepId !== "Activity_3"}
                                                        onClick={() => {
                                                            onApprove(item, "REJECT");
                                                        }}
                                                        className="text-danger m-cursor ml-1">
                                                        <i class="far fa-minus-square"></i>
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
            ) : ("")

            // (
            //     <RoleManagementAction
            //         item={item}
            //         passEntry={(res) => {
            //             initForm(true);
            //             getAllByCondition();
            //             setMode("TABLE");
            //             setItem(null);
            //         }}></RoleManagementAction>
            // )
            }
            <Modal isOpen={modal} toggle={toggleModal} centered>
                <ModalHeader toggle={toggleModal}>
                    Thông tin thao tác
                </ModalHeader>
                <ModalBody>
                    <TimeLine item={{ ...item, ticketId: item?.id, endEventId: "Event_end" }} processId={item?.processId}></TimeLine>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ProcessFormPending
