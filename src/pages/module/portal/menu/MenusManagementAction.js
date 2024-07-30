import React, { useEffect, useState } from "react";
import { authUser } from "../../../../helpers/authUtils";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Toast, TypeToast } from "../../../../utils/app.util";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";

const MenusManagementAction = (props) => {
	const { listMenuParent, passEntry, item } = props;
	const [title, setTitle] = useState(props?.title);
	const [listMenu, setListMenu] = useState(props?.listMenu);

	const [loading, setLoading] = useState(false);
	const [newitem, setNewitem] = useState();

	// form
	const [formValue, setFormValue] = useState();
	const [name, setName] = useState();
	const [nameEn, setNameEn] = useState();
	const [icon, setIcon] = useState();
	const [path, setPath] = useState();
	const [parentId, setParentId] = useState();
	const creater = authUser().id;
	const createdDate = new Date();
	const [priority, setPriority] = useState();
	const status = "Y";

	const listIcon = [
		{ label: "remixicon-briefcase-5-line", value: "remixicon-briefcase-5-line" },
		{ label: "remixicon-dashboard-line", value: "remixicon-dashboard-line" },
		{ label: "remixicon-camera-2-fill", value: "remixicon-camera-2-fill" },
		{ label: "remixicon-crop-line", value: "remixicon-crop-line" },
		{ label: "remixicon-customer-service-2-fill", value: "remixicon-customer-service-2-fill" },
		{ label: "fas fa-money-bill-wave", value: "fas fa-money-bill-wave" },
	];

	useEffect(() => {
		if (item) {
			setName(item?.name);
			setNameEn(item?.nameEn);
			setIcon(item?.icon);
			setPath(item?.path);
			setParentId(item?.parentId);
			setPriority(item?.priority);
		}
	}, []);

	// initForm
	useEffect(() => {
		const formValue = {
			name,
			nameEn,
			icon,
			path,
			parentId,
			creater,
			createdDate,
			priority,
			status,
		};

		setFormValue(formValue);
	}, [name, nameEn, icon, path, parentId, priority]);

	const onSubmit = (form) => {
		if (!name || !nameEn || !path) {
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
			createdDate,
			status,
		};
		request
			.post(api.CREATE_MENU, json)
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
		const json = {
			id: item.id,
			...form,
			creater,
			createdDate,
			status,
		};
		request
			.post(api.UPDATE_MENU, json)
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
						<span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật menu" : "Thông tin tạo menu"}</span>
					</div>
					<Form>
						<div className="row">
							<div className="col-4">
								<InputComponent required title={"Tên"} name="name" value={name} onChange={(val) => setName(val)}></InputComponent>
							</div>

							<div className="col-4">
								<InputComponent required title={"Tên tiếng anh"} name="nameEn" value={nameEn} onChange={(val) => setNameEn(val)}></InputComponent>
							</div>

							<div className="col-4">
								<SelectComponent
									firstRecord={{
										label: "Không",
										value: "",
									}}
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
								<InputComponent required title={"Đường dẫn"} name="path" value={path} onChange={(val) => setPath(val)}></InputComponent>
							</div>

							<div className="col-4">
								<SelectComponent
									optionIcon={"value"}
									firstRecord={{
										label: "Không icon",
										value: "",
									}}
									name={"icon"}
									title={"Icon"}
									list={listIcon}
									bindLabel={"label"}
									bindValue={"value"}
									value={icon}
									onChange={(val) => {
										setIcon(val?.value);
									}}></SelectComponent>
							</div>

							<div className="col-4">
								<InputComponent title={"Độ ưu tiên"} name="priority" value={priority} onChange={(val) => setPriority(val)}></InputComponent>
							</div>
						</div>

						<div className="row">
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
export default MenusManagementAction;
