import React, { useEffect, useState } from "react";
import Pagetitle from "../../../shared/ui/page-title/Pagetitle";
import request from "../../../utils/request";
import api from "../../../utils/api";
import { Toast, TypeToast, checkPermission, parseDate } from "../../../utils/app.util";

import Pagination from "react-js-pagination";
import { Button, Form, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import InputComponent from "../../../shared/component/input/InputComponent";
import SelectComponent from "../../../shared/component/select/SelectComponent";
import { createFileType, downloadFile } from "../../../utils/exportFile";

import TimeLine from "../../../shared/component/process/TimeLine";
import PDFForm from "../pdf-form/PDFForm";
import { CONFIRM } from "../../../constants/permissionTypes";
import Swal from "sweetalert2";

const ProcessFormAll = () => {
    const breadcrumbItems = [
        { label: "Home page", path: "/NWF/home-page" },
        { label: "Form All", path: "/NWF/smart-form/ProcessFormAll", active: true },
    ];

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formList, setFormList] = useState([]);
    const [formSignList, setFormSignList] = useState([]);

    // search
    const [searchForm, setSearchForm] = useState();
    const [formId, setFormId] = useState();
    const [code, setCode] = useState("");

    // modal
    const [item, setItem] = useState();
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    const [modalPDF, setModalPDF] = useState(false);
    const toggleModalPDF = () => setModalPDF(!modalPDF);

    const [loading, setLoading] = useState(false);
    const [isDownload, setIsDownload] = useState(false);

    useEffect(() => {
        initForm();
    }, []);

    useEffect(() => {
        const formSearch = {
            code,
            formId,
        };
        setSearchForm(formSearch);
    }, [code, formId]);

    const getFormList = () => {
        request.post(api.GET_FORM, {}).then((res) => {
            if (res) {
                setFormList(res.data);
            }
        });
    };

    const getFormSigns = (page, limit, form = {}) => {
        const payload = {
            limit,
            page,
            ticketNeedApprove: false,
            ...form,
        };
        request
            .post(api.GET_FORM_SIGN, payload)
            .then((res) => {
                if (res) {
                    setFormSignList(res.data);
                    setTotalRecords(res.totalRecord);
                } else {
                    setFormSignList([]);
                }
            })
            .catch((e) => console.log(e));
    };

    const initForm = (isReset = false) => {
        const formSearch = {
            ...searchForm,
        };

        if (isReset) {
            setCode("");
            setFormId("");

            formSearch.code = "";
            formSearch.formId = "";
        }
        search(formSearch);
    };

    const reset = () => {
        setLimit(10);
        setPage(1);
        initForm(true);
    };

    const search = (formSearch) => {
        setLimit(10);
        setPage(1);
        getFormSigns(page, limit, formSearch);
    };

    function onPageChange(page) {
        setPage(page);
        getFormSigns(page, limit, searchForm);
    }

    const exportFile = (type) => {
        const payload = {
            exportType: type,
        };
        request.postToExport(api.EXPORT_USER_LOGIN, payload).then(
            (res) => {
                if (res) {
                    Toast("Export success", TypeToast.SUCCESS);
                    downloadFile(res, createFileType(type), "System_access");
                }
            },
            (error) => {
                Toast("Export fail", TypeToast.ERROR);
            }
        );
    };

    const formatDate = (day) => {
        const date = new Date(day);
        return date.toLocaleDateString("en-US");
    };

    const viewTimeLine = (item) => {
        if (item?.processId) {
            setItem(item);
            toggleModal();
        }

    };

    const openModal = (item) => {
        setItem(item);
        toggleModalPDF();
    };

    // function onApprove(item, action) {
    //     Swal.fire({
    //         icon: (action === "APPROVE" ? "question" : (action === "RETURN") ? "warning" : "error"),
    //         title: (action === "APPROVE" ? "Phê duyệt" : (action === "RETURN") ? "Trả về" : "Từ chối"),
    //         backdrop: true,
    //         allowOutsideClick: false,
    //         input: "file",
    //         showCancelButton: true,
    //         confirmButtonText: "Xác nhận",
    //         cancelButtonText: "Hủy",
    //         showLoaderOnConfirm: true,
    //     }).then((result) => {
    //         console.log("result", result);
    //         if (result.isConfirmed) {
    //             const json = {
    //                 // ...item,
    //                 id: item?.id,
    //                 action: action,
    //             };
    //             const file = result?.value;

    //             // Nếu có file
    //             if (file) {
    //                 const reader = new FileReader();
    //                 reader.readAsDataURL(file);
    //                 reader.onload = function () {
    //                     json.attachedFile = reader.result;
    //                     json.attachedFileName = file.name;

    //                     console.log('json', json);
    //                     // Để trong này vì nó bất đồng bộ
    //                     approveTicket(json);
    //                 };
    //             } else {
    //                 console.log('json', json);
    //                 approveTicket(json);
    //             }
    //         }
    //     });
    // }

    // const approveTicket = (json) => {
    //     request.post(api.APPROVE_SIGN_FORM, json).then((res) => {
    //         if (res?.data) {
    //             Toast("Thao tác thành công", TypeToast.SUCCESS);
    //             search();
    //         } else {
    //             Toast(res.errorDesc, TypeToast.WARNING);
    //         }
    //     });
    // };

    return (
        <div class="container-fluid mt-2">
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Tất cả hồ sơ"}></Pagetitle>
            <div class="row">
                <div class="col-12 card-box">
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
                                <div className="row">
                                    <div className="col-4">
                                        <InputComponent title={"Mã"} name="code" value={code}
                                            onChange={(val) => setCode(val)}></InputComponent>
                                    </div>
                                    <div className="col-4">
                                        <SelectComponent
                                            name={"formId"}
                                            title={"Biểu mẫu"}
                                            list={formList}
                                            bindLabel={"name"}
                                            bindValue={"code"}
                                            value={formId}
                                            onChange={(val) => {
                                                setFormId(val?.value);
                                            }}></SelectComponent>
                                    </div>
                                    <div className="col-4 text-right mt-3">
                                        <button onClick={() => reset()} className="btn btn-secondary" type="button">
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

                                <div className="row"></div>
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
                                    <th className="text-center align-middle mw-150">Mã</th>
                                    <th className="text-center align-middle mw-200">Mã hồ sơ</th>
                                    <th className="text-center align-middle mw-200">Biểu mẫu</th>
                                    <th className="text-center align-middle mw-200">Trạng thái</th>
                                    <th className="text-center align-middle mw-200">Kênh</th>
                                    <th className="text-center align-middle mw-200">Ngày tạo</th>
                                    <th className="text-center align-middle mw-200">Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {(!formSignList || formSignList.length <= 0) && (
                                    <tr>
                                        <td className="text-center align-middle" colSpan="10">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                                {formSignList?.map((item, i) => {
                                    return (
                                        <tr key={item?.id}>
                                            <td className="align-middle text-center text-primary m-cursor"
                                                onClick={() => openModal(item)}>
                                                <span>{item.code}</span>
                                            </td>
                                            <td className="align-middle">{item.monitorCode}</td>
                                            <td className="align-middle">{item?.formName}</td>
                                            <td className="align-middle">
                                                <span onClick={() => viewTimeLine(item)}
                                                    className={(item?.lastAction === "RETURN") ? "badge badge-warning" : (item?.lastAction === "REJECT") ? "badge badge-danger" : "badge badge-success"}>
                                                    {item?.statusName}
                                                </span>
                                            </td>
                                            {/* <td className="align-middle">{item?.lastAction}</td> */}
                                            <td className="align-middle">{item?.channel}</td>
                                            <td className="align-middle text-center">{parseDate(item.createDate)}</td>
                                            <td className="align-middle text-center">
                                                <span onClick={() => {
                                                    setLoading(true)
                                                    setItem(item)
                                                    setIsDownload(true)
                                                }}
                                                    class="text-primary m-cursor mx-2"
                                                    title="download">
                                                    <i class="fas fa-download"></i>
                                                </span>
                                                {/* <span title="Phê duyệt"
                                                    hidden={!checkPermission(CONFIRM) || item?.endProcess}
                                                    onClick={() => {
                                                        onApprove(item, "APPROVE");
                                                    }}
                                                    className="text-success m-cursor">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                                <span title="Trả về"
                                                    hidden={!checkPermission(CONFIRM) || item?.endProcess || item?.stepId !== "Activity_3"}
                                                    onClick={() => {
                                                        onApprove(item, "RETURN");
                                                    }}
                                                    className="text-warning m-cursor ml-2">
                                                    <i className="fas fa-undo"></i>
                                                </span>
                                                <span title="Từ chối"
                                                    hidden={!checkPermission(CONFIRM) || item?.endProcess || item?.stepId !== "Activity_3"}
                                                    onClick={() => {
                                                        onApprove(item, "REJECT");
                                                    }}
                                                    className="text-danger m-cursor ml-2">
                                                    <i class="far fa-minus-square"></i>
                                                </span> */}
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

                {isDownload && <PDFForm
                    hideButtonSendInfo={true}
                    formIndex={{ 'fullNameCorporation' : 'Tín', 'formName' : new Date()}}
                    urlId={item?.formId}
                    hidden={true}
                    formFieldList={item?.formFieldList}
                    outFileData={() => {
                        setIsDownload(false)
                        setLoading(false)
                    }}
                ></PDFForm>}
            </div>

            {/* modal */}
            <div>
                <Modal isOpen={modal} toggle={toggleModal} centered>
                    <ModalHeader toggle={toggleModal}>Quy trình phê duyệt</ModalHeader>
                    <ModalBody>
                        <TimeLine item={{ ...item, ticketId: item?.id, endEventId: "Event_end" }}
                            processId={item?.processId}></TimeLine>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalPDF} toggle={toggleModalPDF} centered className={'modal-xlx'}
                    style={{ height: window.outerHeight * (118 / 100) }}>
                    <ModalHeader toggle={toggleModalPDF}>Thông tin chi tiết</ModalHeader>
                    <ModalBody className='p-0'>
                        <div className="row">
                            <PDFForm
                                hideButtonSendInfo={true}
                                formIndex={{ 'fullNameCorporation' : 'Tín'}}
                                urlId={item?.formId}
                                hidden={false}
                                formFieldList={item?.formFieldList}
                            ></PDFForm>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModalPDF}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};

export default ProcessFormAll;
