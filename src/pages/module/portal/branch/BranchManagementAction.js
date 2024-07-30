import React, { useEffect, useState } from "react";
import { authUser } from "../../../../helpers/authUtils";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { Toast, TypeToast } from "../../../../utils/app.util";

const BranchManagementAction = (props) => {
	const { passEntry, item, type } = props;

	const [loading, setLoading] = useState(false);
	// form
	const [formValue, setFormValue] = useState();
	const [code, setCode] = useState();
	const [branchName, setBranchName] = useState();
	const [branchNameEn, setBranchNameEn] = useState();
	const [address, setAddress] = useState();
	const [status, setStatus] = useState(1);
	const [parentId, setParentId] = useState();

	const creater = authUser().id;
	const createdDate = new Date();

	useEffect(() => {
		if (item) {
			setCode(item.code);
			setBranchName(item.branchName);
			setBranchNameEn(item.branchNameEn);
			setAddress(item.address);
			setStatus(item.status);
			setParentId(item.parentId);
		}
	}, []);

	// initForm
	useEffect(() => {
		const formValue = {
			code,
			branchName,
			branchNameEn,
			address,
			status,
			parentId,
		};

		setFormValue(formValue);
	}, [code, branchName, branchNameEn, address, status, parentId]);

	const onSubmit = (form) => {
		if (!branchName || !branchNameEn || !address) {
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
			status: Number(form.status),
			creater,
			createdDate,
		};
		request
			.post(api.CREATE_BRANCH, json)
			.then((res) => {
				setLoading(false);
				if (res.errorCode === "1") {
					passEntry();
					Toast(res.errorDesc, TypeToast.SUCCESS);
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
			creater,
			createdDate,
		};
		request
			.post(api.UPDATE_BRANCH, json)
			.then((res) => {
				setLoading(false);
				if (res.errorCode === "1") {
					Toast("Cập nhật thành công", TypeToast.SUCCESS);
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
						<span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật chi nhánh" : "Thông tin tạo chi nhánh"}</span>
					</div>
					<Form>
						<div className="row">
							<div className="col-4">
								<InputComponent title={"Mã chi nhánh"} name="code" value={code} disabled={true}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent
									required
									disabled={type === "view"}
									title={"Tên Chi Nhánh(VN)"}
									name="branchName"
									value={branchName}
									onChange={(val) => setBranchName(val)}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent
									required
									disabled={type === "view"}
									title={"Tên Chi Nhánh(EN)"}
									name="branchNameEn"
									value={branchNameEn}
									onChange={(val) => setBranchNameEn(val)}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent
									required
									disabled={type === "view"}
									title={"Địa chỉ"}
									name="address"
									value={address}
									onChange={(val) => setAddress(val)}></InputComponent>
							</div>

							<div className="col-4">
								<SelectComponent
									firstRecord={{
										label: "Hoạt động",
										value: 1,
									}}
									disabled={type === "view"}
									name={"status"}
									title={"Trạng thái"}
									list={[{ value: 0, label: "Không hoạt động" }]}
									bindLabel={"label"}
									bindValue={"value"}
									value={status}
									onChange={(val) => {
										setStatus(val?.value);
									}}></SelectComponent>
							</div>

							<div className="col-4">
								<SelectComponent
									notFirstDefault
									disabled={type === "view"}
									name={"parentId"}
									title={"Chi nhánh cha"}
									list={(item ? props?.listParent?.filter((x) => x?.id !== item?.id) : props?.listParent) || []}
									bindLabel={"branchName"}
									bindValue={"code"}
									value={parentId}
									onChange={(val) => {
										setParentId(val?.value);
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

export default BranchManagementAction;
