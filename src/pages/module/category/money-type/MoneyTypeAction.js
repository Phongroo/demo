import React, { useEffect, useState } from "react";
import { authUser } from "../../../../helpers/authUtils";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { Toast, TypeToast } from "../../../../utils/app.util";

const MoneyTypeAction = (props) => {
	const { passEntry, item, type } = props;

	const [loading, setLoading] = useState(false);
	// form
	const [formValue, setFormValue] = useState();
	const [code, setCode] = useState();
	const [name, setName] = useState();
	const [nameEn, setNameEn] = useState();
	const [note, setNote] = useState();
	const [status, setStatus] = useState("Y");

	const creator = authUser().id;
	const createDate = new Date();

	useEffect(() => {
		if (item) {
			setCode(item.code);
			setName(item.name);
			setNameEn(item.nameEn);
			setNote(item.note);
			setStatus(item.status);
		}
	}, []);

	// initForm
	useEffect(() => {
		const formValue = {
			code,
			name,
			nameEn,
			note,
			status,
		};

		setFormValue(formValue);
	}, [code, name, nameEn, note, status]);

	const onSubmit = (form) => {
		if (!code || !name || !nameEn) {
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
			creator,
			createDate,
		};
		console.log(json);
		request
			.post(api.CREATE_MONEY_TYPE, json)
			.then((res) => {
				setLoading(false);
				if (res.errorCode === "OK") {
					passEntry();
					Toast("Tạo mới thành công", TypeToast.SUCCESS);
				} else {
					Toast(res.errorDesc, TypeToast.ERROR);
				}
			})
			.catch((err) => setLoading(false));
	}

	function update(form) {
		setLoading(true);
		const json = {
			id: item.id,
			...form,
			editor: creator,
			editDate: createDate,
		};
		request
			.post(api.UPDATE_MONEY_TYPE, json)
			.then((res) => {
				setLoading(false);
				if (res.errorCode === "OK") {
					Toast("Cập nhật thành công", TypeToast.SUCCESS);
					passEntry();
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
						<span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật loại tiền" : "Thông tin tạo loại tiền"}</span>
					</div>
					<Form>
						<div className="row">
							<div className="col-4">
								<InputComponent
									required
									title={"Mã loại tiền"}
									name="code"
									value={code}
									onChange={(val) => setCode(val)}
									disabled={type !== "create"}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent
									maxLength={3}
									required
									disabled={type === "view"}
									title={"Tên loại tiền(VN)"}
									name="name"
									value={name}
									onChange={(val) => setName(val)}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent
									required
									disabled={type === "view"}
									title={"Tên loại tiền(EN)"}
									name="nameEn"
									value={nameEn}
									onChange={(val) => setNameEn(val)}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent required disabled={type === "view"} title={"Ghi chú"} name="note" value={note} onChange={(val) => setNote(val)}></InputComponent>
							</div>

							<div className="col-4">
								<SelectComponent
									firstRecord={{
										label: "Hoạt động",
										value: "Y",
									}}
									disabled={type === "view"}
									name={"status"}
									title={"Trạng thái"}
									list={[{ value: "N", label: "Không hoạt động" }]}
									bindLabel={"label"}
									bindValue={"value"}
									value={status}
									onChange={(val) => {
										setStatus(val?.value);
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
								<button hidden={type === "view"} onClick={() => onSubmit(formValue)} className="btn btn-primary ml-1" type="button">
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

export default MoneyTypeAction;
