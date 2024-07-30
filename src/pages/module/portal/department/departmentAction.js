import React, { Component, useEffect, useState } from "react";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Button, Form } from "reactstrap";
import { authUser } from "../../../../helpers/authUtils";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { Toast, TypeToast } from "../../../../utils/app.util";

const DepartmentAction = (props) => {
	const status = "Y";
	const creater = authUser().id;
	const createdDate = new Date();

	const { passEntry, item, listDepartment, listBranch, type } = props;

	const [code, setCode] = useState();
	const [name, setName] = useState();
	const [parentDepartment, setParentDepartment] = useState();
	const [nameEn, setNameEn] = useState();
	const [branchCode, setBranchCode] = useState();
	const [transactionOfficeCode, setTransactionOfficeCode] = useState();
	const [loading, setLoading] = useState(false);
	const [formValue, setFormValue] = useState();

	useEffect(() => {
		const formValue = {
			code,
			name,
			parentDepartment,
			nameEn,
			branchCode,
			creater,
			createdDate,
			status,
		};

		setFormValue(formValue);
	}, [code, name, parentDepartment, nameEn, branchCode, ,]);

	useEffect(() => {
		if (item) {
			setCode(item?.code);
			setName(item?.name);
			setParentDepartment(item?.pid);
			setNameEn(item?.nameEn);
			setBranchCode(item?.branchCode);
			setTransactionOfficeCode(item?.transactionOfficeCode);
		}
	}, []);

	const onSubmit = (form) => {
		if (!code || !name || !nameEn || !branchCode || !parentDepartment) {
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
		form.status = "Y";
		form.pid = parentDepartment;
		const json = {
			...form,
			creater,
			createdDate,
		};
		request
			.post(api.CREATE_DEPARTMENT, json)
			.then((res) => {
				setLoading(false);
				if (res.errorCode === "0") {
					Toast(res.errorDesc, TypeToast.SUCCESS);
					passEntry();
				} else if (res.errorCode === "1") {
					Toast(res.errorDesc, TypeToast.ERROR);
				} else {
					Toast("Create failed", TypeToast.ERROR);
				}
			})
			.catch((err) => setLoading(false));
	}

	function update(form) {
		setLoading(true);

		form.status = "Y";
		form.pid = parentDepartment;

		const json = {
			id: item.id,
			...form,
			creater,
			createdDate,
		};

		request
			.post(api.UPDATE_DEPARTMENT, json)
			.then((res) => {
				setLoading(false);
				if (res.errorCode === "0") {
					Toast("update success", TypeToast.SUCCESS);
					passEntry();
				} else if (res.errorCode === "1") {
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
						<span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật bộ phận" : "Thông tin tạo bộ phận"}</span>
					</div>
					<Form>
						<div className="row">
							<div className="col-4">
								<InputComponent required disabled={type === "view"} title={"Mã bộ phận"} name="code" value={code} onChange={(val) => setCode(val)}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent
									disabled={type === "view"}
									required
									title={"Tên bộ phận"}
									name="name"
									value={name}
									onChange={(val) => setName(val)}></InputComponent>
							</div>

							<div className="col-4">
								<SelectComponent
									firstRecord={{
										label: "Không",
										value: "",
									}}
									disabled={type === "view"}
									name={"parentDepartment"}
									title={"Bộ phận cha"}
									list={listDepartment}
									bindLabel={"name"}
									bindValue={"id"}
									value={parentDepartment}
									onChange={(val) => {
										setParentDepartment(val?.value);
									}}></SelectComponent>
							</div>

							<div className="col-4">
								<InputComponent
									required
									disabled={type === "view"}
									title={"Tên tiếng anh"}
									name="nameEn"
									value={nameEn}
									onChange={(val) => setNameEn(val)}></InputComponent>
							</div>
							<div className="col-4">
								<SelectComponent
									firstRecord={{
										label: "Không",
										value: "",
									}}
									disabled={type === "view"}
									name={"branchCode"}
									title={"Chọn chi nhánh"}
									list={listBranch}
									bindLabel={"branchName"}
									bindValue={"code"}
									value={branchCode}
									onChange={(val) => {
										setBranchCode(val?.value);
									}}></SelectComponent>
							</div>
						</div>

						<div className="row mt-3">
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

export default DepartmentAction;
