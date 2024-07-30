import React, {useEffect, useState} from "react";
import {authUser} from "../../../../helpers/authUtils";
import {Toast, TypeToast} from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import {Form} from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";

const TermDepositProductAction = (props) =>{
    const { item,listPeriod,listReceivingInterest,listMoneyType,passEntry } = props;
    console.log(item);

    const [loading, setLoading] = useState(false);
    const [newitem, setNewitem] = useState();

    // form
    const [moneyTypeId, setMoneyTypeId] = useState();
    const [name, setName] = useState();
    const [periodId, setPeriodId] = useState();
    const [receivingInterestId, setReceivingInterestId] = useState();
    const [customerObject, setCustomerObject] = useState();
    const [customerGroup, setCustomerGroup] = useState();

    const [group, setGroup] = useState();
    const [minor, setMinor] = useState();
    const creater = authUser().id;
    const createDate = new Date();
    const editer = authUser().id;
    const editDate = new Date();
    const [formValue, setFormValue] = useState();
    const [status, setStatus] = useState(true);
    const listStatus = [
        {label: 'Hoạt động', value: "Y"},
        { label: "Không hoạt động", value: "N" }]


    useEffect(() => {
        if (item) {
            setMoneyTypeId(item?.moneyTypeId);
            setName(item?.name);
            setPeriodId(item?.periodId);
            setReceivingInterestId(item?.receivingInterestId);
            setCustomerGroup(item?.customerGroup);
            setCustomerObject(item?.customerObject);
            setGroup(item?.group);
            setMinor(item?.minor);
            setStatus(item?.status);

        }
    }, []);

    useEffect(() => {
        const formValue = {
            name,
            moneyTypeId,
            periodId,
            receivingInterestId,
            customerObject,
            customerGroup,
            group,
            minor,
            status,

        };

        setFormValue(formValue);
    }, [name,moneyTypeId,periodId,receivingInterestId,customerObject,customerGroup,group,minor,status]);

    const onSubmit = (form) => {
        if (!name||!moneyTypeId||!periodId||!receivingInterestId||!customerObject||!customerGroup||!group||!minor||!status) {
            Toast("Vui lòng nhập các trường bắt buộc(*)", TypeToast.WARNING);
            return;
        }

        if (item) {
            update(form);
        } else {
            create(form);
        }
    };

    function create(form) {
        setLoading(true);
        const json = {
            ...form,
            creater,
            createDate,
        };
        request
            .post(api.CREATE_TERM_DEPOSIT_PRODUCT, json)
            .then((res) => {
                setLoading(false);
                if (res.errorCode === "0") {
                    Toast(res.errorDesc, TypeToast.SUCCESS);
                    passEntry();
                } else if (res.errorCode === "-1") {
                    Toast(res.errorDesc, TypeToast.ERROR);
                } else {
                    Toast("Create failed", TypeToast.ERROR);
                }
            })
            .catch((err) => setLoading(false));
    }

    function update(form) {
        setLoading(true);
        const json = {
            id: item.id,
            ...form,
            editer,
            editDate,
        };

        console.log("json", json);
        request
            .post(api.UPDATE_TERM_DEPOSIT_PRODUCT, json)
            .then((res) => {
                setLoading(false);
                if (res.errorCode === "0") {
                    Toast("update success", TypeToast.SUCCESS);
                    passEntry();
                } else if (res.errorCode === "-1") {
                    Toast(res.errorDesc, TypeToast.ERROR);
                } else {
                    Toast("update failed", TypeToast.ERROR);
                }
            })
            .catch((err) => setLoading(false));
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 card-box">
                    <div class="col-12 border-bottom-dotted p-0 mb-2">
                        <span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật sản phẩm tiền gửi có kỳ hạn" : "Thông tin tạo mới sản phẩm tiền gửi có kỳ hạn"}</span>
                    </div>
                    <Form>
                        <div className="row">

                            <div className="col-4">
                                <InputComponent required title={"Tên sản phẩm"} name="name" value={name} onChange={(val) => setName(val)}></InputComponent>
                            </div>
                            <div className="col-4">
                                <SelectComponent
                                    notFirstDefault
                                    required
                                    name={"moneyTypeId"}
                                    title={"Loại tiền"}
                                    list={listMoneyType}
                                    bindLabel={"name"}
                                    bindValue={"id"}
                                    value={moneyTypeId}
                                    onChange={(val) => {
                                        setMoneyTypeId(val?.value);
                                    }}></SelectComponent>
                            </div>
                            <div className="col-4">
                                <SelectComponent
                                    notFirstDefault
                                    required
                                    name={"periodId"}
                                    title={"Kỳ hạn"}
                                    list={listPeriod}
                                    bindLabel={"name"}
                                    bindValue={"id"}
                                    value={periodId}
                                    onChange={(val) => {
                                        setPeriodId(val?.value);
                                    }}></SelectComponent>
                            </div>
                            <div className="col-4">
                                <SelectComponent
                                    notFirstDefault
                                    required
                                    name={"receivingInterestId"}
                                    title={"Hình thức nhận lãi"}
                                    list={listReceivingInterest}
                                    bindLabel={"name"}
                                    bindValue={"id"}
                                    value={receivingInterestId}
                                    onChange={(val) => {
                                        setReceivingInterestId(val?.value);
                                    }}></SelectComponent>
                            </div>
                            <div className="col-4">
                                <InputComponent required title={"Đối tượng khách hàng"} name="customerObject" value={customerObject} onChange={(val) => setCustomerObject(val)}></InputComponent>
                            </div>
                            <div className="col-4">
                                <InputComponent required title={"Nhóm khách hàng"} name="customerGroup" value={customerGroup} onChange={(val) => setCustomerGroup(val)}></InputComponent>
                            </div>
                            <div className="col-4">
                                <InputComponent required title={"Group"} name="group" value={group} onChange={(val) => setGroup(val)}></InputComponent>
                            </div>
                            <div className="col-4">
                                <InputComponent required title={"Minor trên DNA"} name="minor" value={minor} onChange={(val) => setMinor(val)}></InputComponent>
                            </div>


                            <div className="col-4">
                                <SelectComponent
                                    notFirstDefault
                                    required
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

                        <div className="row pt-4">
                            <div className="col-12 text-center">
                                <button
                                    onClick={() => {
                                        passEntry();
                                    }}
                                    className="btn btn-secondary"
                                    type="button">
                                    <i className="fas fa-undo-alt mr-1"></i>
                                    <span className="text-button">Quay lại</span>
                                </button>
                                <button onClick={() => onSubmit(formValue)} className="btn btn-primary ml-1" type="button">
                                    <i className={(item ? "fa-edit" : "fa-plus") + " fas mr-1"}></i>
                                    <span className="text-button">{item ? "Cập nhật" : "Tạo mới"}</span>
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
export default TermDepositProductAction;
